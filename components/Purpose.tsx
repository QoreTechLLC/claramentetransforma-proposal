import Image from "next/image";
import { Brain, HeartPulse, Compass, RefreshCw } from "lucide-react";

const pillars = [
  { icon: Brain, label: "Claridad mental y enfoque" },
  { icon: HeartPulse, label: "Bienestar físico y emocional" },
  { icon: Compass, label: "Conexión interior y propósito" },
  { icon: RefreshCw, label: "Hábitos que transforman" },
];

export default function Purpose() {
  return (
    <section id="sobre-mi" className="bg-white">
      <div className="mx-auto grid max-w-content items-center gap-12 px-6 py-20 lg:grid-cols-[0.9fr,1.3fr,0.9fr] lg:px-10">
        <div className="mx-auto flex justify-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-arena/60">
            <Image
              src="/logo.png"
              alt="Árbol símbolo de Claramente Transforma"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium tracking-wide text-tierra">
            NUESTRO PROPÓSITO
          </p>
          <h2 className="mt-2 font-display text-3xl text-caqui sm:text-4xl">
            Transformación que se siente, cambios que se viven.
          </h2>
          <span className="mt-3 block text-oliva" aria-hidden>
            🌿
          </span>
          <p className="mt-5 max-w-xl leading-relaxed text-carbon/80">
            Clara-mente transforma nace de la creencia de que el verdadero
            cambio sucede cuando alineamos nuestra mente, cuerpo y espíritu.
            Te acompaño a reconectar contigo, cultivar hábitos que te
            impulsen y diseñar una vida con propósito y bienestar integral.
          </p>
        </div>

        <ul className="space-y-6">
          {pillars.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marfil text-caqui">
                <Icon size={18} />
              </span>
              <span className="text-sm text-carbon/85">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
