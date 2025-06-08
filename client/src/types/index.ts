// Export all types from each module
export * from './common.types';
export * from './analytics.types';
export * from './transaction.types';
export * from './user.types';

// Export shipment types with renamed Location to avoid conflicts
export type {
  Shipment,
  Container,
  Cargo,
  ShipmentEvent,
  Document,
  ShipmentLocation,
  TrackingInfo,
  ShipmentStatus,
  Port,
  ShipmentType,
  ServiceLevel,
  Commodity,
  ExtendedShipment,
  LegacyContainer
} from './shipment.types';

// Re-export Location from shipment types with alias
export type { Location as ShipmentLocationData } from './shipment.types';