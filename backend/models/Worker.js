const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Worker = sequelize.define('Worker', {
    worker_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sub_contractor_id: { type: DataTypes.INTEGER, allowNull: false },
    worker_name: { type: DataTypes.STRING, allowNull: false },
    worker_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    category: { 
        type: DataTypes.ENUM('mason', 'carpenter', 'electrician', 'plumber', 'laborer', 'helper', 'other'), 
        allowNull: false 
    },
    skill_level: { 
        type: DataTypes.ENUM('unskilled', 'semi_skilled', 'skilled', 'highly_skilled'), 
        defaultValue: 'unskilled' 
    },
    daily_wage: { type: DataTypes.DECIMAL(10, 2) },
    
    // For Fingerprint (Optional for now, but kept to match DB)
    fingerprint_template: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'workers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Worker;