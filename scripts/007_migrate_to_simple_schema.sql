-- Migration script to simplify existing doctors table
-- This will update the existing complex schema to the minimal one

-- First, drop the existing doctors table and recreate with simple schema
DROP TABLE IF EXISTS public.doctors CASCADE;

-- Create simplified doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors table
CREATE POLICY "doctors_select_own" ON public.doctors
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "doctors_update_own" ON public.doctors
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "doctors_insert_own" ON public.doctors
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "doctors_delete_own" ON public.doctors
  FOR DELETE USING (auth.uid() = id);

-- Also drop and recreate patients table to match simplified schema
DROP TABLE IF EXISTS public.patients CASCADE;

-- Create simplified patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for patients
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table - doctors can only see their own patients
CREATE POLICY "patients_select_own" ON public.patients
  FOR SELECT USING (doctor_id IN (SELECT id FROM public.doctors WHERE auth.uid() = id));

CREATE POLICY "patients_insert_own" ON public.patients
  FOR INSERT WITH CHECK (doctor_id IN (SELECT id FROM public.doctors WHERE auth.uid() = id));

CREATE POLICY "patients_update_own" ON public.patients
  FOR UPDATE USING (doctor_id IN (SELECT id FROM public.doctors WHERE auth.uid() = id));

CREATE POLICY "patients_delete_own" ON public.patients
  FOR DELETE USING (doctor_id IN (SELECT id FROM public.doctors WHERE auth.uid() = id));

-- Insert sample doctors (you'll need to create corresponding auth users first)
-- These are just examples - replace with your actual doctor accounts
INSERT INTO public.doctors (id, username, first_name, last_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'dr.smith', 'John', 'Smith'),
  ('00000000-0000-0000-0000-000000000002', 'dr.johnson', 'Sarah', 'Johnson'),
  ('00000000-0000-0000-0000-000000000003', 'dr.williams', 'Michael', 'Williams')
ON CONFLICT (id) DO NOTHING;
