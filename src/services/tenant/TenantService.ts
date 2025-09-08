import { supabase } from '../../config/supabase';
import { logger } from '../../utils/monitoring/logger';
import type { Tenant, TenantUser } from '../../types/tenant';

export class TenantService {
  static async getCurrentTenant(): Promise<Tenant | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's tenant through tenant_users junction table
      const { data: tenantUser, error: tenantUserError } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          role,
          tenants (
            id,
            name,
            slug,
            domain,
            plan_id,
            subscription_status,
            logo_url,
            primary_color,
            secondary_color,
            settings,
            features,
            limits,
            status
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (tenantUserError || !tenantUser) {
        logger.error('Failed to fetch tenant', { error: tenantUserError });
        return null;
      }

      const tenantData = tenantUser.tenants as any;
      
      return {
        id: tenantData.id,
        name: tenantData.name,
        domain: tenantData.domain || window.location.hostname,
        plan: tenantData.plan_id as 'starter' | 'professional' | 'enterprise',
        features: tenantData.features || {},
        branding: {
          logo: tenantData.logo_url,
          primaryColor: tenantData.primary_color || '#2563eb',
          secondaryColor: tenantData.secondary_color || '#1e40af'
        },
        settings: tenantData.settings || {},
        security: {
          mfa: false,
          ssoEnabled: false,
          ipWhitelist: [],
          passwordPolicy: {
            minLength: 8,
            requireSpecialChars: true,
            requireNumbers: true,
            expiryDays: 90
          }
        }
      };
    } catch (error) {
      logger.error('Failed to get current tenant', { error });
      return null;
    }
  }

  static async getCurrentTenantUser(): Promise<TenantUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: tenantUser, error } = await supabase
        .from('tenant_users')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error || !tenantUser) {
        logger.error('Failed to fetch tenant user', { error });
        return null;
      }

      return {
        id: user.id,
        tenantId: tenantUser.tenant_id,
        email: user.email!,
        role: tenantUser.role,
        permissions: tenantUser.permissions || [],
        lastLogin: tenantUser.last_active_at ? new Date(tenantUser.last_active_at) : undefined,
        status: tenantUser.status
      };
    } catch (error) {
      logger.error('Failed to get current tenant user', { error });
      return null;
    }
  }

  static async createTenant(data: {
    name: string;
    slug: string;
    ownerEmail: string;
    planId?: string;
  }): Promise<Tenant> {
    try {
      const { data: tenant, error } = await supabase.rpc('create_tenant', {
        tenant_name: data.name,
        tenant_slug: data.slug,
        owner_email: data.ownerEmail,
        plan_id: data.planId || 'basic'
      });

      if (error) {
        logger.error('Failed to create tenant', { error });
        throw error;
      }

      logger.info('Tenant created successfully', { tenantId: tenant });
      return await this.getTenantById(tenant);
    } catch (error) {
      logger.error('Tenant creation failed', { error });
      throw error;
    }
  }

  static async getTenantById(id: string): Promise<Tenant> {
    try {
      const { data: tenant, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !tenant) {
        throw new Error('Tenant not found');
      }

      return {
        id: tenant.id,
        name: tenant.name,
        domain: tenant.domain || window.location.hostname,
        plan: tenant.plan_id as 'starter' | 'professional' | 'enterprise',
        features: tenant.features || {},
        branding: {
          logo: tenant.logo_url,
          primaryColor: tenant.primary_color || '#2563eb',
          secondaryColor: tenant.secondary_color || '#1e40af'
        },
        settings: tenant.settings || {},
        security: {
          mfa: false,
          ssoEnabled: false,
          ipWhitelist: [],
          passwordPolicy: {
            minLength: 8,
            requireSpecialChars: true,
            requireNumbers: true,
            expiryDays: 90
          }
        }
      };
    } catch (error) {
      logger.error('Failed to get tenant by ID', { error });
      throw error;
    }
  }

  static async updateTenantSettings(tenantId: string, settings: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenants')
        .update({ 
          settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', tenantId);

      if (error) {
        logger.error('Failed to update tenant settings', { error });
        throw error;
      }

      logger.info('Tenant settings updated', { tenantId });
    } catch (error) {
      logger.error('Failed to update tenant settings', { error });
      throw error;
    }
  }

  static async inviteUserToTenant(
    tenantId: string,
    email: string,
    role: 'admin' | 'manager' | 'user'
  ): Promise<void> {
    try {
      // In production, this would send an invitation email
      // For now, we'll create a pending invitation record
      
      const { error } = await supabase
        .from('tenant_users')
        .insert({
          tenant_id: tenantId,
          user_id: null, // Will be filled when user accepts invitation
          role,
          status: 'invited',
          invited_by: (await supabase.auth.getUser()).data.user?.id,
          invited_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to invite user to tenant', { error });
        throw error;
      }

      logger.info('User invited to tenant', { tenantId, email, role });
    } catch (error) {
      logger.error('Failed to invite user to tenant', { error });
      throw error;
    }
  }

  static async getTenantUsage(tenantId: string): Promise<Record<string, number>> {
    try {
      const { data: usage, error } = await supabase
        .from('tenant_usage')
        .select('metric, value')
        .eq('tenant_id', tenantId)
        .gte('period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      if (error) {
        logger.error('Failed to get tenant usage', { error });
        throw error;
      }

      return usage.reduce((acc, item) => {
        acc[item.metric] = item.value;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      logger.error('Failed to get tenant usage', { error });
      throw error;
    }
  }
}