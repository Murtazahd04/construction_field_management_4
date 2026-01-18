const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes'); // <--- Import
const dprRoutes = require('./routes/dprRoutes');
const materialRoutes = require('./routes/materialRoutes');
const workerRoutes = require('./routes/workerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const reportRoutes = require('./routes/reportRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // <--- Add Route
app.use('/api/dpr', dprRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/enquiry', enquiryRoutes);
// Sync Database and Start Server
// force: false means "don't delete my data if table exists"
db.sequelize.sync({ force: false }).then(() => {
    console.log("Database connected & Synced");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to sync db: " + err.message);
});