// Main types export file

// Contract types
export * from './contract';

// Wallet types
export * from './wallet';

// UI types
export * from './ui';

// Additional utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: string;
}

// Global app state types
export interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: NotificationState[];
}

// Route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  roles?: UserRole[];
  title?: string;
  description?: string;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_STACKS_NETWORK: 'mainnet' | 'testnet' | 'simnet';
  VITE_CONTRACT_ADDRESS: string;
  VITE_CONTRACT_NAME: string;
  VITE_API_URL?: string;
}

// Hook return types
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

// Form types
export interface FormValidationRule {
  required?: boolean | string;
  min?: number | string;
  max?: number | string;
  pattern?: RegExp | string;
  custom?: (value: any) => string | null;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: string;
  defaultValue?: any;
  validation?: FormValidationRule;
  options?: { value: any; label: string }[];
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

// Chart types
export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins: {
    legend: {
      display: boolean;
      position: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: any;
    y?: any;
  };
}

// Date/Time types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string;   // HH:mm format
}

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  url?: string;
  preview?: string;
}

// Search types
export interface SearchResult<T> {
  item: T;
  score: number;
  matches: {
    field: string;
    value: string;
    indices: [number, number][];
  }[];
}

// Export utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event handler types
export type EventHandler<T = any> = (event: T) => void;
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

// Generic callback types
export type Callback = () => void;
export type AsyncCallback = () => Promise<void>;
export type CallbackWithParam<T> = (param: T) => void;
export type AsyncCallbackWithParam<T> = (param: T) => Promise<void>;

// Import React types for convenience
import React from 'react';
export type { React };

// Re-export common React types
export type {
  ReactNode,
  ReactElement,
  ComponentType,
  FC,
  PropsWithChildren,
  CSSProperties,
  MouseEvent,
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react';
