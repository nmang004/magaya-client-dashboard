export type TransactionStatus = 
  | 'Draft'
  | 'Pending'
  | 'Sent'
  | 'Viewed'
  | 'Paid'
  | 'Partially Paid'
  | 'Overdue'
  | 'Cancelled'
  | 'Refunded';

export type TransactionType = 
  | 'Invoice'
  | 'Credit Note'
  | 'Debit Note'
  | 'Estimate'
  | 'Quote';

export type PaymentMethod = 
  | 'Bank Transfer'
  | 'Credit Card'
  | 'Check'
  | 'Cash'
  | 'Wire Transfer'
  | 'ACH'
  | 'PayPal'
  | 'Other';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  serviceCode?: string;
  shipmentId?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  date: Date;
  notes?: string;
  processedBy: string;
  bankDetails?: {
    bank: string;
    account: string;
    routing: string;
  };
}

export interface TaxSummary {
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  taxBreakdown: Array<{
    name: string;
    rate: number;
    amount: number;
  }>;
}

export interface Transaction {
  id: string;
  number: string;
  type: TransactionType;
  status: TransactionStatus;
  
  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Parties
  client: {
    id: string;
    name: string;
    email: string;
    address: string;
    taxId?: string;
    contact: string;
  };
  company: {
    name: string;
    address: string;
    taxId: string;
    contact: string;
    email: string;
    logo?: string;
  };
  
  // Financial Details
  currency: string;
  exchangeRate?: number;
  lineItems: LineItem[];
  tax: TaxSummary;
  
  // Payment Information
  paymentTerms: string;
  paymentMethods: PaymentMethod[];
  payments: PaymentRecord[];
  remainingBalance: number;
  
  // Related Data
  shipmentIds: string[];
  projectId?: string;
  referenceNumber?: string;
  poNumber?: string;
  
  // Metadata
  notes?: string;
  internalNotes?: string;
  tags: string[];
  createdBy: string;
  assignedTo?: string;
  
  // Documents
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  
  // Communication
  emailHistory: Array<{
    id: string;
    type: 'sent' | 'reminder' | 'statement';
    to: string[];
    subject: string;
    sentAt: Date;
    sentBy: string;
    opened?: Date;
  }>;
  
  // Workflow
  approvalRequired: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface TransactionSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  
  byStatus: Array<{
    status: TransactionStatus;
    count: number;
    amount: number;
  }>;
  
  byMonth: Array<{
    month: string;
    invoiced: number;
    paid: number;
    pending: number;
  }>;
  
  topClients: Array<{
    id: string;
    name: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
  }>;
  
  agingReport: Array<{
    range: string;
    count: number;
    amount: number;
  }>;
  
  paymentMethods: Array<{
    method: PaymentMethod;
    count: number;
    amount: number;
  }>;
  
  averagePaymentTime: number;
  collectionEfficiency: number;
  lastUpdated: Date;
}

export interface TransactionFilters {
  status?: TransactionStatus[];
  type?: TransactionType[];
  clientId?: string[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
    field: 'issueDate' | 'dueDate' | 'paidDate';
  };
  amountRange?: {
    min: number;
    max: number;
  };
  currency?: string[];
  tags?: string[];
  search?: string;
  overdue?: boolean;
}

export interface PaymentPlan {
  id: string;
  transactionId: string;
  installments: Array<{
    id: string;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue';
  }>;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: Date;
  createdBy: string;
}

export interface CreditNote {
  id: string;
  number: string;
  originalTransactionId: string;
  reason: string;
  amount: number;
  currency: string;
  issueDate: Date;
  appliedDate?: Date;
  status: 'issued' | 'applied' | 'cancelled';
  createdBy: string;
  notes?: string;
}