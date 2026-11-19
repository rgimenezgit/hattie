"use client"

import { useSyncExternalStore, type ReactNode } from "react"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { cn } from "@/lib/utils"

/*
 * Segunda coluna (a da esquerda, ao lado da navegação): pode ser recolhida pelo botão antes do título da página.
 * A escolha vale para todas as áreas (cérebro, conversas, parceiros, biblioteca) e fica guardada no navegador.
 */
const CHAVE_COLUNA = "hattie:coluna-recolhida"
const ouvintesColuna = new Set<() => void>()

function lerColuna() {
  try {
    return localStorage.getItem(CHAVE_COLUNA) === "sim"
  } catch {
    return false
  }
}

function salvarColuna(recolhida: boolean) {
  try {
    if (recolhida) localStorage.setItem(CHAVE_COLUNA, "sim")
    else localStorage.removeItem(CHAVE_COLUNA)
  } catch {
    // Sem armazenamento: vale até recarregar.
  }
  ouvintesColuna.forEach((ouvinte) => ouvinte())
}

export function useColunaRecolhida() {
  const recolhida = useSyncExternalStore(
    (ouvinte) => {
      ouvintesColuna.add(ouvinte)
      return () => ouvintesColuna.delete(ouvinte)
    },
    lerColuna,
    () => false,
  )
  return [recolhida, salvarColuna] as const
}

/** Botão que recolhe e mostra a segunda coluna. Só aparece onde a coluna existe (telas largas). */
export function BotaoColuna({ className }: { className?: string }) {
  const [recolhida, setRecolhida] = useColunaRecolhida()
  return (
    <Botao
      variante="fantasma"
      tamanho="icone"
      aria-label={recolhida ? "Mostrar a coluna" : "Recolher a coluna"}
      aria-pressed={!recolhida}
      title={recolhida ? "Mostrar a coluna" : "Recolher a coluna"}
      onClick={() => setRecolhida(!recolhida)}
      className={cn("-ms-1.5 hidden shrink-0 lg:inline-flex", className)}
    >
      {recolhida ? <PanelLeftOpen /> : <PanelLeftClose />}
    </Botao>
  )
}

export function Canvas({ children, className, rotulo }: { children: ReactNode; className?: string; rotulo?: string }) {
  return (
    <section
      aria-label={rotulo}
      className={cn("@container flex min-h-0 min-w-0 flex-1 flex-col", className)}
    >
      {children}
    </section>
  )
}

/**
 * Coluna lateral sobre o palco. "esquerda" (padrão) é a segunda coluna, recolhível; "direita" é o painel
 * que abre do outro lado (plano, editar com o Hattie) e ganha o mesmo respiro da borda do palco.
 */
export function ColunaLateral({
  titulo,
  acao,
  children,
  className,
  rotulo,
  lado = "esquerda",
}: {
  titulo?: string
  acao?: ReactNode
  children: ReactNode
  className?: string
  rotulo?: string
  lado?: "esquerda" | "direita"
}) {
  const [recolhida] = useColunaRecolhida()
  return (
    <aside
      aria-label={rotulo ?? titulo}
      className={cn(
        "relative z-10 flex min-h-0 w-64 shrink-0 flex-col gap-3 rounded-3xl bg-superficie p-3 md:my-2",
        lado === "direita" ? "shadow-(--sombra-coluna-direita) md:me-2" : "shadow-(--sombra-coluna)",
        className,
        lado === "esquerda" && recolhida && "lg:hidden",
      )}
    >
      {titulo && (
        <div className="flex min-h-9 items-center justify-between gap-2 border-b border-borda-sutil pb-2">
          <h2 className="ps-1 font-heading text-titulo-3 font-medium lowercase">{titulo}</h2>
          {acao}
        </div>
      )}
      {children}
    </aside>
  )
}

export function CabecalhoCanvas({
  titulo,
  subtitulo,
  acoes,
  grande = false,
  nomeProprio = false,
  coluna = false,
}: {
  titulo: string
  subtitulo?: string
  acoes?: ReactNode
  grande?: boolean
  /** Nome de marca ou de conversa: mantém a grafia. Títulos de área e de seção ficam em minúsculas. */
  nomeProprio?: boolean
  /** A página tem segunda coluna: mostra o botão de recolher antes do título. */
  coluna?: boolean
}) {
  return (
    <header className="flex flex-col gap-0.5 border-b border-borda-sutil pb-3">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        {coluna && <BotaoColuna className="mt-px" />}
        <h1
          className={cn(
            "min-w-0 flex-1 basis-48 font-heading font-medium",
            !nomeProprio && "lowercase",
            grande ? "text-titulo-2 @3xl:text-titulo-1" : "text-titulo-3 @xl:text-titulo-2",
          )}
        >
          {titulo}
        </h1>
        {acoes && <div className="flex shrink-0 items-center gap-1">{acoes}</div>}
      </div>
      {subtitulo && <p className="font-heading text-base leading-tight font-medium text-texto-2 lowercase">{subtitulo}</p>}
    </header>
  )
}
