// components/Customer.jsx
import React, { useState, useEffect, useContext } from "react";
import { useCustomerService } from "../services/customerService";
import { AppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const Customer = () => {
  const { userData } = useContext(AppContext);
  const customerService = useCustomerService();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      setCustomers(response.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCustomer) {
        await customerService.updateCustomer(editCustomer._id, formData);
        toast.success("Customer updated successfully");
      } else {
        await customerService.createCustomer(formData);
        toast.success("Customer created successfully");
      }
      setShowForm(false);
      setEditCustomer(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
      fetchCustomers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await customerService.deleteCustomer(id);
      toast.success("Customer deleted successfully");
      fetchCustomers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );

  const canCreate = userData?.permissions?.customers?.includes("create");
  const canUpdate = userData?.permissions?.customers?.includes("update");
  const canDelete = userData?.permissions?.customers?.includes("delete");

  return (
    <div className="bg-gray-800 h-screen rounded-lg shadow-md p-4 md:p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
        <h2 className="text-2xl font-bold text-white">Customers</h2>
        {canCreate && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full md:w-auto"
          >
            {editCustomer ? "Edit Customer" : "Add New Customer"}
          </button>
        )}
      </div>

      {/* Inline Create/Edit Form */}
      {showForm && canCreate && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-500 p-4 md:p-6 rounded mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="p-2 rounded w-full text-black"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="p-2 rounded w-full text-black"
              required
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="p-2 rounded w-full text-black"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="p-2 rounded w-full text-black"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end mt-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditCustomer(null);
                setFormData({ name: "", email: "", phone: "", address: "" });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto"
            >
              {editCustomer ? "Update" : "Create"}
            </button>
          </div>
        </form>
      )}

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p>No customers found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg text-sm md:text-base">
            <thead>
              <tr className="bg-gray-600">
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Address</th>
                <th className="px-4 py-2 text-left text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-600 transition-colors">
                  <td className="px-4 py-2 whitespace-nowrap text-white">{customer.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-300">{customer.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-gray-300">{customer.phone}</td>
                  <td className="px-4 py-2 text-gray-300">{customer.address}</td>
                  <td className="px-4 py-2 whitespace-nowrap flex flex-col md:flex-row gap-2">
                    {canUpdate && (
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(customer._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customer;
