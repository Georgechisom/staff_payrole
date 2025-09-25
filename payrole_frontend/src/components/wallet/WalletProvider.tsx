import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { WalletState, UserProfile } from "../../types";
import { AppConfig, UserSession, connect } from "@stacks/connect";
import { useNotifications } from "../../hooks";

interface WalletContextType {
  walletState: WalletState;
  userProfile: UserProfile | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    publicKey: null,
    network: "testnet",
    balance: null,
    isLoading: false,
    error: null,
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { success, error: showError } = useNotifications();

  const processAddressInfo = (stxAddress: string, publicKey: string) => {
    console.log("Connected address:", stxAddress);

    setWalletState((prev) => ({
      ...prev,
      isConnected: true,
      address: stxAddress,
      publicKey: publicKey ?? null,
      error: null,
      isLoading: false,
    }));

    setUserProfile({
      address: stxAddress,
      role: 4,
      isEmployee: false,
      permissions: [],
    });

    setError(null);
    success(
      "Wallet Connected",
      `Connected to ${stxAddress.slice(0, 6)}...${stxAddress.slice(-4)}`
    );
  };

  const handleConnection = useCallback(
    (userData: any) => {
      try {
        const stxAddress = userData.profile.stxAddress.testnet;
        const publicKey = userData.profile.publicKey;
        processAddressInfo(stxAddress, publicKey);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process connection";
        console.error("Connection handling error:", err);
        setError(errorMessage);
        setWalletState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          isConnected: false,
        }));
        showError("Connection Error", errorMessage);
      }
    },
    [success, showError]
  );

  useEffect(() => {
    const checkInitialConnection = async () => {
      try {
        setWalletState((prev) => ({ ...prev, isLoading: true }));
        if (userSession.isSignInPending()) {
          await userSession.handlePendingSignIn();
        }
        if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData();
          handleConnection(userData);
        }
      } catch (err) {
        console.error("Initial check error:", err);
      } finally {
        setWalletState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkInitialConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      console.log("Attempting wallet connection...");
      setIsConnecting(true);
      setError(null);
      setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Detect wallet type from window object or other means
      const isXverse = !!window.xverse;
      const isLeather = !!window.leather;

      // Adjust network object for compatibility
      const network = {
        chainId: 2147483648,
        url: "https://stacks-node-api.testnet.stacks.co",
      };

      // Prepare connect options
      const connectOptions: any = {
        // Cast to any to bypass typing error for appDetails
        ...({
          appDetails: {
            name: "Decentralized Payroll",
            icon: window.location.origin + "/vite.svg",
          },
        } as any),
        network,
        onFinish: async () => {
          console.log("Wallet connection finished");
          const userData = userSession.loadUserData();
          console.log("User data after connection:", userData);
          handleConnection(userData);
          setIsConnecting(false);
          setWalletState((prev) => ({ ...prev, isLoading: false }));
        },
        onCancel: () => {
          console.log("Wallet connection cancelled");
          setIsConnecting(false);
          setWalletState((prev) => ({ ...prev, isLoading: false }));
          showError("Connection Cancelled", "Wallet connection was cancelled");
        },
      };

      // Modify connect options for Xverse if needed
      if (isXverse) {
        // Xverse may require no network param or different param
        delete connectOptions.network;
        console.log("Connecting with Xverse wallet options:", connectOptions);
      }

      // Modify connect options for Leather if needed
      if (isLeather) {
        // Leather may require additional or different params
        console.log("Connecting with Leather wallet options:", connectOptions);
      }

      await connect(connectOptions);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      console.error("Connect error:", err);
      setError(errorMessage);
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      showError("Connection Failed", errorMessage);
      setIsConnecting(false);
    }
  }, [handleConnection, showError, userSession]);

  const disconnectWallet = useCallback(() => {
    try {
      userSession.signUserOut();
      setWalletState({
        isConnected: false,
        address: null,
        publicKey: null,
        network: "testnet",
        balance: null,
        isLoading: false,
        error: null,
      });
      setUserProfile(null);
      setError(null);
      success("Wallet Disconnected", "Successfully disconnected from wallet");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to disconnect wallet";
      console.error("Disconnect error:", err);
      setError(errorMessage);
      showError("Disconnect Failed", errorMessage);
    }
  }, [success, showError, userSession]);

  const contextValue: WalletContextType = {
    walletState,
    userProfile,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
