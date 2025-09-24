# Decentralized Staff Payroll System

A blockchain-based payroll management system built on Stacks that enables companies to manage staff payments, salary distributions, and employee management in a decentralized, transparent, and automated manner using Clarity smart contracts.

# Overview

The Decentralized Staff Payroll System revolutionizes how companies handle employee compensation by leveraging the Stacks blockchain and Bitcoin's security for transparency, automation, and global accessibility.

## Key Benefits

Bitcoin-Level Security: All transactions are secured by Bitcoin's proof-of-work through Stacks' Proof of Transfer (PoX) consensus  
Global Payments: Pay employees anywhere in the world without traditional banking limitations  
Full Transparency: Complete payment history recorded on-chain  
Automated Scheduling: Set and forget salary payments based on block heights  
Multi-Token Support: Pay in STX, SIP-010 tokens, or Bitcoin  
Role-Based Access: Granular permissions for admins, HR, finance, and employees  
Emergency Controls: Pause functionality and emergency withdrawal mechanisms

# System Components

| Component         | Description                             | Technology              |
| ----------------- | --------------------------------------- | ----------------------- |
| Frontend          | Admin panel, employee portal, analytics | React.js + Stacks.js    |
| Smart Contracts   | Core payroll logic                      | Clarity                 |
| Blockchain        | Transaction processing and security     | Stacks 2.0+             |
| Security Layer    | Bitcoin level security                  | Proof of Transfer (PoX) |
| Testing Framework | Contract testing and simulation         | Clarinet                |

# Technical Stack

## Blockchain & Smart Contracts

Blockchain: Stacks 2.0+ (Nakamoto upgrade ready)
Smart Contract Language: Clarity
Token Standard: SIP-010 (Stacks Improvement Proposal)
Security Model: Proof of Transfer (PoX) secured by Bitcoin

## Development Tools

Testing Framework: Clarinet
Local Development: Clarinet DevNet
Frontend SDK: Stacks.js
Wallet Integration: Stacks Connect

## Supported Networks

Mainnet: Stacks Mainnet (secured by Bitcoin)
Testnet: Stacks Testnet
Local: Clarinet DevNet for development

# Features

## Employee Management

Registration: Add employees with detailed information
Role Assignment: Different employee types and permissions
Salary Configuration: Set salaries in various SIP-010 tokens
Status Management: Active, inactive, suspended, terminated states
Department Organization: Group employees by departments

## Payment System

Scheduled Payments: Automated salary distributions based on block heights
Payment Frequencies: Weekly, bi-weekly, monthly options
Multi-Token Support: STX and any SIP-010 compliant token
Bonus Payments: One off bonus distributions
Emergency Payments: Admin-only emergency payment capability
Payment History: Complete transparent record of all payments

## Treasury Management

Fund Deposits: Secure fund management for payroll
Balance Tracking: Real-time treasury balance monitoring
Multi Token Treasury: Support for multiple payment tokens
Emergency Withdrawals: Time-delayed emergency fund recovery
Automated Checks: Ensure sufficient funds before payments

## Security & Access Control

Role Based Permissions: Admin, HR, Finance, Employee roles
Multi Principal Approval: Critical operations require multiple approvals
Emergency Pause: Circuit breaker for emergency situations
Time Delays: Block-height-based delays for sensitive operations
Audit Trail: Complete on-chain audit trail for compliance

# Project Structure

decentralized-payroll/
│
├── contracts/
│ ├── pay_roll.clar # Main payroll contract
│ ├── traits/
│ │ └── sip-010-trait.clar # SIP-010 token trait
│ └── tokens/
│ └── mock-token.clar # Mock token for testing
│
├── tests/
│ ├── payroll_test.ts # Main test suite
│ ├── integration_test.ts # Integration tests
│ └── security_test.ts # Security-focused tests
│
├── settings/
│ ├── Devnet.toml # Local development settings
│ ├── Testnet.toml # Testnet configuration
│ └── Mainnet.toml # Mainnet configuration
│
├── frontend/ # React.js frontend (optional)
│ ├── src/
│ ├── public/
│ └── package.json
│
├── Clarinet.toml # Clarinet project configuration
├── README.md # This file
└── .gitignore

# ⚡ Quick Start

## Prerequisites

