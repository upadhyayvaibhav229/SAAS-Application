import express from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { requirePermission } from "../Middleware/rbac.middleware.js";
import { createInvoice, deleteInvoice, downloadInvoicePDF, getInvoiceById, getInvoices, sendInvoiceEmails, updateInvoice } from "../Controllers/invoice.controller.js";
import { resolveTenant, tenantScoped } from "../Middleware/tenant.middleware.js";

const router = express.Router();

router.use(verifyJwt, resolveTenant, tenantScoped);

router.route('/')
    .get(requirePermission('invoices', 'read'),getInvoices)
    .post(requirePermission('invoices', 'create'), createInvoice)

router.route("/:id")
  .get(requirePermission('invoices', 'read'), getInvoiceById)
  .patch(requirePermission('invoices', 'update'), updateInvoice)
  .delete(requirePermission('invoices', 'delete'), deleteInvoice);

router.get('/:id/download', downloadInvoicePDF);

// Send invoice via email
router.post('/:id/send-email', sendInvoiceEmails);

export default router;