"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import type { PublishedVoice } from "@/lib/moderation";
import { deleteVoice } from "@/app/moderacion/actions";

export function PublishedVoiceCard({ voice }: { voice: PublishedVoice }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm("¿Eliminar esta voz de forma permanente? Esta acción no se puede deshacer.");
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("voiceId", voice.id);
    startTransition(() => {
      void deleteVoice(formData);
    });
  }

  return (
    <article className="paper-grain flex items-start justify-between gap-4 bg-paper p-6 text-ink shadow-[0_16px_40px_rgb(0_0_0_/_0.15)]">
      <p className="whitespace-pre-wrap text-sm leading-[1.7] text-ink/80">{voice.texto}</p>
      <button
        className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-ink/15 px-3 text-sm text-ink/60 transition-colors hover:border-ink/60 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink disabled:cursor-default disabled:opacity-50"
        onClick={handleDelete}
        disabled={isPending}
      >
        <Trash2 className="size-4" aria-hidden="true" /> Eliminar
      </button>
    </article>
  );
}
