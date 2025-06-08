const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const crypto = require('crypto');

// Mock document storage
let documentsCache = {};

// GET all documents for a client
router.get('/', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    const documents = documentsCache[clientId] || [];

    res.json({
      success: true,
      data: documents,
      total: documents.length
    });

  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      code: 'FETCH_ERROR'
    });
  }
});

// POST upload document
router.post('/upload', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    const { name, type, shipmentId, size } = req.body;

    if (!documentsCache[clientId]) {
      documentsCache[clientId] = [];
    }

    const newDocument = {
      id: crypto.randomBytes(8).toString('hex'),
      name: name || 'Untitled Document',
      type: type || 'document',
      shipmentId,
      uploadDate: new Date(),
      uploadedBy: req.user.email,
      size: size || '0 KB',
      status: 'processing',
      url: `#document-${Date.now()}`
    };

    documentsCache[clientId].push(newDocument);

    // Simulate processing delay
    setTimeout(() => {
      newDocument.status = 'approved';
    }, 2000);

    res.status(201).json({
      success: true,
      data: newDocument
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ 
      error: 'Failed to upload document',
      code: 'UPLOAD_ERROR'
    });
  }
});

// DELETE document
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const clientId = req.user.clientId;
    const documents = documentsCache[clientId] || [];
    
    const index = documents.findIndex(d => d.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ 
        error: 'Document not found',
        code: 'NOT_FOUND'
      });
    }

    documents.splice(index, 1);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      code: 'DELETE_ERROR'
    });
  }
});

module.exports = router;