[Clarinet](https://github.com/hirosystems/clarinet) v1.8.0+
[Node.js](https://nodejs.org/) v16+ (for frontend)
[Git](https://git-scm.com/)

## Installation

1. Clone the repository

   using bash
   git clone https://github.com/Georgechisom/staff_payrole.git
   cd decentralized-payrole

2. Install Clarinet (if not already installed)

   using bash

   # On macOS

   brew install clarinet

   # On Ubuntu/Linux

   wget -nv https://github.com/hirosystems/clarinet/releases/download/v1.8.0/clarinet-linux-x64.tar.gz -O clarinet.tar.gz
   tar -xf clarinet.tar.gz
   chmod +x ./clarinet
   sudo mv ./clarinet /usr/local/bin

3. Initialize the project

   bash
   clarinet check

4. Run tests

   bash
   clarinet test

5. Start local development environment
   bash
   clarinet integrate

## Basic Usage

1. Deploy to local devnet

   bash
   clarinet deploy --devnet

2. Initialize the company

   clarity
   (contract-call? .payroll-manager initialize company "My Company" u1)

3. Add supported token

   clarity
   (contract-call? .payroll-manager add supported token .mock-token)

4. Add an employee
   clarity
   (contract-call? .payroll-manager add employee
   'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE
   "EMP001"
   u1000000 ;; 1 token (6 decimals)
   .mock-token
   u3 ;; monthly
   "Engineering"
   )

# Smart Contract Details

## Core Contracts

#### 1. `pay_roll.clar` Main Contract

Key Functions:

`add-employee`: Register new employees
`process-salary-payment`: Execute scheduled salary payments
`process-bonus-payment`: Issue bonus payments
`deposit-funds`: Add funds to treasury
`update-employee-status`: Manage employee status

State Variables:

`employees`: Employee data mapping
`treasury-balances`: Treasury balance per token
`payment-records`: Complete payment history
`user-roles`: Role-based access control

#### 2. `sip-010-trait.clar` Token Standard

Defines the SIP-010 fungible token standard interface for payment tokens.

Key Functions:

`transfer`: Transfer tokens between principals
`get-balance`: Check token balance
`get-name`: Get token name
`get-symbol`: Get token symbol

### Payment Frequencies

| Frequency | Code | Blocks | Approximate Time |
| --------- | ---- | ------ | ---------------- |
| Weekly    | `u1` | 1,008  | ~1 week          |
| Bi-weekly | `u2` | 2,016  | ~2 weeks         |
| Monthly   | `u3` | 4,464  | ~1 month         |

Note: Based on 10-minute block times on Stacks

### Role System

| Role     | Code | Permissions                             |
| -------- | ---- | --------------------------------------- |
| Admin    | `u1` | All permissions, emergency controls     |
| HR       | `u2` | Employee management, status updates     |
| Finance  | `u3` | Payment processing, treasury management |
| Employee | `u4` | View own information                    |

# Testing

### Test Suite Overview

Our comprehensive test suite covers:

Unit Tests: Individual function testing
Integration Tests: Multi-contract interactions
Security Tests: Access control and edge cases
Payment Flow Tests: End-to-end payment scenarios

### Running Tests

bash

# Run all tests

clarinet test

# Run specific test file

clarinet test tests/payroll_test.ts

# Run with verbose output

clarinet test --verbose

### Key Test Scenarios

1. Employee Management Tests

   Add/remove employees
   Update employee information
   Role-based access control

2. Payment Processing Tests

   Scheduled salary payments
   Bonus and emergency payments
   Insufficient funds handling

3. Treasury Management Tests

   Fund deposits and withdrawals
   Multi-token support
   Emergency withdrawal delays

4. Security Tests
   Unauthorized access attempts
   Contract pause functionality
   Emergency scenarios

### Sample Test

typescript
Clarinet.test({
name: "Can add employee with valid parameters",
async fn(chain: Chain, accounts: Map<string, Account>) {
const deployer = accounts.get("deployer")!;
const hr = accounts.get("wallet_1")!;
const employee = accounts.get("wallet_2")!;

    // Set HR role
    let block = chain.mineBlock([
      Tx.contractCall(
        "payroll-manager",
        "set-user-role",
        [types.principal(hr.address), types.uint(2)],
        deployer.address
      ),
    ]);

    // Add employee
    block = chain.mineBlock([
      Tx.contractCall(
        "payroll-manager",
        "add-employee",
        [
          types.principal(employee.address),
          types.ascii("EMP001"),
          types.uint(1000000),
          types.principal(deployer.address + ".mock-token"),
          types.uint(3),
          types.ascii("Engineering"),
        ],
        hr.address
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

},
});

## 🛡️ Security

### Security Features

1. Language-Level Security

   Clarity prevents reentrancy attacks by design
   No integer overflow/underflow (built-in checks)
   Decidable language allows complete static analysis

2. Access Control

   Role-based permissions system
   Principal-based authentication
   Multi-signature requirements for critical operations

3. Economic Security

   Bitcoin-level security through PoX
   Transparent and immutable payment records
   Emergency pause and recovery mechanisms

4. Operational Security
   Time-delayed emergency withdrawals
   Balance checks before payments
   Comprehensive audit trails

### Security Best Practices

Principle of Least Privilege: Users only get minimum required permissions
Defense in Depth: Multiple security layers
Fail-Safe Defaults: Secure defaults for all operations
Regular Audits: Comprehensive testing and review processes

# Roadmap

### Phase 1: Core Infrastructure

[x] Basic payroll contract
[x] Employee registry
[x] Payment processing
[x] Clarinet testing setup

### Phase 2: Advanced Features

[ ] Multi-token support
[ ] Frontend interface
[ ] Advanced scheduling
[ ] Testnet deployment

### Phase 3: Production Ready

[ ] Security audit
[ ] Mainnet deployment
[ ] User documentation
[ ] Integration APIs

### Phase 4: Ecosystem Integration

[ ] Bitcoin integration
[ ] Stacking rewards
[ ] Third-party integrations
[ ] Mobile application

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Run the test suite (`clarinet test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

Follow Clarity best practices
Write comprehensive tests
Document all public functions
Use meaningful variable names
Add comments for complex logic

## Additional Resources

[Clarity Language Reference](https://docs.stacks.co/clarity/language-overview)
[SIP-010 Fungible Token Standard](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md)
[Clarinet Documentation](https://github.com/hirosystems/clarinet)
[Stacks.js Documentation](https://stacks.js.org/)

Built with using Stacks and secured by Bitcoin

For questions or support, please reach out through our [GitHub Discussions](https://github.com/Georgechisom/staff_payrole)
