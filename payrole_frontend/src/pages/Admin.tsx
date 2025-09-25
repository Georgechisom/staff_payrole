import React from 'react';
import { Shield, Settings, Users, AlertTriangle } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';

const Admin: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Administration</h1>
          <p className="text-secondary-600 mt-1">
            Manage system settings, user roles, and company configuration.
          </p>
        </div>
        
        <Badge variant="warning" className="flex items-center">
          <Shield className="w-3 h-3 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-primary-100">
              <Settings className="w-6 h-6 text-primary-600" />
            </div>
            <Badge variant="secondary" size="sm">
              Active
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Company Settings
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Configure company information, payment frequencies, and system preferences.
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Manage Settings
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success-100">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <Badge variant="secondary" size="sm">
              4 Roles
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            User Roles
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Assign and manage user roles and permissions for system access.
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Manage Roles
          </Button>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning-100">
              <AlertTriangle className="w-6 h-6 text-warning-600" />
            </div>
            <Badge variant="warning" size="sm">
              Needs Setup
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Emergency Controls
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Configure emergency withdrawal settings and contract pause controls.
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Configure
          </Button>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <Card.Header title="System Status" />
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Contract Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Contract State</span>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Emergency Mode</span>
                  <Badge variant="secondary" size="sm">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Last Update</span>
                  <span className="text-sm text-secondary-900">2 hours ago</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">System Health</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Network Status</span>
                  <Badge variant="success" size="sm">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">API Status</span>
                  <Badge variant="success" size="sm">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary-600">Last Sync</span>
                  <span className="text-sm text-secondary-900">1 minute ago</span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Admin Actions */}
      <Card>
        <Card.Header title="Recent Admin Actions" />
        <Card.Body>
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No recent actions
            </h3>
            <p className="text-secondary-600">
              Administrative actions will be logged here for audit purposes.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Admin;
