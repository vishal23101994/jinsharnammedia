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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FFF4DF] to-[#FBEBD2] px-4 md:px-6 py-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-5 bg-cover bg-center pointer-events-none" />

      <div className="relative max-w-[1600px] mx-auto z-10">
        {/* HERO HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-serif text-[#6A0000]">
            Ekta Directory 2025
          </h1>
          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-[#7A4A00] max-w-2xl mx-auto text-lg">
            Search, filter and explore the official Ekta Directory database of Jinsharnam.
          </p>
        </div>

        {/* SEARCH / FILTER PANEL */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[#E7D6BF] shadow-[0_20px_50px_rgba(106,0,0,0.08)] p-6 mb-8">
          <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
            {/* Search */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search members by name, organization, address..."
              className="flex-1 px-5 py-3 rounded-2xl border border-[#E7D6BF] bg-[#FFFDF8] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
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
                className="px-5 py-3 rounded-2xl border border-[#D4AF37] text-[#6A0000] font-medium hover:bg-[#FFF1D6] transition"
              >
                Reset Filters
              </button>

              <button
                onClick={exportExcel}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#6A0000] to-[#8B0000] text-white font-semibold shadow hover:scale-105 transition"
              >
                Export Excel
              </button>

              <a
                href="/directory/Ekta_Directory_Gents_2025.pdf"
                target="_blank"
                className="px-5 py-3 rounded-2xl border border-[#6A0000] text-[#6A0000] font-semibold hover:bg-[#FFF1D6]"
              >
                Gents PDF
              </a>

              <a
                href="/directory/Ekta_Directory_Ladies_2025.pdf"
                target="_blank"
                className="px-5 py-3 rounded-2xl border border-[#D4AF37] text-[#6A0000] font-semibold hover:bg-[#FFF1D6]"
              >
                Ladies PDF
              </a>
            </div>
          </div>

          {/* FILTERS */}
          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-3 mt-5">
            {(["zone", "state", "branch", "position", "organization"] as const).map(
              (k) => (
                <select
                  key={k}
                  value={filters[k]}
                  onChange={(e) =>
                    setFilters({ ...filters, [k]: e.target.value })
                  }
                  className="px-4 py-3 rounded-2xl bg-[#FFF8E8] border border-[#E7D6BF] text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  <option value="">All {k}s</option>
                  {[...new Set(data.map((d) => d[k]).filter(Boolean))].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              )
            )}
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div
          ref={tableRef}
          className="hidden md:block rounded-3xl overflow-hidden border border-[#E7D6BF] bg-white shadow-[0_20px_50px_rgba(106,0,0,0.08)] max-h-[75vh] overflow-y-auto"
        >
          <table className="w-full table-fixed text-sm border-collapse">
            <thead
              className={`sticky top-0 bg-gradient-to-r from-[#FAF3E8] to-[#FFF8EE] z-20 ${
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
                    className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold border border-[#E7D6BF] cursor-pointer text-[#6A0000] hover:bg-[#FFF1D6]"
                  >
                    {k.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-10 text-center text-[#6A0000]">
                    Loading Directory...
                  </td>
                </tr>
              ) : (
                sorted.map((m, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-[#FBF7F2] hover:bg-[#FFF1D6] transition"
                  >
                    {[
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
                    ].map((v, idx) => (
                      <td
                        key={idx}
                        className={`px-4 py-4 border border-[#E7D6BF] ${
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

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">
          {sorted.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-[#E7D6BF] shadow-md"
            >
              <h3 className="text-lg font-semibold text-[#6A0000]">{m.name}</h3>
              <p className="text-sm mt-1">{m.position}</p>
              <p className="text-sm">{m.organization}</p>
              <p className="text-sm mt-2 text-gray-600">{m.address}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p>📞 {m.mobile}</p>
                <p className="break-all">📧 {m.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
