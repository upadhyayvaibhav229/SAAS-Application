import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/dashboard"); 
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) return <p className="text-center py-10">Loading...</p>;

  const { stats, recentOrders } = data;

  return (
    <div className="p-6 space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customers */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">Total Customers</p>
          <h2 className="text-3xl font-bold">{stats.customerCount}</h2>
        </div>

        {/* Orders */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold">{stats.orderCount}</h2>
        </div>

        {/* Revenue */}
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-t text-sm">
                  <td className="p-3">{order._id}</td>
                  <td className="p-3">{order.customerId?.name || "N/A"}</td>
                  <td className="p-3">₹{order.totalAmount}</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-3 text-gray-500">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
