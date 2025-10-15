import React from 'react';
import { X } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  dot = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-all duration-200';

  const variants = {
    default: 'bg-dark-200 text-gray-300 border border-primary-500/20',
    primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    success: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const dotColors = {
    default: 'bg-gray-400',
    primary: 'bg-primary-400',
    success: 'bg-accent-400',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-blue-400'
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-2 h-2 rounded-full ${dotColors[variant]} animate-pulse`}
        />
      )}
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 transition-opacity"
          type="button"
        >
          <X size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
        </button>
      )}
    </span>
  );
};
