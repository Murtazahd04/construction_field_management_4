const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// ============================================
// DASHBOARD & REPORTING ROUTES
// ============================================

// 1. Dashboard Insights (Delays, Issues, Aggregates)
// Used for: The Bar Chart (Delays) and Top Cards (Critical Issues)
// URL: GET http://localhost:3000/api/reports/dashboard-insights
router.get('/dashboard-insights', reportController.getDashboardInsights);

// 2. Material Consumption Summary
// Used for: The Line Chart (Requested vs Consumed materials)
// URL: GET http://localhost:3000/api/reports/material-summary
router.get('/material-summary', reportController.getMaterialSummary);

// 3. Attendance Trends (Manpower Stats)
// Used for: The Pie Chart (Present vs Absent) and Labor Cost Card
// URL: GET http://localhost:3000/api/reports/attendance-trends
router.get('/attendance-trends', reportController.getAttendanceTrends);

// 4. Late Comers Report
// Used for: The "Recent Late Comers" Table widget
// URL: GET http://localhost:3000/api/reports/late-comers
router.get('/late-comers', reportController.getLateComers);

module.exports = router;