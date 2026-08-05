"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/moderacion` },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <form className="mt-10 max-w-sm" onSubmit={submit}>
      <label className="text-xs tracking-[0.12em] text-muted" htmlFor="moderator-email">CORREO DE MODERACIÓN</label>
      <input
        className="mt-3 min-h-12 w-full border-b border-white/20 bg-transparent px-1 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-sand"
        id="moderator-email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tu@correo.com"
        required
      />
      <button className="quiet-link mt-7 text-sm text-foreground disabled:opacity-50" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando enlace..." : "Enviar enlace privado"}
      </button>
      <p aria-live="polite" className="mt-4 text-xs leading-relaxed text-muted">
        {status === "sent" && "Revisa tu correo para continuar."}
        {status === "error" && "No pudimos enviar el enlace. Inténtalo de nuevo."}
      </p>
    </form>
  );
}