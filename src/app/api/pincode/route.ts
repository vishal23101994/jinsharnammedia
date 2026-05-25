import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const pin =
      new URL(req.url)
      .searchParams
      .get("pin");

    if (!pin) {
      return NextResponse.json(
        {},
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.zippopotam.us/IN/${pin}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        {},
        { status: 404 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      city: data.places?.[0]?.["place name"],
      state: data.places?.[0]?.state,
    });

  } catch {
    return NextResponse.json(
      {},
      { status: 500 }
    );
  }
}