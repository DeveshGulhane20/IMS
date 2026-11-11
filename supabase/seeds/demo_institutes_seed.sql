-- =============================================================================
-- Averiq IMS: Demo Institutes Seed (OPTIONAL / DEVELOPMENT ONLY)
-- File: supabase/seeds/demo_institutes_seed.sql
--
-- EXCLUDED FROM PRODUCTION FRESH INSTALLATION.
-- Use this script ONLY if you wish to populate the five demonstration institute
-- records and umbrella organization into an environment for testing or demo purposes.
--
-- Prerequisites:
-- 1. Migration 20261110000001_initial_multitenant_schema.sql executed
-- 2. Migration 20261110000002_row_level_security.sql executed
-- 3. Migration 20261110000003_master_admin_bootstrap.sql executed
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. UMBRELLA ORGANIZATION FOR A.V ACHIEVERS GROUP
-- -----------------------------------------------------------------------------
INSERT INTO public.organizations (
  id,
  name,
  slug,
  billing_email,
  phone,
  address,
  metadata
)
VALUES (
  '00000000-0000-4000-a000-000000000001'::uuid,
  'A.V Achievers Educational Group',
  'av-achievers-group',
  'accounts@avachievers.edu',
  '+91 98765 00000',
  'Corporate Head Office, Vesu Main Road, Surat, Gujarat',
  '{"tier": "enterprise_network", "max_branches": 10}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  billing_email = EXCLUDED.billing_email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  updated_at = clock_timestamp();

-- -----------------------------------------------------------------------------
-- 2. FIVE DEMO INSTITUTES (IDEMPOTENT INSERT / UPSERT)
-- -----------------------------------------------------------------------------

-- DEMO001: A.V Achievers – Vesu (Coaching, linked to Org 00000000-0000-4000-a000-000000000001)
INSERT INTO public.institutes (
  id,
  organization_id,
  code,
  name,
  slug,
  institute_type,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  is_active,
  settings
)
VALUES (
  '00000000-0000-4000-b000-000000000001'::uuid,
  '00000000-0000-4000-a000-000000000001'::uuid,
  'DEMO001',
  'A.V Achievers – Vesu',
  'av-achievers-vesu',
  'coaching',
  'CBSE',
  'vesu-achievers',
  'vesu@avachievers.edu',
  '+91 98765 11001',
  'Shop 201-205, Milestone Sky, VIP Road, Vesu',
  'Surat',
  'Gujarat',
  '/assets/aistudio/WhatsApp_Image_2026-10-28_at_9.50.44_PM__1__a1189775.jpeg',
  true,
  '{
    "branch_code": "VESU-01",
    "curriculum_focus": "JEE / NEET / 10th Boards",
    "dual_semester": true,
    "current_cohort_size": 50
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  board = EXCLUDED.board,
  subdomain = EXCLUDED.subdomain,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  settings = EXCLUDED.settings,
  updated_at = clock_timestamp();

-- DEMO002: A.V Achievers – Bhestan (Coaching, linked to same Org as separate tenant)
INSERT INTO public.institutes (
  id,
  organization_id,
  code,
  name,
  slug,
  institute_type,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  is_active,
  settings
)
VALUES (
  '00000000-0000-4000-b000-000000000002'::uuid,
  '00000000-0000-4000-a000-000000000001'::uuid,
  'DEMO002',
  'A.V Achievers – Bhestan',
  'av-achievers-bhestan',
  'coaching',
  'State Board',
  'bhestan-achievers',
  'bhestan@avachievers.edu',
  '+91 98765 11002',
  'Plot 12-14, Diamond Hub Plaza, Bhestan Cross Road',
  'Surat',
  'Gujarat',
  '/assets/aistudio/WhatsApp_Image_2026-10-28_at_9.50.44_PM__1__a1189775.jpeg',
  true,
  '{
    "branch_code": "BHESTAN-02",
    "curriculum_focus": "GSEB / Olympiad / Science Streams",
    "dual_semester": true,
    "current_cohort_size": 35
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  board = EXCLUDED.board,
  subdomain = EXCLUDED.subdomain,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  settings = EXCLUDED.settings,
  updated_at = clock_timestamp();

-- DEMO003: Sunrise International School (School, standalone tenant)
INSERT INTO public.institutes (
  id,
  organization_id,
  code,
  name,
  slug,
  institute_type,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  is_active,
  settings
)
VALUES (
  '00000000-0000-4000-b000-000000000003'::uuid,
  NULL,
  'DEMO003',
  'Sunrise International School',
  'sunrise-international-school',
  'school',
  'IB International',
  'sunrise-school',
  'admissions@sunriseschool.edu',
  '+91 98250 10000',
  '12 Knowledge Corridor, SG Highway, Bodakdev',
  'Ahmedabad',
  'Gujarat',
  NULL,
  true,
  '{
    "school_category": "K-12",
    "accreditation": "IB World School",
    "dual_semester": true,
    "current_cohort_size": 120
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  board = EXCLUDED.board,
  subdomain = EXCLUDED.subdomain,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  settings = EXCLUDED.settings,
  updated_at = clock_timestamp();

-- DEMO004: Bright Future Academy (Tuition / Coaching, standalone tenant)
INSERT INTO public.institutes (
  id,
  organization_id,
  code,
  name,
  slug,
  institute_type,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  is_active,
  settings
)
VALUES (
  '00000000-0000-4000-b000-000000000004'::uuid,
  NULL,
  'DEMO004',
  'Bright Future Academy',
  'bright-future-academy',
  'tuition',
  'ICSE',
  'bright-future',
  'info@brightfutureacademy.edu',
  '+91 98230 45678',
  'Plot 42, Silicon Square, Kothrud',
  'Pune',
  'Maharashtra',
  NULL,
  true,
  '{
    "focus": "Secondary ICSE & Foundation Prep",
    "dual_semester": true,
    "current_cohort_size": 42
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  board = EXCLUDED.board,
  subdomain = EXCLUDED.subdomain,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  settings = EXCLUDED.settings,
  updated_at = clock_timestamp();

-- DEMO005: Excellence Junior College (Junior College, standalone tenant)
INSERT INTO public.institutes (
  id,
  organization_id,
  code,
  name,
  slug,
  institute_type,
  board,
  subdomain,
  email,
  phone,
  address,
  city,
  state,
  logo_url,
  is_active,
  settings
)
VALUES (
  '00000000-0000-4000-b000-000000000005'::uuid,
  NULL,
  'DEMO005',
  'Excellence Junior College',
  'excellence-junior-college',
  'junior_college',
  'State Board',
  'excellence-jc',
  'principal@excellencejc.edu',
  '+91 98490 88200',
  'Road No. 36, Jubilee Hills',
  'Hyderabad',
  'Telangana',
  NULL,
  true,
  '{
    "college_type": "Intermediate MPC & BiPC",
    "dual_semester": true,
    "current_cohort_size": 85
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  board = EXCLUDED.board,
  subdomain = EXCLUDED.subdomain,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  address = EXCLUDED.address,
  city = EXCLUDED.city,
  state = EXCLUDED.state,
  settings = EXCLUDED.settings,
  updated_at = clock_timestamp();
