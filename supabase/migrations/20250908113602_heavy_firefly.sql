/*
  # Reset Database and Recreate Schema

  1. Cleanup
    - Drop all existing tables and types
    - Clean up any remaining objects

  2. Core Tables
    - users: System users and agents
    - organizations: Company/organization records
    - contacts: Customer/lead contact information
    - deals: Sales pipeline deals
    - tasks: User tasks and reminders
    - activities: User activity tracking
    - tickets: Support ticket system
    - campaigns: Marketing campaigns

  3. Security
    - Enable RLS on all tables
    - Add policies for data access control
    - Create proper indexes for performance
*/

-- Drop all existing tables if they exist
DROP TABLE IF EXISTS ticket_history CASCADE;
DROP TABLE IF EXISTS ticket_comments CASCADE;
DROP TABLE IF EXISTS ticket_attachments CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS campaign_targets CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;
DROP TYPE IF EXISTS ticket_category CASCADE;
DROP TYPE IF EXISTS campaign_type CASCADE;
DROP TYPE IF EXISTS campaign_status CASCADE;

-- Create custom types
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_category AS ENUM ('technical', 'billing', 'inquiry', 'feature_request', 'bug_report');
CREATE TYPE campaign_type AS ENUM ('email', 'social_media', 'event', 'direct_mail', 'phone', 'referral');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
  department text,
  position text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  size text CHECK (size IN ('1-10', '11-50', '51-200', '201-500', '501+')),
  annual_revenue text,
  website text,
  phone text,
  address jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  assigned_to uuid REFERENCES users(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  job_title text,
  department text,
  organization text,
  preferred_contact_method text DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'sms')),
  timezone text,
  type text DEFAULT 'lead' CHECK (type IN ('lead', 'customer', 'partner', 'supplier')),
  source text,
  tags text[],
  notes text,
  custom_fields jsonb DEFAULT '{}',
  date_of_birth date,
  passport_id_number text,
  nationality text,
  current_address jsonb,
  occupation text,
  company_organization text,
  government_id_url text,
  proof_of_address_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Deals table
CREATE TABLE deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  value numeric(15,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'MUR',
  stage text NOT NULL DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  status text NOT NULL DEFAULT 'new_lead' CHECK (status IN ('new_lead', 'initial_contact', 'in_negotiation', 'proposal_sent', 'contract_pending', 'closed_won', 'closed_lost', 'on_hold')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  probability integer CHECK (probability BETWEEN 0 AND 100),
  assigned_to uuid REFERENCES users(id) NOT NULL,
  contact_id uuid REFERENCES contacts(id),
  organization_id uuid REFERENCES organizations(id),
  campaign_id uuid,
  expected_close_date timestamptz,
  actual_close_date timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES users(id) NOT NULL,
  related_to_type text CHECK (related_to_type IN ('contact', 'deal', 'organization')),
  related_to_id uuid,
  due_date timestamptz NOT NULL,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'deferred')),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('email', 'call', 'meeting', 'note', 'task')),
  related_to_type text CHECK (related_to_type IN ('contact', 'deal', 'organization')),
  related_to_id uuid,
  description text NOT NULL,
  duration integer,
  outcome text,
  scheduled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Campaigns table
CREATE TABLE campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type campaign_type NOT NULL,
  description text,
  budget numeric(15,2) NOT NULL DEFAULT 0,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  created_by uuid REFERENCES users(id) NOT NULL,
  manager_id uuid REFERENCES users(id),
  kpis jsonb DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Campaign targets table
CREATE TABLE campaign_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('contact', 'organization')),
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'responded', 'converted', 'rejected')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, target_type, target_id)
);

-- Tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text NOT NULL UNIQUE,
  subject text NOT NULL,
  description text NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES users(id),
  contact_id uuid REFERENCES contacts(id),
  organization_id uuid REFERENCES organizations(id),
  resolution_notes text,
  attachments text[],
  created_by uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ticket comments table
CREATE TABLE ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  attachments text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ticket history table
CREATE TABLE ticket_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) NOT NULL,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add foreign key for campaigns in deals
ALTER TABLE deals ADD CONSTRAINT fk_deals_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for contacts
CREATE POLICY "Users can view assigned contacts" ON contacts
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create contacts" ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned contacts" ON contacts
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for deals
CREATE POLICY "Users can view assigned deals" ON deals
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create deals" ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned deals" ON deals
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for tasks
CREATE POLICY "Users can view assigned tasks" ON tasks
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned tasks" ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for campaigns
CREATE POLICY "Users can view campaigns they have access to" ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    manager_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create campaigns" ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for tickets
CREATE POLICY "Users can view assigned tickets" ON tickets
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update assigned tickets" ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = assigned_to OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for ticket comments
CREATE POLICY "Users can view comments on accessible tickets" ON ticket_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.assigned_to = auth.uid() OR
        tickets.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      )
    )
  );

CREATE POLICY "Users can add comments to accessible tickets" ON ticket_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.assigned_to = auth.uid() OR
        tickets.created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_campaign_id ON deals(campaign_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_targets_campaign_id ON campaign_targets(campaign_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_history_ticket_id ON ticket_history(ticket_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log ticket history
CREATE OR REPLACE FUNCTION log_ticket_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO ticket_history (
    ticket_id,
    user_id,
    action,
    changes
  ) VALUES (
    NEW.id,
    auth.uid(),
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
      ELSE TG_OP
    END,
    CASE
      WHEN TG_OP = 'UPDATE' THEN 
        jsonb_build_object(
          'before', to_jsonb(OLD),
          'after', to_jsonb(NEW)
        )
      ELSE NULL
    END
  );
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for ticket history
CREATE TRIGGER log_ticket_changes
  AFTER INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_history();

-- Create function to update campaign metrics
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.campaign_id IS NOT NULL THEN
    UPDATE campaigns
    SET metrics = jsonb_set(
      metrics,
      '{deals}',
      (
        SELECT jsonb_build_object(
          'count', COUNT(*),
          'value', COALESCE(SUM(value), 0),
          'avg_value', COALESCE(AVG(value), 0),
          'won_count', COUNT(*) FILTER (WHERE stage = 'closed-won'),
          'won_value', COALESCE(SUM(value) FILTER (WHERE stage = 'closed-won'), 0)
        )
        FROM deals
        WHERE campaign_id = NEW.campaign_id
      )
    )
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for updating campaign metrics
CREATE TRIGGER update_campaign_metrics_trigger
  AFTER INSERT OR UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_metrics();