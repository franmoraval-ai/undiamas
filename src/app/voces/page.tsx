import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SiteHeader } from "@/components/site-header";
import { VoiceCard } from "@/components/voices/voice-card";
import { WelcomeLetter } from "@/components/voices/welcome-letter";
import { getApprovedVoces } from "@/lib/voces";

export const metadata = { title: "Voces | UN DÍA MÁS" };
export const revalidate = 60;

export default async function VoicesPage() {
  const { voices, unavailable } = await getApprovedVoces();

  return (
    <main className="concrete-wall min-h-svh">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-10 sm:pt-20">
        <FadeIn>
          <p className="text-xs tracking-[0.2em] text-sand">VOCES</p>
          <div className="mt-6 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <h1 className="max-w-xl text-4xl font-normal leading-tight sm:text-5xl">Un muro de voces. Sin nombres. Sin explicaciones.</h1>
            <Link className="inline-flex min-h-11 items-center gap-2 self-start text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand sm:self-auto" href="/escribir">
              Compartir mi voz <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-16 columns-1 gap-5 md:columns-2 xl:columns-3">
          <WelcomeLetter />
          {voices.length > 0 ? (
            <>
            {voices.map((voice, index) => <VoiceCard key={voice.id} voice={voice} index={index} />)}
            </>
          ) : unavailable ? (
            <p className="break-inside-avoid px-2 pb-10 text-sm leading-relaxed text-muted">Las voces no están disponibles en este momento. Puedes volver a intentarlo dentro de unos minutos.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}