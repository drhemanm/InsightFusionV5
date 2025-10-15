import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
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
  User,
  Menu,
  X,
  Zap,
  Calendar,
  Mail,
  TrendingUp,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Types
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  url?: string;
}

interface SearchResult {
  id: string;
  type: 'contact' | 'deal' | 'task' | 'message';
  title: string;
  subtitle?: string;
  url: string;
}

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mock notifications (replace with Supabase data)
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Deal Closed',
      message: 'John Smith deal worth $50,000 closed',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      url: '/deals/1'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Follow-up Due',
      message: 'Sarah Johnson needs a call today',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      url: '/contacts/2'
    },
    {
      id: '3',
      type: 'info',
      title: 'New Lead',
      message: 'Mike Davis added from web form',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      url: '/contacts/3'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Navigation
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contacts', href: '/contacts', icon: Users },
    { name: 'Deals', href: '/deals', icon: DollarSign },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    // Mock search results (replace with Supabase query)
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'contact',
        title: 'John Smith',
        subtitle: 'john.smith@example.com',
        url: '/contacts/1'
      },
      {
        id: '2',
        type: 'deal',
        title: 'Enterprise Deal',
        subtitle: '$50,000 • In Progress',
        url: '/deals/1'
      },
      {
        id: '3',
        type: 'task',
        title: 'Follow up with Sarah',
        subtitle: 'Due today',
        url: '/tasks/1'
      }
    ].filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Get search icon
  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Users className="w-4 h-4" />;
      case 'deal': return <TrendingUp className="w-4 h-4" />;
      case 'task': return <CheckSquare className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  // Get notification color
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-accent-400 bg-accent-500/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'error': return 'text-error bg-error/10';
      default: return 'text-primary-400 bg-primary-500/10';
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-dark-400/80 backdrop-blur-xl border-b border-primary-500/20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left - Logo & Nav */}
            <div className="flex items-center gap-6">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-dark-300/50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </button>

              {/* Logo */}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-dark-500" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                    VoltCRM
                  </h1>
                  <p className="text-xs text-gray-400 -mt-0.5">AI-Powered</p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary-500/10 text-primary-400 shadow-glow-cyan'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-dark-300/50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right - Search, Notifications, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-dark-300/50 transition-all"
                >
                  <Search size={20} />
                </button>

                {/* Search Dropdown */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-300/95 backdrop-blur-xl border border-primary-500/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-primary-500/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="Search contacts, deals, tasks..."
                          className="w-full pl-10 pr-4 py-2 bg-dark-200 border border-primary-500/20 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-96 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((result) => (
                            <Link
                              key={result.id}
                              to={result.url}
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-200/50 transition-colors group"
                            >
                              <div className="p-2 bg-primary-500/10 text-primary-400 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                                {getSearchIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-200 truncate">
                                  {result.title}
                                </p>
                                {result.subtitle && (
                                  <p className="text-xs text-gray-400 truncate">
                                    {result.subtitle}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : searchQuery ? (
                        <div className="p-8 text-center">
                          <p className="text-gray-400">No results found</p>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Search className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Start typing to search</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-primary-400 rounded-lg hover:bg-dark-300/50 transition-all"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-300/95 backdrop-blur-xl border border-primary-500/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-primary-500/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-gray-200">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs font-bold rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to={notification.url || '#'}
                          onClick={() => setIsNotificationsOpen(false)}
                          className={`block p-4 border-b border-primary-500/5 hover:bg-dark-200/50 transition-colors ${
                            !notification.read ? 'bg-primary-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-200 mb-0.5">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-400 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="p-3 border-t border-primary-500/10">
                      <button className="w-full text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-dark-300/50 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-dark-500 font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-300 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-dark-300/95 backdrop-blur-xl border border-primary-500/20 rounded-xl shadow-2xl overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-primary-500/10">
                      <p className="text-sm font-bold text-gray-200">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-gray-100 hover:bg-dark-200/50 transition-colors"
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/help"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-gray-100 hover:bg-dark-200/50 transition-colors"
                      >
                        <HelpCircle size={18} />
                        <span>Help & Support</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-primary-500/10">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-dark-500/95 backdrop-blur-xl">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary-500/20">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-dark-500" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  VoltCRM
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-dark-400"
              >
                <X className="w-6 h-6 text-gray-300" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 text-base font-medium transition-all ${
                      active
                        ? 'bg-primary-500/10 text-primary-400 shadow-glow-cyan'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-dark-400'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
