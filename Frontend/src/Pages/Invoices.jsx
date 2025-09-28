import React, { useState } from "react";
// import InvoiceReceipt from "./InvoiceReceipt";
import InvoiceForm from "../Component/InvoiceForm";
import InvoiceReceipt from "../Component/InvoiceRecipt";
const Invoice = () => {
  const [invoice, setInvoice] = useState(null);

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* Invoice Creation Form */}
      <InvoiceForm onInvoiceCreated={(inv) => setInvoice(inv)} />

      {/* Show Invoice Receipt after creation */}
      {invoice && <InvoiceReceipt invoice={invoice} />}
    </div>
  );
};

export default Invoice;
