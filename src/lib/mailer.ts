import nodemailer from "nodemailer";

export async function sendAdminNotification({
  type,
  name,
  email,
  phone,
  organization,
  position,
  approvalToken,
  address,
  zone,
  state,
  branch,
  gender,
  dateOfBirth,
  dateOfMarriage,
}: {
  type: "ONLINE" | "OFFLINE";
  name: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  position?: string | null;
  address?: string | null;
  zone?: string | null;
  state?: string | null;
  branch?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | null;
  dateOfMarriage?: Date | null;
  approvalToken: string;
}) {

  const transporter = nodemailer.createTransport({
    host: process.env.DIRECTORY_SMTP_HOST,
    port: Number(process.env.DIRECTORY_SMTP_PORT),
    secure: process.env.DIRECTORY_SMTP_SECURE === "true",
    auth: {
      user: process.env.DIRECTORY_SMTP_USER,
      pass: process.env.DIRECTORY_SMTP_PASS,
    },
  });

  const siteUrl = process.env.NEXTAUTH_URL;
  const approvalLink = `${siteUrl}/api/admin/approve?token=${approvalToken}`;

  const badgeColor = type === "ONLINE" ? "#0E9F6E" : "#D97706";

  const subject =
    type === "ONLINE"
      ? "🟢 New Online Registration - Approval Required"
      : "🟡 New Offline Registration - Approval Required";

  const formatDate = (d?: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "-";

  const html = `
  <div style="background:#f4f6f8;padding:30px 0;font-family:Arial,sans-serif;">
    <div style="max-width:650px;margin:0 auto;background:white;border-radius:12px;
                box-shadow:0 15px 35px rgba(0,0,0,0.08);overflow:hidden;">

      <!-- Header -->
      <div style="background:#6A0000;padding:25px;text-align:center;color:white;">
        <h2 style="margin:0;">New Membership Registration</h2>
        <div style="margin-top:10px;">
          <span style="
            background:${badgeColor};
            padding:6px 14px;
            border-radius:20px;
            font-size:13px;
            font-weight:bold;
          ">
            ${type === "ONLINE" ? "Online Payment Completed" : "Offline Payment Submitted"}
          </span>
        </div>
      </div>

      <!-- Body -->
      <div style="padding:30px;">

        <h3 style="margin-top:0;color:#333;">Member Details</h3>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Full Name", name)}
          ${row("Email", email)}
          ${row("Phone", phone)}
          ${row("Organization", organization)}
          ${row("Position", position)}
          ${row("Gender", gender)}
          ${row("Date of Birth", formatDate(dateOfBirth))}
          ${row("Date of Marriage", formatDate(dateOfMarriage))}
          ${row("Zone", zone)}
          ${row("State", state)}
          ${row("Branch", branch)}
          ${row("Address", address)}
        </table>

        <div style="text-align:center;margin:35px 0;">
          <a href="${approvalLink}" style="
              background:#6A0000;
              color:white;
              padding:14px 28px;
              text-decoration:none;
              border-radius:8px;
              font-size:15px;
              font-weight:bold;
              display:inline-block;
          ">
            ✅ Approve Member
          </a>
        </div>

        <p style="font-size:12px;color:#777;text-align:center;">
          This approval link is valid for 24 hours and can be used only once.
        </p>

        <p style="font-size:11px;color:#999;text-align:center;word-break:break-all;">
          If the button doesn't work, copy and paste this link:<br/>
          ${approvalLink}
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb;padding:15px;text-align:center;
                  font-size:12px;color:#888;">
        Jinsharnam Media • Membership Management System
      </div>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: "ektadirectory@gmail.com",
    subject,
    html,
  });
}

function row(label: string, value?: string | null) {
  return `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;
                 font-weight:bold;color:#555;width:35%;">
        ${label}
      </td>
      <td style="padding:10px;border-bottom:1px solid #eee;color:#333;">
        ${value || "-"}
      </td>
    </tr>
  `;
}