const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

router.post('/submit', enquiryController.createEnquiry);
router.get('/all', enquiryController.getAllEnquiries);

module.exports = router;
