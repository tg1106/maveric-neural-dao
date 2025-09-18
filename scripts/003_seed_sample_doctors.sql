-- Simplified seeding script with just username and basic info
-- Insert sample doctors (run after creating auth users)
INSERT INTO public.doctors (id, username, first_name, last_name)
SELECT 
  au.id,
  'dr_' || LOWER(REPLACE(au.email, '@', '_')),
  SPLIT_PART(au.raw_user_meta_data->>'full_name', ' ', 1),
  SPLIT_PART(au.raw_user_meta_data->>'full_name', ' ', 2)
FROM auth.users au
WHERE au.email LIKE '%@hospital.com'
ON CONFLICT (username) DO NOTHING;

-- Insert sample patients for testing
INSERT INTO public.patients (doctor_id, first_name, last_name, age, gender, symptoms, notes)
SELECT 
  d.id,
  'John',
  'Doe',
  45,
  'male',
  'Chest pain, shortness of breath',
  'Patient reports symptoms started 2 days ago'
FROM public.doctors d
LIMIT 1;
