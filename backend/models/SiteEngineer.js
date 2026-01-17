const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SiteEngineer = sequelize.define('SiteEngineer', {
    engineer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false }, // Foreign Key
    sub_contractor_id: { type: DataTypes.INTEGER, allowNull: false }, // Who hired them
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    specialization: { 
        type: DataTypes.ENUM('electrical', 'plumbing', 'material_quality', 'civil', 'general'), 
        allowNull: false 
    }
}, {
    tableName: 'site_engineers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SiteEngineer;