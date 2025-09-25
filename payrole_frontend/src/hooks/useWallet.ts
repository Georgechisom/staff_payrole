import { useState, useEffect, useCallback } from 'react';
import { AppConfig, UserSession, showConnect, openContractCall } from '@stacks/connect';
import * as StacksNetwork from '@stacks/network';
import type {
  WalletState,
  UserProfile,
  TransactionOptions,
  NetworkType,
  Transaction
} from '../types';
import { TransactionStatus } from '../types';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    publicKey: null,
    network: 'testnet',
    balance: null,
    isLoading: false,
    error: null,
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initialize wallet state on mount
  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setWalletState(prev => ({
          ...prev,
          isConnected: true,
          address: userData.profile.stxAddress.testnet,
          publicKey: userData.profile.publicKey,
        }));
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        address: userData.profile.stxAddress.testnet,
        publicKey: userData.profile.publicKey,
      }));
    }
  }, []);

  const connect = useCallback(async () => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      showConnect({
        appDetails: {
          name: 'Decentralized Payroll',
          icon: window.location.origin + '/logo.svg',
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = userSession.loadUserData();
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            address: userData.profile.stxAddress.testnet,
            publicKey: userData.profile.publicKey,
            isLoading: false,
          }));
        },
        onCancel: () => {
          setWalletState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Connection cancelled',
          }));
        },
        userSession,
      });
    } catch (error) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setWalletState({
      isConnected: false,
      address: null,
      publicKey: null,
      network: 'testnet',
      balance: null,
      isLoading: false,
      error: null,
    });
    setUserProfile(null);
  }, []);

  const switchNetwork = useCallback((network: NetworkType) => {
    setWalletState(prev => ({ ...prev, network }));
  }, []);

  const getNetwork = useCallback(() => {
    switch (walletState.network) {
      case 'mainnet':
        return StacksNetwork.STACKS_MAINNET;
      case 'testnet':
        return StacksNetwork.STACKS_TESTNET;
      default:
        return StacksNetwork.STACKS_TESTNET;
    }
  }, [walletState.network]);

  const callContract = useCallback(async (options: TransactionOptions) => {
    if (!walletState.isConnected || !walletState.address) {
      throw new Error('Wallet not connected');
    }

    const transaction: Transaction = {
      txId: '',
      status: TransactionStatus.PENDING,
      functionName: options.functionName,
      contractAddress: options.contractAddress,
      contractName: options.contractName,
      fee: BigInt(options.fee || 1000),
      nonce: BigInt(options.nonce || 0),
      timestamp: Date.now(),
    };

    setTransactions(prev => [...prev, transaction]);

    return new Promise<string>((resolve, reject) => {
      openContractCall({
        network: getNetwork(),
        contractAddress: options.contractAddress,
        contractName: options.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        fee: options.fee,
        onFinish: (data) => {
          const txId = data.txId;
          transaction.txId = txId;
          transaction.status = TransactionStatus.SUCCESS;
          
          setTransactions(prev => 
            prev.map(tx => 
              tx.timestamp === transaction.timestamp 
                ? { ...tx, txId, status: TransactionStatus.SUCCESS }
                : tx
            )
          );
          
          if (options.onFinish) {
            options.onFinish(data);
          }
          resolve(txId);
        },
        onCancel: () => {
          transaction.status = TransactionStatus.CANCELLED;
          setTransactions(prev => 
            prev.map(tx => 
              tx.timestamp === transaction.timestamp 
                ? { ...tx, status: TransactionStatus.CANCELLED }
                : tx
            )
          );
          
          if (options.onCancel) {
            options.onCancel();
          }
          reject(new Error('Transaction cancelled'));
        },
      });
    });
  }, [walletState.isConnected, walletState.address, getNetwork]);

  const getTransactionStatus = useCallback((txId: string) => {
    return transactions.find(tx => tx.txId === txId)?.status || TransactionStatus.PENDING;
  }, [transactions]);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!walletState.address) return;
    
    try {
      // TODO: Implement balance fetching from Stacks API
      // This would typically involve calling the Stacks API to get STX balance
      // and any token balances for the connected address
      setWalletState(prev => ({ ...prev, balance: BigInt(0) }));
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  }, [walletState.address]);

  return {
    // State
    walletState,
    userProfile,
    transactions,
    
    // Actions
    connect,
    disconnect,
    switchNetwork,
    callContract,
    refreshBalance,
    updateUserProfile,
    
    // Utilities
    getNetwork,
    getTransactionStatus,
    clearTransactions,
    
    // Computed values
    isConnected: walletState.isConnected,
    address: walletState.address,
    network: walletState.network,
    isLoading: walletState.isLoading,
    error: walletState.error,
  };
};
