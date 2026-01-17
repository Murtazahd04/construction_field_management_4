const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define('Material', {
    material_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    material_name: { type: DataTypes.STRING, allowNull: false },
    material_code: { type: DataTypes.STRING, unique: true, allowNull: false },
    unit: { 
        type: DataTypes.ENUM('kg', 'ton', 'liter', 'meter', 'sqm', 'cum', 'nos', 'bags', 'other'), 
        allowNull: false 
    },
    category: { 
        type: DataTypes.ENUM('cement', 'steel', 'sand', 'aggregate', 'bricks', 'paint', 'electrical', 'plumbing', 'other'), 
        defaultValue: 'other' 
    },
    description: { type: DataTypes.TEXT }
}, {
    tableName: 'materials',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Material;