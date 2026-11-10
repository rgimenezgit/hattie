import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

type Props = { icone: LucideIcon; titulo: string; texto: string; acao?: ReactNode }

export function EmptyState({ icone: Icone, titulo, texto, acao }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-branco">
        <Icone className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <h2 className="font-heading text-titulo-3 font-medium lowercase">{titulo}</h2>
      <p className="max-w-sm text-sm text-texto-2">{texto}</p>
      {acao}
    </div>
  )
}
