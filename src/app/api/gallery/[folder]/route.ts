import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  context: { params: Promise<{ folder: string }> }
) {
  try {
    const { folder } = await context.params; // 🔥 IMPORTANT FIX

    const directoryPath = path.join(
      process.cwd(),
      "public/images/gallery",
      folder
    );

    if (!fs.existsSync(directoryPath)) {
      return NextResponse.json(
        { error: "Folder not found" },
        { status: 404 }
      );
    }

    const files = fs.readdirSync(directoryPath);

    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    const imagePaths = imageFiles.map(
      (file) => `/images/gallery/${folder}/${file}`
    );

    return NextResponse.json(imagePaths);

  } catch (error) {
    console.error("Gallery API Error:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}