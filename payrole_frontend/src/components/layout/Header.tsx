import React from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useWallet, useAuth, useNotifications } from '../../hooks';
import { Button, Badge, Dropdown } from '../ui';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  showMenuButton = true,
}) => {
  const { disconnect, address } = useWallet();
  const { user, isAuthenticated, getRoleDisplayName } = useAuth();
  const { notifications } = useNotifications();

  const unreadNotifications = notifications.filter(n => n.isVisible).length;

  const userMenuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        // Navigate to profile
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {
        // Navigate to settings
      },
    },
    {
      id: 'divider',
      label: '',
      icon: null,
      onClick: () => {},
      divider: true,
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: <LogOut className="w-4 h-4" />,
      onClick: disconnect,
    },
  ];

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">
              Decentralized Payroll
            </h1>
            <Badge variant="secondary" size="sm">
              Beta
            </Badge>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <Badge
                  variant="error"
                  size="xs"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </div>

          {/* User menu */}
          {isAuthenticated && user ? (
            <Dropdown
              trigger={
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-secondary-900">
                      {formatAddress(address || '')}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {getRoleDisplayName(user.role)}
                    </div>
                  </div>
                </Button>
              }
              items={userMenuItems}
              align="right"
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Connect wallet
              }}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
