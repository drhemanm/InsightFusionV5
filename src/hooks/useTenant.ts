import { useContext } from 'react';
import { TenantContext } from '../context/TenantContext';

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const useTenantId = () => {
  const { tenant } = useTenant();
  return tenant?.id;
};

export const useTenantFeatures = () => {
  const { tenant } = useTenant();
  return tenant?.features || {};
};

export const useTenantSettings = () => {
  const { tenant } = useTenant();
  return tenant?.settings || {};
};

export const useTenantLimits = () => {
  const { tenant } = useTenant();
  return tenant?.limits || {};
};