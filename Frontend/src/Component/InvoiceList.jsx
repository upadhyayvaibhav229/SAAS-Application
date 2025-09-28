import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const InvoiceList = () => {
  const { backendUrl } = useContext(AppContext);
  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/invoices`);
      if (data.success) {
        setInvoices(data.data?.invoices || []); // ✅ safe fallback
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error("Fetch invoices error:", err);
      toast.error("Failed to fetch invoices");
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Invoices</h2>
      <ul className="space-y-2">
        {invoices && invoices.length > 0 ? (
          invoices.map((inv) => (
            <li key={inv._id} className="border p-2 rounded">
              <p><b>Invoice:</b> {inv.invoiceNumber}</p>
              <p><b>Customer:</b> {inv.customerId?.name || "N/A"}</p>
              <p><b>Total:</b> ${inv.totalAmount}</p>
              <p><b>Due Date:</b> {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "Not set"}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No invoices found</p>
        )}
      </ul>
    </div>
  );
};

export default InvoiceList;
