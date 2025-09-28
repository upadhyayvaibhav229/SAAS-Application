import PDFDocument from "pdfkit";

export async function generateInvoicePDF(invoice) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // --- Company Info (hardcoded for now) ---
  doc.fontSize(20).text("Your Company Name", 50, 50);
  doc.fontSize(10)
     .text("123 Business St, City, Country", 50, 75)
     .text("info@company.com", 50, 90)
     .text("+91 12345 67890", 50, 105);

  // --- Invoice Header ---
  doc.fontSize(20).text("INVOICE", 400, 50, { align: "right" });
  doc.fontSize(10)
     .text(`Invoice #: ${invoice.invoiceNumber}`, 400, 80, { align: "right" })
     .text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 400, 95, { align: "right" })
     .text(`Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "N/A"}`, 400, 110, { align: "right" });

  // --- Customer Info ---
  doc.text("Bill To:", 50, 150);
  doc.font("Helvetica-Bold").text(invoice.customerId.name, 50, 165);
  doc.font("Helvetica").text(invoice.customerId.email, 50, 180);
  if (invoice.customerId.phone) doc.text(invoice.customerId.phone, 50, 195);
  if (invoice.customerId.address) doc.text(invoice.customerId.address, 50, 210);

  // --- Items Table ---
  const tableTop = 240;
  doc.font("Helvetica-Bold");
  doc.text("#", 50, tableTop);
  doc.text("Description", 80, tableTop);
  doc.text("Qty", 300, tableTop);
  doc.text("Unit Price", 350, tableTop);
  doc.text("Total", 450, tableTop);
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  doc.font("Helvetica");
  let position = tableTop + 25;
  (invoice.orderId.items || []).forEach((item, i) => {
    doc.text(i + 1, 50, position);
    doc.text(item.name, 80, position);
    doc.text(item.quantity, 300, position);
    doc.text(`₹${item.price}`, 350, position);
    doc.text(`₹${item.quantity * item.price}`, 450, position);
    position += 20;
  });

  // --- Totals & Payment Status ---
  const totalPosition = position + 20;
  doc.font("Helvetica-Bold");
  doc.text(`Total Amount: ₹${invoice.totalAmount}`, 400, totalPosition);
  doc.text(`Payment Status: ${invoice.status.toUpperCase()}`, 400, totalPosition + 15);

  // --- Footer ---
  doc.fontSize(10).text("Thank you for your business!", 50, 700, { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
}
