import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

/* ================= GET ALL ================= */
export async function GET() {
  try {
    const updates = await prisma.pulakSagarLiveUpdate.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch updates" },
      { status: 500 }
    );
  }
}

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const location = formData.get("location") as string;
    const state = formData.get("state") as string;
    const message = formData.get("message") as string;
    const mapLink = formData.get("mapLink") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    /* IMAGE UPLOAD */
    const file = formData.get("image") as File | null;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;

      await fs.writeFile(
        path.join(process.cwd(), "public/uploads", fileName),
        buffer
      );

      imageUrl = `/uploads/${fileName}`;
    }

    const created = await prisma.pulakSagarLiveUpdate.create({
      data: {
        title,
        location,
        state,
        message,
        mapLink,
        imageUrl,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Create failed" },
      { status: 500 }
    );
  }
}