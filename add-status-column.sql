-- Add status column to judges table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'judges'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE judges ADD COLUMN status VARCHAR(50) DEFAULT 'active';
    END IF;
END $$; 