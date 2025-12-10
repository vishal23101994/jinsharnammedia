import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // params is a Promise now
    const numericId = Number(id);

    const updated = await prisma.directoryMember.update({
      where: { id: numericId },
      data: { status: "REJECTED" }, // or whatever status you use
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("reject POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
