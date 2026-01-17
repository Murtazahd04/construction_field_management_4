const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User, SiteEngineer, Owner, Consultant, Contractor, SubContractor } = require('../models');

// ============================
// 1. REGISTER FUNCTION
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
            profileCreated = await SiteEngineer.create({
                user_id: newUser.user_id,
                sub_contractor_id: profileData.sub_contractor_id,
                full_name: profileData.full_name,
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
            
            await newUser.update({ reference_id: profileCreated[idField] }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({ 
            message: `${role} registered successfully`, 
            userId: newUser.user_id,
            profileId: profileCreated ? profileCreated.id : null
        });

    } catch (error) {
        await t.rollback();
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};

// ============================
// 2. LOGIN FUNCTION
// ============================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT Token
        const token = jwt.sign(
            { id: user.user_id, role: user.role, refId: user.reference_id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};