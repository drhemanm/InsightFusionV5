import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, User } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    );
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      navigate('/dashboard');
    }
  };
  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Join InsightFusion CRM to streamline your workflow"
    >
      <div className="space-y-6">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">
            {isLoading ? 'Signing up...' : 'Continue with Google'}
          </span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black/50 text-gray-400">
              Or register with email
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="pl-10 block w-full rounded-lg border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 block w-full rounded-lg border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 block w-full rounded-lg border-gray-600 bg-black/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>
            </div>
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-400/10 rounded-lg p-3">
              {error}
            </div>
          )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};