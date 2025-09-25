import React from 'react';
import { Loader2 } from 'lucide-react';
import type { BaseComponentProps, Size } from '../../types';

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: Size;
  color?: string;
  text?: string;
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-primary-600',
  text,
  centered = false,
  className = '',
  id,
  testId,
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const containerClasses = [
    centered ? 'flex items-center justify-center' : 'inline-flex items-center',
    className,
  ].filter(Boolean).join(' ');

  const spinnerClasses = [
    'animate-spin',
    sizeClasses[size],
    color,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      id={id}
      data-testid={testId}
      {...props}
    >
      <Loader2 className={spinnerClasses} />
      {text && (
        <span className="ml-2 text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
