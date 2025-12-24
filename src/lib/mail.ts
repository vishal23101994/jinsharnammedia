import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(
  to: string,
  name?: string | null
) {
  const subject = "Welcome to Jinsharnam Media 🙏";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>🙏 Welcome to Jinsharnam Media</h2>

      <p>Dear ${name ?? "Seeker"},</p>

      <p>
        Thank you for joining the journey of
        <strong>Jain Dharma, Ahimsa, and Inner Awakening</strong>.
      </p>

      <p>
        We are honored to walk this spiritual path with you.
      </p>

      <p>
        🌼 Sacred literature<br/>
        🕊️ Spiritual wisdom<br/>
        📿 Jain philosophy & teachings
      </p>

      <br/>

      <p>
        With gratitude,<br/>
        <strong>Jinsharnam Media</strong>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}
