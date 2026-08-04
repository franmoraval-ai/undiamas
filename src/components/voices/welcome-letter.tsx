import Link from "next/link";

export function WelcomeLetter() {
  return (
    <article className="paper-grain paper-fold relative mb-10 break-inside-avoid bg-[#e5d8bf] p-8 text-ink shadow-[0_24px_62px_rgb(0_0_0_/_0.28)] sm:p-11">
      <p className="text-xs font-medium tracking-[0.18em] text-ink/50">UNA CARTA PARA QUIEN LLEGA</p>
      <h2 className="mt-9 text-2xl leading-tight sm:text-3xl">Si estás leyendo esto...</h2>
      <div className="mt-8 space-y-5 text-[17px] leading-[1.7] text-ink/80">
        <p>No sabemos quién eres.</p>
        <p>No sabemos qué pasó hoy.</p>
        <p>Ni siquiera sabemos si volverás mañana.</p>
        <p>Solo queremos que sepas algo.</p>
        <p>Este lugar existe porque alguien creyó que nadie debería cargar con todo en silencio.</p>
        <p>Si hoy necesitas quedarte unos minutos... quédate.</p>
        <p>Gracias por regalarte un día más.</p>
      </div>
      <Link className="quiet-link mt-10 text-sm text-ink/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink" href="/escribir">
        Encontré este lugar
      </Link>
    </article>
  );
}