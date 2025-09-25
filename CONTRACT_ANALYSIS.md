# Decentralized Payroll Smart Contract Analysis

## Contract Overview
- **Contract Name**: pay_role.clar
- **Network**: Stacks Blockchain
- **Token Standard**: SIP-010 (Fungible Token)

## Constants & Error Codes

### Error Codes
- `err-owner-only` (100): Only contract owner can perform this action
- `err-not-authorized` (101): User lacks required permissions
- `err-employee-not-found` (102): Employee record doesn't exist
- `err-employee-exists` (103): Employee already exists
- `err-insufficient-balance` (104): Insufficient treasury balance
- `err-invalid-amount` (105): Invalid amount provided
- `err-payment-not-due` (106): Payment not yet due
- `err-contract-paused` (107): Contract is paused
- `err-invalid-frequency` (108): Invalid payment frequency
- `err-employee-inactive` (109): Employee is not active

### Role Constants
- `role-admin` (1): Administrator role
- `role-hr` (2): Human Resources role
- `role-finance` (3): Finance role
- `role-employee` (4): Employee role

### Payment Frequencies
- `weekly-blocks` (1008): ~1 week in blocks
- `biweekly-blocks` (2016): ~2 weeks in blocks
- `monthly-blocks` (4464): ~1 month in blocks

## Data Structures

### Employee Record
```typescript
interface Employee {
  employeeId: string;           // max 20 chars
  salaryAmount: number;         // uint
  paymentToken: string;         // principal
  paymentFrequency: number;     // 1=weekly, 2=biweekly, 3=monthly
  lastPaymentBlock: number;     // uint
  nextPaymentDue: number;       // uint
  status: number;               // 1=active, 2=inactive, 3=suspended, 4=terminated
  totalPaid: number;            // uint
  department: string;           // max 30 chars
  startBlock: number;           // uint
}
```

### Payment Record
```typescript
interface PaymentRecord {
  employee: string;             // principal
  amount: number;               // uint
  token: string;                // principal
  blockHeight: number;          // uint
  paymentType: string;          // "SALARY", "BONUS", "EMERGENCY"
  notes: string;                // max 100 chars
}
```

### Company Info
```typescript
interface CompanyInfo {
  name: string;                 // max 50 chars
  id: number;                   // uint
  totalEmployees: number;       // uint
  totalPayments: number;        // uint
  paused: boolean;              // bool
}
```

## Public Functions

### Admin Functions
1. **initialize-company** (name, id)
   - Initializes company information
   - Requires: Contract owner
   - Parameters: company name (string-ascii 50), company id (uint)

2. **set-user-role** (user, role)
   - Assigns role to user
   - Requires: Admin role
   - Parameters: user principal, role (1-4)

3. **pause-contract** / **unpause-contract**
   - Emergency contract controls
   - Requires: Admin role

4. **add-supported-token** (token)
   - Adds supported payment token
   - Requires: Admin role
   - Parameters: token principal

### Employee Management (HR Functions)
1. **add-employee** (address, id, salary, token, frequency, department)
   - Adds new employee
   - Requires: HR role
   - Parameters: employee address, employee ID, salary amount, payment token, frequency, department

2. **update-employee-salary** (employee, new-salary)
   - Updates employee salary
   - Requires: HR role

3. **update-employee-status** (employee, new-status)
   - Updates employee status
   - Requires: HR role

4. **remove-employee** (employee)
   - Removes employee from system
   - Requires: HR role

### Payment Functions (Finance Functions)
1. **process-salary-payment** (employee, token)
   - Processes regular salary payment
   - Requires: Finance role
   - Auto-calculates next payment due date

2. **process-bonus-payment** (employee, amount, token, notes)
   - Processes bonus payment
   - Requires: Finance role

3. **process-emergency-payment** (employee, amount, token, reason)
   - Processes emergency payment
   - Requires: Admin role

### Treasury Management
1. **deposit-funds** (amount, token)
   - Deposits funds to treasury
   - Requires: Finance role

2. **request-emergency-withdrawal** (amount, token)
   - Requests emergency withdrawal
   - Requires: Admin role

3. **execute-emergency-withdrawal** (requester, token)
   - Executes emergency withdrawal after delay
   - Requires: Admin role

## Read-Only Functions

1. **get-employee-info** (employee) → Employee | null
2. **get-employee-by-id** (employee-id) → Employee | null
3. **get-treasury-balance** (token) → number
4. **get-payment-record** (payment-id) → PaymentRecord | null
5. **get-user-role** (user) → number
6. **is-payment-due** (employee) → boolean
7. **get-company-info** () → CompanyInfo
8. **is-supported-token** (token) → boolean

## Frontend Integration Requirements

### Required Stacks.js Packages
- @stacks/connect (wallet connection)
- @stacks/transactions (contract calls)
- @stacks/network (network configuration)
- @stacks/auth (authentication)

### Contract Deployment Info
- **Deployer**: ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
- **Contract Name**: pay_role
- **Trait Contract**: sip-010-trait
- **Mock Token**: mock-token (for testing)

### Key Frontend Features Needed
1. Role-based access control
2. Real-time payment due notifications
3. Treasury balance monitoring
4. Payment history tracking
5. Employee management interface
6. Multi-token support
7. Emergency controls
8. Responsive dashboard design
