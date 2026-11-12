"use client"

import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { DesenhoIlustracao } from "@/lib/mock"

/** Cores de um desenho, todas vindas da paleta da marca. */
export type CoresDesenho = { fundo: string; principal: string; apoio: string; escuro: string; destaque: string }

type Props = {
  desenho: DesenhoIlustracao
  cores: CoresDesenho
  /** Espessura do traço em unidades do desenho (o desenho tem 160 de largura). */
  traco?: number
  /** Grão de papel por cima, em opacidade de 0 a 1. */
  grao?: number
  className?: string
  rotulo?: string
}

function Folha({ x, y, angulo, tamanho, cor, traco, linha }: { x: number; y: number; angulo: number; tamanho: number; cor: string; traco: number; linha: string }) {
  const t = tamanho
  return (
    <g transform={`translate(${x} ${y}) rotate(${angulo})`}>
      <path
        d={`M0 0 C${t * 0.3} ${-t * 0.36} ${t * 0.72} ${-t * 0.36} ${t} 0 C${t * 0.72} ${t * 0.34} ${t * 0.3} ${t * 0.34} 0 0Z`}
        fill={cor}
        stroke={linha}
        strokeWidth={traco}
        strokeLinejoin="round"
      />
      <path d={`M${t * 0.08} 0 L${t * 0.8} 0`} stroke={linha} strokeWidth={traco * 0.7} strokeLinecap="round" fill="none" />
    </g>
  )
}

/**
 * Ilustrações de exemplo no estilo botânico: formas chapadas da paleta, traço único de pontas arredondadas,
 * sem sombra e com grão leve de papel. Servem de esboço até o gerador de imagens entrar.
 */
