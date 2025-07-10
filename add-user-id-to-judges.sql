-- Add user_id column back to judges table
-- This creates a relationship between judges and auth.users
-- Making it nullable to handle auth user creation timing issues

DO $$
BEGIN
    -- Add user_id column if it doesn't exist (nullable)
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'judges'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE judges ADD COLUMN user_id UUID NULL;
        RAISE NOTICE 'Added user_id column to judges table (nullable)';
    ELSE
        RAISE NOTICE 'user_id column already exists in judges table';
    END IF;

    -- Remove foreign key constraint if it exists (to avoid timing issues)
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'judges_user_id_fkey'
        AND table_name = 'judges'
    ) THEN
        ALTER TABLE judges DROP CONSTRAINT judges_user_id_fkey;
        RAISE NOTICE 'Removed foreign key constraint judges_user_id_fkey to avoid timing issues';
    END IF;

    -- Remove unique constraint if it exists (allow multiple judges per user if needed)
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'judges_user_id_key'
    ) THEN
        ALTER TABLE judges DROP CONSTRAINT judges_user_id_key;
        RAISE NOTICE 'Removed unique constraint on user_id';
    END IF;

    -- Create index on user_id for faster lookups (if it doesn't exist)
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'judges'
        AND indexname = 'judges_user_id_idx'
    ) THEN
        CREATE INDEX judges_user_id_idx ON judges(user_id);
        RAISE NOTICE 'Created index on user_id';
    ELSE
        RAISE NOTICE 'Index on user_id already exists';
    END IF;

    -- Ensure email is still unique
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'judges_email_key'
    ) THEN
        ALTER TABLE judges ADD CONSTRAINT judges_email_key UNIQUE (email);
        RAISE NOTICE 'Added unique constraint on email';
    ELSE
        RAISE NOTICE 'Unique constraint on email already exists';
    END IF;

END $$; 