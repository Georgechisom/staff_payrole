import React, { useState } from 'react';
import { useNotifications } from '../../hooks';
import Header from './Header';
import Sidebar from './Sidebar';
import { Notification } from '../ui';
import type { NotificationState } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = true,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { notifications, removeNotification } = useNotifications();

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        onMenuToggle={handleSidebarToggle}
        showMenuButton={showSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={handleSidebarToggle}
          />
        )}

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification: NotificationState) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={removeNotification}
            position="top-right"
          />
        ))}
      </div>
    </div>
  );
};

export default Layout;
