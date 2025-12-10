import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "50");
    const where: any = {};

    // optional filters
    const state = url.searchParams.get("state");
    const branch = url.searchParams.get("branch");
    const position = url.searchParams.get("position");
    const gender = url.searchParams.get("gender");
    const status = url.searchParams.get("status");
    const q = url.searchParams.get("q");

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
  } catch (err: any) {
    console.error("all GET error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
