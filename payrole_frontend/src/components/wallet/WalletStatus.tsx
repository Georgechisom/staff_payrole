import React from 'react';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Copy,
  ExternalLink 
} from 'lucide-react';
import { useWalletContext } from './WalletProvider';
import { Card, Button, Badge } from '../ui';
import { useNotifications } from '../../hooks';

interface WalletStatusProps {
  showDetails?: boolean;
  className?: string;
}

const WalletStatus: React.FC<WalletStatusProps> = ({
  showDetails = true,
  className = '',
}) => {
  const { walletState, userProfile } = useWalletContext();
  const { success } = useNotifications();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      success('Copied', 'Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openInExplorer = (address: string) => {
    const explorerUrl = `https://explorer.stacks.co/address/${address}?chain=testnet`;
    window.open(explorerUrl, '_blank');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const formatBalance = (balance: bigint | null) => {
    if (balance === null) return 'Loading...';
    return `${Number(balance) / 1000000} STX`;
  };

  const getStatusColor = () => {
    if (walletState.error) return 'error';
    if (walletState.isConnected) return 'success';
    if (walletState.isLoading) return 'warning';
    return 'secondary';
  };

  const getStatusIcon = () => {
    if (walletState.error) return <AlertCircle className="w-4 h-4" />;
    if (walletState.isConnected) return <CheckCircle className="w-4 h-4" />;
    if (walletState.isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    return <Wallet className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (walletState.error) return 'Connection Error';
    if (walletState.isConnected) return 'Connected';
    if (walletState.isLoading) return 'Connecting...';
    return 'Not Connected';
  };

  return (
    <Card className={className}>
      <Card.Header title="Wallet Status" />
      <Card.Body>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            <Badge variant={getStatusColor()}>
              {walletState.network.toUpperCase()}
            </Badge>
          </div>

          {/* Error Message */}
          {walletState.error && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-md">
              <p className="text-sm text-error-700">{walletState.error}</p>
            </div>
          )}

          {/* Wallet Details */}
          {walletState.isConnected && walletState.address && showDetails && (
            <div className="space-y-3">
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono">
                    {formatAddress(walletState.address)}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(walletState.address!)}
                    className="p-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInExplorer(walletState.address!)}
                    className="p-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Balance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  STX Balance
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm">
                  {formatBalance(walletState.balance)}
                </div>
              </div>

              {/* Public Key */}
              {walletState.publicKey && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Public Key
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono">
                      {formatAddress(walletState.publicKey)}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(walletState.publicKey!)}
                      className="p-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* User Role */}
              {userProfile && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Role
                  </label>
                  <div className="px-3 py-2 bg-secondary-50 border border-secondary-200 rounded text-sm">
                    {userProfile.role === 1 && 'Administrator'}
                    {userProfile.role === 2 && 'Human Resources'}
                    {userProfile.role === 3 && 'Finance'}
                    {userProfile.role === 4 && 'Employee'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default WalletStatus;
