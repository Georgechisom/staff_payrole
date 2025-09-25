import React from 'react';
import {
  Home,
  Users,
  CreditCard,
  Wallet,
  Settings,
  Shield,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks';
import type { MenuItem } from '../../types';
import { Button, Badge } from '../ui';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, canAccessAdmin, canManageEmployees, canProcessPayments, canManageTreasury } = useAuth();

  // Define menu items based on user permissions
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/',
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: <Users className="w-5 h-5" />,
      path: '/employees',
      permissions: ['read:employees'],
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/payments',
      permissions: ['read:payments'],
    },
    {
      id: 'treasury',
      label: 'Treasury',
      icon: <Wallet className="w-5 h-5" />,
      path: '/treasury',
      permissions: ['read:treasury'],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/reports',
      permissions: ['read:reports'],
    },
    {
      id: 'admin',
      label: 'Administration',
      icon: <Shield className="w-5 h-5" />,
      path: '/admin',
      permissions: ['read:admin'],
      children: [
        {
          id: 'company-settings',
          label: 'Company Settings',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/company',
        },
        {
          id: 'user-roles',
          label: 'User Roles',
          icon: <Users className="w-4 h-4" />,
          path: '/admin/roles',
        },
        {
          id: 'system-settings',
          label: 'System Settings',
          icon: <Settings className="w-4 h-4" />,
          path: '/admin/system',
        },
      ],
    },
  ];

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.permissions) return true;
    
    // Check permissions based on user role
    if (item.id === 'employees' && !canManageEmployees()) return false;
    if (item.id === 'payments' && !canProcessPayments()) return false;
    if (item.id === 'treasury' && !canManageTreasury()) return false;
    if (item.id === 'admin' && !canAccessAdmin()) return false;
    
    return true;
  });

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
      <div key={item.id} className={isChild ? 'ml-4' : ''}>
        <Button
          variant="ghost"
          className={`
            w-full justify-start px-3 py-2 mb-1
            ${isChild ? 'text-sm' : ''}
            hover:bg-secondary-100 text-secondary-700 hover:text-secondary-900
          `}
          onClick={() => {
            if (hasChildren) {
              setIsExpanded(!isExpanded);
            } else {
              // Navigate to path
              console.log('Navigate to:', item.path);
            }
          }}
        >
          <div className="flex items-center flex-1">
            {item.icon && (
              <span className={`${isCollapsed ? '' : 'mr-3'}`}>
                {item.icon}
              </span>
            )}
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={item.badge.color}
                    size="xs"
                    className="ml-2"
                  >
                    {item.badge.text}
                  </Badge>
                )}
                {hasChildren && (
                  <ChevronRight
                    className={`w-4 h-4 ml-2 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                )}
              </>
            )}
          </div>
        </Button>

        {/* Render children */}
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="ml-4 space-y-1">
            {item.children!.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`
        bg-white border-r border-secondary-200 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        flex flex-col h-full
      `}
    >
      {/* Sidebar header */}
      <div className="p-4 border-b border-secondary-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-secondary-900">
                Menu
              </h2>
              {user && (
                <p className="text-sm text-secondary-500">
                  Welcome back!
                </p>
              )}
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-2"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* Sidebar footer */}
      <div className="p-4 border-t border-secondary-200">
        {!isCollapsed && (
          <div className="text-xs text-secondary-500 text-center">
            <p>Decentralized Payroll v1.0</p>
            <p>Built on Stacks</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
