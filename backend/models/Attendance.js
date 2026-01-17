const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    attendance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    worker_id: { type: DataTypes.INTEGER, allowNull: false },
    engineer_id: { type: DataTypes.INTEGER, allowNull: false }, // Who took attendance
    attendance_date: { type: DataTypes.DATEONLY, allowNull: false },
    
    // Timing
    check_in_time: { type: DataTypes.TIME },
    check_out_time: { type: DataTypes.TIME },
    
    status: { 
        type: DataTypes.ENUM('present', 'absent', 'half_day', 'late'), 
        defaultValue: 'present' 
    },
    late_by_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_hours: { type: DataTypes.DECIMAL(5, 2) },
    payment_amount: { type: DataTypes.DECIMAL(10, 2) }, // wage * days
    
    remarks: { type: DataTypes.TEXT }
}, {
    tableName: 'attendance',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Attendance;