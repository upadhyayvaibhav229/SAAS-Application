import { Order } from "../Models/order.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

// Create Order
export const createOrder = asyncHandler(async (req, res) => {
  const { customerId, items, totalAmount, status } = req.body;

  if (!(customerId && items && totalAmount)) {
    throw new ApiError(400, "All fields are required");
  }

  const order = await Order.create({
    customerId,
    items,
    totalAmount,
    status,
    tenantId: req.tenantId
  });

  return res.status(201).json(
    new ApiResponse(201, order, "Order created successfully")
  );
});

// Get all Orders
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ tenantId: req.tenantId })
    .populate("customerId", "name email"); 

  res.status(200).json(
    new ApiResponse(200, orders, "Orders fetched successfully")
  );
});

// Get single Order
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    tenantId: req.tenantId
  }).populate("customerId", "name email");

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(
    new ApiResponse(200, order, "Order fetched successfully")
  );
});

// Update Order
export const updateOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, status } = req.body;

  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { items, totalAmount, status },
    { new: true }
  );

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(
    new ApiResponse(200, order, "Order updated successfully")
  );
});

// Delete Order
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({
    _id: req.params.id,
    tenantId: req.tenantId
  });

  if (!order) throw new ApiError(404, "Order not found");

  res.status(200).json(
    new ApiResponse(200, {}, "Order deleted successfully")
  );
});
