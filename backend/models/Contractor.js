const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contractor = sequelize.define('Contractor', {
    contractor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact_person: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    license_number: { type: DataTypes.STRING }
}, {
    tableName: 'contractors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// IMPORTANT: This line must be exactly like this
module.exports = Contractor;