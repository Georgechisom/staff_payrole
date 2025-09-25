import { useState, useCallback } from 'react';
import type { NotificationState } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(2, 11);
    const notification: NotificationState = {
      id,
      type,
      title,
      message,
      duration,
      isVisible: true,
      timestamp: Date.now(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('success', title, message, duration);
  }, [addNotification]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('error', title, message, duration);
  }, [addNotification]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('warning', title, message, duration);
  }, [addNotification]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    return addNotification('info', title, message, duration);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
  };
};
