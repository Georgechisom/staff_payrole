// Contract-related types and interfaces

export interface Employee {
  employeeId: string;
  salaryAmount: bigint;
  paymentToken: string;
  paymentFrequency: PaymentFrequency;
  lastPaymentBlock: bigint;
  nextPaymentDue: bigint;
  status: EmployeeStatus;
  totalPaid: bigint;
  department: string;
  startBlock: bigint;
}

export interface PaymentRecord {
  employee: string;
  amount: bigint;
  token: string;
  blockHeight: bigint;
  paymentType: PaymentType;
  notes: string;
}

export interface CompanyInfo {
  name: string;
  id: bigint;
  totalEmployees: bigint;
  totalPayments: bigint;
  paused: boolean;
}

export interface PendingWithdrawal {
  amount: bigint;
  requestBlock: bigint;
}

// Enums as const objects for better TypeScript compatibility
export const PaymentFrequency = {
  WEEKLY: 1,
  BIWEEKLY: 2,
  MONTHLY: 3,
} as const;

export type PaymentFrequency = typeof PaymentFrequency[keyof typeof PaymentFrequency];

export const EmployeeStatus = {
  ACTIVE: 1,
  INACTIVE: 2,
  SUSPENDED: 3,
  TERMINATED: 4,
} as const;

export type EmployeeStatus = typeof EmployeeStatus[keyof typeof EmployeeStatus];

export const UserRole = {
  ADMIN: 1,
  HR: 2,
  FINANCE: 3,
  EMPLOYEE: 4,
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const PaymentType = {
  SALARY: "SALARY",
  BONUS: "BONUS",
  EMERGENCY: "EMERGENCY",
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

// Contract function parameters
export interface AddEmployeeParams {
  employeeAddress: string;
  employeeId: string;
  salary: bigint;
  token: string;
  frequency: PaymentFrequency;
  department: string;
}

export interface UpdateEmployeeSalaryParams {
  employee: string;
  newSalary: bigint;
}

export interface UpdateEmployeeStatusParams {
  employee: string;
  newStatus: EmployeeStatus;
}

export interface ProcessSalaryPaymentParams {
  employee: string;
  token: string;
}

export interface ProcessBonusPaymentParams {
  employee: string;
  amount: bigint;
  token: string;
  notes: string;
}

export interface ProcessEmergencyPaymentParams {
  employee: string;
  amount: bigint;
  token: string;
  reason: string;
}

export interface DepositFundsParams {
  amount: bigint;
  token: string;
}

export interface RequestEmergencyWithdrawalParams {
  amount: bigint;
  token: string;
}

export interface ExecuteEmergencyWithdrawalParams {
  requester: string;
  token: string;
}

export interface SetUserRoleParams {
  user: string;
  role: UserRole;
}

export interface InitializeCompanyParams {
  name: string;
  id: bigint;
}

// Contract response types
export interface ContractResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TransactionResult {
  txId: string;
  success: boolean;
  error?: string;
}

// Error codes from contract
export enum ContractError {
  ERR_OWNER_ONLY = 100,
  ERR_NOT_AUTHORIZED = 101,
  ERR_EMPLOYEE_NOT_FOUND = 102,
  ERR_EMPLOYEE_EXISTS = 103,
  ERR_INSUFFICIENT_BALANCE = 104,
  ERR_INVALID_AMOUNT = 105,
  ERR_PAYMENT_NOT_DUE = 106,
  ERR_CONTRACT_PAUSED = 107,
  ERR_INVALID_FREQUENCY = 108,
  ERR_EMPLOYEE_INACTIVE = 109,
}

// Contract constants
export const CONTRACT_CONSTANTS = {
  WEEKLY_BLOCKS: 1008n,
  BIWEEKLY_BLOCKS: 2016n,
  MONTHLY_BLOCKS: 4464n,
  EMERGENCY_DELAY_BLOCKS: 144n,
} as const;

// Contract deployment info
export interface ContractDeployment {
  contractAddress: string;
  contractName: string;
  deployer: string;
  network: 'mainnet' | 'testnet' | 'simnet';
}

// Token info
export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  totalSupply?: bigint;
}

// Network configuration
export interface NetworkConfig {
  name: string;
  url: string;
  chainId: string;
  isTestnet: boolean;
}

// Utility types for contract calls
export type ContractCallOptions = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  senderKey?: string;
  fee?: bigint;
  nonce?: bigint;
  postConditionMode?: number;
  postConditions?: any[];
};

export type ReadOnlyCallOptions = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  senderAddress?: string;
};

// Event types for contract events
export interface ContractEvent {
  type: string;
  data: Record<string, any>;
  blockHeight: number;
  txId: string;
  timestamp: number;
}

export interface EmployeeAddedEvent extends ContractEvent {
  type: 'employee-added';
  data: {
    employee: string;
    employeeId: string;
    salary: bigint;
    token: string;
  };
}

export interface SalaryPaidEvent extends ContractEvent {
  type: 'salary-paid';
  data: {
    employee: string;
    amount: bigint;
    token: string;
    paymentId: bigint;
  };
}

export interface BonusPaidEvent extends ContractEvent {
  type: 'bonus-paid';
  data: {
    employee: string;
    amount: bigint;
    token: string;
    paymentId: bigint;
  };
}

export interface EmergencyPaymentEvent extends ContractEvent {
  type: 'emergency-payment';
  data: {
    employee: string;
    amount: bigint;
    token: string;
    paymentId: bigint;
    reason: string;
  };
}

export interface FundsDepositedEvent extends ContractEvent {
  type: 'funds-deposited';
  data: {
    depositor: string;
    amount: bigint;
    token: string;
  };
}

export interface WithdrawalRequestedEvent extends ContractEvent {
  type: 'withdrawal-requested';
  data: {
    requester: string;
    amount: bigint;
    token: string;
  };
}

export interface EmergencyWithdrawalEvent extends ContractEvent {
  type: 'emergency-withdrawal';
  data: {
    requester: string;
    amount: bigint;
    token: string;
  };
}

export interface SalaryUpdatedEvent extends ContractEvent {
  type: 'salary-updated';
  data: {
    employee: string;
    newSalary: bigint;
  };
}

export interface StatusUpdatedEvent extends ContractEvent {
  type: 'status-updated';
  data: {
    employee: string;
    newStatus: EmployeeStatus;
  };
}

export interface EmployeeRemovedEvent extends ContractEvent {
  type: 'employee-removed';
  data: {
    employee: string;
    employeeId: string;
  };
}

// Union type for all contract events
export type PayrollContractEvent = 
  | EmployeeAddedEvent
  | SalaryPaidEvent
  | BonusPaidEvent
  | EmergencyPaymentEvent
  | FundsDepositedEvent
  | WithdrawalRequestedEvent
  | EmergencyWithdrawalEvent
  | SalaryUpdatedEvent
  | StatusUpdatedEvent
  | EmployeeRemovedEvent;
