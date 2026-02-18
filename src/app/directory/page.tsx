"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

/* ================= TYPES ================= */
type Member = {
  zone?: string | null;
  state?: string | null;
  name?: string | null;
  position?: string | null;
  organization?: string | null;
  address?: string | null;
  branch?: string | null;
  mobile?: string | null;
  date_of_birth?: string | null;
  date_of_marriage?: string | null;
  email?: string | null;
};

type ColumnKey = keyof Member;

type SimpleMember = {
  "S.No"?: number | string;
  Name?: string;
  Designation?: string;
  Address?: string;
  Mob?: string;
};

/* ================= HELPERS ================= */
const formatDate = (d?: string | null) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-GB");
};

const highlight = (text: string, q: string) => {
  if (!q) return text;
  return text.replace(
    new RegExp(`(${q})`, "gi"),
    "<mark class='bg-[#FFE8A3] px-1 rounded'>$1</mark>"
  );
};

/* ================= COMPONENT ================= */
export default function DirectoryPage() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [simpleData, setSimpleData] = useState<Record<string, SimpleMember[]>>({});
  const [activeSheet, setActiveSheet] = useState<string>("");
  const [simpleLoading, setSimpleLoading] = useState(true);

  const exportSimpleExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.entries(simpleData).forEach(([sheetName, rows]) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, "Rashtriya_Karyakarini_List.xlsx");
  };

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    zone: "",
    state: "",
    branch: "",
    position: "",
    organization: "",
  });

  const [sortBy, setSortBy] = useState<ColumnKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const tableRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("/api/directory")
      .then((r) => r.json())
      .then((res) =>
        setData(
          res.map((m: any) => ({
            zone: m.zone,
            state: m.state,
            name: m.name,
            position: m.position,
            organization: m.organization,
            address: m.address,
            branch: m.branch,
            mobile: m.phone,
            date_of_birth: m.dateOfBirth,
            date_of_marriage: m.dateOfMarriage,
            email: m.email?.includes("@local") ? "" : m.email,
          }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/data/Rashtriye_Karyakarni_List.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });

        const allSheets: Record<string, SimpleMember[]> = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          allSheets[sheetName] = XLSX.utils.sheet_to_json<SimpleMember>(ws);
        });

        setSimpleData(allSheets);
        setActiveSheet(wb.SheetNames[0]); // default = first sheet
      })
      .finally(() => setSimpleLoading(false));
  }, []);


  /* ================= STICKY SHADOW ================= */
  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 5);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((m) => {
      for (const k in filters) {
        if ((filters as any)[k] && (m as any)[k] !== (filters as any)[k])
          return false;
      }
      return Object.values(m).join(" ").toLowerCase().includes(q);
    });
  }, [data, search, filters]);

  /* ================= SORT ================= */
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    return [...filtered].sort((a, b) => {
      const va = String(a[sortBy] ?? "");
      const vb = String(b[sortBy] ?? "");
      return sortDir === "asc"
        ? va.localeCompare(vb)
        : vb.localeCompare(va);
    });
  }, [filtered, sortBy, sortDir]);

  const toggleSort = (k: ColumnKey) => {
    if (sortBy === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(k);
      setSortDir("asc");
    }
  };

  /* ================= EXPORT ================= */
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      sorted.map((m, i) => ({
        "S.No": i + 1,
        Zone: m.zone,
        State: m.state,
        Name: m.name,
        Position: m.position,
        Organization: m.organization,
        Address: m.address,
        Branch: m.branch,
        Mobile: m.mobile,
        "Date of Birth": formatDate(m.date_of_birth),
        "Date of Marriage": formatDate(m.date_of_marriage),
        Email: m.email,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Directory");
    XLSX.writeFile(wb, "Jinsharnam_Directory.xlsx");
  };

  /* ================= UI ================= */
  return (
    <section className="min-h-screen bg-[#FBF5EE] px-6 py-10">
      <div className="max-w-[1500px] mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif text-[#6A0000]">
            Ekta Directory 2025
          </h1>
          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mt-3" />
        </div>

        {/* DOWNLOAD SECTION */}
        <div className="py-20 flex justify-center mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl">

            {/* CARD COMPONENT STYLE */}
            {[
              {
                title: "Ekta Directory – Gents (2025)",
                subtitle: "View & Download PDF",
                icon: "📄",
                href: "/directory/Ekta_Directory_Gents_2025.pdf",
                img: "/directory/ekta-gents.jpeg",
              },
              {
                title: "Ekta Directory – Ladies (2025)",
                subtitle: "View & Download PDF",
                icon: "📄",
                href: "/directory/Ekta_Directory_Ladies_2025.pdf",
                img: "/directory/ekta-ladies.jpeg",
              },
              {
                title: "Pulak Awards (2025)",
                subtitle: "Award Ceremony List",
                icon: "🏆",
                href: "/directory/Pulak Award-2025.pdf",
                img: "/directory/pulak-awards.png",
              },
              {
                title: "Manch Masiki (2025)",
                subtitle: "Monthly Magazine",
                icon: "📰",
                href: "/directory/Manch_Masiki-2025.pdf",
                img: "/directory/manch-masiki.jpeg",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                className="group bg-white rounded-3xl shadow-xl border border-[#E7D6BF] overflow-hidden transition duration-500 hover:-translate-y-3 hover:shadow-2xl"
              >
                {/* IMAGE */}
                <div className="flex justify-center bg-[#FBF5EE] p-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="
                      w-[220px]
                      h-auto
                      object-contain
                      rounded-xl
                      transition duration-500
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6 text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>

                  <h3 className="font-serif text-lg text-[#6A0000] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    {item.subtitle}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>


        {/* SECOND EXCEL TABLE */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl border border-[#E7D6BF]">
          {/* HEADER + EXPORT */}
          <div className="relative p-5 border-b border-[#E7D6BF]">
            <h2 className="text-2xl font-serif text-[#6A0000] text-center">
              Rashtriya Karyakarini List
            </h2>
            {/* SHEET TOGGLE */}
            <div className="flex justify-center gap-3 mt-4">
              {Object.keys(simpleData).map((sheet) => (
                <button
                  key={sheet}
                  onClick={() => setActiveSheet(sheet)}
                  className={`
                    px-5 py-2 rounded-full text-sm font-semibold transition
                    ${
                      activeSheet === sheet
                        ? "bg-[#6A0000] text-[#FFF1D6] shadow"
                        : "border border-[#D4AF37] text-[#6A0000] hover:bg-[#FFF1D6]"
                    }
                  `}
                >
                  {sheet}
                </button>
              ))}
            </div>

            <button
              onClick={exportSimpleExcel}
              className="absolute right-5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-[#6A0000] text-[#FFF1D6] font-semibold hover:bg-[#8B0000] transition"
            >
              Export Excel
            </button>
          </div>
          {/* SCROLL AREA */}
          <div className="max-h-[50vh] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-[#FAF3E8] z-10">
                <tr>
                  {["S.No", "Name", "Designation", "Address", "Mob"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider border border-[#E7D6BF]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {simpleLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  (simpleData[activeSheet] || []).map((row, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white even:bg-[#FBF7F2] hover:bg-[#FFF1D6]"
                    >
                      <td className="px-4 py-3 border border-[#E7D6BF]">
                        {row["S.No"]}
                      </td>
                      <td className="px-4 py-3 border border-[#E7D6BF]">
                        {row.Name}
                      </td>
                      <td className="px-4 py-3 border border-[#E7D6BF]">
                        {row.Designation}
                      </td>
                      <td className="px-4 py-3 border border-[#E7D6BF]">
                        {row.Address}
                      </td>
                      <td className="px-4 py-3 border border-[#E7D6BF]">
                        {row.Mob}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEARCH + RESET */}
        <div className="mt-16 bg-white p-5 rounded-2xl shadow border border-[#E7D6BF] mb-4">
          <div className="mb-4 text-center">
            <h2 className="text-xl md:text-2xl font-serif text-[#6A0000]">
              Ekta Directory
            </h2>
            <div className="w-20 h-[2px] bg-[#D4AF37] mx-auto mt-2" />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search members..."
              className="flex-1 min-w-[100px] px-2 py-2 rounded-full border border-[#E7D6BF] focus:ring-[#D4AF37]"
            />

            <button
              onClick={() => {
                setSearch("");
                setFilters({
                  zone: "",
                  state: "",
                  branch: "",
                  position: "",
                  organization: "",
                });
              }}
              className="px-5 py-2 rounded-full border border-[#D4AF37] text-[#6A0000] hover:bg-[#FFF1D6] transition"
            >
              Reset
            </button>
            {/* ACTION BAR */}
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={exportExcel}
                className="px-4 py-2 rounded-full bg-[#6A0000] text-[#FFF1D6] font-semibold hover:bg-[#8B0000] transition"
              >
                Export Excel
              </button>

              <a
                href="/directory/Ekta_Directory_Gents_2025.pdf"
                target="_blank"
                className="px-4 py-2 rounded-full border border-[#6A0000] text-[#6A0000] font-semibold hover:bg-[#FFF1D6] transition"
              >
                Gents PDF
              </a>

              <a
                href="/directory/Ekta_Directory_Ladies_2025.pdf"
                target="_blank"
                className="px-4 py-2 rounded-full border border-[#D4AF37] text-[#6A0000] font-semibold hover:bg-[#FFF1D6] transition"
              >
                Ladies PDF
              </a>
            </div>
          </div>

          {/* FILTERS BELOW */}
          <div className="flex flex-wrap gap-3 mt-4">
            {(["zone", "state", "branch", "position", "organization"] as const).map(
              (k) => (
                <select
                  key={k}
                  value={filters[k]}
                  onChange={(e) =>
                    setFilters({ ...filters, [k]: e.target.value })
                  }
                  className="px-4 py-2 rounded-full bg-[#FFF1D6] border border-[#E7D6BF] text-sm"
                >
                  <option value="">All {k}s</option>
                  {[...new Set(data.map((d) => d[k]).filter(Boolean))].map(
                    (v) => (
                      <option key={v}>{v}</option>
                    )
                  )}
                </select>
              )
            )}
          </div>
        </div>

        {/* TABLE */}
        <div
          ref={tableRef}
          className="hidden md:block bg-white rounded-2xl shadow-xl border border-[#E7D6BF] max-h-[70vh] overflow-y-auto"
        >
          <table className="w-full table-fixed text-sm border-collapse">
            <thead
              className={`sticky top-0 bg-[#FAF3E8] ${
                scrolled ? "shadow-md" : ""
              }`}
            >
              <tr>
                {[
                  ["zone", "6%"],
                  ["state", "8%"],
                  ["name", "10%"],
                  ["position", "9%"],
                  ["organization", "14%"],
                  ["address", "18%"],
                  ["branch", "7%"],
                  ["mobile", "8%"],
                  ["date_of_birth", "8%"],
                  ["date_of_marriage", "8%"],
                  ["email", "10%"],
                ].map(([k, w]) => (
                  <th
                    key={k}
                    style={{ width: w }}
                    onClick={() => toggleSort(k as ColumnKey)}
                    className="px-3 py-3 text-left text-xs tracking-wider uppercase border border-[#E7D6BF] cursor-pointer"
                  >
                    {k.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-6 text-center">
                    Loading…
                  </td>
                </tr>
              ) : (
                sorted.map((m, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-[#FBF7F2] hover:bg-[#FFF1D6] transition"
                  >
                    {([
                      m.zone,
                      m.state,
                      m.name,
                      m.position,
                      m.organization,
                      m.address,
                      m.branch,
                      m.mobile,
                      formatDate(m.date_of_birth),
                      formatDate(m.date_of_marriage),
                      m.email,
                    ] as (string | null | undefined)[]).map((v, idx) => (
                      <td
                        key={idx}
                        className={`px-3 py-3 border border-[#E7D6BF] ${
                          idx === 10 ? "break-all text-blue-700" : "break-words"
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: highlight(v ?? "", search),
                        }}
                      />
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4">
          {sorted.map((m, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl shadow border border-[#E7D6BF]"
            >
              <h3 className="font-semibold text-[#6A0000]">{m.name}</h3>
              <p className="text-sm">{m.position}</p>
              <p className="text-sm">{m.organization}</p>
              <p className="text-sm">{m.address}</p>
              <p className="text-sm">📞 {m.mobile}</p>
              <p className="text-sm break-all">📧 {m.email}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
