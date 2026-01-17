const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DailyProgressReport = sequelize.define('DailyProgressReport', {
    dpr_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    project_id: { type: DataTypes.INTEGER, allowNull: false },
    sub_contractor_id: { type: DataTypes.INTEGER, allowNull: false },
    engineer_id: { type: DataTypes.INTEGER, allowNull: false },
    report_date: { type: DataTypes.DATEONLY, allowNull: false },
    
    // FIDIC Standard Fields (Weather, etc.)
    weather_condition: { type: DataTypes.STRING },
    temperature: { type: DataTypes.STRING },
    work_description: { type: DataTypes.TEXT },
    work_completed: { type: DataTypes.TEXT },
    work_planned_next_day: { type: DataTypes.TEXT },
    
    // Progress Info
    progress_percentage: { type: DataTypes.DECIMAL(5, 2) },
    safety_observations: { type: DataTypes.TEXT },
    quality_observations: { type: DataTypes.TEXT },
    remarks: { type: DataTypes.TEXT },
    
    // Status
    status: { 
        type: DataTypes.ENUM('draft', 'submitted', 'approved', 'rejected'), 
        defaultValue: 'draft' 
    },
    submitted_at: { type: DataTypes.DATE },
    
    // Offline Sync tracking (optional but good to have from schema)
    sync_status: { type: DataTypes.ENUM('pending', 'synced'), defaultValue: 'pending' }

}, {
    tableName: 'daily_progress_reports',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DailyProgressReport;