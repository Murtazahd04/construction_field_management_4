const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MaterialInvoice = sequelize.define('MaterialInvoice', {
    invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    contractor_id: { type: DataTypes.INTEGER, allowNull: false },
    supplier_name: { type: DataTypes.STRING, allowNull: false },
    supplier_contact: { type: DataTypes.STRING },
    invoice_number: { type: DataTypes.STRING, unique: true, allowNull: false },
    invoice_date: { type: DataTypes.DATEONLY, allowNull: false },
    
    // Financials
    total_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    tax_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    discount_amount: { type: DataTypes.DECIMAL(15, 2), defaultValue: 0 },
    net_amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    
    // Status
    payment_status: { 
        type: DataTypes.ENUM('pending', 'partial', 'paid'), 
        defaultValue: 'pending' 
    },
    payment_date: { type: DataTypes.DATEONLY },
    
    // Document
    invoice_document_path: { type: DataTypes.STRING }, // Path to uploaded file
    remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'material_invoices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MaterialInvoice;