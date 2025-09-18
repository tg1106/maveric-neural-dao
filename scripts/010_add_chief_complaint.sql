-- Add chief_complaint column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS chief_complaint TEXT;

-- Update existing patients to have a default chief complaint based on symptoms
UPDATE patients 
SET chief_complaint = COALESCE(
  CASE 
    WHEN symptoms IS NOT NULL AND symptoms != '' THEN symptoms
    ELSE 'General consultation'
  END
)
WHERE chief_complaint IS NULL;
