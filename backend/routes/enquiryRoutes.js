const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

router.post('/submit', enquiryController.createEnquiry);
router.get('/all', enquiryController.getAllEnquiries);

// --- NEW ROUTES ---
router.put('/:id/approve', enquiryController.approveEnquiry);
router.put('/:id/reject', enquiryController.rejectEnquiry);

module.exports = router;
