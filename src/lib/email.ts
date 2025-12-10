import nodemailer from "nodemailer";

// -----------------------------------------------------
// 1️⃣ Create SMTP Transporter (must be at the top)
// -----------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure:
    process.env.SMTP_SECURE === "true" ||
    Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// -----------------------------------------------------
// 2️⃣ Send OTP Email
// -----------------------------------------------------
export async function sendOtpEmail(to: string, otp: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to,
    subject: "Your Jinsharnam verification code",
    html: `
      <div style="font-family: system-ui, sans-serif; font-size:14px; color:#111827;">
        <p>Namaste 🙏</p>
        <p>Your verification code is:</p>
        <h2 style="color:#22c55e; font-size: 24px;">${otp}</h2>
        <p>This code is valid for <b>5 minutes</b>.</p>
      </div>
    `,
  });
}

// -----------------------------------------------------
// 3️⃣ Send Order Status Email (NO IMAGE COLUMN)
// -----------------------------------------------------
export async function sendOrderStatusEmail(options: {
  to: string;
  userName?: string | null;
  status: string;
  items: { title: string; quantity: number; priceCents: number }[];
  totalCents?: number;
  address?: string | null;
}) {
  const { to, userName, status, items, totalCents, address } = options;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const statusUpper = status.toUpperCase();
  const statusNice = statusUpper[0] + statusUpper.slice(1).toLowerCase();

  let line = "";
  switch (statusUpper) {
    case "PENDING":
      line = "We have received your order.";
      break;
    case "PROCESSING":
      line = "Your order is now being processed.";
      break;
    case "SHIPPED":
      line = "Your order has been shipped. It will reach you soon.";
      break;
    case "DELIVERED":
      line = "Your order has been delivered. We hope you liked it 🙏";
      break;
    default:
      line = `Your order status is now ${statusNice}.`;
  }

  // Build rows
  const itemsRows = items
    .map((item) => {
      const price = item.priceCents / 100;
      const lineTotal = price * item.quantity;
      return `
        <tr>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb;">${item.title}</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; text-align:center;">${item.quantity}</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; text-align:right;">₹${price.toFixed(2)}</td>
          <td style="padding: 6px 8px; border: 1px solid #e5e7eb; text-align:right;">₹${lineTotal.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const totalLine = totalCents
    ? `
    <tr>
      <td colspan="3" style="padding: 8px; border: 1px solid #e5e7eb; text-align:right; font-weight:600;">
        Total
      </td>
      <td style="padding: 8px; border: 1px solid #e5e7eb; text-align:right; font-weight:600;">
        ₹${(totalCents / 100).toFixed(2)}
      </td>
    </tr>
  `
    : "";

  const addressBlock = address
    ? `
      <p><b>Delivery address:</b></p>
      <p style="white-space:pre-line;">${address.replace(/\n/g, "<br/>")}</p>
    `
    : "";

  const greetingName = userName || "devotee";

  const html = `
    <div style="font-family: system-ui, sans-serif; font-size:14px; color:#111827;">
      <p>Namaste ${greetingName} 🙏</p>
      <p>${line}</p>

      ${addressBlock}

      <p style="margin-top:14px;">Here is a summary of what you ordered:</p>

      <table style="border-collapse: collapse; width:100%; max-width:600px; margin:10px 0;">
        <thead>
          <tr>
            <th style="padding: 6px; border: 1px solid #e5e7eb; background:#f3f4f6; text-align:left;">Item</th>
            <th style="padding: 6px; border: 1px solid #e5e7eb; background:#f3f4f6; text-align:center;">Qty</th>
            <th style="padding: 6px; border: 1px solid #e5e7eb; background:#f3f4f6; text-align:right;">Price</th>
            <th style="padding: 6px; border: 1px solid #e5e7eb; background:#f3f4f6; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          ${totalLine}
        </tbody>
      </table>

      <p>You can login to your Jinsharnam Media account to see full order details.</p>
      <p style="margin-top:12px;">With gratitude,<br/>Jinsharnam Media</p>
    </div>
  `;

  // 🚨 FIX: transporter must exist here
  await transporter.sendMail({
    from,
    to,
    subject: `Your order is now ${statusNice}`,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(
    token
  )}`;

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your Jinsharnam password",
    html: `
      <div style="font-family: system-ui, sans-serif; font-size:14px; color:#111827;">
        <p>Namaste 🙏</p>
        <p>We received a request to reset your Jinsharnam Media password.</p>
        <p>You can reset it by clicking the link below:</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block; padding:8px 14px; background:#22c55e; color:#ffffff; border-radius:999px; text-decoration:none; font-weight:500;">
            Reset password
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break:break-all; color:#2563eb;">${resetUrl}</p>
        <p>This link will expire in <b>1 hour</b>. If you didn't request this, you can safely ignore this email.</p>
        <p style="margin-top:12px;">With gratitude,<br/>Jinsharnam Media</p>
      </div>
    `,
  });
}
