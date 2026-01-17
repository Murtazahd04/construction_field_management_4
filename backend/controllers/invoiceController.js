const { MaterialInvoice, InvoiceItem, Material } = require('../models');

// 1. Create a New Invoice (Contractor Action)
exports.createInvoice = async (req, res) => {
    try {
        const {
            project_id,
            contractor_id,
            supplier_name,
            supplier_contact,
            invoice_number,
            invoice_date,
            total_amount,
            tax_amount,
            discount_amount,
            net_amount,
            items // Array: [{ material_id: 1, quantity: 100, unit_price: 50, total_price: 5000 }]
        } = req.body;

        const newInvoice = await MaterialInvoice.create({
            project_id,
            contractor_id,
            supplier_name,
            supplier_contact,
            invoice_number,
            invoice_date,
            total_amount,
            tax_amount,
            discount_amount,
            net_amount,
            payment_status: 'pending'
        });

        // Add Invoice Items
        if (items && items.length > 0) {
            const invoiceItems = items.map(item => ({
                invoice_id: newInvoice.invoice_id,
                material_id: item.material_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                remarks: item.remarks
            }));

            await InvoiceItem.bulkCreate(invoiceItems);
        }

        res.status(201).json({ 
            message: "Invoice created successfully", 
            invoiceId: newInvoice.invoice_id 
        });

    } catch (error) {
        console.error("Invoice Error:", error);
        res.status(500).json({ message: "Failed to create invoice", error: error.message });
    }
};

// 2. Get Invoices for a Project
exports.getProjectInvoices = async (req, res) => {
    try {
        const { projectId } = req.params;
        const invoices = await MaterialInvoice.findAll({
            where: { project_id: projectId },
            include: [
                { 
                    model: InvoiceItem,
                    include: [{ model: Material, attributes: ['material_name', 'unit'] }]
                }
            ]
        });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const { status, payment_date } = req.body;

        await MaterialInvoice.update(
            { payment_status: status, payment_date },
            { where: { invoice_id: invoiceId } }
        );

        res.json({ message: "Payment status updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};