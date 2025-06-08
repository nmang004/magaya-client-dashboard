export interface AnalyticsOverview {
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  delayedShipments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageTransitTime: number;
  onTimeDeliveryRate: number;
  customerSatisfaction: number;
  topRoutes: Array<{
    route: string;
    shipments: number;
    revenue: number;
  }>;
  topCarriers: Array<{
    name: string;
    shipments: number;
    onTimeRate: number;
  }>;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  shipments: number;
  revenue: number;
  averageTransitTime: number;
  onTimeRate: number;
  delays: number;
  customerSatisfaction: number;
}

export interface RoutePerformance {
  id: string;
  route: string;
  origin: string;
  destination: string;
  shipments: number;
  revenue: number;
  averageTransitTime: number;
  onTimeRate: number;
  delayRate: number;
  trend: number; // percentage change
  lastUpdated: Date;
  carriers: Array<{
    name: string;
    shipments: number;
    performance: number;
  }>;
}

export interface CarrierPerformance {
  id: string;
  name: string;
  code: string;
  totalShipments: number;
  activeShipments: number;
  completedShipments: number;
  onTimeDeliveries: number;
  onTimeRate: number;
  averageTransitTime: number;
  averageDelay: number;
  revenue: number;
  customerRating: number;
  lastShipment: Date;
  trend: {
    shipments: number;
    onTimeRate: number;
    revenue: number;
  };
  routes: Array<{
    route: string;
    shipments: number;
    performance: number;
  }>;
}

export interface ShipmentDistribution {
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
    value: number;
  }>;
  byType: Array<{
    type: string;
    count: number;
    percentage: number;
    revenue: number;
  }>;
  byServiceLevel: Array<{
    level: string;
    count: number;
    percentage: number;
    averageTransitTime: number;
  }>;
  byRegion: Array<{
    region: string;
    shipments: number;
    revenue: number;
    growth: number;
  }>;
  byMonth: Array<{
    month: string;
    shipments: number;
    revenue: number;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'shipment_created' | 'shipment_delivered' | 'delay_reported' | 'payment_received' | 'document_uploaded';
  title: string;
  description: string;
  timestamp: Date;
  shipmentId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: number;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  history: Array<{
    date: Date;
    value: number;
  }>;
}

export interface GeographicData {
  regions: Array<{
    name: string;
    code: string;
    shipments: number;
    revenue: number;
    growth: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }>;
  routes: Array<{
    origin: {
      name: string;
      coordinates: [number, number];
    };
    destination: {
      name: string;
      coordinates: [number, number];
    };
    volume: number;
    revenue: number;
  }>;
}

export interface PredictiveAnalytics {
  demandForecast: Array<{
    period: string;
    predicted: number;
    confidence: number;
    factors: string[];
  }>;
  delayPredictions: Array<{
    shipmentId: string;
    riskScore: number;
    factors: string[];
    recommendedActions: string[];
  }>;
  revenueForecast: Array<{
    month: string;
    predicted: number;
    lower: number;
    upper: number;
  }>;
  capacityOptimization: {
    underutilizedRoutes: string[];
    overloadedRoutes: string[];
    recommendations: string[];
  };
}

export interface CustomReport {
  id: string;
  name: string;
  type: string;
  parameters: {
    dateRange: {
      startDate: Date;
      endDate: Date;
    };
    metrics: string[];
    filters: Record<string, any>;
    groupBy: string[];
  };
  data: any[];
  generatedAt: Date;
  generatedBy: string;
}