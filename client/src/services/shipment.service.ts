import api from './api';
import { PaginatedResponse, QueryParams } from '../types/common.types';
import { Shipment, ShipmentLocation, TrackingInfo } from '../types/shipment.types';

export const shipmentService = {
  // Get all shipments with filters
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get<PaginatedResponse<Shipment>>('/shipments', { params });
    return response.data;
  },

  // Get single shipment by ID
  getById: async (id: string): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.get<{ success: boolean; data: Shipment }>(`/shipments/${id}`);
    return response.data;
  },

  // Track shipment by tracking number
  track: async (trackingNumber: string): Promise<{ success: boolean; data: TrackingInfo }> => {
    const response = await api.get<{ success: boolean; data: TrackingInfo }>(
      `/shipments/track/${trackingNumber}`
    );
    return response.data;
  },

  // Get real-time location for in-transit shipments
  getLocation: async (id: string): Promise<{ success: boolean; data: ShipmentLocation }> => {
    const response = await api.get<{ success: boolean; data: ShipmentLocation }>(
      `/shipments/${id}/location`
    );
    return response.data;
  },

  // Create new shipment
  create: async (data: Partial<Shipment>): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.post<{ success: boolean; data: Shipment }>('/shipments', data);
    return response.data;
  },

  // Update shipment
  update: async (id: string, data: Partial<Shipment>): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.put<{ success: boolean; data: Shipment }>(`/shipments/${id}`, data);
    return response.data;
  },

  // Delete shipment
  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/shipments/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (ids: string[], data: Partial<Shipment>): Promise<{ success: boolean; updated: number }> => {
    const response = await api.post<{ success: boolean; updated: number }>('/shipments/bulk-update', {
      ids,
      data,
    });
    return response.data;
  },

  // Export shipments
  export: async (format: 'csv' | 'pdf', filters?: QueryParams): Promise<Blob> => {
    const response = await api.get(`/shipments/export/${format}`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Get shipment documents
  getDocuments: async (id: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>(`/shipments/${id}/documents`);
    return response.data;
  },

  // Upload document
  uploadDocument: async (id: string, file: File): Promise<{ success: boolean; data: any }> => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await api.post<{ success: boolean; data: any }>(
      `/shipments/${id}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Additional methods for comprehensive shipment management
  
  // Update shipment status
  updateStatus: async (id: string, status: string, notes?: string): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.patch<{ success: boolean; data: Shipment }>(`/shipments/${id}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  // Add tracking event
  addEvent: async (id: string, event: {
    status: string;
    location: string;
    description: string;
    timestamp?: Date;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>(`/shipments/${id}/events`, event);
    return response.data;
  },

  // Get shipment history
  getHistory: async (id: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>(`/shipments/${id}/history`);
    return response.data;
  },

  // Clone shipment
  clone: async (id: string): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.post<{ success: boolean; data: Shipment }>(`/shipments/${id}/clone`);
    return response.data;
  },

  // Cancel shipment
  cancel: async (id: string, reason: string): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.post<{ success: boolean; data: Shipment }>(`/shipments/${id}/cancel`, { reason });
    return response.data;
  },

  // Request quote
  requestQuote: async (shipmentData: Partial<Shipment>): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>('/shipments/quote', shipmentData);
    return response.data;
  },

  // Book shipment from quote
  bookFromQuote: async (quoteId: string): Promise<{ success: boolean; data: Shipment }> => {
    const response = await api.post<{ success: boolean; data: Shipment }>(`/shipments/book/${quoteId}`);
    return response.data;
  },

  // Get delivery proof
  getDeliveryProof: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>(`/shipments/${id}/delivery-proof`);
    return response.data;
  },

  // Upload delivery proof
  uploadDeliveryProof: async (id: string, file: File, signature?: string): Promise<{ success: boolean; data: any }> => {
    const formData = new FormData();
    formData.append('proof', file);
    if (signature) {
      formData.append('signature', signature);
    }
    
    const response = await api.post<{ success: boolean; data: any }>(
      `/shipments/${id}/delivery-proof`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get shipment analytics
  getAnalytics: async (id: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>(`/shipments/${id}/analytics`);
    return response.data;
  },

  // Search shipments
  search: async (query: string, filters?: any): Promise<{ success: boolean; data: Shipment[] }> => {
    const response = await api.get<{ success: boolean; data: Shipment[] }>('/shipments/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  // Get similar shipments
  getSimilar: async (id: string): Promise<{ success: boolean; data: Shipment[] }> => {
    const response = await api.get<{ success: boolean; data: Shipment[] }>(`/shipments/${id}/similar`);
    return response.data;
  },

  // Schedule pickup
  schedulePickup: async (id: string, pickupData: {
    date: Date;
    timeWindow: string;
    address: string;
    contact: string;
    instructions?: string;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>(`/shipments/${id}/pickup`, pickupData);
    return response.data;
  },

  // Get rate calculation
  calculateRates: async (shipmentData: {
    origin: string;
    destination: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
    serviceType: string;
  }): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.post<{ success: boolean; data: any[] }>('/shipments/rates', shipmentData);
    return response.data;
  },
};