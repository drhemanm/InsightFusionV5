import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
}

export const FormSubmitButton: React.FC<Props> = ({
  children,
  loading,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        flex items-center justify-center gap-2 px-6 py-2.5
        text-sm font-medium text-white bg-blue-600 
        rounded-lg shadow-sm
        hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : icon}
      {children}
    </button>
  );
};