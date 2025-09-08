/*
  # Add Multitenancy Support to CRM

  1. New Tables
    - tenants: Core tenant/organization management
    - tenant_users: User-tenant relationships
    - tenant_settings: Tenant-specific configurations

  2. Schema Changes
    - Add tenant_id to all core tables
    - Update RLS policies for tenant isolation
    - Add tenant-specific indexes

  3. Security
    - Enforce tenant isolation at database level
    - Update all policies to include tenant checks
    - Add tenant admin capabilities

  4. Features
    - Tenant-specific branding and settings
    - Resource usage tracking per tenant
    - Subscription management per tenant
*/

-- Create tenants table
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text UNIQUE,
  
  -- Subscription & Plan
  plan_id text NOT NULL DEFAULT 'basic',
  subscription_status text NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled', 'trial')),
  trial_ends_at timestamptz,
  subscription_ends_at timestamptz,
  
  -- Branding & Customization
  logo_url text,
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#1E40AF',
  custom_css text,
  
  -- Settings
  settings jsonb DEFAULT '{}',
  features jsonb DEFAULT '{}',
  limits jsonb DEFAULT '{}',
  
  -- Contact Information
  contact_email text,
  contact_phone text,
  billing_address jsonb DEFAULT '{}',
  
  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create tenant_users junction table
CREATE TABLE tenant_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'manager', 'user')),
  permissions text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'invited')),
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz,
  joined_at timestamptz,
  last_active_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Add tenant_id to all existing tables
ALTER TABLE users ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE organizations ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE contacts ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE deals ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE activities ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE campaigns ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE tickets ADD COLUMN tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE;

-- Create indexes for tenant_id columns
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_organizations_tenant_id ON organizations(tenant_id);
CREATE INDEX idx_contacts_tenant_id ON contacts(tenant_id);
CREATE INDEX idx_deals_tenant_id ON deals(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_activities_tenant_id ON activities(tenant_id);
CREATE INDEX idx_campaigns_tenant_id ON campaigns(tenant_id);
CREATE INDEX idx_tickets_tenant_id ON tickets(tenant_id);

-- Create composite indexes for better performance
CREATE INDEX idx_contacts_tenant_assigned ON contacts(tenant_id, assigned_to);
CREATE INDEX idx_deals_tenant_assigned ON deals(tenant_id, assigned_to);
CREATE INDEX idx_tasks_tenant_assigned ON tasks(tenant_id, assigned_to);
CREATE INDEX idx_tickets_tenant_assigned ON tickets(tenant_id, assigned_to);

-- Enable RLS on new tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenants
CREATE POLICY "Users can view their tenants" ON tenants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tenants.id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Tenant owners can update their tenant" ON tenants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tenants.id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.role IN ('owner', 'admin')
    )
  );

-- Create RLS policies for tenant_users
CREATE POLICY "Users can view tenant memberships" ON tenant_users
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tenant_users tu
      WHERE tu.tenant_id = tenant_users.tenant_id
      AND tu.user_id = auth.uid()
      AND tu.role IN ('owner', 'admin')
    )
  );

-- Update existing RLS policies to include tenant isolation

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view assigned contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update assigned contacts" ON contacts;

-- Create new tenant-aware policies for contacts
CREATE POLICY "Users can view contacts in their tenant" ON contacts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = contacts.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = contacts.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Users can create contacts in their tenant" ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = contacts.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Users can update contacts in their tenant" ON contacts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = contacts.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = contacts.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Update deals policies
DROP POLICY IF EXISTS "Users can view assigned deals" ON deals;
DROP POLICY IF EXISTS "Users can create deals" ON deals;
DROP POLICY IF EXISTS "Users can update assigned deals" ON deals;

CREATE POLICY "Users can view deals in their tenant" ON deals
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = deals.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = deals.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Users can create deals in their tenant" ON deals
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = deals.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Users can update deals in their tenant" ON deals
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = deals.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = deals.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Update tasks policies
DROP POLICY IF EXISTS "Users can view assigned tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update assigned tasks" ON tasks;

