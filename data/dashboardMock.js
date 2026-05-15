export const spendTrendData = [
  { month: 'Ara', spend: 3200, budget: 5000 },
  { month: 'Oca', spend: 3650, budget: 5000 },
  { month: 'Şub', spend: 4120, budget: 6000 },
  { month: 'Mar', spend: 4480, budget: 6000 },
  { month: 'Nis', spend: 5180, budget: 7000 },
  { month: 'May', spend: 4872, budget: 7000 },
];

export const kademeData = [
  { name: 'Entry',    value: 18, color: '#a8c489' },
  { name: 'Medium',  value: 52, color: '#5a8fc2' },
  { name: 'High',    value: 20, color: '#d4a259' },
  { name: 'Very High', value: 4, color: '#c14545' },
];

export const accountBreakdownData = [
  { account: 'İş Bankası',     licenses: 28, spend: 1540, budget: 2000, pct: 77 },
  { account: 'AI & Analytics', licenses: 14, spend: 1290, budget: 1400, pct: 92 },
  { account: 'Tech Consulting',licenses: 18, spend:  890, budget: 1500, pct: 59 },
  { account: 'Garanti',        licenses: 12, spend:  612, budget: 1000, pct: 61 },
  { account: 'BA & CE',        licenses: 10, spend:  340, budget:  600, pct: 57 },
  { account: 'Marketing',      licenses:  8, spend:  152, budget:  300, pct: 51 },
  { account: 'Türk Telekom',   licenses:  4, spend:   48, budget:  200, pct: 24 },
];

export const heatmapData = {
  days: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  hours: ['9', '11', '13', '15', '17', '19'],
  values: [
    [10, 28, 45, 38, 32,  8],
    [15, 32, 52, 44, 38, 10],
    [18, 35, 58, 48, 42, 12],
    [12, 30, 48, 40, 36,  9],
    [ 8, 22, 38, 30, 25,  6],
    [ 3,  8, 12, 10,  8,  4],
    [ 2,  5,  8,  7,  5,  3],
  ],
};

export const roleData = [
  { role: 'Chat',                   count: 56 },
  { role: 'Chat + Code',            count: 22 },
  { role: 'Chat + Code + Cowork',   count: 16 },
];

export const activityFeedData = [
  { type: 'success', text: 'Hakan Yılmaz Burçak G. için Custom Role değişikliğini provision etti', meta: 'REQ-2026-0140 · 12 dakika önce' },
  { type: 'info',    text: 'Zeynep Şen Mert Y. için yeni lisans talebini onayladı',                meta: 'REQ-2026-0138 · 1 saat önce' },
  { type: 'warning', text: "Ali Demir spend limit'inin %80'ine ulaştı",                            meta: 'Medium kademe · 2 saat önce' },
  { type: 'info',    text: 'Ece Demirel Marketing departmanı için yeni talep oluşturuldu',          meta: 'REQ-2026-0148 · 3 saat önce' },
  { type: 'success', text: 'Hakan Yılmaz Ayşe K. için yeni lisans provision etti',                 meta: 'REQ-2026-0146 · 5 saat önce' },
  { type: 'danger',  text: 'Murat Akın bir talep reddetti',                                        meta: 'REQ-2026-0144 · 8 saat önce' },
];

export const queueData = [
  { id: 'REQ-2026-0142', name: 'Burçak Göksel', type: 'Spend Kademesi Yükseltme · Medium → High', badge: '2 gün bekliyor', badgeType: 'warning', approver: 'Zeynep Şen', urgent: true },
  { id: 'REQ-2026-0138', name: 'Mert Yıldız',   type: 'Yeni Lisans · AI & Analytics',             badge: '1 gün bekliyor', badgeType: 'warning', approver: 'Zeynep Şen', urgent: true },
  { id: 'REQ-2026-0145', name: 'Ali Demir',      type: 'Custom Role · Chat → Chat + Code',         badge: '4 saat önce',   badgeType: 'info',    approver: 'Murat Akın',  urgent: false },
  { id: 'REQ-2026-0148', name: 'Ayşe Kara',      type: 'Yeni Lisans · Marketing',                  badge: '2 saat önce',   badgeType: 'info',    approver: 'Ece Demirel', urgent: false },
];

export const talepTrendData = [
  { month: 'Ara', yeni:  8, spend:  2, role: 1 },
  { month: 'Oca', yeni: 10, spend:  3, role: 2 },
  { month: 'Şub', yeni: 12, spend:  4, role: 2 },
  { month: 'Mar', yeni:  9, spend:  6, role: 3 },
  { month: 'Nis', yeni: 11, spend:  8, role: 4 },
  { month: 'May', yeni: 14, spend: 11, role: 5 },
];

export const kpiData = {
  ops: [
    { label: 'Provisioning Queue',          value: '7',    delta: '↑ 2 son 24 saat içinde',       deltaType: 'up',      variant: 'attention' },
    { label: 'Bekleyen Manager Onayı',      value: '12',   delta: 'Ortalama yanıt süresi: 6 saat', deltaType: 'neutral', variant: '' },
    { label: 'Bu Hafta Tamamlanan',         value: '24',   delta: '↑ %15 geçen haftaya göre',     deltaType: 'down',    variant: 'positive' },
    { label: 'Ortalama Provisioning Süresi', value: '8.4', suffix: 'saat', delta: '↓ 1.2 saat hedef altında', deltaType: 'down', variant: '' },
  ],
  cost: [
    { label: 'Bu Ay Toplam Spend',      value: '$4,872', delta: 'Ay sonu projeksiyonu: $6,180', deltaType: 'neutral', variant: '' },
    { label: 'Aylık Bütçe Kullanımı',  value: '68',  suffix: '%', delta: 'Bütçe: $7,000', deltaType: 'down', variant: '' },
    { label: 'Aktif Lisans',            value: '94',   delta: '↑ 6 son 30 günde',              deltaType: 'up',  variant: '' },
    { label: 'Ortalama Spend / Kullanıcı', value: '$52', delta: 'Medium kademe benchmark: $50', deltaType: 'neutral', variant: '' },
  ],
  adoption: [
    { label: 'Aylık Aktif Kullanıcı',       value: '81',   suffix: '/ 94', delta: '%86 adoption rate',         deltaType: 'down',    variant: '' },
    { label: 'Claude Code Aktif Developer', value: '18',   suffix: '/ 22', delta: '%82 developer adoption',    deltaType: 'down',    variant: '' },
    { label: 'Aylık Tool Call',             value: '12.4K',                delta: '↑ %34 son aya göre',        deltaType: 'up',      variant: '' },
    { label: 'Ortalama Session Süresi',     value: '28',   suffix: 'dk',  delta: "Developer'lar: 52 dk",       deltaType: 'neutral', variant: '' },
  ],
};
