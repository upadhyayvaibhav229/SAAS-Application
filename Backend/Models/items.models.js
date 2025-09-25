// models/item.model.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      unique: true,
      trim: true,
      default: function () {
        return "ITEM-" + Date.now(); // auto-generate if not provided
      },
    },
    quantity: {
      type: Number,
      default: 0, 
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // soft-disable instead of deleting
    },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
