import { Check, Clock3, X } from "lucide-react";
import type { ModerationVoice } from "@/lib/moderation";
import { moderateVoice } from "@/app/moderacion/actions";

export function ModerationCard({ voice }: { voice: ModerationVoice }) {
  return (
    <article className="paper-grain bg-paper p-7 text-ink shadow-[0_24px_60px_rgb(0_0_0_/_0.2)] sm:p-10">
      <p className="text-xs tracking-[0.14em] text-ink/45">{voice.estado === "en_revision" ? "REVISAR DESPUÉS" : "PENDIENTE"}</p>
      <p className="mt-7 whitespace-pre-wrap text-xl leading-[1.7] sm:text-2xl">{voice.texto}</p>
      <div className="mt-10 flex flex-wrap gap-3 border-t border-ink/10 pt-5">
        <form action={moderateVoice}>
          <input type="hidden" name="voiceId" value={voice.id} />
          <button className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-ink/65 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink" name="estado" value="en_revision">
            <Clock3 className="size-4" aria-hidden="true" /> Revisar después
          </button>
        </form>
        <form action={moderateVoice}>
          <input type="hidden" name="voiceId" value={voice.id} />
          <button className="inline-flex min-h-11 items-center gap-2 border border-ink/15 px-4 text-sm text-ink transition-colors hover:border-ink/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink" name="estado" value="aprobada">
            <Check className="size-4" aria-hidden="true" /> Publicar
          </button>
        </form>
        <form action={moderateVoice}>
          <input type="hidden" name="voiceId" value={voice.id} />
          <button className="inline-flex min-h-11 items-center gap-2 px-3 text-sm text-ink/50 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink" name="estado" value="rechazada">
            <X className="size-4" aria-hidden="true" /> No publicar
          </button>
        </form>
      </div>
    </article>
  );
}