import PDFDocument from "pdfkit";

export async function generateInvoicePDF(invoiceData) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];
  
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // --- Company Logo & Info ---
  if (invoiceData.companyLogoPath) {
    doc.image(invoiceData.companyLogoPath, 50, 45, { width: 100 });
  }
  doc.fontSize(20).text(invoiceData.companyName || "Your Company Name", 50, 150);
  doc.fontSize(10)
     .text(invoiceData.companyAddress || "123 Business St, City, Country", 50, 170)
     .text(invoiceData.companyEmail || "info@company.com", 50, 185)
     .text(invoiceData.companyPhone || "+91 12345 67890", 50, 200);

  // --- Invoice Header ---
  doc.fontSize(20).text("INVOICE", 400, 50, { align: "right" });
  doc.fontSize(10)
     .text(`Invoice #: ${invoiceData.invoiceNumber}`, 400, 80, { align: "right" })
     .text(`Invoice Date: ${invoiceData.invoiceDate}`, 400, 95, { align: "right" })
     .text(`Due Date: ${invoiceData.dueDate}`, 400, 110, { align: "right" });

  // --- Customer Info ---
  doc.text(`Bill To:`, 50, 230);
  doc.font("Helvetica-Bold").text(invoiceData.customerName, 50, 245);
  doc.font("Helvetica").text(invoiceData.customerEmail, 50, 260);
  if(invoiceData.customerAddress) doc.text(invoiceData.customerAddress, 50, 275);

  // --- Items Table ---
  const tableTop = 320;
  doc.font("Helvetica-Bold");
  doc.text("#", 50, tableTop);
  doc.text("Description", 80, tableTop);
  doc.text("Qty", 300, tableTop);
  doc.text("Unit Price", 350, tableTop);
  doc.text("Total", 450, tableTop);
  doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

  doc.font("Helvetica");
  let position = tableTop + 25;
  invoiceData.items.forEach((item, i) => {
    doc.text(i + 1, 50, position);
    doc.text(item.name, 80, position);
    doc.text(item.qty, 300, position);
    doc.text(item.price, 350, position);
    doc.text(item.qty * item.price, 450, position);
    position += 20;
  });

  // --- Totals ---
  const totalPosition = position + 20;
  doc.font("Helvetica-Bold");
  doc.text(`Subtotal: ${invoiceData.subtotal}`, 400, totalPosition);
  if(invoiceData.tax) doc.text(`Tax: ${invoiceData.tax}`, 400, totalPosition + 15);
  doc.text(`Total: ${invoiceData.total}`, 400, totalPosition + 30);

  // --- Footer ---
  const footerPosition = 700;
  doc.fontSize(10).text(invoiceData.notes || "Thank you for your business!", 50, footerPosition, { align: "center" });
  if(invoiceData.terms) doc.text(invoiceData.terms, 50, footerPosition + 15, { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
}
