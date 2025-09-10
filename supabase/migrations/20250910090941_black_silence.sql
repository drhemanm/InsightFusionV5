/*
  # Create Contacts Table

  1. New Tables
    - `contacts`
      - Basic contact information (name, email, phone)
      - Professional details (job title, company)
      - Contact preferences and categorization
      - Timestamps for tracking

  2. Security
    - Enable RLS on contacts table
    - Add policies for authenticated users to manage contacts

  3. Changes
    - Create indexes for performance
    - Add proper constraints and defaults
*/

-- Create contacts table with all necessary fields
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
  
  -- Assignment (optional - for when you have users table)
  assigned_to uuid,
  
  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
CREATE POLICY "Anyone can view contacts" ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can create contacts" ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update contacts" ON contacts
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can delete contacts" ON contacts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_source ON contacts(source);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_contacts_updated_at_trigger
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_contacts_updated_at();