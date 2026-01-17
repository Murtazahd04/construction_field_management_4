const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// POST http://localhost:3000/api/materials/add (To add cement, steel to DB)
router.post('/add', materialController.createMaterial);

// GET http://localhost:3000/api/materials/list (To show in dropdown)
router.get('/list', materialController.getAllMaterials);

// POST http://localhost:3000/api/materials/request (Engineer submits request)
router.post('/request', materialController.createRequest);

module.exports = router;