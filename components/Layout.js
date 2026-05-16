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
const HAKAN_NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/dashboard", label: "Dashboard" },
];

function NavLink({ href, label, isActive }) {
  return (
    <Link
      href={href}
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

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentPersona");
    router.push("/login");
  }

  const navLinks = persona === "Hakan" ? HAKAN_NAV : BASE_NAV;
  const currentPersona = PERSONAS.find((p) => p.key === persona) || PERSONAS[0];

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <header className="bg-brand-navy text-white shadow-elevated">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity shrink-0">
            <img
              src="/definex-logo.svg"
              alt="Definex"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
            <span className="text-[13px] text-[#8FAEED] font-medium">Claude Lisans Portalı</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={router.pathname === link.href}
              />
            ))}
          </nav>

          {/* Persona switcher + Logout */}
          {mounted && (
            <div className="flex items-center gap-2.5 shrink-0">
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

              {/* Logout button */}
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">{children}</main>
    </div>
  );
}
