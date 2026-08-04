"use client";

import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export function VoiceActions({ voiceId, initialCount }: { voiceId: string; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [hasResponded, setHasResponded] = useState(false);
  const [shared, setShared] = useState(false);

  async function respond() {
    if (hasResponded) return;
    const response = await fetch(`/api/voces/${voiceId}/yo-tambien`, { method: "POST" });
    if (!response.ok) return;
    const result = (await response.json()) as { count: number };
    setCount(result.count);
    setHasResponded(true);
  }

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
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6">
      <button
        className="inline-flex min-h-11 items-center gap-2 border border-ink/15 px-4 text-sm text-ink transition-colors hover:border-ink/55 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-default"
        onClick={respond}
        disabled={hasResponded}
      >
        <Heart className={`size-4 ${hasResponded ? "fill-current" : ""}`} aria-hidden="true" />
        {count > 0 ? `Yo también · ${count}` : "Yo también"}
      </button>
      <button
        className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-ink/65 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
        onClick={share}
      >
        <Share2 className="size-4" aria-hidden="true" />
        {shared ? "Enlace copiado" : "Compartir"}
      </button>
    </div>
  );
}