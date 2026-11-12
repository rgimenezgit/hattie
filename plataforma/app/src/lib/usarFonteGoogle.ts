"use client"

import { useEffect } from "react"
import { urlGoogleFonts } from "./fontes"

/** Injeta (uma vez por família e conjunto de pesos) o CSS do Google Fonts no documento. */
export function carregarFonteGoogle(familia: string, pesos: number[] = [400]) {
  if (typeof document === "undefined" || !familia) return
  const url = urlGoogleFonts(familia, pesos.length ? pesos : [400])
  if (document.head.querySelector(`link[data-fonte-google="${CSS.escape(url)}"]`)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url
  link.dataset.fonteGoogle = url
  document.head.appendChild(link)
}

/** Carrega uma lista de fontes do Google quando o componente aparece. */
export function useFontesGoogle(fontes: { familia: string; pesos?: number[] }[]) {
  const chave = fontes.map((fonte) => `${fonte.familia}:${(fonte.pesos ?? [400]).join(",")}`).join("|")
  useEffect(() => {
    chave
      .split("|")
      .filter(Boolean)
      .forEach((item) => {
        const [familia, pesos] = item.split(":")
        carregarFonteGoogle(familia, pesos.split(",").map(Number))
      })
  }, [chave])
}
