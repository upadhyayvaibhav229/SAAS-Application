import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Tenant",
    index: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["draft", "sent", "paid", "cancelled"],
    default: "draft",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  // inside your invoice schema definition (update existing schema)
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  // keep totalAmount as before

  dueDate: {
    type: Date,
  },
}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
