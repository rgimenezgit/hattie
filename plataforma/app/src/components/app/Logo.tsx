"use client"

import { useId, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import type { Cor, SimboloLogo } from "@/lib/mock"

export type TipoLogo = "composta" | "simbolo" | "tipografica"

export type VariacaoCor = { id: string; nome: string; descricao: string; fundo: string; tinta: string }

function luz(hex: string) {
  const [r, g, b] = [1, 3, 5].map((inicio) => {
    const canal = parseInt(hex.slice(inicio, inicio + 2), 16) / 255
    return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contraste(a: string, b: string) {
  const [claro, escuro] = [luz(a), luz(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

/**
 * Variações de cor a partir da paleta da marca da cliente: positiva (principal sobre o fundo claro),
 * negativa (claro sobre a principal), uma por cor de apoio (tinta com o maior contraste) e as monocromáticas.
 */
export function variacoesDeCor(paleta: Cor[]): VariacaoCor[] {
  const principal = paleta[0]
  const claro = [...paleta].sort((a, b) => luz(b.hex) - luz(a.hex))[0]
  const lista: VariacaoCor[] = [
    { id: "positiva", nome: "Positiva", descricao: `${principal.nome} sobre ${claro.nome}`, fundo: claro.hex, tinta: principal.hex },
    { id: "negativa", nome: "Negativa", descricao: `${claro.nome} sobre ${principal.nome}`, fundo: principal.hex, tinta: claro.hex },
  ]
  paleta
    .filter((cor) => cor.hex !== principal.hex && cor.hex !== claro.hex)
    .forEach((cor) => {
      const tinta = paleta.filter((outra) => outra.hex !== cor.hex).sort((a, b) => contraste(b.hex, cor.hex) - contraste(a.hex, cor.hex))[0]
      lista.push({ id: `sobre-${cor.nome}`, nome: `Sobre ${cor.nome}`, descricao: `${tinta.nome} sobre ${cor.nome}`, fundo: cor.hex, tinta: tinta.hex })
    })
  lista.push(
    { id: "preto", nome: "Monocromática preta", descricao: "Preto sobre branco, para carimbo e impressão a uma cor", fundo: "#F5F5F5", tinta: "#101010" },
    { id: "branco", nome: "Monocromática branca", descricao: "Branco sobre preto ou foto escura", fundo: "#101010", tinta: "#F5F5F5" },
  )
  return lista
}

const GOTA = "M24 3C24 3 9 19.5 9 30a15 15 0 0 0 30 0C39 19.5 24 3 24 3Z"
const RAIZES = "M24 18v22M24 28l-6 5.5M24 32l6 5M24 23l-4.5 3.5"
const FOLHA = "M24 13.5c-6.5 5-7.5 12.5 0 21 7.5-8.5 6.5-16 0-21Z"

/** Símbolo em SVG, de uma cor só (tinta). Os vazados usam máscara, então funcionam sobre qualquer fundo. */
export function Simbolo({ simbolo, tinta, tamanho, className, style }: { simbolo: SimboloLogo; tinta: string; tamanho: number; className?: string; style?: CSSProperties }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg viewBox="0 0 48 48" width={tamanho} height={tamanho} className={cn("shrink-0", className)} style={style} aria-hidden>
      {simbolo === "gota" && (
        <>
          <mask id={`m${id}`}>
            <path d={GOTA} fill="white" />
            <path d={RAIZES} stroke="black" strokeWidth={2.4} strokeLinecap="round" fill="none" />
          </mask>
          <rect width="48" height="48" fill={tinta} mask={`url(#m${id})`} />
        </>
      )}
      {simbolo === "selo" && (
        <>
          <circle cx="24" cy="24" r="20.5" fill="none" stroke={tinta} strokeWidth={3} />
          <circle cx="24" cy="24" r="16" fill="none" stroke={tinta} strokeWidth={1.2} strokeDasharray="2 2.4" />
          <mask id={`m${id}`}>
            <path d={FOLHA} fill="white" />
            <path d="M24 17v15" stroke="black" strokeWidth={1.6} strokeLinecap="round" />
          </mask>
          <rect width="48" height="48" fill={tinta} mask={`url(#m${id})`} />
        </>
      )}
      {simbolo === "monograma" && (
        <>
          <text
            x="24"
            y="31"
            textAnchor="middle"
            fontSize="25"
            fontWeight={500}
            letterSpacing="-1.5"
            fill={tinta}
            style={{ fontFamily: "var(--font-marca), Georgia, serif" }}
          >
            RN
          </text>
          <path d="M9 38c8-7 22-7 30 0" fill="none" stroke={tinta} strokeWidth={2.2} strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/** Logo montado em HTML: composta (símbolo + nome), só símbolo ou só tipografia. altura = altura do símbolo. */
export function Logo({
  tipo,
  simbolo,
  nome,
  tinta,
  altura = 40,
  className,
  style,
}: {
  tipo: TipoLogo
  simbolo: SimboloLogo
  nome: string
  tinta: string
  altura?: number
  className?: string
  style?: CSSProperties
}) {
  if (tipo === "simbolo") return <Simbolo simbolo={simbolo} tinta={tinta} tamanho={altura} className={className} />
  const texto = (
    <span className="font-serif leading-none font-medium tracking-[-0.01em] whitespace-nowrap" style={{ color: tinta, fontSize: altura * (tipo === "composta" ? 0.62 : 0.78) }}>
      {nome}
    </span>
  )
  if (tipo === "tipografica")
    return (
      <span className={cn("inline-flex", className)} style={style}>
        {texto}
      </span>
    )
  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: altura * 0.28, ...style }}>
      <Simbolo simbolo={simbolo} tinta={tinta} tamanho={altura} />
      {texto}
    </span>
  )
}

/** SVG para baixar. O texto usa a fonte da marca pelo nome, com uma serifa de apoio. */
export function svgDoLogo({ tipo, simbolo, nome, tinta }: { tipo: TipoLogo; simbolo: SimboloLogo; nome: string; tinta: string }) {
  const corpo = 30
  const larguraTexto = Math.round(nome.length * corpo * 0.56)
  const fonte = `font-family="Fraunces, Georgia, serif" font-weight="500" font-size="${corpo}" fill="${tinta}"`
  const simboloSvg = (x: number) => {
    const g = (conteudo: string) => `<g transform="translate(${x} 0)">${conteudo}</g>`
    if (simbolo === "gota")
      return g(
        `<mask id="m"><path d="${GOTA}" fill="white"/><path d="${RAIZES}" stroke="black" stroke-width="2.4" stroke-linecap="round" fill="none"/></mask><rect width="48" height="48" fill="${tinta}" mask="url(#m)"/>`,
      )
    if (simbolo === "selo")
      return g(
        `<circle cx="24" cy="24" r="20.5" fill="none" stroke="${tinta}" stroke-width="3"/><circle cx="24" cy="24" r="16" fill="none" stroke="${tinta}" stroke-width="1.2" stroke-dasharray="2 2.4"/><mask id="m"><path d="${FOLHA}" fill="white"/><path d="M24 17v15" stroke="black" stroke-width="1.6" stroke-linecap="round"/></mask><rect width="48" height="48" fill="${tinta}" mask="url(#m)"/>`,
      )
    return g(
      `<text x="24" y="31" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-size="25" font-weight="500" letter-spacing="-1.5" fill="${tinta}">RN</text><path d="M9 38c8-7 22-7 30 0" fill="none" stroke="${tinta}" stroke-width="2.2" stroke-linecap="round"/>`,
    )
  }
  if (tipo === "simbolo") return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="480" height="480">${simboloSvg(0)}</svg>`
  if (tipo === "tipografica")
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larguraTexto} 40" width="${larguraTexto * 6}" height="240"><text x="0" y="30" ${fonte}>${nome}</text></svg>`
  const largura = 48 + 14 + larguraTexto
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${largura} 48" width="${largura * 6}" height="288">${simboloSvg(0)}<text x="62" y="34" ${fonte}>${nome}</text></svg>`
}

function baixarBlob(blob: Blob, arquivo: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = arquivo
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Baixa o logo em SVG ou PNG (PNG desenhado a partir do SVG, em alta resolução e fundo transparente). */
export async function baixarLogo(formato: "svg" | "png", dados: Parameters<typeof svgDoLogo>[0], arquivo: string) {
  const svg = svgDoLogo(dados)
  if (formato === "svg") {
    baixarBlob(new Blob([svg], { type: "image/svg+xml" }), `${arquivo}.svg`)
    return
  }
  const imagem = new Image()
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  await new Promise<void>((resolver, falhar) => {
    imagem.onload = () => resolver()
    imagem.onerror = () => falhar(new Error("imagem"))
    imagem.src = url
  })
  const canvas = document.createElement("canvas")
  canvas.width = imagem.naturalWidth
  canvas.height = imagem.naturalHeight
  canvas.getContext("2d")?.drawImage(imagem, 0, 0)
  URL.revokeObjectURL(url)
  await new Promise<void>((resolver) =>
    canvas.toBlob((blob) => {
      if (blob) baixarBlob(blob, `${arquivo}.png`)
      resolver()
    }, "image/png"),
  )
}

