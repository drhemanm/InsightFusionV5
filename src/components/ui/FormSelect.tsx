import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: React.FC<Props> = ({
  label,
  error,
  icon,
  helper,
  options,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <select
          {...props}
          className={`
            block w-full rounded-lg border-gray-300 shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            appearance-none
            ${icon ? 'pl-10' : 'pl-4'} pr-10 py-2.5
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={20} />
        </div>
      </div>

      {(error || helper) && (
        <div className="text-sm mt-1">
          {error ? (
            <p className="text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {error}
            </p>
          ) : helper ? (
            <p className="text-gray-500">{helper}</p>
          ) : null}
        </div>
      )}
    </div>
  );
};