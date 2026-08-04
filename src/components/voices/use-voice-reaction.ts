"use client";

import { useState } from "react";

type ReactionStatus = "idle" | "sending" | "sent" | "error";

export function useVoiceReaction(voiceId: string, initialCount: number) {
  const [count, setCount] = useState(initialCount);
  const [status, setStatus] = useState<ReactionStatus>("idle");
  const [message, setMessage] = useState("");

  async function respond() {
    if (status === "sending" || status === "sent") return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch(`/api/voces/${voiceId}/yo-tambien`, { method: "POST" });
      const result = (await response.json().catch(() => null)) as { count?: number; error?: string } | null;

      if (!response.ok || typeof result?.count !== "number") {
        setStatus("error");
        setMessage(result?.error ?? "No pudimos registrar este acompanamiento ahora mismo.");
        return;
      }

      setCount(result.count);
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage("No pudimos conectar. Intentalo de nuevo en unos minutos.");
    }
  }

  return {
    count,
    hasResponded: status === "sent",
    isSubmitting: status === "sending",
    isError: status === "error",
    message,
    respond,
  };
}
