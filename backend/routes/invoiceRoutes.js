const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// POST http://localhost:3000/api/invoices/create
router.post('/create', invoiceController.createInvoice);

// GET http://localhost:3000/api/invoices/project/:projectId
router.get('/project/:projectId', invoiceController.getProjectInvoices);

// PUT http://localhost:3000/api/invoices/:invoiceId/pay
router.put('/:invoiceId/pay', invoiceController.updatePaymentStatus);

module.exports = router;