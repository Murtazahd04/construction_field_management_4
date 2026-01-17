const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Owner = sequelize.define('Owner', {
    owner_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_name: { type: DataTypes.STRING, allowNull: false },
    contact_person: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT }
}, {
    tableName: 'owners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Owner;