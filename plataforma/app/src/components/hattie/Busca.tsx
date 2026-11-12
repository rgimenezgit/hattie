"use client"

import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  valor: string
  aoMudar: (valor: string) => void
  rotulo: string
  placeholder?: string
  className?: string
}

/** Busca compacta: 32 px, preenchimento neutro, sem contorno. Esc limpa. */
export function Busca({ valor, aoMudar, rotulo, placeholder = "Buscar", className }: Props) {
  return (
    <label
      className={cn(
        "group/busca flex h-8 items-center gap-1.5 rounded-full bg-preenchimento ps-2.5 pe-1 text-detalhe transition-[background-color,box-shadow] duration-150",
        "hover:bg-preenchimento-hover focus-within:bg-superficie focus-within:shadow-(--sombra-campo)",
        className,
      )}
    >
      <Search className="size-3.5 shrink-0 text-texto-3" strokeWidth={2.25} aria-hidden />
      <span className="sr-only">{rotulo}</span>
      <input
        type="search"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        onKeyDown={(evento) => {
          if (evento.key === "Escape" && valor) {
            evento.stopPropagation()
            aoMudar("")
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-texto-3 [&::-webkit-search-cancel-button]:hidden"
      />
      {valor && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={() => aoMudar("")}
          className="clique grid size-6 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento-hover hover:text-texto"
        >
          <X className="size-3.5" strokeWidth={2.25} />
        </button>
      )}
    </label>
  )
}
