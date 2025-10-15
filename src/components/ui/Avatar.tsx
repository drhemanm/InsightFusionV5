import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  showStatus = false,
  className = '',
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const statusColors = {
    online: 'bg-accent-400',
    offline: 'bg-gray-500',
    away: 'bg-warning',
    busy: 'bg-error'
  };

  // Generate initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div
        className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500`}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image and show fallback
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : name ? (
          <span className="font-bold text-dark-500">
            {getInitials(name)}
          </span>
        ) : (
          <User className="w-1/2 h-1/2 text-dark-500" />
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && status && (
        <span
          className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-dark-400`}
        />
      )}
    </div>
  );
};

// Avatar Group Component
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md'
}) => {
  const childrenArray = React.Children.toArray(children);
  const displayedChildren = childrenArray.slice(0, max);
  const remaining = childrenArray.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {displayedChildren.map((child, index) => (
        <div
          key={index}
          className="relative ring-2 ring-dark-400 rounded-full"
          style={{ zIndex: displayedChildren.length - index }}
        >
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className="relative ring-2 ring-dark-400 rounded-full"
          style={{ zIndex: 0 }}
        >
          <Avatar
            name={`+${remaining}`}
            size={size}
            className="bg-dark-300"
          />
        </div>
      )}
    </div>
  );
};
