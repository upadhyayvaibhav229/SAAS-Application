import { Customer } from "../Models/customer.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  // Validation
  if (!(name && email && phone && address)) {
    throw new ApiError(400, "All fields are required");
  }

  const tenantId = req.tenantId;

  // Create customer
  const customer = await Customer.create({
    name,
    email,
    phone,
    address,
    tenantId,
  });

  if (!customer) {
    throw new ApiError(500, "Error in creating customer");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          tenantId: customer.tenantId,
        },
      },
      "Customer Created Successfully"
    )
  );
});


export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.find({tenantId: req.tenantId})

  return res.status(200).json(
    new ApiResponse(200, customer, "Customer Fetched Successfully")
  );
});

// get single customer id;

export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    tenantId: req.tenantId
  });

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  return res.status(200).json(
    new ApiResponse(200, customer, "Customer fetched successfully")
  );
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { name, email, phone, address },
    { new: true }
  );

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res.status(200).json(
    new ApiResponse(200, customer, "Customer updated successfully")
  );
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.tenantId
  });

  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Customer deleted successfully")
  );
});
