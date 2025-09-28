import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Invoice } from "../Models/invoice.models.js";
import { generateInvoicePDF } from "../services/invoice.service.js";
import { sendInvoiceEmail } from "../services/email.service.js";
import { loginUser } from "./auth.controller.js";
import { Tenant } from "../Models/tenant.models.js";

export const createInvoice = asyncHandler(async (req, res) => {
  const { orderId, customerId, totalAmount, dueDate } = req.body;

  if (!orderId || !customerId || !totalAmount) {
    throw new ApiError(400, "Missing required fields");
  }

  const invoiceNumber = "INV-" + Date.now(); 

  const invoice = await Invoice.create({
    tenantId: req.tenantId,
    orderId,
    customerId,
    totalAmount,
    dueDate,
    invoiceNumber,
  });

  await invoice.populate([
    {
      path: "customerId",
      select: "name email",
    },
    {
      path: "orderId",
      select: "orderNumber totalAmount items",
    },
  ])

  return res
    .status(201)
    .json(new ApiResponse(201, { invoice }, "Invoice created successfully"));
});

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ tenantId: req.tenantId, isActive: true })
    .populate("customerId", "name")
    .populate("orderId", "orderNumber")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { invoices }, "Invoices fetched successfully"));
});

export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    tenantId: req.tenantId,
  })
    .populate("customerId", "name email")
    .populate("orderId", "orderNumber totalAmount");

  if (!invoice) throw new ApiError(404, "Invoice not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { invoice }, "Invoice fetched successfully"));
});

export const updateInvoice = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const {totalAmount, dueDate, status} = req.body;

  const invoice = await Invoice.findOneAndUpdate(
    {_id: id, tenantId: req.tenantId},
    {$set: {totalAmount, dueDate, status}},
    {new: true}
  
  )
    .populate("customerId", "name email")
    .populate("orderId", "orderNumber totalAmount");

  if (!invoice) throw new ApiError(404, "Invoice not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { invoice }, "Invoice updated successfully"));

})

export const deleteInvoice = asyncHandler(async (req, res) => {
  const {id} = req.params;
  const invoice = await Invoice.findOneAndDelete(
    {
    _id: id,
    tenantId: req.tenantId
  },
  {
    $set: {
      isActive: false,
    }
  },
  {
    new: true
  }
);
  
  if (!invoice) throw new ApiError(404, "Invoice not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Invoice deleted successfully"));
})


export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("orderId customerId");

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const pdfBuffer = await generateInvoicePDF(invoice);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF Download Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const sendInvoiceEmails = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("orderId customerId");
    console.log(invoice);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const tenant = await Tenant.findById(invoice.tenantId);

    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    await sendInvoiceEmail(invoice, tenant); // ✅ pass full objects

    res.json({ success: true, message: "Invoice sent via email successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
