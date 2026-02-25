import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { sendAdminNotification } from "@/lib/mailer";

function parseDMY(val?: string | null) {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;

  const parts = s.split(".");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }

  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name")?.toString() || "";
    const emailRaw = form.get("email")?.toString()?.trim() || "";
    const phone = form.get("phone")?.toString()?.trim() || null;
    const address = form.get("address")?.toString() || null;
    const organization = form.get("organization")?.toString() || null;
    const position = form.get("position")?.toString() || null;
    const zone = form.get("zone")?.toString() || null;
    const state = form.get("state")?.toString() || null;
    const branch = form.get("branch")?.toString() || null;
    const gender = form.get("gender")?.toString() || null;

    const dob = parseDMY(form.get("dateOfBirth")?.toString() || null);
    const dom = parseDMY(form.get("dateOfMarriage")?.toString() || null);

    // Normalize email
    const email = emailRaw.toLowerCase();

    /* ================= DUPLICATE CHECK ================= */

    const existingMember = await prisma.directoryMember.findUnique({
      where: { email },
    });

    if (existingMember) {
      return NextResponse.json(
        { message: "You are already registered." },
        { status: 409 }
      );
    }

    const existingRequest = await prisma.directoryRequest.findUnique({
      where: { email },
    });

    if (existingRequest) {
      return NextResponse.json(
        { message: "Your request is already pending for approval." },
        { status: 409 }
      );
    }

    /* ================= PHOTO UPLOAD ================= */

    let imageUrl: string | null = null;

    const photo = form.get("photo") as File | null;

    if (photo && photo.size > 0) {
      const buffer = Buffer.from(await photo.arrayBuffer());
      const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();

      const uploadsDir = path.join(
        process.cwd(),
        "public/uploads/pulak-manch"
      );

      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${photo.name.replace(/\s+/g, "_")}`;
      const filepath = path.join(uploadsDir, filename);

      await fs.writeFile(filepath, buffer);

      imageUrl = `/uploads/pulak-manch/${filename}`;
    }

    /* ================= CREATE REQUEST ================= */

    const created = await prisma.directoryRequest.create({
      data: {
        name,
        email,
        phone,
        address,
        organization,
        position,
        zone,
        state,
        branch,
        gender,
        dateOfBirth: dob,
        dateOfMarriage: dom,
        imageUrl,
        status: "PENDING",
      },
    });

    /* ================= SEND EMAIL (SAFE) ================= */

    sendAdminNotification({
      type: "OFFLINE",
      name,
      email,
      phone,
      organization,
      position,
    }).catch((err) =>
      console.error("Email failed but request saved:", err)
    );

    return NextResponse.json({ success: true, id: created.id });

  } catch (err: any) {
    console.error("Offline register error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}