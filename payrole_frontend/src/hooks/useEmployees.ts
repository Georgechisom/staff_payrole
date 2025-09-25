import { useState, useEffect, useCallback } from 'react';
import type {
  Employee,
  AddEmployeeParams,
  UpdateEmployeeSalaryParams,
  UpdateEmployeeStatusParams,
  ContractResponse
} from '../types';
import { EmployeeStatus } from '../types';
import { useContract } from './useContract';
// import { useWallet } from './useWallet'; // Will be used for role-based operations

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    getEmployeeInfo, 
    getEmployeeById,
    addEmployee: addEmployeeContract,
    updateEmployeeSalary: updateSalaryContract,
    updateEmployeeStatus: updateStatusContract,
    removeEmployee: removeEmployeeContract,
    isPaymentDue,
  } = useContract();
  
  // const { address } = useWallet(); // Will be used for role-based filtering

  // Load all employees (this would typically come from an indexer or API)
  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would:
      // 1. Query an indexer for all employee-added events
      // 2. Get current employee data for each address
      // 3. Filter out removed employees
      
      // For now, we'll maintain a local list
      // This is a placeholder implementation
      setEmployees([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get employee by address
  const getEmployee = useCallback(async (employeeAddress: string): Promise<Employee | null> => {
    try {
      const response = await getEmployeeInfo(employeeAddress);
      return response.success ? response.data || null : null;
    } catch (err) {
      console.error('Failed to get employee:', err);
      return null;
    }
  }, [getEmployeeInfo]);

  // Get employee by ID
  const getEmployeeByIdAsync = useCallback(async (employeeId: string): Promise<Employee | null> => {
    try {
      const response = await getEmployeeById(employeeId);
      return response.success ? response.data || null : null;
    } catch (err) {
      console.error('Failed to get employee by ID:', err);
      return null;
    }
  }, [getEmployeeById]);

  // Add new employee
  const addEmployee = useCallback(async (params: AddEmployeeParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await addEmployeeContract(params);
      
      if (response.success) {
        // Refresh employees list
        await loadEmployees();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add employee';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addEmployeeContract, loadEmployees]);

  // Update employee salary
  const updateEmployeeSalary = useCallback(async (params: UpdateEmployeeSalaryParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await updateSalaryContract(params);
      
      if (response.success) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp.employeeId === params.employee 
            ? { ...emp, salaryAmount: params.newSalary }
            : emp
        ));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update salary';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateSalaryContract]);

  // Update employee status
  const updateEmployeeStatus = useCallback(async (params: UpdateEmployeeStatusParams): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await updateStatusContract(params);
      
      if (response.success) {
        // Update local state
        setEmployees(prev => prev.map(emp => 
          emp.employeeId === params.employee 
            ? { ...emp, status: params.newStatus }
            : emp
        ));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateStatusContract]);

  // Remove employee
  const removeEmployee = useCallback(async (employeeAddress: string): Promise<ContractResponse<string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await removeEmployeeContract(employeeAddress);
      
      if (response.success) {
        // Remove from local state
        setEmployees(prev => prev.filter(emp => emp.employeeId !== employeeAddress));
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove employee';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [removeEmployeeContract]);

  // Check if payment is due for employee
  const checkPaymentDue = useCallback(async (employeeAddress: string): Promise<boolean> => {
    try {
      const response = await isPaymentDue(employeeAddress);
      return response.success ? response.data || false : false;
    } catch (err) {
      console.error('Failed to check payment due:', err);
      return false;
    }
  }, [isPaymentDue]);

  // Get employees with due payments
  const getEmployeesWithDuePayments = useCallback(async (): Promise<Employee[]> => {
    const employeesWithDuePayments: Employee[] = [];
    
    for (const employee of employees) {
      const isDue = await checkPaymentDue(employee.employeeId);
      if (isDue) {
        employeesWithDuePayments.push(employee);
      }
    }
    
    return employeesWithDuePayments;
  }, [employees, checkPaymentDue]);

  // Filter employees by status
  const getEmployeesByStatus = useCallback((status: EmployeeStatus): Employee[] => {
    return employees.filter(emp => emp.status === status);
  }, [employees]);

  // Filter employees by department
  const getEmployeesByDepartment = useCallback((department: string): Employee[] => {
    return employees.filter(emp => emp.department === department);
  }, [employees]);

  // Get employee statistics
  const getEmployeeStats = useCallback(() => {
    const total = employees.length;
    const active = employees.filter(emp => emp.status === EmployeeStatus.ACTIVE).length;
    const inactive = employees.filter(emp => emp.status === EmployeeStatus.INACTIVE).length;
    const suspended = employees.filter(emp => emp.status === EmployeeStatus.SUSPENDED).length;
    const terminated = employees.filter(emp => emp.status === EmployeeStatus.TERMINATED).length;
    
    const departments = [...new Set(employees.map(emp => emp.department))];
    const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salaryAmount), 0);
    
    return {
      total,
      active,
      inactive,
      suspended,
      terminated,
      departments: departments.length,
      totalSalary: BigInt(totalSalary),
    };
  }, [employees]);

  // Load employees on mount
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    // State
    employees,
    isLoading,
    error,
    
    // Actions
    loadEmployees,
    addEmployee,
    updateEmployeeSalary,
    updateEmployeeStatus,
    removeEmployee,
    
    // Queries
    getEmployee,
    getEmployeeByIdAsync,
    checkPaymentDue,
    getEmployeesWithDuePayments,
    getEmployeesByStatus,
    getEmployeesByDepartment,
    getEmployeeStats,
    
    // Utilities
    clearError: () => setError(null),
  };
};
