import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  return NextResponse.json(await prisma.latestUpdate.findMany());
}

export async function POST(req: Request) {
  const f = await req.formData();
  const file = f.get("image") as File;
  let imageUrl = null;

  if (file) {
    const buf = Buffer.from(await file.arrayBuffer());
    const name = Date.now() + "-" + file.name;
    await fs.writeFile(path.join(process.cwd(), "public/uploads", name), buf);
    imageUrl = `/uploads/${name}`;
  }

  return NextResponse.json(
    await prisma.latestUpdate.create({
      data: {
        title: f.get("title") as string,
        content: f.get("content") as string,
        imageUrl,
      },
    })
  );
}
