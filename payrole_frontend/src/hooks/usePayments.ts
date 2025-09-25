import { useState, useEffect, useCallback } from 'react';
import type {
  PaymentRecord,
  ProcessSalaryPaymentParams,
  ProcessBonusPaymentParams,
  ProcessEmergencyPaymentParams,
  ContractResponse
} from '../types';
import { PaymentType } from '../types';
import { useContract } from './useContract';

export const usePayments = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    getPaymentRecord,
    processSalaryPayment: processSalaryContract,
    processBonusPayment: processBonusContract,
    processEmergencyPayment: processEmergencyContract,
  } = useContract();

  // Load payment history (this would typically come from an indexer or API)
  const loadPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would:
      // 1. Query an indexer for all payment events
      // 2. Get payment records for each payment ID
      // 3. Sort by timestamp/block height
      
      // For now, we'll maintain a local list
      // This is a placeholder implementation
      setPayments([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get payment by ID
  const getPayment = useCallback(async (paymentId: number): Promise<PaymentRecord | null> => {
    try {
      const response = await getPaymentRecord(paymentId);
      return response.success ? response.data || null : null;
    } catch (err) {
      console.error('Failed to get payment:', err);
      return null;
    }
  }, [getPaymentRecord]);

  // Process salary payment
  const processSalaryPayment = useCallback(async (params: ProcessSalaryPaymentParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await processSalaryContract(params);
      
      if (response.success) {
        // Refresh payments list
        await loadPayments();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process salary payment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [processSalaryContract, loadPayments]);

  // Process bonus payment
  const processBonusPayment = useCallback(async (params: ProcessBonusPaymentParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await processBonusContract(params);
      
      if (response.success) {
        // Refresh payments list
        await loadPayments();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process bonus payment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [processBonusContract, loadPayments]);

  // Process emergency payment
  const processEmergencyPayment = useCallback(async (params: ProcessEmergencyPaymentParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await processEmergencyContract(params);
      
      if (response.success) {
        // Refresh payments list
        await loadPayments();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process emergency payment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [processEmergencyContract, loadPayments]);

  // Filter payments by employee
  const getPaymentsByEmployee = useCallback((employeeAddress: string): PaymentRecord[] => {
    return payments.filter(payment => payment.employee === employeeAddress);
  }, [payments]);

  // Filter payments by type
  const getPaymentsByType = useCallback((paymentType: PaymentType): PaymentRecord[] => {
    return payments.filter(payment => payment.paymentType === paymentType);
  }, [payments]);

  // Filter payments by token
  const getPaymentsByToken = useCallback((tokenAddress: string): PaymentRecord[] => {
    return payments.filter(payment => payment.token === tokenAddress);
  }, [payments]);

  // Filter payments by date range
  const getPaymentsByDateRange = useCallback((startBlock: bigint, endBlock: bigint): PaymentRecord[] => {
    return payments.filter(payment => 
      payment.blockHeight >= startBlock && payment.blockHeight <= endBlock
    );
  }, [payments]);

  // Get payment statistics
  const getPaymentStats = useCallback(() => {
    const total = payments.length;
    const salaryPayments = payments.filter(p => p.paymentType === PaymentType.SALARY).length;
    const bonusPayments = payments.filter(p => p.paymentType === PaymentType.BONUS).length;
    const emergencyPayments = payments.filter(p => p.paymentType === PaymentType.EMERGENCY).length;
    
    const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const salaryAmount = payments
      .filter(p => p.paymentType === PaymentType.SALARY)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const bonusAmount = payments
      .filter(p => p.paymentType === PaymentType.BONUS)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    const emergencyAmount = payments
      .filter(p => p.paymentType === PaymentType.EMERGENCY)
      .reduce((sum, payment) => sum + Number(payment.amount), 0);
    
    // Get unique employees who received payments
    const uniqueEmployees = [...new Set(payments.map(p => p.employee))];
    
    // Get unique tokens used for payments
    const uniqueTokens = [...new Set(payments.map(p => p.token))];
    
    return {
      total,
      salaryPayments,
      bonusPayments,
      emergencyPayments,
      totalAmount: BigInt(totalAmount),
      salaryAmount: BigInt(salaryAmount),
      bonusAmount: BigInt(bonusAmount),
      emergencyAmount: BigInt(emergencyAmount),
      uniqueEmployees: uniqueEmployees.length,
      uniqueTokens: uniqueTokens.length,
    };
  }, [payments]);

  // Get recent payments (last N payments)
  const getRecentPayments = useCallback((limit: number = 10): PaymentRecord[] => {
    return payments
      .sort((a, b) => Number(b.blockHeight) - Number(a.blockHeight))
      .slice(0, limit);
  }, [payments]);

  // Get payments for current month
  const getCurrentMonthPayments = useCallback((): PaymentRecord[] => {
    // This is a simplified implementation
    // In reality, you'd need to convert block heights to dates
    // const now = new Date();
    // const currentMonth = now.getMonth();
    // const currentYear = now.getFullYear();

    // For now, return recent payments as a placeholder
    return getRecentPayments(50);
  }, [getRecentPayments]);

  // Calculate total payments for an employee
  const getEmployeeTotalPayments = useCallback((employeeAddress: string): bigint => {
    const employeePayments = getPaymentsByEmployee(employeeAddress);
    const total = employeePayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    return BigInt(total);
  }, [getPaymentsByEmployee]);

  // Get payment summary for dashboard
  const getPaymentSummary = useCallback(() => {
    const stats = getPaymentStats();
    const recentPayments = getRecentPayments(5);
    const currentMonthPayments = getCurrentMonthPayments();
    
    return {
      stats,
      recentPayments,
      currentMonthPayments,
      currentMonthTotal: currentMonthPayments.reduce(
        (sum, payment) => sum + Number(payment.amount), 
        0
      ),
    };
  }, [getPaymentStats, getRecentPayments, getCurrentMonthPayments]);

  // Load payments on mount
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  return {
    // State
    payments,
    isLoading,
    error,
    
    // Actions
    loadPayments,
    processSalaryPayment,
    processBonusPayment,
    processEmergencyPayment,
    
    // Queries
    getPayment,
    getPaymentsByEmployee,
    getPaymentsByType,
    getPaymentsByToken,
    getPaymentsByDateRange,
    getRecentPayments,
    getCurrentMonthPayments,
    getEmployeeTotalPayments,
    
    // Analytics
    getPaymentStats,
    getPaymentSummary,
    
    // Utilities
    clearError: () => setError(null),
  };
};
