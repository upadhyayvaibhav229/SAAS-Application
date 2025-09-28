import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [form, setForm] = useState({
    _id: null, // For edit
    customerId: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    totalAmount: 0,
    status: "pending",
  });

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/customers");
        setCustomers(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/orders");
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
  };
  useEffect(() => { fetchOrders(); }, []);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/items");
        setItemsList(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setItemsList([]);
      }
    };
    fetchItems();
  }, []);

  // Handle item changes
  const handleItemChange = (index, key, value) => {
    const updatedItems = [...form.items];

    if (key === "name") {
      const selectedItem = itemsList.find(i => i.name === value);
      if (selectedItem) {
        updatedItems[index].price = selectedItem.price;
        updatedItems[index].quantity = selectedItem.defaultQuantity || 1;
      }
    }

    updatedItems[index][key] = key === "quantity" || key === "price" ? Number(value) : value;

    const total = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setForm({ ...form, items: updatedItems, totalAmount: total });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { name: "", quantity: 1, price: 0 }] });
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    const total = updatedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setForm({ ...form, items: updatedItems, totalAmount: total });
  };

  // Edit order
  const editOrder = (order) => {
    setForm({
      _id: order._id,
      customerId: order.customerId?._id || "",
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
    });
    setActiveTab("add");
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
      toast.success("Order deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete order");
    }
  };

  // Submit form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId || form.items.length === 0) {
      toast.error("Please fill customer and items");
      return;
    }

    try {
      if (form._id) {
        // Update existing order
        await axios.patch(`http://localhost:5000/api/v1/orders/${form._id}`, form);
        toast.success("Order updated!");
      } else {
        // Check for existing same order
        const existingOrder = orders.find(o =>
          o.customerId === form.customerId &&
          JSON.stringify(o.items.map(i => ({name: i.name, quantity: i.quantity, price: i.price}))) ===
          JSON.stringify(form.items.map(i => ({name: i.name, quantity: i.quantity, price: i.price})))
        );

        if (existingOrder) {
          await axios.patch(`http://localhost:5000/api/v1/orders/${existingOrder._id}`, form);
          toast.success("Order updated (existing)!");
        } else {
          await axios.post("http://localhost:5000/api/v1/orders", form);
          toast.success("Order created!");
        }
      }

      setForm({
        _id: null,
        customerId: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        totalAmount: 0,
        status: "pending",
      });

      fetchOrders();
      setActiveTab("list");
    } catch (err) {
      console.error(err);
      toast.error("Error saving order");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-2 px-4 ${activeTab === "list" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >Orders List</button>
        <button
          onClick={() => setActiveTab("add")}
          className={`pb-2 px-4 ${activeTab === "add" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >Add / Edit Order</button>
      </div>

      {/* Orders List */}
      {activeTab === "list" && (
        <div className="bg-white shadow rounded-2xl p-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map(order => (
                  <tr key={order._id} className="border-t text-sm">
                    <td className="p-3">{order._id}</td>
                    <td className="p-3">{order.customerId?.name || "N/A"}</td>
                    <td className="p-3">
                      {order.items.map((i, idx) => (
                        <div key={idx}>{i.name} x{i.quantity} @ ₹{i.price}</div>
                      ))}
                    </td>
                    <td className="p-3">₹{order.totalAmount}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => editOrder(order)} className="px-2 py-1 bg-yellow-400 rounded">Edit</button>
                      <button onClick={() => deleteOrder(order._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-3 text-gray-500">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Form */}
      {activeTab === "add" && (
        <div className="bg-white shadow rounded-2xl p-6 max-w-md">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Customer */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Customer</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
              >
                <option value="">Select Customer</option>
                {customers.map(c => (
                  <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                ))}
              </select>
            </div>

            {/* Items */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Items</label>
              {form.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  {/* Item */}
                  <div className="flex flex-col w-1/2">
                    <label className="text-xs text-gray-500">Item</label>
                    <select
                      value={item.name}
                      onChange={(e) => handleItemChange(index, "name", e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">Select Item</option>
                      {itemsList.map(i => (
                        <option key={i._id} value={i.name}>{i.name} - ₹{i.price}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col w-1/4">
                    <label className="text-xs text-gray-500">Qty</label>
                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="border px-2 py-1 rounded w-full" />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col w-1/4">
                    <label className="text-xs text-gray-500">Price</label>
                    <input type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} className="border px-2 py-1 rounded w-full" />
                  </div>

                  {/* Remove */}
                  {form.items.length > 1 && <button type="button" onClick={() => removeItem(index)} className="text-red-500 mt-5">X</button>}
                </div>
              ))}
              <button type="button" onClick={addItem} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded">Add Item</button>
            </div>

            {/* Total */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 bg-gray-100" value={form.totalAmount} readOnly />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select className="w-full border rounded-lg px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg">{form._id ? "Update Order" : "Create Order"}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Orders;
