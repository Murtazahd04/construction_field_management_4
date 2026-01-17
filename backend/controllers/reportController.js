const { sequelize } = require('../models');

// Fetch data directly from the SQL View
exports.getDashboardInsights = async (req, res) => {
    try {
        // "consultant_insights" is the view name in your SQL file
        const [results] = await sequelize.query("SELECT * FROM consultant_insights ORDER BY insight_date DESC LIMIT 30");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch Material Consumption View
exports.getMaterialSummary = async (req, res) => {
    try {
        const [results] = await sequelize.query("SELECT * FROM material_consumption_summary");
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// 3. Get Attendance Summary (For Pie Charts & Cost Analysis)
exports.getAttendanceTrends = async (req, res) => {
    try {
        const [results] = await sequelize.query(
            "SELECT * FROM attendance_summary ORDER BY summary_date DESC LIMIT 7"
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Get Late Comers (For the "Shame" List)
exports.getLateComers = async (req, res) => {
    try {
        const [results] = await sequelize.query(
            "SELECT * FROM late_comers_report ORDER BY report_date DESC LIMIT 5"
        );
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};