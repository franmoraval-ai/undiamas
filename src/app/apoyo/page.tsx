import { ArrowUpRight, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Apoyo | UN DÍA MÁS" };

const resources = [
  {
    label: "Hablar con alguien ahora",
    text: "Si sientes que podrías hacerte daño o no estás a salvo, contacta al servicio de emergencias de tu zona o a alguien de confianza ahora mismo.",
    href: "https://findahelpline.com/es-ES",
  },
  {
    label: "Encontrar una línea de escucha",
    text: "Encuentra apoyo gratuito y confidencial según tu país e idioma.",
    href: "https://findahelpline.com/es-ES",
  },
  {
    label: "Pedir acompañamiento",
    text: "No necesitas tener las palabras exactas. Puedes empezar diciendo: necesito que estés conmigo un momento.",
    href: "mailto:?subject=Necesito%20hablar%20contigo",
  },
];

export default function SupportPage() {
  return (
    <main className="quiet-grain min-h-svh">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 sm:px-10 sm:pt-24">
        <div className="max-w-2xl">
          <Phone className="size-5 text-sand" aria-hidden="true" />
          <h1 className="mt-8 text-4xl font-normal leading-tight sm:text-6xl">Buscar ayuda también es una forma de seguir.</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#c6c3bd]">No tienes que resolverlo todo hoy. A veces, el siguiente paso es dejar que alguien se siente contigo en esto.</p>
        </div>
        <div className="mt-20 divide-y divide-white/10 border-y border-white/10">
          {resources.map((resource) => (
            <a key={resource.label} className="group flex gap-6 py-7 transition-colors hover:text-sand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sand sm:items-center sm:justify-between" href={resource.href} target={resource.href.startsWith("http") ? "_blank" : undefined} rel={resource.href.startsWith("http") ? "noreferrer" : undefined}>
              <div>
                <h2 className="text-base">{resource.label}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{resource.text}</p>
              </div>
              <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-sand" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}