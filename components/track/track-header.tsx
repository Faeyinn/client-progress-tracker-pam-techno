import Image from "next/image";

export function TrackHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-20 transition-all duration-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/50 shadow-sm bg-white p-1">
            <Image
              src="/logo-pure.png"
              alt="PAM Techno Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight leading-tight">
              PAM Techno
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Project Tracker
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
