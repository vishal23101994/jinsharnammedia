import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/directory
 * Returns all directory members or filtered by `q` (search query)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const members = await prisma.directoryMember.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { organization: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
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

/**
 * POST /api/directory
 * Creates a new directory member
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const newMember = await prisma.directoryMember.create({
      data: {
        name: data.name,
        organization: data.organization,
        address: data.address,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        dateOfMarriage: data.dateOfMarriage ? new Date(data.dateOfMarriage) : null,
        email: data.email,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating directory member:", error);
    return NextResponse.json(
      { error: "Failed to create member" },
      { status: 500 }
    );
  }
}
