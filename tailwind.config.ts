import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        caqui: "#48573A", // verde caqui profundo
        oliva: "#7D846A", // verde oliva
        arena: "#D2B480", // arena dorada
        crema: "#F7F3E8",
        marfil: "#E2D6C2", // marfil claro
        carbon: "#333333", // gris carbón
        tierra: "#8A6E4D", // marrón tierra
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(72, 87, 58, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
