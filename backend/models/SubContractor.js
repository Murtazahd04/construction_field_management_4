const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SubContractor = sequelize.define('SubContractor', {
    sub_contractor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    contractor_id: { type: DataTypes.INTEGER, allowNull: false }, // Links to Contractor
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact_person: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    specialization: { 
        type: DataTypes.ENUM('electrical', 'plumbing', 'material_quality', 'civil', 'other'), 
        allowNull: false 
    }
}, {
    tableName: 'sub_contractors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SubContractor;