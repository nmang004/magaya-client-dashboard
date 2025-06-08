export interface Shipment {
  id: string;
  trackingNumber: string;
  referenceNumber: string;
  status: ShipmentStatus;
  statusColor: string;
  statusIcon: string;
  
  origin: Location;
  destination: Location;
  
  carrier: Carrier;
  
  createdAt: Date;
  estimatedDelivery: Date;
  actualDelivery: Date | null;
  lastUpdated: Date;
  
  container: Container;
  cargo: Cargo;
  
  incoterm: string;
  paymentStatus: 'paid' | 'pending';
  
  events: ShipmentEvent[];
  documents: Document[];
  
  clientId: string;
  consignee: string;
  shipper: string;
  
  priority: 'high' | 'medium' | 'normal';
  tags: string[];
  notes: string | null;
}

export interface Location {
  port: string;
  code: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  warehouse?: string;
}

export interface Carrier {
  name: string;
  logo: string;
  rating: number;
  vesselName: string;
  voyageNumber: string;
}

export interface Container {
  number: string;
  type: string;
  sealNumber: string;
}

export interface Cargo {
  type: string;
  description: string;
  weight: number;
  weightUnit: string;
  volume: number;
  volumeUnit: string;
  value: number;
  currency: string;
  insurance: boolean;
  hazardous: boolean;
}

export interface ShipmentEvent {
  id: string;
  status: string;
  timestamp: Date;
  location: string;
  description: string;
  icon: string;
  completed: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  icon: string;
  uploadDate: Date;
  size: string;
  status: 'approved' | 'pending' | 'rejected';
  url: string;
}

export interface ShipmentLocation {
  shipmentId: string;
  currentLocation: {
    lat: number;
    lng: number;
    timestamp: Date;
    speed: number;
    heading: number;
  };
  progress: number;
  estimatedArrival: Date;
  lastUpdate: Date;
}

export interface TrackingInfo {
  trackingNumber: string;
  status: string;
  statusColor: string;
  statusIcon: string;
  origin: Location;
  destination: Location;
  estimatedDelivery: Date;
  actualDelivery: Date | null;
  events: ShipmentEvent[];
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export type ShipmentStatus = 
  | 'Pending'
  | 'Processing'
  | 'In Transit'
  | 'Customs Hold'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Returned';

// Legacy types for backward compatibility with existing code
export interface Port {
  code: string;
  name: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

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

// Extended Shipment interface for complex operations
export interface ExtendedShipment {
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
  containers: LegacyContainer[];
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
  currentLocation?: Port;
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

// Legacy Container interface for backward compatibility
export interface LegacyContainer {
  id: string;
  number: string;
  type: string;
  size: string;
  weight: number;
  seal: string;
  status: string;
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