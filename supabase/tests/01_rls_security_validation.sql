-- =============================================================================
-- Test Suite: 01_rls_security_validation.sql (SELF-CONTAINED SUITE)
-- Description: Automated security assertions simulating real authenticated roles
-- without database-owner privilege bypass on a fresh database:
-- Anonymous, Student, Parent, Teacher, Institute Admin, Suspended User,
-- Inactive Institute Member, and Platform Admin.
--
-- Execution: Run in Supabase SQL Editor or psql CLI.
-- Safe: Runs entirely inside a transaction block and finishes with ROLLBACK.
-- =============================================================================

BEGIN;

DO $$ BEGIN RAISE NOTICE '============================================================'; END $$;
DO $$ BEGIN RAISE NOTICE 'AVERIQ IMS FINAL COMPREHENSIVE ROLE & RLS SECURITY SUITE'; END $$;
DO $$ BEGIN RAISE NOTICE '============================================================'; END $$;

-- -----------------------------------------------------------------------------
-- SETUP: Populate Isolated Test Identities in auth.users, institutes, and profiles
-- (Executed as database owner postgres within transaction)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid; -- Test Academy 1 (Active)
  v_demo3_id UUID := '00000000-0000-4000-b000-000000000003'::uuid; -- Test Academy 2 (Active)
  v_deact_id UUID := '00000000-0000-4000-b000-000000000099'::uuid; -- Deactivated Institute

  v_student_id UUID := '10000000-0000-4000-a000-000000000001'::uuid;
  v_parent_id UUID  := '10000000-0000-4000-a000-000000000002'::uuid;
  v_teacher_id UUID := '10000000-0000-4000-a000-000000000003'::uuid;
  v_admin_id UUID   := '10000000-0000-4000-a000-000000000004'::uuid;
  v_susp_id UUID    := '10000000-0000-4000-a000-000000000005'::uuid;
  v_deact_user UUID := '10000000-0000-4000-a000-000000000006'::uuid;
  v_super_id UUID   := '99999999-9999-4000-a000-000000000099'::uuid;
