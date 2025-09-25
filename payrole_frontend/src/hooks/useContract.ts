import { useState, useCallback } from 'react';
import {
  fetchCallReadOnlyFunction,
  cvToJSON,
  standardPrincipalCV,
  uintCV,
  stringAsciiCV,
  contractPrincipalCV,
} from '@stacks/transactions';
import type {
  Employee,
  PaymentRecord,
  CompanyInfo,
  AddEmployeeParams,
  UpdateEmployeeSalaryParams,
  UpdateEmployeeStatusParams,
  ProcessSalaryPaymentParams,
  ProcessBonusPaymentParams,
  ProcessEmergencyPaymentParams,
  DepositFundsParams,
  RequestEmergencyWithdrawalParams,
  ExecuteEmergencyWithdrawalParams,
  SetUserRoleParams,
  InitializeCompanyParams,
  ContractResponse,
  UserRole,
} from '../types';
import { useWallet } from './useWallet';

// Contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'pay_role';

export const useContract = () => {
  const { callContract, getNetwork, address } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function for read-only calls
  const callReadOnly = useCallback(async <T>(
    functionName: string,
    functionArgs: any[] = [],
    senderAddress?: string
  ): Promise<ContractResponse<T>> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await fetchCallReadOnlyFunction({
        network: getNetwork(),
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
        senderAddress: senderAddress || address || CONTRACT_ADDRESS,
      });

      const data = cvToJSON(result);
      return { success: true, data: data.value };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [getNetwork, address]);

  // Helper function for contract calls
  const callContractFunction = useCallback(async (
    functionName: string,
    functionArgs: any[]
  ): Promise<ContractResponse<string>> => {
    try {
      setIsLoading(true);
      setError(null);

      const txId = await callContract({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName,
        functionArgs,
      });

      return { success: true, data: txId };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [callContract]);

  // Read-only functions
  const getEmployeeInfo = useCallback(async (employeeAddress: string): Promise<ContractResponse<Employee | null>> => {
    return callReadOnly<Employee | null>('get-employee-info', [
      standardPrincipalCV(employeeAddress)
    ]);
  }, [callReadOnly]);

  const getEmployeeById = useCallback(async (employeeId: string): Promise<ContractResponse<Employee | null>> => {
    return callReadOnly<Employee | null>('get-employee-by-id', [
      stringAsciiCV(employeeId)
    ]);
  }, [callReadOnly]);

  const getTreasuryBalance = useCallback(async (tokenAddress: string): Promise<ContractResponse<bigint>> => {
    return callReadOnly<bigint>('get-treasury-balance', [
      standardPrincipalCV(tokenAddress)
    ]);
  }, [callReadOnly]);

  const getPaymentRecord = useCallback(async (paymentId: number): Promise<ContractResponse<PaymentRecord | null>> => {
    return callReadOnly<PaymentRecord | null>('get-payment-record', [
      uintCV(paymentId)
    ]);
  }, [callReadOnly]);

  const getUserRole = useCallback(async (userAddress: string): Promise<ContractResponse<UserRole>> => {
    return callReadOnly<UserRole>('get-user-role', [
      standardPrincipalCV(userAddress)
    ]);
  }, [callReadOnly]);

  const isPaymentDue = useCallback(async (employeeAddress: string): Promise<ContractResponse<boolean>> => {
    return callReadOnly<boolean>('is-payment-due', [
      standardPrincipalCV(employeeAddress)
    ]);
  }, [callReadOnly]);

  const getCompanyInfo = useCallback(async (): Promise<ContractResponse<CompanyInfo>> => {
    return callReadOnly<CompanyInfo>('get-company-info');
  }, [callReadOnly]);

  const isSupportedToken = useCallback(async (tokenAddress: string): Promise<ContractResponse<boolean>> => {
    return callReadOnly<boolean>('is-supported-token', [
      standardPrincipalCV(tokenAddress)
    ]);
  }, [callReadOnly]);

  // Admin functions
  const initializeCompany = useCallback(async (params: InitializeCompanyParams): Promise<ContractResponse<string>> => {
    return callContractFunction('initialize-company', [
      stringAsciiCV(params.name),
      uintCV(Number(params.id))
    ]);
  }, [callContractFunction]);

  const setUserRole = useCallback(async (params: SetUserRoleParams): Promise<ContractResponse<string>> => {
    return callContractFunction('set-user-role', [
      standardPrincipalCV(params.user),
      uintCV(params.role)
    ]);
  }, [callContractFunction]);

  const pauseContract = useCallback(async (): Promise<ContractResponse<string>> => {
    return callContractFunction('pause-contract', []);
  }, [callContractFunction]);

  const unpauseContract = useCallback(async (): Promise<ContractResponse<string>> => {
    return callContractFunction('unpause-contract', []);
  }, [callContractFunction]);

  const addSupportedToken = useCallback(async (tokenAddress: string): Promise<ContractResponse<string>> => {
    return callContractFunction('add-supported-token', [
      standardPrincipalCV(tokenAddress)
    ]);
  }, [callContractFunction]);

  // Employee management functions
  const addEmployee = useCallback(async (params: AddEmployeeParams): Promise<ContractResponse<string>> => {
    return callContractFunction('add-employee', [
      standardPrincipalCV(params.employeeAddress),
      stringAsciiCV(params.employeeId),
      uintCV(Number(params.salary)),
      standardPrincipalCV(params.token),
      uintCV(params.frequency),
      stringAsciiCV(params.department)
    ]);
  }, [callContractFunction]);

  const updateEmployeeSalary = useCallback(async (params: UpdateEmployeeSalaryParams): Promise<ContractResponse<string>> => {
    return callContractFunction('update-employee-salary', [
      standardPrincipalCV(params.employee),
      uintCV(Number(params.newSalary))
    ]);
  }, [callContractFunction]);

  const updateEmployeeStatus = useCallback(async (params: UpdateEmployeeStatusParams): Promise<ContractResponse<string>> => {
    return callContractFunction('update-employee-status', [
      standardPrincipalCV(params.employee),
      uintCV(params.newStatus)
    ]);
  }, [callContractFunction]);

  const removeEmployee = useCallback(async (employeeAddress: string): Promise<ContractResponse<string>> => {
    return callContractFunction('remove-employee', [
      standardPrincipalCV(employeeAddress)
    ]);
  }, [callContractFunction]);

  // Payment functions
  const processSalaryPayment = useCallback(async (params: ProcessSalaryPaymentParams): Promise<ContractResponse<string>> => {
    return callContractFunction('process-salary-payment', [
      standardPrincipalCV(params.employee),
      contractPrincipalCV(params.token, 'mock-token') // Assuming mock-token for now
    ]);
  }, [callContractFunction]);

  const processBonusPayment = useCallback(async (params: ProcessBonusPaymentParams): Promise<ContractResponse<string>> => {
    return callContractFunction('process-bonus-payment', [
      standardPrincipalCV(params.employee),
      uintCV(Number(params.amount)),
      contractPrincipalCV(params.token, 'mock-token'),
      stringAsciiCV(params.notes)
    ]);
  }, [callContractFunction]);

  const processEmergencyPayment = useCallback(async (params: ProcessEmergencyPaymentParams): Promise<ContractResponse<string>> => {
    return callContractFunction('process-emergency-payment', [
      standardPrincipalCV(params.employee),
      uintCV(Number(params.amount)),
      contractPrincipalCV(params.token, 'mock-token'),
      stringAsciiCV(params.reason)
    ]);
  }, [callContractFunction]);

  // Treasury management functions
  const depositFunds = useCallback(async (params: DepositFundsParams): Promise<ContractResponse<string>> => {
    return callContractFunction('deposit-funds', [
      uintCV(Number(params.amount)),
      contractPrincipalCV(params.token, 'mock-token')
    ]);
  }, [callContractFunction]);

  const requestEmergencyWithdrawal = useCallback(async (params: RequestEmergencyWithdrawalParams): Promise<ContractResponse<string>> => {
    return callContractFunction('request-emergency-withdrawal', [
      uintCV(Number(params.amount)),
      standardPrincipalCV(params.token)
    ]);
  }, [callContractFunction]);

  const executeEmergencyWithdrawal = useCallback(async (params: ExecuteEmergencyWithdrawalParams): Promise<ContractResponse<string>> => {
    return callContractFunction('execute-emergency-withdrawal', [
      standardPrincipalCV(params.requester),
      contractPrincipalCV(params.token, 'mock-token')
    ]);
  }, [callContractFunction]);

  return {
    // State
    isLoading,
    error,

    // Read-only functions
    getEmployeeInfo,
    getEmployeeById,
    getTreasuryBalance,
    getPaymentRecord,
    getUserRole,
    isPaymentDue,
    getCompanyInfo,
    isSupportedToken,

    // Admin functions
    initializeCompany,
    setUserRole,
    pauseContract,
    unpauseContract,
    addSupportedToken,

    // Employee management
    addEmployee,
    updateEmployeeSalary,
    updateEmployeeStatus,
    removeEmployee,

    // Payment functions
    processSalaryPayment,
    processBonusPayment,
    processEmergencyPayment,

    // Treasury management
    depositFunds,
    requestEmergencyWithdrawal,
    executeEmergencyWithdrawal,

    // Utilities
    clearError: () => setError(null),
  };
};
