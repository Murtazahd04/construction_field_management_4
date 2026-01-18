const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Enquiry = sequelize.define('Enquiry', {
    enquiry_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    // --- NEW FIELD ---
    role: { 
        type: DataTypes.ENUM('owner', 'consultant', 'contractor', 'sub_contractor'),
        allowNull: false,
        defaultValue: 'owner'
    },
    status: { 
        type: DataTypes.ENUM('pending', 'contacted', 'approved', 'rejected'), 
        defaultValue: 'pending' 
    }
}, {
    tableName: 'enquiries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Enquiry;