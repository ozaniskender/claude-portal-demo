import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      localStorage.setItem("currentPersona", "Burçak");
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    }, 1000);
  };

  return (
    <>
      <Head><title>Giriş Yap · Definex</title></Head>
      <div className="min-h-screen bg-brand-soft-blue flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface rounded-card shadow-elevated p-8">

          {/* Logo */}
          <div>
            <img src="/definex-logo.svg" alt="Definex" width={52} height={52} />
          </div>

          {/* Subtitle */}
          <p className="text-content-tertiary text-sm mt-6">
            claude-portal.definex.com hesabınıza giriş yapın
          </p>

          {/* Email input */}
          <div className="mt-5">
            <input
              type="email"
              defaultValue="burcak.goksel@teamdefinex.com"
              placeholder="Kurumsal e-posta adresi"
              className="w-full border border-surface-bordered rounded-lg px-3.5 py-3 text-[14px] text-content-primary bg-surface placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Forgot link */}
          <div className="mt-2">
            <a href="#" className="text-brand-primary text-sm hover:underline">
              Hesabınıza erişemiyor musunuz?
            </a>
          </div>

          {/* Primary login button */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-3 rounded-lg font-medium text-[14px] hover:bg-brand-primary-dark transition-colors disabled:opacity-80"
          >
            {isLoggingIn ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                Giriş yapılıyor...
              </>
            ) : (
              <>
                Sonraki
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-surface-bordered" />
            <span className="text-content-tertiary text-xs">veya</span>
            <div className="flex-1 h-px bg-surface-bordered" />
          </div>

          {/* Microsoft SSO button */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 border border-surface-bordered bg-surface px-4 py-3 rounded-lg text-[14px] font-medium text-content-primary hover:bg-surface-muted transition-colors disabled:opacity-80"
          >
            <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Microsoft hesabıyla devam et
          </button>

          {/* Footer note */}
          <p className="text-content-tertiary text-xs mt-6 text-center">
            Definex Internal Portal · Yetkili kullanıcılar içindir
          </p>
        </div>
      </div>
    </>
  );
}
