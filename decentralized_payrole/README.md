# Decentralized Payroll System

A comprehensive decentralized payroll management system built on the Stacks blockchain using Clarity smart contracts.

## Features

- **Multi-role Management**: Admin, HR, Finance, and Employee roles
- **Flexible Payment Schedules**: Weekly, bi-weekly, and monthly payment options
- **Multi-token Support**: Support for various SIP-010 compliant tokens
- **Automated Payments**: Time-based automatic salary processing
- **Emergency Payments**: Admin-controlled emergency fund withdrawals
- **Comprehensive Audit Trail**: Full payment history and transaction tracking
- **Treasury Management**: Secure fund management with role-based access control

## Contract Architecture

### Core Contracts

1. **pay_role.clar** - Main payroll contract with all business logic
2. **sip-010-trait.clar** - Standard SIP-010 fungible token trait
3. **mock-token.clar** - Test token for development and testing

### Key Functions

#### Administrative Functions

- `initialize-company` - Set up company information
- `set-user-role` - Assign roles to users
- `add-supported-token` - Add payment tokens
- `pause-contract` / `unpause-contract` - Emergency controls

#### Employee Management

- `add-employee` - Onboard new employees
- `update-employee-salary` - Modify employee compensation
- `update-employee-status` - Change employee status
- `remove-employee` - Remove employees from system

#### Payment Processing

- `process-salary-payment` - Execute regular salary payments
- `process-bonus-payment` - Issue bonus payments
- `process-emergency-payment` - Handle emergency payments
- `deposit-funds` - Add funds to treasury

#### Treasury Management

- `request-emergency-withdrawal` - Request emergency fund access
- `execute-emergency-withdrawal` - Execute approved withdrawals

## Deployment

### Prerequisites

1. **Install Clarinet**

   ```bash
   curl -L https://github.com/hirosystems/clarinet/releases/latest/download/clarinet-linux-x64.tar.gz | tar xz
   sudo mv clarinet /usr/local/bin/
   ```

2. **Install Node.js** (for deployment scripts)

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Set up Stacks CLI** (for testnet/mainnet deployment)
   ```bash
   npm install -g @stacks/cli
   stacks config set network testnet  # for testnet deployment
   ```

### Quick Deployment to Testnet

#### Option 1: Using Clarinet Console (Recommended for testing)

```bash
cd decentralized_payrole

# Start Clarinet console
clarinet console

# In the console, deploy contracts:
::deploy_contracts

# Initialize the system
(contract-call? .pay_role initialize-company "Your Company Name" u12345)

# Add your wallet as admin
# Add your wallet as admin (replace with your actual wallet address)
(contract-call? .pay_role set-user-role 'YOUR_ACTUAL_WALLET_ADDRESS u1)

# Add supported token
(contract-call? .pay_role add-supported-token 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token)
```

#### Option 2: Using Deployment Script

```bash
cd decentralized_payrole

# Make deployment script executable
chmod +x scripts/deploy-testnet.js

# Run deployment
node scripts/deploy-testnet.js
```

#### Option 3: Manual Clarinet Deployment

```bash
cd decentralized_payrole

# Generate deployment plan
clarinet deployments generate --devnet

# Apply deployment
clarinet deployments apply

# Check deployment status
clarinet deployments show
```

### Production Deployment to Mainnet

1. **Update deployment configuration**

2. **Deploy to mainnet**

   ```bash
   clarinet deployments generate --mainnet
   clarinet deployments apply
   ```

3. **Verify deployment**
   ```bash
   clarinet deployments show
   ```

## Post-Deployment Setup

### 1. Set Up Admin Roles

```clarity
;; Set yourself as admin
(contract-call? .pay_role set-user-role 'YOUR_ADDRESS u1)

;; Set HR manager
(contract-call? .pay_role set-user-role 'HR_ADDRESS u2)

;; Set Finance manager
(contract-call? .pay_role set-user-role 'FINANCE_ADDRESS u3)
```

### 2. Add Supported Tokens

;; Add SIP-010 compliant tokens (STX is native and doesn't need to be added)
;; Example with a real SIP-010 token:
(contract-call? .pay_role add-supported-token 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wrapped-stx)

;; Add other SIP-010 tokens as needed
(contract-call? .pay_role add-supported-token 'TOKEN_CONTRACT_ADDRESS)

````

### 3. Fund the Treasury

```clarity
;; Deposit tokens to treasury (requires finance role)
(contract-call? .pay_role deposit-funds u1000000 'TOKEN_CONTRACT_ADDRESS)
````

### 4. Add Employees

```clarity
;; Add employee with weekly salary of 1000 tokens
(contract-call? .pay_role add-employee
  'EMPLOYEE_ADDRESS
  "EMP001"
  u1000
  'TOKEN_CONTRACT_ADDRESS
  u1  ;; weekly frequency
  "Engineering"
)
```

## Usage Examples

### Processing Salary Payments

```clarity
;; Process salary for employee (requires finance role)
(contract-call? .pay_role process-salary-payment 'EMPLOYEE_ADDRESS 'TOKEN_CONTRACT_ADDRESS)
```

### Checking Payment Status

```clarity
;; Check if employee payment is due
(contract-call? .pay_role is-payment-due 'EMPLOYEE_ADDRESS)

;; Get employee information
(contract-call? .pay_role get-employee-info 'EMPLOYEE_ADDRESS)
```

### Emergency Operations

```clarity
;; Request emergency withdrawal (admin only)
(contract-call? .pay_role request-emergency-withdrawal u50000 'TOKEN_CONTRACT_ADDRESS)

;; Execute emergency withdrawal after delay (admin only)
(contract-call? .pay_role execute-emergency-withdrawal 'REQUESTER_ADDRESS 'TOKEN_CONTRACT_ADDRESS)
```

## Security Features

- **Role-based Access Control**: Different permission levels for different operations
- **Emergency Controls**: Contract pause/unpause functionality
- **Time-locked Withdrawals**: Emergency withdrawals require delay period
- **Audit Trail**: All transactions are logged and traceable
- **Treasury Protection**: Funds are secured with multi-signature style controls

## Development

### Running Tests

```bash
cd decentralized_payrole
npm test
```

### Local Development with Clarinet

```bash
cd decentralized_payrole

# Start local development environment
clarinet console

# Deploy contracts locally
::deploy_contracts

# Test functions
(contract-call? .pay_role initialize-company "Dev Company" u1)
```

## Contract Addresses (Testnet)

After deployment, note these addresses:

- **Pay Role Contract**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.pay_role`
- **Mock Token**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token`
- **SIP-010 Trait**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait`

## Support

For issues and questions:

1. Check the contract documentation
2. Review test files for usage examples
3. Consult Stacks documentation for Clarity best practices

## License

This project is open source and available under standard blockchain terms.
