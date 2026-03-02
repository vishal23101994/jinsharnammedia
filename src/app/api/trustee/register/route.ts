export const runtime = "nodejs";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendTrusteeApprovalMail } from "@/lib/trustee-mailer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;

    const existingApproved = await prisma.trustee.findUnique({
      where: { email },
    });

    if (existingApproved) {
      return new Response(
        JSON.stringify({ message: "You are already an approved trustee." }),
        { status: 400 }
      );
    }

    /* ================= CHECK EXISTING REQUEST ================= */

    const existingRequest = await prisma.trusteeRequest.findUnique({
      where: { email },
    });

    if (existingRequest) {
      return new Response(
        JSON.stringify({ message: "Request already submitted" }),
        { status: 400 }
      );
    }

    /* ================= IMAGE HANDLING ================= */

    const file = formData.get("photo") as File | null;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/trustees"
      );

      await mkdir(uploadDir, { recursive: true });

      const uniqueName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);

      imageUrl = `/uploads/trustees/${uniqueName}`;
    }

    /* ================= DATE HANDLING ================= */

    const dobRaw = formData.get("dateOfBirth") as string;
    const domRaw = formData.get("dateOfMarriage") as string | null;

    const dateOfBirth = dobRaw ? new Date(dobRaw) : null;
    const dateOfMarriage = domRaw ? new Date(domRaw) : null;

    if (dateOfBirth && isNaN(dateOfBirth.getTime())) {
      throw new Error("Invalid Date of Birth");
    }

    if (dateOfMarriage && isNaN(dateOfMarriage.getTime())) {
      throw new Error("Invalid Date of Marriage");
    }

    /* ================= CREATE DATA ================= */

    const approvalToken = randomBytes(32).toString("hex");

    const data = {
      name: formData.get("name") as string,
      email,
      phone: formData.get("phone") as string,
      alternatePhone: formData.get("alternatePhone") as string,
      gender: formData.get("gender") as string,
      designation: formData.get("designation") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      dateOfBirth,
      dateOfMarriage,
      imageUrl,
      approvalToken,
      approvalTokenExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    };

    const trusteeRequest = await prisma.trusteeRequest.create({
      data,
    });

    await sendTrusteeApprovalMail({
      ...trusteeRequest,
      approvalToken,
    });

    return Response.json({ success: true });

  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return new Response(
      JSON.stringify({ message: error.message }),
      { status: 500 }
    );
  }
}