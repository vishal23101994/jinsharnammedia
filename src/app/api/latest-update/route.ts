import { prisma } from "@/lib/prisma";

export async function GET() {
  const updates = await prisma.latestUpdate.findMany({
    where: {
      published: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return new Response(
    JSON.stringify({ ok: true, data: updates }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}

/* Handle preflight (important for some browsers) */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}