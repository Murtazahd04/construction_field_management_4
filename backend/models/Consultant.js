const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultant = sequelize.define('Consultant', {
    consultant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: { type: DataTypes.INTEGER, allowNull: false }, // Links to Owner
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact_person: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    license_number: { type: DataTypes.STRING }
}, {
    tableName: 'consultants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Consultant;