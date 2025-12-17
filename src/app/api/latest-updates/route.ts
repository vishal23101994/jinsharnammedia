import { prisma } from "@/lib/prisma";

export async function GET() {
  const updates = await prisma.latestUpdate.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return Response.json({ ok: true, data: updates });
}

export async function POST(req: Request) {
  const body = await req.json();
  const update = await prisma.latestUpdate.create({ data: body });
  return Response.json({ ok: true, data: update });
}
