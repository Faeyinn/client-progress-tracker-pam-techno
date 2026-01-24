import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login/login-form";

export default function AdminLoginPage() {
  return (
    <div className="w-full min-h-dvh lg:min-h-screen lg:grid lg:grid-cols-2">
      {/* Left Side - Branding & Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <pattern
              id="grid"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 8 0 L 0 0 0 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-0">
          <div className="relative w-12 h-12">
            <Image
              src="/logo-pure.png"
              alt="Logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
          <span className="ml-4 text-xl font-bold tracking-tight">
            PAM Techno Admin
          </span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Manajemen Proyek yang{" "}
            <span className="text-primary-foreground">Efisien & Terukur</span>
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Dashboard komprehensif untuk memantau progress, mengelola timeline,
            dan memastikan kepuasan klien.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-sm text-primary-foreground/50">
          &copy; 2026 PAM Techno. Hanya Untuk Penggunaan Internal.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex min-h-dvh items-start justify-center bg-background px-4 py-8 sm:px-6 sm:py-12 lg:min-h-screen lg:items-center lg:px-12 relative overflow-y-auto lg:overflow-visible">
        <div className="w-full max-w-100 space-y-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
          {/* Mobile Logo (Visible only on lg and below) */}
          <div className="lg:hidden flex flex-col items-center space-y-2 mb-6 sm:mb-8 animate-in fade-in slide-in-from-top-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo-pure.png"
                alt="Logo"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold">PAM Techno</h1>
          </div>

          <LoginForm />

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
