"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  id?: string;
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
  [k: string]: any;
};

type SortKey =
  | "state"
  | "name"
  | "position"
  | "organization"
  | "address"
  | "branch"
  | "mobile"
  | "date_of_birth"
  | "date_of_marriage"
  | "email";

// Escape special regex chars from user text
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Highlight occurrences of query in text with <mark>
function highlight(text: string, query: string) {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;

  const pattern = escapeRegExp(q);
  const regex = new RegExp(`(${pattern})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export default function DirectoryPage() {
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterOrganization, setFilterOrganization] = useState("");

  // sorting
  const [sortBy, setSortBy] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const urls = ["/api/directory/approved", "/api/directory"];
        let respData: any = null;
        for (const u of urls) {
          try {
            const r = await fetch(u);
            if (!r.ok) continue;
            respData = await r.json();
            break;
          } catch {
            /* try next */
          }
        }
        const arr: Member[] = Array.isArray(respData)
          ? respData
          : respData?.data ?? [];
        const normalized = arr.map((m) => ({
          id: m.id ?? m.ID ?? undefined,
          state: m.state ?? m.State ?? m.location ?? null,
          name: m.name ?? m.Name ?? null,
          position: m.position ?? m.Position ?? null,
          organization: m.organization ?? m.Organization ?? m.org ?? null,
          address: m.address ?? m.Address ?? null,
          branch: m.branch ?? m.Branch ?? null,
          mobile: m.mobile ?? m.Mobile ?? m.phone ?? m.Phone ?? null,
          date_of_birth: m.dateOfBirth ?? m.date_of_birth ?? m.dob ?? null,
          date_of_marriage:
            m.dateOfMarriage ?? m.date_of_marriage ?? m.dom ?? null,
          // sanitize temp / placeholder emails
          email: (() => {
            const e = m.email ?? m.Email ?? null;
            if (!e) return null;
            const es = String(e).trim();
            if (!es) return null;
            // treat temp / @local addresses as "no email"
            if (
              es.toLowerCase().startsWith("temp") ||
              es.toLowerCase().includes("@local")
            ) {
              return null;
            }
            return es;
          })(),
        }));
        setAllMembers(normalized);
      } catch (err) {
        console.error(err);
        setAllMembers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (d?: string | null) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-GB").replace(/\//g, ".");
  };

  const stateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          allMembers
            .map((m) => m.state)
            .filter((s): s is string => Boolean(s))
        )
      ).sort(),
    [allMembers]
  );

  const branchOptions = useMemo(() => {
    const src = filterState
      ? allMembers.filter((m) => m.state === filterState)
      : allMembers;
    return Array.from(
      new Set(
        src
          .map((m) => m.branch)
          .filter((b): b is string => Boolean(b))
      )
    ).sort();
  }, [allMembers, filterState]);

  const positionOptions = useMemo(() => {
    let src = allMembers;
    if (filterState) src = src.filter((m) => m.state === filterState);
    if (filterBranch) src = src.filter((m) => m.branch === filterBranch);
    return Array.from(
      new Set(
        src
          .map((m) => m.position)
          .filter((p): p is string => Boolean(p))
      )
    ).sort();
  }, [allMembers, filterState, filterBranch]);

  const organizationOptions = useMemo(() => {
    let src = allMembers;
    if (filterState) src = src.filter((m) => m.state === filterState);
    if (filterBranch) src = src.filter((m) => m.branch === filterBranch);
    if (filterPosition) src = src.filter((m) => m.position === filterPosition);
    return Array.from(
      new Set(
        src
          .map((m) => m.organization)
          .filter((o): o is string => Boolean(o))
      )
    ).sort();
  }, [allMembers, filterState, filterBranch, filterPosition]);

  useEffect(() => {
    if (filterBranch && !branchOptions.includes(filterBranch))
      setFilterBranch("");
    if (filterPosition && !positionOptions.includes(filterPosition))
      setFilterPosition("");
    if (
      filterOrganization &&
      !organizationOptions.includes(filterOrganization)
    )
      setFilterOrganization("");
  }, [filterState, branchOptions, positionOptions, organizationOptions]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allMembers.filter((m) => {
      if (filterState && m.state !== filterState) return false;
      if (filterBranch && m.branch !== filterBranch) return false;
      if (filterPosition && m.position !== filterPosition) return false;
      if (filterOrganization && m.organization !== filterOrganization)
        return false;
      if (!q) return true;
      return (
        String(m.name || "").toLowerCase().includes(q) ||
        String(m.mobile || "").toLowerCase().includes(q) ||
        String(m.email || "").toLowerCase().includes(q) ||
        String(m.organization || "").toLowerCase().includes(q) ||
        String(m.address || "").toLowerCase().includes(q)
      );
    });
  }, [
    allMembers,
    searchQuery,
    filterState,
    filterBranch,
    filterPosition,
    filterOrganization,
  ]);

  // sorting helper
  function parseSortable(value: any, key: SortKey) {
    if (value === undefined || value === null) return "";
    if ((key === "date_of_birth" || key === "date_of_marriage") && value) {
      const d = new Date(value);
      return isNaN(d.getTime()) ? String(value) : d.getTime();
    }
    if (key === "mobile") {
      // remove non-digit and parse number for numeric sort
      const num = String(value).replace(/\D+/g, "");
      return num ? Number(num) : 0;
    }
    // strings: lowercase for case-insensitive
    return String(value).toLowerCase();
  }

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = parseSortable((a as any)[sortBy], sortBy);
      const vb = parseSortable((b as any)[sortBy], sortBy);

      if (va === vb) return 0;
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      // fallback to string compare
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterState("");
    setFilterBranch("");
    setFilterPosition("");
    setFilterOrganization("");
    // also reset sorting
    setSortBy(null);
    setSortDir("asc");
  };

  function toggleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function sortIcon(key: SortKey) {
    if (sortBy !== key) return "⇅";
    return sortDir === "asc" ? "▲" : "▼";
  }

  return (
    <section className="min-h-screen py-10 px-4 bg-[#FBF5EE] text-[#2f1a00]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif mb-6 text-[#6A0000]">
          Jinsharnam Directory
        </h1>

        {/* Controls */}
        <div className="mb-6 grid gap-3 md:grid-cols-4 items-center">
          <div className="md:col-span-2 flex gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, mobile, email, organization or address..."
              className="flex-1 px-4 py-2 rounded-lg border border-[#E7D6BF] bg-white shadow-sm text-sm"
            />
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-[#C45A00] text-white hover:bg-[#a84300] transition text-sm"
            >
              Reset
            </button>
          </div>

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="">All States</option>
            {stateOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="">All Branches</option>
            {branchOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white text-sm"
          >
            <option value="">All Positions</option>
            {positionOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={filterOrganization}
            onChange={(e) => setFilterOrganization(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-white md:col-span-1 text-sm"
          >
            <option value="">All Organizations</option>
            {organizationOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        {/* Table container: horizontal scroll on small screens */}
        <div className="bg-white rounded-lg shadow-sm border border-[#efe6d7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>

              <thead className="bg-[#faf7f3] border-b border-[#e5ded3]">
                <tr className="text-[14px] text-[#4b2e0f] font-medium">
                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("state")}
                    title="Sort by State"
                  >
                    <div className="flex items-center gap-2">
                      <span>State</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("state")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("name")}
                    title="Sort by Name"
                  >
                    <div className="flex items-center gap-2">
                      <span>Name</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("name")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("position")}
                    title="Sort by Position"
                  >
                    <div className="flex items-center gap-2">
                      <span>Position</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("position")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("organization")}
                    title="Sort by Organization"
                  >
                    <div className="flex items-center gap-2">
                      <span>Organization</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("organization")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("address")}
                    title="Sort by Address"
                  >
                    <div className="flex items-center gap-2">
                      <span>Address</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("address")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("branch")}
                    title="Sort by Branch"
                  >
                    <div className="flex items-center gap-2">
                      <span>Branch</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("branch")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("mobile")}
                    title="Sort by Mobile"
                  >
                    <div className="flex items-center gap-2">
                      <span>Mobile</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("mobile")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("date_of_birth")}
                    title="Sort by Date of Birth"
                  >
                    <div className="flex items-center gap-2">
                      <span>Date of Birth</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("date_of_birth")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 border-r border-[#e5ded3] text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("date_of_marriage")}
                    title="Sort by Date of Marriage"
                  >
                    <div className="flex items-center gap-2">
                      <span>Date of Marriage</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("date_of_marriage")}
                      </span>
                    </div>
                  </th>

                  <th
                    className="px-3 py-2 text-left sticky top-0"
                    style={{ background: "#fbf8f5" }}
                    onClick={() => toggleSort("email")}
                    title="Sort by Email"
                  >
                    <div className="flex items-center gap-2">
                      <span>Email</span>
                      <span className="text-xs text-[#7a5a3a]">
                        {sortIcon("email")}
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-[#6b4b2b]">
                      Loading members…
                    </td>
                  </tr>
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-[#6b4b2b]">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  sorted.map((m, i) => (
                    <tr
                      key={m.id ?? i}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-[#fcfaf7]"
                      } text-[13px] text-[#3b2a16] align-top`}
                    >
                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words">
                        {m.state || "-"}
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words">
                        <div className="line-clamp-2">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlight(m.name || "-", searchQuery),
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words">
                        {m.position || "-"}
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlight(
                              m.organization || "-",
                              searchQuery
                            ),
                          }}
                        />
                      </td>

                      <td
                        className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words"
                        style={{ overflowWrap: "anywhere" }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlight(m.address || "-", searchQuery),
                          }}
                        />
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0 break-words">
                        {m.branch || "-"}
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0">
                        {m.mobile ? (
                          <a
                            href={`tel:${m.mobile}`}
                            dangerouslySetInnerHTML={{
                              __html: highlight(m.mobile, searchQuery),
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0">
                        {formatDate(m.date_of_birth)}
                      </td>

                      <td className="px-3 py-2 border-r border-[#e5ded3] min-w-0">
                        {formatDate(m.date_of_marriage)}
                      </td>

                      <td
                        className="px-3 py-2 min-w-0 break-words"
                        style={{ wordBreak: "break-word" }}
                      >
                        {m.email ? (
                          <a
                            href={`mailto:${m.email}`}
                            dangerouslySetInnerHTML={{
                              __html: highlight(m.email, searchQuery),
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-xs text-[#8b6f50]">
          Showing <strong>{sorted.length}</strong> of{" "}
          <strong>{allMembers.length}</strong> members.
        </div>

        {/* Mobile stacked rows fallback */}
        <div className="md:hidden mt-6 space-y-4">
          {sorted.map((m, i) => (
            <div
              key={m.id ?? i}
              className="bg-white p-3 rounded-lg shadow-sm border border-[#efe6d7]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlight(m.name || "", searchQuery),
                      }}
                    />
                  </div>
                  <div className="text-xs text-[#6b4b2b] mt-1">
                    {m.position}
                  </div>
                </div>
                <div className="text-sm text-right">{m.state}</div>
              </div>

              <div className="mt-2 text-xs text-[#6b4b2b]">
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight(m.organization || "", searchQuery),
                  }}
                />
              </div>
              <div className="mt-2 text-xs text-[#6b4b2b]">
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight(m.address || "", searchQuery),
                  }}
                />
              </div>
              <div className="mt-2 flex gap-3 text-sm">
                <div>
                  <strong>Mobile:</strong>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight(m.mobile || "", searchQuery),
                    }}
                  />
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight(m.email || "", searchQuery),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
