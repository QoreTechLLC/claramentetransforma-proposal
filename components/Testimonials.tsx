const testimonials = [
  {
    quote:
      "Gracias a Clara-mente, aprendí a gestionar mi mente y hoy vivo con más calma y propósito.",
    name: "Ana R.",
  },
  {
    quote:
      "Las herramientas y el acompañamiento fueron clave para mi transformación personal y profesional.",
    name: "Carlos M.",
  },
  {
    quote: "Un espacio seguro, inspirador y profundamente transformador.",
    name: "Laura G.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-crema">
      <div className="mx-auto max-w-content px-6 py-20 text-center lg:px-10">
        <h2 className="font-display text-2xl text-caqui sm:text-3xl">
          Lo que dicen quienes ya transformaron su vida
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-marfil bg-white p-6 text-left shadow-soft"
            >
              <div className="text-arena" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-carbon/80">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-marfil font-display text-sm text-caqui">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm text-carbon/70">— {t.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
