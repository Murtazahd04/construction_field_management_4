const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM('owner', 'consultant', 'contractor', 'sub_contractor', 'site_engineer', 'admin'),
        allowNull: false
    },
    reference_id: { type: DataTypes.INTEGER }, // Links to the specific profile ID
    platform: { type: DataTypes.ENUM('mobile', 'web', 'both'), defaultValue: 'both' },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = User;