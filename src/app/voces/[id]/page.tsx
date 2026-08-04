import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { SiteMark } from "@/components/site-mark";
import { VoiceActions } from "@/components/voices/voice-actions";
import { getApprovedVoz } from "@/lib/voces";

export const metadata = { title: "Voz | UN DÍA MÁS" };

export default async function VoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voice = await getApprovedVoz(id);
  if (!voice) notFound();

  return (
    <main className="quiet-grain min-h-svh bg-[#09090a] px-6 py-7 sm:px-10 sm:py-9">
      <header className="flex items-center justify-between">
        <SiteMark />
        <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" href="/voces">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Volver a voces
        </Link>
      </header>
      <article className="paper-grain mx-auto my-12 max-w-3xl bg-paper px-7 py-12 text-ink shadow-[0_35px_90px_rgb(0_0_0_/_0.35)] sm:my-20 sm:px-16 sm:py-20">
        <p className="whitespace-pre-wrap text-xl leading-[1.8] sm:text-2xl">{voice.texto}</p>
        <VoiceActions voiceId={voice.id} initialCount={voice.yo_tambien} />
      </article>
    </main>
  );
}