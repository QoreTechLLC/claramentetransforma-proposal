import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claramente Transforma | Conecta. Transforma. Vive en coherencia.",
  description:
    "Acompañamiento integral para transformar tus hábitos y vivir con propósito, mente, cuerpo y espíritu en armonía. Agenda tu sesión personalizada hoy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${playfair.variable} ${poppins.variable} font-body bg-crema text-carbon antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