export function Ilustracao({ desenho, cores, traco = 1.6, grao = 0.07, className, rotulo }: Props) {
  const id = useId().replace(/:/g, "")
  const { fundo, principal, apoio, escuro, destaque } = cores
  const f = (x: number, y: number, angulo: number, tamanho: number, cor = principal) => (
    <Folha key={`${x}-${y}-${angulo}`} x={x} y={y} angulo={angulo} tamanho={tamanho} cor={cor} traco={traco} linha={escuro} />
  )
  const linha = { stroke: escuro, strokeWidth: traco, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

  const desenhos: Record<DesenhoIlustracao, ReactNode> = {
    pequi: (
      <>
        <path d="M18 26 Q52 34 78 50" fill="none" {...linha} />
        {f(34, 30, -28, 24)}
        {f(50, 36, 38, 22)}
        {f(62, 41, -48, 20, apoio)}
        <circle cx="80" cy="70" r="24" fill={principal} {...linha} />
        <path d="M70 52 Q76 48 84 50" fill="none" {...linha} />
        <circle cx="114" cy="84" r="17" fill={destaque} {...linha} />
        <circle cx="114" cy="84" r="8" fill={apoio} {...linha} />
      </>
    ),
    baru: (
      <>
        <path d="M24 92 Q60 70 74 34" fill="none" {...linha} />
        {f(40, 82, -70, 22)}
        {f(56, 64, -20, 20)}
        {f(66, 48, -90, 18, apoio)}
        {[
          [98, 54, -24],
          [122, 70, 18],
          [96, 86, 8],
        ].map(([x, y, angulo]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${angulo})`}>
            <ellipse rx="15" ry="8" fill={apoio} {...linha} />
            <path d="M-9 0 Q0 -3 9 0" fill="none" {...linha} strokeWidth={traco * 0.7} />
          </g>
        ))}
      </>
    ),
    buriti: (
      <>
        <path d="M80 112 C79 92 82 74 80 52" fill="none" {...linha} strokeWidth={traco * 3} stroke={apoio} />
        <path d="M80 112 C79 92 82 74 80 52" fill="none" {...linha} />
        {[-160, -134, -110, -90, -70, -46, -20].map((angulo, indice) => f(80, 50, angulo, indice % 3 === 1 ? 40 : 44, indice % 3 === 1 ? apoio : principal))}
        {[
          [72, 60],
          [80, 63],
          [88, 60],
          [76, 68],
          [84, 68],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill={destaque} {...linha} strokeWidth={traco * 0.7} />
        ))}
        <path d="M24 112 H136" fill="none" {...linha} />
      </>
    ),
    paisagem: (
      <>
        <circle cx="106" cy="34" r="13" fill={destaque} {...linha} />
        <path d="M-4 84 Q40 58 84 76 T164 66 V124 H-4Z" fill={apoio} {...linha} />
        <path d="M-4 98 Q48 80 100 94 T164 90 V124 H-4Z" fill={principal} {...linha} />
        <path d="M44 80 C46 70 42 62 46 54" fill="none" {...linha} />
        <path d="M30 56 Q46 38 62 54 Q46 62 30 56Z" fill={principal} {...linha} />
        <path d="M118 74 C119 66 117 60 120 54" fill="none" {...linha} />
        <path d="M108 56 Q120 44 132 56 Q120 62 108 56Z" fill={principal} {...linha} />
      </>
    ),
    frasco: (
      <>
        {f(30, 104, -58, 30)}
        {f(42, 108, -96, 26, apoio)}
        {f(130, 104, -122, 30)}
        <rect x="62" y="40" width="36" height="66" rx="9" fill={apoio} {...linha} />
        <rect x="70" y="26" width="20" height="14" rx="3" fill={escuro} {...linha} />
        <rect x="67" y="58" width="26" height="26" rx="4" fill={fundo} {...linha} />
        {f(72, 72, -24, 16)}
        <path d="M118 30 C118 30 110 40 110 45 a8 8 0 0 0 16 0 C126 40 118 30 118 30Z" fill={destaque} {...linha} />
      </>
    ),
    padrao: (
      <>
        {Array.from({ length: 4 }).flatMap((_, linhaI) =>
          Array.from({ length: 6 }).map((__, coluna) => {
            const x = 6 + coluna * 28 + (linhaI % 2) * 14
            const y = 18 + linhaI * 30
            return (linhaI + coluna) % 3 === 2 ? (
              <circle key={`${linhaI}-${coluna}`} cx={x + 10} cy={y} r="4" fill={destaque} {...linha} strokeWidth={traco * 0.7} />
            ) : (
              f(x, y, (linhaI + coluna) % 2 ? -32 : 28, 20, (linhaI + coluna) % 2 ? principal : apoio)
            )
          }),
        )}
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 160 120"
      preserveAspectRatio={desenho === "paisagem" || desenho === "padrao" ? "xMidYMid slice" : "xMidYMid meet"}
      className={cn("block size-full", className)}
      style={{ backgroundColor: fundo }}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <defs>
        <filter id={`grao${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="160" height="120" fill={fundo} />
      {desenhos[desenho]}
      {grao > 0 && <rect width="160" height="120" filter={`url(#grao${id})`} opacity={grao} style={{ mixBlendMode: "multiply" }} />}
    </svg>
  )
}

/** Grafismo "linhas de folha": um ramo desenhado só no contorno, para molduras, faixas e fundos. */
export function GrafismoFolhas({ cor, traco = 1.4, className }: { cor: string; traco?: number; className?: string }) {
  const folhas = [16, 44, 72, 100, 128, 156, 184]
  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={cn("block", className)} aria-hidden>
      <path d="M0 22 C40 12 80 30 120 19 S180 12 200 21" fill="none" stroke={cor} strokeWidth={traco} strokeLinecap="round" />
      {folhas.map((x, indice) => {
        const y = 22 - Math.sin(x / 32) * 4
        const cima = indice % 2 === 0
        return (
          <path
            key={x}
            transform={`translate(${x} ${y}) rotate(${cima ? -38 : 34})`}
            d="M0 0 C4 -5 10 -5 14 0 C10 5 4 5 0 0Z"
            fill="none"
            stroke={cor}
            strokeWidth={traco}
            strokeLinejoin="round"
          />
        )
      })}
    </svg>
  )
}

/** Grafismo "carimbo de lote": selo circular com o texto do lote em volta e uma folha no centro. */
export function Carimbo({ cor, texto = "LOTE 12 · PIRENÓPOLIS · ", className }: { cor: string; texto?: string; className?: string }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 100 100" className={cn("block", className)} aria-hidden>
      <defs>
        <path id={`circulo${id}`} d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0" />
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke={cor} strokeWidth="2.4" />
      <circle cx="50" cy="50" r="26" fill="none" stroke={cor} strokeWidth="1" strokeDasharray="2 2.6" />
      <text fill={cor} fontSize="9.5" fontWeight="600" letterSpacing="1.6" style={{ fontFamily: "ui-monospace, monospace" }}>
        <textPath href={`#circulo${id}`}>{texto}</textPath>
      </text>
      <path d="M50 36 C42 42 41 52 50 64 C59 52 58 42 50 36Z" fill="none" stroke={cor} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M50 42 V60" stroke={cor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
