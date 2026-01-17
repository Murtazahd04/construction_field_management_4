const { Material, MaterialRequest, MaterialRequestItem, User } = require('../models');

// 1. Add a New Material to Master List (One time setup usually)
exports.createMaterial = async (req, res) => {
    try {
        const material = await Material.create(req.body);
        res.status(201).json({ message: "Material added", material });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Create a Material Request (Engineer Actions)
exports.createRequest = async (req, res) => {
    try {
        const { 
            project_id, 
            sub_contractor_id, 
            requested_by, // User ID of engineer
            request_date, 
            required_date, 
            items, // Array of items: [{ material_id: 1, quantity_requested: 100 }]
            remarks 
        } = req.body;

        // Create the Request Header
        const request = await MaterialRequest.create({
            project_id,
            sub_contractor_id,
            requested_by,
            request_date,
            required_date,
            remarks,
            status: 'pending'
        });

        // Add Items to the Request
        if (items && items.length > 0) {
            const requestItems = items.map(item => ({
                request_id: request.request_id,
                material_id: item.material_id,
                quantity_requested: item.quantity_requested,
                remarks: item.remarks
            }));
            
            await MaterialRequestItem.bulkCreate(requestItems);
        }

        res.status(201).json({ 
            message: "Material Request Created", 
            requestId: request.request_id 
        });

    } catch (error) {
        console.error("Material Request Error:", error);
        res.status(500).json({ message: "Failed to create request", error: error.message });
    }
};

// 3. Get All Materials (For Dropdowns)
exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.findAll();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};