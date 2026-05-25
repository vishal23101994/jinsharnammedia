import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const pin =
      new URL(req.url)
        .searchParams
        .get("pin");

    if (
      !pin ||
      !/^\d{6}$/.test(pin)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pincode",
        },
        {
          status: 400,
        }
      );
    }

    const response =
      await fetch(
        `https://api.postalpincode.in/pincode/${pin}`,
        {
          cache: "no-store",
          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const text =
      await response.text();

    let data;

    try {
      data =
        JSON.parse(
          text
        );
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid response",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !data?.[0] ||
      data[0].Status !==
        "Success"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pincode not found",
        },
        {
          status: 404,
        }
      );
    }

    const office =
      data[0]
        .PostOffice?.[0];

    let state =
      office.State ||
      "";

    if (
      state
        .toLowerCase()
        .includes(
          "new delhi"
        )
    ) {
      state =
        "Delhi";
    }

    return NextResponse.json({
      success: true,
      city:
        office.District ||
        "",
      state,
    });

  } catch (
    err: any
  ) {

    console.error(
      "PIN API:",
      err
    );

    return NextResponse.json(
      {
        success: false,
        message:
          err.message,
      },
      {
        status: 500,
      }
    );
  }
}