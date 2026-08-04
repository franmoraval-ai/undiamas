import Link from "next/link";
import { SiteMark } from "@/components/site-mark";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-7 sm:px-10 sm:py-9">
      <SiteMark />
      <nav aria-label="Navegación principal" className="flex items-center gap-5 text-xs">
        <Link className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" href="/voces">
          Voces
        </Link>
        <Link className="text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" href="/apoyo">
          Apoyo
        </Link>
      </nav>
    </header>
  );
}