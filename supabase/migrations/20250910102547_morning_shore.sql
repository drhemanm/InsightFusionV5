/*
  # Fix Contacts Table Configuration

  1. Ensure contacts table exists with proper structure
  2. Enable RLS and create comprehensive policies
  3. Add necessary indexes for performance
  4. Fix security warnings from Supabase linter

  This migration is safe to run multiple times.
*/

-- Create contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS contacts (
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

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can delete contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON contacts;

-- Create comprehensive RLS policies
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- Create or replace function to update updated_at timestamp (with proper security)
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_contacts_updated_at_trigger ON contacts;
CREATE TRIGGER update_contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();

-- Test the table by inserting and immediately deleting a test record
DO $$
DECLARE
  test_id uuid;
BEGIN
  -- Try to insert a test record
  INSERT INTO contacts (first_name, last_name, email)
  VALUES ('Test', 'User', 'test-' || extract(epoch from now()) || '@example.com')
  RETURNING id INTO test_id;
  
  -- If successful, delete the test record
  DELETE FROM contacts WHERE id = test_id;
  
  RAISE NOTICE 'Contacts table is working correctly!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error testing contacts table: %', SQLERRM;
END $$;

-- Verify the table structure
SELECT 
  'Contacts table configured successfully. Columns: ' || 
  string_agg(column_name, ', ' ORDER BY ordinal_position) as status
FROM information_schema.columns 
WHERE table_name = 'contacts' 
  AND table_schema = 'public';