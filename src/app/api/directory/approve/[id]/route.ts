import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // params is now a Promise
    const numericId = Number(id);

    const updated = await prisma.directoryMember.update({
      where: { id: numericId },
      data: { status: "APPROVED" },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("approve POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
