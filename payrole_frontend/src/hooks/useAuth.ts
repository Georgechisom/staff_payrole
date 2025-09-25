import { useState, useEffect, useCallback } from 'react';
import type { AuthState, UserProfile, Permission } from '../types';
import { UserRole } from '../types';
import { useWalletContext } from '../components/wallet/WalletProvider';
import { useContract } from './useContract';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  });

  const { walletState } = useWalletContext();
  const { getUserRole, getEmployeeInfo } = useContract();

  // Load user profile when wallet is connected
  const loadUserProfile = useCallback(async () => {
    if (!walletState.isConnected || !walletState.address) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Get user role from contract
      const roleResponse = await getUserRole(walletState.address);
      const userRole = roleResponse.success ? roleResponse.data || UserRole.EMPLOYEE : UserRole.EMPLOYEE;

      // Check if user is an employee
      const employeeResponse = await getEmployeeInfo(walletState.address);
      const isEmployee = employeeResponse.success && employeeResponse.data !== null;
      const employeeData = isEmployee && employeeResponse.data ? employeeResponse.data : undefined;

      // Generate permissions based on role
      const permissions = generatePermissions(userRole);

      const userProfile: UserProfile = {
        address: walletState.address,
        role: userRole,
        isEmployee,
        employeeData,
        permissions,
      };

      setAuthState({
        isAuthenticated: true,
        user: userProfile,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load user profile',
      });
    }
  }, [walletState.isConnected, walletState.address, getUserRole, getEmployeeInfo]);

  // Generate permissions based on user role
  const generatePermissions = useCallback((role: UserRole): Permission[] => {
    const permissions: Permission[] = [];

    // Base permissions for all users
    permissions.push(
      { action: 'read', resource: 'dashboard', allowed: true },
      { action: 'read', resource: 'profile', allowed: true }
    );

    // Role-specific permissions
    switch (role) {
      case UserRole.ADMIN:
        permissions.push(
          { action: 'read', resource: 'admin', allowed: true },
          { action: 'write', resource: 'admin', allowed: true },
          { action: 'read', resource: 'employees', allowed: true },
          { action: 'write', resource: 'employees', allowed: true },
          { action: 'read', resource: 'payments', allowed: true },
          { action: 'write', resource: 'payments', allowed: true },
          { action: 'read', resource: 'treasury', allowed: true },
          { action: 'write', resource: 'treasury', allowed: true },
          { action: 'emergency', resource: 'all', allowed: true }
        );
        break;

      case UserRole.HR:
        permissions.push(
          { action: 'read', resource: 'employees', allowed: true },
          { action: 'write', resource: 'employees', allowed: true },
          { action: 'read', resource: 'payments', allowed: true }
        );
        break;

      case UserRole.FINANCE:
        permissions.push(
          { action: 'read', resource: 'employees', allowed: true },
          { action: 'read', resource: 'payments', allowed: true },
          { action: 'write', resource: 'payments', allowed: true },
          { action: 'read', resource: 'treasury', allowed: true },
          { action: 'write', resource: 'treasury', allowed: true }
        );
        break;

      case UserRole.EMPLOYEE:
        permissions.push(
          { action: 'read', resource: 'own-data', allowed: true }
        );
        break;

      default:
        // No additional permissions for unknown roles
        break;
    }

    return permissions;
  }, []);

  // Check if user has a specific permission
  const hasPermission = useCallback((action: string, resource: string): boolean => {
    if (!authState.user) return false;

    return authState.user.permissions.some(
      permission => 
        permission.action === action && 
        permission.resource === resource && 
        permission.allowed
    );
  }, [authState.user]);

  // Check if user has any of the specified roles
  const hasRole = useCallback((roles: UserRole[]): boolean => {
    if (!authState.user) return false;
    return roles.includes(authState.user.role);
  }, [authState.user]);

  // Check if user is admin
  const isAdmin = useCallback((): boolean => {
    return hasRole([UserRole.ADMIN]);
  }, [hasRole]);

  // Check if user is HR
  const isHR = useCallback((): boolean => {
    return hasRole([UserRole.HR]);
  }, [hasRole]);

  // Check if user is Finance
  const isFinance = useCallback((): boolean => {
    return hasRole([UserRole.FINANCE]);
  }, [hasRole]);

  // Check if user is Employee
  const isEmployee = useCallback((): boolean => {
    return hasRole([UserRole.EMPLOYEE]);
  }, [hasRole]);

  // Check if user can access admin features
  const canAccessAdmin = useCallback((): boolean => {
    return hasPermission('read', 'admin');
  }, [hasPermission]);

  // Check if user can manage employees
  const canManageEmployees = useCallback((): boolean => {
    return hasPermission('write', 'employees');
  }, [hasPermission]);

  // Check if user can process payments
  const canProcessPayments = useCallback((): boolean => {
    return hasPermission('write', 'payments');
  }, [hasPermission]);

  // Check if user can manage treasury
  const canManageTreasury = useCallback((): boolean => {
    return hasPermission('write', 'treasury');
  }, [hasPermission]);

  // Get role display name
  const getRoleDisplayName = useCallback((role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.HR:
        return 'Human Resources';
      case UserRole.FINANCE:
        return 'Finance';
      case UserRole.EMPLOYEE:
        return 'Employee';
      default:
        return 'Unknown';
    }
  }, []);

  // Refresh user profile
  const refreshProfile = useCallback(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Clear auth state
  const clearAuth = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  }, []);

  // Load user profile when wallet connection changes
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return {
    // State
    ...authState,
    
    // Actions
    loadUserProfile,
    refreshProfile,
    clearAuth,
    
    // Permission checks
    hasPermission,
    hasRole,
    isAdmin,
    isHR,
    isFinance,
    isEmployee,
    canAccessAdmin,
    canManageEmployees,
    canProcessPayments,
    canManageTreasury,
    
    // Utilities
    getRoleDisplayName,
    generatePermissions,
  };
};
