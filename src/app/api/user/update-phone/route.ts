import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { email, phone } = await req.json();
    if (!email || !phone) {
      return NextResponse.json({ error: "Missing email or phone" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { phone, phoneVerified: false },
    });

    return NextResponse.json({ message: "Phone updated successfully" });
  } catch (error) {
    console.error("Phone update error:", error);
    return NextResponse.json({ error: "Failed to update phone" }, { status: 500 });
  }
}
