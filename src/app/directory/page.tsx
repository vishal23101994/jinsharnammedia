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
            Jinsharnam Directory
          </h1>
          <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto mt-3" />
        </div>

        {/* SEARCH + RESET */}
        <div className="bg-white p-5 rounded-2xl shadow border border-[#E7D6BF] mb-4">
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
            <div className="flex justify-end mb-4">
              <button
                onClick={exportExcel}
                className="px-3 py-2 rounded-full bg-[#6A0000] text-[#FFF1D6] font-semibold hover:bg-[#8B0000] transition"
              >
                Export Excel
              </button>
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
