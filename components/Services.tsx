import { UserRound, Flower2, Users, Mic } from "lucide-react";

const services = [
  {
    icon: UserRound,
    title: "Sesiones Personalizadas",
    description: "Acompañamiento 1 a 1 adaptado a tus necesidades.",
  },
  {
    icon: Flower2,
    title: "Meditaciones Guiadas",
    description: "Herramientas para calmar tu mente y elevar tu energía.",
  },
  {
    icon: Users,
    title: "Talleres",
    description: "Espacios grupales para aprender, compartir y crecer.",
  },
  {
    icon: Mic,
    title: "Conferencias",
    description: "Charlas inspiradoras que te impulsan a la acción.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="bg-crema">
      <div className="mx-auto max-w-content px-6 py-20 text-center lg:px-10">
        <h2 className="font-display text-3xl text-caqui sm:text-4xl">
          Servicios
        </h2>
        <span className="mt-3 block text-oliva" aria-hidden>
          🌿
        </span>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center px-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-marfil text-caqui">
                <Icon size={26} />
              </span>
              <h3 className="mt-5 font-display text-lg text-carbon">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-carbon/70">
                {description}
              </p>
              <a
                href="#reservar"
                className="mt-3 text-sm font-medium text-tierra transition hover:text-caqui"
              >
                Más información →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
