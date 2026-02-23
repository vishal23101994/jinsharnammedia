import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const razorpay_order_id = formData.get("razorpay_order_id")?.toString();
    const razorpay_payment_id = formData.get("razorpay_payment_id")?.toString();
    const razorpay_signature = formData.get("razorpay_signature")?.toString();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
    }

    // 🔥 HANDLE PHOTO UPLOAD
    let imageUrl = null;

    const photo = formData.get("photo") as File;

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/pulak-manch");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = Date.now() + "-" + photo.name;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imageUrl = "/uploads/pulak-manch/" + fileName;
    }

    // 🔥 SAVE TO DATABASE
    const created = await prisma.directoryMember.create({
      data: {
        name: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
        phone: formData.get("phone")?.toString(),
        address: formData.get("address")?.toString(),
        organization: formData.get("organization")?.toString(),
        position: formData.get("position")?.toString(),
        zone: formData.get("zone")?.toString(),
        state: formData.get("state")?.toString(),
        branch: formData.get("branch")?.toString(),
        gender: formData.get("gender")?.toString(),
        dateOfBirth: formData.get("dateOfBirth")
          ? new Date(formData.get("dateOfBirth")!.toString())
          : null,
        dateOfMarriage: formData.get("dateOfMarriage")
          ? new Date(formData.get("dateOfMarriage")!.toString())
          : null,
        imageUrl,
        status: "APPROVED",
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}