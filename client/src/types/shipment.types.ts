import { Location, Port } from './common.types';

export type ShipmentStatus = 
  | 'Pending'
  | 'Processing' 
  | 'In Transit'
  | 'Customs'
  | 'Delivered'
  | 'Delayed'
  | 'Cancelled';

export type ShipmentType = 
  | 'Ocean Freight'
  | 'Air Freight'
  | 'Trucking'
  | 'Rail'
  | 'Intermodal';

export type ServiceLevel = 
  | 'Express'
  | 'Standard'
  | 'Economy';

export interface Container {
  id: string;
  number: string;
  type: string;
  size: string;
  weight: number;
  seal: string;
  status: string;
}

export interface Commodity {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  weight: number;
  value: number;
  currency: string;
}

export interface ShipmentEvent {
  id: string;
  timestamp: Date;
  location: Location;
  status: ShipmentStatus;
  description: string;
  details?: string;
  isEstimated: boolean;
}

export interface ShipmentLocation {
  current: Location;
  timestamp: Date;
  vessel?: {
    name: string;
    imo: string;
    flag: string;
    type: string;
  };
  estimatedArrival?: Date;
  nextPort?: Port;
}

export interface TrackingInfo {
  shipmentId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  currentLocation: Location;
  events: ShipmentEvent[];
  estimatedDelivery: Date;
  actualDelivery?: Date;
  milestones: {
    booked: Date;
    departed: Date;
    inTransit: Date;
    customsClearance?: Date;
    delivered?: Date;
  };
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  referenceNumber?: string;
  
  // Basic Info
  status: ShipmentStatus;
  type: ShipmentType;
  serviceLevel: ServiceLevel;
  
  // Dates
  bookingDate: Date;
  estimatedDeparture: Date;
  actualDeparture?: Date;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Route
  origin: Port;
  destination: Port;
  route?: Port[];
  
  // Parties
  shipper: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  consignee: {
    name: string;
    address: string;
    contact: string;
    email: string;
  };
  carrier: {
    name: string;
    code: string;
    contact: string;
  };
  
  // Cargo
  containers: Container[];
  commodities: Commodity[];
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  currency: string;
  
  // Documentation
  documents: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  
  // Customs
  customsStatus?: string;
  customsDeclaration?: string;
  dutyAmount?: number;
  taxAmount?: number;
  
  // Tracking
  currentLocation?: Location;
  events: ShipmentEvent[];
  milestones: {
    booked: boolean;
    departed: boolean;
    inTransit: boolean;
    customsClearance: boolean;
    delivered: boolean;
  };
  
  // Financial
  charges: {
    freight: number;
    fuel: number;
    customs: number;
    insurance: number;
    other: number;
    total: number;
    currency: string;
  };
  
  // Metadata
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notes?: string;
  internalReference?: string;
  clientId: string;
  assignedTo?: string;
}

export interface ShipmentFilters {
  status?: ShipmentStatus[];
  type?: ShipmentType[];
  serviceLevel?: ServiceLevel[];
  priority?: string[];
  origin?: string[];
  destination?: string[];
  carrier?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
    field: 'bookingDate' | 'estimatedDelivery' | 'actualDelivery';
  };
  search?: string;
}