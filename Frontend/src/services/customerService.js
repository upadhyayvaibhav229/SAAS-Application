// services/customerService.js
import axios from "axios";
import { AppContext } from "../Context/AppContext";
import { useContext } from "react";

// Create a custom hook to use the API with the current backend URL
export const useCustomerService = () => {
  const { backendUrl } = useContext(AppContext);
  
  const getAllCustomers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/customers`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customers");
    }
  };

  const getCustomerById = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch customer");
    }
  };

  const createCustomer = async (customerData) => {
    try {
      const response = await axios.post(`${backendUrl}/api/v1/customers`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create customer");
    }
  };

  const updateCustomer = async (id, customerData) => {
    try {
      const response = await axios.patch(`${backendUrl}/api/v1/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update customer");
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/v1/customers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete customer");
    }
  };

  return {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};