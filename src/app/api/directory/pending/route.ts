import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const members = await prisma.directoryMember.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(members);
  } catch (err: any) {
    console.error("pending GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
