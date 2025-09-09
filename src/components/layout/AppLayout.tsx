import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Users, DollarSign, CheckSquare, BarChart2, 
  Settings, MessageSquare, Brain, LogOut, Bell, Search, Menu, X 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ResponsiveContainer } from './ResponsiveContainer';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Deals', icon: DollarSign, path: '/deals' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Reports', icon: BarChart2, path: '/reports' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-30">
        <ResponsiveContainer>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                  InsightFusion
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 w-48 bg-gray-50 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md relative">
                <Bell size={16} />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l">
                <div className="flex flex-col items-end">
                  <span className="font-medium text-xs">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-gray-500 truncate max-w-32">{user?.email}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      {/* Mobile Navigation */}
      <div className={`
        fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300
        ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}>
        <div className={`
          fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-14 lg:left-0 lg:w-64 lg:bg-white lg:border-r">
        <nav className="p-3 space-y-0.5">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={16} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-14 lg:pl-64">
        <ResponsiveContainer className="py-6">
          {children}
        </ResponsiveContainer>
      </main>
    </div>
  );
};