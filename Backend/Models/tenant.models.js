import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Company/Organization name
  },
  domain: {
    type: String,
  },
  plan: {
    type: String,
    enum: ["free", "basic", "premium"], // optional subscription plan
    default: "free",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  modules: {
    type: [String],
    default: ["customers", "orders", "payments", "reports"]
  }
});

tenantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
})
export const Tenant = mongoose.model("Tenant", tenantSchema);
