-- Add ratings column to submissions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'submissions' 
    AND column_name = 'rating'
  ) THEN
    ALTER TABLE submissions ADD COLUMN rating NUMERIC(3,1);
    ALTER TABLE submissions ADD COLUMN feedback TEXT;
  END IF;
END $$;

-- Add comments column to submissions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'submissions' 
    AND column_name = 'judge_comments'
  ) THEN
    ALTER TABLE submissions ADD COLUMN judge_comments TEXT;
  END IF;
END $$; 