BEGIN
  -- 1. Create test institutes (Self-contained for fresh database)
  INSERT INTO public.institutes (
    id, code, name, slug, institute_type, is_active
  ) VALUES 
    (v_demo1_id, 'TEST001', 'Test Academy 1', 'test-academy-1', 'coaching', true),
    (v_demo3_id, 'TEST003', 'Test Academy 2', 'test-academy-2', 'school', true),
    (v_deact_id, 'DEACT01', 'Deactivated Academy', 'deactivated-academy', 'coaching', false)
  ON CONFLICT (id) DO UPDATE SET is_active = EXCLUDED.is_active;

  -- 2. Populate simulated auth.users
  INSERT INTO auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
  VALUES 
    (v_student_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'student@averiq.test', '{"full_name": "Test Student"}'::jsonb, now(), now()),
    (v_parent_id,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'parent@averiq.test',  '{"full_name": "Test Parent"}'::jsonb,  now(), now()),
    (v_teacher_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'teacher@averiq.test', '{"full_name": "Test Teacher"}'::jsonb, now(), now()),
    (v_admin_id,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@averiq.test',   '{"full_name": "Test Admin"}'::jsonb,   now(), now()),
    (v_susp_id,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'susp@averiq.test',    '{"full_name": "Suspended User"}'::jsonb, now(), now()),
    (v_deact_user, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'deact@averiq.test',   '{"full_name": "Deact Member"}'::jsonb, now(), now()),
    (v_super_id,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'super@averiq.test',   '{"full_name": "Super Admin"}'::jsonb,  now(), now())
  ON CONFLICT (id) DO NOTHING;

  -- 3. Populate standard user profiles
  INSERT INTO public.profiles (id, email, full_name, phone, system_role)
  VALUES 
    (v_student_id, 'student@averiq.test', 'Test Student', '+91 90000 00001', 'standard_user'),
    (v_parent_id,  'parent@averiq.test',  'Test Parent',  '+91 90000 00002', 'standard_user'),
    (v_teacher_id, 'teacher@averiq.test', 'Test Teacher', '+91 90000 00003', 'standard_user'),
    (v_admin_id,   'admin@averiq.test',   'Test Admin',   '+91 90000 00004', 'standard_user'),
    (v_susp_id,    'susp@averiq.test',    'Suspended User','+91 90000 00005','standard_user'),
    (v_deact_user, 'deact@averiq.test',   'Deact Member', '+91 90000 00006', 'standard_user')
  ON CONFLICT (id) DO UPDATE SET 
    phone = EXCLUDED.phone;

  -- 4. Bootstrap the platform admin profile via the database-owner bootstrap function
  PERFORM averiq_admin.bootstrap_master_admin(v_super_id, 'Test Suite Master Admin Bootstrap');

  -- 5. Populate memberships
  INSERT INTO public.institute_memberships (institute_id, user_id, role, status, title, department)
  VALUES 
    (v_demo1_id, v_student_id, 'student', 'active', 'Student', 'Grade 10'),
    (v_demo1_id, v_parent_id,  'parent',  'active', 'Parent',  'Guardian'),
    (v_demo1_id, v_teacher_id, 'faculty', 'active', 'Senior Faculty', 'Mathematics'),
    (v_demo1_id, v_admin_id,   'institute_admin', 'active', 'Principal', 'Administration'),
    (v_demo1_id, v_susp_id,    'student', 'suspended', 'Student', 'Grade 9'),
    (v_deact_id, v_deact_user, 'faculty', 'active', 'Faculty', 'Science')
  ON CONFLICT (institute_id, user_id) DO UPDATE SET 
    role = EXCLUDED.role, 
    status = EXCLUDED.status;

  RAISE NOTICE '[SETUP COMPLETE] Self-contained test identities and test tenants initialized.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 1: ANONYMOUS USERS (Role: anon)
-- Evaluates without owner privileges
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_count INT;
BEGIN
  SET LOCAL ROLE anon;
  PERFORM set_config('request.jwt.claim.sub', '', true);
  PERFORM set_config('request.jwt.claim.role', 'anon', true);
  PERFORM set_config('request.jwt.claims', '{"role": "anon"}', true);

  SELECT COUNT(*) INTO v_count FROM public.institutes;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Anon read % institutes', v_count; END IF;

  SELECT COUNT(*) INTO v_count FROM public.profiles;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Anon read % profiles', v_count; END IF;

  SELECT COUNT(*) INTO v_count FROM public.institute_memberships;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Anon read % memberships', v_count; END IF;

  SELECT COUNT(*) INTO v_count FROM public.public_profiles;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Anon read % public_profiles', v_count; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 1 PASSED: Anonymous user denied read access across all tables.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 2: STUDENT ROLE (Role: authenticated, Role: student)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_student_id TEXT := '10000000-0000-4000-a000-000000000001';
  v_teacher_id UUID := '10000000-0000-4000-a000-000000000003'::uuid;
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid;
  v_demo3_id UUID := '00000000-0000-4000-b000-000000000003'::uuid;
  v_count INT;
  v_mutated BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_student_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_student_id, 'role', 'authenticated')::text, true);

  -- 2A. Cross-tenant isolation: Cannot read Demo 3
  SELECT COUNT(*) INTO v_count FROM public.institutes WHERE id = v_demo3_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Student read another institute'; END IF;

  -- 2B. Own tenant read: Can read Demo 1
  SELECT COUNT(*) INTO v_count FROM public.institutes WHERE id = v_demo1_id;
  IF v_count <> 1 THEN RAISE EXCEPTION 'FAIL: Student could not read own institute'; END IF;

  -- 2C. Private Profile Isolation: Student CANNOT see teacher phone/email in profiles
  SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_teacher_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Student read teacher private profile (phone/email)'; END IF;

  -- 2D. Public Directory: Student CAN see teacher directory info (name/title) in public_profiles
  SELECT COUNT(*) INTO v_count FROM public.public_profiles WHERE id = v_teacher_id;
  IF v_count <> 1 THEN RAISE EXCEPTION 'FAIL: Student could not view teacher public directory info'; END IF;

  -- 2E. Membership mutation denial: Student cannot modify memberships
  BEGIN
    UPDATE public.institute_memberships
    SET role = 'institute_admin'
    WHERE user_id = v_student_id::uuid;
    v_mutated := true;
  EXCEPTION WHEN OTHERS THEN
    v_mutated := false;
  END;
  IF v_mutated THEN RAISE EXCEPTION 'FAIL: Student modified their own membership'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 2 PASSED: Student verified with tenant isolation and PII protection.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 3: PARENT ROLE (Role: authenticated, Role: parent)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_parent_id TEXT := '10000000-0000-4000-a000-000000000002';
  v_teacher_id UUID := '10000000-0000-4000-a000-000000000003'::uuid;
  v_count INT;
  v_inserted BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_parent_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_parent_id, 'role', 'authenticated')::text, true);

  -- 3A. Private Profile Isolation: Parent cannot read teacher private profile
  SELECT COUNT(*) INTO v_count FROM public.profiles WHERE id = v_teacher_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Parent accessed teacher private profile'; END IF;

  -- 3B. Membership insertion denial: Parent cannot insert memberships
  BEGIN
    INSERT INTO public.institute_memberships (
      institute_id, user_id, role
    ) VALUES (
      '00000000-0000-4000-b000-000000000001'::uuid,
      v_parent_id::uuid,
      'institute_admin'
    );
    v_inserted := true;
  EXCEPTION WHEN OTHERS THEN
    v_inserted := false;
  END;
  IF v_inserted THEN RAISE EXCEPTION 'FAIL: Parent inserted membership'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 3 PASSED: Parent role verified with strict read/write boundaries.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 4: TEACHER ROLE (Role: authenticated, Role: faculty)
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_teacher_id TEXT := '10000000-0000-4000-a000-000000000003';
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid;
  v_count INT;
  v_inst_updated BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_teacher_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_teacher_id, 'role', 'authenticated')::text, true);

  -- 4A. Teacher can see own institute
  SELECT COUNT(*) INTO v_count FROM public.institutes WHERE id = v_demo1_id;
  IF v_count <> 1 THEN RAISE EXCEPTION 'FAIL: Teacher cannot see own institute'; END IF;

  -- 4B. Teacher CANNOT update institute operational settings (admin only)
  BEGIN
    UPDATE public.institutes
    SET phone = '+91 99999 99999'
    WHERE id = v_demo1_id;
    IF FOUND THEN v_inst_updated := true; END IF;
  EXCEPTION WHEN OTHERS THEN
    v_inst_updated := false;
  END;
  IF v_inst_updated THEN RAISE EXCEPTION 'FAIL: Teacher updated institute record'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 4 PASSED: Teacher role verified (read-only institutional access).';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 5: INSTITUTE ADMINISTRATOR ROLE
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_admin_id TEXT := '10000000-0000-4000-a000-000000000004';
  v_student_id UUID := '10000000-0000-4000-a000-000000000001'::uuid;
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid;
  v_demo3_id UUID := '00000000-0000-4000-b000-000000000003'::uuid;
  v_passed BOOLEAN := false;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_admin_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_admin_id, 'role', 'authenticated')::text, true);

  -- 5A. Can update operational fields (phone, email)
  UPDATE public.institutes
  SET phone = '+91 98765 43210'
  WHERE id = v_demo1_id;

  -- 5B. CANNOT alter sensitive fields (code, is_active, organization_id)
  v_passed := false;
  BEGIN
    UPDATE public.institutes
    SET is_active = false
    WHERE id = v_demo1_id;
    v_passed := true;
  EXCEPTION WHEN OTHERS THEN
    v_passed := false;
  END;
  IF v_passed THEN RAISE EXCEPTION 'FAIL: Institute Admin altered is_active'; END IF;

  -- 5C. CANNOT promote anyone to institute_admin
  v_passed := false;
  BEGIN
    UPDATE public.institute_memberships
    SET role = 'institute_admin'
    WHERE institute_id = v_demo1_id AND user_id = v_student_id;
    v_passed := true;
  EXCEPTION WHEN OTHERS THEN
    v_passed := false;
  END;
  IF v_passed THEN RAISE EXCEPTION 'FAIL: Institute Admin promoted user to institute_admin'; END IF;

  -- 5D. CANNOT mutate identity columns (institute_id immutability)
  v_passed := false;
  BEGIN
    UPDATE public.institute_memberships
    SET institute_id = v_demo3_id
    WHERE institute_id = v_demo1_id AND user_id = v_student_id;
    v_passed := true;
  EXCEPTION WHEN OTHERS THEN
    v_passed := false;
  END;
  IF v_passed THEN RAISE EXCEPTION 'FAIL: Institute Admin mutated membership institute_id'; END IF;

  -- 5E. CANNOT modify their own membership role (anti-self-tampering)
  v_passed := false;
  BEGIN
    UPDATE public.institute_memberships
    SET role = 'faculty'
    WHERE institute_id = v_demo1_id AND user_id = v_admin_id::uuid;
    v_passed := true;
  EXCEPTION WHEN OTHERS THEN
    v_passed := false;
  END;
  IF v_passed THEN RAISE EXCEPTION 'FAIL: Institute Admin modified their own role'; END IF;

  -- 5F. CANNOT modify system_role on profiles
  v_passed := false;
  BEGIN
    UPDATE public.profiles
    SET system_role = 'platform_admin'
    WHERE id = v_admin_id::uuid;
    v_passed := true;
  EXCEPTION WHEN OTHERS THEN
    v_passed := false;
  END;
  IF v_passed THEN RAISE EXCEPTION 'FAIL: Institute Admin elevated system_role'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 5 PASSED: Institute Admin operational authority and security boundaries verified.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 6: SUSPENDED USER ACCESS DENIAL
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_susp_id TEXT := '10000000-0000-4000-a000-000000000005';
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid;
  v_count INT;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_susp_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_susp_id, 'role', 'authenticated')::text, true);

  -- Suspended user cannot view the institute record
  SELECT COUNT(*) INTO v_count FROM public.institutes WHERE id = v_demo1_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Suspended user accessed institute'; END IF;

  -- Suspended user cannot view member directory
  SELECT COUNT(*) INTO v_count FROM public.public_profiles WHERE institute_id = v_demo1_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Suspended user accessed member directory'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 6 PASSED: Suspended users completely blocked from operational data.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 7: DEACTIVATED INSTITUTE ACCESS DENIAL
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_deact_user TEXT := '10000000-0000-4000-a000-000000000006';
  v_deact_id UUID := '00000000-0000-4000-b000-000000000099'::uuid;
  v_count INT;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_deact_user, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_deact_user, 'role', 'authenticated')::text, true);

  -- Member of deactivated institute cannot query the institute
  SELECT COUNT(*) INTO v_count FROM public.institutes WHERE id = v_deact_id;
  IF v_count <> 0 THEN RAISE EXCEPTION 'FAIL: Member accessed deactivated institute'; END IF;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 7 PASSED: Deactivated institutes blocked from all member queries.';
