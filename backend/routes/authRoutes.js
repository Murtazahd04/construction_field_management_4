const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// --- PUBLIC ROUTES ---

// 1. Company Registration (Old 'register' is replaced by this)
// Make sure this matches 'exports.registerCompany' in your controller
router.post('/register-company', adminController.registerCompany); 

// 2. Login (This should still be 'exports.login' in your controller)
router.post('/login', authController.login);

// 3. Admin Login
router.post('/admin-login', authController.adminLogin);

// --- ADMIN ONLY ROUTES ---

// 4. Get Pending Companies
// Make sure this matches 'exports.getPendingCompanies' in your controller
router.get('/admin/pending-companies', adminController.getPendingCompanies);

// 5. Approve Company
// Make sure this matches 'exports.approveCompany' in your controller
router.post('/admin/approve-company', adminController.approveCompany);

module.exports = router;