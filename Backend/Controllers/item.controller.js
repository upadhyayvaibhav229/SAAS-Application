import { Item } from "../Models/items.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create Item
export const createItem = asyncHandler(async (req, res) => {
  const { name, price, quantity, defaultQuantity, sku } = req.body;
  if (!name || !price || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

  const item = await Item.create({
    name,
    price,
    quantity,
    defaultQuantity: defaultQuantity || 1,
    sku,
    tenantId: req.tenantId,
  });

  return res.status(201).json(
    new ApiResponse(201, item, "Item created successfully")
  );
});

// Update Item
export const updateItem = asyncHandler(async (req, res) => {
  const { name, price, quantity, sku, defaultQuantity, isActive } = req.body;

  const updatedItem = await Item.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { $set: { name, price, quantity, sku, defaultQuantity, isActive } },
    { new: true }
  );

  if (!updatedItem) throw new ApiError(404, "Item not found");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedItem, "Item updated successfully"));
});

// Delete Item (soft delete)
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.tenantId },
    { $set: { isActive: false } },
    { new: true }
  );

  if (!item) throw new ApiError(404, "Item not found");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Item deleted successfully"));
});

// Get all active items
export const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ tenantId: req.tenantId, isActive: true });
  return res.status(200).json(
    new ApiResponse(200, items, "Items fetched successfully")
  );
});

// Get single item by ID
export const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id, tenantId: req.tenantId });
  if (!item) throw new ApiError(404, "Item not found");
  return res.status(200).json(new ApiResponse(200, item, "Item fetched successfully"));
});
