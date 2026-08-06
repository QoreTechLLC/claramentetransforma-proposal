import Image from "next/image";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-crema">
      <div className="mx-auto grid max-w-content items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
        <div>
          <h1 className="font-display text-4xl leading-tight text-caqui sm:text-5xl lg:text-6xl">
            Conecta.
            <br />
            <span className="text-arena">Transforma.</span>
            <br />
            Vive en coherencia.
          </h1>

          <div className="my-6 flex items-center gap-3 text-oliva">
            <span className="h-px w-16 bg-oliva/50" />
            <span aria-hidden>✦</span>
            <span className="h-px w-16 bg-oliva/50" />
          </div>

          <p className="max-w-md text-base leading-relaxed text-carbon/80">
            Acompañamiento integral para transformar tus hábitos y vivir con
            propósito, mente, cuerpo y espíritu en armonía.
          </p>

          <a
            href="#reservar"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-caqui px-7 py-3 text-sm font-medium text-crema shadow-soft transition hover:bg-oliva"
          >
            Conoce más <span aria-hidden>🌿</span>
          </a>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] shadow-soft sm:aspect-[5/4]">
            <Image
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
              alt="Mujer con los brazos abiertos frente a montañas al atardecer"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute -bottom-6 left-4 max-w-xs rounded-2xl bg-crema/95 p-5 shadow-soft ring-1 ring-marfil sm:-bottom-8 sm:left-8">
            <span className="font-display text-2xl text-arena">&ldquo;</span>
            <p className="text-sm leading-relaxed text-carbon/85">
              No se trata de ser perfect@, se trata de ser coherente con
              quien eres y hacia dónde vas.
            </p>
            <div className="mt-3 flex items-center gap-2 text-oliva">
              <span className="h-px w-8 bg-oliva/50" />
              <span aria-hidden>🌿</span>
              <span className="h-px w-8 bg-oliva/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
