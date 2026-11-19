"use client"

import { useEffect, useRef, type RefObject } from "react"
import { cn } from "@/lib/utils"

/*
 * Campo mágico: malha que segue a escala de intensidade das faíscas da marca.
 * Cada célula desenha um glifo conforme a força naquele ponto: ponto · → mais + → brilho ✦ → asterisco ✱.
 * - Ambiente: manchas que fluem pela área ("fluxo") ou faixas horizontais que sobem de baixo, pulsando e vibrando ("subida").
 * - Luz: perto do mouse a escala sobe, com asteriscos no centro, brilhos em volta e mais na borda,
 *   e o caminho do mouse fica aceso e se apaga devagar, como um rastro.
 * - Clique: uma onda sai do ponto clicado e passa pela escala inteira.
 * - Com "reduzir movimento", a malha fica parada (sem luz nem ondas).
 * As cores chegam como tokens CSS ("--violeta"), uma por degrau da escala.
 */

type Cores = { ponto: string; mais: string; brilho: string; asterisco: string; /** Alguns asteriscos trocam para esta cor. */ acento?: string }

type Props = {
  cores?: Cores
  ambiente?: "fluxo" | "subida"
  /** Elemento que a malha contorna (ex.: o chapéu): nada é desenhado embaixo dele. */
  excluir?: RefObject<HTMLElement | null>
  /** Elemento que marca o teto: nada é desenhado acima da base dele. */
  limite?: RefObject<HTMLElement | null>
  /** Sem os pontos de base: só aparecem os glifos acesos (mais, brilho, asterisco). */
  semPontos?: boolean
  /** Distância entre as faixas da subida, em px (maior = menos faixas). */
  intervalo?: number
  /** Onde o ambiente aparece: "base" (mais forte embaixo), "bordas" (centro calmo, laterais vivas) ou "toda". */
  presenca?: "base" | "bordas" | "toda"
  espaco?: number
  className?: string
}

type Onda = { x: number; y: number; inicio: number }

function lerCor(nome: string) {
  if (!nome.startsWith("--")) return nome
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || "#000"
}

/** Pseudoaleatório estável por célula, para girar e variar sem piscar. */
const ruido = (i: number, j: number) => {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function desenharBrilho(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x, y - r)
  ctx.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y)
  ctx.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r)
  ctx.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y)
  ctx.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r)
  ctx.fill()
}

function desenharAsterisco(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, giro: number) {
  const largura = r * 0.42
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(giro)
  for (let k = 0; k < 4; k++) {
    ctx.rotate(Math.PI / 4)
    ctx.beginPath()
    ctx.roundRect(-largura / 2, -r, largura, r * 2, largura / 3)
    ctx.fill()
  }
  ctx.restore()
}

