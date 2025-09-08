import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

export const FormInput: React.FC<Props> = ({
  label,
  error,
  icon,
  helper,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="input-group">
        {icon && (
          <div className="input-group-icon">
            {icon}
          </div>
        )}
        
        <input
          {...props}
          className={`form-input ${icon ? 'pl-10' : ''} ${error ? 'border-red-300' : ''} ${className}`}
        />

        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="text-red-500" size={20} />
          </div>
        )}
      </div>

      {(error || helper) && (
        <div className="mt-1">
          {error ? (
            <p className="form-error">{error}</p>
          ) : helper ? (
            <p className="text-sm text-gray-500">{helper}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};