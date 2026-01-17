const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaterialRequestItem = sequelize.define('MaterialRequestItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    request_id: { type: DataTypes.INTEGER, allowNull: false },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity_requested: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    
    // For future approvals
    contractor_approved_quantity: { type: DataTypes.DECIMAL(10, 2) },
    
    remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'material_request_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = MaterialRequestItem;