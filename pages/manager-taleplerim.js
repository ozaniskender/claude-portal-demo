import { useState, useEffect } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import Link from "next/link";
import { relativeTime } from "@/utils/relativeTime";

const TYPE_LABELS = {
  new_license: "Yeni Lisans Talebi",
  spend_upgrade: "Spend Kademesi Değişikliği",
  role_change: "Custom Role Değişikliği",
};

const STATE_BADGE = {
  pending_manager_approval: {
    label: "Yönetici onayı bekleniyor",
    classes: "bg-[#faeeda] text-[#854f0b] border border-[#d4a87a]",
  },
  pending_provisioning: {
    label: "Provisioning bekleniyor",
    classes: "bg-brand-light-blue text-[#09206E] border border-brand-primary/30",
  },
  completed: {
    label: "Tamamlandı",
    classes: "bg-[#eaf3de] text-[#27500a] border border-[#8bbf5c]",
  },
  rejected_by_manager: {
    label: "Reddedildi",
    classes: "bg-[#fcebeb] text-[#791f1f] border border-[#f0aeae]",
  },
};

function matchesSearch(req, q) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    req.id?.toLowerCase().includes(lower) ||
    req.requester?.toLowerCase().includes(lower) ||
    (TYPE_LABELS[req.type] || req.type || "").toLowerCase().includes(lower) ||
    req.manager?.toLowerCase().includes(lower)
  );
}

function SearchInput({ value, onChange }) {
  return (
    <div className="px-6 py-3 border-b border-surface-bordered">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Talep ID, kullanıcı veya tipte ara..."
          className="w-full pl-9 pr-3 py-2 text-[13px] border border-surface-bordered rounded-lg bg-surface text-content-primary placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
        />
      </div>
    </div>
  );
}

function RequestCard({ req, showRequester = true, href }) {
  const badge = STATE_BADGE[req.state] || { label: req.state, classes: "bg-surface-subtle text-content-secondary border border-surface-bordered" };

  return (
    <Link href={href} className="group block">
      <div className="px-6 py-4 flex items-center justify-between hover:bg-surface-muted transition-all group-hover:shadow-[inset_0_0_0_1px_rgba(34,73,214,0.08)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[12px] text-content-tertiary font-medium">{req.id}</span>
            <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-surface-subtle text-content-secondary border border-surface-bordered">
              {TYPE_LABELS[req.type] || req.type}
            </span>
          </div>
          {showRequester && (
            <p className="text-[14px] font-medium text-content-primary mb-0.5 truncate">{req.requester}</p>
          )}
          <p className="text-[12px] text-content-tertiary">{relativeTime(req.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg ${badge.classes}`}>
            {badge.label}
          </span>
          <svg
            className="w-4 h-4 text-surface-bordered group-hover:text-brand-primary transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ message }) {
  return (
    <div className="px-6 py-16 text-center">
      <svg className="w-8 h-8 text-surface-bordered mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-content-secondary text-[13px]">{message}</p>
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-surface-bordered">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-3.5 text-[13px] font-medium border-b-2 transition-colors ${
            active === tab.key
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-content-secondary hover:text-content-primary"
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
              active === tab.key ? "bg-brand-primary text-white" : "bg-surface-subtle text-content-secondary"
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function ManagerTaleplerim() {
  const [persona, setPersona] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
    setRequests(JSON.parse(localStorage.getItem("requests") || "[]"));
  }, []);

  if (persona === null) return null;

  if (persona !== "Zeynep") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-content-secondary text-sm">Bu sayfayı sadece manager görebilir.</p>
        </div>
      </Layout>
    );
  }

  const pending = requests
    .filter((r) => r.manager === "Zeynep Şen" && r.state === "pending_manager_approval")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const history = requests
    .filter((r) => r.managerApproval?.by === "Zeynep Şen")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeList = activeTab === "pending" ? pending : history;
  const filtered = activeList.filter((r) => matchesSearch(r, search));

  const tabs = [
    { key: "pending", label: "Onayımı bekleyenler", count: pending.length },
    { key: "history", label: "Geçmiş onaylarım", count: history.length },
  ];

  return (
    <Layout>
      <Head><title>Manager Taleplerim · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        <div className="bg-surface rounded-card border border-surface-bordered shadow-card overflow-hidden">
          <div className="px-6 py-5 border-b border-surface-bordered flex items-start gap-3">
            <div className="w-1 h-5 rounded-full bg-brand-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[17px] text-content-primary mb-0.5">Manager Taleplerim</p>
              <p className="text-[13px] text-content-secondary">Onayınızı bekleyen ve geçmiş onay işlemleriniz.</p>
            </div>
          </div>
          <TabBar
            tabs={tabs}
            active={activeTab}
            onChange={(k) => { setActiveTab(k); setSearch(""); }}
          />
          <SearchInput value={search} onChange={setSearch} />
          <div className="divide-y divide-surface-bordered">
            {activeList.length === 0 ? (
              activeTab === "pending"
                ? <EmptyState message="Henüz bekleyen talep yok ✓" />
                : <EmptyState message="Henüz onayladığınız bir talep yok." />
            ) : filtered.length === 0 ? (
              <EmptyState message="Arama sonucu bulunamadı." />
            ) : (
              filtered.map((req) => (
                <RequestCard
                  key={req.id}
                  req={req}
                  showRequester={true}
                  href={activeTab === "pending" ? `/manager-onay/${req.id}` : `/talep-detay/${req.id}`}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
