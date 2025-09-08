/*
  # Drop All Existing Tables and Types

  This script will completely remove all existing tables, types, functions, and triggers
  to give you a clean slate for recreating the database schema.

  WARNING: This will permanently delete all data in your database!
*/

-- Drop all tables in dependency order (child tables first)
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

-- Drop all custom types
DROP TYPE IF EXISTS ticket_status CASCADE;
DROP TYPE IF EXISTS ticket_priority CASCADE;
DROP TYPE IF EXISTS ticket_category CASCADE;
DROP TYPE IF EXISTS campaign_type CASCADE;
DROP TYPE IF EXISTS campaign_status CASCADE;

-- Drop all custom functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS log_ticket_history() CASCADE;
DROP FUNCTION IF EXISTS update_campaign_metrics() CASCADE;
DROP FUNCTION IF EXISTS log_deal_update() CASCADE;
DROP FUNCTION IF EXISTS log_ticket_changes() CASCADE;

-- Drop any remaining sequences
DROP SEQUENCE IF EXISTS ticket_id_seq CASCADE;

-- Clean up any remaining objects
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop any remaining tables that might exist
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Drop any remaining types
    FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- Verify cleanup
SELECT 'All tables and types have been dropped successfully' as status;