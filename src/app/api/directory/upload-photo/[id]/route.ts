import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // required by Next.js 15
    const numericId = Number(id);

    // Parse the incoming form data (if you're uploading via FormData)
    const formData = await req.formData();
    const imageUrl = formData.get("imageUrl") as string | null;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No imageUrl provided" },
        { status: 400 }
      );
    }

    const updated = await prisma.directoryMember.update({
      where: { id: numericId },
      data: { imageUrl },
    });

    return NextResponse.json({ success: true, imageUrl: updated.imageUrl });
  } catch (err: any) {
    console.error("upload-photo POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