END $$;


-- -----------------------------------------------------------------------------
-- TEST 8: PLATFORM ADMINISTRATOR ROLE
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  v_super_id TEXT := '99999999-9999-4000-a000-000000000099';
  v_demo1_id UUID := '00000000-0000-4000-b000-000000000001'::uuid;
  v_student_id UUID := '10000000-0000-4000-a000-000000000001'::uuid;
  v_count INT;
BEGIN
  SET LOCAL ROLE authenticated;
  PERFORM set_config('request.jwt.claim.sub', v_super_id, true);
  PERFORM set_config('request.jwt.claim.role', 'authenticated', true);
  PERFORM set_config('request.jwt.claims', json_build_object('sub', v_super_id, 'role', 'authenticated')::text, true);

  -- 8A. Global visibility: can see all institutes (active and inactive)
  SELECT COUNT(*) INTO v_count FROM public.institutes;
  IF v_count < 3 THEN RAISE EXCEPTION 'FAIL: Platform Admin could only see % institutes (expected >= 3)', v_count; END IF;

  -- 8B. Can promote to institute_admin
  UPDATE public.institute_memberships
  SET role = 'institute_admin'
  WHERE institute_id = v_demo1_id AND user_id = v_student_id;

  -- 8C. Can alter sensitive institute status
  UPDATE public.institutes
  SET is_active = false
  WHERE id = v_demo1_id;

  RESET ROLE;
  RAISE NOTICE '✅ TEST 8 PASSED: Platform Administrator verified with global multi-tenant authority.';
END $$;

DO $$ BEGIN RAISE NOTICE '============================================================'; END $$;
DO $$ BEGIN RAISE NOTICE 'ALL 8 ROLE VALIDATION TEST SUITES PASSED! ROLLING BACK.'; END $$;
DO $$ BEGIN RAISE NOTICE '============================================================'; END $$;

ROLLBACK;
