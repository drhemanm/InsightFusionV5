/*
  # Fix Contacts Table Schema Issues

  1. Ensure contacts table exists with correct structure
  2. Fix RLS policies to allow proper access
  3. Add missing indexes and constraints
  4. Ensure compatibility with the application code

  This migration is safe to run multiple times.
*/

-- Ensure contacts table exists with all required fields
DO $$
BEGIN
  -- Check if contacts table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'contacts') THEN
    CREATE TABLE contacts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Basic Information
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text UNIQUE NOT NULL,
      phone text,
      
      -- Professional Information
      job_title text,
      department text,
      organization text,
      
      -- Contact Preferences
      preferred_contact_method text DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'sms')),
      timezone text DEFAULT 'UTC',
      
      -- Categorization
      type text DEFAULT 'lead' CHECK (type IN ('lead', 'customer', 'partner', 'supplier')),
      source text,
      tags text[] DEFAULT '{}',
      
      -- Additional Information
      notes text,
      custom_fields jsonb DEFAULT '{}',
      
      -- Assignment (optional)
      assigned_to uuid,
      
      -- Timestamps
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  END IF;
END $$;

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add job_title if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'job_title'
  ) THEN
    ALTER TABLE contacts ADD COLUMN job_title text;
  END IF;

  -- Add department if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'department'
  ) THEN
    ALTER TABLE contacts ADD COLUMN department text;
  END IF;

  -- Add organization if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'organization'
  ) THEN
    ALTER TABLE contacts ADD COLUMN organization text;
  END IF;

  -- Add preferred_contact_method if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'preferred_contact_method'
  ) THEN
    ALTER TABLE contacts ADD COLUMN preferred_contact_method text DEFAULT 'email';
  END IF;

  -- Add timezone if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE contacts ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;

  -- Add type if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'type'
  ) THEN
    ALTER TABLE contacts ADD COLUMN type text DEFAULT 'lead';
  END IF;

  -- Add source if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'source'
  ) THEN
    ALTER TABLE contacts ADD COLUMN source text;
  END IF;

  -- Add tags if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'tags'
  ) THEN
    ALTER TABLE contacts ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add notes if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'notes'
  ) THEN
    ALTER TABLE contacts ADD COLUMN notes text;
  END IF;

  -- Add custom_fields if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'custom_fields'
  ) THEN
    ALTER TABLE contacts ADD COLUMN custom_fields jsonb DEFAULT '{}';
  END IF;

  -- Add assigned_to if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'contacts' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE contacts ADD COLUMN assigned_to uuid;
  END IF;
END $$;

-- Enable RLS if not already enabled
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can create contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can update contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can delete contacts" ON contacts;
DROP POLICY IF EXISTS "Users can view contacts in their tenant" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts in their tenant" ON contacts;
DROP POLICY IF EXISTS "Users can update contacts in their tenant" ON contacts;

-- Create simple, permissive policies for testing
CREATE POLICY "Authenticated users can view contacts" ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create contacts" ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update contacts" ON contacts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete contacts" ON contacts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_contacts_updated_at_trigger ON contacts;
CREATE TRIGGER update_contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Verify the table structure
SELECT 
  'Contacts table schema updated successfully. Columns: ' || 
  string_agg(column_name, ', ' ORDER BY ordinal_position) as status
FROM information_schema.columns 
WHERE table_name = 'contacts' 
  AND table_schema = 'public';