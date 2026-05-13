import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "http://localhost:3000",
  "https://pulaksagar.com",
  "https://jinsharnamtirth.com",
];

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin":
      origin && allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[1],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin");

  try {
    const live = await prisma.pulakSagarLiveUpdate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(live, {
      headers: getCorsHeaders(origin),
    });
  } catch (error) {
    console.error("Pulak Sagar Live API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch live data" },
      {
        status: 500,
        headers: getCorsHeaders(origin),
      }
    );
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");

  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}