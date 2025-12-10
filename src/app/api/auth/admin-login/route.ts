import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response("User not found", { status: 404 });

    // ✅ FIXED — use user.password instead of user.passwordHash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return new Response("Invalid credentials", { status: 401 });

    if (user.role !== "ADMIN") {
      return new Response("Access denied. Admins only.", { status: 403 });
    }


    return new Response(
      JSON.stringify({
        id: user.id,
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
