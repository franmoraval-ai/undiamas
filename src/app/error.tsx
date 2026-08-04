"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="concrete-wall grid min-h-svh place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="text-xs tracking-[0.2em] text-sand">UN DÍA MÁS</p>
        <h1 className="mt-6 text-3xl leading-tight text-foreground">Este lugar necesita un momento.</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted">No pudimos cargar esta parte ahora mismo. Puedes volver a intentarlo sin perder tu lugar.</p>
        <button className="quiet-link mt-10 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand" onClick={reset}>
          Intentar de nuevo
        </button>
      </div>
    </main>
  );
}