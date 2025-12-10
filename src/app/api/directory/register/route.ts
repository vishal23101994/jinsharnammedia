import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";

function parseDMY(val?: string | null) {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;
  // dd.mm.yyyy
  const parts = s.split(".");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }
  // fallback to Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = form.get("name")?.toString() || "";
    const emailRaw = form.get("email")?.toString()?.trim();
    const phone = form.get("phone")?.toString()?.trim() || null;
    const address = form.get("address")?.toString() || null;
    const organization = form.get("organization")?.toString() || null;
    const position = form.get("position")?.toString() || null;
    const state = form.get("state")?.toString() || null;
    const branch = form.get("branch")?.toString() || null;
    const gender = form.get("gender")?.toString() || null;
    const dob = parseDMY(form.get("dateOfBirth")?.toString() || null);
    const dom = parseDMY(form.get("dateOfMarriage")?.toString() || null);

    // if email empty create deterministic fallback (unique)
    const email = emailRaw && emailRaw.length > 0 ? emailRaw : `temp-${name.replace(/\s+/g, "_")}-${phone || "na"}@local`;

    const created = await prisma.directoryMember.create({
      data: {
        name,
        email,
        phone,
        address,
        organization,
        position,
        state,
        branch,
        gender,
        dateOfBirth: dob,
        dateOfMarriage: dom,
        status: "PENDING",
      },
    });

    // handle photo
    const photo = form.get("photo") as File | null;
    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
      const uploadsDir = path.join(process.cwd(), "public", "uploaded-members");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `member-${created.id}.${ext}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.writeFile(filepath, buffer);
      await prisma.directoryMember.update({
        where: { id: created.id },
        data: { imageUrl: `/uploaded-members/${filename}` },
      });
    }

    return NextResponse.json({ success: true, id: created.id });
  } catch (err: any) {
    console.error("register POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
