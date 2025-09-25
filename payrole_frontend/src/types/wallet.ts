// Wallet and authentication related types
// Import types from contract.ts
import type { UserRole, Employee } from './contract';


export interface WalletState {
  isConnected: boolean;
  address: string | null;
  publicKey: string | null;
  network: 'mainnet' | 'testnet' | 'simnet';
  balance: bigint | null;
  isLoading: boolean;
  error: string | null;
}

export interface UserProfile {
  address: string;
  role: UserRole;
  isEmployee: boolean;
  employeeData?: Employee;
  permissions: Permission[];
}

export interface Permission {
  action: string;
  resource: string;
  allowed: boolean;
}

export interface WalletConnection {
  connect: () => Promise<void>;
  disconnect: () => void;
  signTransaction: (transaction: any) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Stacks wallet specific types
export interface StacksWalletConfig {
  appName: string;
  appIcon: string;
  appDomain: string;
}

export interface ConnectOptions {
  onFinish?: (data: any) => void;
  onCancel?: () => void;
  userSession?: any;
  redirectTo?: string;
}

export interface TransactionOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  fee?: number;
  nonce?: number;
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

// Session management
export interface UserSession {
  isSignedIn: boolean;
  userData: any;
  signOut: () => void;
  loadUserData: () => any;
}

// Network types
export const NetworkType = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  SIMNET: 'simnet',
} as const;

export type NetworkType = typeof NetworkType[keyof typeof NetworkType];

export interface NetworkInfo {
  type: NetworkType;
  name: string;
  url: string;
  explorerUrl: string;
  isTestnet: boolean;
}

// Transaction status
export const TransactionStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type TransactionStatus = typeof TransactionStatus[keyof typeof TransactionStatus];

export interface Transaction {
  txId: string;
  status: TransactionStatus;
  functionName: string;
  contractAddress: string;
  contractName: string;
  fee: bigint;
  nonce: bigint;
  timestamp: number;
  blockHeight?: number;
  error?: string;
}

// Wallet provider types
export interface WalletProvider {
  name: string;
  icon: string;
  isInstalled: boolean;
  connect: () => Promise<WalletConnection>;
}

export type { UserRole, Employee };
