-- Add password_hash columns to admins and judges tables for database authentication

-- Add password_hash column to admins table
ALTER TABLE admins ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add password_hash column to judges table  
ALTER TABLE judges ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_judges_email ON judges(email);
CREATE INDEX IF NOT EXISTS idx_judges_status ON judges(status);

-- Add comments for documentation
COMMENT ON COLUMN admins.password_hash IS 'Hashed password for database authentication (bcrypt)';
COMMENT ON COLUMN judges.password_hash IS 'Hashed password for database authentication (bcrypt)'; 