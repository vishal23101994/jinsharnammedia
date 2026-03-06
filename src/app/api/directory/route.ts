import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------------- CORS HEADERS ---------------- */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/* ---------------- OPTIONS HANDLER ---------------- */

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * GET /api/directory
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  try {
    const members = await prisma.directoryMember.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { organization: { contains: q, mode: "insensitive" } },
              { address: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { zone: { contains: q, mode: "insensitive" } },
              { state: { contains: q, mode: "insensitive" } },
              { branch: { contains: q, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
    });

    return new Response(JSON.stringify(members), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Error fetching directory members:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch directory members" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
}