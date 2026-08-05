import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { MagicLinkForm } from "@/components/moderation/magic-link-form";
import { ModerationCard } from "@/components/moderation/moderation-card";
import { PublishedVoiceCard } from "@/components/moderation/published-voice-card";
import { SiteMark } from "@/components/site-mark";
import { getModerationQueue, getModerator, getPublishedVoices } from "@/lib/moderation";

export const metadata = { title: "Moderación | UN DÍA MÁS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ModerationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const moderator = await getModerator();

  if (!moderator) {
    return (
      <main className="concrete-wall grid min-h-svh place-items-center px-6">
        <section className="w-full max-w-lg">
          <SiteMark />
          <LockKeyhole className="mt-16 size-5 text-sand" aria-hidden="true" />
          <h1 className="mt-7 text-4xl leading-tight sm:text-5xl">Un lugar para decidir con cuidado.</h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">Este acceso es privado. Te enviaremos un enlace seguro a tu correo de moderación.</p>
          {error === "auth" && <p className="mt-5 text-sm text-sand">El enlace no pudo verificarse. Solicita uno nuevo.</p>}
          <MagicLinkForm />
        </section>
      </main>
    );
  }

  const voices = await getModerationQueue();
  const published = await getPublishedVoices();
  return (
    <main className="concrete-wall min-h-svh px-6 py-7 sm:px-10 sm:py-9">
      <header className="mx-auto flex max-w-3xl items-center justify-between">
        <SiteMark />
        <Link className="text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" href="/voces">Ver muro</Link>
      </header>
      <section className="mx-auto max-w-3xl py-16 sm:py-24">
        <p className="text-xs tracking-[0.2em] text-sand">MODERACIÓN</p>
        <div className="mt-6 flex items-end justify-between gap-6">
          <h1 className="text-4xl leading-tight sm:text-5xl">Decidir con cuidado.</h1>
          <p className="shrink-0 text-sm text-muted">{voices.length} {voices.length === 1 ? "voz" : "voces"}</p>
        </div>
        {voices.length > 0 ? (
          <div className="mt-14 space-y-10">{voices.map((voice) => <ModerationCard key={voice.id} voice={voice} />)}</div>
        ) : (
          <p className="mt-16 border-l border-sand pl-5 text-lg leading-relaxed text-[#c6c3bd]">Por ahora, no hay voces esperando.</p>
        )}

        <div className="mt-24 border-t border-white/10 pt-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-2xl leading-tight sm:text-3xl">Publicadas.</h2>
            <p className="shrink-0 text-sm text-muted">{published.length} {published.length === 1 ? "voz" : "voces"}</p>
          </div>
          {published.length > 0 ? (
            <div className="mt-8 space-y-4">{published.map((voice) => <PublishedVoiceCard key={voice.id} voice={voice} />)}</div>
          ) : (
            <p className="mt-8 border-l border-sand pl-5 text-lg leading-relaxed text-[#c6c3bd]">Aún no hay voces publicadas.</p>
          )}
        </div>
      </section>
    </main>
  );
}