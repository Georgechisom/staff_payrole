import React from 'react';
import type { BaseComponentProps, Size } from '../../types';

interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: Size;
  rounded?: boolean;
  dot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  rounded = false,
  dot = false,
  id,
  testId,
  ...props
}) => {
  const baseClasses = 'badge inline-flex items-center font-medium';
  
  const variantClasses = {
    default: 'badge-default',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    outline: 'badge-outline',
  };

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
    xl: 'px-4 py-1 text-base',
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      id={id}
      data-testid={testId}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5" />
      )}
      {children}
    </span>
  );
};

export default Badge;
