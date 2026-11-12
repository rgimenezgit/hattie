import type { ReactNode } from "react"
import { CircleAlert, CircleCheck, Info, TriangleAlert, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type TipoAviso = "info" | "sucesso" | "atencao" | "erro"

const TIPOS: Record<TipoAviso, { icone: LucideIcon; fundo: string; circulo: string; papel: "note" | "alert" | "status" }> = {
  info: { icone: Info, fundo: "bg-info-suave", circulo: "bg-superficie text-texto", papel: "note" },
  sucesso: { icone: CircleCheck, fundo: "bg-sucesso-suave", circulo: "bg-sucesso text-branco", papel: "status" },
  atencao: { icone: TriangleAlert, fundo: "bg-atencao-suave", circulo: "bg-atencao text-preto", papel: "note" },
  erro: { icone: CircleAlert, fundo: "bg-erro-suave", circulo: "bg-erro text-branco", papel: "alert" },
}

type Props = { tipo?: TipoAviso; titulo: string; children?: ReactNode; acao?: ReactNode; className?: string }

/**
 * Aviso dentro da página: bloco de fundo suave com ícone num círculo da cor forte.
 * info em azul diluído, sucesso em verde #1F9D55, atenção em amarelo #F2B705 (ícone preto), erro em vermelho #E0352B.
 * Título em Poppins 600 preto; texto em grafite; ação opcional à direita (ou embaixo no celular).
 */
export function Aviso({ tipo = "info", titulo, children, acao, className }: Props) {
  const estilo = TIPOS[tipo]
  return (
    <div role={estilo.papel} className={cn("flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-start", estilo.fundo, className)}>
      <div className="flex min-w-0 flex-1 gap-3">
        <span aria-hidden className={cn("grid size-7 shrink-0 place-items-center rounded-full", estilo.circulo)}>
          <estilo.icone className="size-4" strokeWidth={2.25} />
        </span>
        <div className="flex min-w-0 flex-col gap-1 pt-0.5">
          <p className="text-sm font-semibold">{titulo}</p>
          {children && <div className="text-sm text-texto-2">{children}</div>}
        </div>
      </div>
      {acao && <div className="shrink-0 ps-10 sm:ps-0">{acao}</div>}
    </div>
  )
}
