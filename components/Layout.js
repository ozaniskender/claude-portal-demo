import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PERSONAS = [
  { key: "Burçak", label: "Burçak (Kullanıcı)" },
  { key: "Zeynep", label: "Zeynep (Manager)" },
  { key: "Hakan", label: "Hakan (License Admin)" },
];

const BASE_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
];
const HAKAN_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/dashboard", label: "Dashboard" },
];

const FOOTER_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/talep", label: "Burçak inbox" },
  { href: "/manager-inbox", label: "Zeynep inbox" },
  { href: "/admin-queue", label: "Hakan queue" },
  { href: "/dashboard", label: "Hakan dashboard" },
  { href: "/demo-reset", label: "Demo reset" },
];

export default function Layout({ children }) {
  const [persona, setPersona] = useState("Burçak");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("currentPersona");
    if (saved) setPersona(saved);
    setMounted(true);
  }, []);

  function handlePersonaChange(e) {
    const val = e.target.value;
    setPersona(val);
    localStorage.setItem("currentPersona", val);
    if (router.pathname === "/dashboard" && val !== "Hakan") {
      router.push("/");
    }
  }

  const navLinks = persona === "Hakan" ? HAKAN_NAV : BASE_NAV;

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <header className="bg-[#1e3a5f] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link href="/" className="font-semibold text-base tracking-tight hover:opacity-80 transition-opacity shrink-0">
            Claude Lisans Yönetimi&nbsp;·&nbsp;
            <span className="text-blue-300">Definex Internal Portal</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "bg-white/15 text-white font-semibold underline underline-offset-2"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {mounted && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-blue-200 hidden sm:inline">Persona:</span>
              <select
                value={persona}
                onChange={handlePersonaChange}
                className="text-sm bg-[#16304f] border border-blue-400 text-white rounded px-3 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {PERSONAS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">{children}</main>

      <footer className="border-t border-black/10 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-5 gap-y-1">
          {FOOTER_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[12px] text-[#888780] underline underline-offset-2 hover:text-[#5f5e5a] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
