import prisma from "@/lib/prisma";

export async function GET() {
  const updates = await prisma.latestUpdate.findMany({
    where: {
      published: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ ok: true, data: updates });
}
