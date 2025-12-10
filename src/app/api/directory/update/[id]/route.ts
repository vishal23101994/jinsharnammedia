import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function safeDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    const updated = await prisma.directoryMember.update({
      where: { id },
      data: {
        name: body.name ?? undefined,
        email: body.email ?? undefined,
        phone: body.phone ?? undefined,
        address: body.address ?? undefined,
        organization: body.organization ?? undefined,
        position: body.position ?? undefined,
        state: body.state ?? undefined,
        branch: body.branch ?? undefined,
        gender: body.gender ?? undefined,
        dateOfBirth: body.dateOfBirth ? safeDate(body.dateOfBirth) : undefined,
        dateOfMarriage: body.dateOfMarriage ? safeDate(body.dateOfMarriage) : undefined,
        imageUrl: body.imageUrl ?? undefined,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    console.error("update PATCH error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
