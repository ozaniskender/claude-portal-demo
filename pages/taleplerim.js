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
    classes: "bg-[#faeeda] text-[#854f0b]",
  },
  pending_provisioning: {
    label: "Provisioning bekleniyor",
    classes: "bg-[#e6f1fb] text-[#0c447c]",
  },
  completed: {
    label: "Tamamlandı",
    classes: "bg-[#eaf3de] text-[#27500a]",
  },
  rejected_by_manager: {
    label: "Reddedildi",
    classes: "bg-[#fcebeb] text-[#791f1f]",
  },
};

function RequestCard({ req, showRequester = true, href }) {
  const badge = STATE_BADGE[req.state] || { label: req.state, classes: "bg-[#f4f3ef] text-[#5f5e5a]" };

  return (
    <Link href={href} className="group block">
      <div className="px-6 py-4 flex items-center justify-between hover:bg-[#faf9f7] transition-all group-hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-[12px] text-[#5f5e5a] font-medium">{req.id}</span>
            <span className="inline-block px-2 py-0.5 text-[11px] font-medium rounded-lg bg-[#f4f3ef] text-[#5f5e5a]">
              {TYPE_LABELS[req.type] || req.type}
            </span>
          </div>
          {showRequester && (
            <p className="text-[14px] font-medium text-[#1c1c1a] mb-0.5 truncate">{req.requester}</p>
          )}
          <p className="text-[12px] text-[#888780]">{relativeTime(req.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className={`inline-block px-2.5 py-1 text-[11px] font-medium rounded-lg ${badge.classes}`}>
            {badge.label}
          </span>
          <svg
            className="w-4 h-4 text-[#c8c7c0] group-hover:text-[#5f5e5a] transition-colors"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ message, linkHref, linkLabel }) {
  return (
    <div className="px-6 py-16 text-center">
      <svg className="w-8 h-8 text-[#c8c7c0] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p className="text-[#5f5e5a] text-[13px] mb-3">{message}</p>
      {linkHref && (
        <Link href={linkHref} className="text-[13px] font-medium text-[#0c447c] hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-black/10">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-6 py-3.5 text-[13px] font-medium border-b-2 transition-colors ${
            active === tab.key
              ? "border-[#1e3a5f] text-[#1e3a5f]"
              : "border-transparent text-[#5f5e5a] hover:text-[#1c1c1a]"
          }`}
        >
          {tab.label}
          {tab.count > 0 && (
            <span className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-semibold ${
              active === tab.key ? "bg-[#1e3a5f] text-white" : "bg-[#f4f3ef] text-[#5f5e5a]"
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Burçak view
function BurcakView({ requests }) {
  const mine = requests
    .filter((r) => r.requester === "Burçak Göksel")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-black/10">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Taleplerim</p>
        <p className="text-[13px] text-[#5f5e5a]">Oluşturduğunuz tüm talepler.</p>
      </div>
      <div className="divide-y divide-black/10">
        {mine.length === 0 ? (
          <EmptyState
            message="Henüz hiç talep oluşturmadınız."
            linkHref="/talep"
            linkLabel="Yeni talep oluştur"
          />
        ) : (
          mine.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              showRequester={false}
              href={`/talep-detay/${req.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Zeynep view
function ZeynepView({ requests }) {
  const [activeTab, setActiveTab] = useState("pending");

  const pending = requests.filter(
    (r) => r.manager === "Zeynep Şen" && r.state === "pending_manager_approval"
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const history = requests.filter(
    (r) => r.managerApproval?.by === "Zeynep Şen"
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const tabs = [
    { key: "pending", label: "Onayımı bekleyenler", count: pending.length },
    { key: "history", label: "Geçmiş onaylarım", count: history.length },
  ];

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-black/10">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Taleplerim</p>
        <p className="text-[13px] text-[#5f5e5a]">Onayınızı bekleyen ve geçmiş onay işlemleriniz.</p>
      </div>
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div className="divide-y divide-black/10">
        {activeTab === "pending" ? (
          pending.length === 0 ? (
            <EmptyState message="Henüz bekleyen talep yok ✓" />
          ) : (
            pending.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                showRequester={true}
                href={`/manager-onay/${req.id}`}
              />
            ))
          )
        ) : (
          history.length === 0 ? (
            <EmptyState message="Henüz onayladığınız bir talep yok." />
          ) : (
            history.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                showRequester={true}
                href={`/talep-detay/${req.id}`}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

// Hakan view
function HakanView({ requests }) {
  const [activeTab, setActiveTab] = useState("queue");

  const queue = requests.filter(
    (r) => r.state === "pending_provisioning"
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const done = requests.filter(
    (r) => r.provisioning?.by === "Hakan Kormanlı"
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const tabs = [
    { key: "queue", label: "Bekleyen queue", count: queue.length },
    { key: "done", label: "Tamamladıklarım", count: done.length },
  ];

  return (
    <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-black/10">
        <p className="font-medium text-[18px] text-[#1c1c1a] mb-0.5">Taleplerim</p>
        <p className="text-[13px] text-[#5f5e5a]">Provisioning kuyruğu ve tamamlanan işlemler.</p>
      </div>
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
      <div className="divide-y divide-black/10">
        {activeTab === "queue" ? (
          queue.length === 0 ? (
            <EmptyState message="Provisioning kuyruğu boş ✓" />
          ) : (
            queue.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                showRequester={true}
                href={`/admin-provision/${req.id}`}
              />
            ))
          )
        ) : (
          done.length === 0 ? (
            <EmptyState message="Henüz tamamladığınız bir talep yok." />
          ) : (
            done.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                showRequester={true}
                href={`/talep-detay/${req.id}`}
              />
            ))
          )
        )}
      </div>
    </div>
  );
}

export default function Taleplerim() {
  const [persona, setPersona] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const p = localStorage.getItem("currentPersona") || "Burçak";
    setPersona(p);
    setRequests(JSON.parse(localStorage.getItem("requests") || "[]"));
  }, []);

  if (persona === null) return null;

  return (
    <Layout>
      <Head><title>Taleplerim · Definex</title></Head>
      <div className="max-w-[820px] mx-auto">
        {persona === "Burçak" && <BurcakView requests={requests} />}
        {persona === "Zeynep" && <ZeynepView requests={requests} />}
        {persona === "Hakan" && <HakanView requests={requests} />}
      </div>
    </Layout>
  );
}
