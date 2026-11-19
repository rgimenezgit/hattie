"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Faiscas } from "./Faiscas"

/*
 * Chapéu do Hattie animado (desenho de assets/icones/base/chapeu.svg, em duas partes: aba e copa).
 * - O chapéu inteiro pula com amassa e estica: achata ao tocar o chão, estica ao subir.
 * - A copa chacoalha para os lados, como quem procura alguma coisa lá dentro.
 * - Mouse por cima: agita mais rápido. Clique: solta as faíscas do plimm.
 * - Com "reduzir movimento", fica parado.
 */

export function ChapeuAnimado({ largura = 200, className }: { largura?: number; className?: string }) {
  const [agitado, setAgitado] = useState(false)
  const [estouro, setEstouro] = useState(0)

  return (
    <button
      type="button"
      aria-label="Chapéu do Hattie"
      tabIndex={-1}
      onPointerEnter={() => setAgitado(true)}
      onPointerLeave={() => setAgitado(false)}
      onClick={() => setEstouro((atual) => atual + 1)}
      data-agitado={agitado || undefined}
      className={cn("chapeu-palco relative grid cursor-pointer place-items-center outline-none", className)}
      style={{ width: largura, height: largura * 0.75 }}
    >
      <span aria-hidden className="chapeu-sombra absolute bottom-[4%] h-[7%] w-[56%] rounded-[50%] bg-preto/15" />

      <svg aria-hidden viewBox="0 -40 1540 680" className="chapeu-corpo relative w-full overflow-visible">
        <path
          className="chapeu-copa"
          d="M1009.11 6.53639C1112.47 22.0775 1239.27 80.6004 1298.83 125.669C1321.67 142.948 1310.25 170.412 1277.3 170.037C1218.91 169.372 1142.86 168.317 1077.89 159.588C1077.89 159.588 1108.55 291.648 1143.91 415.66C914.454 377.045 660.315 381.588 419.504 415.66C493.7 320.925 663.543 144.354 707.979 102.627C810.307 6.53639 883.927 -12.2852 1009.11 6.53639Z"
          fill="var(--preto)"
        />
        <path
          className="chapeu-aba"
          d="M1540 577.57C1540 629.677 1198.86 619.123 773.605 619.123C348.346 619.123 0 629.677 0 577.57C0 525.462 348.346 430.425 773.605 430.425C1198.86 430.425 1540 525.462 1540 577.57Z"
          fill="var(--preto)"
        />
      </svg>

      {estouro > 0 && <Faiscas key={estouro} />}
    </button>
  )
}
