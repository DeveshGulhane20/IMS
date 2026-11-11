-- =============================================================================
-- Migration: 20261110000001_initial_multitenant_schema.sql (CORRECTED)
-- Description: Core multi-tenant SaaS schema for Averiq Institute Management System.
-- Includes organizations, institutes, profiles, memberships, immutability guards,
-- role governance, sensitive field protections, and resilient auth sync.
-- =============================================================================

-- Enable required cryptographic extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- -----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.user_system_role AS ENUM (
    'platform_admin',
    'standard_user'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.institute_role AS ENUM (
    'institute_admin',
    'faculty',
    'staff',
    'student',
    'parent'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM (
    'active',
    'invited',
    'suspended',
    'archived'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.institute_type AS ENUM (
    'coaching',
    'school',
    'tuition',
    'junior_college',
    'college',
    'other'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.organization_role AS ENUM (
    'owner',
    'admin',
    'member'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- 2. ORGANIZATIONS (Multi-Branch Umbrella Entities)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  billing_email TEXT,
  phone TEXT,
  address TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);

-- Table-level permissions: Organizations are administrative entities
REVOKE ALL ON public.organizations FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.organizations FROM authenticated;
GRANT SELECT ON public.organizations TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. INSTITUTES (Individual Operating Tenants)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  institute_type public.institute_type NOT NULL DEFAULT 'coaching',
  board TEXT,                                    -- 'CBSE', 'ICSE', 'State Board', 'Integrated JEE/NEET'
  subdomain TEXT UNIQUE,                         -- e.g. 'vesu-achievers', 'sunrise-school'
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{
    "academic_year": "2025-26",
    "dual_semester": true,
    "currency": "INR",
    "timezone": "Asia/Kolkata",
    "tier": "standard"
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_institutes_code ON public.institutes(code);
CREATE INDEX IF NOT EXISTS idx_institutes_organization_id ON public.institutes(organization_id);
CREATE INDEX IF NOT EXISTS idx_institutes_subdomain ON public.institutes(subdomain);
CREATE INDEX IF NOT EXISTS idx_institutes_is_active ON public.institutes(is_active);

-- Permissions: Strict table and column-level privileges
REVOKE ALL ON public.institutes FROM anon;
REVOKE ALL ON public.institutes FROM authenticated;
GRANT SELECT ON public.institutes TO authenticated;

-- Explicit permitted operational column-level UPDATE grants (no broad table-level UPDATE)
GRANT UPDATE (
  name,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  settings
) ON public.institutes TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. PROFILES (Linked 1-to-1 with Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,                                    -- Nullable to safely accommodate phone-only signups
  phone TEXT,
  avatar_url TEXT,
  system_role public.user_system_role NOT NULL DEFAULT 'standard_user',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_lower_email 
  ON public.profiles(LOWER(email)) 
  WHERE email IS NOT NULL AND email <> '';

CREATE INDEX IF NOT EXISTS idx_profiles_system_role ON public.profiles(system_role);

-- Permissions: Strict column privileges
REVOKE ALL ON public.profiles FROM anon;
REVOKE INSERT, DELETE ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;
-- Ordinary users can only update personal identity fields, never authorization or system_role
GRANT UPDATE (full_name, phone, avatar_url, metadata) ON public.profiles TO authenticated;
REVOKE UPDATE (id, email, system_role, created_at, updated_at) ON public.profiles FROM authenticated;

-- -----------------------------------------------------------------------------
-- 5. INSTITUTE MEMBERSHIPS (Multi-Tenant Tenant-Scoped Roles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institute_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.institute_role NOT NULL DEFAULT 'student',
  status public.membership_status NOT NULL DEFAULT 'active',
  title TEXT,                                    -- e.g. "Senior Faculty", "Principal"
  department TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT uq_institute_user UNIQUE(institute_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_inst_memberships_institute ON public.institute_memberships(institute_id);
CREATE INDEX IF NOT EXISTS idx_inst_memberships_user ON public.institute_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_inst_memberships_role ON public.institute_memberships(role);
CREATE INDEX IF NOT EXISTS idx_inst_memberships_status ON public.institute_memberships(status);
CREATE INDEX IF NOT EXISTS idx_inst_memberships_lookup ON public.institute_memberships(institute_id, user_id, status);

-- Permissions: Identity fields are strictly immutable
REVOKE ALL ON public.institute_memberships FROM anon;
GRANT SELECT, INSERT, DELETE ON public.institute_memberships TO authenticated;
GRANT UPDATE (role, status, title, department) ON public.institute_memberships TO authenticated;
REVOKE UPDATE (id, institute_id, user_id, joined_at, created_at, updated_at) ON public.institute_memberships FROM authenticated;

-- -----------------------------------------------------------------------------
-- 6. ORGANIZATION MEMBERSHIPS (Group-Level Access for Future Umbrella Owners)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.organization_role NOT NULL DEFAULT 'member',
  status public.membership_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT uq_organization_user UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON public.organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON public.organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_status ON public.organization_memberships(status);

REVOKE ALL ON public.organization_memberships FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.organization_memberships FROM authenticated;
GRANT SELECT ON public.organization_memberships TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. AUTOMATED UPDATED_AT TIMESTAMP TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_updated_at() TO postgres, authenticated;

DROP TRIGGER IF EXISTS trg_organizations_updated_at ON public.organizations;
CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_institutes_updated_at ON public.institutes;
CREATE TRIGGER trg_institutes_updated_at
  BEFORE UPDATE ON public.institutes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_institute_memberships_updated_at ON public.institute_memberships;
CREATE TRIGGER trg_institute_memberships_updated_at
  BEFORE UPDATE ON public.institute_memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_organization_memberships_updated_at ON public.organization_memberships;
CREATE TRIGGER trg_organization_memberships_updated_at
  BEFORE UPDATE ON public.organization_memberships
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 8. IMMUTABILITY TRIGGER: PREVENT REASSIGNING institute_id AND user_id
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_membership_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  -- Prevent tenant hopping or reassigning memberships to different users
  IF NEW.institute_id IS DISTINCT FROM OLD.institute_id THEN
    RAISE EXCEPTION 'Security Violation: institute_id is immutable on memberships.';
  END IF;

  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'Security Violation: user_id is immutable on memberships.';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_membership_immutability() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_membership_immutability() TO postgres, authenticated;

DROP TRIGGER IF EXISTS trg_institute_memberships_immutability ON public.institute_memberships;
CREATE TRIGGER trg_institute_memberships_immutability
  BEFORE UPDATE ON public.institute_memberships
  FOR EACH ROW EXECUTE FUNCTION public.enforce_membership_immutability();

-- -----------------------------------------------------------------------------
-- 9. SENSITIVE INSTITUTE FIELDS PROTECTION TRIGGER
-- Disallows unauthorized mutation of organization_id, is_active, code, slug,
-- and subscription billing keys by institute administrators.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_institute_update_restrictions()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  -- Platform admins have full authority
  IF public.is_platform_admin() THEN
    RETURN NEW;
  END IF;

  -- For non-platform-admins, sensitive attributes are strictly protected:
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Access Denied: Institute ID is immutable.';
  END IF;

  IF NEW.code IS DISTINCT FROM OLD.code THEN
    RAISE EXCEPTION 'Access Denied: Institute code can only be modified by a platform administrator.';
  END IF;

  IF NEW.slug IS DISTINCT FROM OLD.slug THEN
    RAISE EXCEPTION 'Access Denied: Institute slug can only be modified by a platform administrator.';
  END IF;

  IF NEW.organization_id IS DISTINCT FROM OLD.organization_id THEN
    RAISE EXCEPTION 'Access Denied: Organization affiliation can only be modified by a platform administrator.';
  END IF;

  IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Access Denied: Institute activation status can only be altered by a platform administrator.';
  END IF;

  IF NEW.institute_type IS DISTINCT FROM OLD.institute_type THEN
    RAISE EXCEPTION 'Access Denied: Institute type can only be altered by a platform administrator.';
  END IF;

  -- Protect subscription and billing keys in settings JSONB
  IF (NEW.settings->>'tier') IS DISTINCT FROM (OLD.settings->>'tier') OR
     (NEW.settings->>'subscription_status') IS DISTINCT FROM (OLD.settings->>'subscription_status') OR
     (NEW.settings->>'max_students') IS DISTINCT FROM (OLD.settings->>'max_students') THEN
    RAISE EXCEPTION 'Access Denied: Subscription tier and quota settings can only be altered by a platform administrator.';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_institute_update_restrictions() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enforce_institute_update_restrictions() TO postgres, authenticated;

DROP TRIGGER IF EXISTS trg_institutes_update_restrictions ON public.institutes;
CREATE TRIGGER trg_institutes_update_restrictions
  BEFORE UPDATE ON public.institutes
  FOR EACH ROW EXECUTE FUNCTION public.enforce_institute_update_restrictions();

-- -----------------------------------------------------------------------------
-- 10. RESILIENT AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth, pg_temp
AS $$
DECLARE
  v_normalized_email TEXT;
  v_full_name TEXT;
BEGIN
  v_normalized_email := NULLIF(LOWER(TRIM(NEW.email)), '');

  v_full_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(TRIM(split_part(v_normalized_email, '@', 1)), ''),
    NULLIF(TRIM(NEW.phone), ''),
    'New Member'
  );

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    system_role,
    metadata
  )
  VALUES (
    NEW.id,
    v_full_name,
    v_normalized_email,
    NEW.phone,
    'standard_user',
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    full_name = CASE 
      WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = 'New Member' 
      THEN EXCLUDED.full_name 
      ELSE public.profiles.full_name 
    END,
    metadata = public.profiles.metadata || EXCLUDED.metadata,
    updated_at = clock_timestamp();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user trigger encountered an error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
