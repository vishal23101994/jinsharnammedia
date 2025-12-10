import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const member = await prisma.directoryMember.findUnique({
    where: { id: Number(params.id) },
  });

  return NextResponse.json(member);
}
