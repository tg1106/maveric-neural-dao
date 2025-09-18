-- Drop all existing tables and start fresh
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.doctors CASCADE;

-- Create minimal doctors table
CREATE TABLE public.doctors (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create minimal patients table
CREATE TABLE public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors
CREATE POLICY "Doctors can view own profile" ON public.doctors
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Doctors can update own profile" ON public.doctors
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Doctors can view own patients" ON public.patients
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert patients" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own patients" ON public.patients
  FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete own patients" ON public.patients
  FOR DELETE USING (auth.uid() = doctor_id);

-- Create trigger to auto-create doctor profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.doctors (id, username, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
