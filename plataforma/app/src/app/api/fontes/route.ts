import { cacheLife } from "next/cache"
import { FONTES_CURADAS, type FonteCatalogo } from "@/lib/fontes"

/**
 * Catálogo de fontes para o espaço de teste da Tipografia.
 * Com GOOGLE_FONTS_API_KEY no ambiente, busca a lista completa na Web Fonts Developer API do Google
 * (ordenada por popularidade, guardada em cache por um dia). Sem a chave, devolve a lista curada.
 */
export async function GET() {
  const { fontes, origem } = await listarFontes()
  return Response.json({ origem, fontes })
}

type ItemGoogle = { family: string; category: FonteCatalogo["categoria"]; variants: string[] }

async function listarFontes(): Promise<{ origem: "google" | "curada"; fontes: FonteCatalogo[] }> {
  "use cache"
  cacheLife("days")
  const chave = process.env.GOOGLE_FONTS_API_KEY
  if (!chave) return { origem: "curada", fontes: FONTES_CURADAS }
  try {
    const resposta = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${chave}`)
    if (!resposta.ok) return { origem: "curada", fontes: FONTES_CURADAS }
    const dados = (await resposta.json()) as { items: ItemGoogle[] }
    const fontes = dados.items.slice(0, 600).map((item) => ({
      familia: item.family,
      categoria: item.category,
      pesos: item.variants
        .filter((variante) => !variante.includes("italic"))
        .map((variante) => (variante === "regular" ? 400 : Number(variante)))
        .filter((peso) => !Number.isNaN(peso)),
    }))
    return { origem: "google", fontes }
  } catch {
    return { origem: "curada", fontes: FONTES_CURADAS }
  }
}
