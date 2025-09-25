import { Invoice } from "../models/invoice.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";

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

  return res
    .status(201)
    .json(new ApiResponse(201, { invoice }, "Invoice created successfully"));
});

export const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ tenantId: req.tenantId })
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
  const invoice = await Invoice.findOneAndDelete({
    _id: id,
    tenantId: req.tenantId
  });
  
  if (!invoice) throw new ApiError(404, "Invoice not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Invoice deleted successfully"));
})