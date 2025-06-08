import api from './api';
import {
  AnalyticsOverview,
  MonthlyTrend,
  RoutePerformance,
  CarrierPerformance,
  ShipmentDistribution,
  RecentActivity,
  PerformanceMetric,
  GeographicData,
  PredictiveAnalytics,
  CustomReport,
} from '../types/analytics.types';

export const analyticsService = {
  // Get analytics overview
  getOverview: async (): Promise<{ success: boolean; data: AnalyticsOverview }> => {
    const response = await api.get<{ success: boolean; data: AnalyticsOverview }>('/analytics/overview');
    return response.data;
  },

  // Get monthly trends
  getMonthlyTrends: async (year?: number): Promise<{ success: boolean; data: MonthlyTrend[] }> => {
    const response = await api.get<{ success: boolean; data: MonthlyTrend[] }>('/analytics/trends/monthly', {
      params: { year },
    });
    return response.data;
  },

  // Get route performance
  getRoutePerformance: async (): Promise<{ success: boolean; data: RoutePerformance[] }> => {
    const response = await api.get<{ success: boolean; data: RoutePerformance[] }>('/analytics/routes/performance');
    return response.data;
  },

  // Get carrier performance
  getCarrierPerformance: async (): Promise<{ success: boolean; data: CarrierPerformance[] }> => {
    const response = await api.get<{ success: boolean; data: CarrierPerformance[] }>('/analytics/carriers/performance');
    return response.data;
  },

  // Get shipment distribution
  getShipmentDistribution: async (): Promise<{ success: boolean; data: ShipmentDistribution }> => {
    const response = await api.get<{ success: boolean; data: ShipmentDistribution }>('/analytics/shipments/distribution');
    return response.data;
  },

  // Get recent activity
  getRecentActivity: async (limit?: number): Promise<{ success: boolean; data: RecentActivity[] }> => {
    const response = await api.get<{ success: boolean; data: RecentActivity[] }>('/analytics/activity/recent', {
      params: { limit },
    });
    return response.data;
  },

  // Generate custom report
  generateReport: async (params: {
    type: string;
    startDate: Date;
    endDate: Date;
    metrics: string[];
  }): Promise<{ success: boolean; data: CustomReport }> => {
    const response = await api.post<{ success: boolean; data: CustomReport }>('/analytics/reports/generate', params);
    return response.data;
  },

  // Export analytics data
  exportData: async (type: string, format: 'csv' | 'pdf' | 'excel'): Promise<Blob> => {
    const response = await api.get(`/analytics/export/${type}`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },

  // Get predictive analytics
  getPredictions: async (): Promise<{ success: boolean; data: PredictiveAnalytics }> => {
    const response = await api.get<{ success: boolean; data: PredictiveAnalytics }>('/analytics/predictions');
    return response.data;
  },

  // Get performance metrics
  getPerformanceMetrics: async (period: 'day' | 'week' | 'month' | 'year'): Promise<{ success: boolean; data: PerformanceMetric[] }> => {
    const response = await api.get<{ success: boolean; data: PerformanceMetric[] }>('/analytics/performance', {
      params: { period },
    });
    return response.data;
  },

  // Additional comprehensive analytics methods

  // Get geographic distribution data
  getGeographicData: async (): Promise<{ success: boolean; data: GeographicData }> => {
    const response = await api.get<{ success: boolean; data: GeographicData }>('/analytics/geographic');
    return response.data;
  },

  // Get real-time dashboard data
  getRealTimeData: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/realtime');
    return response.data;
  },

  // Get comparative analysis
  getComparativeAnalysis: async (periods: { 
    current: { startDate: Date; endDate: Date }; 
    previous: { startDate: Date; endDate: Date }; 
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>('/analytics/compare', periods);
    return response.data;
  },

  // Get cost analysis
  getCostAnalysis: async (filters?: {
    timeRange?: { startDate: Date; endDate: Date };
    routes?: string[];
    carriers?: string[];
    serviceTypes?: string[];
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/costs', {
      params: filters,
    });
    return response.data;
  },

  // Get customer analytics
  getCustomerAnalytics: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/customers');
    return response.data;
  },

  // Get operational efficiency metrics
  getOperationalEfficiency: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/efficiency');
    return response.data;
  },

  // Get seasonal trends
  getSeasonalTrends: async (years?: number[]): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/trends/seasonal', {
      params: { years },
    });
    return response.data;
  },

  // Get benchmark comparison
  getBenchmarkComparison: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/benchmarks');
    return response.data;
  },

  // Get compliance metrics
  getComplianceMetrics: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/compliance');
    return response.data;
  },

  // Get carbon footprint analysis
  getCarbonFootprint: async (filters?: {
    timeRange?: { startDate: Date; endDate: Date };
    routes?: string[];
    transportModes?: string[];
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/carbon-footprint', {
      params: filters,
    });
    return response.data;
  },

  // Get demand forecasting
  getDemandForecast: async (horizon: number): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/forecast/demand', {
      params: { horizon },
    });
    return response.data;
  },

  // Get capacity utilization
  getCapacityUtilization: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/capacity');
    return response.data;
  },

  // Get exception analysis
  getExceptionAnalysis: async (): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/exceptions');
    return response.data;
  },

  // Get transit time analysis
  getTransitTimeAnalysis: async (filters?: {
    routes?: string[];
    carriers?: string[];
    timeRange?: { startDate: Date; endDate: Date };
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/transit-time', {
      params: filters,
    });
    return response.data;
  },

  // Get profitability analysis
  getProfitabilityAnalysis: async (groupBy: 'route' | 'customer' | 'service' | 'carrier'): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/analytics/profitability', {
      params: { groupBy },
    });
    return response.data;
  },

  // Save custom dashboard
  saveCustomDashboard: async (dashboard: {
    name: string;
    widgets: any[];
    layout: any;
    filters?: any;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>('/analytics/dashboards', dashboard);
    return response.data;
  },

  // Get saved dashboards
  getSavedDashboards: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/analytics/dashboards');
    return response.data;
  },

  // Delete custom dashboard
  deleteDashboard: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/analytics/dashboards/${id}`);
    return response.data;
  },

  // Get alert configurations
  getAlerts: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/analytics/alerts');
    return response.data;
  },

  // Create alert rule
  createAlert: async (alert: {
    name: string;
    metric: string;
    condition: string;
    threshold: number;
    frequency: string;
    recipients: string[];
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>('/analytics/alerts', alert);
    return response.data;
  },

  // Update alert rule
  updateAlert: async (id: string, alert: any): Promise<{ success: boolean; data: any }> => {
    const response = await api.put<{ success: boolean; data: any }>(`/analytics/alerts/${id}`, alert);
    return response.data;
  },

  // Delete alert rule
  deleteAlert: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/analytics/alerts/${id}`);
    return response.data;
  },
};