import React from 'react';
import type { BaseComponentProps } from '../../types';

interface CardProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
}

interface CardHeaderProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface CardBodyProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface CardFooterProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  border = true,
  hover = false,
  id,
  testId,
  ...props
}) => {
  const baseClasses = 'bg-white rounded-lg';
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const classes = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    border ? 'border border-gray-200' : '',
    hover ? 'hover:shadow-md transition-shadow duration-200' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      id={id}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  title,
  subtitle,
  action,
  className = '',
  id,
  testId,
  ...props
}) => {
  const classes = [
    'flex items-center justify-between mb-4',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      id={id}
      data-testid={testId}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-secondary-900">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-secondary-600 mt-1">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );
};

const CardBody: React.FC<CardBodyProps> = ({
  children,
  padding = 'none',
  className = '',
  id,
  testId,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const classes = [
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      id={id}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  padding = 'md',
  border = true,
  className = '',
  id,
  testId,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const classes = [
    paddingClasses[padding],
    border ? 'border-t border-secondary-200 mt-4 pt-4' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      id={id}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
