const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

// POST http://localhost:3000/api/workers/add
router.post('/add', workerController.addWorker);

// GET http://localhost:3000/api/workers/list/:subContractorId
router.get('/list/:subContractorId', workerController.getWorkers);

// POST http://localhost:3000/api/workers/attendance
router.post('/attendance', workerController.markAttendance);

module.exports = router;