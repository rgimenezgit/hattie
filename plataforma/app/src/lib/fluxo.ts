/*
 * Desenho de setas para diagramas (jornada em telas e fluxograma): caminhos em ângulo reto entre lados de caixas,
 * com cantos arredondados, laços que saem e voltam pelo mesmo lado e o lugar do rótulo de cada seta.
 */

export type P = { x: number; y: number }
export type Lado = "direita" | "esquerda" | "topo" | "base"
export type Caixa = { x: number; y: number; l: number; a: number }

const horizontal = (lado: Lado) => lado === "direita" || lado === "esquerda"

/** Ponto do meio de um lado da caixa. */
export function ancora(caixa: Caixa, lado: Lado): P {
  if (lado === "direita") return { x: caixa.x + caixa.l, y: caixa.y + caixa.a / 2 }
  if (lado === "esquerda") return { x: caixa.x, y: caixa.y + caixa.a / 2 }
  if (lado === "topo") return { x: caixa.x + caixa.l / 2, y: caixa.y }
  return { x: caixa.x + caixa.l / 2, y: caixa.y + caixa.a }
}

/**
 * Pontos do caminho entre dois lados.
 * - `desvio`: nos laços (topo com topo, base com base, ou a mesma caixa), quanto a seta sai antes de fazer a curva.
 * - `quebra`: em setas que mudam de linha, onde fica a dobra (distância depois da saída).
 */
export function rota(de: Caixa, saida: Lado, para: Caixa, entrada: Lado, opcoes: { desvio?: number; quebra?: number } = {}): P[] {
  const p1 = ancora(de, saida)
  const p2 = ancora(para, entrada)
  const desvio = opcoes.desvio ?? 40

  // Laço na mesma caixa: sai por cima à direita e volta por cima à esquerda.
  if (de === para) {
    const a = { x: de.x + de.l * 0.68, y: de.y }
    const b = { x: de.x + de.l * 0.32, y: de.y }
    return [a, { x: a.x, y: a.y - desvio }, { x: b.x, y: b.y - desvio }, b]
  }
  if (saida === "topo" && entrada === "topo") {
    const y = Math.min(p1.y, p2.y) - desvio
    return [p1, { x: p1.x, y }, { x: p2.x, y }, p2]
  }
  if (saida === "base" && entrada === "base") {
    const y = Math.max(p1.y, p2.y) + desvio
    return [p1, { x: p1.x, y }, { x: p2.x, y }, p2]
  }
  if (horizontal(saida) && horizontal(entrada)) {
    if (p1.y === p2.y) return [p1, p2]
    const sinal = saida === "direita" ? 1 : -1
    const x = opcoes.quebra !== undefined ? p1.x + sinal * opcoes.quebra : (p1.x + p2.x) / 2
    return [p1, { x, y: p1.y }, { x, y: p2.y }, p2]
  }
  if (horizontal(saida)) return [p1, { x: p2.x, y: p1.y }, p2]
  if (horizontal(entrada)) return [p1, { x: p1.x, y: p2.y }, p2]
  if (p1.x === p2.x) return [p1, p2]
  const y = opcoes.quebra !== undefined ? p1.y + (saida === "base" ? 1 : -1) * opcoes.quebra : (p1.y + p2.y) / 2
  return [p1, { x: p1.x, y }, { x: p2.x, y }, p2]
}

/** Caminho SVG pelos pontos, com cantos arredondados. */
export function caminho(pontos: P[], raio = 14) {
  let d = `M ${pontos[0].x} ${pontos[0].y}`
  for (let i = 1; i < pontos.length - 1; i++) {
    const [a, b, c] = [pontos[i - 1], pontos[i], pontos[i + 1]]
    const r = Math.min(raio, Math.hypot(b.x - a.x, b.y - a.y) / 2, Math.hypot(c.x - b.x, c.y - b.y) / 2)
    const d1 = { x: Math.sign(b.x - a.x), y: Math.sign(b.y - a.y) }
    const d2 = { x: Math.sign(c.x - b.x), y: Math.sign(c.y - b.y) }
    d += ` L ${b.x - d1.x * r} ${b.y - d1.y * r} Q ${b.x} ${b.y} ${b.x + d2.x * r} ${b.y + d2.y * r}`
  }
  const fim = pontos[pontos.length - 1]
  return `${d} L ${fim.x} ${fim.y}`
}

/** Lugar do rótulo: o meio do trecho mais longo, ou o meio do trecho pedido. */
export function lugarDoRotulo(pontos: P[], trecho?: number): P {
  if (trecho !== undefined && pontos[trecho + 1]) {
    const [a, b] = [pontos[trecho], pontos[trecho + 1]]
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  }
  let melhor = { tamanho: -1, x: 0, y: 0 }
  for (let i = 1; i < pontos.length; i++) {
    const tamanho = Math.hypot(pontos[i].x - pontos[i - 1].x, pontos[i].y - pontos[i - 1].y)
    if (tamanho > melhor.tamanho) melhor = { tamanho, x: (pontos[i].x + pontos[i - 1].x) / 2, y: (pontos[i].y + pontos[i - 1].y) / 2 }
  }
  return melhor
}
