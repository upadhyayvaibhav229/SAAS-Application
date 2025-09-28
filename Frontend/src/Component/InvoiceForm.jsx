import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const InvoiceForm = ({ onInvoiceCreated }) => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/orders`);
        if (data.success) setOrders(data.data);
      } catch (err) {
        toast.error("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, [backendUrl]);

  // Reset due date when order changes
  useEffect(() => {
    if (!selectedOrder) return;
    const order = orders.find((o) => o._id === selectedOrder);
    // Only set due date if order is pending
    if (order.status === "pending") {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7); // 7 days later
      setDueDate(defaultDueDate.toISOString().split("T")[0]);
    } else {
      setDueDate(""); // Paid orders don’t need due date
    }
  }, [selectedOrder, orders]);

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return toast.error("Please select an order");

    const order = orders.find((o) => o._id === selectedOrder);

    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/invoices`, {
        orderId: order._id,
        customerId: order.customerId._id,
        totalAmount: order.totalAmount,
        dueDate: order.status === "pending" ? dueDate : null,
        status: order.status === "paid" ? "paid" : "pending",
      });

      if (data.success) {
        toast.success("Invoice created!");
        onInvoiceCreated(data.data.invoice);
        setSelectedOrder("");
        setDueDate("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleGenerateInvoice} className="space-y-3">
      <div>
        <label>Order</label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Order --</option>
          {orders?.map((order) => (
            <option key={order._id} value={order._id}>
              {order.orderNumber} - {order.customerId?.name} (${order.totalAmount}) [{order.status}]
            </option>
          ))}
        </select>
      </div>

      {/* Show due date only for pending orders */}
      {selectedOrder &&
        orders.find((o) => o._id === selectedOrder)?.status === "pending" && (
          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
        )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Invoice
      </button>
    </form>
  );
};

export default InvoiceForm;
