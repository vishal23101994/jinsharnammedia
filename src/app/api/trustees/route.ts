import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/data/New_Book.xlsx");
    const fileBuffer = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const trustees = rows.map((row) => ({
      NAME: row.Name || "-",
      DESIGNATION: row.Designation || "-",
      ADDRESS: row.Address || "-",     // ✅ direct from Excel
      MOBILE: row.Mob ? row.Mob.toString() : "-", // ✅ full mobile text
    }));

    return NextResponse.json(trustees);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load trustees" },
      { status: 500 }
    );
  }
}
