import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    const request = await prisma.trusteeRequest.findFirst({
      where: {
        approvalToken: token,
        approvalTokenExpires: { gt: new Date() },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    let imageUrl = request.imageUrl;

    const photo = formData.get("photo") as File | null;

    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${photo.name}`;
      const uploadDir = path.join(
        process.cwd(),
        "public/uploads/trustees"
      );

      await fs.mkdir(uploadDir, { recursive: true });

      await fs.writeFile(
        path.join(uploadDir, fileName),
        buffer
      );

      imageUrl = `/uploads/trustees/${fileName}`;
    }

    await prisma.trusteeRequest.update({
      where: { id: request.id },
      data: {
        name: formData.get("name") as string,
        email:
          (formData.get("email") as string)?.trim() || null,
        phone: formData.get("phone") as string,
        alternatePhone: formData.get("alternatePhone") as string,
        gender: formData.get("gender") as string,
        designation: formData.get("designation") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
        dateOfBirth: formData.get("dateOfBirth")
          ? new Date(formData.get("dateOfBirth") as string)
          : null,
        dateOfMarriage: formData.get("dateOfMarriage")
          ? new Date(formData.get("dateOfMarriage") as string)
          : null,
        imageUrl,
      },
    });

    return NextResponse.redirect(
      new URL(
        `/admin/review-trustee/saved?token=${token}`,
        process.env.NEXTAUTH_URL
      )
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Save failed" },
      { status: 500 }
    );
  }
}