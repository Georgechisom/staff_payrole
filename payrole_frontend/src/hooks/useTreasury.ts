import { useState, useEffect, useCallback } from 'react';
import type {
  DepositFundsParams,
  RequestEmergencyWithdrawalParams,
  ExecuteEmergencyWithdrawalParams,
  PendingWithdrawal,
  ContractResponse,
  TokenInfo
} from '../types';
import { useContract } from './useContract';

export const useTreasury = () => {
  const [treasuryBalances, setTreasuryBalances] = useState<Map<string, bigint>>(new Map());
  const [supportedTokens, setSupportedTokens] = useState<TokenInfo[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Map<string, PendingWithdrawal>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    getTreasuryBalance,
    isSupportedToken,
    addSupportedToken,
    depositFunds: depositFundsContract,
    requestEmergencyWithdrawal: requestWithdrawalContract,
    executeEmergencyWithdrawal: executeWithdrawalContract,
  } = useContract();

  // Load treasury balances for all supported tokens
  const loadTreasuryBalances = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const balances = new Map<string, bigint>();
      
      for (const token of supportedTokens) {
        const response = await getTreasuryBalance(token.contractAddress);
        if (response.success && response.data !== undefined) {
          balances.set(token.contractAddress, response.data);
        }
      }
      
      setTreasuryBalances(balances);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load treasury balances');
    } finally {
      setIsLoading(false);
    }
  }, [supportedTokens, getTreasuryBalance]);

  // Load supported tokens
  const loadSupportedTokens = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would:
      // 1. Query an indexer for all token-added events
      // 2. Get token information for each supported token
      // 3. Verify they are still supported
      
      // For now, we'll use a default set of tokens
      const defaultTokens: TokenInfo[] = [
        {
          name: 'Mock Token',
          symbol: 'MOCK',
          decimals: 6,
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.mock-token',
        },
        // Add more tokens as needed
      ];
      
      setSupportedTokens(defaultTokens);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load supported tokens');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check if a token is supported
  const checkTokenSupport = useCallback(async (tokenAddress: string): Promise<boolean> => {
    try {
      const response = await isSupportedToken(tokenAddress);
      return response.success ? response.data || false : false;
    } catch (err) {
      console.error('Failed to check token support:', err);
      return false;
    }
  }, [isSupportedToken]);

  // Add a new supported token
  const addToken = useCallback(async (tokenAddress: string): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await addSupportedToken(tokenAddress);
      
      if (response.success) {
        // Refresh supported tokens list
        await loadSupportedTokens();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add token';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addSupportedToken, loadSupportedTokens]);

  // Deposit funds to treasury
  const depositFunds = useCallback(async (params: DepositFundsParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await depositFundsContract(params);
      
      if (response.success) {
        // Update local balance
        const currentBalance = treasuryBalances.get(params.token) || BigInt(0);
        const newBalance = currentBalance + params.amount;
        setTreasuryBalances(prev => new Map(prev.set(params.token, newBalance)));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deposit funds';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [depositFundsContract, treasuryBalances]);

  // Request emergency withdrawal
  const requestEmergencyWithdrawal = useCallback(async (params: RequestEmergencyWithdrawalParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await requestWithdrawalContract(params);
      
      if (response.success) {
        // Add to pending withdrawals
        const withdrawalKey = `${params.token}`;
        setPendingWithdrawals(prev => new Map(prev.set(withdrawalKey, {
          amount: params.amount,
          requestBlock: BigInt(Date.now()), // Placeholder - should be actual block height
        })));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request withdrawal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [requestWithdrawalContract]);

  // Execute emergency withdrawal
  const executeEmergencyWithdrawal = useCallback(async (params: ExecuteEmergencyWithdrawalParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await executeWithdrawalContract(params);
      
      if (response.success) {
        // Remove from pending withdrawals
        const withdrawalKey = `${params.token}`;
        setPendingWithdrawals(prev => {
          const newMap = new Map(prev);
          newMap.delete(withdrawalKey);
          return newMap;
        });
        
        // Refresh treasury balances
        await loadTreasuryBalances();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute withdrawal';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [executeWithdrawalContract, loadTreasuryBalances]);

  // Get balance for a specific token
  const getTokenBalance = useCallback((tokenAddress: string): bigint => {
    return treasuryBalances.get(tokenAddress) || BigInt(0);
  }, [treasuryBalances]);

  // Get total treasury value (in terms of a base token)
  const getTotalTreasuryValue = useCallback((): bigint => {
    let total = BigInt(0);
    for (const balance of treasuryBalances.values()) {
      total += balance;
    }
    return total;
  }, [treasuryBalances]);

  // Get treasury statistics
  const getTreasuryStats = useCallback(() => {
    const totalTokens = supportedTokens.length;
    const totalValue = getTotalTreasuryValue();
    const tokensWithBalance = Array.from(treasuryBalances.entries())
      .filter(([_, balance]) => balance > BigInt(0)).length;
    const pendingWithdrawalCount = pendingWithdrawals.size;
    
    const tokenBalances = supportedTokens.map(token => ({
      token,
      balance: getTokenBalance(token.contractAddress),
    }));
    
    return {
      totalTokens,
      totalValue,
      tokensWithBalance,
      pendingWithdrawalCount,
      tokenBalances,
    };
  }, [supportedTokens, getTotalTreasuryValue, treasuryBalances, pendingWithdrawals.size, getTokenBalance]);

  // Get low balance warnings
  const getLowBalanceWarnings = useCallback((threshold: bigint = BigInt(1000000)): TokenInfo[] => {
    return supportedTokens.filter(token => {
      const balance = getTokenBalance(token.contractAddress);
      return balance < threshold;
    });
  }, [supportedTokens, getTokenBalance]);

  // Format token amount with decimals
  const formatTokenAmount = useCallback((amount: bigint, tokenAddress: string): string => {
    const token = supportedTokens.find(t => t.contractAddress === tokenAddress);
    if (!token) return amount.toString();
    
    const divisor = BigInt(10 ** token.decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;
    
    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(token.decimals, '0');
    return `${wholePart}.${fractionalStr}`;
  }, [supportedTokens]);

  // Parse token amount from string
  const parseTokenAmount = useCallback((amountStr: string, tokenAddress: string): bigint => {
    const token = supportedTokens.find(t => t.contractAddress === tokenAddress);
    if (!token) return BigInt(amountStr);
    
    const [wholePart, fractionalPart = ''] = amountStr.split('.');
    const paddedFractional = fractionalPart.padEnd(token.decimals, '0').slice(0, token.decimals);
    
    const wholeAmount = BigInt(wholePart || '0') * BigInt(10 ** token.decimals);
    const fractionalAmount = BigInt(paddedFractional || '0');
    
    return wholeAmount + fractionalAmount;
  }, [supportedTokens]);

  // Load data on mount
  useEffect(() => {
    loadSupportedTokens();
  }, [loadSupportedTokens]);

  useEffect(() => {
    if (supportedTokens.length > 0) {
      loadTreasuryBalances();
    }
  }, [supportedTokens, loadTreasuryBalances]);

  return {
    // State
    treasuryBalances,
    supportedTokens,
    pendingWithdrawals,
    isLoading,
    error,
    
    // Actions
    loadTreasuryBalances,
    loadSupportedTokens,
    addToken,
    depositFunds,
    requestEmergencyWithdrawal,
    executeEmergencyWithdrawal,
    
    // Queries
    checkTokenSupport,
    getTokenBalance,
    getTotalTreasuryValue,
    getTreasuryStats,
    getLowBalanceWarnings,
    
    // Utilities
    formatTokenAmount,
    parseTokenAmount,
    clearError: () => setError(null),
  };
};
