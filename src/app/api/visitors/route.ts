import { NextResponse } from "next/server";

let visitorCount = 12000; // Starting fake visitors

export async function GET() {
  return NextResponse.json({ count: visitorCount });
}

export async function POST() {
  visitorCount += 1;

  return NextResponse.json({
    success: true,
    count: visitorCount,
  });
}