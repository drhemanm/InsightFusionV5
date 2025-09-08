-- Create campaign type enum
CREATE TYPE campaign_type AS ENUM (
  'email',
  'social_media',
  'event',
  'direct_mail',
  'phone',
  'referral'
);

-- Create campaign status enum
CREATE TYPE campaign_status AS ENUM (
  'draft',
  'active',
  'paused',
  'completed',
  'cancelled'
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
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  manager_id uuid REFERENCES auth.users(id),
  kpis jsonb DEFAULT '{}',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Campaign targets table (for many-to-many relationships)
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

-- Add campaign_id to deals table
ALTER TABLE deals ADD COLUMN campaign_id uuid REFERENCES campaigns(id);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_targets ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaign_targets_campaign_id ON campaign_targets(campaign_id);
CREATE INDEX idx_campaign_targets_target ON campaign_targets(target_type, target_id);
CREATE INDEX idx_deals_campaign_id ON deals(campaign_id);

-- Create policies
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

CREATE POLICY "Users can update campaigns they manage" ON campaigns
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    manager_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Create policies for campaign targets
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

-- Create function to update campaign metrics
CREATE OR REPLACE FUNCTION update_campaign_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update campaign metrics when a deal is created or updated
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.campaign_id IS NOT NULL THEN
    UPDATE campaigns
    SET metrics = jsonb_set(
      metrics,
      '{deals}',
      (
        SELECT jsonb_build_object(
          'count', COUNT(*),
          'value', SUM(value),
          'avg_value', AVG(value),
          'won_count', COUNT(*) FILTER (WHERE stage = 'closed-won'),
          'won_value', SUM(value) FILTER (WHERE stage = 'closed-won')
        )
        FROM deals
        WHERE campaign_id = NEW.campaign_id
      )
    )
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating campaign metrics
CREATE TRIGGER update_campaign_metrics_trigger
  AFTER INSERT OR UPDATE ON deals
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_metrics();