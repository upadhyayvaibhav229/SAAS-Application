// Backend/Models/payment.models.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    method: {
      type: String,
      enum: ["upi", "card", "cash", "bank_transfer", "wallet", "cheque", "other"],
      required: true,
    },

    status: {
      type: String,
      enum: ["captured", "pending", "failed", "refunded", "part_refunded"],
      default: "captured",
    },

    transactionId: { type: String }, // gateway txn id
    gateway: { type: String },       // e.g. "razorpay", "stripe"
    reference: { type: String },     // any merchant reference
    receivedOn: { type: Date, default: Date.now },
    meta: { type: mongoose.Schema.Types.Mixed }, // extra gateway payload
  },
  { timestamps: true }
);

// sensible indexes
paymentSchema.index({ tenantId: 1, invoiceId: 1 });
paymentSchema.index({ tenantId: 1, transactionId: 1 }, { unique: true, sparse: true });

export const Payment = mongoose.model("Payment", paymentSchema);
