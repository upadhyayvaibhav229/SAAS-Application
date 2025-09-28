import transporter from "../config/nodemailer.js"; // adjust path
import { generateInvoicePDF } from "./invoice.service.js";

export async function sendInvoiceEmail(invoiceData) {
  const pdfBuffer = await generateInvoicePDF(invoiceData);

  await transporter.sendMail({
    from: `"${invoiceData.companyName}" <${process.env.SMTP_USER}>`,
    to: invoiceData.customerEmail,
    subject: `Invoice ${invoiceData.invoiceNumber}`,
    text: `Hello ${invoiceData.customerName},\n\nPlease find attached your invoice.`,
    attachments: [
      {
        filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
