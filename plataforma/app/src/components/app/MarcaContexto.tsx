"use client"

import { createContext, use, useMemo, type ReactNode } from "react"
import type { Marca } from "@/lib/mock"
import { useEstado } from "./Estado"

const Contexto = createContext<Marca | null>(null)

/** A marca com a paleta que a pessoa escolheu depois da conversa (ou a aposta do Hattie, antes da escolha). */
export function MarcaProvider({ marca, children }: { marca: Marca; children: ReactNode }) {
  const { paletaEscolhida } = useEstado()
  const valor = useMemo(() => {
    const opcao = marca.opcoesPaleta?.find((item) => item.id === paletaEscolhida)
    return opcao ? { ...marca, paleta: opcao.cores } : marca
  }, [marca, paletaEscolhida])
  return <Contexto value={valor}>{children}</Contexto>
}

export function useMarca() {
  const marca = use(Contexto)
  if (!marca) throw new Error("useMarca precisa estar dentro do MarcaProvider")
  return marca
}
