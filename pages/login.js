import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email"); // "email" or "password"
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleEmailNext = () => {
    if (email.trim()) {
      setStep("password");
    }
  };

  const handlePasswordLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      localStorage.setItem("currentPersona", "Burçak");
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    }, 1000);
  };

  const handleMicrosoftLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      localStorage.setItem("currentPersona", "Burçak");
      localStorage.setItem("isAuthenticated", "true");
      router.push("/");
    }, 1000);
  };

  const handleBackToEmail = () => {
    setStep("email");
    setPassword("");
  };

  return (
    <>
      <Head><title>Giriş Yap · Definex</title></Head>
      <div className="min-h-screen bg-brand-soft-blue flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-surface rounded-card shadow-elevated p-8">

          {/* Logo */}
          <div className="flex justify-center">
            <img src="/definex-logo.svg" alt="Definex" width={96} height={96} />
          </div>

          {/* Subtitle */}
          <p className="text-content-tertiary text-sm mt-6">
            claude-portal.definex.com hesabınıza giriş yapın
          </p>

          {step === "email" ? (
            <>
              {/* Email input */}
              <div className="mt-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              {/* Next button */}
              <button
                onClick={handleEmailNext}
                disabled={!email.trim()}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-3 rounded-lg font-medium text-[14px] hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sonraki
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-surface-bordered" />
                <span className="text-content-tertiary text-xs">veya</span>
                <div className="flex-1 h-px bg-surface-bordered" />
              </div>

              {/* Microsoft SSO button */}
              <button
                onClick={handleMicrosoftLogin}
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
            </>
          ) : (
            <>
              {/* Email display */}
              <div className="mt-5 p-3.5 bg-surface-muted rounded-lg border border-surface-bordered">
                <p className="text-[14px] text-content-secondary">{email}</p>
              </div>

              {/* Password input */}
              <div className="mt-5">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreniz"
                  className="w-full border border-surface-bordered rounded-lg px-3.5 py-3 text-[14px] text-content-primary bg-surface placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                />
              </div>

              {/* Forgot password link */}
              <div className="mt-2">
                <a href="#" className="text-brand-primary text-sm hover:underline">
                  Şifrenizi mi unuttunuz?
                </a>
              </div>

              {/* Login button */}
              <button
                onClick={handlePasswordLogin}
                disabled={isLoggingIn || !password.trim()}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-brand-primary text-white px-4 py-3 rounded-lg font-medium text-[14px] hover:bg-brand-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    Giriş Yap
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Back button */}
              <button
                onClick={handleBackToEmail}
                disabled={isLoggingIn}
                className="mt-3 w-full flex items-center justify-center gap-2 border border-surface-bordered bg-surface px-4 py-3 rounded-lg font-medium text-[14px] text-content-primary hover:bg-surface-muted transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Geri
              </button>
            </>
          )}

          {/* Footer note */}
          <p className="text-content-tertiary text-xs mt-6 text-center">
            Definex Internal Portal · Yetkili kullanıcılar içindir
          </p>
        </div>
      </div>
    </>
  );
}
