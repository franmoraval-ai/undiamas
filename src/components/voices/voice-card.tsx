"use client";

import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { useVoiceReaction } from "@/components/voices/use-voice-reaction";
import type { Voz } from "@/lib/voces";

const paperStyles = [
  { rotationClass: "rotate-[-0.8deg]", tone: "bg-[#e6dfd1]", size: "p-7 sm:p-9", folded: true },
  { rotationClass: "rotate-[0.5deg]", tone: "bg-[#f0eee7]", size: "p-6 sm:p-7", folded: false },
  { rotationClass: "rotate-[-0.35deg]", tone: "bg-[#d9cbb1]", size: "p-8 sm:p-11", folded: false },
  { rotationClass: "rotate-[0.75deg]", tone: "bg-[#e9e3d7]", size: "p-6 sm:p-8", folded: true },
  { rotationClass: "rotate-[-0.55deg]", tone: "bg-[#ddd6c7]", size: "p-7 sm:p-10", folded: false },
  { rotationClass: "rotate-[0.2deg]", tone: "bg-[#f2f0e9]", size: "p-6 sm:p-7", folded: false },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function VoiceCard({ voice, index }: { voice: Voz; index: number }) {
  const { count, hasResponded, isSubmitting, isError, message, respond } = useVoiceReaction(voice.id, voice.yo_tambien);
  const paper = paperStyles[index % paperStyles.length];

  async function share() {
    const url = `${window.location.origin}/voces/${voice.id}`;
    if (navigator.share) {
      await navigator.share({ title: "UN DÍA MÁS", url });
      return;
    }
    await navigator.clipboard.writeText(url);
  }

  return (
    <RevealOnView delay={(index % 3) * 0.08}>
      <article
        className={`paper-grain relative mb-7 break-inside-avoid border border-black/10 text-ink shadow-[0_20px_50px_rgb(0_0_0_/_0.24)] transition-transform duration-700 hover:translate-y-[-2px] ${paper.rotationClass} ${paper.tone} ${paper.size} ${paper.folded ? "paper-fold" : ""}`}
      >
      <Link href={`/voces/${voice.id}`} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink">
        <p className="whitespace-pre-wrap text-[17px] leading-[1.65] sm:text-[18px]">{voice.texto}</p>
      </Link>
      <div className="mt-10 flex items-end justify-between gap-4 border-t border-ink/10 pt-4">
        <time className="text-[11px] text-ink/50" dateTime={voice.fecha}>
          {formatDate(voice.fecha)}
        </time>
        <div className="flex items-center gap-3">
          <button
            className="inline-flex min-h-9 items-center gap-1.5 text-xs text-ink/65 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-default disabled:opacity-60"
            onClick={respond}
            disabled={hasResponded || isSubmitting}
            aria-label="Yo también"
            aria-describedby={isError ? `voice-card-error-${voice.id}` : undefined}
          >
            <Heart className={`size-3.5 ${hasResponded ? "fill-current" : ""}`} aria-hidden="true" />
            {isSubmitting ? "Guardando..." : count > 0 ? count : "Yo tambien"}
          </button>
          <button
            className="inline-flex size-9 items-center justify-center text-ink/55 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            onClick={share}
            aria-label="Compartir esta voz"
          >
            <Share2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p
        id={`voice-card-error-${voice.id}`}
        aria-live="polite"
        className={`mt-3 text-[11px] text-ink/55 ${isError ? "" : "sr-only"}`}
      >
        {isError ? message : ""}
      </p>
      </article>
    </RevealOnView>
  );
}