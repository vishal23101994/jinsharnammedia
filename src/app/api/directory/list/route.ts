import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "50", 10);
    const state = url.searchParams.get("state") || undefined;
    const branch = url.searchParams.get("branch") || undefined;
    const position = url.searchParams.get("position") || undefined;
    const gender = url.searchParams.get("gender") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const q = url.searchParams.get("q") || undefined;

    const where: any = {};
    if (state) where.state = state;
    if (branch) where.branch = branch;
    if (position) where.position = position;
    if (gender) where.gender = gender;
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q } },
      ];
    }

    const total = await prisma.directoryMember.count({ where });
    const members = await prisma.directoryMember.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ total, page, pageSize, members });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
