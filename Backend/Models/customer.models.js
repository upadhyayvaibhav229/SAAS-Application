import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tenant",
    required: true
  },
}, {
  timestamps: true
});

export const Customer = mongoose.model("Customer", customerSchema);