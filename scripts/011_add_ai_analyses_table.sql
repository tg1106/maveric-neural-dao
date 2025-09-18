-- Add AI analyses table to store AI-generated clinical analyses
CREATE TABLE IF NOT EXISTS ai_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  analysis_text TEXT NOT NULL,
  recommendations TEXT[] DEFAULT '{}',
  confidence_score DECIMAL(3,2) DEFAULT 0.75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for ai_analyses
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

-- Doctors can only see analyses for their patients
CREATE POLICY "Doctors can view their patients' AI analyses" ON ai_analyses
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

-- Doctors can create analyses for their patients
CREATE POLICY "Doctors can create AI analyses for their patients" ON ai_analyses
  FOR INSERT WITH CHECK (
    patient_id IN (
      SELECT id FROM patients WHERE doctor_id = auth.uid()
    )
  );

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_analyses_patient_id ON ai_analyses(patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_created_at ON ai_analyses(created_at DESC);
