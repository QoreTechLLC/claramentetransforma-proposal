"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Servicios", href: "#servicios" },
  { label: "Programa", href: "#programa" },
  { label: "Recursos", href: "#recursos" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-marfil/60 bg-crema/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-3 lg:px-10">
        <a href="#inicio" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Claramente Transforma"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="font-display text-lg leading-tight">
            <span className="text-caqui">Clara</span>
            <span className="text-tierra">mente</span>
            <br />
            <span className="text-[10px] font-body tracking-[0.3em] text-oliva">
              TRANSFORMA
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-carbon/80 transition hover:text-caqui"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#reservar"
          className="hidden rounded-full bg-arena px-6 py-2.5 text-sm font-medium text-carbon shadow-soft transition hover:bg-tierra hover:text-crema lg:inline-block"
        >
          Agenda tu cita
        </a>

        <button
          aria-label="Abrir menú"
          className="lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-marfil/60 bg-crema px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-carbon/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#reservar"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-arena px-6 py-2.5 text-center text-sm font-medium text-carbon"
            >
              Agenda tu cita
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
