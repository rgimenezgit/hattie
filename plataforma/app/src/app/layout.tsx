import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { EstadoProvider } from "@/components/app/Estado";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Família completa da Poppins (100 a 900, com itálicos). O navegador só baixa os pesos usados na tela;
// o preload fica desligado para não puxar os 18 arquivos de uma vez.
const poppins = localFont({
  variable: "--font-text",
  src: [
    { path: "../fonts/poppins/Poppins-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/poppins/Poppins-ThinItalic.ttf", weight: "100", style: "italic" },
    { path: "../fonts/poppins/Poppins-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../fonts/poppins/Poppins-ExtraLightItalic.ttf", weight: "200", style: "italic" },
    { path: "../fonts/poppins/Poppins-Light.ttf", weight: "300", style: "normal" },
    { path: "../fonts/poppins/Poppins-LightItalic.ttf", weight: "300", style: "italic" },
    { path: "../fonts/poppins/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/poppins/Poppins-Italic.ttf", weight: "400", style: "italic" },
    { path: "../fonts/poppins/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/poppins/Poppins-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../fonts/poppins/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/poppins/Poppins-SemiBoldItalic.ttf", weight: "600", style: "italic" },
    { path: "../fonts/poppins/Poppins-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/poppins/Poppins-BoldItalic.ttf", weight: "700", style: "italic" },
    { path: "../fonts/poppins/Poppins-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../fonts/poppins/Poppins-ExtraBoldItalic.ttf", weight: "800", style: "italic" },
    { path: "../fonts/poppins/Poppins-Black.ttf", weight: "900", style: "normal" },
    { path: "../fonts/poppins/Poppins-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  display: "swap",
  preload: false,
  fallback: ["system-ui", "sans-serif"],
});

// Fonte de exemplo da marca da cliente (Raiz Natural), só para prévias de logo e de peças.
const fraunces = Fraunces({
  variable: "--font-marca",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const clashDisplay = localFont({
  variable: "--font-display",
  src: "../fonts/ClashDisplay-Variable.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hattie",
  description: "Hattie, seu mago de marca. Conta a sua ideia e ela sai do chapéu com estratégia por trás.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="gabinete"
      className={`${poppins.variable} ${clashDisplay.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>
          <EstadoProvider>{children}</EstadoProvider>
        </TooltipProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
