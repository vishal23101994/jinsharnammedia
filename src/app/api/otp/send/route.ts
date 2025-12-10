import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: { otp, otpExpiresAt: expiresAt },
      create: {
        name: "User",
        email,
        password: "TEMP_PASSWORD",
        phone: "",
        otp,
        otpExpiresAt: expiresAt,
        phoneVerified: false,
      },
    });

    await sendOtpEmail(email, otp);

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (err: any) {
    console.error("Send OTP Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
