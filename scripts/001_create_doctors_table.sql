-- Simplified doctors table - removed phone, specialization, license, hospital fields
-- Create minimal doctors table for healthcare professionals
CREATE TABLE IF NOT EXISTS public.doctors (
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
