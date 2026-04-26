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

const baseWrapper = (content: string) => `
<div style="background:#f4f6f8;padding:30px 0;font-family:Arial,sans-serif;">
  <div style="max-width:650px;margin:0 auto;background:white;border-radius:12px;
              box-shadow:0 15px 35px rgba(0,0,0,0.08);overflow:hidden;">
    ${content}
    <div style="background:#f9fafb;padding:15px;text-align:center;
                font-size:12px;color:#888;">
      Jinsharnam Media • Membership Management System
    </div>
  </div>
</div>
`;

export async function sendDirectoryPendingEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Registration Submitted Successfully",
    html: baseWrapper(`
      <div style="background:#D97706;padding:22px;text-align:center;color:white;">
        <h2 style="margin:0;">Registration Received</h2>
      </div>

      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>

        <p>Your Pulak Manch registration has been submitted successfully.</p>

        <p>
          Current Status:
          <strong style="color:#D97706;"> Pending Admin Approval</strong>
        </p>

        <p>You will receive another email once your registration is reviewed.</p>
      </div>
    `),
  });
}

export async function sendDirectoryApprovedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Registration Approved Successfully",
    html: baseWrapper(`
      <div style="background:#16A34A;padding:22px;text-align:center;color:white;">
        <h2 style="margin:0;">Registration Approved</h2>
      </div>

      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>

        <p>Congratulations! Your Pulak Manch registration has been approved.</p>

        <p>Welcome to the Jinsharnam spiritual family.</p>
      </div>
    `),
  });
}

export async function sendDirectoryRejectedEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  await transporter.sendMail({
    from: process.env.DIRECTORY_SMTP_FROM,
    to: email,
    subject: "Registration Update",
    html: baseWrapper(`
      <div style="background:#DC2626;padding:22px;text-align:center;color:white;">
        <h2 style="margin:0;">Registration Not Approved</h2>
      </div>

      <div style="padding:30px;">
        <p>Dear <strong>${name}</strong>,</p>

        <p>We regret to inform you that your registration was not approved.</p>

        <p>Please contact support for further clarification.</p>
      </div>
    `),
  });
}