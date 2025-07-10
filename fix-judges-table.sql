-- Fix the judges table to remove the foreign key constraint
-- This allows us to create judges without requiring a user_id from auth.users

-- First, check if the table exists
DO $$
BEGIN
    -- Drop the foreign key constraint if it exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'judges_user_id_fkey'
        AND table_name = 'judges'
    ) THEN
        ALTER TABLE judges DROP CONSTRAINT judges_user_id_fkey;
        RAISE NOTICE 'Dropped foreign key constraint judges_user_id_fkey';
    END IF;

    -- Drop the user_id column if it exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'judges'
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE judges DROP COLUMN IF EXISTS user_id;
        RAISE NOTICE 'Dropped user_id column';
    END IF;

    -- Make sure the id column is UUID and primary key
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'judges'
        AND column_name = 'id'
        AND data_type = 'uuid'
    ) THEN
        -- If id column doesn't exist as UUID, add it
        ALTER TABLE judges ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT uuid_generate_v4();
        RAISE NOTICE 'Added id column as UUID primary key';
    END IF;

    -- Make sure the status column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'judges'
        AND column_name = 'status'
    ) THEN
        ALTER TABLE judges ADD COLUMN status VARCHAR(50) DEFAULT 'active';
        RAISE NOTICE 'Added status column';
    END IF;

    -- Make sure email is unique
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'judges_email_key'
    ) THEN
        ALTER TABLE judges ADD CONSTRAINT judges_email_key UNIQUE (email);
        RAISE NOTICE 'Added unique constraint on email';
    END IF;

END $$; 