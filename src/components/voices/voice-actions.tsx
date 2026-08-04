"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";
import { useVoiceReaction } from "@/components/voices/use-voice-reaction";

export function VoiceActions({ voiceId, initialCount }: { voiceId: string; initialCount: number }) {
  const [shared, setShared] = useState(false);
  const { count, hasResponded, isSubmitting, isError, message, respond } = useVoiceReaction(voiceId, initialCount);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "UN DÍA MÁS", url });
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
    }
  }

  return (
    <div className="mt-12 border-t border-ink/10 pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="inline-flex min-h-11 items-center gap-2 border border-ink/15 px-4 text-sm text-ink transition-colors hover:border-ink/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-default disabled:opacity-60"
          onClick={respond}
          disabled={hasResponded || isSubmitting}
          aria-describedby={isError ? `voice-action-error-${voiceId}` : undefined}
        >
          <Heart className={`size-4 ${hasResponded ? "fill-current" : ""}`} aria-hidden="true" />
          {isSubmitting ? "Guardando..." : count > 0 ? `Yo tambien · ${count}` : "Yo tambien"}
        </button>
        <button
          className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-ink/65 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
          onClick={share}
        >
          <Share2 className="size-4" aria-hidden="true" />
          {shared ? "Enlace copiado" : "Compartir"}
        </button>
      </div>
      <p
        id={`voice-action-error-${voiceId}`}
        aria-live="polite"
        className={`mt-3 text-xs text-ink/60 ${isError ? "" : "sr-only"}`}
      >
        {isError ? message : ""}
      </p>
    </div>
  );
}