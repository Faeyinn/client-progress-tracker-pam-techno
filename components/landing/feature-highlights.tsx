import { GalleryVerticalEnd, Lock, History } from "lucide-react";

export function FeatureHighlights() {
  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 hover:border-foreground/20 hover:shadow-xl hover:shadow-neutral-200/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
            <GalleryVerticalEnd className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="relative font-bold text-foreground text-xl mb-3 tracking-tight">
            Timeline Langsung
          </h3>
          <p className="relative text-sm text-muted-foreground leading-relaxed">
            Pantau setiap tahap pengerjaan dalam tampilan linear yang sederhana
            namun detail. Lihat progress realtime tanpa perlu bertanya-tanya.
          </p>
        </div>

        {/* Card 2 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 hover:border-foreground/20 hover:shadow-xl hover:shadow-neutral-200/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-sm">
            <Lock className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="relative font-bold text-foreground text-xl mb-3 tracking-tight">
            Akses Privat
          </h3>
          <p className="relative text-sm text-muted-foreground leading-relaxed">
            Magic link unik dan enkripsi end-to-end. Data proyek Anda hanya
            milik Anda, aman dari akses yang tidak berhak.
          </p>
        </div>

        {/* Card 3 */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/50 p-8 hover:border-foreground/20 hover:shadow-xl hover:shadow-neutral-200/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
            <History className="h-6 w-6 text-foreground" />
          </div>
          <h3 className="relative font-bold text-foreground text-xl mb-3 tracking-tight">
            Arsip Digital
          </h3>
          <p className="relative text-sm text-muted-foreground leading-relaxed">
            Semua riwayat percakapan, file, dan revisi tersimpan rapi. Cari
            dokumen lama semudah scrolling sosial media.
          </p>
        </div>
      </div>
    </section>
  );
}
