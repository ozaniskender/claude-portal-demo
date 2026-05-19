import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";

/* ── Metric helpers ── */

function StatusDot({ active }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: active ? "#5DCAA5" : "#888780" }}
    />
  );
}

function MetricCard({ label, children, href }) {
  const router = useRouter();
  const clickable = !!href;

  return (
    <div
      onClick={clickable ? () => router.push(href) : undefined}
      className={`flex flex-col gap-1.5 px-3 md:px-6 ${clickable ? "cursor-pointer group" : ""}`}
    >
      <span
        className="text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.04em] md:tracking-[0.05em] whitespace-nowrap"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        {children}
        {clickable && (
          <span
            className="text-[14px] opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            →
          </span>
        )}
      </div>
    </div>
  );
}

function NumericValue({ value }) {
  return (
    <span className="text-[22px] font-medium text-white leading-none">
      {value}
    </span>
  );
}

function StatusValue({ active }) {
  return (
    <div className="flex items-center gap-2">
      <StatusDot active={active} />
      <span className="text-[16px] font-medium text-white leading-none">
        {active ? "Aktif" : "Henüz yok"}
      </span>
    </div>
  );
}

const DIVIDER = (
  <div
    className="self-stretch w-px shrink-0"
    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
  />
);

/* ── Persona-aware metrics row ── */

function MetricsRow({ persona, requests }) {
  const personaName =
    persona === "Burçak" ? "Burçak Göksel"
    : persona === "Zeynep" ? "Zeynep Şen"
    : "Hakan Kormanlı";

  const openMine = requests.filter(
    (r) =>
      r.requester === personaName &&
      (r.state === "pending_manager_approval" || r.state === "pending_provisioning")
  ).length;

  const hasActiveLicense = requests.some(
    (r) =>
      r.requester === personaName &&
      r.type === "new_license" &&
      r.state === "completed"
  );

  // Zeynep
  const pendingManagerApproval = requests.filter(
    (r) => r.manager === "Zeynep Şen" && r.state === "pending_manager_approval"
  ).length;

  // Hakan
  const pendingProvisioning = requests.filter(
    (r) => r.state === "pending_provisioning"
  ).length;

  if (persona === "Burçak") {
    return (
      <div className="flex items-center mt-4 md:mt-6">
        <MetricCard label="Açık taleplerim" href="/taleplerim">
          <NumericValue value={openMine} />
        </MetricCard>
        {DIVIDER}
        <MetricCard label="Lisans durumum">
          <StatusValue active={hasActiveLicense} />
        </MetricCard>
      </div>
    );
  }

  if (persona === "Zeynep") {
    return (
      <div className="flex items-center mt-4 md:mt-6">
        <MetricCard label="Açık taleplerim" href="/taleplerim">
          <NumericValue value={openMine} />
        </MetricCard>
        {DIVIDER}
        <MetricCard label="Lisans durumum">
          <StatusValue active={hasActiveLicense} />
        </MetricCard>
        {DIVIDER}
        <MetricCard label="Onayımı bekleyen" href="/manager-taleplerim">
          <NumericValue value={pendingManagerApproval} />
        </MetricCard>
      </div>
    );
  }

  if (persona === "Hakan") {
    return (
      <div className="flex items-center mt-4 md:mt-6">
        <MetricCard label="Lisans durumum">
          <StatusValue active={hasActiveLicense} />
        </MetricCard>
        {DIVIDER}
        <MetricCard label="Bekleyen provisioning" href="/dashboard">
          <NumericValue value={pendingProvisioning} />
        </MetricCard>
      </div>
    );
  }

  return null;
}

/* ── Page ── */

export default function Home() {
  const [persona, setPersona] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
    setRequests(JSON.parse(localStorage.getItem("requests") || "[]"));
  }, []);

  return (
    <Layout>
      <Head><title>Definex · Claude Lisans Yönetimi</title></Head>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-brand-navy text-white mb-8">
        {/* Checkered grid pattern on right */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: `
              linear-gradient(to right, #0F1737 0%, transparent 30%),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px)
            `,
          }}
        />

        <div className="relative px-5 py-7 md:px-10 md:py-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-[#8FAEED] text-[12px] font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FAEED]" />
            Claude Enterprise
          </div>

          <h1 className="text-[32px] font-bold leading-tight mb-4 text-white">
            Lisans Yönetim Portalı
          </h1>

          {/* Metrics */}
          {persona !== null && (
            <MetricsRow persona={persona} requests={requests} />
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/talep", label: "Yeni Lisans Talebi", desc: "Claude Enterprise erişimi için başvurun", icon: "M12 4v16m8-8H4" },
          { href: "/talep-spend", label: "Spend Kademesi", desc: "Mevcut kademeni yükselt veya değiştir", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
          { href: "/talep-role", label: "Custom Role", desc: "Tool yetkisi ve rol güncellemesi talep et", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-surface rounded-card border border-surface-bordered shadow-card hover:shadow-card-hover transition-all p-5"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-light-blue flex items-center justify-center mb-3">
              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
            </div>
            <p className="text-[14px] font-semibold text-content-primary mb-1 group-hover:text-brand-primary transition-colors">{item.label}</p>
            <p className="text-[12px] text-content-tertiary leading-relaxed">{item.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/demo-reset"
          className="text-[12px] text-content-tertiary hover:text-content-secondary transition-colors underline underline-offset-2"
        >
          Demo Sıfırla
        </Link>
      </div>
    </Layout>
  );
}
