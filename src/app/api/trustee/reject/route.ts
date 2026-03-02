export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return errorPage("Invalid rejection link.");
    }

    const request = await prisma.trusteeRequest.findFirst({
      where: {
        approvalToken: token,
        approvalTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!request) {
      return errorPage("Rejection link expired or invalid.");
    }

    // Option 1: Delete request completely
    await prisma.trusteeRequest.delete({
      where: { id: request.id },
    });

    return successPage();

  } catch (error) {
    console.error("Trustee rejection error:", error);
    return errorPage("Server error occurred.");
  }
}

function successPage() {
  return new Response(
    `
    <html>
      <head>
        <title>Trustee Rejected</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="
        margin:0;
        font-family:Arial, sans-serif;
        background:linear-gradient(135deg,#FFE5E5,#FFD6D6);
        display:flex;
        align-items:center;
        justify-content:center;
        height:100vh;
      ">
        <div style="
          background:white;
          padding:50px 40px;
          border-radius:18px;
          box-shadow:0 20px 50px rgba(0,0,0,0.12);
          text-align:center;
          max-width:500px;
          width:90%;
        ">
          <div style="
            width:90px;
            height:90px;
            background:#C81E1E;
            border-radius:50%;
            margin:0 auto 25px auto;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z"/>
            </svg>
          </div>

          <h2 style="color:#C81E1E; margin-bottom:12px;">
            Trustee Rejected Successfully
          </h2>

          <p style="color:#555; margin-bottom:30px;">
            The trustee registration has been rejected.
          </p>

          <a href="${process.env.NEXTAUTH_URL}"
             style="
               display:inline-block;
               background:#6A0000;
               color:white;
               padding:12px 26px;
               text-decoration:none;
               border-radius:8px;
               font-weight:bold;
             ">
             Go to Website
          </a>
        </div>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}

function errorPage(message: string) {
  return new Response(
    `
    <html>
      <head>
        <title>Rejection Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body style="
        margin:0;
        font-family:Arial, sans-serif;
        background:linear-gradient(135deg,#FFE5E5,#FFD6D6);
        display:flex;
        align-items:center;
        justify-content:center;
        height:100vh;
      ">
        <div style="
          background:white;
          padding:50px 40px;
          border-radius:18px;
          box-shadow:0 20px 50px rgba(0,0,0,0.12);
          text-align:center;
          max-width:500px;
          width:90%;
        ">
          <h2 style="color:#C81E1E; margin-bottom:12px;">
            Rejection Failed
          </h2>

          <p style="color:#555; margin-bottom:30px;">
            ${message}
          </p>

          <a href="${process.env.NEXTAUTH_URL}"
             style="
               display:inline-block;
               background:#C81E1E;
               color:white;
               padding:12px 26px;
               text-decoration:none;
               border-radius:8px;
               font-weight:bold;
             ">
             Go to Website
          </a>
        </div>
      </body>
    </html>
    `,
    { headers: { "Content-Type": "text/html" } }
  );
}