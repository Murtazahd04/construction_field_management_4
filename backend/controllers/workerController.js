const { Worker, Attendance, SiteEngineer } = require('../models');

// 1. Add a New Worker (Sub-Contractor/Admin does this)
exports.addWorker = async (req, res) => {
    try {
        const { 
            sub_contractor_id, 
            worker_name, 
            worker_code, 
            phone, 
            category, 
            daily_wage 
        } = req.body;

        const newWorker = await Worker.create({
            sub_contractor_id,
            worker_name,
            worker_code,
            phone,
            category,
            daily_wage,
            is_active: true
        });

        res.status(201).json({ message: "Worker registered successfully", worker: newWorker });
    } catch (error) {
        res.status(500).json({ message: "Failed to add worker", error: error.message });
    }
};

// 2. Mark Attendance (Site Engineer does this)
exports.markAttendance = async (req, res) => {
    try {
        const {
            project_id,
            engineer_id,
            attendance_date,
            attendance_list // Array of objects: [{ worker_id: 1, status: 'present', check_in_time: '09:00' }]
        } = req.body;

        // Process the list
        if (attendance_list && attendance_list.length > 0) {
            const records = attendance_list.map(record => ({
                project_id,
                engineer_id,
                attendance_date,
                worker_id: record.worker_id,
                status: record.status,
                check_in_time: record.check_in_time,
                remarks: record.remarks
            }));

            await Attendance.bulkCreate(records);
        }

        res.status(201).json({ message: "Attendance marked successfully" });

    } catch (error) {
        res.status(500).json({ message: "Attendance failed", error: error.message });
    }
};

// 3. Get Workers for a Sub-Contractor
exports.getWorkers = async (req, res) => {
    try {
        const { subContractorId } = req.params;
        const workers = await Worker.findAll({ where: { sub_contractor_id: subContractorId } });
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};