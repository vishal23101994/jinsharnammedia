import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ⭐ FIX: password may be null for Google-login users
    if (!user.password) {
      return NextResponse.json(
        { error: "This account has no password set. Use Google login." },
        { status: 400 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Response & cookies
    const res = NextResponse.json({ message: "Login successful", user });

    // Cookies accessible on client (role-based UI)
    res.cookies.set("user_role", user.role, { httpOnly: false, path: "/" });
    res.cookies.set("user_email", user.email, { httpOnly: false, path: "/" });

    return res;
  } catch (error) {
    console.error("login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
