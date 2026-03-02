import nodemailer from "nodemailer";

interface TrusteeMailData {
  name: string;
  email: string;
  phone?: string | null;
  alternatePhone?: string | null;
  gender?: string | null;
  designation?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  dateOfBirth?: Date | null;
  dateOfMarriage?: Date | null;
  imageUrl?: string | null;
  approvalToken: string;
}

export async function sendTrusteeApprovalMail(data: TrusteeMailData) {
  if (!process.env.DIRECTORY_SMTP_HOST) {
    throw new Error("SMTP environment variables not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.DIRECTORY_SMTP_HOST,
    port: Number(process.env.DIRECTORY_SMTP_PORT),
    secure: process.env.DIRECTORY_SMTP_SECURE === "true",
    auth: {
      user: process.env.DIRECTORY_SMTP_USER,
      pass: process.env.DIRECTORY_SMTP_PASS,
    },
  });

  // Optional but recommended
  await transporter.verify();

  const baseUrl = process.env.NEXTAUTH_URL;
  const approveUrl = `${baseUrl}/api/trustee/approve?token=${data.approvalToken}`;
  const rejectUrl = `${baseUrl}/api/trustee/reject?token=${data.approvalToken}`;

  // 🔥 FIX: Convert image to FULL URL for email
  const imageFullUrl = data.imageUrl
    ? `${baseUrl}${data.imageUrl}`
    : null;

  const formatDate = (date?: Date | null) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "N/A";

  const htmlContent = `
  <div style="font-family:Arial,sans-serif;background:#f4f6f9;padding:30px;">
    <div style="max-width:700px;margin:auto;background:white;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:linear-gradient(90deg,#6A0000,#A00000);padding:25px;text-align:center;color:white;">
        <h2 style="margin:0;font-size:22px;">New Trustee Registration</h2>
        <p style="margin-top:8px;font-size:14px;opacity:0.9;">
          Approval Required
        </p>
      </div>

      <!-- Body -->
      <div style="padding:30px;">

        ${
          imageFullUrl
            ? `<div style="text-align:center;margin-bottom:25px;">
                <img src="${imageFullUrl}" alt="Profile Photo" 
                style="width:130px;height:160px;object-fit:cover;border-radius:10px;border:4px solid #f1f1f1;box-shadow:0 4px 10px rgba(0,0,0,0.1);" />
              </div>`
            : ""
        }

        <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
          ${row("Full Name", data.name)}
          ${row("Email", data.email)}
          ${row("Mobile", data.phone)}
          ${row("Alternate Mobile", data.alternatePhone)}
          ${row("Gender", data.gender)}
          ${row("Designation", data.designation)}
          ${row("Date of Birth", formatDate(data.dateOfBirth))}
          ${row("Date of Marriage", formatDate(data.dateOfMarriage))}
          ${row("Address", data.address)}
          ${row("City", data.city)}
          ${row("State", data.state)}
          ${row("Pincode", data.pincode)}
        </table>

        <div style="margin-top:35px;text-align:center;">
          <a href="${approveUrl}" 
            style="background:#28a745;color:white;padding:14px 28px;
            text-decoration:none;border-radius:8px;
            font-weight:bold;margin-right:15px;display:inline-block;">
            ✅ Approve
          </a>

          <a href="${rejectUrl}" 
            style="background:#dc3545;color:white;padding:14px 28px;
            text-decoration:none;border-radius:8px;
            font-weight:bold;display:inline-block;">
            ❌ Reject
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#fafafa;padding:18px;text-align:center;
      font-size:12px;color:#888;border-top:1px solid #eee;">
        This request will expire in 24 hours.<br/>
        <strong>Jinsharnam Trustee Management System</strong>
      </div>

    </div>
  </div>
  `;

  const textContent = `
New Trustee Registration

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "N/A"}
Designation: ${data.designation || "N/A"}
City: ${data.city || "N/A"}
State: ${data.state || "N/A"}

Approve: ${approveUrl}
Reject: ${rejectUrl}
`;

  await transporter.sendMail({
    from: `"Jinsharnam Trustee System" <${process.env.DIRECTORY_SMTP_USER}>`,
    to: process.env.DIRECTORY_SMTP_USER,
    subject: `Trustee Approval Required – ${data.name}`,
    text: textContent,
    html: htmlContent,
  });
}

/* Helper function */
function row(label: string, value?: string | null) {
  return `
    <tr>
      <td style="font-weight:bold;border-bottom:1px solid #eee;width:35%;">
        ${label}
      </td>
      <td style="border-bottom:1px solid #eee;">
        ${value || "N/A"}
      </td>
    </tr>
  `;
}