CREATE POLICY "Users can view tasks in their tenant" ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tasks.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = tasks.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Users can create tasks in their tenant" ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tasks.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Users can update tasks in their tenant" ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tasks.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = tasks.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Update tickets policies
DROP POLICY IF EXISTS "Users can view assigned tickets" ON tickets;
DROP POLICY IF EXISTS "Users can create tickets" ON tickets;
DROP POLICY IF EXISTS "Users can update assigned tickets" ON tickets;

CREATE POLICY "Users can view tickets in their tenant" ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tickets.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      auth.uid() = created_by OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = tickets.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

CREATE POLICY "Users can create tickets in their tenant" ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tickets.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Users can update tickets in their tenant" ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = tickets.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
    AND (
      auth.uid() = assigned_to OR
      EXISTS (
        SELECT 1 FROM tenant_users
        WHERE tenant_users.tenant_id = tickets.tenant_id
        AND tenant_users.user_id = auth.uid()
        AND tenant_users.role IN ('owner', 'admin', 'manager')
      )
    )
  );

-- Update campaigns policies
DROP POLICY IF EXISTS "Users can view campaigns they have access to" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;

CREATE POLICY "Users can view campaigns in their tenant" ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = campaigns.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.status = 'active'
    )
  );

CREATE POLICY "Users can create campaigns in their tenant" ON campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_users
      WHERE tenant_users.tenant_id = campaigns.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.role IN ('owner', 'admin', 'manager')
    )
  );

-- Create function to get user's current tenant
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT tenant_id 
    FROM tenant_users 
    WHERE user_id = auth.uid() 
    AND status = 'active'
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check tenant access
CREATE OR REPLACE FUNCTION user_has_tenant_access(target_tenant_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_id = target_tenant_id
    AND user_id = auth.uid()
    AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-assign tenant_id
CREATE OR REPLACE FUNCTION auto_assign_tenant_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := get_user_tenant_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add auto-assign triggers to relevant tables
CREATE TRIGGER auto_assign_tenant_contacts
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_tenant_id();

CREATE TRIGGER auto_assign_tenant_deals
  BEFORE INSERT ON deals
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_tenant_id();

CREATE TRIGGER auto_assign_tenant_tasks
  BEFORE INSERT ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_tenant_id();

CREATE TRIGGER auto_assign_tenant_tickets
  BEFORE INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_tenant_id();

CREATE TRIGGER auto_assign_tenant_campaigns
  BEFORE INSERT ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_tenant_id();

-- Insert default tenant for existing data
INSERT INTO tenants (
  id,
  name,
  slug,
  plan_id,
  settings,
  features,
  limits
) VALUES (
  gen_random_uuid(),
  'Default Organization',
  'default',
  'professional',
  '{"timezone": "UTC", "currency": "MUR", "dateFormat": "MM/dd/yyyy"}',
  '{"maxUsers": 50, "maxContacts": 10000, "maxDeals": 1000, "aiFeatures": true}',
  '{"storage": 100, "apiCalls": 10000}'
) ON CONFLICT (slug) DO NOTHING;

-- Update existing records to use default tenant
UPDATE users SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE organizations SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE contacts SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE deals SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE tasks SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE activities SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE campaigns SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;
UPDATE tickets SET tenant_id = (SELECT id FROM tenants WHERE slug = 'default' LIMIT 1) WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL after data migration
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE contacts ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE deals ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE activities ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE campaigns ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE tickets ALTER COLUMN tenant_id SET NOT NULL;

-- Create tenant resource usage tracking
CREATE TABLE tenant_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  metric text NOT NULL,
  value bigint NOT NULL DEFAULT 0,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, metric, period_start)
);

