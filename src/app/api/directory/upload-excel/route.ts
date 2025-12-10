import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

/**
 * Convert excel serial to JS Date
 * Excel epoch: 1900-01-01 with Excel incorrectly treating 1900 as leap year;
 * using standard offset 25569 works for most sheets.
 */
function excelSerialToDate(n: number) {
  if (typeof n !== "number" || isNaN(n)) return null;
  const ms = Math.round((n - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return isNaN(d.getTime()) ? null : d;
}

/** parse DMY string like "31.12.2020" or JS Date or Excel serial */
function parseExcelDate(val: any) {
  if (val == null) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  if (typeof val === "number") return excelSerialToDate(val);
  const s = String(val).trim();
  if (!s) return null;
  const parts = s.split(".");
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
      return new Date(yyyy, mm - 1, dd);
    }
  }
  // fallback: try ISO / other parseable strings
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

/** Normalize header names once for the sheet */
function normalizeHeader(h: any) {
  if (!h && h !== 0) return "";
  return String(h).trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

/** Map normalized row to DB fields */
function mapRowToMember(rowNormalized: Record<string, any>) {
  const get = (aliases: string[]) => {
    for (const a of aliases) {
      if (rowNormalized[a] !== undefined && rowNormalized[a] !== null && String(rowNormalized[a]).trim() !== "")
        return rowNormalized[a];
    }
    return null;
  };

  const name = get(["name", "full_name", "fullname"]);
  const phoneRaw = get(["mobile", "mobile_no", "mobile_number", "phone", "contact"]);
  const emailRaw = get(["email", "e-mail"]);
  const org = get(["organization", "org", "company"]);
  const position = get(["position", "designation"]);
  const address = get(["address", "addr"]);
  const state = get(["state"]);
  const branch = get(["branch"]);
  const gender = get(["gender", "sex"]);
  const dobRaw = get(["dob", "date_of_birth", "dateofbirth", "date"]);
  const domRaw = get(["dom", "date_of_marriage", "dateofmarriage"]);

  const dob = parseExcelDate(dobRaw);
  const dom = parseExcelDate(domRaw);

  const phone = phoneRaw ? String(phoneRaw).trim() : null;
  let email = emailRaw ? String(emailRaw).trim() : null;

  // If email missing, generate unique temp email (avoid collisions)
  if (!email) {
    const safeName = (name || "no_name").toString().replace(/\s+/g, "_").slice(0, 40);
    email = `temp-${safeName}-${Date.now()}@local`;
  }

  return {
    name: name ? String(name).trim() : null,
    phone,
    email,
    organization: org ? String(org).trim() : null,
    position: position ? String(position).trim() : null,
    address: address ? String(address).trim() : null,
    state: state ? String(state).trim() : null,
    branch: branch ? String(branch).trim() : null,
    gender: gender ? String(gender).trim() : null,
    dateOfBirth: dob,
    dateOfMarriage: dom,
  };
}

export async function POST(req: Request) {
  try {
    // TODO: Add admin auth check here (e.g., next-auth session check). DO NOT expose to public.
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    // Use cellDates:true to help parse date cells as JS dates when possible
    const workbook = XLSX.read(buffer, { cellDates: true, raw: false });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

    let inserted = 0;
    const skipped: string[] = [];
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      try {
        const r = rawRows[i];

        // Normalize keys once per row
        const normalized: Record<string, any> = {};
        Object.entries(r).forEach(([k, v]) => {
          normalized[normalizeHeader(k)] = v;
        });

        const member = mapRowToMember(normalized);

        // Skip rows without a meaningful name
        if (!member.name) {
          skipped.push(`Row ${i + 2}: missing name`);
          continue;
        }

        // Upsert by email (make sure email field has unique constraint in Prisma schema)
        await prisma.directoryMember.upsert({
          where: { email: member.email },
          update: {
            name: member.name,
            phone: member.phone ?? undefined,
            address: member.address ?? undefined,
            organization: member.organization ?? undefined,
            position: member.position ?? undefined,
            state: member.state ?? undefined,
            branch: member.branch ?? undefined,
            gender: member.gender ?? undefined,
            dateOfBirth: member.dateOfBirth ?? undefined,
            dateOfMarriage: member.dateOfMarriage ?? undefined,
            status: "APPROVED",
          },
          create: {
            name: member.name,
            email: member.email,
            phone: member.phone,
            address: member.address,
            organization: member.organization,
            position: member.position,
            state: member.state,
            branch: member.branch,
            gender: member.gender,
            dateOfBirth: member.dateOfBirth,
            dateOfMarriage: member.dateOfMarriage,
            status: "APPROVED",
          },
        });

        inserted++;
      } catch (rowErr: any) {
        errors.push({ row: i + 2, message: rowErr?.message || String(rowErr) });
      }
    }

    return NextResponse.json({ success: true, inserted, skipped, errors });
  } catch (err: any) {
    console.error("upload-excel POST error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
