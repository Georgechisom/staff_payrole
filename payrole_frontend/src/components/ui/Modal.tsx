import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { BaseComponentProps } from '../../types';
import Button from './Button';

interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

interface ModalHeaderProps extends BaseComponentProps {
  title?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

interface ModalBodyProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface ModalFooterProps extends BaseComponentProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

const Modal: React.FC<ModalProps> & {
  Header: React.FC<ModalHeaderProps>;
  Body: React.FC<ModalBodyProps>;
  Footer: React.FC<ModalFooterProps>;
} = ({
  children,
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = '',
  id,
  testId,
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
      data-testid={testId}
    >
      <div
        className={`
          bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}
          max-h-[90vh] overflow-hidden flex flex-col
          ${className}
        `}
        id={id}
        {...props}
      >
        {(title || showCloseButton) && (
          <Modal.Header
            title={title}
            onClose={onClose}
            showCloseButton={showCloseButton}
          />
        )}
        {children}
      </div>
    </div>
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  title,
  onClose,
  showCloseButton = true,
  className = '',
  id,
  testId,
  ...props
}) => {
  return (
    <div
      className={`
        flex items-center justify-between p-6 border-b border-secondary-200
        ${className}
      `}
      id={id}
      data-testid={testId}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h2 className="text-xl font-semibold text-secondary-900">
            {title}
          </h2>
        )}
        {children}
      </div>
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-4 p-2"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  padding = 'md',
  className = '',
  id,
  testId,
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        flex-1 overflow-y-auto ${paddingClasses[padding]}
        ${className}
      `}
      id={id}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

const ModalFooter: React.FC<ModalFooterProps> = ({
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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        ${paddingClasses[padding]}
        ${border ? 'border-t border-secondary-200' : ''}
        ${className}
      `}
      id={id}
      data-testid={testId}
      {...props}
    >
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
