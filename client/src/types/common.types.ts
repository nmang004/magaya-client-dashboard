export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
}

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