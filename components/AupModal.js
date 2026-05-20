import { useState, useEffect, useRef } from "react";
import { AUP_VERSION, AUP_DATE, AUP_SECTIONS } from "@/data/aupContent";

export default function AupModal({ isOpen, onClose, onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) setHasScrolledToBottom(false);
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black/60">
      <div className="bg-white rounded-card w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col shadow-elevated">

        {/* Header */}
        <div className="border-b border-surface-bordered px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-content-primary">
              Definex Claude Kullanım Politikası
            </h2>
            <p className="text-xs md:text-sm text-content-tertiary mt-0.5">
              Sürüm {AUP_VERSION} · Yürürlük: {AUP_DATE}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-content-tertiary hover:text-content-primary text-lg leading-none ml-4 p-1"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 md:px-6 py-5"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <p className="text-sm text-content-secondary mb-6 leading-relaxed">
            Bu politika, Definex çalışanlarının Anthropic Claude Enterprise
            platformunu kullanırken uymaları gereken kuralları tanımlar.
            Lütfen aşağıdaki tüm bölümleri dikkatlice okuyunuz.
          </p>

          {AUP_SECTIONS.map((section) => (
            <section key={section.id} className="mb-6">
              <h3 className="text-sm md:text-base font-semibold text-content-primary mb-2">
                {section.id}. {section.title}
              </h3>
              <p className="text-sm text-content-secondary leading-relaxed">
                {section.content}
              </p>
              {section.bullets && (
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {section.bullets.map((b, i) => (
                    <li key={i} className="text-sm text-content-secondary leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="pt-4 border-t border-surface-bordered text-center">
            <p className="text-sm text-content-tertiary italic">
              Bu politikayı okuduğumu, anladığımı ve uymayı taahhüt ettiğimi onaylıyorum.
            </p>
            <p className="text-xs text-content-tertiary mt-2">
              Sürüm {AUP_VERSION} · © 2026 Definex
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-surface-bordered px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center gap-3 shrink-0">
          <div className="text-xs text-content-tertiary flex-1">
            {hasScrolledToBottom ? (
              <span className="text-state-success flex items-center gap-1">
                ✓ Politikayı tamamen okudunuz
              </span>
            ) : (
              <span className="flex items-center gap-1">
                ↓ Kabul etmek için sona kadar okumalısınız
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-4 py-2 border border-surface-bordered rounded-lg text-content-primary hover:bg-surface-muted text-sm transition-colors"
            >
              İptal
            </button>
            <button
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasScrolledToBottom
                  ? "bg-brand-primary text-white hover:bg-brand-primary-dark"
                  : "bg-surface-muted text-content-tertiary cursor-not-allowed"
              }`}
            >
              Okudum, kabul ediyorum
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
