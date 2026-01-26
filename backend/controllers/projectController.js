
const { Project, Owner, Consultant, ProjectContractor, Contractor } = require('../models');

// 1. Create a New Project
exports.createProject = async (req, res) => {
    try {
        const { 
            owner_id, 
            consultant_id, 
            project_name, 
            project_code, 
            location, 
            start_date, 
            expected_end_date, 
            budget,
            description 
        } = req.body;

        const newProject = await Project.create({
            owner_id,
            consultant_id,
            project_name,
            project_code,
            location,
            start_date,
            expected_end_date,
            budget,
            description,
            status: 'active' // Default status
        });

        res.status(201).json({ 
            message: "Project created successfully", 
            project: newProject 
        });

    } catch (error) {
        console.error("Create Project Error:", error);
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};

// 2. Get All Projects
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: Owner, attributes: ['company_name', 'contact_person'] },
                { model: Consultant, attributes: ['company_name'] }
            ]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error: error.message });
    }
};


// 3. Assign Contractor to Project
exports.assignContractor = async (req, res) => {
    try {
        const { 
            project_id, 
            contractor_id, 
            work_scope, 
            contract_value, 
            assigned_date 
        } = req.body;

        // Check if Project and Contractor exist
        const project = await Project.findByPk(project_id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const contractor = await Contractor.findByPk(contractor_id);
        if (!contractor) return res.status(404).json({ message: "Contractor not found" });

        // Create Assignment
        const assignment = await ProjectContractor.create({
            project_id,
            contractor_id,
            work_scope,
            contract_value,
            assigned_date: assigned_date || new Date(),
            status: 'active'
        });

        res.status(201).json({ 
            message: "Contractor assigned successfully", 
            assignment 
        });

    } catch (error) {
        console.error("Assignment Error:", error);
        res.status(500).json({ message: "Failed to assign contractor", error: error.message });
    }
};

// 4. Get Assigned Contractors for a Project
exports.getProjectContractors = async (req, res) => {
    try {
        const { projectId } = req.params;

        const assignments = await ProjectContractor.findAll({
            where: { project_id: projectId },
            include: [
                { model: Contractor, attributes: ['company_name', 'contact_person', 'phone'] }
            ]
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching contractors", error: error.message });
    }
};
