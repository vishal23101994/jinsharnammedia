import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { phone, address, password } = body as {
    phone?: string;
    address?: string;
    password?: string;
  };

  const dataToUpdate: any = {};

  // phone: trim, allow null
  if (typeof phone === "string") {
    const trimmed = phone.trim();
    dataToUpdate.phone = trimmed.length > 0 ? trimmed : null;
  }

  // address: trim, allow null
  if (typeof address === "string") {
    const trimmed = address.trim();
    dataToUpdate.address = trimmed.length > 0 ? trimmed : null;
  }

  // optional password update
  if (password && password.trim().length >= 6) {
    const hashed = await bcrypt.hash(password.trim(), 10);
    dataToUpdate.password = hashed;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email as string },
      data: dataToUpdate,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    // 🧱 Unique constraint (e.g. duplicate phone)
    if (err.code === "P2002" && err.meta?.target?.includes("phone")) {
      return NextResponse.json(
        {
          message:
            "This phone number is already in use. Please use a different number.",
        },
        { status: 409 }
      );
    }

    console.error("Profile update error:", err);
    return NextResponse.json(
      { message: "Something went wrong while updating profile." },
      { status: 500 }
    );
  }
}
