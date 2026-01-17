const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaterialRequest = sequelize.define('MaterialRequest', {
    request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    sub_contractor_id: { type: DataTypes.INTEGER, allowNull: false },
    requested_by: { type: DataTypes.INTEGER, allowNull: false }, // User ID of Site Engineer
    request_date: { type: DataTypes.DATEONLY, allowNull: false },
    required_date: { type: DataTypes.DATEONLY },
    
    // Approval Status
    status: { 
        type: DataTypes.ENUM('draft', 'pending', 'contractor_approved', 'consultant_approved', 'both_approved', 'rejected', 'fulfilled'), 
        defaultValue: 'pending' 
    },
    
    remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'material_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MaterialRequest;