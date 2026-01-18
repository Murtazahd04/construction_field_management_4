// backend/controllers/authController.js

// 1. IMPORTS (Make sure these are at the top!)
const bcrypt = require('bcryptjs'); // or 'bcrypt' depending on what you installed
const jwt = require('jsonwebtoken');
const { 
    sequelize, 
    User, 
    SiteEngineer, 
    Owner, 
    Consultant, 
    Contractor, 
    SubContractor 
} = require('../models');

require('dotenv').config();

// ============================
// 2. REGISTER FUNCTION (Paste your code here)
// ============================
exports.register = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { username, email, password, role, ...profileData } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            await t.rollback();
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User Login Record
        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            role,
            platform: 'both'
        }, { transaction: t });

        let profileCreated = null;

        // Create Specific Profile based on Role
        if (role === 'site_engineer') {
            // NOTE: Site Engineer needs sub_contractor_id
            profileCreated = await SiteEngineer.create({
                user_id: newUser.user_id,
                sub_contractor_id: profileData.sub_contractor_id, 
                full_name: profileData.full_name || username, // Fallback if empty
                specialization: profileData.specialization,
                phone: profileData.phone
            }, { transaction: t });

        } else if (role === 'owner') {
            profileCreated = await Owner.create({
                company_name: profileData.company_name,
                contact_person: profileData.contact_person,
                email: email,
                phone: profileData.phone,
                address: profileData.address
            }, { transaction: t });

        } else if (role === 'consultant') {
            // NOTE: Consultant needs owner_id
            if (!profileData.owner_id) throw new Error("Owner ID is required for Consultants");
            
            profileCreated = await Consultant.create({
                owner_id: profileData.owner_id,
                company_name: profileData.company_name,
                contact_person: profileData.contact_person,
                email: email,
                phone: profileData.phone,
                address: profileData.address,
                license_number: profileData.license_number
            }, { transaction: t });

        } else if (role === 'contractor') {
            profileCreated = await Contractor.create({
                company_name: profileData.company_name,
                contact_person: profileData.contact_person,
                email: email,
                phone: profileData.phone,
                address: profileData.address,
                license_number: profileData.license_number
            }, { transaction: t });

        } else if (role === 'sub_contractor') {
            // NOTE: Sub Contractor needs contractor_id
            if (!profileData.contractor_id) throw new Error("Contractor ID is required for Sub Contractors");

            profileCreated = await SubContractor.create({
                contractor_id: profileData.contractor_id,
                company_name: profileData.company_name,
                contact_person: profileData.contact_person,
                email: email,
                phone: profileData.phone,
                address: profileData.address,
                specialization: profileData.specialization
            }, { transaction: t });
        }

        // Update User with Reference ID
        if (profileCreated) {
            const idFieldMap = {
                'site_engineer': 'engineer_id',
                'owner': 'owner_id',
                'consultant': 'consultant_id',
                'contractor': 'contractor_id',
                'sub_contractor': 'sub_contractor_id'
            };
            const idField = idFieldMap[role];
            
            // Access the ID dynamically. 
            // Note: Sequelize usually returns the ID in the object, e.g. profileCreated.owner_id
            const refId = profileCreated[idField] || profileCreated.null; 
            
            // If the key names in database don't match exactly, fallback to just .id or the specific primary key
            // The cleanest way is to check the Primary Key of the created object
            const primaryKeyVal = profileCreated.getDataValue(idField);

            await newUser.update({ reference_id: primaryKeyVal }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({ 
            message: `${role} registered successfully`, 
            userId: newUser.user_id
        });

    } catch (error) {
        await t.rollback();
        console.error("Registration Error:", error);
        
        // Return specific error messages for missing IDs
        if(error.name === 'SequelizeForeignKeyConstraintError') {
             return res.status(400).json({ message: "Invalid Owner ID or Contractor ID provided." });
        }
        
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

// ============================
// 3. LOGIN FUNCTION (Keep this too)
// ============================

exports.adminLogin = async (req, res) => {
    try {
        // Change: Accept email instead of username
        const { email, password } = req.body;
       
        // Check against .env values
        if (
            email === process.env.SUPER_ADMIN_EMAIL && 
            password === process.env.SUPER_ADMIN_PASSWORD
        ) {
            const token = jwt.sign(
                { id: 'admin', role: 'super_admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.json({
                message: "Welcome Super Admin",
                token,
                user: {
                    id: 'admin',
                    username: 'Super Admin',
                    email: process.env.SUPER_ADMIN_EMAIL,
                    role: 'super_admin'
                }
            });
        }

        return res.status(401).json({ message: "Invalid Admin Credentials" });

    } catch (error) {
        res.status(500).json({ message: "Login Error", error: error.message });
    }
};
exports.login = async (req, res) => {
    // ... (Your existing login code here)
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.user_id, role: user.role, refId: user.reference_id }, 
            process.env.JWT_SECRET || 'secret_key', 
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.user_id, username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};