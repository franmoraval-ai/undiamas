import Link from "next/link";

export function SiteMark({ dark = true }: { dark?: boolean }) {
  return (
    <Link
      className={`inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand ${dark ? "text-sand" : "text-ink"}`}
      href="/"
      aria-label="UN DÍA MÁS, inicio"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      UDM
    </Link>
  );
}