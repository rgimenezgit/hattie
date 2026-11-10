"use client"

import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { IconeHattie, type NomeIcone } from "./IconeHattie"

export type Som = "plimm" | "hmm…" | "tcharam" | "cling" | "zuum" | "puff" | "toc toc" | "psiu"

export const FORMA_DO_SOM: Record<Som, NomeIcone> = {
  plimm: "asterisco",
  "hmm…": "bola-de-cristal",
  tcharam: "estrela",
  cling: "brilho",
  zuum: "raio",
  puff: "puff-nuvem",
  "toc toc": "porta",
  psiu: "olho",
}

const COR: Record<Som, string> = {
  plimm: "bg-lima",
  cling: "bg-lima",
  tcharam: "bg-lilas",
  "hmm…": "bg-cinza",
  zuum: "bg-cinza",
  puff: "bg-cinza",
  "toc toc": "bg-cinza",
  psiu: "bg-cinza",
}

type SeloProps = { som: Som; fixo?: boolean; className?: string }

export function SeloSom({ som, fixo = false, className }: SeloProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-preto",
        COR[som],
        !fixo && "animate-selo",
        className,
      )}
    >
      <IconeHattie nome={FORMA_DO_SOM[som]} tamanho={20} />
      <span className="font-heading text-titulo-3 font-semibold">{som}</span>
    </span>
  )
}

export function useSelo() {
  const [atual, setAtual] = useState<{ som: Som; chave: number } | null>(null)
  const [aviso, setAviso] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const disparar = useCallback((som: Som, mensagem = "") => {
    if (timer.current) clearTimeout(timer.current)
    setAtual({ som, chave: Date.now() })
    setAviso(mensagem)
    timer.current = setTimeout(() => setAtual(null), 600)
  }, [])

  useLayoutEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
      setAtual(null)
    }
  }, [])

  const selo = (
    <>
      <span aria-hidden className="pointer-events-none inline-flex">
        {atual && <SeloSom key={atual.chave} som={atual.som} />}
      </span>
      <span role="status" className="sr-only">
        {aviso}
      </span>
    </>
  )

  return { disparar, selo }
}
