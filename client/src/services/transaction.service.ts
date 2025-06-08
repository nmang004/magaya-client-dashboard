import api from './api';
import { PaginatedResponse, QueryParams } from '../types/common.types';
import { Transaction, TransactionSummary, PaymentRecord, PaymentPlan, CreditNote } from '../types/transaction.types';

export const transactionService = {
  // Get all transactions
  getAll: async (params?: QueryParams): Promise<PaginatedResponse<Transaction> & { summary: TransactionSummary }> => {
    const response = await api.get<PaginatedResponse<Transaction> & { summary: TransactionSummary }>('/transactions', {
      params,
    });
    return response.data;
  },

  // Get single transaction
  getById: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.get<{ success: boolean; data: Transaction }>(`/transactions/${id}`);
    return response.data;
  },

  // Create transaction
  create: async (data: Partial<Transaction>): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>('/transactions', data);
    return response.data;
  },

  // Update transaction
  update: async (id: string, data: Partial<Transaction>): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.put<{ success: boolean; data: Transaction }>(`/transactions/${id}`, data);
    return response.data;
  },

  // Mark as paid
  markAsPaid: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/mark-paid`);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (id: string): Promise<Blob> => {
    const response = await api.get(`/transactions/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Send invoice via email
  sendInvoice: async (id: string, email: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>(`/transactions/${id}/send`, { email });
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async (transactionId: string): Promise<{ success: boolean; data: PaymentRecord[] }> => {
    const response = await api.get<{ success: boolean; data: PaymentRecord[] }>(`/transactions/${transactionId}/payments`);
    return response.data;
  },

  // Record payment
  recordPayment: async (transactionId: string, payment: {
    amount: number;
    method: string;
    reference: string;
    date: Date;
    notes?: string;
  }): Promise<{ success: boolean; data: PaymentRecord }> => {
    const response = await api.post<{ success: boolean; data: PaymentRecord }>(
      `/transactions/${transactionId}/payments`,
      payment
    );
    return response.data;
  },

  // Get transaction summary
  getSummary: async (period?: string): Promise<{ success: boolean; data: TransactionSummary }> => {
    const response = await api.get<{ success: boolean; data: TransactionSummary }>('/transactions/summary', {
      params: { period },
    });
    return response.data;
  },

  // Bulk actions
  bulkSendReminders: async (ids: string[]): Promise<{ success: boolean; sent: number }> => {
    const response = await api.post<{ success: boolean; sent: number }>('/transactions/bulk-remind', { ids });
    return response.data;
  },

  // Generate statement
  generateStatement: async (params: {
    startDate: Date;
    endDate: Date;
    format: 'pdf' | 'excel';
    clientId?: string;
  }): Promise<Blob> => {
    const response = await api.post('/transactions/statement', params, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Additional comprehensive transaction methods

  // Duplicate transaction
  duplicate: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/duplicate`);
    return response.data;
  },

  // Convert to different type (e.g., estimate to invoice)
  convertType: async (id: string, newType: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/convert`, { type: newType });
    return response.data;
  },

  // Apply discount
  applyDiscount: async (id: string, discount: {
    type: 'percentage' | 'fixed';
    amount: number;
    reason?: string;
  }): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/discount`, discount);
    return response.data;
  },

  // Void transaction
  void: async (id: string, reason: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/void`, { reason });
    return response.data;
  },

  // Approve transaction
  approve: async (id: string, notes?: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/approve`, { notes });
    return response.data;
  },

  // Reject transaction
  reject: async (id: string, reason: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/reject`, { reason });
    return response.data;
  },

  // Add line item
  addLineItem: async (id: string, lineItem: any): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/line-items`, lineItem);
    return response.data;
  },

  // Update line item
  updateLineItem: async (transactionId: string, lineItemId: string, data: any): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.put<{ success: boolean; data: Transaction }>(
      `/transactions/${transactionId}/line-items/${lineItemId}`,
      data
    );
    return response.data;
  },

  // Remove line item
  removeLineItem: async (transactionId: string, lineItemId: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.delete<{ success: boolean; data: Transaction }>(
      `/transactions/${transactionId}/line-items/${lineItemId}`
    );
    return response.data;
  },

  // Get aging report
  getAgingReport: async (filters?: {
    clientId?: string;
    dateRange?: { startDate: Date; endDate: Date };
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/transactions/aging-report', {
      params: filters,
    });
    return response.data;
  },

  // Get collection report
  getCollectionReport: async (period: string): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/transactions/collection-report', {
      params: { period },
    });
    return response.data;
  },

  // Send payment reminder
  sendReminder: async (id: string, template?: string, customMessage?: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>(`/transactions/${id}/remind`, {
      template,
      customMessage,
    });
    return response.data;
  },

  // Schedule recurring invoice
  scheduleRecurring: async (id: string, schedule: {
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    interval: number;
    endDate?: Date;
    maxOccurrences?: number;
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.post<{ success: boolean; data: any }>(`/transactions/${id}/recurring`, schedule);
    return response.data;
  },

  // Get recurring invoices
  getRecurringInvoices: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/transactions/recurring');
    return response.data;
  },

  // Create payment plan
  createPaymentPlan: async (transactionId: string, plan: {
    installments: Array<{
      amount: number;
      dueDate: Date;
    }>;
  }): Promise<{ success: boolean; data: PaymentPlan }> => {
    const response = await api.post<{ success: boolean; data: PaymentPlan }>(
      `/transactions/${transactionId}/payment-plan`,
      plan
    );
    return response.data;
  },

  // Get payment plan
  getPaymentPlan: async (transactionId: string): Promise<{ success: boolean; data: PaymentPlan }> => {
    const response = await api.get<{ success: boolean; data: PaymentPlan }>(`/transactions/${transactionId}/payment-plan`);
    return response.data;
  },

  // Update payment plan
  updatePaymentPlan: async (transactionId: string, planId: string, updates: any): Promise<{ success: boolean; data: PaymentPlan }> => {
    const response = await api.put<{ success: boolean; data: PaymentPlan }>(
      `/transactions/${transactionId}/payment-plan/${planId}`,
      updates
    );
    return response.data;
  },

  // Create credit note
  createCreditNote: async (transactionId: string, creditNote: {
    amount: number;
    reason: string;
    lineItems?: any[];
  }): Promise<{ success: boolean; data: CreditNote }> => {
    const response = await api.post<{ success: boolean; data: CreditNote }>(
      `/transactions/${transactionId}/credit-note`,
      creditNote
    );
    return response.data;
  },

  // Apply credit note
  applyCreditNote: async (transactionId: string, creditNoteId: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(
      `/transactions/${transactionId}/apply-credit/${creditNoteId}`
    );
    return response.data;
  },

  // Get transaction templates
  getTemplates: async (): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>('/transactions/templates');
    return response.data;
  },

  // Create transaction from template
  createFromTemplate: async (templateId: string, data: any): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(
      `/transactions/templates/${templateId}/create`,
      data
    );
    return response.data;
  },

  // Export transactions
  exportTransactions: async (format: 'csv' | 'excel' | 'pdf', filters?: any): Promise<Blob> => {
    const response = await api.get(`/transactions/export/${format}`, {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  // Import transactions
  importTransactions: async (file: File, mapping: any): Promise<{ success: boolean; data: any }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mapping', JSON.stringify(mapping));

    const response = await api.post<{ success: boolean; data: any }>('/transactions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get transaction analytics
  getAnalytics: async (filters?: {
    timeRange?: { startDate: Date; endDate: Date };
    clientId?: string;
    status?: string[];
  }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/transactions/analytics', {
      params: filters,
    });
    return response.data;
  },

  // Get tax report
  getTaxReport: async (period: { startDate: Date; endDate: Date }): Promise<{ success: boolean; data: any }> => {
    const response = await api.get<{ success: boolean; data: any }>('/transactions/tax-report', {
      params: period,
    });
    return response.data;
  },

  // Recalculate totals
  recalculateTotals: async (id: string): Promise<{ success: boolean; data: Transaction }> => {
    const response = await api.post<{ success: boolean; data: Transaction }>(`/transactions/${id}/recalculate`);
    return response.data;
  },

  // Get audit trail
  getAuditTrail: async (id: string): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get<{ success: boolean; data: any[] }>(`/transactions/${id}/audit-trail`);
    return response.data;
  },
};