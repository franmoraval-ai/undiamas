"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export function WriteVoiceForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim().length < 24) {
      setStatus("error");
      setMessage("Escribe al menos unas líneas antes de compartir.");
      return;
    }

    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/voces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: text }),
      });
      const result = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        setStatus("error");
        setMessage(result?.error ?? "No pudimos compartir tu voz. Inténtalo de nuevo más tarde.");
        return;
      }

      setStatus("sent");
      setText("");
    } catch {
      setStatus("error");
      setMessage("No pudimos conectar. Comprueba tu conexión e inténtalo de nuevo.");
    }
  }

  if (status === "sent") {
    return (
      <div className="paper-grain min-h-[480px] bg-paper p-7 text-ink shadow-[0_24px_60px_rgb(0_0_0_/_0.18)] sm:p-12">
        <p className="text-sm text-ink/55">Tu voz ya está en camino.</p>
        <p className="mt-5 max-w-md text-3xl leading-tight sm:text-4xl">Gracias por dejarla aquí.</p>
        <p className="mt-8 max-w-sm text-sm leading-relaxed text-ink/60">Una persona la revisará con cuidado antes de compartirla. Nunca se mostrará tu nombre.</p>
      </div>
    );
  }

  return (
    <form className="paper-grain min-h-[66svh] bg-paper p-7 text-ink shadow-[0_24px_60px_rgb(0_0_0_/_0.18)] sm:p-12" onSubmit={submit}>
      <label className="block max-w-xl text-3xl leading-[1.12] sm:text-5xl" htmlFor="voice-text">
        ¿Qué llevas demasiado tiempo guardando?
      </label>
      <Textarea
        id="voice-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Puedes escribirlo sin tener que explicarlo todo."
        maxLength={2800}
        aria-describedby="voice-note voice-error"
        aria-invalid={status === "error"}
        className="mt-16 min-h-[320px]"
      />
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p id="voice-note" className="text-xs text-ink/55">Nunca mostraremos tu nombre.</p>
        <button className="quiet-link min-h-11 self-start text-sm text-ink/70 hover:text-ink disabled:opacity-50" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Compartir mi voz"}
        </button>
      </div>
      <p id="voice-error" aria-live="polite" className="mt-4 text-xs text-ink/60">
        {status === "error" ? message : ""}
      </p>
    </form>
  );
}