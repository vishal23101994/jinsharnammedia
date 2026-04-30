import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://pulaksagar.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET() {
  try {
    const live = await prisma.pulakSagarLiveUpdate.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(live, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Pulak Sagar Live API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch live data" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}