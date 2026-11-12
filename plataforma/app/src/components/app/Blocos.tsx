import type { ReactNode } from "react"

/** Cabeçalho de bloco dentro de uma seção: título em Clash minúsculo, quantidade discreta e ação à direita. */
export function CabecalhoBloco({ id, titulo, quantidade, children }: { id: string; titulo: string; quantidade?: number; children?: ReactNode }) {
  return (
    <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <h2 id={id} className="flex items-baseline gap-2 font-heading text-titulo-3 font-medium lowercase">
        {titulo}
        {quantidade !== undefined && <span className="font-sans text-xs font-medium text-texto-3 tabular-nums">{quantidade}</span>}
      </h2>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
