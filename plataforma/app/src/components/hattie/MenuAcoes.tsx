"use client"

import { useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { EllipsisVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type ItemMenu = {
  rotulo: string
  icone: LucideIcon
  onSelect?: () => void
  separarAntes?: boolean
  abrePainel?: boolean
  emBreve?: boolean
}

type Props = { rotulo: string; itens: ItemMenu[]; className?: string }

export function MenuAcoes({ rotulo, itens, className }: Props) {
  const depoisDeFechar = useRef<(() => void) | null>(null)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={rotulo}
        onClick={(evento) => evento.stopPropagation()}
        className={cn(
          "relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-texto-2 transition-[background-color,color] duration-150 hover:bg-preenchimento hover:text-ink data-[state=open]:bg-preenchimento",
          className,
        )}
      >
        <EllipsisVertical className="size-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-max min-w-52 rounded-2xl p-1"
        onCloseAutoFocus={(evento) => {
          const acao = depoisDeFechar.current
          if (!acao) return
          evento.preventDefault()
          depoisDeFechar.current = null
          acao()
        }}
      >
        {itens.map((item) => (
          <div key={item.rotulo}>
            {item.separarAntes && <DropdownMenuSeparator />}
            <DropdownMenuItem
              disabled={item.emBreve}
              onSelect={() => {
                if (item.abrePainel && item.onSelect) depoisDeFechar.current = item.onSelect
                else item.onSelect?.()
              }}
              className="h-9 gap-2.5 rounded-xl px-2.5 text-sm"
            >
              <item.icone className="size-4" strokeWidth={2} aria-hidden />
              {item.rotulo}
              {item.emBreve && <span className="ms-auto ps-4 text-xs text-texto-2">em breve</span>}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
