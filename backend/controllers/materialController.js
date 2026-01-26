const { Material, MaterialRequest, MaterialRequestItem, User, SubContractor } = require('../models');
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



// 4. Get All Requests (For Approval Hub)
exports.getRequests = async (req, res) => {
    try {
        const requests = await MaterialRequest.findAll({
            include: [
                { 
                    model: MaterialRequestItem,
                    include: [{ model: Material, attributes: ['material_name', 'unit', 'material_code'] }]
                },
                { model: User, as: 'Requestor', attributes: ['username', 'email'] }, // Assuming 'requested_by' maps to this
                { model: SubContractor, attributes: ['company_name'] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(requests);
    } catch (error) {
        console.error("Fetch Requests Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// 5. Approve Request
exports.approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { role, id } = req.user; // From Auth Middleware
        const { remarks } = req.body;

        const request = await MaterialRequest.findByPk(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        // Logic: Update status based on who is approving
        let newStatus = request.status;
        
        if (role === 'contractor') {
            newStatus = request.status === 'consultant_approved' ? 'both_approved' : 'contractor_approved';
            await request.update({
                contractor_approved_by: id,
                contractor_approved_at: new Date(),
                contractor_remarks: remarks,
                status: newStatus
            });
        } else if (role === 'consultant') {
            newStatus = request.status === 'contractor_approved' ? 'both_approved' : 'consultant_approved';
            await request.update({
                consultant_approved_by: id,
                consultant_approved_at: new Date(),
                consultant_remarks: remarks,
                status: newStatus
            });
        } else if (role === 'admin' || role === 'owner') {
             // Admin force approval
             newStatus = 'both_approved';
             await request.update({ status: newStatus, remarks: `Force approved by ${role}` });
        } else {
            return res.status(403).json({ message: "Not authorized to approve" });
        }

        res.json({ message: "Request Approved", status: newStatus });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};