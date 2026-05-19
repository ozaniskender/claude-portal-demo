import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const PERSONAS = [
  { key: "Burçak", label: "Burçak Göksel", role: "Kullanıcı", color: "bg-[#DEE8FD] text-[#09206E]" },
  { key: "Zeynep", label: "Zeynep Şen",    role: "Manager",   color: "bg-[#F3B693] text-[#6B2910]" },
  { key: "Hakan",  label: "Hakan Kormanlı", role: "License Admin", color: "bg-[#C6E09A] text-[#27500a]" },
];

const BASE_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
];
const ZEYNEP_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/manager-taleplerim", label: "Manager Taleplerim" },
];
const HAKAN_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/dashboard", label: "Dashboard" },
];

function NavLink({ href, label, isActive, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors font-medium ${
        isActive
          ? "bg-white/20 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Layout({ children }) {
  const [persona, setPersona] = useState("Burçak");
  const [mounted, setMounted] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/login") {
      setIsCheckingAuth(false);
      const saved = localStorage.getItem("currentPersona");
      if (saved) setPersona(saved);
      setMounted(true);
      return;
    }
    const authed = localStorage.getItem("isAuthenticated") === "true";
    if (!authed) {
      router.push("/login");
      return;
    }
    const saved = localStorage.getItem("currentPersona");
    if (saved) setPersona(saved);
    setMounted(true);
    setIsCheckingAuth(false);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  if (isCheckingAuth && router.pathname !== "/login") {
    return <div className="min-h-screen bg-brand-soft-blue" />;
  }

  function handlePersonaChange(e) {
    const val = e.target.value;
    localStorage.setItem("currentPersona", val);
    if (router.pathname === "/dashboard" && val !== "Hakan") {
      router.push("/");
    } else {
      router.reload();
    }
  }

  function handlePersonaClick(key) {
    setIsMenuOpen(false);
    if (key === persona) return;
    localStorage.setItem("currentPersona", key);
    if (router.pathname === "/dashboard" && key !== "Hakan") {
      router.push("/");
    } else {
      router.reload();
    }
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentPersona");
    router.push("/login");
  }

  const navLinks = persona === "Hakan" ? HAKAN_NAV : persona === "Zeynep" ? ZEYNEP_NAV : BASE_NAV;
  const currentPersona = PERSONAS.find((p) => p.key === persona) || PERSONAS[0];

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <header className="bg-brand-navy text-white shadow-elevated relative z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0">
            <img
              src="/definex-logo.svg"
              alt="Definex"
              width={36}
              height={36}
              className="brightness-0 invert"
            />
            <span className="text-[12px] md:text-[13px] text-[#8FAEED] font-medium">Claude Lisans Portalı</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={router.pathname === link.href}
              />
            ))}
            <button
              onClick={(e) => e.preventDefault()}
              className="px-3 py-1.5 text-sm rounded-md transition-colors font-medium text-white/80 hover:text-white hover:bg-white/10"
            >
              Eğitimler
            </button>
          </nav>

          {/* Desktop: Persona switcher + Logout */}
          {mounted && (
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold ${currentPersona.color}`}>
                {currentPersona.label.charAt(0)}
              </span>
              <select
                value={persona}
                onChange={handlePersonaChange}
                className="text-[13px] bg-white/10 border border-white/20 text-white rounded-lg px-2.5 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none pr-7"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff80' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
              >
                {PERSONAS.map((p) => (
                  <option key={p.key} value={p.key} className="bg-[#0F1737] text-white">
                    {p.label} ({p.role})
                  </option>
                ))}
              </select>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[12px] text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Çıkış yap"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış
              </button>
            </div>
          )}

          {/* Mobile: Avatar + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && (
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold ${currentPersona.color}`}>
                {currentPersona.label.charAt(0)}
              </span>
            )}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              aria-label="Menü"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-brand-navy shadow-lg md:hidden border-t border-white/10">
            {/* Nav links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-3 text-[14px] border-b border-white/10 transition-colors ${
                  router.pathname === link.href
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-6 py-3 text-[14px] text-white/80 hover:text-white hover:bg-white/5 border-b border-white/10 transition-colors"
            >
              Eğitimler
            </button>

            {/* Persona switcher */}
            <div className="border-t border-white/20 px-6 py-3">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2 font-semibold">Persona</p>
              {PERSONAS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => handlePersonaClick(p.key)}
                  className="flex items-center gap-2.5 w-full py-2 text-[13px] transition-colors text-left"
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0 ${p.color}`}>
                    {p.label.charAt(0)}
                  </span>
                  <span className={persona === p.key ? "text-white font-medium" : "text-white/60"}>
                    {p.label}
                  </span>
                  <span className="text-white/40 text-[11px]">({p.role})</span>
                  {persona === p.key && (
                    <svg className="w-3.5 h-3.5 text-white ml-auto shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-white/20">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-6 py-3.5 text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış yap
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex-1 w-full">{children}</main>
    </div>
  );
}
