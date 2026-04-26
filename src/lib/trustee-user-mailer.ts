import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.DIRECTORY_SMTP_HOST,
  port: Number(process.env.DIRECTORY_SMTP_PORT),
  secure: process.env.DIRECTORY_SMTP_SECURE === "true",
  auth: {
    user: process.env.DIRECTORY_SMTP_USER,
    pass: process.env.DIRECTORY_SMTP_PASS,
  },
});

const wrapper = (content: string) => `
<div style="background:#f4f6f8;padding:30px 0;font-family:Arial,sans-serif;">
  <div style="max-width:650px;margin:auto;background:white;border-radius:14px;overflow:hidden;">
    ${content}
    <div style="background:#fafafa;padding:15px;text-align:center;font-size:12px;color:#777;">
      Jinsharnam Trustee Management System
    </div>
  </div>
</div>
`;

export async function sendTrusteePendingEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Trustee Registration Submitted",
    html: wrapper(`
      <div style="background:#D97706;padding:22px;text-align:center;color:white;">
        <h2>Registration Received</h2>
      </div>
      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your trustee registration has been submitted successfully.</p>
        <p>Status: <strong>Pending Approval</strong></p>
      </div>
    `),
  });
}

export async function sendTrusteeApprovedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Trustee Registration Approved",
    html: wrapper(`
      <div style="background:#16A34A;padding:22px;text-align:center;color:white;">
        <h2>Registration Approved</h2>
      </div>
      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your trustee registration has been approved successfully.</p>
        <p>Welcome to Jinsharnam Tirth Trust.</p>
      </div>
    `),
  });
}

export async function sendTrusteeRejectedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Trustee Registration Update",
    html: wrapper(`
      <div style="background:#DC2626;padding:22px;text-align:center;color:white;">
        <h2>Registration Rejected</h2>
      </div>
      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your trustee registration could not be approved.</p>
        <p>Please contact administration for clarification.</p>
      </div>
    `),
  });
}