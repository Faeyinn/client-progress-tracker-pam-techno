import Image from "next/image";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center lg:items-start space-y-6">
      <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] aspect-[3/1] mb-2 lg:mb-4">
        <Image
          src="/logo.png"
          alt="PAM Techno Logo"
          fill
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 400px"
          className="object-contain object-center lg:object-left"
          priority
        />
      </div>

      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
          Pantau Progress <br className="hidden lg:block" />
          <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Proyek Anda
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
          Transparansi total untuk ketenangan pikiran Anda. Lacak setiap tahapan
          pengerjaan proyek secara real-time.
        </p>
      </div>
    </div>
  );
}
