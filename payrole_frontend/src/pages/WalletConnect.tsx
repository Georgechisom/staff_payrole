import React from "react";
import { Wallet, Shield, Zap, Users } from "lucide-react";
import {
  WalletConnectButton,
  WalletStatus,
  useWalletContext,
} from "../components/wallet";
import { Card } from "../components/ui";

const WalletConnect: React.FC = () => {
  const { walletState } = useWalletContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 animate-pulse-slow flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-success-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <Wallet className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Decentralized Payroll
          </h1>
          <p className="text-xl text-white/90 mb-8 drop-shadow-md">
            Secure, transparent, and automated payroll management on the Stacks
            blockchain
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Connection Card */}
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-slide-up">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-white mb-4 drop-shadow-lg">
                Connect Your Wallet
              </h2>
              <p className="text-white/80 mb-6">
                Connect your Stacks wallet to access the decentralized payroll
                system
              </p>

              <div className="mb-6">
                <WalletConnectButton
                  size="lg"
                  fullWidth
                  className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary-500 to-success-500 hover:from-primary-600 hover:to-success-600 text-white font-semibold py-3 px-6 rounded-full"
                />
              </div>

              {walletState.isConnected && (
                <div className="mt-6 animate-fade-in">
                  <WalletStatus
                    showDetails={false}
                    className="bg-white/5 backdrop-blur-sm border border-white/10"
                  />
                </div>
              )}

              <p className="text-sm text-white/60">
                By connecting, you agree to our terms of service and privacy
                policy
              </p>
            </div>
          </Card>

          {/* Features Card */}
          <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-slide-up">
            <h3 className="text-2xl font-semibold text-white mb-6 drop-shadow-lg">
              Why Choose Our Platform?
            </h3>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">
                    Secure & Transparent
                  </h4>
                  <p className="text-white/70">
                    All transactions are recorded on the blockchain for complete
                    transparency
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">
                    Automated Payments
                  </h4>
                  <p className="text-white/70">
                    Smart contracts automate salary payments and reduce manual
                    errors
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200">
                <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">
                    Role-Based Access
                  </h4>
                  <p className="text-white/70">
                    Different access levels for admins, HR, finance, and
                    employees
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Supported Wallets */}
        <Card className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-slide-up">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center drop-shadow-lg">
            Supported Wallets
          </h3>

          <div className="flex justify-center space-x-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium">Xverse</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium">Leather</p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-white/60 text-lg drop-shadow-md">
            Built on Stacks • Powered by Smart Contracts • Open Source
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
