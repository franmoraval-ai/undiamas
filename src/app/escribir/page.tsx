import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteMark } from "@/components/site-mark";
import { WriteVoiceForm } from "@/components/voices/write-voice-form";

export const metadata = { title: "Escribir | UN DÍA MÁS" };

export default function WritePage() {
  return (
    <main className="quiet-grain min-h-svh px-6 py-7 sm:px-10 sm:py-9">
      <header className="flex items-center justify-between">
        <SiteMark />
        <Link className="inline-flex min-h-10 items-center gap-2 text-xs text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" href="/voces">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Voces
        </Link>
      </header>
      <section className="mx-auto max-w-3xl py-12 sm:py-20">
        <WriteVoiceForm />
        <p className="mt-8 text-center text-xs leading-relaxed text-muted">
          Si no estás a salvo ahora mismo, <Link className="text-sand underline decoration-sand/40 underline-offset-4 hover:decoration-sand" href="/apoyo">busca apoyo inmediato</Link>.
        </p>
      </section>
    </main>
  );
}