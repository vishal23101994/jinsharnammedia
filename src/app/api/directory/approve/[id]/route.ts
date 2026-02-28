import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    const request = await prisma.directoryRequest.findUnique({
      where: { id: numericId },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate member
    const existingMember = await prisma.directoryMember.findUnique({
      where: { email: request.email },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    // Create APPROVED member
    await prisma.directoryMember.create({
      data: {
        name: request.name,
        email: request.email,
        phone: request.phone,
        address: request.address,
        organization: request.organization,
        position: request.position,
        zone: request.zone,
        state: request.state,
        branch: request.branch,
        gender: request.gender,
        dateOfBirth: request.dateOfBirth,
        dateOfMarriage: request.dateOfMarriage,
        imageUrl: request.imageUrl,
        status: "APPROVED",
      },
    });

    // Delete request after approval
    await prisma.directoryRequest.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error("approve POST error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}