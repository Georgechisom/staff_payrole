#!/bin/bash
# Decentralized Payroll System - Deployment Script

set -e

echo " Decentralized Payroll System - Testnet Deployment"
echo "=================================================="

# Check if Clarinet is installed
if ! command -v clarinet &> /dev/null; then
    echo " Clarinet is not installed. Please install it from:"
    echo "   https://docs.hiro.so/clarinet"
    exit 1
fi

echo " Clarinet is installed"

# Check if we're in the right directory
if [ ! -f "Clarinet.toml" ]; then
    echo " Clarinet.toml not found. Please run this script from the project root."
    exit 1
fi

echo " Project structure verified"

# Generate deployment plan
echo ""
echo " Generating deployment plan..."
clarinet deployments generate --devnet

# Apply deployment
echo ""
echo " Applying deployment..."
clarinet deployments apply

# Show deployment summary
echo ""
echo " Deployment Summary:"
echo "====================="
clarinet deployments show

echo ""
echo " Deployment completed successfully!"
echo ""
echo " Next Steps:"
echo "1. Start Clarinet console: clarinet console"
echo "2. Initialize company: (contract-call? .pay_role initialize-company \"Your Company\" u12345)"
echo "3. Set admin role: (contract-call? .pay_role set-user-role 'YOUR_ADDRESS u1)"
echo "4. Add supported token: (contract-call? .pay_role add-supported-token 'CONTRACT_ADDRESS.mock-token)"
echo ""
echo " Your decentralized payroll system is ready!"
