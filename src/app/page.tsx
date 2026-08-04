import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";

export default function Home() {
  return (
    <main className="concrete-wall grid min-h-svh place-items-center overflow-hidden px-6 py-12">
      <section className="flex w-full max-w-xl flex-col items-center text-center">
        <FadeIn delay={0.1}>
          <span className="brand-mark" aria-label="UN DÍA MÁS" role="img" />
        </FadeIn>
        <FadeIn delay={0.24}>
          <h1 className="mt-12 text-sm font-medium tracking-[0.28em] text-foreground sm:text-base">
            UN DÍA MÁS
          </h1>
        </FadeIn>
        <FadeIn delay={0.42}>
          <p className="mt-10 text-2xl leading-relaxed text-[#d1cec8] sm:text-3xl">
            Si hoy solo estás viviendo un día más...<br />
            nos alegra que sigas aquí.
          </p>
        </FadeIn>
        <FadeIn delay={0.62} className="mt-16 flex flex-col items-center gap-5">
          <Link
            className="quiet-link text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand"
            href="/voces"
          >
            Leer voces
          </Link>
          <Link
            className="quiet-link text-sm text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand"
            href="/escribir"
          >
            Escribir la mía
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
