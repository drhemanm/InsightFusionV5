import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Brain } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { FormInput } from '../ui/FormInput';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email, password);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <Brain className="mx-auto h-12 w-12 text-blue-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>

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
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail size={20} />}
                placeholder="you@example.com"
              />

              <FormInput
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                placeholder="••••••••"
              />

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="form-button"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>
              {' '}
              <Link to="/register" className="text-blue-500 hover:text-blue-600 font-medium">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};