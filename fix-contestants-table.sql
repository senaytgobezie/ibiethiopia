-- Check if contestants table exists, if not create it
CREATE TABLE IF NOT EXISTS contestants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  gender TEXT,
  categories TEXT,
  payment_screenshot TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add any missing columns
DO $$
BEGIN
  -- Add user_id column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'user_id') THEN
    ALTER TABLE contestants ADD COLUMN user_id UUID;
  END IF;

  -- Add name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'name') THEN
    ALTER TABLE contestants ADD COLUMN name TEXT;
  END IF;

  -- Add email column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'email') THEN
    ALTER TABLE contestants ADD COLUMN email TEXT;
  END IF;
  
  -- Add phone column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'phone') THEN
    ALTER TABLE contestants ADD COLUMN phone TEXT;
  END IF;
  
  -- Add gender column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'gender') THEN
    ALTER TABLE contestants ADD COLUMN gender TEXT;
  END IF;
  
  -- Add categories column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'categories') THEN
    ALTER TABLE contestants ADD COLUMN categories TEXT;
  END IF;
  
  -- Add payment_screenshot column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'contestants' AND column_name = 'payment_screenshot') THEN
    ALTER TABLE contestants ADD COLUMN payment_screenshot TEXT;
  END IF;
END $$;

-- Create submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contestant_id UUID NOT NULL REFERENCES contestants(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into submissions (for testing)
CREATE POLICY IF NOT EXISTS "Allow all submissions" 
ON submissions FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS contestants_user_id_idx ON contestants(user_id);

-- Add a unique constraint on user_id to prevent duplicates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'contestants_user_id_key'
  ) THEN
    ALTER TABLE contestants ADD CONSTRAINT contestants_user_id_key UNIQUE (user_id);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$; 