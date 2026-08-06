import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-caqui text-crema">
      <div className="mx-auto max-w-content px-6 py-14 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/logo.png"
              alt="Claramente Transforma"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <p className="mt-3 font-display text-lg">
              Clara<span className="text-arena">mente</span>
            </p>
            <p className="text-[10px] tracking-[0.3em] text-crema/70">
              TRANSFORMA
            </p>
          </div>

          <div>
            <p className="mb-3 font-medium text-arena">Enlaces</p>
            <ul className="space-y-2 text-sm text-crema/80">
              <li><a href="#inicio" className="hover:text-crema">Inicio</a></li>
              <li><a href="#sobre-mi" className="hover:text-crema">Sobre mí</a></li>
              <li><a href="#servicios" className="hover:text-crema">Servicios</a></li>
              <li><a href="#recursos" className="hover:text-crema">Recursos</a></li>
              <li><a href="#contacto" className="hover:text-crema">Contacto</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-medium text-arena">Síguenos</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="hover:text-arena"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-arena"><Facebook size={20} /></a>
              <a href="#" aria-label="YouTube" className="hover:text-arena"><Youtube size={20} /></a>
            </div>
          </div>

          <div>
            <p className="mb-3 font-medium text-arena">Contacto</p>
            <ul className="space-y-2 text-sm text-crema/80">
              <li>hola@claramentetransforma.com</li>
              <li>New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-crema/20 pt-6 text-xs text-crema/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Clara-mente transforma. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-crema">Política de Privacidad</a>
            <a href="#" className="hover:text-crema">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
