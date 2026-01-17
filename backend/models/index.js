const sequelize = require('../config/db');
const User = require('./User');
const Owner = require('./Owner');
const Consultant = require('./Consultant');
const Contractor = require('./Contractor');
const SubContractor = require('./SubContractor');
const SiteEngineer = require('./SiteEngineer');
const Project = require('./Project'); // <--- ADD THIS
const ProjectContractor = require('./ProjectContractor');
const DailyProgressReport = require('./DailyProgressReport');
const Material = require('./Material');
const MaterialRequest = require('./MaterialRequest');
const MaterialRequestItem = require('./MaterialRequestItem');
const Worker = require('./Worker');
const Attendance = require('./Attendance');
const MaterialInvoice = require('./MaterialInvoice');
const InvoiceItem = require('./InvoiceItem');
// --- Define Relationships ---
// --- DEBUG LINE: Add this temporarily ---
console.log("Contractor Model:", Contractor); 
// If this prints "undefined" or "{}", the import is failing.
// ----------------------------------------
// 1. Hierarchy: Owner -> Consultant
Owner.hasMany(Consultant, { foreignKey: 'owner_id' });
Consultant.belongsTo(Owner, { foreignKey: 'owner_id' });

// 2. Hierarchy: Contractor -> SubContractor
Contractor.hasMany(SubContractor, { foreignKey: 'contractor_id' });
SubContractor.belongsTo(Contractor, { foreignKey: 'contractor_id' });

// 3. Hierarchy: SubContractor -> SiteEngineer
SubContractor.hasMany(SiteEngineer, { foreignKey: 'sub_contractor_id' });
SiteEngineer.belongsTo(SubContractor, { foreignKey: 'sub_contractor_id' });


// 6. Project <-> Contractor Assignment (Many-to-Many with details)
Project.hasMany(ProjectContractor, { foreignKey: 'project_id' });
ProjectContractor.belongsTo(Project, { foreignKey: 'project_id' });

Contractor.hasMany(ProjectContractor, { foreignKey: 'contractor_id' });
ProjectContractor.belongsTo(Contractor, { foreignKey: 'contractor_id' });
// 4. User Links (One-to-One mostly for Auth)
// Since we use reference_id in User table, we don't strictly need Sequelize associations 
// for Login, but it helps if you want to fetch "User with Profile".
User.hasOne(SiteEngineer, { foreignKey: 'user_id' });
SiteEngineer.belongsTo(User, { foreignKey: 'user_id' });

Owner.hasMany(Project, { foreignKey: 'owner_id' });
Project.belongsTo(Owner, { foreignKey: 'owner_id' });

Consultant.hasMany(Project, { foreignKey: 'consultant_id' });
Project.belongsTo(Consultant, { foreignKey: 'consultant_id' })

// 7. DPR Relationships
Project.hasMany(DailyProgressReport, { foreignKey: 'project_id' });
DailyProgressReport.belongsTo(Project, { foreignKey: 'project_id' });

SubContractor.hasMany(DailyProgressReport, { foreignKey: 'sub_contractor_id' });
DailyProgressReport.belongsTo(SubContractor, { foreignKey: 'sub_contractor_id' });

SiteEngineer.hasMany(DailyProgressReport, { foreignKey: 'engineer_id' });
DailyProgressReport.belongsTo(SiteEngineer, { foreignKey: 'engineer_id' });

Project.hasMany(MaterialRequest, { foreignKey: 'project_id' });
MaterialRequest.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(MaterialRequest, { foreignKey: 'requested_by' });
MaterialRequest.belongsTo(User, { foreignKey: 'requested_by' });

// A Request has many Items
MaterialRequest.hasMany(MaterialRequestItem, { foreignKey: 'request_id' });
MaterialRequestItem.belongsTo(MaterialRequest, { foreignKey: 'request_id' });

// An Item links to a Material Definition
Material.hasMany(MaterialRequestItem, { foreignKey: 'material_id' });
MaterialRequestItem.belongsTo(Material, { foreignKey: 'material_id' });

// Sub-Contractor owns the workers
SubContractor.hasMany(Worker, { foreignKey: 'sub_contractor_id' });
Worker.belongsTo(SubContractor, { foreignKey: 'sub_contractor_id' });

// 10. Attendance Relationships
// Attendance belongs to Project, Worker, and Engineer
Project.hasMany(Attendance, { foreignKey: 'project_id' });
Attendance.belongsTo(Project, { foreignKey: 'project_id' });

Worker.hasMany(Attendance, { foreignKey: 'worker_id' });
Attendance.belongsTo(Worker, { foreignKey: 'worker_id' });

SiteEngineer.hasMany(Attendance, { foreignKey: 'engineer_id' });
Attendance.belongsTo(SiteEngineer, { foreignKey: 'engineer_id' });


// 11. Invoice Relationships
// Invoice belongs to Project and Contractor
Project.hasMany(MaterialInvoice, { foreignKey: 'project_id' });
MaterialInvoice.belongsTo(Project, { foreignKey: 'project_id' });

Contractor.hasMany(MaterialInvoice, { foreignKey: 'contractor_id' });
MaterialInvoice.belongsTo(Contractor, { foreignKey: 'contractor_id' });

// Invoice has many items
MaterialInvoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id' });
InvoiceItem.belongsTo(MaterialInvoice, { foreignKey: 'invoice_id' });

// Invoice Item links to Material definition
Material.hasMany(InvoiceItem, { foreignKey: 'material_id' });
InvoiceItem.belongsTo(Material, { foreignKey: 'material_id' });
// Export everything
module.exports = { 
    sequelize, 
    User, 
    Owner, 
    Consultant, 
    Contractor, 
    SubContractor, 
    SiteEngineer,
    Project,
    ProjectContractor,
    DailyProgressReport,
    Material, MaterialRequest, MaterialRequestItem,
    Worker, Attendance, MaterialInvoice, InvoiceItem,
};