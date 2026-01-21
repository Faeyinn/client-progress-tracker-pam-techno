export function LandingFooter() {
  return (
    <div className="text-center space-y-4 pt-2">
      <div className="text-xs text-muted-foreground/60 flex items-center justify-center gap-4">
        <span>© 2026 PAM Techno</span>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#" className="hover:text-primary transition-colors">
          Terms
        </a>
      </div>
    </div>
  );
}
