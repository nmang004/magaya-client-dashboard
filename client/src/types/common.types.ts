export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats?: any;
  filters?: any;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
}

export interface ApiError {
  error: string;
  code: string;
  status: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  link?: string;
}

// Legacy interface for backward compatibility
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Port {
  code: string;
  name: string;
  city: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface SortOption {
  label: string;
  field: string;
  direction: 'asc' | 'desc';
}

export interface BulkActionResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: string[];
}