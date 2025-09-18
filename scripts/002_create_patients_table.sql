-- Simplified patients table - removed complex medical fields, kept only essentials
-- Create minimal patients table linked to doctors
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  symptoms TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table - only doctors can see their own patients
CREATE POLICY "patients_select_own" ON public.patients
  FOR SELECT USING (auth.uid() = doctor_id);

CREATE POLICY "patients_insert_own" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "patients_update_own" ON public.patients
  FOR UPDATE USING (auth.uid() = doctor_id);

CREATE POLICY "patients_delete_own" ON public.patients
  FOR DELETE USING (auth.uid() = doctor_id);
