/**
 * Invoice PDF Generator using pdf-lib — a lightweight A4 invoice attached to the payment email.
 */

import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { invoiceFields, type InvoiceData } from "./invoice-service";

const BLACK = rgb(0.07, 0.07, 0.07);
const GRAY = rgb(0.42, 0.45, 0.5);
const BORDER = rgb(0.9, 0.91, 0.92);
const LIME = rgb(0.396, 0.639, 0.051); // #65a30d

// Standard fonts only cover WinAnsi; swap anything else for a safe character
const ansi = (s: string) =>
  s
    .replace(/×/g, "x")
    .replace(/₹/g, "Rs. ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");

export async function generateInvoicePdfBuffer(params: InvoiceData): Promise<Buffer> {
  const f = invoiceFields(params);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 48;
  const right = width - margin;

  const text = (p: PDFPage, s: string, x: number, y: number, font: PDFFont, size: number, color = BLACK) =>
    p.drawText(ansi(s), { x, y, font, size, color });
  const textRight = (s: string, y: number, font: PDFFont, size: number, color = BLACK) =>
    text(page, s, right - font.widthOfTextAtSize(ansi(s), size), y, font, size, color);
  const line = (y: number) =>
    page.drawLine({ start: { x: margin, y }, end: { x: right, y }, thickness: 1, color: BORDER });

  // Header
  let y = height - margin - 10;
  text(page, f.seller.name, margin, y, bold, 18);
  textRight("INVOICE", y, bold, 18);
  y -= 18;
  text(page, f.seller.address, margin, y, regular, 9, GRAY);
  textRight(params.invoiceNumber, y, regular, 10);
  y -= 13;
  text(page, `${f.seller.email} · ${f.seller.website}`, margin, y, regular, 9, GRAY);
  textRight(`Date: ${f.paidDate}`, y, regular, 9, GRAY);
  y -= 16;
  page.drawRectangle({ x: right - 44, y: y - 4, width: 44, height: 16, color: rgb(0.94, 0.97, 0.9) });
  text(page, "PAID", right - 34, y, bold, 9, LIME);
  y -= 20;
  line(y);

  // Billed to / Payment
  y -= 26;
  const col2 = margin + (right - margin) / 2;
  text(page, "BILLED TO", margin, y, bold, 8, GRAY);
  text(page, "PAYMENT", col2, y, bold, 8, GRAY);
  y -= 16;
  text(page, f.customerName, margin, y, bold, 10);
  text(page, "Razorpay", col2, y, regular, 10);
  y -= 14;
  text(page, params.email, margin, y, regular, 10);
  text(page, `Payment ID: ${params.razorpayPaymentId}`, col2, y, regular, 9);
  y -= 14;
  text(page, `Order ID: ${params.razorpayOrderId || "N/A"}`, col2, y, regular, 9);

  // Items table
  y -= 36;
  text(page, "ITEM", margin, y, bold, 8, GRAY);
  text(page, "QTY", right - 140, y, bold, 8, GRAY);
  textRight("AMOUNT", y, bold, 8, GRAY);
  y -= 10;
  line(y);
  y -= 20;
  text(page, f.itemTitle, margin, y, bold, 10);
  text(page, "1", right - 136, y, regular, 10);
  textRight(f.amountFormatted, y, regular, 10);
  // Wrap the description to the item column (left of QTY)
  const maxWidth = right - 160 - margin;
  const lines: string[] = [];
  for (const word of ansi(f.itemDescription).split(" ")) {
    const candidate = lines.length ? `${lines[lines.length - 1]} ${word}` : word;
    if (lines.length && regular.widthOfTextAtSize(candidate, 9) <= maxWidth) lines[lines.length - 1] = candidate;
    else lines.push(word);
  }
  for (const l of lines) {
    y -= 13;
    text(page, l, margin, y, regular, 9, GRAY);
  }
  y -= 16;
  line(y);

  // Totals
  const totalsX = right - 200;
  y -= 22;
  text(page, "Subtotal", totalsX, y, regular, 10, GRAY);
  textRight(f.amountFormatted, y, regular, 10);
  y -= 16;
  text(page, "Tax", totalsX, y, regular, 10, GRAY);
  textRight(f.zeroFormatted, y, regular, 10);
  y -= 10;
  page.drawLine({ start: { x: totalsX, y }, end: { x: right, y }, thickness: 1, color: BORDER });
  y -= 18;
  text(page, "Total paid", totalsX, y, bold, 12);
  textRight(f.amountFormatted, y, bold, 12);

  // Footer
  const foot = `Computer-generated invoice; no signature required. Questions? ${f.seller.email}`;
  text(page, foot, (width - regular.widthOfTextAtSize(ansi(foot), 8)) / 2, margin, regular, 8, GRAY);

  return Buffer.from(await pdf.save());
}
