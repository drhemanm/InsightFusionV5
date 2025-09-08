import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AlertCircle } from 'lucide-react';

export const GoogleSignInButton: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/dashboard');
      } else if (result.redirected) {
        // User was redirected to Google sign-in, no error needed
        return;
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className="space-y-3">
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

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};