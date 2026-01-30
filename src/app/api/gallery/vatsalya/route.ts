import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dirPath = path.join(
    process.cwd(),
    "public/images/gallery/vatsalya"
  );

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

  return NextResponse.json(
    files.map((file) => `/images/vatsalya/images/${file}`)
  );
}
