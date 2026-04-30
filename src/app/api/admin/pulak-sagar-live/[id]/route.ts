import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= GET SINGLE ================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const item = await prisma.pulakSagarLiveUpdate.findUnique({
      where: { id },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Fetch failed" },
      { status: 500 }
    );
  }
}

/* ================= UPDATE ================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.pulakSagarLiveUpdate.update({
      where: { id },
      data: {
        title: body.title,
        location: body.location,
        state: body.state,
        message: body.message,
        imageUrl: body.imageUrl,
        mapLink: body.mapLink,
        startDate: body.startDate
          ? new Date(body.startDate)
          : null,
        endDate: body.endDate
          ? new Date(body.endDate)
          : null,
        isActive: body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Update failed" },
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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.pulakSagarLiveUpdate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}