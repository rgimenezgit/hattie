import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { IconeHattie } from "./IconeHattie"

type Props = {
  titulo: string
  children: ReactNode
  acao?: ReactNode
  className?: string
}

/**
 * Nota do Hattie: o raciocínio por trás de uma proposta.
 * Card branco #F5F5F5 sobre o canvas, assinatura do Hattie num círculo lima #E6F344,
 * título em Poppins 600 e texto de leitura em 15 px. Sem contorno e sem lilás.
 */
export function NotaHattie({ titulo, children, acao, className }: Props) {
  return (
    <section aria-label={titulo} className={cn("flex flex-col gap-3 rounded-2xl bg-superficie p-4 md:p-5", className)}>
      <header className="flex items-center gap-2.5">
        <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-acao">
          <IconeHattie nome="hattie" tamanho={18} className="text-preto" />
        </span>
        <h2 className="text-sm font-semibold">{titulo}</h2>
        <span className="text-xs text-texto-3">· Hattie</span>
      </header>
      <div className="max-w-[65ch] text-corpo text-texto-2">{children}</div>
      {acao && <div className="flex flex-wrap gap-2">{acao}</div>}
    </section>
  )
}
