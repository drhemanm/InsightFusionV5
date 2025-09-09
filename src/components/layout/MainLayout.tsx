import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  DollarSign,
  CheckSquare,
  BarChart2,
  Building2,
  Shield,
  LogOut,
  Settings
} from 'lucide-react';
import { useTenant } from '../../context/TenantContext';
import { useAuthStore } from '../../store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { logout } = useAuthStore();
  const { tenant, user } = useTenant();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-3">
          <div className="flex flex-col py-2">
            {/* Logo and Company Name */}
            <div className="text-center mb-2">
              <h1 className="text-lg font-bold text-gray-900">InsightFusion CRM</h1>
              <p className="text-xs text-gray-500">Designed by Dr Heman Mohabeer</p>
            </div>

            {/* Navigation */}
            <nav className="flex items-center justify-center space-x-3 overflow-x-auto">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Dashboard
              </Link>
              <Link
                to="/contacts"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Contacts
              </Link>
              <Link
                to="/deals"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Deals
              </Link>
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Tasks
              </Link>
              <Link
                to="/reports"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Reports
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/organization"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Organization
              </Link>
              <Link
                to="/settings"
                className="text-gray-600 hover:text-gray-900 px-2 py-1 text-xs font-medium whitespace-nowrap"
              >
                Settings
              </Link>
            </nav>

            {/* User Info */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-gray-900">{user?.email}</p>
                <p className="text-xs text-gray-500">{tenant?.name}</p>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-3 py-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};