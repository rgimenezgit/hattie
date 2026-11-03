import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
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
  description: "Hattie, o mago de marca — plataforma de criação e gestão de marca com IA e designers parceiros.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="gabinete"
      className={`${poppins.variable} ${clashDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
