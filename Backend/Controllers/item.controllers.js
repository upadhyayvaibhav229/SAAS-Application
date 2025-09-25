import { Item } from "../Models/items.models";
import { asyncHandler } from "../utils/asynchandler";

// create Items
export const createItem = asyncHandler(async (req, res) => {
    const { name, price, quantity, sku } = req.body;
    if (!name || !price || !quantity) {
        throw new ApiError(400, "All fields are required");
    }
    else {
        const item = await Item.create({
            name,
            price,
            quantity,
            tenantId: req.tenantId
        });
        if (!item) {
            throw new ApiError(500, "Error in creating item");

        }
        return res.status(201).json(
            new ApiResponse(201, item, "Item created successfully")
        );

    }
});

export const updateItem = asyncHandler(async (req, res) => {
    const { name, price, quantity, sku, isActive } = req.body;

    const updateItem = await Item.findOneAndUpdate(
        {
            _id: req.params.id, tenantId: req.tenantId

        },
        {
            $set: {
                name,
                price,
                quantity,
                sku,
                isActive
            }
        },
        {
            new: true,
        }
    )

    if (!updateItem) {
        throw new ApiError(404, "Item not found");
    }
    return res.status(200).json(
        new ApiResponse(200, updateItem, "Item updated successfully")
    );
});

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