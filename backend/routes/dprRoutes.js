const express = require('express');
const router = express.Router();
const dprController = require('../controllers/dprController');

// POST http://localhost:3000/api/dpr/create
router.post('/create', dprController.createDPR);

// GET http://localhost:3000/api/dpr/project/:projectId
router.get('/project/:projectId', dprController.getProjectDPRs);

module.exports = router;