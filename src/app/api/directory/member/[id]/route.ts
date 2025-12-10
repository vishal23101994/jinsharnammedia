import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // params is now a Promise
    const numericId = Number(id);

    const member = await prisma.directoryMember.findUnique({
      where: { id: numericId },
    });

    return NextResponse.json(member);
  } catch (err: any) {
    console.error("GET member error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
