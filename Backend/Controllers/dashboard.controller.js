import { Customer } from "../Models/customer.models.js"
import { Order } from "../Models/order.models.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asynchandler.js"

export const getDashboardData = asyncHandler(async (req, res) => {
  const customerCount = await Customer.countDocuments({ tenantId: req.tenantId });
  const orderCount = await Order.countDocuments({ tenantId: req.tenantId });
  
 const revenueResult = await Order.aggregate([
  { $match: { tenantId: req.tenantId, status: "paid" } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  const recentOrders = await Order.find({ tenantId: req.tenantId })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  return res.status(200).json(
    new ApiResponse(200, {
      stats: { 
        customerCount, 
        orderCount, 
        totalRevenue 
      },
      recentOrders
    }, "Dashboard data fetched successfully")
  );
});