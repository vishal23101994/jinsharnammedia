import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    /* ================= PAYMENT VALIDATION ================= */

    const razorpay_order_id = formData.get("razorpay_order_id")?.toString();
    const razorpay_payment_id = formData.get("razorpay_payment_id")?.toString();
    const razorpay_signature = formData.get("razorpay_signature")?.toString();

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return NextResponse.json(
        { error: "Missing payment details" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_SECRET) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    /* ================= REQUIRED FIELD VALIDATION ================= */

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    /* ================= PHOTO UPLOAD ================= */

    let imageUrl: string | null = null;

    const photo = formData.get("photo") as File | null;

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/pulak-manch"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${photo.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imageUrl = `/uploads/pulak-manch/${fileName}`;
    }

    /* ================= SAVE TO DATABASE ================= */

    await prisma.directoryMember.create({
      data: {
        name,
        email,
        phone: formData.get("phone")?.toString() || null,
        address: formData.get("address")?.toString() || null,
        organization: formData.get("organization")?.toString() || null,
        position: formData.get("position")?.toString() || null,
        zone: formData.get("zone")?.toString() || null,
        state: formData.get("state")?.toString() || null,
        branch: formData.get("branch")?.toString() || null,
        gender: formData.get("gender")?.toString() || null,
        dateOfBirth: formData.get("dateOfBirth")
          ? new Date(formData.get("dateOfBirth")!.toString())
          : null,
        dateOfMarriage: formData.get("dateOfMarriage")
          ? new Date(formData.get("dateOfMarriage")!.toString())
          : null,
        imageUrl,
        status: "APPROVED", // must match your Prisma enum
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}