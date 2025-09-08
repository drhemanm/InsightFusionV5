import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from './AuthLayout';
import { EmailPasswordForm } from './EmailPasswordForm';
import { GoogleSignInButton } from './GoogleSignInButton';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();
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

  return (
    <AuthLayout 
      title="Create Account"
      subtitle="Join InsightFusion CRM to streamline your workflow"
    >
      <div className="space-y-6">
        <GoogleSignInButton />

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
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-600 bg-black/30 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-600 bg-black/30 text-white"
              />
            </div>
          </div>

          <EmailPasswordForm
            email={formData.email}
            password={formData.password}
            onEmailChange={(email) => setFormData({ ...formData, email })}
            onPasswordChange={(password) => setFormData({ ...formData, password })}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </AuthLayout>
  );
};