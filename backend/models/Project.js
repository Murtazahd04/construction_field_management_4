const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
    project_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    owner_id: { type: DataTypes.INTEGER, allowNull: false },
    consultant_id: { type: DataTypes.INTEGER, allowNull: false },
    project_name: { type: DataTypes.STRING, allowNull: false },
    project_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    location: { type: DataTypes.TEXT },
    start_date: { type: DataTypes.DATEONLY }, // DATEONLY is for YYYY-MM-DD
    expected_end_date: { type: DataTypes.DATEONLY },
    budget: { type: DataTypes.DECIMAL(15, 2) },
    status: { 
        type: DataTypes.ENUM('tendering', 'active', 'on_hold', 'completed', 'cancelled'), 
        defaultValue: 'tendering' 
    },
    description: { type: DataTypes.TEXT }
}, {
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Project;