const { Enquiry } = require('../models');
const nodemailer = require('nodemailer');
require('dotenv').config();

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
