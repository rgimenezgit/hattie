"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Campo para renomear no lugar (projeto, página, pasta, item). Guarda ao sair ou no Enter; Esc cancela.
 * O foco entra um instante depois de aparecer, porque quase sempre ele nasce de um menu que ainda está fechando.
 */
export function CampoNome({ nome, rotulo, aoGuardar, aoFechar, className }: { nome: string; rotulo: string; aoGuardar: (nome: string) => void; aoFechar: () => void; className?: string }) {
  const campo = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const espera = setTimeout(() => {
      campo.current?.focus()
      campo.current?.select()
    }, 80)
    return () => clearTimeout(espera)
  }, [])
  return (
    <input
      ref={campo}
      aria-label={rotulo}
      defaultValue={nome}
      onClick={(evento) => evento.stopPropagation()}
      onBlur={(evento) => {
        const novo = evento.currentTarget.value.trim()
        if (novo && novo !== nome) aoGuardar(novo)
        aoFechar()
      }}
      onKeyDown={(evento) => {
        evento.stopPropagation()
        if (evento.key === "Enter") evento.currentTarget.blur()
        if (evento.key === "Escape") {
          evento.currentTarget.value = nome
          evento.currentTarget.blur()
        }
      }}
      className={cn("relative z-10 min-w-0 flex-1 rounded-lg bg-preenchimento px-2 py-1 outline-none focus-visible:bg-preenchimento-hover", className)}
    />
  )
}
