import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const { email, name, phone, address } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { name, phone, address },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
