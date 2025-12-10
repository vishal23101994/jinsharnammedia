import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const form = await req.formData();
    const file = form.get("photo") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const uploadsDir = path.join(process.cwd(), "public", "uploaded-members");
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `member-${id}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    const imageUrl = `/uploaded-members/${filename}`;
    await prisma.directoryMember.update({
      where: { id },
      data: { imageUrl },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (err: any) {
    console.error("upload-photo POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
