import React from 'react';
import { Users, Plus, Search, Filter } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/ui';

const Employees: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Employees</h1>
          <p className="text-secondary-600 mt-1">
            Manage your organization's employees and their payroll information.
          </p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search employees..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>
      </Card>

      {/* Employee List */}
      <Card>
        <Card.Header title="Employee Directory" />
        <Card.Body>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No employees found
            </h3>
            <p className="text-secondary-600 mb-4">
              Get started by adding your first employee to the system.
            </p>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Add Employee
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Employees;
