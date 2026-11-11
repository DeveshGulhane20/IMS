-- =============================================================================
-- Migration: 20261110000002_row_level_security.sql (CORRECTED)
-- Description: Comprehensive PostgreSQL Row-Level Security (RLS) policies,
-- hardened security helper functions, verified execution privilege checks,
-- membership role governance, private profile protections, and inactive tenant blocks.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- All helpers execute with security definer and explicit search_path = pg_catalog, public, pg_temp
-- to prevent search_path hijacking and eliminate recursive policy evaluation.
-- Authorization decisions are strictly derived from auth.uid() / auth.jwt() and database state,
-- NEVER from current_user inside SECURITY DEFINER contexts.
-- -----------------------------------------------------------------------------

-- Checks if the authenticated user is an Averiq Platform Super Admin or backend service_role
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'role' = 'service_role')
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND system_role = 'platform_admin'
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_platform_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated, service_role;

-- Checks if user has owner or admin rights in an umbrella organization (Read/Reporting only)
CREATE OR REPLACE FUNCTION public.is_organization_admin(check_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.is_platform_admin() OR EXISTS (
    SELECT 1
    FROM public.organization_memberships
    WHERE organization_id = check_org_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
$$;

REVOKE ALL ON FUNCTION public.is_organization_admin(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_organization_admin(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_organization_admin(UUID) TO authenticated, service_role;

-- Checks if user is an active administrator of an active institute
CREATE OR REPLACE FUNCTION public.is_institute_admin(check_institute_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.is_platform_admin() OR EXISTS (
    SELECT 1
    FROM public.institute_memberships im
    JOIN public.institutes i ON i.id = im.institute_id
    WHERE im.institute_id = check_institute_id
      AND im.user_id = auth.uid()
      AND im.role = 'institute_admin'
      AND im.status = 'active'
      AND i.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_institute_admin(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_institute_admin(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_institute_admin(UUID) TO authenticated, service_role;

-- Checks if user is an active administrator or staff member of an active institute
CREATE OR REPLACE FUNCTION public.is_institute_staff_or_admin(check_institute_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.is_platform_admin() OR EXISTS (
    SELECT 1
    FROM public.institute_memberships im
    JOIN public.institutes i ON i.id = im.institute_id
    WHERE im.institute_id = check_institute_id
      AND im.user_id = auth.uid()
      AND im.role IN ('institute_admin', 'staff')
      AND im.status = 'active'
      AND i.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_institute_staff_or_admin(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_institute_staff_or_admin(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_institute_staff_or_admin(UUID) TO authenticated, service_role;

-- Checks if user has an active membership role in an active target institute
CREATE OR REPLACE FUNCTION public.has_active_institute_membership(check_institute_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT public.is_platform_admin() OR EXISTS (
    SELECT 1
    FROM public.institute_memberships im
    JOIN public.institutes i ON i.id = im.institute_id
    WHERE im.institute_id = check_institute_id
      AND im.user_id = auth.uid()
      AND im.status = 'active'
      AND i.is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.has_active_institute_membership(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_active_institute_membership(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_active_institute_membership(UUID) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 2. ANTI-PRIVILEGE ESCALATION TRIGGER FOR PROFILES
-- Strictly prevents ordinary client self-promotion or unauthorized role changes.
-- Any change or assignment of platform_admin role requires verified platform_admin authority.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_profile_role_integrity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  -- Intercept any attempt to elevate or modify system_role
  IF (TG_OP = 'INSERT' AND NEW.system_role = 'platform_admin') OR
     (TG_OP = 'UPDATE' AND NEW.system_role IS DISTINCT FROM OLD.system_role) THEN

    -- Strictly require verified platform_admin privileges
    IF NOT public.is_platform_admin() THEN
      RAISE EXCEPTION 'Access Denied: Privilege escalation attempt. Modifying system_role requires platform_admin privileges.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_profile_role_integrity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_profile_role_integrity() TO postgres, authenticated;

DROP TRIGGER IF EXISTS trg_profile_role_integrity ON public.profiles;
CREATE TRIGGER trg_profile_role_integrity
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_role_integrity();

-- -----------------------------------------------------------------------------
-- 3. MEMBERSHIP ROLE GOVERNANCE TRIGGER
-- Prevents self-tampering and unauthorized promotion to institute_admin.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_membership_role_restrictions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  -- Platform admins have full authorized management
  IF public.is_platform_admin() THEN
    RETURN NEW;
  END IF;

  -- 1. Anti-self-tampering: Members cannot alter their own role or status
  IF TG_OP = 'UPDATE' AND OLD.user_id = auth.uid() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Access Denied: You cannot modify your own membership role.';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      RAISE EXCEPTION 'Access Denied: You cannot modify your own membership status.';
    END IF;
  END IF;

  -- 2. Anti-elevation: Institute admins cannot assign the institute_admin role to anyone
  IF NEW.role = 'institute_admin' THEN
    RAISE EXCEPTION 'Access Denied: Institute administrators cannot assign the institute_admin role. Platform administrator authorization is required.';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_membership_role_restrictions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_membership_role_restrictions() TO postgres, authenticated;

DROP TRIGGER IF EXISTS trg_institute_memberships_role_governance ON public.institute_memberships;
CREATE TRIGGER trg_institute_memberships_role_governance
  BEFORE INSERT OR UPDATE ON public.institute_memberships
  FOR EACH ROW EXECUTE FUNCTION public.enforce_membership_role_restrictions();

-- -----------------------------------------------------------------------------
-- 4. ENABLE AND FORCE ROW-LEVEL SECURITY
-- -----------------------------------------------------------------------------
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;

ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes FORCE ROW LEVEL SECURITY;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

ALTER TABLE public.institute_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institute_memberships FORCE ROW LEVEL SECURITY;

ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_memberships FORCE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 5. POLICIES: ORGANIZATIONS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "organizations_select" ON public.organizations;
CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT
  TO authenticated
  USING (
    public.is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.organization_memberships
      WHERE organization_id = public.organizations.id
        AND user_id = auth.uid()
        AND status = 'active'
    )
  );

DROP POLICY IF EXISTS "organizations_insert" ON public.organizations;
CREATE POLICY "organizations_insert" ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "organizations_update" ON public.organizations;
CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "organizations_delete" ON public.organizations;
CREATE POLICY "organizations_delete" ON public.organizations
  FOR DELETE
  TO authenticated
  USING (public.is_platform_admin());

-- -----------------------------------------------------------------------------
-- 6. POLICIES: INSTITUTES
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "institutes_select" ON public.institutes;
CREATE POLICY "institutes_select" ON public.institutes
  FOR SELECT
  TO authenticated
  USING (
    public.is_platform_admin()
    OR (
      is_active = true 
      AND public.has_active_institute_membership(id)
    )
  );

DROP POLICY IF EXISTS "institutes_insert" ON public.institutes;
CREATE POLICY "institutes_insert" ON public.institutes
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "institutes_update" ON public.institutes;
CREATE POLICY "institutes_update" ON public.institutes
  FOR UPDATE
  TO authenticated
  USING (
    public.is_platform_admin() 
    OR (is_active = true AND public.is_institute_admin(id))
  )
  WITH CHECK (
    public.is_platform_admin() 
    OR (is_active = true AND public.is_institute_admin(id))
  );

DROP POLICY IF EXISTS "institutes_delete" ON public.institutes;
CREATE POLICY "institutes_delete" ON public.institutes
  FOR DELETE
  TO authenticated
  USING (public.is_platform_admin());

-- -----------------------------------------------------------------------------
-- 7. POLICIES: PROFILES (PRIVATE PROFILE PROTECTION)
-- Direct access to raw profiles (emails, phones, metadata) is strictly isolated.
-- Students, parents and general users can only see their own profile row.
-- Institute Admins / Staff can see contact details of active members in their institute.
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    public.is_platform_admin()
    OR id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.institute_memberships target_im
      JOIN public.institutes i ON i.id = target_im.institute_id
      WHERE target_im.user_id = public.profiles.id
        AND target_im.status = 'active'
        AND i.is_active = true
        AND public.is_institute_staff_or_admin(target_im.institute_id)
    )
  );

DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid()
    AND system_role = 'standard_user'
  );

DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (id = auth.uid() OR public.is_platform_admin());

DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
CREATE POLICY "profiles_delete" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_platform_admin());

-- -----------------------------------------------------------------------------
-- 8. SECURE PUBLIC PROFILE DIRECTORY VIEW
-- Exposes safe non-sensitive attributes for student/faculty directories without
-- leaking personal phone numbers, emails, or system metadata to peers.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_profiles
AS
SELECT
  p.id,
  p.full_name,
  p.avatar_url,
  im.institute_id,
  im.role AS institute_role,
  im.title,
  im.department
FROM public.profiles p
JOIN public.institute_memberships im ON im.user_id = p.id
JOIN public.institutes i ON i.id = im.institute_id
WHERE i.is_active = true
  AND im.status = 'active'
  AND (
    public.is_platform_admin()
    OR public.has_active_institute_membership(im.institute_id)
  );

REVOKE ALL ON public.public_profiles FROM PUBLIC, anon;
GRANT SELECT ON public.public_profiles TO authenticated;

-- -----------------------------------------------------------------------------
-- 9. POLICIES: INSTITUTE MEMBERSHIPS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "institute_memberships_select" ON public.institute_memberships;
CREATE POLICY "institute_memberships_select" ON public.institute_memberships
  FOR SELECT
  TO authenticated
  USING (
    public.is_platform_admin()
    OR user_id = auth.uid()
    OR public.is_institute_admin(institute_id)
    OR (
      public.has_active_institute_membership(institute_id)
      AND role IN ('faculty', 'staff')
    )
  );

DROP POLICY IF EXISTS "institute_memberships_insert" ON public.institute_memberships;
CREATE POLICY "institute_memberships_insert" ON public.institute_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_platform_admin()
    OR (
      public.is_institute_admin(institute_id)
      AND role IN ('faculty', 'staff', 'student', 'parent')
    )
  );

DROP POLICY IF EXISTS "institute_memberships_update" ON public.institute_memberships;
CREATE POLICY "institute_memberships_update" ON public.institute_memberships
  FOR UPDATE
  TO authenticated
  USING (
    public.is_platform_admin()
    OR (
      public.is_institute_admin(institute_id)
      AND user_id <> auth.uid()
    )
  )
  WITH CHECK (
    public.is_platform_admin()
    OR (
      public.is_institute_admin(institute_id)
      AND user_id <> auth.uid()
      AND role IN ('faculty', 'staff', 'student', 'parent')
    )
  );

DROP POLICY IF EXISTS "institute_memberships_delete" ON public.institute_memberships;
CREATE POLICY "institute_memberships_delete" ON public.institute_memberships
  FOR DELETE
  TO authenticated
  USING (
    public.is_platform_admin()
    OR (
      public.is_institute_admin(institute_id)
      AND user_id <> auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- 10. POLICIES: ORGANIZATION MEMBERSHIPS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "organization_memberships_select" ON public.organization_memberships;
CREATE POLICY "organization_memberships_select" ON public.organization_memberships
  FOR SELECT
  TO authenticated
  USING (
    public.is_platform_admin()
    OR (user_id = auth.uid() AND status = 'active')
  );

DROP POLICY IF EXISTS "organization_memberships_insert" ON public.organization_memberships;
CREATE POLICY "organization_memberships_insert" ON public.organization_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "organization_memberships_update" ON public.organization_memberships;
CREATE POLICY "organization_memberships_update" ON public.organization_memberships
  FOR UPDATE
  TO authenticated
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

DROP POLICY IF EXISTS "organization_memberships_delete" ON public.organization_memberships;
CREATE POLICY "organization_memberships_delete" ON public.organization_memberships
  FOR DELETE
  TO authenticated
  USING (public.is_platform_admin());
