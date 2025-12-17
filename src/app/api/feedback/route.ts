import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "feedback-store.json");

// helper: read file (returns array)
async function readStore(): Promise<any[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    // file may not exist yet
    return [];
  }
}

// helper: write file
async function writeStore(arr: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), "utf8");
}

export async function GET() {
  try {
    const all = await readStore();
    // return newest first
    return NextResponse.json({ ok: true, data: all.slice().reverse() }, { status: 200 });
  } catch (err) {
    console.error("GET /api/feedback error:", err);
    return NextResponse.json({ ok: false, msg: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      image,        // 👈 NEW
      message,
      rating,
      page,
    } = body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { ok: false, msg: "Message is required." },
        { status: 400 }
      );
    }

    const entry = {
      id: Date.now().toString(36) + "-" + Math.floor(Math.random() * 10000),
      name: name?.trim() || null,
      image: image || null,      // 👈 SAVE IMAGE
      message: message.trim(),
      rating: typeof rating === "number" ? Number(rating) : null,
      page: page || null,
      createdAt: new Date().toISOString(),
    };

    const all = await readStore();
    all.push(entry);
    await writeStore(all);

    return NextResponse.json({ ok: true, data: entry }, { status: 200 });
  } catch (err) {
    console.error("POST /api/feedback error:", err);
    return NextResponse.json(
      { ok: false, msg: "Server error" },
      { status: 500 }
    );
  }
}

