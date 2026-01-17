const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const InvoiceItem = sequelize.define('InvoiceItem', {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_id: { type: DataTypes.INTEGER, allowNull: false },
    material_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    total_price: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'invoice_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = InvoiceItem;