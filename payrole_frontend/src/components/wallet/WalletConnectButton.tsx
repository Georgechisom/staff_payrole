import React from "react";
import { Wallet, AlertCircle, Loader2 } from "lucide-react";
import { useWalletContext } from "./WalletProvider";
import { Button } from "../ui";

interface WalletConnectButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  fullWidth?: boolean;
  showIcon?: boolean;
  className?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  size = "md",
  variant = "solid",
  fullWidth = false,
  showIcon = true,
  className = "rounded-full",
}) => {
  const { walletState, connectWallet, disconnectWallet, isConnecting, error } =
    useWalletContext();

  const handleClick = async () => {
    if (walletState.isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnecting || walletState.isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled
        className={className}
        leftIcon={
          showIcon ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined
        }
      >
        Connecting...
      </Button>
    );
  }

  if (walletState.isConnected && walletState.address) {
    return (
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        onClick={handleClick}
        className={className}
        leftIcon={showIcon ? <Wallet className="w-4 h-4" /> : undefined}
      >
        {formatAddress(walletState.address)}
      </Button>
    );
  }

  return (
    <Button
      variant={error ? "outline" : variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleClick}
      className={className}
      leftIcon={
        showIcon ? (
          error ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Wallet className="w-4 h-4" />
          )
        ) : undefined
      }
      color={error ? "error" : "primary"}
    >
      {error ? "Retry Connection" : "Connect Wallet"}
    </Button>
  );
};

export default WalletConnectButton;

// Debug component remains the same
export const WalletDebug: React.FC = () => {
  const { walletState, error, isConnecting } = useWalletContext();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm max-w-md">
      <h3 className="font-bold mb-2">Wallet Debug Info:</h3>
      <div className="space-y-1">
        <p>Connected: {walletState.isConnected ? "Yes" : "No"}</p>
        <p>Loading: {walletState.isLoading ? "Yes" : "No"}</p>
        <p>Connecting: {isConnecting ? "Yes" : "No"}</p>
        <p>Address: {walletState.address || "None"}</p>
        <p>Network: {walletState.network}</p>
        {error && <p className="text-red-400">Error: {error}</p>}
        {walletState.error && (
          <p className="text-red-400">State Error: {walletState.error}</p>
        )}
      </div>
    </div>
  );
};
