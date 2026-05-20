export const AUP_VERSION = "1.0";
export const AUP_DATE = "1 Mayıs 2026";

export const AUP_SECTIONS = [
  {
    id: 1,
    title: "Amaç ve Kapsam",
    content:
      "Bu politika, Definex çalışanlarının Anthropic Claude Enterprise platformunu kullanırken uymaları gereken kuralları ve sorumlulukları tanımlar. Politika; tüm Definex çalışanları, stajyerler ve Definex altyapısı üzerinden Claude'a erişen yükleniciler için geçerlidir. Bu politikayı ihlal etmek, disiplin sürecine ve erişimin iptaline yol açabilir.",
  },
  {
    id: 2,
    title: "Kabul Edilebilir Kullanım",
    content:
      "Claude, aşağıdaki iş amaçları doğrultusunda kullanılabilir:",
    bullets: [
      "Müşteri projelerinde araştırma, analiz ve raporlama süreçlerinin desteklenmesi",
      "Sunum, rapor ve e-posta taslakları oluşturmak",
      "Kod yazmak, incelemek ve hata ayıklamak",
      "İç belgeler ve prosedür dokümanları hazırlamak",
      "Eğitim materyalleri ve öğrenme içerikleri geliştirmek",
      "Fikir üretme (brainstorming) ve kavramsal tasarım çalışmaları",
    ],
  },
  {
    id: 3,
    title: "Veri Hassasiyeti ve Gizlilik",
    content:
      "Claude'a hiçbir koşulda aşağıdaki veri türleri girilemez:",
    bullets: [
      "Müşterilere ait kimlik bilgileri, finansal veriler veya sözleşme detayları",
      "TC Kimlik numarası, pasaport bilgisi gibi kişisel tanımlayıcı veriler (PII)",
      "Ticari sır, patentli metodoloji veya tescilsiz rekabet avantajı içeren bilgiler",
      "Henüz kamuya açıklanmamış finansal sonuçlar veya M&A bilgileri",
      "Sistem şifreleri, API anahtarları veya kimlik doğrulama tokenleri",
      "Definex iç fiyatlandırma, maliyet yapısı veya kar marjı bilgileri",
    ],
  },
  {
    id: 4,
    title: "Kullanım Sınırları ve Tahsisler",
    content:
      "Her kullanıcıya atanmış bir aylık token veya harcama kotası bulunmaktadır. Bu kotalar, kullanıcının seviyesi (Consultant, Lead, Principal, Expert) ve seçilen araç yetkisine (Chat / Chat+Code / Chat+Code+Cowork) göre belirlenir. Kota aşımı söz konusu olduğunda erişim otomatik olarak kısıtlanır; kota artışı için talep formu doldurulması gerekir. Kotanın kasıtlı olarak üçüncü kişilerle paylaşılması veya başkaları adına kullanılması yasaktır.",
  },
  {
    id: 5,
    title: "Etik Sınırlar ve Yasaklı Kullanımlar",
    content:
      "Aşağıdaki kullanımlar kesinlikle yasaktır:",
    bullets: [
      "Yanıltıcı, taraflı veya yanlış bilgi üretmek amacıyla Claude'u kullanmak",
      "Müşterilere Claude çıktısını insan üretimi gibi sunmak (şeffaflık yükümlülüğü vardır)",
      "Taciz, ayrımcılık veya zararlı içerik oluşturmak",
      "Rakip şirketler hakkında istihbarat toplamak veya manipülatif içerik üretmek",
      "Kişisel projeler, ikincil gelir faaliyetleri veya iş dışı amaçlar için kullanmak",
      "Telif hakkı korumalı içerikleri izinsiz çoğaltmak veya dağıtmak",
    ],
  },
  {
    id: 6,
    title: "Hesap Güvenliği",
    content:
      "Her çalışan kendi hesabından sorumludur. Hesap güvenliğini sağlamak için aşağıdaki kurallara uyulmalıdır:",
    bullets: [
      "Hesap bilgilerini (şifre, SSO token) kimseyle paylaşmamak",
      "Şüpheli erişim veya yetkisiz kullanım tespit edildiğinde derhal IT Security'e bildirmek",
      "Şirket cihazı dışında (kişisel bilgisayar, tablet) Claude'a erişmemek",
      "Halka açık veya güvensiz Wi-Fi ağlarında oturum açmamak",
      "Hesap devri söz konusu olduğunda (işten ayrılma, görev değişikliği) erişimin derhal kaldırılması için IT'yi bilgilendirmek",
    ],
  },
  {
    id: 7,
    title: "Denetim ve İzleme",
    content:
      "Definex, Claude platformu üzerindeki kullanımı yasal yükümlülükler ve iç politika gereklilikleri çerçevesinde izleyebilir. Bu izleme; kullanım sıklığı, kota tüketimi ve sistem loglarını kapsar. Bireysel konuşmaların içeriği yalnızca açık bir ihlal şüphesi veya resmi soruşturma sürecinde incelenebilir. Çalışanlar, mesleğe uygun ve profesyonel bir dil kullandıklarını varsayarak hareket etmelidir.",
  },
  {
    id: 8,
    title: "İhlal ve Yaptırımlar",
    content:
      "Bu politikanın ihlali, ihlal türüne ve ciddiyetine göre aşağıdaki sonuçlara yol açabilir:",
    bullets: [
      "Yazılı uyarı ve zorunlu yeniden eğitim",
      "Claude erişiminin geçici veya kalıcı olarak iptal edilmesi",
      "İnsan Kaynakları disiplin süreci",
      "Hukuki yaptırım (müşteri verisi ihlali, gizlilik sözleşmesi ihlali vb.)",
    ],
  },
  {
    id: 9,
    title: "Politika Güncellemeleri",
    content:
      "Bu politika, teknolojik gelişmeler, Anthropic'in hizmet koşullarındaki değişiklikler veya yasal düzenlemeler doğrultusunda güncellenebilir. Güncelleme yapıldığında tüm aktif kullanıcılara e-posta ile bildirim gönderilir ve kullanıcıların yeni versiyonu yeniden onaylamaları istenir. Güncel politikaya her zaman Definex İntranet > IT Politikaları > Claude AUP adresinden ulaşılabilir.",
  },
  {
    id: 10,
    title: "İletişim ve Destek",
    content:
      "Bu politika hakkında sorularınız için veya olası bir ihlali bildirmek için aşağıdaki kanalları kullanabilirsiniz:",
    bullets: [
      "IT Güvenlik: it-security@definex.com.tr",
      "Claude Destek & Lisans: claude-support@definex.com.tr",
      "İnsan Kaynakları: hr@definex.com.tr",
      "Jira IT Servicedesk: servicedesk.definex.com.tr (Kategori: AI Tools)",
    ],
  },
];
