import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import { EstadoProvider } from "@/components/app/Estado";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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
      className={`${poppins.variable} ${clashDisplay.variable} h-full antialiased`}
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
