"use client"

import { useId, useState, useSyncExternalStore, type ReactNode } from "react"
import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * Opções avançadas. Cada seção do cérebro mostra primeiro o essencial, o bastante para quem quer só uma marca que funcione.
 * O resto (escala, espaçamentos, curvas, luz, regras finas) fica aqui dentro, um clique abaixo.
 * Quem trabalha com marca todo dia (designer, consultor) pode deixar sempre aberto; a escolha vale para todas as seções
 * e fica guardada neste navegador.
 */

const CHAVE = "hattie:opcoes-avancadas"
const ouvintes = new Set<() => void>()

function lerPreferencia() {
  try {
    return localStorage.getItem(CHAVE) === "sempre"
  } catch {
    return false
  }
}

function salvarPreferencia(sempre: boolean) {
  try {
    if (sempre) localStorage.setItem(CHAVE, "sempre")
    else localStorage.removeItem(CHAVE)
  } catch {
    // Sem armazenamento (janela anônima): a escolha vale só até recarregar.
  }
  ouvintes.forEach((ouvinte) => ouvinte())
}

/** Preferência "sempre mostrar opções avançadas", compartilhada entre as seções. */
export function useSempreAvancado() {
  const sempre = useSyncExternalStore(
    (ouvinte) => {
      ouvintes.add(ouvinte)
      return () => ouvintes.delete(ouvinte)
    },
    lerPreferencia,
    () => false,
  )
  return [sempre, salvarPreferencia] as const
}

type Props = {
  /** O que tem dentro, em poucas palavras: "Escala, espaçamento e teste das fontes". */
  resumo: string
  children: ReactNode
  className?: string
}

export function VerMais({ resumo, children, className }: Props) {
  const id = useId()
  const [sempre, setSempre] = useSempreAvancado()
  const [escolha, setEscolha] = useState<boolean | null>(null)
  const aberto = escolha ?? sempre

  return (
    <section aria-label="Opções avançadas" className={cn("flex flex-col gap-10", className)}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          aria-expanded={aberto}
          aria-controls={id}
          onClick={() => setEscolha(!aberto)}
          className="group/vermais flex w-full items-center gap-3 rounded-3xl bg-superficie/60 px-5 py-4 text-start transition-[background-color] duration-150 hover:bg-superficie"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-preenchimento text-texto-2">
            <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-semibold">{aberto ? "Esconder opções avançadas" : "Opções avançadas"}</span>
            <span className="text-xs text-texto-2">{resumo}</span>
          </span>
          <ChevronDown className={cn("size-5 shrink-0 text-texto-2 transition-[rotate] duration-200", aberto && "rotate-180")} strokeWidth={2} aria-hidden />
        </button>
        {aberto && (
          <label className="flex cursor-pointer items-center gap-2 self-end px-2 text-xs text-texto-2">
            <input type="checkbox" checked={sempre} onChange={(evento) => setSempre(evento.target.checked)} className="size-3.5 accent-[var(--preto)]" />
            Deixar sempre aberto, em todas as seções
          </label>
        )}
      </div>
      {aberto && (
        <div id={id} className="flex flex-col gap-10 motion-safe:animate-[aparecer_240ms_var(--ease-saida)]">
          {children}
        </div>
      )}
    </section>
  )
}
