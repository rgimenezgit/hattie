/** Fonte do catálogo do Google Fonts: família, categoria e pesos disponíveis (sem itálico). */
export type FonteCatalogo = { familia: string; categoria: "serif" | "sans-serif" | "display" | "handwriting" | "monospace"; pesos: number[] }

const P = (...pesos: number[]) => pesos

/** Lista curada usada quando não há chave da API do Google Fonts. Fontes populares de cada categoria. */
export const FONTES_CURADAS: FonteCatalogo[] = [
  { familia: "Fraunces", categoria: "serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "DM Serif Display", categoria: "serif", pesos: P(400) },
  { familia: "Cormorant Garamond", categoria: "serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Playfair Display", categoria: "serif", pesos: P(400, 500, 600, 700, 800) },
  { familia: "Lora", categoria: "serif", pesos: P(400, 500, 600, 700) },
  { familia: "Merriweather", categoria: "serif", pesos: P(300, 400, 700, 900) },
  { familia: "Source Serif 4", categoria: "serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Libre Baskerville", categoria: "serif", pesos: P(400, 700) },
  { familia: "EB Garamond", categoria: "serif", pesos: P(400, 500, 600, 700) },
  { familia: "Instrument Serif", categoria: "serif", pesos: P(400) },
  { familia: "Young Serif", categoria: "serif", pesos: P(400) },
  { familia: "Bitter", categoria: "serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Inter", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Work Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "DM Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Karla", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Nunito Sans", categoria: "sans-serif", pesos: P(300, 400, 600, 700) },
  { familia: "Manrope", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Outfit", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Plus Jakarta Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Figtree", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Poppins", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Montserrat", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Lato", categoria: "sans-serif", pesos: P(300, 400, 700, 900) },
  { familia: "Open Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Roboto", categoria: "sans-serif", pesos: P(300, 400, 500, 700) },
  { familia: "IBM Plex Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Albert Sans", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Space Grotesk", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Sora", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Archivo", categoria: "sans-serif", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Fredoka", categoria: "display", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Bricolage Grotesque", categoria: "display", pesos: P(300, 400, 500, 600, 700) },
  { familia: "Syne", categoria: "display", pesos: P(400, 500, 600, 700, 800) },
  { familia: "Abril Fatface", categoria: "display", pesos: P(400) },
  { familia: "Caveat", categoria: "handwriting", pesos: P(400, 500, 600, 700) },
  { familia: "Kalam", categoria: "handwriting", pesos: P(300, 400, 700) },
  { familia: "IBM Plex Mono", categoria: "monospace", pesos: P(300, 400, 500, 600, 700) },
  { familia: "JetBrains Mono", categoria: "monospace", pesos: P(300, 400, 500, 600, 700) },
  { familia: "DM Mono", categoria: "monospace", pesos: P(300, 400, 500) },
]

/** URL da API de CSS do Google Fonts para uma família e seus pesos (sem chave, display swap). */
export function urlGoogleFonts(familia: string, pesos: number[]) {
  const nome = familia.trim().replace(/\s+/g, "+")
  const lista = [...new Set(pesos)].sort((a, b) => a - b).join(";")
  return `https://fonts.googleapis.com/css2?family=${nome}:wght@${lista}&display=swap`
}

/** Endereço da página da fonte no Google Fonts. */
export function urlEspecime(familia: string) {
  return `https://fonts.google.com/specimen/${familia.trim().replace(/\s+/g, "+")}`
}

/** Pilha de CSS com a fonte do Google e uma de apoio da mesma categoria. */
export function pilhaDaFonte(familia: string, categoria: FonteCatalogo["categoria"] = "sans-serif") {
  const apoio = categoria === "serif" ? "Georgia, serif" : categoria === "monospace" ? "ui-monospace, monospace" : "system-ui, sans-serif"
  return `"${familia}", ${apoio}`
}
