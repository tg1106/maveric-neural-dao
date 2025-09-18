-- Create trigger to automatically create doctor profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_doctor()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.doctors (id, first_name, last_name, email, specialization, license_number, hospital_affiliation)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'specialization', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'license_number', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'hospital_affiliation', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_doctor();
