const express = require('express');
const router = express.Router();
const { authenticateToken, isolateClientData } = require('../middleware/auth');
const { generateTransaction, generateShipments } = require('../mock-data/generator');

// Store transactions in memory
let transactionsCache = {};

// Helper function to get or generate transactions
const getClientTransactions = (clientId) => {
  if (!transactionsCache[clientId]) {
    const shipments = generateShipments(50, clientId);
    transactionsCache[clientId] = shipments.map((shipment, index) => 
      generateTransaction(shipment.id, index)
    );
  }
  return transactionsCache[clientId];
};

// GET all transactions with filtering
router.get('/', authenticateToken, isolateClientData, (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      status = '',
      type = '',
      dateFrom = '',
      dateTo = '',
      sortBy = 'issueDate',
      sortOrder = 'desc'
    } = req.query;

    // Get transactions for the client
    let transactions = getClientTransactions(req.clientId || 'CLIENT001');

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      transactions = transactions.filter(t => 
        t.invoiceNumber.toLowerCase().includes(searchLower) ||
        t.id.toLowerCase().includes(searchLower) ||
        t.shipmentId.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      transactions = transactions.filter(t => t.status === status);
    }

    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      transactions = transactions.filter(t => new Date(t.issueDate) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      transactions = transactions.filter(t => new Date(t.issueDate) <= toDate);
    }

    // Sort transactions
    transactions.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Calculate summary
    const summary = {
      totalAmount: transactions.reduce((sum, t) => sum + t.total, 0),
      paidAmount: transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0),
      pendingAmount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.total, 0),
      overdueAmount: transactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.total, 0),
      totalTransactions: transactions.length,
      byStatus: transactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total: transactions.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(transactions.length / limit)
      },
      summary
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transactions',
      code: 'FETCH_ERROR'
    });
  }
});

// GET single transaction
router.get('/:id', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch transaction',
      code: 'FETCH_ERROR'
    });
  }
});

// POST create transaction
router.post('/', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const newTransaction = {
      ...req.body,
      id: `TRX-${new Date().getFullYear()}-${String(transactions.length + 1000).padStart(6, '0')}`,
      issueDate: new Date(),
      status: 'pending'
    };
    
    transactions.push(newTransaction);
    
    res.status(201).json({
      success: true,
      data: newTransaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to create transaction',
      code: 'CREATE_ERROR'
    });
  }
});

// PUT update transaction
router.put('/:id', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transactionIndex = transactions.findIndex(t => t.id === req.params.id);

    if (transactionIndex === -1) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...req.body
    };

    res.json({
      success: true,
      data: transactions[transactionIndex]
    });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to update transaction',
      code: 'UPDATE_ERROR'
    });
  }
});

// POST mark transaction as paid
router.post('/:id/mark-paid', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    transaction.status = 'paid';
    transaction.paidDate = new Date();
    transaction.paymentReference = `PAY-${require('crypto').randomBytes(8).toString('hex').toUpperCase()}`;

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Mark paid error:', error);
    res.status(500).json({ 
      error: 'Failed to mark as paid',
      code: 'UPDATE_ERROR'
    });
  }
});

// GET transaction PDF (mock endpoint)
router.get('/:id/download', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    // In production, this would generate and return a PDF
    res.json({
      success: true,
      message: 'PDF download would be initiated',
      downloadUrl: `/api/transactions/${transaction.id}/pdf`,
      transaction: transaction
    });

  } catch (error) {
    console.error('Download transaction error:', error);
    res.status(500).json({ 
      error: 'Failed to download transaction',
      code: 'DOWNLOAD_ERROR'
    });
  }
});

// POST send invoice via email
router.post('/:id/send', authenticateToken, isolateClientData, (req, res) => {
  try {
    const { email } = req.body;
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    // Simulate email sending
    res.json({
      success: true,
      message: `Invoice sent to ${email}`,
      sentAt: new Date()
    });

  } catch (error) {
    console.error('Send invoice error:', error);
    res.status(500).json({ 
      error: 'Failed to send invoice',
      code: 'SEND_ERROR'
    });
  }
});

// GET payment history for a transaction
router.get('/:id/payments', authenticateToken, isolateClientData, (req, res) => {
  try {
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    // Generate mock payment history
    const payments = transaction.status === 'paid' ? [
      {
        id: require('crypto').randomBytes(8).toString('hex'),
        transactionId: transaction.id,
        amount: transaction.total,
        method: transaction.paymentMethod,
        reference: transaction.paymentReference,
        date: transaction.paidDate,
        status: 'completed'
      }
    ] : [];

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment history',
      code: 'FETCH_ERROR'
    });
  }
});

// POST record payment
router.post('/:id/payments', authenticateToken, isolateClientData, (req, res) => {
  try {
    const { amount, method, reference } = req.body;
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');
    const transaction = transactions.find(t => t.id === req.params.id);

    if (!transaction) {
      return res.status(404).json({ 
        error: 'Transaction not found',
        code: 'NOT_FOUND'
      });
    }

    // Create payment record
    const payment = {
      id: require('crypto').randomBytes(8).toString('hex'),
      transactionId: transaction.id,
      amount,
      method,
      reference,
      date: new Date(),
      status: 'completed'
    };

    // Update transaction if fully paid
    if (amount >= transaction.total - (transaction.paidAmount || 0)) {
      transaction.status = 'paid';
      transaction.paidDate = new Date();
      transaction.paymentReference = reference;
    }

    res.status(201).json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ 
      error: 'Failed to record payment',
      code: 'CREATE_ERROR'
    });
  }
});

// GET transaction summary
router.get('/summary', authenticateToken, isolateClientData, (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const transactions = getClientTransactions(req.clientId || 'CLIENT001');

    // Filter transactions by period
    const now = new Date();
    let filteredTransactions = transactions;

    if (period === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredTransactions = transactions.filter(t => 
        new Date(t.issueDate) >= startOfMonth
      );
    } else if (period === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      filteredTransactions = transactions.filter(t => 
        new Date(t.issueDate) >= startOfYear
      );
    }

    const summary = {
      totalAmount: filteredTransactions.reduce((sum, t) => sum + t.total, 0),
      paidAmount: filteredTransactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.total, 0),
      pendingAmount: filteredTransactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.total, 0),
      overdueAmount: filteredTransactions.filter(t => t.status === 'overdue').reduce((sum, t) => sum + t.total, 0),
      totalTransactions: filteredTransactions.length,
      averageTransactionValue: filteredTransactions.length > 0 
        ? filteredTransactions.reduce((sum, t) => sum + t.total, 0) / filteredTransactions.length 
        : 0,
      byStatus: filteredTransactions.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: summary,
      period
    });

  } catch (error) {
    console.error('Get transaction summary error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summary',
      code: 'FETCH_ERROR'
    });
  }
});

module.exports = router;