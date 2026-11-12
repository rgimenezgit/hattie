"use client"

import { useId, useState } from "react"

type Props = {
  rotulo: string
  serie: number[]
  periodos: string[]
  formatar?: (valor: number) => string
}

const LARGURA = 200
const ALTURA = 44
const MARGEM = 5

/**
 * Minilinha de tendência para cartões de indicador.
 * Linha de 2 px em cinza-médio #6B6B6B (de-ênfase), período atual marcado em lima-forte #77A00F com anel branco.
 * Passar o mouse ou o dedo mostra a semana e o valor; leitores de tela recebem a série numa tabela.
 */
export function Minilinha({ rotulo, serie, periodos, formatar = String }: Props) {
  const id = useId()
  const [ativo, setAtivo] = useState<number | null>(null)
  const minimo = Math.min(...serie)
  const maximo = Math.max(...serie)
  const faixa = maximo - minimo || 1
  const pontos = serie.map((valor, indice) => ({
    x: MARGEM + (indice / (serie.length - 1)) * (LARGURA - MARGEM * 2),
    y: MARGEM + (1 - (valor - minimo) / faixa) * (ALTURA - MARGEM * 2),
  }))
  const caminho = pontos.map((ponto, indice) => `${indice ? "L" : "M"}${ponto.x.toFixed(1)},${ponto.y.toFixed(1)}`).join(" ")
  const ultimo = pontos[pontos.length - 1]
  const mostrado = ativo ?? null

  function escolher(evento: React.PointerEvent<SVGSVGElement>) {
    const caixa = evento.currentTarget.getBoundingClientRect()
    const x = ((evento.clientX - caixa.left) / caixa.width) * LARGURA
    const indice = Math.round(((x - MARGEM) / (LARGURA - MARGEM * 2)) * (serie.length - 1))
    setAtivo(Math.max(0, Math.min(serie.length - 1, indice)))
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        preserveAspectRatio="none"
        className="block h-11 w-full touch-none overflow-visible"
        aria-hidden
        onPointerMove={escolher}
        onPointerDown={escolher}
        onPointerLeave={() => setAtivo(null)}
      >
        <path d={caminho} fill="none" stroke="var(--cinza-medio)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {mostrado !== null && (
          <line
            x1={pontos[mostrado].x}
            x2={pontos[mostrado].x}
            y1={0}
            y2={ALTURA}
            stroke="var(--borda-tag)"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {/* Pontos em HTML para não deformar com a escala do SVG. */}
      <span
        aria-hidden
        className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-acao-forte ring-2 ring-superficie"
        style={{ left: `${(ultimo.x / LARGURA) * 100}%`, top: `${(ultimo.y / ALTURA) * 100}%` }}
      />
      {mostrado !== null && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-texto ring-2 ring-superficie"
            style={{ left: `${(pontos[mostrado].x / LARGURA) * 100}%`, top: `${(pontos[mostrado].y / ALTURA) * 100}%` }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-full z-10 mb-1.5 -translate-x-1/2 rounded-lg bg-preto px-2 py-1 text-xs whitespace-nowrap text-branco shadow-(--sombra-flutuante)"
            style={{ left: `clamp(32px, ${(pontos[mostrado].x / LARGURA) * 100}%, calc(100% - 32px))` }}
          >
            <span className="text-cinza">{periodos[mostrado]}</span> <span className="font-semibold tabular-nums">{formatar(serie[mostrado])}</span>
          </span>
        </>
      )}
      <table className="sr-only" aria-labelledby={`${id}-titulo`}>
        <caption id={`${id}-titulo`}>{rotulo}, últimas {serie.length} semanas</caption>
        <tbody>
          {serie.map((valor, indice) => (
            <tr key={periodos[indice]}>
              <th scope="row">{periodos[indice]}</th>
              <td>{formatar(valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
