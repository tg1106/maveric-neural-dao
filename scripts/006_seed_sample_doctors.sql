-- Seed sample doctors for testing
-- IMPORTANT: This script requires you to first create auth users through Supabase Auth Admin

-- Step 1: Create auth users first (do this in Supabase Auth Admin panel):
-- Email: sarah.johnson@hospital.com, Password: TempPass123!
-- Email: michael.chen@hospital.com, Password: TempPass123!
-- Email: emily.rodriguez@hospital.com, Password: TempPass123!

-- Step 2: After creating auth users, get their UUIDs and replace the placeholders below
-- You can find the UUIDs in Authentication > Users in your Supabase dashboard

-- Updated to use proper approach with instructions for manual auth user creation
-- Example INSERT (replace UUIDs with actual ones from auth.users):
/*
INSERT INTO public.doctors (id, first_name, last_name, email, specialization, license_number, hospital_affiliation)
VALUES 
  ('REPLACE-WITH-ACTUAL-UUID-1', 'Dr. Sarah', 'Johnson', 'sarah.johnson@hospital.com', 'Cardiology', 'MD001', 'General Hospital'),
  ('REPLACE-WITH-ACTUAL-UUID-2', 'Dr. Michael', 'Chen', 'michael.chen@hospital.com', 'Emergency Medicine', 'MD002', 'City Medical Center'),
  ('REPLACE-WITH-ACTUAL-UUID-3', 'Dr. Emily', 'Rodriguez', 'emily.rodriguez@hospital.com', 'Internal Medicine', 'MD003', 'Regional Health System')
ON CONFLICT (id) DO NOTHING;
*/

-- Alternative: Use this query to insert doctors after auth users exist
-- This will work if you've created the auth users with the emails above
INSERT INTO public.doctors (id, first_name, last_name, email, specialization, license_number, hospital_affiliation)
SELECT 
  au.id,
  CASE 
    WHEN au.email = 'sarah.johnson@hospital.com' THEN 'Dr. Sarah'
    WHEN au.email = 'michael.chen@hospital.com' THEN 'Dr. Michael'
    WHEN au.email = 'emily.rodriguez@hospital.com' THEN 'Dr. Emily'
  END as first_name,
  CASE 
    WHEN au.email = 'sarah.johnson@hospital.com' THEN 'Johnson'
    WHEN au.email = 'michael.chen@hospital.com' THEN 'Chen'
    WHEN au.email = 'emily.rodriguez@hospital.com' THEN 'Rodriguez'
  END as last_name,
  au.email,
  CASE 
    WHEN au.email = 'sarah.johnson@hospital.com' THEN 'Cardiology'
    WHEN au.email = 'michael.chen@hospital.com' THEN 'Emergency Medicine'
    WHEN au.email = 'emily.rodriguez@hospital.com' THEN 'Internal Medicine'
  END as specialization,
  CASE 
    WHEN au.email = 'sarah.johnson@hospital.com' THEN 'MD001'
    WHEN au.email = 'michael.chen@hospital.com' THEN 'MD002'
    WHEN au.email = 'emily.rodriguez@hospital.com' THEN 'MD003'
  END as license_number,
  CASE 
    WHEN au.email = 'sarah.johnson@hospital.com' THEN 'General Hospital'
    WHEN au.email = 'michael.chen@hospital.com' THEN 'City Medical Center'
    WHEN au.email = 'emily.rodriguez@hospital.com' THEN 'Regional Health System'
  END as hospital_affiliation
FROM auth.users au
WHERE au.email IN (
  'sarah.johnson@hospital.com',
  'michael.chen@hospital.com', 
  'emily.rodriguez@hospital.com'
)
ON CONFLICT (id) DO NOTHING;
