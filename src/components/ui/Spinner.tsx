import React from 'react';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent';
  text?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  fullScreen = false,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const variants = {
    primary: 'text-primary-400',
    secondary: 'text-gray-400',
    accent: 'text-accent-400'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizes[size]} ${variants[variant]} animate-spin`}
      />
      {text && (
        <p className="text-sm text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-500/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      {spinner}
    </div>
  );
};

// Loading Skeleton Component
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-gradient-to-r from-dark-300 via-dark-200 to-dark-300 bg-[length:200%_100%] animate-shimmer';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, index) => (
        <div
          key={index}
          className={`${baseStyles} ${variants[variant]} ${className} ${
            index < count - 1 ? 'mb-2' : ''
          }`}
          style={style}
          {...props}
        />
      ))}
    </>
  );
};
