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
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  dueDate: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
