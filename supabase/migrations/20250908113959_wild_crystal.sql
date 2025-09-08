/*
  # Complete CRM Database Schema

  1. Core Tables
    - users: System users and agents with role-based access
    - organizations: Company/organization records
    - contacts: Customer/lead contact information with KYC support
    - deals: Sales pipeline deals with campaign tracking
    - tasks: User tasks and reminders
    - activities: User activity tracking and audit trail
    - campaigns: Marketing campaigns with target tracking
    - tickets: Support ticket system with SLA tracking

  2. Security
    - Enable RLS on all tables
    - Create comprehensive policies for data access control
    - Implement proper user isolation

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for dashboard and reporting queries

  4. Audit & Compliance
    - Automatic timestamp updates
    - Change tracking for tickets and deals
    - Campaign metrics automation
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user', 'manager');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE contact_type AS ENUM ('lead', 'customer', 'partner', 'supplier');
CREATE TYPE contact_method AS ENUM ('email', 'phone', 'whatsapp', 'sms');
CREATE TYPE deal_stage AS ENUM ('lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost');
CREATE TYPE deal_status AS ENUM ('new_lead', 'initial_contact', 'in_negotiation', 'proposal_sent', 'contract_pending', 'closed_won', 'closed_lost', 'on_hold');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'deferred');
CREATE TYPE activity_type AS ENUM ('email', 'call', 'meeting', 'note', 'task');
CREATE TYPE campaign_type AS ENUM ('email', 'social_media', 'event', 'direct_mail', 'phone', 'referral');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE ticket_category AS ENUM ('technical', 'billing', 'inquiry', 'feature_request', 'bug_report');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  department text,
  position text,
  status user_status NOT NULL DEFAULT 'active',
  phone text,
  avatar_url text,
  last_login_at timestamptz,
  preferences jsonb DEFAULT '{}',
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
  email text,
  address jsonb DEFAULT '{}',
  tax_id text,
  registration_number text,
  founded_date date,
  description text,
  logo_url text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  
  -- Basic Information
  first_name text NOT NULL,
  middle_name text,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  date_of_birth date,
  
  -- Professional Information
  job_title text,
  department text,
  organization text,
  work_email text,
  work_phone text,
  
  -- Address Information
  business_address jsonb DEFAULT '{}',
  current_address jsonb DEFAULT '{}',
  
  -- Communication Preferences
  preferred_contact_method contact_method DEFAULT 'email',
  timezone text DEFAULT 'UTC',
  language text DEFAULT 'en',
  
  -- Social Media
  social_profiles jsonb DEFAULT '{}',
  
  -- Lead Information
  type contact_type DEFAULT 'lead',
  source text,
  lead_status text,
  last_contact_date timestamptz,
  next_follow_up_date timestamptz,
  deal_value numeric(15,2),
  
  -- Categorization
  tags text[] DEFAULT '{}',
  groups text[] DEFAULT '{}',
  
  -- KYC Information
  passport_id_number text,
  nationality text,
  occupation text,
  government_id_url text,
  proof_of_address_url text,
  kyc_status text DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  
  -- Engagement & Scoring
  score integer DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  engagement_metrics jsonb DEFAULT '{}',
  
  -- Additional Information
  notes text,
  custom_fields jsonb DEFAULT '{}',
  
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
  stage deal_stage NOT NULL DEFAULT 'lead',
  status deal_status NOT NULL DEFAULT 'new_lead',
  priority priority_level NOT NULL DEFAULT 'medium',
  probability integer CHECK (probability BETWEEN 0 AND 100),
  
  -- Relationships
  assigned_to uuid REFERENCES users(id) NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
  campaign_id uuid, -- Will reference campaigns table
  
  -- Dates
  expected_close_date timestamptz,
  actual_close_date timestamptz,
  
  -- Additional Information
  notes text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES users(id) NOT NULL,
  
  -- Relationships
  related_to_type text CHECK (related_to_type IN ('contact', 'deal', 'organization')),
  related_to_id uuid,
  
  -- Task Details
  due_date timestamptz NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  status task_status NOT NULL DEFAULT 'pending',
  completed_at timestamptz,
  
  -- Additional Information
  tags text[] DEFAULT '{}',
  attachments text[] DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  activity_type activity_type NOT NULL,
  
  -- Relationships
  related_to_type text CHECK (related_to_type IN ('contact', 'deal', 'organization', 'task')),
  related_to_id uuid,
  
  -- Activity Details
  title text NOT NULL,
  description text NOT NULL,
  duration integer, -- in minutes
  outcome text,
  
  -- Scheduling
  scheduled_at timestamptz,
  completed_at timestamptz,
  
  -- Additional Information
  metadata jsonb DEFAULT '{}',
  
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
  
  -- Ownership
  created_by uuid REFERENCES users(id) NOT NULL,
  manager_id uuid REFERENCES users(id),
  
  -- Metrics and KPIs
  kpis jsonb DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Campaign targets table (many-to-many relationship)
CREATE TABLE campaign_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('contact', 'organization')),
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'responded', 'converted', 'rejected')),
  notes text,
  contacted_at timestamptz,
  responded_at timestamptz,
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
  
  -- Assignment and Relationships
  assigned_to uuid REFERENCES users(id),
  contact_id uuid REFERENCES contacts(id),
  organization_id uuid REFERENCES organizations(id),
  created_by uuid REFERENCES users(id) NOT NULL,
  
  -- Resolution
  resolution_notes text,
  resolved_at timestamptz,
  
  -- SLA Tracking
  sla_due_date timestamptz,
  sla_breached boolean DEFAULT false,
  
  -- Attachments
  attachments text[] DEFAULT '{}',
  
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
  attachments text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ticket history table (audit trail)
CREATE TABLE ticket_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) NOT NULL,
  action text NOT NULL,
  field_name text,
  old_value text,
  new_value text,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add foreign key constraint for deals -> campaigns
ALTER TABLE deals ADD CONSTRAINT fk_deals_campaign FOREIGN KEY (campaign_id) REFERENCES campaigns(id);

-- Enable Row Level Security on all tables
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

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Organizations policies
CREATE POLICY "Users can view organizations" ON organizations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage organizations" ON organizations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Contacts policies
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

CREATE POLICY "Admins can delete contacts" ON contacts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Deals policies
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

CREATE POLICY "Admins can delete deals" ON deals
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks policies
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

-- Activities policies
CREATE POLICY "Users can view their activities" ON activities
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can create activities" ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Campaigns policies
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

CREATE POLICY "Managers can create campaigns" ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can update campaigns they manage" ON campaigns
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    manager_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Campaign targets policies
CREATE POLICY "Users can view campaign targets" ON campaign_targets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_targets.campaign_id
      AND (
        campaigns.created_by = auth.uid() OR
        campaigns.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      )
    )
  );

CREATE POLICY "Users can manage campaign targets" ON campaign_targets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = campaign_targets.campaign_id
      AND (
        campaigns.created_by = auth.uid() OR
        campaigns.manager_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM users
          WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
      )
    )
  );

-- Tickets policies
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

-- Ticket comments policies
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

-- Ticket history policies
CREATE POLICY "Users can view history of accessible tickets" ON ticket_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_history.ticket_id
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

-- Create performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_contacts_assigned_to ON contacts(assigned_to);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_source ON contacts(source);
CREATE INDEX idx_contacts_last_contact_date ON contacts(last_contact_date);

CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_contact_id ON deals(contact_id);
CREATE INDEX idx_deals_organization_id ON deals(organization_id);
CREATE INDEX idx_deals_campaign_id ON deals(campaign_id);
CREATE INDEX idx_deals_expected_close_date ON deals(expected_close_date);
CREATE INDEX idx_deals_value ON deals(value);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_related_to ON tasks(related_to_type, related_to_id);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_related_to ON activities(related_to_type, related_to_id);
CREATE INDEX idx_activities_created_at ON activities(created_at);

CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_type ON campaigns(type);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);

CREATE INDEX idx_campaign_targets_campaign_id ON campaign_targets(campaign_id);
CREATE INDEX idx_campaign_targets_target ON campaign_targets(target_type, target_id);
CREATE INDEX idx_campaign_targets_status ON campaign_targets(status);

CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_category ON tickets(category);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_sla_due_date ON tickets(sla_due_date);

CREATE INDEX idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX idx_ticket_comments_user_id ON ticket_comments(user_id);

CREATE INDEX idx_ticket_history_ticket_id ON ticket_history(ticket_id);
CREATE INDEX idx_ticket_history_user_id ON ticket_history(user_id);

-- Create functions for automatic updates

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate ticket ID
CREATE OR REPLACE FUNCTION generate_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_id IS NULL OR NEW.ticket_id = '' THEN
    NEW.ticket_id := to_char(now(), 'YY') || '-' || to_char(now(), 'MM') || '-' || 
                     lpad((EXTRACT(epoch FROM now())::bigint % 1000)::text, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate SLA due date
CREATE OR REPLACE FUNCTION calculate_sla_due_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Set SLA due date based on priority
  NEW.sla_due_date := CASE NEW.priority
    WHEN 'critical' THEN now() + interval '4 hours'
    WHEN 'high' THEN now() + interval '24 hours'
    WHEN 'medium' THEN now() + interval '48 hours'
    WHEN 'low' THEN now() + interval '72 hours'
  END;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to log ticket history
CREATE OR REPLACE FUNCTION log_ticket_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Log ticket creation
  IF TG_OP = 'INSERT' THEN
    INSERT INTO ticket_history (ticket_id, user_id, action, changes)
    VALUES (NEW.id, auth.uid(), 'created', to_jsonb(NEW));
    RETURN NEW;
  END IF;

  -- Log ticket updates
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF NEW.status != OLD.status THEN
      INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'status_changed', 'status', OLD.status, NEW.status);
    END IF;
    
    -- Log priority changes
    IF NEW.priority != OLD.priority THEN
      INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'priority_changed', 'priority', OLD.priority::text, NEW.priority::text);
    END IF;
    
    -- Log assignment changes
    IF NEW.assigned_to != OLD.assigned_to OR (NEW.assigned_to IS NULL) != (OLD.assigned_to IS NULL) THEN
      INSERT INTO ticket_history (ticket_id, user_id, action, field_name, old_value, new_value)
      VALUES (NEW.id, auth.uid(), 'assigned', 'assigned_to', OLD.assigned_to::text, NEW.assigned_to::text);
    END IF;

    -- Mark as resolved if status changed to resolved
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
      NEW.resolved_at = now();
    END IF;

    RETURN NEW;
  END IF;

  RETURN NULL;
END;
$$ language 'plpgsql';

-- Function to update campaign metrics
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign metrics when deals are created/updated
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.campaign_id IS NOT NULL THEN
    UPDATE campaigns
    SET metrics = jsonb_set(
      COALESCE(metrics, '{}'),
      '{deals}',
      (
        SELECT jsonb_build_object(
          'count', COUNT(*),
          'value', COALESCE(SUM(value), 0),
          'avg_value', COALESCE(AVG(value), 0),
          'won_count', COUNT(*) FILTER (WHERE stage = 'closed-won'),
          'won_value', COALESCE(SUM(value) FILTER (WHERE stage = 'closed-won'), 0),
          'conversion_rate', CASE 
            WHEN COUNT(*) > 0 THEN 
              ROUND((COUNT(*) FILTER (WHERE stage = 'closed-won')::numeric / COUNT(*)) * 100, 2)
            ELSE 0 
          END
        )
        FROM deals
        WHERE campaign_id = NEW.campaign_id
      ),
      true
    ),
    updated_at = now()
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers

-- Updated_at triggers
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

CREATE TRIGGER update_campaign_targets_updated_at
  BEFORE UPDATE ON campaign_targets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Ticket-specific triggers
CREATE TRIGGER generate_ticket_id_trigger
  BEFORE INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION generate_ticket_id();

CREATE TRIGGER calculate_sla_trigger
  BEFORE INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION calculate_sla_due_date();

CREATE TRIGGER log_ticket_changes_trigger
  AFTER INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_history();

-- Campaign metrics trigger
CREATE TRIGGER update_campaign_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_metrics();

-- Insert sample admin user (optional - for testing)
INSERT INTO users (id, email, first_name, last_name, role, status)
VALUES (
  gen_random_uuid(),
  'admin@insightfusion.com',
  'System',
  'Administrator',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample organization (optional - for testing)
INSERT INTO organizations (name, industry, size)
VALUES (
  'InsightFusion Demo',
  'Technology',
  '11-50'
) ON CONFLICT DO NOTHING;

-- Verify schema creation
SELECT 
  'Schema created successfully! Tables: ' || count(*) as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE';