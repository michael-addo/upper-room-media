import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary font-display text-lg font-bold text-primary-foreground glow-gold">
          UR
        </div>
        <div>
          <div className="font-display text-lg leading-tight tracking-wide">
            UPPER ROOM MEDIA
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Church Presentation System
          </div>
        </div>
      </div>
      <Link
        to="/dashboard"
        className="rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
      >
        Open Control Room
      </Link>
    </header>
  );
}