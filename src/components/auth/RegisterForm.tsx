import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Brain, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle, isLoading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score++;
    else feedback.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('One uppercase letter');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('One lowercase letter');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('One number');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('One special character');

    setPasswordStrength({ score, feedback });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    checkPasswordStrength(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    const success = await register(formData.email, formData.password, formData.firstName, formData.lastName);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log('🔐 Starting Google sign-up...');
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Google sign-up initiated successfully');
        // OAuth redirect will handle navigation
      } else {
        console.error('❌ Google sign-up failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Unexpected Google sign-up error:', error);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-red-500';
    if (passwordStrength.score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Medium';
    return 'Strong';
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
                  Join InsightFusion
                </h1>
                <p className="text-blue-200 text-lg">Start Your CRM Journey</p>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Join thousands of businesses already using InsightFusion to accelerate their sales, improve customer relationships, and drive growth.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Free 14-Day Trial</h3>
                <p className="text-sm text-gray-300">No credit card required to get started</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Setup in Minutes</h3>
                <p className="text-sm text-gray-300">Quick onboarding and data import</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">24/7 Support</h3>
                <p className="text-sm text-gray-300">Expert help whenever you need it</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">Start your free trial today</p>
              </div>

              <div className="space-y-6">
                {/* Google Sign Up */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl px-6 py-4 font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
                >
                  <div className="flex items-center justify-center gap-3">
                    <img 
                      src="https://www.google.com/favicon.ico" 
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Continue with Google</span>
                  </div>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or create with email</span>
                  </div>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="John"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="block w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        value={formData.password}
                        onChange={handlePasswordChange}
                        className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score <= 2 ? 'text-red-600' :
                            passwordStrength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {getStrengthLabel()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          ></div>
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Missing: {passwordStrength.feedback.join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Confirm your password"
                      />
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                    )}
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Registration Error</div>
                          <div className="text-sm">{error}</div>
                          {error.includes('connect') && (
                            <div className="text-xs mt-1 text-red-600">
                              Try refreshing the page or check your internet connection
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !acceptTerms || formData.password !== formData.confirmPassword || passwordStrength.score < 3}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <span>{isLoading ? 'Creating Account...' : 'Create Your Account'}</span>
                      {!isLoading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                    >
                      Sign in here
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
                      <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>SOC 2 Certified</span>
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