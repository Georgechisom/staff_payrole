import React from "react";
import {
  Users,
  CreditCard,
  Wallet,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, Badge, Button } from "../components/ui";
import { WalletStatus } from "../components/wallet";
import { useAuth, useEmployees, usePayments, useTreasury } from "../hooks";

const Dashboard: React.FC = () => {
  const { user, getRoleDisplayName } = useAuth();
  const { employees, getEmployeeStats } = useEmployees();
  const { getPaymentSummary } = usePayments();
  const { getTreasuryStats } = useTreasury();

  const employeeStats = getEmployeeStats();
  const paymentSummary = getPaymentSummary();
  const treasuryStats = getTreasuryStats();

  const dashboardCards = [
    {
      title: "Total Employees",
      value: employeeStats.total.toString(),
      change: { value: 12, type: "increase" as const, period: "this month" },
      icon: <Users className="w-6 h-6" />,
      color: "primary" as const,
    },
    {
      title: "Active Employees",
      value: employeeStats.active.toString(),
      change: { value: 5, type: "increase" as const, period: "this week" },
      icon: <CheckCircle className="w-6 h-6" />,
      color: "success" as const,
    },
    {
      title: "Total Payments",
      value: paymentSummary.stats.total.toString(),
      change: { value: 8, type: "increase" as const, period: "this month" },
      icon: <CreditCard className="w-6 h-6" />,
      color: "primary" as const,
    },
    {
      title: "Treasury Balance",
      value: `${Number(treasuryStats.totalValue) / 1000000} STX`,
      change: { value: 15, type: "increase" as const, period: "this week" },
      icon: <Wallet className="w-6 h-6" />,
      color: "success" as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "payment",
      title: "Salary payment processed",
      description: "John Doe - Engineering Department",
      time: "2 hours ago",
      status: "success",
    },
    {
      id: 2,
      type: "employee",
      title: "New employee added",
      description: "Jane Smith - Marketing Department",
      time: "4 hours ago",
      status: "info",
    },
    {
      id: 3,
      type: "treasury",
      title: "Treasury deposit",
      description: "10,000 STX deposited",
      time: "6 hours ago",
      status: "success",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment due reminder",
      description: "5 employees have payments due",
      time: "8 hours ago",
      status: "warning",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <CreditCard className="w-4 h-4" />;
      case "employee":
        return <Users className="w-4 h-4" />;
      case "treasury":
        return <Wallet className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "error":
        return "error";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">
            Welcome back! Here's what's happening with your payroll system.
          </p>
        </div>

        {user && (
          <div className="text-right">
            <p className="text-sm text-secondary-500">Logged in as</p>
            <p className="font-medium text-secondary-900">
              {getRoleDisplayName(user.role)}
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">
                  {card.value}
                </p>
                {card.change && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-success-600 mr-1" />
                    <span className="text-xs text-success-600">
                      +{card.change.value}% {card.change.period}
                    </span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                <div className={`text-${card.color}-600`}>{card.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header
              title="Recent Activity"
              action={
                <Button variant="outline" size="sm">
                  View All
                </Button>
              }
            />
            <Card.Body padding="none">
              <div className="divide-y divide-secondary-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-secondary-50">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-2 rounded-lg bg-${getStatusColor(
                          activity.status
                        )}-100`}
                      >
                        <div
                          className={`text-${getStatusColor(
                            activity.status
                          )}-600`}
                        >
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {activity.description}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 text-secondary-400 mr-1" />
                          <span className="text-xs text-secondary-500">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={getStatusColor(activity.status)}
                        size="sm"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Wallet Status */}
        <div>
          <WalletStatus />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header title="Quick Actions" />
        <Card.Body>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">Add Employee</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="w-6 h-6 mb-2" />
              <span className="text-sm">Process Payment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Wallet className="w-6 h-6 mb-2" />
              <span className="text-sm">Deposit Funds</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
