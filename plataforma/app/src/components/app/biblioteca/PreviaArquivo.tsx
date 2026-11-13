"use client"

import { Play } from "lucide-react"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { cn } from "@/lib/utils"
import type { ArquivoBiblioteca } from "@/lib/mock"
import { Carimbo, GrafismoFolhas, Ilustracao, type CoresDesenho } from "../Ilustracao"
import { Logo } from "../Logo"
import { Peca } from "../PecasMarca"
import type { SistemaMarca } from "../SistemaMarca"

const cq = (valor: number) => `${valor}cqmin`

/**
 * Miniatura de um arquivo da biblioteca, desenhada com o sistema da marca enquanto não há arquivo de verdade.
 * Ocupa o quadro inteiro do pai e mede tudo em cqmin, então serve tanto no card quanto no detalhe.
 */
export function PreviaArquivo({ arquivo, sistema, className }: { arquivo: ArquivoBiblioteca; sistema: SistemaMarca; className?: string }) {
  const { previa } = arquivo
  const cores = sistema.cores
  return (
    <div role="img" aria-label={`${arquivo.nome}: ${arquivo.descricao}`} className={cn("relative size-full overflow-hidden [container-type:size]", className)} style={{ backgroundColor: fundoDe(arquivo, cores) }}>
      {(() => {
        switch (previa.tipo) {
          case "foto":
            return <BlocoImagem className="size-full rounded-none outline-0" fundo={previa.fundo} cor={previa.tinta} borda={previa.borda} />
          case "enviada":
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={previa.url} alt="" className="size-full object-cover" />
          case "ilustracao":
            return <Ilustracao desenho={previa.desenho} cores={cores} grao={0.05} className="size-full" />
          case "personagem":
            return <Personagem pose={previa.pose} cores={cores} />
          case "grafismo":
            if (previa.desenho === "padrao") return <Ilustracao desenho="padrao" cores={cores} grao={0} className="size-full" />
            return (
              <div className="grid size-full place-items-center" style={{ padding: cq(14) }}>
                {previa.desenho === "folhas" ? <GrafismoFolhas cor={cores.principal} className="size-full" /> : <Carimbo cor={cores.escuro} className="size-full" />}
              </div>
            )
          case "peca": {
            const [largura, altura] = previa.proporcao
            const larga = largura / altura >= 4 / 3
            return (
              <div className="grid size-full place-items-center" style={{ padding: cq(9) }}>
                <Peca
                  exemplo={previa.exemplo}
                  proporcao={previa.proporcao}
                  sistema={sistema}
                  className={cn("shadow-(--sombra-campo)", larga ? "w-full" : "h-full w-auto")}
                />
              </div>
            )
          }
          case "logo":
            return (
              <div className="grid size-full place-items-center" style={{ backgroundColor: previa.fundo }}>
                <span style={{ transform: `scale(var(--escala-logo, 1))` }} className="[--escala-logo:1] @md:[--escala-logo:2]">
                  <Logo tipo={previa.versao} simbolo={sistema.simbolo} nome={sistema.nome} tinta={previa.tinta} altura={previa.versao === "simbolo" ? 40 : 26} />
                </span>
              </div>
            )
          case "apresentacao":
            return (
              <div className="grid size-full place-items-center" style={{ padding: cq(12) }}>
                <div className="relative aspect-video w-full">
                  <span aria-hidden className="absolute inset-0 translate-x-[4%] translate-y-[6%] rounded-[3%] bg-black/10" />
                  <span aria-hidden className="absolute inset-0 translate-x-[2%] translate-y-[3%] rounded-[3%] bg-black/10" />
                  <div className="absolute inset-0 grid grid-cols-2 overflow-hidden rounded-[3%] shadow-(--sombra-campo)" style={{ backgroundColor: cores.fundo }}>
                    {previa.capa === "foto" ? (
                      <BlocoImagem className="size-full rounded-none outline-0" fundo={cores.principal} cor={cores.apoio} borda="right" />
                    ) : (
                      <Ilustracao desenho="paisagem" cores={cores} grao={0} className="size-full" />
                    )}
                    <div className="flex flex-col justify-end" style={{ padding: cq(4), gap: cq(1.5) }}>
                      <span style={{ fontFamily: sistema.fonte.display, fontSize: cq(6.4), lineHeight: 1.05, color: cores.principal }}>{previa.titulo}</span>
                      <span style={{ fontFamily: sistema.fonte.texto, fontSize: cq(2.6), color: cores.escuro, opacity: 0.7 }}>{sistema.nome}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          case "video":
            return (
              <>
                <BlocoImagem className="size-full rounded-none outline-0" fundo={previa.fundo} cor={previa.tinta} borda="left" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid place-items-center rounded-full bg-black/45 text-white" style={{ width: cq(20), height: cq(20) }}>
                    <Play className="size-1/2 translate-x-[6%] fill-current" strokeWidth={0} aria-hidden />
                  </span>
                </span>
                <span className="absolute rounded-md bg-black/60 font-medium text-white tabular-nums" style={{ right: cq(4), bottom: cq(4), padding: `${cq(1)} ${cq(2.4)}`, fontSize: cq(5) }}>
                  {previa.duracao}
                </span>
              </>
            )
          case "documento":
            return (
              <div className="grid size-full place-items-center" style={{ paddingTop: cq(10), paddingBottom: cq(10) }}>
                <div className="flex aspect-[3/4] h-full flex-col bg-branco shadow-(--sombra-campo)" style={{ padding: cq(7), gap: cq(2.6), borderRadius: cq(2) }}>
                  <span className="font-semibold text-texto" style={{ fontSize: cq(5.6), lineHeight: 1.1 }}>
                    {previa.titulo}
                  </span>
                  {[92, 80, 86, 64, 88, 70, 48].map((largura, indice) => (
                    <span key={indice} className="rounded-full bg-cinza" style={{ height: cq(1.6), width: `${largura}%` }} />
                  ))}
                  <span className="mt-auto self-start rounded font-semibold text-branco" style={{ backgroundColor: cores.principal, fontSize: cq(3.4), padding: `${cq(0.6)} ${cq(1.6)}` }}>
                    {arquivo.extensao}
                  </span>
                </div>
              </div>
            )
        }
      })()}
    </div>
  )
}

function fundoDe(arquivo: ArquivoBiblioteca, cores: CoresDesenho) {
  switch (arquivo.previa.tipo) {
    case "peca":
    case "apresentacao":
    case "documento":
      return "var(--preenchimento-hover)"
    case "grafismo":
      return arquivo.previa.desenho === "carimbo" ? cores.apoio : cores.fundo
    default:
      return cores.fundo
  }
}

/** Flor, a coletora: personagem de exemplo no estilo de ilustração da marca (formas chapadas, traço único). */
function Personagem({ pose, cores }: { pose: "frente" | "colhendo"; cores: CoresDesenho }) {
  const linha = cores.escuro
  const corpo = (
    <g stroke={linha} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
      <path d="M58 92 L42 160 H118 L102 92 Q80 84 58 92Z" fill={cores.principal} />
      <path d="M58 98 Q48 120 52 134" fill="none" />
      <path d="M102 98 Q114 116 122 124" fill="none" />
      <circle cx="80" cy="70" r="17" fill={cores.apoio} />
      <path d="M63 66 Q66 50 80 50 Q94 50 97 66 Q90 58 80 58 Q70 58 63 66Z" fill={cores.escuro} />
      <ellipse cx="80" cy="54" rx="34" ry="7" fill={cores.destaque} />
      <path d="M62 54 Q64 34 80 34 Q96 34 98 54Z" fill={cores.destaque} />
      <path d="M64 48 H96" stroke={cores.escuro} strokeWidth={2.4} />
      <circle cx="74" cy="71" r="1.4" fill={linha} stroke="none" />
      <circle cx="86" cy="71" r="1.4" fill={linha} stroke="none" />
      <path d="M75 78 Q80 82 85 78" fill="none" />
      <path d="M112 118 H138 L134 142 H116Z" fill={cores.escuro} />
      <path d="M112 118 Q125 102 138 118" fill="none" />
      <circle cx="120" cy="116" r="4.5" fill={cores.apoio} />
      <circle cx="129" cy="114" r="4.5" fill={cores.destaque} />
    </g>
  )
  if (pose === "frente")
    return (
      <svg viewBox="0 0 160 180" className="size-full" aria-hidden>
        <rect width="160" height="180" fill={cores.fundo} />
        <ellipse cx="80" cy="162" rx="58" ry="6" fill={cores.apoio} opacity={0.35} />
        <g transform="translate(0 4)">{corpo}</g>
      </svg>
    )
  return (
    <svg viewBox="0 0 240 180" className="size-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="240" height="180" fill={cores.fundo} />
      <path d="M0 150 Q60 136 120 146 T240 140 V180 H0Z" fill={cores.apoio} opacity={0.45} />
      <g stroke={linha} strokeWidth={1.8} strokeLinecap="round" fill="none">
        <path d="M178 150 Q172 110 186 80 Q194 64 210 58" />
        <path d="M186 96 Q204 94 214 104" />
      </g>
      <g stroke={linha} strokeWidth={1.6}>
        <ellipse cx="208" cy="62" rx="14" ry="8" fill={cores.principal} transform="rotate(-20 208 62)" />
        <ellipse cx="214" cy="104" rx="12" ry="7" fill={cores.principal} transform="rotate(18 214 104)" />
        <circle cx="198" cy="76" r="6" fill={cores.destaque} />
      </g>
      <g transform="translate(40 -2)">{corpo}</g>
    </svg>
  )
}
