import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ================= GET (for EDIT page) ================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const update = await prisma.latestUpdate.findUnique({
      where: { id },
    });

    if (!update) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error("GET LatestUpdate failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch update" },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    await prisma.latestUpdate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE LatestUpdate failed:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}

/* ================= PUT (SAVE EDIT) ================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.latestUpdate.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("UPDATE LatestUpdate failed:", error);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
