// controllers/payment.controller.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Payment from "../models/payment.model.js"; // we'll create later
import Invoice from "../models/invoice.model.js"; // optional link
import { asyncHandler } from "../utils/asynchandler.js";

// @desc Create a new payment
export const createPayment = asyncHandler(async (req, res) => {
  const { invoiceId, amount, method, status } = req.body;

  if (!invoiceId || !amount || !method || !status) {
    throw new ApiError(400, "All fields are required");
  }

  const payment = await Payment.create({
    tenantId: req.tenant._id,
    invoiceId,
    amount,
    method,
    status,
    transactionDate: new Date(),
  });

  if (status === "Success") {
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Paid" });
  }

  res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment created successfully"));
});

// @desc Get single payment
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({
    _id: req.params.id,
    tenantId: req.tenant._id,
  });

  if (!payment) throw new ApiError(404, "Payment not found");

  res.json(new ApiResponse(200, payment));
});

export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ tenantId: req.tenant._id });

  res.json(new ApiResponse(200, payments));
});

export const updatePayment = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenant._id },
    { status },
    { new: true }
  );

  if (!payment) throw new ApiError(404, "Payment not found");

  res.json(new ApiResponse(200, payment, "Payment updated successfully"));
});

export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.tenant._id,
  });

  if (!payment) throw new ApiError(404, "Payment not found");

  res.json(new ApiResponse(200, null, "Payment deleted successfully"));
});
