// ============================================
// AUTO-GENERATED DATABASE TYPES
// ============================================
// Generated from Supabase schema
// DO NOT EDIT MANUALLY
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          subdomain: string | null
          plan_tier: 'basic' | 'pro' | 'enterprise'
          settings: Json
          billing_email: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subdomain?: string | null
          plan_tier?: 'basic' | 'pro' | 'enterprise'
          settings?: Json
          billing_email?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subdomain?: string | null
          plan_tier?: 'basic' | 'pro' | 'enterprise'
          settings?: Json
          billing_email?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          company_id: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'manager' | 'sales' | 'support' | 'user'
          status: 'active' | 'inactive' | 'invited'
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'sales' | 'support' | 'user'
          status?: 'active' | 'inactive' | 'invited'
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'manager' | 'sales' | 'support' | 'user'
          status?: 'active' | 'inactive' | 'invited'
          last_login_at?: string | null
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          company_id: string | null
          owner_id: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          mobile: string | null
          job_title: string | null
          company_name: string | null
          company_size: string | null
          industry: string | null
          source: string | null
          status: 'lead' | 'contacted' | 'qualified' | 'customer' | 'inactive' | 'lost'
          lead_score: number
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          linkedin_url: string | null
          twitter_url: string | null
          website: string | null
          tags: string[] | null
          custom_fields: Json
          notes: string | null
          last_contacted_at: string | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          churn_risk_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          job_title?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          source?: string | null
          status?: 'lead' | 'contacted' | 'qualified' | 'customer' | 'inactive' | 'lost'
          lead_score?: number
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website?: string | null
          tags?: string[] | null
          custom_fields?: Json
          notes?: string | null
          last_contacted_at?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          churn_risk_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          owner_id?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          mobile?: string | null
          job_title?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          source?: string | null
          status?: 'lead' | 'contacted' | 'qualified' | 'customer' | 'inactive' | 'lost'
          lead_score?: number
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website?: string | null
          tags?: string[] | null
          custom_fields?: Json
          notes?: string | null
          last_contacted_at?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          churn_risk_score?: number | null
          updated_at?: string
        }
      }
      deals: {
        Row: {
          id: string
          company_id: string | null
          contact_id: string | null
          owner_id: string | null
          title: string
          description: string | null
          value: number
          currency: string
          stage: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability: number
          expected_close_date: string | null
          actual_close_date: string | null
          lost_reason: string | null
          win_reason: string | null
          tags: string[] | null
          custom_fields: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          contact_id?: string | null
          owner_id?: string | null
          title: string
          description?: string | null
          value?: number
          currency?: string
          stage?: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability?: number
          expected_close_date?: string | null
          actual_close_date?: string | null
          lost_reason?: string | null
          win_reason?: string | null
          tags?: string[] | null
          custom_fields?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          contact_id?: string | null
          owner_id?: string | null
          title?: string
          description?: string | null
          value?: number
          currency?: string
          stage?: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
          probability?: number
          expected_close_date?: string | null
          actual_close_date?: string | null
          lost_reason?: string | null
          win_reason?: string | null
          tags?: string[] | null
          custom_fields?: Json
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          contact_id: string | null
          deal_id: string | null
          type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'sms' | 'whatsapp'
          direction: 'inbound' | 'outbound' | null
          subject: string | null
          body: string | null
          duration_minutes: number | null
          participants: string[] | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          sentiment_score: number | null
          key_topics: string[] | null
          action_items: string[] | null
          metadata: Json
          occurred_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          contact_id?: string | null
          deal_id?: string | null
          type: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'sms' | 'whatsapp'
          direction?: 'inbound' | 'outbound' | null
          subject?: string | null
          body?: string | null
          duration_minutes?: number | null
          participants?: string[] | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          sentiment_score?: number | null
          key_topics?: string[] | null
          action_items?: string[] | null
          metadata?: Json
          occurred_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          contact_id?: string | null
          deal_id?: string | null
          type?: 'email' | 'call' | 'meeting' | 'note' | 'task' | 'sms' | 'whatsapp'
          direction?: 'inbound' | 'outbound' | null
          subject?: string | null
          body?: string | null
          duration_minutes?: number | null
          participants?: string[] | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          sentiment_score?: number | null
          key_topics?: string[] | null
          action_items?: string[] | null
          metadata?: Json
          occurred_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          company_id: string | null
          assigned_to: string | null
          created_by: string | null
          contact_id: string | null
          deal_id: string | null
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          completed_at: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          assigned_to?: string | null
          created_by?: string | null
          contact_id?: string | null
          deal_id?: string | null
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          completed_at?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          assigned_to?: string | null
          created_by?: string | null
          contact_id?: string | null
          deal_id?: string | null
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          completed_at?: string | null
          tags?: string[] | null
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          company_id: string | null
          created_by: string | null
          name: string
          description: string | null
          type: 'email' | 'sms' | 'whatsapp' | 'social' | null
          status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
          target_audience: Json
          scheduled_at: string | null
          started_at: string | null
          completed_at: string | null
          total_sent: number
          total_delivered: number
          total_opened: number
          total_clicked: number
          total_converted: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          created_by?: string | null
          name: string
          description?: string | null
          type?: 'email' | 'sms' | 'whatsapp' | 'social' | null
          status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
          target_audience?: Json
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          total_sent?: number
          total_delivered?: number
          total_opened?: number
          total_clicked?: number
          total_converted?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          created_by?: string | null
          name?: string
          description?: string | null
          type?: 'email' | 'sms' | 'whatsapp' | 'social' | null
          status?: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed'
          target_audience?: Json
          scheduled_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          total_sent?: number
          total_delivered?: number
          total_opened?: number
          total_clicked?: number
          total_converted?: number
          updated_at?: string
        }
      }
      ai_predictions: {
        Row: {
          id: string
          company_id: string | null
          entity_type: 'contact' | 'deal' | 'churn'
          entity_id: string
          prediction_type: 'lead_score' | 'deal_probability' | 'churn_risk' | 'sentiment'
          prediction_value: number
          confidence: number | null
          model_name: string | null
          model_version: string | null
          features: Json
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          entity_type: 'contact' | 'deal' | 'churn'
          entity_id: string
          prediction_type: 'lead_score' | 'deal_probability' | 'churn_risk' | 'sentiment'
          prediction_value: number
          confidence?: number | null
          model_name?: string | null
          model_version?: string | null
          features?: Json
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          entity_type?: 'contact' | 'deal' | 'churn'
          entity_id?: string
          prediction_type?: 'lead_score' | 'deal_probability' | 'churn_risk' | 'sentiment'
          prediction_value?: number
          confidence?: number | null
          model_name?: string | null
          model_version?: string | null
          features?: Json
        }
      }
      email_threads: {
        Row: {
          id: string
          company_id: string | null
          contact_id: string | null
          thread_id: string
          subject: string | null
          participants: string[] | null
          message_count: number
          last_message_at: string | null
          last_message_preview: string | null
          status: 'active' | 'archived' | 'spam'
          embedding: number[] | null
          summary: string | null
          sentiment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          contact_id?: string | null
          thread_id: string
          subject?: string | null
          participants?: string[] | null
          message_count?: number
          last_message_at?: string | null
          last_message_preview?: string | null
          status?: 'active' | 'archived' | 'spam'
          embedding?: number[] | null
          summary?: string | null
          sentiment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          contact_id?: string | null
          thread_id?: string
          subject?: string | null
          participants?: string[] | null
          message_count?: number
          last_message_at?: string | null
          last_message_preview?: string | null
          status?: 'active' | 'archived' | 'spam'
          embedding?: number[] | null
          summary?: string | null
          sentiment?: string | null
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          provider: 'gmail' | 'google_calendar' | 'outlook' | 'whatsapp' | 'slack' | 'zoom'
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          config: Json
          status: 'active' | 'disconnected' | 'error'
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          provider: 'gmail' | 'google_calendar' | 'outlook' | 'whatsapp' | 'slack' | 'zoom'
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          config?: Json
          status?: 'active' | 'disconnected' | 'error'
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          provider?: 'gmail' | 'google_calendar' | 'outlook' | 'whatsapp' | 'slack' | 'zoom'
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          config?: Json
          status?: 'active' | 'disconnected' | 'error'
          last_sync_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
