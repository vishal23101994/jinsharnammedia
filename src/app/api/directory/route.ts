import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/directory
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const members = await prisma.directoryMember.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { organization: { contains: q, mode: "insensitive" } },
              { address: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { zone: { contains: q, mode: "insensitive" } }, // ✅ ADDED
              { state: { contains: q, mode: "insensitive" } },
              { branch: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching directory members:", error);
    return NextResponse.json(
      { error: "Failed to fetch directory members" },
      { status: 500 }
    );
  }
}
