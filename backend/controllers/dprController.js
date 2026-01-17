const { DailyProgressReport, Project, SiteEngineer } = require('../models');

// 1. Submit a Daily Report
exports.createDPR = async (req, res) => {
    try {
        const {
            project_id,
            sub_contractor_id,
            engineer_id, // In a real app, you'd get this from the logged-in user token
            report_date,
            weather_condition,
            temperature,
            work_description,
            work_completed,
            work_planned_next_day,
            progress_percentage,
            safety_observations,
            quality_observations
        } = req.body;

        // Check if report already exists for this engineer on this date (prevent duplicates)
        const existingReport = await DailyProgressReport.findOne({
            where: { project_id, engineer_id, report_date }
        });

        if (existingReport) {
            return res.status(400).json({ message: "Report already exists for this date. Please update the existing one." });
        }

        const newDPR = await DailyProgressReport.create({
            project_id,
            sub_contractor_id,
            engineer_id,
            report_date,
            weather_condition,
            temperature,
            work_description,
            work_completed,
            work_planned_next_day,
            progress_percentage,
            safety_observations,
            quality_observations,
            status: 'submitted',
            submitted_at: new Date()
        });

        res.status(201).json({ 
            message: "Daily Progress Report submitted successfully", 
            dpr_id: newDPR.dpr_id 
        });

    } catch (error) {
        console.error("DPR Error:", error);
        res.status(500).json({ message: "Failed to submit report", error: error.message });
    }
};

// 2. Get Reports for a Project
exports.getProjectDPRs = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const reports = await DailyProgressReport.findAll({
            where: { project_id: projectId },
            include: [
                { model: SiteEngineer, attributes: ['full_name', 'specialization'] }
            ],
            order: [['report_date', 'DESC']] // Newest first
        });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reports", error: error.message });
    }
};