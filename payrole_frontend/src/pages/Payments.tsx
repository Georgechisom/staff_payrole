import React from 'react';
import { CreditCard, Plus, Search, Filter } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';

const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Payments</h1>
          <p className="text-secondary-600 mt-1">
            Process and track salary payments, bonuses, and emergency payments.
          </p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Process Payment
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search payments..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            Filters
          </Button>
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <Card.Header title="Payment History" />
        <Card.Body>
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No payments found
            </h3>
            <p className="text-secondary-600 mb-4">
              Payment history will appear here once you start processing payments.
            </p>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Process Payment
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Payments;
