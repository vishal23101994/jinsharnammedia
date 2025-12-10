import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const updated = await prisma.directoryMember.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("approve POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
