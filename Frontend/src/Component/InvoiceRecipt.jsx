import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const InvoiceReceipt = ({ invoice }) => {
  const { backendUrl } = useContext(AppContext);

  if (!invoice) return <p>No invoice selected</p>;

  const handleDownloadPDF = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/v1/invoices/${invoice._id}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

  const handleSendEmail = async () => {
    try {
      await axios.post(`${backendUrl}/api/v1/invoices/${invoice._id}/send-email`);
      toast.success("Invoice sent via email!");
    } catch (err) {
      toast.error("Failed to send email");
    }
  };

  const { orderId, invoiceNumber, customerId, totalAmount, dueDate } = invoice;
  const paymentStatus = orderId?.status || "pending";

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold mb-2">Invoice Receipt</h2>
      <div className="mb-4">
        <p><b>Invoice:</b> {invoiceNumber}</p>
        <p><b>Customer:</b> {customerId?.name} ({customerId?.email})</p>
        <p><b>Order Number:</b> {orderId?.orderNumber}</p>
        {paymentStatus === "pending" && <p><b>Due Date:</b> {new Date(dueDate).toLocaleDateString()}</p>}
        <p>
          <b>Payment Status:</b>{" "}
          <span className={`font-semibold ${paymentStatus === "paid" ? "text-green-600" :
              paymentStatus === "pending" ? "text-orange-500" :
                "text-red-500"
            }`}>
            {paymentStatus.toUpperCase()}
          </span>
        </p>
      </div>

      <table className="w-full mb-4 border-t border-b">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {orderId?.items?.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">₹{item.price}</td>
              <td className="p-2">₹{item.quantity * item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-lg">
        Total: ₹{totalAmount}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <button onClick={handleDownloadPDF} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">
          Download PDF
        </button>
        <button onClick={handleSendEmail} className="flex-1 bg-green-600 text-white px-4 py-2 rounded">
          Send via Email
        </button>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
