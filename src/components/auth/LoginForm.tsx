import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Brain, Eye, EyeOff, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithEmail(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('🔐 Starting Google sign-in...');
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Google sign-in initiated successfully');
        // Note: User will be redirected by Supabase OAuth flow
        // No need to manually navigate here
      } else {
        console.error('❌ Google sign-in failed:', result.error);
        // Error is already set in the auth store
      }
    } catch (error) {
      console.error('❌ Unexpected Google sign-in error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block text-white space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  InsightFusion CRM
                </h1>
                <p className="text-blue-200 text-lg">AI-Powered Customer Intelligence</p>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Transform your sales process with intelligent insights, automated workflows, and powerful collaboration tools designed for modern businesses.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI-Powered Insights</h3>
                <p className="text-sm text-gray-300">Smart recommendations and predictive analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Enterprise Security</h3>
                <p className="text-sm text-gray-300">Bank-grade security with advanced encryption</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Seamless Integration</h3>
                <p className="text-sm text-gray-300">Connect with 200+ business tools</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="relative">
            {/* Glassmorphism Card */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 rounded-2xl"></div>
            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
              
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-3">
                  <Brain className="h-10 w-10 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">InsightFusion</h1>
                    <p className="text-sm text-gray-600">AI-Powered CRM</p>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to access your dashboard</p>
              </div>

              <div className="space-y-6">
                {/* Google Sign In */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-6 py-4 font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-3">
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100/50"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100/50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        {error}
                      </div>
                    </div>
                  )}

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span>{isLoading ? 'Signing in...' : 'Sign in to Dashboard'}</span>
                      {!isLoading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </form>

                {/* Sign Up Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                    >
                      Create your account
                    </Link>
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="pt-6">
                  <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>99.9% Uptime</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};