"use client"

import { createContext, use, type ReactNode } from "react"
import type { Marca } from "@/lib/mock"

const Contexto = createContext<Marca | null>(null)

export function MarcaProvider({ marca, children }: { marca: Marca; children: ReactNode }) {
  return <Contexto value={marca}>{children}</Contexto>
}

export function useMarca() {
  const marca = use(Contexto)
  if (!marca) throw new Error("useMarca precisa estar dentro do MarcaProvider")
  return marca
}
