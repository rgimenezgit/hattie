import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Canvas({ children, className, rotulo }: { children: ReactNode; className?: string; rotulo?: string }) {
  return (
    <section
      aria-label={rotulo}
      className={cn("@container flex min-h-0 min-w-0 flex-1 flex-col rounded-3xl bg-canvas md:rounded-[28px]", className)}
    >
      {children}
    </section>
  )
}

export function ColunaLateral({
  titulo,
  acao,
  children,
  className,
  rotulo,
}: {
  titulo?: string
  acao?: ReactNode
  children: ReactNode
  className?: string
  rotulo?: string
}) {
  return (
    <aside aria-label={rotulo ?? titulo} className={cn("flex min-h-0 w-64 shrink-0 flex-col gap-3 pt-1", className)}>
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
}: {
  titulo: string
  subtitulo?: string
  acoes?: ReactNode
  grande?: boolean
}) {
  return (
    <header className="flex flex-col gap-0.5 border-b border-borda-sutil pb-3">
      <div className="flex items-start justify-between gap-4">
        <h1
          className={cn(
            "min-w-0 font-heading font-medium",
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
