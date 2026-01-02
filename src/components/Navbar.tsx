"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Search,
  LogIn,
  UserPlus,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import Fuse from "fuse.js";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type SearchItem = {
  title: string;
  description: string;
  path: string;
  type: string;
  [key: string]: any;
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // 🌟 State Hooks
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [allData, setAllData] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // === FETCH SEARCH DATA ===
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsSearching(true);
        setSearchError(null);

        const res = await fetch("/api/search");
        if (!res.ok) {
          throw new Error(`Search API error: ${res.status}`);
        }

        const data: SearchItem[] = await res.json();
        if (cancelled) return;

        setAllData(data);

        const fuseInstance = new Fuse<SearchItem>(data, {
          keys: ["title", "description", "type", "keywords"],
          threshold: 0.3,
          includeScore: true,
          ignoreLocation: true,
          minMatchCharLength: 2,
        });

        setFuse(fuseInstance);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setSearchError("Unable to load search index.");
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // === CLOSE PROFILE DROPDOWN + SEARCH ON OUTSIDE CLICK ===
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }

      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setResults([]);
        setHighlightIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === SEARCH HANDLERS ===
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setHighlightIndex(-1);
  };

  // Debounced search using Fuse
  useEffect(() => {
    if (!fuse || searchValue.trim() === "") {
      setResults([]);
      return;
    }

    setIsSearching(true);

    const handler = setTimeout(() => {
      const output = fuse.search(searchValue.trim());
      setResults(output.slice(0, 10).map((r) => r.item)); // top 10
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchValue, fuse]);

  const handleSelect = (path: string) => {
    setSearchValue("");
    setResults([]);
    setHighlightIndex(-1);
    router.push(path);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item =
        highlightIndex >= 0 ? results[highlightIndex] : results[0];
      if (item) handleSelect(item.path);
    } else if (e.key === "Escape") {
      setSearchValue("");
      setResults([]);
      setHighlightIndex(-1);
    }
  };

  // === USER ROLE CHECK ===
  const isAdmin =
    (session?.user as any)?.role === "ADMIN" ||
    (session?.user as any)?.role === "admin";

  // === USER NAME & IMAGE ===
  const userName = (session?.user?.name as string) || "User";
  const userImage = (session?.user as any)?.image as string | undefined;

  // === NAVIGATION LINKS ===
  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Pulak Sagar", path: "/pulak-sagar" },
    {
      name: "Organization",
      subLinks: [
        { name: "Jinsharnam Tirth", path: "/organization/jinsharnam-tirth" },
        { name: "Vatsalya Dhara", path: "/organization/vatsalya-dhara" },
      ],
    },
    {
      name: "Media",
      subLinks: [
        { name: "Videos", path: "/media/videos" },
        { name: "Audio", path: "/media/audio" },
      ],
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Services", path: "/services" },
    // { name: "Achievements", path: "/achievements" },
    { name: "Sahitya", path: "/store" },
    { name: "Directory", path: "/directory" },
    { name: "Contact", path: "/contact" },
  ];

  // === COMPONENT RETURN ===
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-[#2d0000]/95 via-[#500000]/95 to-[#1a0000]/95 border-b border-yellow-700/40 shadow-lg">
      {/* === TOP SECTION === */}
      <div className="flex justify-between items-center px-6 md:px-12 py-2 border-b border-yellow-700/40 text-sm relative">
        {/* SEARCH BOX */}
        <div
          ref={searchBoxRef}
          className="relative flex items-center gap-2 bg-[#400101]/70 border border-yellow-700/50 rounded-md px-2 py-[3px] w-36 md:w-64"
        >
          <Search size={16} className="text-yellow-400" />
          <input
            type="text"
            placeholder="Search pages, media, store..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="bg-transparent outline-none text-yellow-100 placeholder-yellow-300/70 text-sm flex-1"
          />

          {(results.length > 0 || searchError || isSearching) && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#2d0000]/95 border border-yellow-700/40 rounded-md shadow-lg text-yellow-100 text-sm max-h-64 overflow-y-auto z-50">
              {isSearching && (
                <div className="px-3 py-2 text-xs text-yellow-300/80">
                  Searching...
                </div>
              )}

              {searchError && (
                <div className="px-3 py-2 text-xs text-red-300">
                  {searchError}
                </div>
              )}

              {!isSearching &&
                !searchError &&
                results.length === 0 &&
                searchValue.trim() !== "" && (
                  <div className="px-3 py-2 text-xs text-yellow-200/80">
                    No results found
                  </div>
                )}

              {!isSearching &&
                !searchError &&
                results.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelect(r.path)}
                    className={`px-3 py-2 cursor-pointer ${
                      i === highlightIndex
                        ? "bg-yellow-900/60"
                        : "hover:bg-yellow-900/30"
                    }`}
                  >
                    <p className="font-semibold text-yellow-300 flex justify-between">
                      {r.title}
                      <span className="text-xs text-yellow-400/70 uppercase">
                        {r.type}
                      </span>
                    </p>
                    <p className="text-yellow-100/80 text-xs">
                      {r.description}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* PROFILE / AUTH SECTION */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          {status === "loading" ? (
            <span className="text-yellow-200 text-sm">Loading...</span>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-700/50 bg-[#4B1E00]/40 text-yellow-300 hover:bg-[#FFD97A]/10"
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={26}
                    height={26}
                    className="rounded-full border border-yellow-400/70 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-500/70 flex items-center justify-center text-xs font-semibold text-yellow-100">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline">{userName}</span>
                <span className="text-yellow-400/70 text-xs">▼</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-[#4B1E00]/95 backdrop-blur-md border border-[#FFD97A]/30 rounded-xl shadow-xl p-4 text-sm z-50"
                  >
                    <p className="text-[#FFD97A] font-semibold mb-2">
                      {isAdmin ? "Admin Panel" : "User Profile"}
                    </p>

                    {isAdmin ? (
                      <Link
                        href="/admin/dashboard"
                        className="block py-1 text-[#FFF8E7]/80 hover:text-[#FFD97A] transition"
                      >
                        🧭 Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/user/orders"
                        className="block py-1 text-[#FFF8E7]/80 hover:text-[#FFD97A] transition"
                      >
                        📦 My Orders
                      </Link>
                    )}

                    <Link
                      href="/user/profile/edit"
                      className="block py-1 text-[#FFF8E7]/80 hover:text-[#FFD97A] transition"
                    >
                      🧍 Edit Profile
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left mt-3 text-[#FFF8E7]/80 hover:text-[#FFD97A] transition"
                    >
                      🚪 Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="flex items-center gap-1 text-yellow-200 hover:text-yellow-400 text-sm transition"
              >
                <LogIn size={16} /> Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex items-center gap-1 bg-yellow-400 text-[#4B1E00] px-3 py-[3px] rounded-md font-semibold text-sm hover:bg-yellow-300 transition"
              >
                <UserPlus size={16} /> Signup
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-yellow-300 hover:text-yellow-400 transition ml-2"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MAIN NAVBAR (DESKTOP) */}
      <div className="hidden md:flex items-center justify-between px-6 md:px-12 py-3">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/images/logo.jpg"
            alt="Jinsharnam Media Logo"
            className="w-14 h-12 rounded-full shadow-lg hover:scale-105 transition-transform"
          />
          <h1 className="font-serif text-2xl font-bold text-yellow-300">
            Jinsharnam <span className="text-yellow-400">Media</span>
          </h1>
        </Link>

        {/* 🌟 NAVIGATION LINKS */}
        <nav className="flex items-center space-x-6 font-medium text-sm">
          {links.map((link, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() =>
                link.subLinks ? setOpenDropdown(link.name) : null
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.subLinks ? (
                <>
                  {/* Dropdown Trigger */}
                  <button
                    className={`flex items-center gap-1 font-semibold transition-all ${
                      openDropdown === link.name
                        ? "text-yellow-300"
                        : "text-yellow-200"
                    } hover:text-yellow-300`}
                  >
                    {link.name} <ChevronDown size={14} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {openDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 bg-[#400101]/95 border border-yellow-700/40 rounded-md min-w-[190px] shadow-lg z-50"
                      >
                        {link.subLinks.map((sublink: any, subIndex: number) => (
                          <Link
                            key={subIndex}
                            href={sublink.path}
                            className="block px-4 py-2 text-yellow-200 hover:bg-yellow-900/30 hover:text-yellow-300 transition"
                          >
                            {sublink.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={link.path}
                  className={`relative font-semibold transition-all ${
                    pathname === link.path
                      ? "text-yellow-400"
                      : "text-yellow-200"
                  } hover:text-yellow-300`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full transition-all duration-300 ${
                      pathname === link.path
                        ? "bg-yellow-400 scale-x-100"
                        : "bg-yellow-300/50 scale-x-0 hover:scale-x-100"
                    } origin-left`}
                  ></span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden px-6 py-3 bg-[#300000]/95 border-t border-yellow-700/40 space-y-2 text-sm"
          >
            {links.map((link, index) => (
              <div key={index} className="flex flex-col">
                {link.subLinks ? (
                  <>
                    <span className="font-semibold text-yellow-300 mb-1">
                      {link.name}
                    </span>
                    {link.subLinks.map((sublink: any, subIndex: number) => (
                      <Link
                        key={subIndex}
                        href={sublink.path}
                        className="pl-3 py-1 text-yellow-200 hover:text-yellow-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        {sublink.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={link.path}
                    className={`py-1 ${
                      pathname === link.path
                        ? "text-yellow-400"
                        : "text-yellow-200"
                    } hover:text-yellow-300`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
