import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert line breaks to <br> for HTML email
    const formattedMessage = message.replace(/\n/g, "<br />");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // 465
      secure: process.env.SMTP_SECURE === "true", // true
      auth: {
        user: process.env.SMTP_USER, // yourgmail@gmail.com
        pass: process.env.SMTP_PASS, // app password
      },
    });

    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: "jinsharnam@gmail.com", // <-- where YOU receive it
      subject: "New Contact Form Message",
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 14px; color: #222;">
          <h2 style="margin-bottom: 16px;">New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <hr style="margin: 16px 0;" />

          <p><strong>Message:</strong></p>
          <p>${formattedMessage}</p>

          <hr style="margin: 16px 0;" />
          <p style="font-size: 12px; color: #777;">
            This message was sent from the contact form on jinsharnammedia.com
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Server error, unable to send email" },
      { status: 500 }
    );
  }
}
