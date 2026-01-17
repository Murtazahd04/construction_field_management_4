const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjectContractor = sequelize.define('ProjectContractor', {
    assignment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    contractor_id: { type: DataTypes.INTEGER, allowNull: false },
    assigned_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    work_scope: { type: DataTypes.TEXT },
    contract_value: { type: DataTypes.DECIMAL(15, 2) },
    status: { 
        type: DataTypes.ENUM('active', 'completed', 'terminated'), 
        defaultValue: 'active' 
    }
}, {
    tableName: 'project_contractors',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false // Schema doesn't specify updated_at for this table, but you can enable if you added it
});

module.exports = ProjectContractor;