export interface AnalyticsOverview {
  totalShipments: number;
  activeShipments: number;
  deliveredThisMonth: number;
  pendingShipments: number;
  
  onTimeDeliveryRate: number;
  averageTransitTime: number;
  customerSatisfaction: number;
  
  totalRevenue: number;
  outstandingPayments: number;
  averageShipmentValue: number;
}

export interface MonthlyTrend {
  month: string;
  shipments: number;
  delivered: number;
  revenue: number;
  onTimeDelivery: number;
}

export interface RoutePerformance {
  route: string;
  shipments: number;
  avgTransitTime: number;
  onTimeRate: number;
  revenue: number;
}

export interface CarrierPerformance {
  carrier: string;
  shipments: number;
  onTimeRate: number;
  avgRating: number;
  incidents: number;
}

export interface ShipmentDistribution {
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  topDestinations: Array<{
    destination: string;
    shipments: number;
    revenue: number;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'shipment_created' | 'payment_received' | 'delivery_completed' | 'document_uploaded';
  description: string;
  timestamp: Date;
}

export interface PerformanceMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
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