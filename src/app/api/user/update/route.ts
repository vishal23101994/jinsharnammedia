import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error("❌ No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();

    console.log("🧩 DEBUG userId:", userId);
    console.log("🧩 DEBUG incoming body:", body);

    const { name, email, phone, address, newPassword } = body;

    // Ensure id is the correct type
    const whereClause = {
      id: typeof userId === "string" ? parseInt(userId) : userId,
    };

    const updateData: any = {
      name,
      email,
      phone: phone || null,
      address: address || null,
    };

    if (newPassword && newPassword.trim().length >= 6) {
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    console.log("🧾 DEBUG updateData:", updateData);

    const updatedUser = await prisma.user.update({
      where: whereClause,
      data: updateData,
    });

    console.log("✅ User updated:", updatedUser);

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error("💥 Prisma / Server error details:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
