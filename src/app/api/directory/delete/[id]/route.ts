import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

export async function DELETE(req: Request, { params }: any) {
  try {
    const id = Number(params.id);
    const member = await prisma.directoryMember.findUnique({ where: { id } });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // delete image file if local
    if (member.imageUrl && member.imageUrl.startsWith("/uploaded-members/")) {
      const filepath = path.join(process.cwd(), "public", member.imageUrl.replace(/^\//, ""));
      await fs.unlink(filepath).catch(() => {});
    }

    await prisma.directoryMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
