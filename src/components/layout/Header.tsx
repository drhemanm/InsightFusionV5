import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, Bell, Search, Settings, LogOut, Users, Wallet, 
  CheckSquare, BarChart2, MessageSquare, Zap, Star, Building2, FileText, Target,
  Ticket, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { tickets } = useTicketStore();
  const location = useLocation();

  const unresolved = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
  const navigation = [
    { name: 'Dashboard', icon: BarChart2, path: '/dashboard' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Deals', icon: Wallet, path: '/deals' },
    {
      name: 'Campaigns',
      icon: Target,
      path: '/campaigns'
    },
    { 
      name: 'Tickets', 
      icon: Ticket, 
      path: '/tickets',
      badge: unresolved > 0 ? unresolved : undefined 
    },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Organization', icon: Building2, path: '/organization' },
    { name: 'Documentation', icon: FileText, path: '/docs' },
    { name: 'Features', icon: Star, path: '/features' },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { name: 'Automation', icon: Zap, path: '/automation' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b z-30 shadow-sm">
      <div className="w-full h-full px-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              InsightFusion
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={14} />
                <span className="hidden xl:block">{item.name}</span>
               {item.badge && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                   {item.badge}
                 </span>
               )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 w-48 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md relative">
            <Bell size={16} />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-medium text-xs">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-32">{user?.email}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};