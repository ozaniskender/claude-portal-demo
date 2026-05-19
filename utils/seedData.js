const SEED_VERSION = "v3";

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

const SEED_REQUESTS = [
  {
    id: "REQ-2026-0070",
    type: "new_license",
    requester: "Ali Demir",
    manager: "Zeynep Şen",
    state: "rejected_by_manager",
    data: {
      capability: "Tech Consulting",
      account: "İş Bankası",
      level: "Consultant",
      tool: "Chat + Code",
      gerekce: "Proje süreçlerinde kod geliştirme desteği almak istiyorum.",
    },
    createdAt: daysAgo(56),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(55),
      note: "Mevcut iş tanımı Claude Code gerektirmiyor. Tekrar değerlendirilebilir.",
    },
  },
  {
    id: "REQ-2026-0089",
    type: "new_license",
    requester: "Burçak Göksel",
    manager: "Zeynep Şen",
    state: "completed",
    data: {
      capability: "BA & CE",
      account: "İş Bankası",
      level: "Consultant",
      tool: "Chat",
      gerekce: "Analiz ve rapor süreçlerinde Claude'dan yardım almak istiyorum.",
    },
    createdAt: daysAgo(42),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(41),
      note: "Onaylandı.",
    },
    provisioning: {
      by: "Hakan Kormanlı",
      at: daysAgo(40),
      internalNote: "Standart lisans oluşturuldu.",
      apiCalls: [
        { method: "POST", path: "/v1/organizations/{org_id}/users", comment: "Kullanıcı oluştur" },
        { method: "POST", path: "/v1/organizations/{org_id}/users/{id}/groups", comment: "Custom Role: Chat" },
      ],
    },
  },
  {
    id: "REQ-2026-0098",
    type: "new_license",
    requester: "Ali Demir",
    manager: "Zeynep Şen",
    state: "completed",
    data: {
      capability: "Tech Consulting",
      account: "Garanti BBVA",
      level: "Senior Developer",
      tool: "Chat",
      gerekce: "Tech Consulting projesinde analiz desteği gerekiyor.",
    },
    createdAt: daysAgo(35),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(34),
      note: "Onaylandı.",
    },
    provisioning: {
      by: "Hakan Kormanlı",
      at: daysAgo(33),
      internalNote: "Standart lisans oluşturuldu.",
      apiCalls: [
        { method: "POST", path: "/v1/organizations/{org_id}/users", comment: "Kullanıcı oluştur" },
        { method: "POST", path: "/v1/organizations/{org_id}/users/{id}/groups", comment: "Custom Role: Chat" },
      ],
    },
  },
  {
    id: "REQ-2026-0117",
    type: "role_change",
    requester: "Ali Demir",
    manager: "Zeynep Şen",
    state: "completed",
    data: {
      currentRole: "Chat",
      requestedRole: "Chat + Code",
      gerekce: "Tech Consulting projesinde Python pipeline geliştirmem gerekiyor.",
    },
    createdAt: daysAgo(21),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(20),
      note: "Proje ihtiyacı doğrulandı.",
      approvedRole: "Chat + Code",
    },
    provisioning: {
      by: "Hakan Kormanlı",
      at: daysAgo(19),
      internalNote: "Rol güncellendi.",
      apiCalls: [
        { method: "DELETE", path: "/v1/organizations/{org_id}/users/{id}/groups/role-chat", comment: "Eski rol kaldır: Chat" },
        { method: "POST", path: "/v1/organizations/{org_id}/users/{id}/groups/role-chat-code", comment: "Yeni rol ekle: Chat + Code" },
      ],
    },
  },
  {
    id: "REQ-2026-0124",
    type: "spend_upgrade",
    requester: "Burçak Göksel",
    manager: "Zeynep Şen",
    state: "completed",
    data: {
      currentTier: "Entry",
      requestedTier: "Medium",
      gerekce: "Q2 döneminde yoğun proje nedeniyle daha fazla token kapasitesine ihtiyaç duyuyorum.",
    },
    createdAt: daysAgo(21),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(20),
      note: "Q2 yoğun proje dönemi nedeniyle onaylandı.",
      approvedTier: "Medium",
    },
    provisioning: {
      by: "Hakan Kormanlı",
      at: daysAgo(19),
      internalNote: "Spend limiti güncellendi.",
      apiCalls: [
        { method: "DELETE", path: "/v1/organizations/{org_id}/users/{id}/groups/spend-entry", comment: "Eski kademe kaldır: Entry" },
        { method: "POST", path: "/v1/organizations/{org_id}/users/{id}/groups/spend-medium", comment: "Yeni kademe ekle: Medium" },
      ],
    },
  },
  {
    id: "REQ-2026-0142",
    type: "spend_upgrade",
    requester: "Burçak Göksel",
    manager: "Zeynep Şen",
    state: "pending_provisioning",
    data: {
      currentTier: "Medium",
      requestedTier: "High",
      gerekce: "Büyük kod tabanı analizi için daha yüksek token limiti gerekiyor.",
    },
    createdAt: daysAgo(4),
    managerApproval: {
      by: "Zeynep Şen",
      at: daysAgo(3),
      note: "Onaylandı.",
      approvedTier: "High",
    },
  },
  {
    id: "REQ-2026-0155",
    type: "role_change",
    requester: "Burçak Göksel",
    manager: "Zeynep Şen",
    state: "pending_manager_approval",
    data: {
      currentRole: "Chat",
      requestedRole: "Chat + Code",
      gerekce: "Yeni başlayacağım Tech Consulting projesinde Python ile data pipeline geliştirmem gerekiyor.",
    },
    createdAt: daysAgo(2),
  },
  {
    id: "REQ-2026-0163",
    type: "new_license",
    requester: "Mert Yıldız",
    manager: "Zeynep Şen",
    state: "pending_manager_approval",
    data: {
      capability: "AI & Analytics",
      account: "İç Proje",
      level: "Consultant",
      tool: "Chat",
      gerekce: "AI & Analytics ekibinde proje süreçlerini hızlandırmak için Claude'a ihtiyacım var.",
    },
    createdAt: daysAgo(1),
  },
  // Zeynep'in kendi talepleri
  {
    id: "REQ-2026-0051",
    type: "new_license",
    requester: "Zeynep Şen",
    manager: "Eren Söyler",
    state: "completed",
    data: {
      capability: "BA & CE",
      account: "İş Bankası",
      level: "Lead",
      tool: "Chat + Code",
      gerekce: "Ekip yönetimi ve teknik karar süreçlerinde yapay zeka desteğine ihtiyacım var.",
    },
    createdAt: daysAgo(60),
    managerApproval: {
      by: "Eren Söyler",
      at: daysAgo(59),
      note: "Onaylandı.",
    },
    provisioning: {
      by: "Hakan Kormanlı",
      at: daysAgo(58),
      internalNote: "Manager lisansı oluşturuldu.",
      apiCalls: [
        { method: "POST", path: "/v1/organizations/{org_id}/users", comment: "Kullanıcı oluştur" },
        { method: "POST", path: "/v1/organizations/{org_id}/users/{id}/groups", comment: "Custom Role: Chat + Code" },
      ],
    },
  },
  {
    id: "REQ-2026-0171",
    type: "spend_upgrade",
    requester: "Zeynep Şen",
    manager: "Eren Söyler",
    state: "pending_manager_approval",
    data: {
      currentTier: "Medium",
      requestedTier: "High",
      gerekce: "Q2 proje yoğunluğu nedeniyle mevcut limit yetersiz kalıyor.",
    },
    createdAt: daysAgo(1),
  },
];

export function initSeedData() {
  if (typeof window === "undefined") return;
  const storedVersion = localStorage.getItem("seedVersion");
  if (storedVersion !== SEED_VERSION) {
    _applySeed();
  }
}

export function resetSeedData() {
  if (typeof window === "undefined") return;
  _applySeed();
  localStorage.setItem("currentPersona", "Burçak");
}

function _applySeed() {
  localStorage.setItem("requests", JSON.stringify(SEED_REQUESTS));
  localStorage.setItem("seedVersion", SEED_VERSION);
  localStorage.removeItem("lastRequestId");
  localStorage.removeItem("lastProvisionReqId");
  localStorage.removeItem("lastManagerAction");
}
