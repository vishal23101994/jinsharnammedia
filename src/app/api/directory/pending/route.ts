import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const requests = await prisma.directoryRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (err: any) {
    console.error("pending GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}