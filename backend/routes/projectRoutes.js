const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// POST http://localhost:3000/api/projects/create
router.post('/create', projectController.createProject);

// GET http://localhost:3000/api/projects/all
router.get('/all', projectController.getAllProjects);

// POST http://localhost:3000/api/projects/assign-contractor
router.post('/assign-contractor', projectController.assignContractor);

// GET http://localhost:3000/api/projects/:projectId/contractors
// Example usage: /api/projects/1/contractors
router.get('/:projectId/contractors', projectController.getProjectContractors);

module.exports = router;