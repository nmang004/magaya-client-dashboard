// Common types
export type * from './common.types';

// Domain-specific types
export type * from './shipment.types';
export type * from './analytics.types';
export type * from './transaction.types';
export type * from './user.types';

// Re-export commonly used interfaces
export type {
  PaginatedResponse,
  QueryParams,
  ApiResponse,
  Location,
  Port,
  TimeRange,
  FilterOption,
  SortOption,
  BulkActionResult,
} from './common.types';

export type {
  Shipment,
  ShipmentStatus,
  ShipmentType,
  TrackingInfo,
  ShipmentLocation,
  ShipmentEvent,
  ShipmentFilters,
} from './shipment.types';

export type {
  AnalyticsOverview,
  MonthlyTrend,
  RoutePerformance,
  CarrierPerformance,
  ShipmentDistribution,
  RecentActivity,
  PerformanceMetric,
} from './analytics.types';

export type {
  Transaction,
  TransactionStatus,
  TransactionType,
  TransactionSummary,
  PaymentRecord,
  PaymentMethod,
} from './transaction.types';