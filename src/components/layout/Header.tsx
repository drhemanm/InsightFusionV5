import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  Users, 
  DollarSign, 
  CheckSquare, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Deals', href: '/deals', icon: DollarSign },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InsightFusion</h1>
              <p className="text-xs text-gray-500">AI-Powered CRM</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Link
                  to="/settings"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                  title="Settings"
                >
                  <Settings size={20} />
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};