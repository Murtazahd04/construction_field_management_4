const crypto = require('crypto'); // Built-in node module for generating passwords
const bcrypt = require('bcryptjs');
const { sequelize, User, Owner } = require('../models');

// 1. PUBLIC: Register a Company (Request)
exports.registerCompany = async (req, res) => {
    try {
        const { company_name, contact_person, email, phone, address } = req.body;

        // Check if email already exists in User table (already has account)
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered in the system." });
        }

        // Check if email exists in Owners table (pending or approved)
        const existingOwner = await Owner.findOne({ where: { email } });
        if (existingOwner) {
            return res.status(400).json({ message: "A company with this email is already registered/pending." });
        }

        // Create the Owner Request
        await Owner.create({
            company_name,
            contact_person,
            email,
            phone,
            address,
            status: 'pending' // Default status
        });

        res.status(201).json({ 
            message: "Company registration request sent to Super Admin. Please wait for approval." 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

// 2. ADMIN ONLY: Get Pending Requests
exports.getPendingCompanies = async (req, res) => {
    try {
        // Fetch only owners with 'pending' status
        const pendingOwners = await Owner.findAll({ where: { status: 'pending' } });
        res.json(pendingOwners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. ADMIN ONLY: Approve Company & Generate Password
exports.approveCompany = async (req, res) => {
    const t = await sequelize.transaction(); // Start transaction

    try {
        const { owner_id } = req.body; // ID of the owner request to approve

        // Find the pending owner
        const owner = await Owner.findByPk(owner_id);
        if (!owner) {
            await t.rollback();
            return res.status(404).json({ message: "Owner request not found" });
        }

        if (owner.status === 'approved') {
            await t.rollback();
            return res.status(400).json({ message: "This company is already approved." });
        }

        // A. Generate Random Password (8 characters)
        const generatedPassword = crypto.randomBytes(4).toString('hex'); 
        
        // B. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);

        // C. Create the Login Account (User Table)
        const newUser = await User.create({
            username: owner.email, // Using email as username for simplicity
            email: owner.email,
            password_hash: hashedPassword,
            role: 'owner', // Enforcing the role
            reference_id: owner.owner_id,
            platform: 'both',
            is_active: true
        }, { transaction: t });

        // D. Update Owner Status
        owner.status = 'approved';
        await owner.save({ transaction: t });

        await t.commit();

        // E. Return the credentials (In a real app, you would EMAIL this to owner.email)
        res.status(200).json({ 
            message: "Company Approved Successfully", 
            company: owner.company_name,
            generated_credentials: {
                email: owner.email,
                password: generatedPassword 
            }
        });

    } catch (error) {
        await t.rollback();
        console.error("Approval Error:", error);
        res.status(500).json({ message: "Approval failed", error: error.message });
    }
};