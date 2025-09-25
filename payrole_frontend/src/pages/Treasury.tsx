import React from 'react';
import { Wallet, Plus, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';

const Treasury: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Treasury</h1>
          <p className="text-secondary-600 mt-1">
            Manage treasury funds, deposits, and withdrawals for payroll operations.
          </p>
        </div>
        
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          Deposit Funds
        </Button>
      </div>

      {/* Treasury Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Total Balance
              </p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                0 STX
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary-100">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Monthly Outflow
              </p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                0 STX
              </p>
            </div>
            <div className="p-3 rounded-lg bg-error-100">
              <ArrowUpRight className="w-6 h-6 text-error-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">
                Monthly Inflow
              </p>
              <p className="text-2xl font-bold text-secondary-900 mt-1">
                0 STX
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success-100">
              <ArrowDownLeft className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Supported Tokens */}
      <Card>
        <Card.Header title="Supported Tokens" />
        <Card.Body>
          <div className="text-center py-12">
            <Wallet className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No tokens configured
            </h3>
            <p className="text-secondary-600 mb-4">
              Add supported tokens to start managing treasury funds.
            </p>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Add Token
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <Card.Header title="Recent Transactions" />
        <Card.Body>
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No transactions yet
            </h3>
            <p className="text-secondary-600 mb-4">
              Treasury transaction history will appear here.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Treasury;
