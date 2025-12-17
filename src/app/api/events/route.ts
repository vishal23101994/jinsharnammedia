import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    where: {
      published: true,
      eventDate: { gte: new Date() },
    },
    orderBy: { eventDate: "asc" },
    take: 6,
  });

  return Response.json({ ok: true, data: events });
}

export async function POST(req: Request) {
  const body = await req.json();
  const event = await prisma.event.create({ data: body });
  return Response.json({ ok: true, data: event });
}
