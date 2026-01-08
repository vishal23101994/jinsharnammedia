import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: any, { params }: any) {
  return NextResponse.json(await prisma.latestUpdate.findUnique({ where: { id: params.id } }));
}

export async function PATCH(req: Request, { params }: any) {
  const body = await req.json();
  return NextResponse.json(
    await prisma.latestUpdate.update({ where: { id: params.id }, data: body })
  );
}

export async function DELETE(_: any, { params }: any) {
  await prisma.latestUpdate.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
