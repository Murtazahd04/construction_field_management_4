const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

const { protect } = require('../middleware/authMiddleware'); // Ensure auth middleware is used

// Existing routes
router.post('/create', protect, materialController.createMaterial);
router.post('/request', protect, materialController.createRequest);
router.get('/list', protect, materialController.getAllMaterials);

// --- NEW ROUTES ---
router.get('/requests', protect, materialController.getRequests);
router.put('/requests/:requestId/approve', protect, materialController.approveRequest);

module.exports = router;