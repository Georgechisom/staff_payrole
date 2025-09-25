// UI and component related types

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  isVisible: boolean;
  timestamp: number;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableState<T> {
  data: T[];
  sortColumn?: keyof T;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
  totalItems: number;
  isLoading: boolean;
  error?: string;
}

export interface FilterState {
  searchTerm: string;
  filters: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  isLoading?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  badge?: {
    text: string;
    color: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  };
  permissions?: string[];
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
  isCompleted: boolean;
  isActive: boolean;
  isDisabled?: boolean;
}

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

export interface TooltipProps {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'focus';
}

export interface ProgressState {
  current: number;
  total: number;
  percentage: number;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export interface SearchState {
  query: string;
  results: any[];
  isSearching: boolean;
  hasResults: boolean;
  selectedIndex: number;
}

export interface FileUploadState {
  files: File[];
  isUploading: boolean;
  progress: number;
  error?: string;
  uploadedFiles: {
    name: string;
    url: string;
    size: number;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  description?: string;
  location?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: Date;
  type: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

// Theme types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  animations: boolean;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
}

// Layout types
export interface LayoutConfig {
  sidebar: {
    isCollapsed: boolean;
    width: number;
    position: 'left' | 'right';
  };
  header: {
    height: number;
    isFixed: boolean;
  };
  footer: {
    height: number;
    isVisible: boolean;
  };
}

// Responsive breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface TransitionConfig {
  enter: AnimationConfig;
  exit: AnimationConfig;
}

// Accessibility types
export interface A11yProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}

// Component props base types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  testId?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
}

// Size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

// Button variants
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

// Input variants
export type InputVariant = 'outline' | 'filled' | 'flushed' | 'unstyled';