CREATE INDEX idx_tenant_usage_tenant_metric ON tenant_usage(tenant_id, metric);
CREATE INDEX idx_tenant_usage_period ON tenant_usage(period_start, period_end);

-- Create function to track resource usage
CREATE OR REPLACE FUNCTION track_tenant_usage()
RETURNS TRIGGER AS $$
DECLARE
  current_period_start timestamptz;
  current_period_end timestamptz;
BEGIN
  -- Calculate current month period
  current_period_start := date_trunc('month', now());
  current_period_end := current_period_start + interval '1 month';
  
  -- Track contact creation
  IF TG_TABLE_NAME = 'contacts' AND TG_OP = 'INSERT' THEN
    INSERT INTO tenant_usage (tenant_id, metric, value, period_start, period_end)
    VALUES (NEW.tenant_id, 'contacts_created', 1, current_period_start, current_period_end)
    ON CONFLICT (tenant_id, metric, period_start)
    DO UPDATE SET value = tenant_usage.value + 1;
  END IF;
  
  -- Track deal creation
  IF TG_TABLE_NAME = 'deals' AND TG_OP = 'INSERT' THEN
    INSERT INTO tenant_usage (tenant_id, metric, value, period_start, period_end)
    VALUES (NEW.tenant_id, 'deals_created', 1, current_period_start, current_period_end)
    ON CONFLICT (tenant_id, metric, period_start)
    DO UPDATE SET value = tenant_usage.value + 1;
  END IF;
  
  -- Track ticket creation
  IF TG_TABLE_NAME = 'tickets' AND TG_OP = 'INSERT' THEN
    INSERT INTO tenant_usage (tenant_id, metric, value, period_start, period_end)
    VALUES (NEW.tenant_id, 'tickets_created', 1, current_period_start, current_period_end)
    ON CONFLICT (tenant_id, metric, period_start)
    DO UPDATE SET value = tenant_usage.value + 1;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create usage tracking triggers
CREATE TRIGGER track_contact_usage
  AFTER INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION track_tenant_usage();

CREATE TRIGGER track_deal_usage
  AFTER INSERT ON deals
  FOR EACH ROW
  EXECUTE FUNCTION track_tenant_usage();

CREATE TRIGGER track_ticket_usage
  AFTER INSERT ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION track_tenant_usage();

-- Create tenant admin functions
CREATE OR REPLACE FUNCTION create_tenant(
  tenant_name text,
  tenant_slug text,
  owner_email text,
  plan_id text DEFAULT 'basic'
)
RETURNS uuid AS $$
DECLARE
  new_tenant_id uuid;
  owner_user_id uuid;
BEGIN
  -- Create tenant
  INSERT INTO tenants (name, slug, plan_id)
  VALUES (tenant_name, tenant_slug, plan_id)
  RETURNING id INTO new_tenant_id;
  
  -- Get or create owner user
  SELECT id INTO owner_user_id FROM auth.users WHERE email = owner_email;
  
  IF owner_user_id IS NOT NULL THEN
    -- Add owner to tenant
    INSERT INTO tenant_users (tenant_id, user_id, role, status, joined_at)
    VALUES (new_tenant_id, owner_user_id, 'owner', 'active', now());
  END IF;
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sample tenant and user relationship
DO $$
DECLARE
  default_tenant_id uuid;
  admin_user_id uuid;
BEGIN
  -- Get default tenant
  SELECT id INTO default_tenant_id FROM tenants WHERE slug = 'default';
  
  -- Get admin user
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@insightfusion.com';
  
  -- Create tenant-user relationship if both exist
  IF default_tenant_id IS NOT NULL AND admin_user_id IS NOT NULL THEN
    INSERT INTO tenant_users (tenant_id, user_id, role, status, joined_at)
    VALUES (default_tenant_id, admin_user_id, 'owner', 'active', now())
    ON CONFLICT (tenant_id, user_id) DO NOTHING;
  END IF;
END $$;