/*
  # Ticket System Implementation

  1. New Tables
    - tickets: Main tickets table with fields for tracking support requests
    - ticket_comments: Comments and responses on tickets
    - ticket_attachments: File attachments for tickets
    - ticket_history: Audit trail of ticket changes

  2. Security
    - Enable RLS on all tables
    - Create policies for admin and agent access
    - Implement data isolation between agents

  3. Changes
    - Add ticket tracking capabilities
    - Implement audit logging
    - Add necessary indexes
*/

-- Create ticket status type
CREATE TYPE ticket_status AS ENUM (
  'open',
  'in_progress',
  'resolved',
  'closed'
);

-- Create ticket priority type
CREATE TYPE ticket_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- Create ticket category type
CREATE TYPE ticket_category AS ENUM (
  'technical',
  'billing',
  'inquiry',
  'feature_request',
  'bug_report'
);

-- Tickets table
CREATE TABLE tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text NOT NULL UNIQUE, -- YY-MM-XXX format
  subject text NOT NULL,
  description text NOT NULL,
  category ticket_category NOT NULL,
  priority ticket_priority NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES auth.users(id),
  contact_id uuid REFERENCES contacts(id),
  organization_id uuid REFERENCES organizations(id),
  resolution_notes text,
  attachments text[],
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ticket comments table
CREATE TABLE ticket_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  attachments text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ticket history table
CREATE TABLE ticket_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_history ENABLE ROW LEVEL SECURITY;

-- Create policies for tickets
CREATE POLICY "Admins can view all tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Agents can view assigned tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid()
  );

CREATE POLICY "Admins can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Agents can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'agent'
  );

CREATE POLICY "Admins can update any ticket"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Agents can update assigned tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    assigned_to = auth.uid()
  );

-- Create policies for comments
CREATE POLICY "Users can view comments on accessible tickets"
  ON ticket_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.assigned_to = auth.uid() OR
        auth.jwt() ->> 'role' = 'admin'
      )
    )
  );

CREATE POLICY "Users can add comments to accessible tickets"
  ON ticket_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_comments.ticket_id
      AND (
        tickets.assigned_to = auth.uid() OR
        auth.jwt() ->> 'role' = 'admin'
      )
    )
  );

-- Create policies for history
CREATE POLICY "Users can view history of accessible tickets"
  ON ticket_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = ticket_history.ticket_id
      AND (
        tickets.assigned_to = auth.uid() OR
        auth.jwt() ->> 'role' = 'admin'
      )
    )
  );

-- Create indexes
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
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

-- Create trigger for tickets
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

-- Create triggers for ticket history
CREATE TRIGGER log_ticket_changes
  AFTER INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION log_ticket_history();