import transporter from "../config/nodemailer.js";
import { generateInvoicePDF } from "./invoice.service.js";

export async function sendInvoiceEmail(invoice, tenant) {
  const pdfBuffer = await generateInvoicePDF(invoice, tenant);

  await transporter.sendMail({
    from: `"${tenant.name}" <${tenant.email || process.env.SMTP_USER}>`,
    to: invoice.customerId.email,
    subject: `Invoice ${invoice.invoiceNumber}`,
    text: `Hello ${invoice.customerId.name},\n\nPlease find attached your invoice.`,
    attachments: [
      {
        filename: `Invoice-${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