export function CampoMagico({
  cores = { ponto: "--violeta", mais: "--violeta", brilho: "--lima", asterisco: "--lima" },
  ambiente = "fluxo",
  excluir,
  limite,
  semPontos = false,
  intervalo = 150,
  presenca = "toda",
  espaco = 24,
  className,
}: Props) {
  const tela = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = tela.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const cor = {
      ponto: lerCor(cores.ponto),
      mais: lerCor(cores.mais),
      brilho: lerCor(cores.brilho),
      asterisco: lerCor(cores.asterisco),
      acento: cores.acento ? lerCor(cores.acento) : null,
    }
    let largura = 0
    let altura = 0
    let quadro = 0
    const mouse = { x: -9999, y: -9999, dentro: false, ultimo: null as { x: number; y: number } | null }
    /** Calor de cada célula: sobe onde o mouse passa e cai um pouco a cada quadro (o rastro). */
    let calor = new Float32Array(0)
    /** Até onde a subida vai, medido a partir de baixo. */
    let alcance = 0
    let colunas = 0
    let linhas = 0
    const ondas: Onda[] = []
    const inicio = performance.now()

    function medir() {
      const caixa = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      largura = caixa.width
      altura = caixa.height
      canvas!.width = Math.round(largura * dpr)
      canvas!.height = Math.round(altura * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      colunas = Math.ceil(largura / espaco) + 1
      linhas = Math.ceil(altura / espaco) + 1
      calor = new Float32Array(colunas * linhas)
    }

    /** Acende as células em volta de um ponto. */
    function carimbar(px: number, py: number) {
      const raio = espaco * 3.4
      const i0 = Math.max(0, Math.floor((px - raio) / espaco))
      const i1 = Math.min(colunas - 1, Math.ceil((px + raio) / espaco))
      const j0 = Math.max(0, Math.floor((py - raio) / espaco))
      const j1 = Math.min(linhas - 1, Math.ceil((py + raio) / espaco))
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const d = Math.hypot(espaco / 2 + i * espaco - px, espaco / 2 + j * espaco - py)
          if (d >= raio) continue
          const k = j * colunas + i
          calor[k] = Math.max(calor[k], (1 - d / raio) * 1.25)
        }
      }
    }

    /** Quanto o ambiente aparece em cada ponto (0 a 1). */
    function presencaEm(x: number, y: number) {
      if (presenca === "base") return Math.min(1, Math.max(0, (y / altura - 0.32) / 0.18))
      if (presenca === "bordas") return Math.min(1, Math.max(0, (Math.abs(x / largura - 0.5) * 2 - 0.42) / 0.3))
      return 1
    }

    function intensidadeAmbiente(x: number, y: number, i: number, t: number) {
      const peso = presencaEm(x, y)
      if (peso <= 0) return 0
      if (ambiente === "fluxo") {
        // Quatro ondas em direções diferentes somadas: manchas que nascem, viajam e somem.
        const soma =
          Math.sin(x * 0.0105 + t * 1.2) +
          Math.sin(y * 0.0125 - t * 1.0) +
          Math.sin((x + y) * 0.0072 + t * 0.8) +
          Math.sin(Math.hypot(x - largura * 0.75, y - altura * 0.85) * 0.0115 - t * 1.7)
        const n = (soma + 4) / 8
        return Math.pow(Math.max(0, (n - 0.4) / 0.6), 1.1) * 1.3 * peso
      }
      // Faixas horizontais que sobem de baixo, vibrando de leve em cada coluna.
      const desdeBaixo = altura - y
      const vibracao = Math.sin(t * 9 + i * 1.7) * 5
      const comprimento = intervalo
      let fase = (desdeBaixo + vibracao - t * 120) % comprimento
      if (fase < 0) fase += comprimento
      const banda = Math.exp(-((fase - comprimento / 2) ** 2) / (2 * 16 * 16))
      const subida = Math.max(0, 1 - desdeBaixo / Math.max(1, alcance))
      const pulso = 0.85 + 0.15 * Math.sin(t * 5)
      return Math.min(1.2, banda * Math.pow(subida, 0.9) * 1.2 * pulso) * peso
    }

    function desenhar(agora: number) {
      const t = reduzir ? 0 : (agora - inicio) / 1000
      ctx!.clearRect(0, 0, largura, altura)
      for (let i = ondas.length - 1; i >= 0; i--) if (agora - ondas[i].inicio > 1600) ondas.splice(i, 1)
      for (let k = 0; k < calor.length; k++) calor[k] *= 0.955
      if (mouse.dentro) carimbar(mouse.x, mouse.y)
      const caixaTela = canvas!.getBoundingClientRect()
      const teto = limite?.current ? limite.current.getBoundingClientRect().bottom - caixaTela.top + 12 : 0
      alcance = teto > 0 ? altura - teto : altura * 0.62
      const fora = excluir?.current?.getBoundingClientRect()
      const buraco = fora
        ? { x0: fora.left - caixaTela.left - 14, y0: fora.top - caixaTela.top - 14, x1: fora.right - caixaTela.left + 14, y1: fora.bottom - caixaTela.top + 14 }
        : null

      for (let j = 0, y = espaco / 2; y < altura + espaco; j++, y += espaco) {
        for (let i = 0, x = espaco / 2; x < largura + espaco; i++, x += espaco) {
          if (buraco && x > buraco.x0 && x < buraco.x1 && y > buraco.y0 && y < buraco.y1) continue
          if (limite && altura - y > alcance) continue
          let v = reduzir ? 0 : intensidadeAmbiente(x, y, i, t)
          if (j < linhas && i < colunas) v = Math.max(v, calor[j * colunas + i])
          for (const onda of ondas) {
            const idade = (agora - onda.inicio) / 1000
            const raio = idade * 420
            const d = Math.hypot(x - onda.x, y - onda.y)
            const anel = Math.exp(-((d - raio) ** 2) / (2 * 28 * 28)) * Math.max(0, 1 - idade / 1.6)
            v = Math.max(v, anel * 1.1)
          }
          const n = ruido(i, j)
          if (v < 0.25) {
            if (semPontos) continue
            ctx!.fillStyle = cor.ponto
            ctx!.beginPath()
            ctx!.arc(x, y, espaco * (0.08 + v * 0.12), 0, Math.PI * 2)
            ctx!.fill()
          } else if (v < 0.5) {
            const r = espaco * (0.22 + (v - 0.25) * 0.44)
            const traco = Math.max(1.8, espaco * 0.09)
            ctx!.fillStyle = cor.mais
            ctx!.fillRect(x - r, y - traco / 2, r * 2, traco)
            ctx!.fillRect(x - traco / 2, y - r, traco, r * 2)
          } else if (v < 0.75) {
            ctx!.fillStyle = cor.brilho
            desenharBrilho(ctx!, x, y, espaco * (0.34 + (v - 0.5) * 0.56))
          } else {
            ctx!.fillStyle = cor.acento && n > 0.7 ? cor.acento : cor.asterisco
            desenharAsterisco(ctx!, x, y, espaco * Math.min(0.6, 0.44 + (v - 0.75) * 0.5), n * Math.PI + t * 0.6)
          }
        }
      }
      if (!reduzir) quadro = requestAnimationFrame(desenhar)
    }

    function mover(evento: PointerEvent) {
      const caixa = canvas!.getBoundingClientRect()
      const x = evento.clientX - caixa.left
      const y = evento.clientY - caixa.top
      mouse.dentro = x >= 0 && y >= 0 && x <= caixa.width && y <= caixa.height
      if (mouse.dentro && mouse.ultimo) {
        // Carimba o caminho inteiro entre um evento e outro, para o rastro não ter buracos.
        const passos = Math.ceil(Math.hypot(x - mouse.ultimo.x, y - mouse.ultimo.y) / (espaco / 2))
        for (let p = 1; p <= passos; p++) carimbar(mouse.ultimo.x + ((x - mouse.ultimo.x) * p) / passos, mouse.ultimo.y + ((y - mouse.ultimo.y) * p) / passos)
      }
      mouse.x = x
      mouse.y = y
      mouse.ultimo = mouse.dentro ? { x, y } : null
    }
    function clicar(evento: PointerEvent) {
      if (reduzir) return
      const caixa = canvas!.getBoundingClientRect()
      ondas.push({ x: evento.clientX - caixa.left, y: evento.clientY - caixa.top, inicio: performance.now() })
    }
    const sair = () => {
      mouse.dentro = false
      mouse.ultimo = null
    }

    medir()
    const observador = new ResizeObserver(() => {
      medir()
      if (reduzir) desenhar(performance.now())
    })
    observador.observe(canvas)
    const alvo = canvas.parentElement ?? canvas
    if (!reduzir) {
      alvo.addEventListener("pointermove", mover)
      alvo.addEventListener("pointerdown", clicar)
      alvo.addEventListener("pointerleave", sair)
    }
    quadro = requestAnimationFrame(desenhar)

    return () => {
      cancelAnimationFrame(quadro)
      observador.disconnect()
      alvo.removeEventListener("pointermove", mover)
      alvo.removeEventListener("pointerdown", clicar)
      alvo.removeEventListener("pointerleave", sair)
    }
  }, [cores.ponto, cores.mais, cores.brilho, cores.asterisco, cores.acento, ambiente, excluir, limite, semPontos, intervalo, presenca, espaco])

  return <canvas ref={tela} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />
}
