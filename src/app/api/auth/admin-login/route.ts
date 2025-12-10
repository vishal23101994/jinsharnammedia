import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // ⭐ password can be null (e.g. Google-only users)
    if (!user.password) {
      return new Response("This account has no password set", { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response("Invalid credentials", { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return new Response("Access denied. Admins only.", { status: 403 });
    }

    return new Response(
      JSON.stringify({
        id: user.id, // can keep as number here, this is your own API
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login failed:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
