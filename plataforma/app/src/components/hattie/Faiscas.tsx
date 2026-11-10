import type { CSSProperties } from "react"
import { IconeHattie } from "./IconeHattie"

/**
 * Explosão de faíscas do plimm. Oito glifos nascem na borda do botão e saem para fora,
 * em degraus de pixel. Cada um percorre a escala de intensidade da marca ao contrário:
 * nasce brilho ✦, vira mais + e termina em ponto · antes de sumir.
 * Uma cor só: lima-forte #77A00F. Com "reduzir movimento", nada aparece.
 *
 * x e y: ponto de partida na borda do botão (%). dx e dy: deslocamento em px. atraso em ms.
 */
const FAISCAS = [
  { x: 0, y: 50, dx: -16, dy: 0, atraso: 0 },
  { x: 100, y: 50, dx: 16, dy: 0, atraso: 20 },
  { x: 18, y: 0, dx: -9, dy: -13, atraso: 40 },
  { x: 55, y: 0, dx: 2, dy: -16, atraso: 0 },
  { x: 88, y: 0, dx: 11, dy: -12, atraso: 60 },
  { x: 12, y: 100, dx: -10, dy: 12, atraso: 50 },
  { x: 48, y: 100, dx: -1, dy: 14, atraso: 30 },
  { x: 84, y: 100, dx: 10, dy: 11, atraso: 10 },
]

export function Faiscas() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
      {FAISCAS.map((faisca, indice) => (
        <span
          key={indice}
          className="faisca"
          style={
            {
              left: `${faisca.x}%`,
              top: `${faisca.y}%`,
              "--dx": `${faisca.dx}px`,
              "--dy": `${faisca.dy}px`,
              animationDelay: `${faisca.atraso}ms`,
            } as CSSProperties
          }
        >
          <IconeHattie nome="brilho" tamanho={9} className="faisca-brilho" />
          <span className="faisca-mais" />
          <span className="faisca-ponto" />
        </span>
      ))}
    </span>
  )
}
