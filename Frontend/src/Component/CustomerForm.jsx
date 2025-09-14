// // components/CustomerForm.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// // import { useCustomerService } from "../services/customerService";
// import { toast } from "react-toastify";
// import { useCustomerService } from "../services/customerService";

// const CustomerForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEdit = Boolean(id);
//   const customerService = useCustomerService();
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (isEdit) {
//       fetchCustomer();
//     }
//   }, [id]);

//   const fetchCustomer = async () => {
//     try {
//       setLoading(true);
//       const response = await customerService.getCustomerById(id);
//       setFormData({
//         name: response.data.name,
//         email: response.data.email,
//         phone: response.data.phone,
//         address: response.data.address
//       });
//     } catch (err) {
//       toast.error(err.message);
//       navigate("/customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ""
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.phone.trim()) newErrors.phone = "Phone is required";
//     if (!formData.address.trim()) newErrors.address = "Address is required";
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     try {
//       setLoading(true);
      
//       if (isEdit) {
//         await customerService.updateCustomer(id, formData);
//         toast.success("Customer updated successfully");
//       } else {
//         await customerService.createCustomer(formData);
//         toast.success("Customer created successfully");
//       }
      
//       navigate("/customers");
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEdit) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-800 rounded-lg shadow-md p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold text-white mb-6">
//         {isEdit ? "Edit Customer" : "Create New Customer"}
//       </h2>
      
//       <form onSubmit={handleSubmit} className="space-y-4 text-white">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-300">
//             Name *
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.name ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//             placeholder="Enter customer name"
//           />
//           {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
//         </div>
        
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//             Email *
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//             placeholder="Enter customer email"
//           />
//           {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
//         </div>
        
//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
//             Phone *
//           </label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//             placeholder="Enter customer phone"
//           />
//           {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
//         </div>
        
//         <div>
//           <label htmlFor="address" className="block text-sm font-medium text-gray-300">
//             Address *
//           </label>
//           <textarea
//             id="address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             rows={3}
//             className={`mt-1 block w-full px-3 py-2 bg-gray-700 border ${errors.address ? 'border-red-500' : 'border-gray-600'} rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//             placeholder="Enter customer address"
//           />
//           {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
//         </div>
        
//         <div className="flex space-x-3 pt-4">
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded"
//           >
//             {loading ? "Processing..." : (isEdit ? "Update Customer" : "Create Customer")}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/customers")}
//             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CustomerForm;