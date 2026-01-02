import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await prisma.latestUpdate.findMany());
}

export async function POST(req: Request) {
  try {
    // 🔐 Admin check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const f = await req.formData();

    const title = f.get("title") as string;
    const content = f.get("content") as string;
    const category = f.get("category") as
      | "JINSHARNAM"
      | "VATSALYA"
      | "ADVERTISEMENT";

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 📸 Image upload
    const file = f.get("image") as File | null;
    let imageUrl: string | null = null;

    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      const name = Date.now() + "-" + file.name;

      await fs.writeFile(
        path.join(process.cwd(), "public/uploads", name),
        buf
      );

      imageUrl = `/uploads/${name}`;
    }

    const created = await prisma.latestUpdate.create({
      data: {
        title,
        content,
        category, // ✅ FIXED
        imageUrl,
        published: true,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("CREATE LatestUpdate failed:", error);
    return NextResponse.json(
      { error: "Create failed" },
      { status: 500 }
    );
  }
}
