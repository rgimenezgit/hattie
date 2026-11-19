"use client"

import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { PARCEIROS } from "@/lib/mock"
import { especialidadeDaSecao, usePedirParceiro } from "./AcoesPonto"
import { AvatarParceiro } from "./parceiros/Comuns"

/**
 * Contratar um parceiro com destaque: pílula rosa (a cor dos parceiros na plataforma, #FF8AE5 diluído),
 * com os rostos de quem faz aquilo e a especialidade. Leva a Parceiros com o pedido já escrito.
 */
export function BotaoParceiro({ secaoId, className }: { secaoId: string; className?: string }) {
  const pedir = usePedirParceiro()
  const especialidade = especialidadeDaSecao(secaoId)
  const rostos = PARCEIROS.filter((parceiro) => parceiro.especialidades.includes(especialidade)).slice(0, 3)
  const lista = rostos.length ? rostos : PARCEIROS.slice(0, 3)

  return (
    <button
      type="button"
      onClick={() => pedir(secaoId)}
      className={cn(
        "clique group/parceiro inline-flex h-10 items-center gap-2.5 rounded-full bg-rosa/30 ps-1.5 pe-4 text-sm font-medium text-preto transition-[background-color] duration-150 hover:bg-rosa/45 pointer-coarse:h-11",
        className,
      )}
    >
      <span aria-hidden className="flex -space-x-2">
        {lista.map((parceiro) => (
          <AvatarParceiro key={parceiro.id} parceiro={parceiro} tamanho={28} className="ring-2 ring-[color-mix(in_oklch,var(--rosa)_30%,var(--canvas))]" />
        ))}
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span>Contratar um parceiro</span>
        <span className="text-micro font-normal text-texto-2">{especialidade}</span>
      </span>
      <ArrowRight className="size-4 transition-[translate] duration-150 group-hover/parceiro:translate-x-0.5 motion-reduce:transition-none" strokeWidth={2} aria-hidden />
    </button>
  )
}
