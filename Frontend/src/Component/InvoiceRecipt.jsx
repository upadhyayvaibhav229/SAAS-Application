const InvoiceReceipt = ({ invoice }) => {
  if (!invoice) return null;

  const { invoiceNumber, customerId, orderId, totalAmount, dueDate } = invoice;

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto bg-white">
      <h2 className="text-xl font-bold mb-2">Invoice: {invoiceNumber}</h2>
      <p><b>Customer:</b> {customerId?.name}</p>
      <p><b>Email:</b> {customerId?.email}</p>
      <p><b>Order Number:</b> {orderId?.orderNumber}</p>
      <p><b>Due Date:</b> {new Date(dueDate).toLocaleDateString()}</p>

      <h3 className="mt-4 font-semibold">Items</h3>
      <ul className="list-disc ml-5">
        {orderId?.items?.map((item) => (
          <li key={item._id}>
            {item.name} x {item.quantity} @ ₹{item.price} = ₹{item.quantity * item.price}
          </li>
        ))}
      </ul>

      <p className="mt-2 font-bold">Total: ₹{totalAmount}</p>
    </div>
  );
};

export default InvoiceReceipt