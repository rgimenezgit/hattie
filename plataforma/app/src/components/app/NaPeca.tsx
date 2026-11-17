"use client"

import { cn } from "@/lib/utils"
import type { ExemploPeca } from "@/lib/mock"
import type { CoresDesenho } from "./Ilustracao"
import { Peca } from "./PecasMarca"
import type { SistemaMarca } from "./SistemaMarca"

export type PecaExemplo = { exemplo: ExemploPeca; proporcao: [number, number]; legenda: string }

/**
 * "Assim fica numa peça": a escolha (fonte, estilo de foto, grafismo) aplicada em peças reais da marca,
 * lado a lado na mesma altura, para quem não é designer ver o resultado antes de decidir.
 * No celular, a fileira rola de lado.
 */
export function NaPeca({
  pecas,
  sistema,
  imagem,
  coresIlustracao,
  titulo = "Assim fica numa peça",
  className,
}: {
  pecas: PecaExemplo[]
  sistema: SistemaMarca
  imagem?: { fundo: string; cor: string }
  coresIlustracao?: CoresDesenho
  titulo?: string
  className?: string
}) {
  return (
    <figure className={cn("flex min-w-0 flex-col gap-2.5", className)}>
      <figcaption className="text-xs font-semibold text-texto-2">{titulo}</figcaption>
      <ul className="no-scrollbar -mx-1 flex items-end gap-3 overflow-x-auto px-1 pb-1">
        {pecas.map((peca) => (
          <li key={peca.exemplo.id} className="flex shrink-0 flex-col gap-1.5">
            <div className="h-44 @3xl:h-52">
              <Peca
                exemplo={peca.exemplo}
                proporcao={peca.proporcao}
                sistema={sistema}
                imagem={imagem}
                coresIlustracao={coresIlustracao}
                className="h-full w-auto rounded-xl shadow-(--sombra-campo)"
              />
            </div>
            <span className="text-micro text-texto-3">{peca.legenda}</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
