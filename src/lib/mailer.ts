import nodemailer from "nodemailer";

export async function sendAdminNotification({
  type,
  name,
  email,
  phone,
  organization,
  position,
}: {
  type: "ONLINE" | "OFFLINE";
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  position?: string | null;
}) {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject =
    type === "ONLINE"
      ? "✅ New Online Registration - Pulak Manch"
      : "🧾 New Offline Registration (Pending Approval)";

  const html = `
    <div style="font-family: Arial; padding:20px;">
      <h2 style="color:#6A0000;">
        ${type === "ONLINE" ? "Online Registration Successful" : "Offline Registration (Pending Approval)"}
      </h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>Organization:</strong> ${organization || "-"}</p>
      <p><strong>Position:</strong> ${position || "-"}</p>

      <hr/>

      <p>
        ${
          type === "ONLINE"
            ? "User has successfully completed online payment and is auto-approved."
            : "User has selected Already Paid option. Please verify payment and approve from dashboard."
        }
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "jinsharnam@gmail.com",
    subject,
    html,
  });
}