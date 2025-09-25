import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import type { NotificationState } from '../../types';
import Button from './Button';

interface NotificationProps {
  notification: NotificationState;
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const Notification: React.FC<NotificationProps> = ({
  notification,
  onClose,
  position = 'top-right',
}) => {
  const { id, type, title, message, duration, isVisible } = notification;

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${positionClasses[position]}
        animate-in slide-in-from-bottom
      `}
    >
      <div
        className={`
          rounded-lg border p-4 shadow-lg
          ${config.bgColor} ${config.borderColor}
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <h4 className={`text-sm font-medium ${config.titleColor}`}>
              {title}
            </h4>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>
                {message}
              </p>
            )}
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClose(id)}
              className="p-1 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
