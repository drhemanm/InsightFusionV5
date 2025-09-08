import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Tenant, TenantUser, TenantContext as ITenantContext } from '../types/tenant';
import { useAuthStore } from '../store/authStore';
import { TenantService } from '../services/tenant/TenantService';

const TenantContext = createContext<ITenantContext | null>(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: React.ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [user, setUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeTenant = async () => {
      if (!isAuthenticated || !authUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch real tenant data from Supabase
        const [tenantData, tenantUserData] = await Promise.all([
          TenantService.getCurrentTenant(),
          TenantService.getCurrentTenantUser()
        ]);

        if (tenantData && tenantUserData) {
          setTenant(tenantData);
          setUser(tenantUserData);
        } else {
          // No tenant found - user might need to be invited to a tenant
          console.warn('No tenant found for user');
        }
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();
  }, [isAuthenticated, authUser]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ tenant: tenant!, user: user! }}>
      {children}
    </TenantContext.Provider>
  );
};