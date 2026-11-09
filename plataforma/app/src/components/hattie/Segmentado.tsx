"use client"

import type { LucideIcon } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type Opcao = { valor: string; rotulo: string; icone: LucideIcon }

type Props = {
  rotulo: string
  opcoes: Opcao[]
  valor: string
  onChange: (valor: string) => void
  className?: string
}

export function Segmentado({ rotulo, opcoes, valor, onChange, className }: Props) {
  return (
    <ToggleGroup
      type="single"
      value={valor}
      onValueChange={(novo) => novo && onChange(novo)}
      aria-label={rotulo}
      className={cn("grid w-full grid-cols-2 gap-1 rounded-full bg-ink/6 p-1", className)}
    >
      {opcoes.map((opcao) => (
        <ToggleGroupItem
          key={opcao.valor}
          value={opcao.valor}
          className="h-9 w-full gap-2 rounded-full text-sm font-medium text-ink-soft transition-[background-color,color] duration-150 hover:bg-transparent hover:text-ink data-[state=on]:bg-lima data-[state=on]:text-preto"
        >
          <opcao.icone className="size-4" strokeWidth={2} aria-hidden />
          {opcao.rotulo}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
