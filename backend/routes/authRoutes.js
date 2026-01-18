const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST http://localhost:3000/api/auth/register
router.post('/register', authController.register);

// POST http://localhost:3000/api/auth/login
router.post('/login', authController.login);
// POST http://localhost:3000/api/auth/admin-login
router.post('/admin-login', authController.adminLogin);

module.exports = router;