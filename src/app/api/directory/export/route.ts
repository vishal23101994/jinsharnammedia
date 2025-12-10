import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const members = await prisma.directoryMember.findMany();
    const rows = members.map(m => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      organization: m.organization,
      position: m.position,
      state: m.state,
      branch: m.branch,
      gender: m.gender,
      dateOfBirth: m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString("en-IN").replace(/\//g,".") : "",
      dateOfMarriage: m.dateOfMarriage ? new Date(m.dateOfMarriage).toLocaleDateString("en-IN").replace(/\//g,".") : "",
      imageUrl: m.imageUrl || ""
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="directory-export.xlsx"`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
