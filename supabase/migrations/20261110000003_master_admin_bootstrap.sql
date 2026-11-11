-- =============================================================================
-- Migration: 20261110000003_master_admin_bootstrap.sql (PRODUCTION REVISED)
-- Description: One-time, database-owner-controlled setup for Averiq Master Admin.
--
-- SECURITY PRINCIPLES:
-- 1. NOT exposed through PostgREST client RPC (placed in isolated schema averiq_admin).
-- 2. Callable ONLY by the database owner (postgres role) via Supabase SQL Editor.
-- 3. Verifies target user exists in auth.users before assignment.
-- 4. Records tamper-proof audit log in public.admin_audit_logs.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. AUDIT LOG TABLE FOR ADMINISTRATIVE ACTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  target_user_id UUID NOT NULL,
  performed_by TEXT NOT NULL,
  ip_address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admin can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Platform admin can view audit logs"
  ON public.admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_platform_admin());

DROP POLICY IF EXISTS "Deny all client modifications to audit logs" ON public.admin_audit_logs;
CREATE POLICY "Deny all client modifications to audit logs"
  ON public.admin_audit_logs
  FOR ALL
  TO public
  USING (false)
  WITH CHECK (false);

-- -----------------------------------------------------------------------------
-- 2. PRIVATE ADMINISTRATIVE SCHEMA (NOT EXPOSED VIA POSTGREST CLIENT RPC)
-- -----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS averiq_admin;
REVOKE ALL ON SCHEMA averiq_admin FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA averiq_admin TO postgres;

-- -----------------------------------------------------------------------------
-- 3. DATABASE-OWNER BOOTSTRAP FUNCTION
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION averiq_admin.bootstrap_master_admin(
  target_user_id UUID,
  operator_note TEXT DEFAULT 'Initial Averiq Platform Master Admin Setup'
)
RETURNS TABLE (
  success BOOLEAN,
  user_id UUID,
  email TEXT,
  system_role public.user_system_role,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $$
DECLARE
  v_user_email TEXT;
  v_current_role public.user_system_role;
BEGIN
  -- 0. Strictly enforce database-owner execution (cannot be invoked by standard clients)
  IF session_user <> 'postgres' THEN
    RAISE EXCEPTION 'Access Denied: bootstrap_master_admin may only be executed by the database owner.';
  END IF;

  -- 1. Validate target_user_id exists in auth.users
  SELECT u.email INTO v_user_email
  FROM auth.users u
  WHERE u.id = target_user_id;

  IF v_user_email IS NULL THEN
    RETURN QUERY SELECT 
      false, 
      target_user_id, 
      NULL::TEXT, 
      NULL::public.user_system_role, 
      'FAILED: target_user_id does not exist in auth.users. The user must register first via Supabase Auth.'::TEXT;
    RETURN;
  END IF;

  -- 2. Temporarily disable the role-integrity trigger for this operator bootstrap
  ALTER TABLE public.profiles DISABLE TRIGGER trg_profile_role_integrity;

  -- 3. Upsert profile with platform_admin role
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      system_role
    ) VALUES (
      target_user_id,
      v_user_email,
      'Averiq Master Admin',
      'platform_admin'
    )
    ON CONFLICT (id) DO UPDATE SET
      system_role = 'platform_admin',
      updated_at = clock_timestamp();

    ALTER TABLE public.profiles ENABLE TRIGGER trg_profile_role_integrity;
  EXCEPTION WHEN OTHERS THEN
    ALTER TABLE public.profiles ENABLE TRIGGER trg_profile_role_integrity;
    RAISE;
  END;

  -- 4. Retrieve verified role
  SELECT p.system_role INTO v_current_role
  FROM public.profiles p
  WHERE p.id = target_user_id;

  -- 5. Record tamper-proof audit log
  INSERT INTO public.admin_audit_logs (
    action,
    target_user_id,
    performed_by,
    metadata
  ) VALUES (
    'MASTER_ADMIN_BOOTSTRAP',
    target_user_id,
    'SUPABASE_SQL_EDITOR_DBA',
    jsonb_build_object(
      'target_email', v_user_email,
      'assigned_role', v_current_role,
      'note', operator_note,
      'timestamp', clock_timestamp()
    )
  );

  RETURN QUERY SELECT 
    true, 
    target_user_id, 
    v_user_email, 
    v_current_role, 
    'SUCCESS: User elevated to Averiq Platform Master Admin.'::TEXT;
END;
$$;

-- Strict execution permissions: ONLY postgres (database owner)
REVOKE ALL ON FUNCTION averiq_admin.bootstrap_master_admin(UUID, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION averiq_admin.bootstrap_master_admin(UUID, TEXT) FROM anon;
REVOKE ALL ON FUNCTION averiq_admin.bootstrap_master_admin(UUID, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION averiq_admin.bootstrap_master_admin(UUID, TEXT) TO postgres;

-- Drop legacy public function if it exists from previous attempts
DROP FUNCTION IF EXISTS public.bootstrap_master_admin(UUID, TEXT);
