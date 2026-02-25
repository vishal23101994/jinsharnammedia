import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingMember = await prisma.directoryMember.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingMember) {
      return NextResponse.json(
        { exists: true, message: "You are already registered." },
        { status: 409 }
      );
    }

    const existingRequest = await prisma.directoryRequest.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingRequest) {
      return NextResponse.json(
        { exists: true, message: "Your request is pending approval." },
        { status: 409 }
      );
    }

    return NextResponse.json({ exists: false });

  } catch (err) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}