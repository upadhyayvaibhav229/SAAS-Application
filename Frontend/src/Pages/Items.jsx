import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContext } from "../context/AppContext";

const Items = () => {
  const { backendUrl } = useContext(AppContext);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    defaultQuantity: 1,
    sku: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/items`, { headers });
      setItems(data.data || []);
    } catch (err) {
      console.error("Error fetching items:", err);
      toast.error("Failed to fetch items!");
      setItems([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare payload
      const payload = { ...form };
      if (!payload.sku) delete payload.sku; // remove empty SKU to trigger backend default

      if (editingId) {
        await axios.patch(`${backendUrl}/api/v1/items/${editingId}`, payload, { headers });
        toast.success("Item updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/v1/items`, payload, { headers });
        toast.success("Item added successfully!");
      }

      setForm({ name: "", price: "", quantity: "", defaultQuantity: 1, sku: "", description: "" });
      setEditingId(null);
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
      toast.error(err.response?.data?.message || "Failed to save item!");
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      defaultQuantity: item.defaultQuantity || 1,
      sku: item.sku || "",
      description: item.description || "",
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/v1/items/${id}`, { headers });
      toast.success("Item deleted successfully!");
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error(err.response?.data?.message || "Failed to delete item!");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold mb-4">Items Management</h1>

      {/* Add / Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Default Quantity"
          value={form.defaultQuantity}
          onChange={(e) => setForm({ ...form, defaultQuantity: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="SKU (leave blank for auto)"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {editingId ? "Update Item" : "Add Item"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm({
                  name: "",
                  price: "",
                  quantity: "",
                  defaultQuantity: 1,
                  sku: "",
                  description: "",
                  category: "", // if you added category
                });
                setEditingId(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

      </form>

      {/* Items Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Default Qty</th>
            <th className="p-2 border">SKU</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">₹{item.price}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.defaultQuantity}</td>
              <td className="p-2 border">{item.sku}</td>
              <td className="p-2 border">{item.description}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-400 px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;
