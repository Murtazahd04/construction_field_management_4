const { Enquiry ,User, Owner, Contractor, Consultant, SubContractor, sequelize } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Nodemailer config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ CREATE ENQUIRY
exports.createEnquiry = async (req, res) => {
    try {
        const { full_name, email, phone, company_name, role } = req.body;

        const newEnquiry = await Enquiry.create({
            full_name,
            email,
            phone,
            company_name,
            role
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.SUPER_ADMIN_EMAIL,
            subject: `New Company Registration Enquiry: ${company_name}`,
            text: `
New Enquiry Received
-------------------
Role: ${role.toUpperCase()}
Name: ${full_name}
Company: ${company_name}
Email: ${email}
Phone: ${phone}
`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: "Enquiry submitted. We will contact you shortly."
        });

    } catch (error) {
        console.error("Enquiry Error:", error);
        res.status(500).json({
            message: "Failed to submit enquiry",
            error: error.message
        });
    }
};

// ✅ GET ALL ENQUIRIES (Admin)
exports.getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch enquiries",
            error: error.message
        });
    }
};

exports.approveEnquiry = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction(); // Start Transaction

    try {
        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

        // A. Generate Random Password
        const rawPassword = crypto.randomBytes(4).toString('hex'); // e.g., "a3f98b21"
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

      const newUser = await User.create({
            username: enquiry.full_name.split(' ')[0] + Math.floor(Math.random() * 1000),
            email: enquiry.email,
            password_hash: hashedPassword, // <--- FIXED: Changed from 'password' to 'password_hash'
            role: enquiry.role
        }, { transaction: t });

        // C. Create Specific Profile based on Role
        const profileData = {
            user_id: newUser.user_id, // Link to User
            company_name: enquiry.company_name,
            contact_person: enquiry.full_name,
            email: enquiry.email,
            phone: enquiry.phone
        };

        if (enquiry.role === 'owner') await Owner.create(profileData, { transaction: t });
        else if (enquiry.role === 'contractor') await Contractor.create(profileData, { transaction: t });
        else if (enquiry.role === 'consultant') await Consultant.create(profileData, { transaction: t });
        else if (enquiry.role === 'sub_contractor') await SubContractor.create(profileData, { transaction: t });

        // D. Update Enquiry Status
        enquiry.status = 'approved';
        await enquiry.save({ transaction: t });

        // E. Commit Database Changes
        await t.commit();

        // F. Send Email with Password
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: enquiry.email,
            subject: 'Welcome! Your Application is Approved',
            text: `
                Hello ${enquiry.full_name},

                Congratulations! Your application for "${enquiry.company_name}" has been APPROVED by the Super Admin.

                You can now login to the Construction Management System.

                ------------------------------------------------
                YOUR LOGIN CREDENTIALS:
                Role: ${enquiry.role.toUpperCase()}
                Email: ${enquiry.email}
                Password: ${rawPassword}
                ------------------------------------------------

                Please login and change your password immediately.

                Regards,
                Admin Team
            `
        });

        res.json({ message: "User Approved & Password Emailed!" });

    } catch (error) {
        await t.rollback(); // Undo DB changes if email fails
        console.error("Approval Error:", error);
        res.status(500).json({ message: "Approval Failed", error: error.message });
    }
};

// 4. Reject Enquiry
exports.rejectEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await Enquiry.findByPk(id);
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

        enquiry.status = 'rejected';
        await enquiry.save();

        res.json({ message: "Enquiry Rejected" });
    } catch (error) {
        res.status(500).json({ message: "Rejection Failed", error: error.message });
    }
};
