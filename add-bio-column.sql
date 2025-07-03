-- Function to check if a column exists in a table
CREATE OR REPLACE FUNCTION check_column_exists(table_name text, column_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1
    AND column_name = $2
  );
END;
$$;

-- Function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
  table_name text,
  column_name text,
  column_type text
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = $1
    AND column_name = $2
  ) THEN
    EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', 
                  $1, $2, $3);
  END IF;
END;
$$;

-- Add bio column to contestants table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'contestants' 
    AND column_name = 'bio'
  ) THEN
    ALTER TABLE contestants ADD COLUMN bio TEXT;
  END IF;
END $$; 