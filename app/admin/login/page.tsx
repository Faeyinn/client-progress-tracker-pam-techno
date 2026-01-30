import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login/login-form";
import { Meteors } from "@/components/anim/meteors";

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-dvh lg:min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-16 relative overflow-hidden font-sans">
        {/* Background Meteors */}
        <div className="absolute inset-0 z-0 opacity-50">
          <Meteors number={30} />
          {/* Enhanced Gradient Overlay for readability while keeping meteors visible */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-0 animate-in fade-in slide-in-from-top-6 duration-1000">
          <div className="relative w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/10">
            <Image
              src="/logo-pure.png"
              alt="Logo"
              fill
              sizes="64px"
              className="object-contain p-2 drop-shadow-lg"
            />
          </div>
          <span className="ml-5 text-3xl font-black tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70">
            PAM Techno
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-8 max-w-lg mb-12 animate-in fade-in slide-in-from-left-6 duration-1000 delay-200">
          <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
            Admin <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10">
              Console
            </span>
          </h1>
          <p className="text-xl text-primary-foreground/60 font-medium tracking-wide leading-relaxed border-l-2 border-accent/30 pl-6">
            Pusat kendali proyek digital Kamu. Pantau, kelola, dan sampaikan
            hasil terbaik untuk klien.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground animate-in fade-in duration-1000 delay-500">
          &copy; 2026 PAM Techno. Restricted Access.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex min-h-dvh items-start justify-center bg-background px-4 py-8 sm:px-6 sm:py-12 lg:min-h-screen lg:items-center lg:px-16 relative overflow-y-auto lg:overflow-visible transition-colors duration-500">
        <div className="w-full max-w-md space-y-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {/* Mobile Logo (Visible only on lg and below) */}
          <div className="lg:hidden flex flex-col items-center space-y-4 mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="relative w-20 h-20 bg-background rounded-3xl p-3 shadow-2xl shadow-accent/10 dark:shadow-accent/5 border border-border/50">
              <Image
                src="/logo-pure.png"
                alt="Logo"
                fill
                sizes="80px"
                className="object-contain p-3"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase">
              PAM Techno
            </h1>
          </div>

          <div className="bg-card/80 backdrop-blur-xl p-10 sm:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-border/50 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] transition-all duration-300">
            <LoginForm />
          </div>

          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2 group py-2"
            >
              <span className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
