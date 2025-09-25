import React from 'react';
import { Loader2 } from 'lucide-react';
import type {
  InteractiveComponentProps,
  Size,
  ColorVariant,
  ButtonVariant
} from '../../types';

interface ButtonProps extends InteractiveComponentProps {
  variant?: ButtonVariant;
  size?: Size;
  color?: ColorVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'solid',
  size = 'md',
  color = 'primary',
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  onFocus,
  onBlur,
  id,
  testId,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    solid: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600 hover:border-primary-700 focus:ring-primary-500',
      secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900 border-secondary-300 hover:border-secondary-400 focus:ring-secondary-500',
      success: 'bg-success-600 hover:bg-success-700 text-white border-success-600 hover:border-success-700 focus:ring-success-500',
      warning: 'bg-warning-600 hover:bg-warning-700 text-white border-warning-600 hover:border-warning-700 focus:ring-warning-500',
      error: 'bg-error-600 hover:bg-error-700 text-white border-error-600 hover:border-error-700 focus:ring-error-500',
      neutral: 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-700 focus:ring-gray-500',
    },
    outline: {
      primary: 'bg-transparent hover:bg-primary-50 text-primary-700 border-primary-300 hover:border-primary-400 focus:ring-primary-500',
      secondary: 'bg-transparent hover:bg-secondary-50 text-secondary-700 border-secondary-300 hover:border-secondary-400 focus:ring-secondary-500',
      success: 'bg-transparent hover:bg-success-50 text-success-700 border-success-300 hover:border-success-400 focus:ring-success-500',
      warning: 'bg-transparent hover:bg-warning-50 text-warning-700 border-warning-300 hover:border-warning-400 focus:ring-warning-500',
      error: 'bg-transparent hover:bg-error-50 text-error-700 border-error-300 hover:border-error-400 focus:ring-error-500',
      neutral: 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-gray-500',
    },
    ghost: {
      primary: 'bg-transparent hover:bg-primary-100 text-primary-700 border-transparent focus:ring-primary-500',
      secondary: 'bg-transparent hover:bg-secondary-100 text-secondary-700 border-transparent focus:ring-secondary-500',
      success: 'bg-transparent hover:bg-success-100 text-success-700 border-transparent focus:ring-success-500',
      warning: 'bg-transparent hover:bg-warning-100 text-warning-700 border-transparent focus:ring-warning-500',
      error: 'bg-transparent hover:bg-error-100 text-error-700 border-transparent focus:ring-error-500',
      neutral: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent focus:ring-gray-500',
    },
    link: {
      primary: 'bg-transparent hover:bg-transparent text-primary-600 hover:text-primary-700 border-transparent underline focus:ring-primary-500',
      secondary: 'bg-transparent hover:bg-transparent text-secondary-600 hover:text-secondary-700 border-transparent underline focus:ring-secondary-500',
      success: 'bg-transparent hover:bg-transparent text-success-600 hover:text-success-700 border-transparent underline focus:ring-success-500',
      warning: 'bg-transparent hover:bg-transparent text-warning-600 hover:text-warning-700 border-transparent underline focus:ring-warning-500',
      error: 'bg-transparent hover:bg-transparent text-error-600 hover:text-error-700 border-transparent underline focus:ring-error-500',
      neutral: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-700 border-transparent underline focus:ring-gray-500',
    },
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const classes = [
    baseClasses,
    variantClasses[variant][color],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      id={id}
      data-testid={testId}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
