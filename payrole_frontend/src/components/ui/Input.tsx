import React, { forwardRef } from 'react';
import type { BaseComponentProps, Size, InputVariant } from '../../types';

interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  size?: Size;
  variant?: InputVariant;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  placeholder,
  value,
  defaultValue,
  size = 'md',
  variant = 'outline',
  disabled = false,
  readOnly = false,
  required = false,
  error = false,
  errorMessage,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  name,
  autoComplete,
  autoFocus,
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
  id,
  testId,
  ...props
}, ref) => {
  const baseClasses = 'input';
  
  const sizeClasses = {
    xs: 'h-8 px-2 text-xs',
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-11 px-4 text-base',
    xl: 'h-12 px-4 text-lg',
  };

  const variantClasses = {
    outline: 'border border-gray-300',
    filled: 'bg-gray-100 border-transparent',
    flushed: 'border-0 border-b border-gray-300 rounded-none',
    unstyled: 'border-0 bg-transparent',
  };

  const stateClasses = {
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    disabled: 'opacity-50 cursor-not-allowed',
    readOnly: 'bg-gray-50 cursor-default',
  };

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    error ? stateClasses.error : '',
    disabled ? stateClasses.disabled : '',
    readOnly ? stateClasses.readOnly : '',
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {leftIcon}
        </div>
      )}
      
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className={classes}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        name={name}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        maxLength={maxLength}
        minLength={minLength}
        id={id}
        data-testid={testId}
        {...props}
      />
      
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
      
      {(errorMessage || helperText) && (
        <div className="mt-1 text-sm">
          {error && errorMessage && (
            <p className="text-error-600">{errorMessage}</p>
          )}
          {!error && helperText && (
            <p className="text-secondary-600">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
