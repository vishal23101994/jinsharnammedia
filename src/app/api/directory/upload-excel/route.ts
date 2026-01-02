import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

/* ---------------- DATE HELPERS ---------------- */

function excelSerialToDate(n: number) {
  if (typeof n !== "number" || isNaN(n)) return null;
  return new Date(Math.round((n - 25569) * 86400 * 1000));
}

function parseExcelDate(val: any) {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val.getTime())) return val;
  if (typeof val === "number") return excelSerialToDate(val);

  const s = String(val).trim();
  if (!s) return null;

  const parts = s.split(".");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map(Number);
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }

  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/* ---------------- HEADER NORMALIZATION ---------------- */

function normalizeHeader(h: any) {
  return String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/* ---------------- ROW MAPPING ---------------- */

function mapRow(row: Record<string, any>) {
  const get = (keys: string[]) =>
    keys.find((k) => row[k] != null && String(row[k]).trim() !== "")
      ? row[keys.find((k) => row[k] != null && String(row[k]).trim() !== "")!]
      : null;

  const name = get(["name", "full_name"]);
  if (!name) return null;

  let email = get(["email"]);
  if (!email) {
    email = `temp-${String(name).replace(/\s+/g, "_")}-${Date.now()}@local`;
  }

  return {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: get(["mobile", "phone"])?.toString() ?? null,
    organization: get(["organization"])?.toString() ?? null,
    position: get(["position"])?.toString() ?? null,
    zone: get(["zone"])?.toString() ?? null,
    state: get(["state"])?.toString() ?? null,
    branch: get(["branch"])?.toString() ?? null,
    address: get(["address"])?.toString() ?? null,
    dateOfBirth: parseExcelDate(get(["date_of_birth", "dob"])),
    dateOfMarriage: parseExcelDate(get(["date_of_marriage", "dom"])),
  };
}

/* ---------------- API ---------------- */

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // 👉 Read entire sheet as array
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: false,
      defval: null,
    });

    // 👉 Find header row dynamically
    const headerRowIndex = rows.findIndex((r) =>
      r.some((c) => normalizeHeader(c) === "name")
    );

    if (headerRowIndex === -1) {
      return NextResponse.json(
        { error: "Could not find header row with 'Name' column" },
        { status: 400 }
      );
    }

    const headers = rows[headerRowIndex].map(normalizeHeader);
    const dataRows = rows.slice(headerRowIndex + 1);

    let inserted = 0;
    const skipped: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const obj: Record<string, any> = {};
      headers.forEach((h, idx) => (obj[h] = dataRows[i][idx]));

      const member = mapRow(obj);
      if (!member) {
        skipped.push(`Row ${headerRowIndex + i + 2}: missing name`);
        continue;
      }

      await prisma.directoryMember.upsert({
        where: { email: member.email },
        update: { ...member, status: "APPROVED" },
        create: { ...member, status: "APPROVED" },
      });

      inserted++;
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
