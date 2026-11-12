"use client"

import type { CSSProperties, ReactNode } from "react"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { cn } from "@/lib/utils"
import type { ExemploPeca, FormatoPeca, SuporteMockup } from "@/lib/mock"
import { Carimbo, GrafismoFolhas, Ilustracao } from "./Ilustracao"
import { Simbolo } from "./Logo"
import type { SistemaMarca } from "./SistemaMarca"

/*
 * Peças e mockups montados com o sistema da marca. Todas as medidas internas usam cqmin
 * (porcentagem da menor medida da peça), então o mesmo layout funciona do story ao banner, em qualquer tamanho de tela.
 */

const cq = (valor: number) => `${valor}cqmin`

function textos(sistema: SistemaMarca) {
  const { fonte } = sistema
  return {
    titulo: (tamanho: number, cor: string, extra?: CSSProperties): CSSProperties => ({
      fontFamily: fonte.display,
      fontWeight: 500,
      fontSize: cq(tamanho),
      lineHeight: 1.04,
      letterSpacing: "-0.02em",
      color: cor,
      textWrap: "balance",
      ...extra,
    }),
    texto: (tamanho: number, cor: string): CSSProperties => ({ fontFamily: fonte.texto, fontSize: cq(tamanho), lineHeight: 1.4, color: cor }),
    sistema: (tamanho: number, cor: string, extra?: CSSProperties): CSSProperties => ({ fontFamily: fonte.sistema, fontSize: cq(tamanho), lineHeight: 1.3, color: cor, ...extra }),
  }
}

function Assinatura({ sistema, cor, tamanho = 5.5, so = false }: { sistema: SistemaMarca; cor: string; tamanho?: number; so?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center" style={{ gap: cq(tamanho * 0.3) }}>
      <Simbolo simbolo={sistema.simbolo} tinta={cor} tamanho={24} className="shrink-0" style={{ width: cq(tamanho), height: cq(tamanho) }} />
      {!so && (
        <span className="font-serif font-medium whitespace-nowrap" style={{ fontSize: cq(tamanho * 0.62), color: cor, lineHeight: 1 }}>
          {sistema.nome}
        </span>
      )}
    </span>
  )
}

function Sobretitulo({ sistema, texto, cor }: { sistema: SistemaMarca; texto?: string; cor: string }) {
  if (!texto) return null
  return <p style={textos(sistema).sistema(2.6, cor, { fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" })}>{texto}</p>
}

function BotaoPeca({ sistema, texto, fundo, tinta }: { sistema: SistemaMarca; texto?: string; fundo: string; tinta: string }) {
  if (!texto) return null
  return (
    <span className="inline-flex self-start rounded-full whitespace-nowrap" style={{ ...textos(sistema).sistema(2.8, tinta, { fontWeight: 600 }), backgroundColor: fundo, padding: `${cq(1.6)} ${cq(3.4)}` }}>
      {texto}
    </span>
  )
}

type PropsPeca = {
  exemplo: ExemploPeca
  proporcao: [number, number]
  sistema: SistemaMarca
  /** Mostra margem, colunas e zona segura por cima da peça. */
  grade?: Pick<FormatoPeca, "colunas" | "zonaSegura"> | false
  /** Área coberta pela interface da rede: o conteúdo fica fora dela. */
  zona?: FormatoPeca["zonaSegura"]
  className?: string
}

/** Uma peça de comunicação no layout pedido, com as cores, as fontes, o logo, os grafismos e as imagens da marca. */
export function Peca({ exemplo, proporcao, sistema, grade, zona, className }: PropsPeca) {
  const [largura, altura] = proporcao
  return (
    <div
      role="img"
      aria-label={`${exemplo.nome}: ${exemplo.destaque ? `${exemplo.destaque} ` : ""}${exemplo.titulo}`}
      className={cn("relative w-full overflow-hidden [container-type:size]", className)}
      style={{ aspectRatio: `${largura} / ${altura}`, "--zona-topo": `${zona?.topo ?? 0}cqh`, "--zona-base": `${zona?.base ?? 0}cqh` } as CSSProperties}
    >
      <Layout exemplo={exemplo} sistema={sistema} horizontal={largura / altura >= 1.4} />
      {grade && <Grade colunas={grade.colunas} zona={grade.zonaSegura} />}
    </div>
  )
}

function Grade({ colunas, zona }: { colunas: number; zona?: FormatoPeca["zonaSegura"] }) {
  const listra = "repeating-linear-gradient(135deg, color-mix(in oklch, var(--erro) 22%, transparent) 0 6px, transparent 6px 12px)"
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {zona && (
        <>
          <span className="absolute inset-x-0 top-0" style={{ height: `${zona.topo}%`, backgroundImage: listra }} />
          <span className="absolute inset-x-0 bottom-0" style={{ height: `${zona.base}%`, backgroundImage: listra }} />
        </>
      )}
      <div className="absolute grid outline-1 outline-dashed outline-erro" style={{ inset: cq(6), gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`, gap: cq(2) }}>
        {Array.from({ length: colunas }).map((_, indice) => (
          <span key={indice} style={{ backgroundColor: "color-mix(in oklch, var(--erro) 12%, transparent)" }} />
        ))}
      </div>
    </div>
  )
}

function Layout({ exemplo, sistema, horizontal }: { exemplo: ExemploPeca; sistema: SistemaMarca; horizontal: boolean }) {
  const { principal, apoio, fundo, escuro, destaque } = sistema.cores
  const t = textos(sistema)
  const margem = cq(6)
  /** Margem de 6% nas laterais; em cima e embaixo, o que for maior entre a margem e a zona segura do formato. */
  const pad: CSSProperties = {
    paddingInline: margem,
    paddingTop: `max(${margem}, calc(var(--zona-topo, 0cqh) + ${cq(3)}))`,
    paddingBottom: `max(${margem}, calc(var(--zona-base, 0cqh) + ${cq(3)}))`,
  }
  const coluna = (filhos: ReactNode, classe = "", estilo?: CSSProperties) => (
    <div className={cn("relative flex h-full min-h-0 flex-col", classe)} style={{ ...pad, gap: cq(2.4), ...estilo }}>
      {filhos}
    </div>
  )

  switch (exemplo.layout) {
    case "foto-cheia":
      return (
        <>
          <BlocoImagem className="absolute inset-0 size-full rounded-none outline-0" fundo={principal} cor={apoio} borda="right" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${principal} 34%, color-mix(in srgb, ${principal} 70%, transparent) 52%, transparent 78%)` }} />
          {coluna(
            <>
              <Assinatura sistema={sistema} cor={fundo} />
              <div className="mt-auto flex max-w-[86%] flex-col" style={{ gap: cq(2.4) }}>
                <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={fundo} />
                <p style={t.titulo(horizontal ? 13 : 10, fundo)}>{exemplo.titulo}</p>
                <BotaoPeca sistema={sistema} texto={exemplo.cta} fundo={destaque} tinta={escuro} />
              </div>
            </>,
          )}
        </>
      )

    case "tipografico":
      return coluna(
        <>
          <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
          <div className="my-auto flex flex-col" style={{ gap: cq(3) }}>
            <p className="max-w-[92%]" style={t.titulo(horizontal ? 15 : 12.5, principal)}>
              {exemplo.titulo}
            </p>
            {exemplo.texto && (
              <p className="max-w-[72%]" style={t.texto(horizontal ? 4 : 3.4, escuro)}>
                {exemplo.texto}
              </p>
            )}
          </div>
          <Assinatura sistema={sistema} cor={principal} />
        </>,
        "",
        { backgroundColor: fundo },
      )

    case "ilustracao": {
      const texto = (
        <div className="flex min-h-0 flex-col justify-center" style={{ ...pad, gap: cq(2.4) }}>
          <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
          <p style={t.titulo(horizontal ? 10 : 8, principal)}>{exemplo.titulo}</p>
          {exemplo.texto && <p style={t.texto(horizontal ? 3.6 : 3.2, escuro)}>{exemplo.texto}</p>}
          <div style={{ marginTop: cq(1.6) }}>
            <Assinatura sistema={sistema} cor={principal} tamanho={4.6} />
          </div>
        </div>
      )
      return (
        <div className={cn("grid size-full", horizontal ? "grid-cols-2" : "grid-rows-[52%_minmax(0,1fr)]")} style={{ backgroundColor: fundo }}>
          {horizontal && texto}
          <div className="min-h-0 overflow-hidden">
            <Ilustracao desenho={horizontal ? "paisagem" : "pequi"} cores={sistema.cores} />
          </div>
          {!horizontal && texto}
        </div>
      )
    }

    case "oferta":
      return coluna(
        <>
          <Assinatura sistema={sistema} cor={principal} />
          <div className={cn("my-auto flex", horizontal ? "items-center" : "flex-col")} style={{ gap: cq(horizontal ? 5 : 1) }}>
            <p style={t.titulo(horizontal ? 34 : 30, principal, { lineHeight: 0.9, letterSpacing: "-0.04em" })}>{exemplo.destaque}</p>
            <p className="max-w-[78%]" style={t.titulo(horizontal ? 8 : 7, escuro)}>
              {exemplo.titulo}
            </p>
          </div>
          <BotaoPeca sistema={sistema} texto={exemplo.cta} fundo={principal} tinta={fundo} />
        </>,
        "",
        { backgroundColor: apoio },
      )

    case "dividido": {
      const texto = coluna(
        <>
          <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
          <p style={t.titulo(horizontal ? 10 : 7.5, principal)}>{exemplo.titulo}</p>
          {exemplo.texto && <p style={t.texto(horizontal ? 3.6 : 3, escuro)}>{exemplo.texto}</p>}
          <div className="mt-auto flex items-end justify-between" style={{ gap: cq(2) }}>
            <BotaoPeca sistema={sistema} texto={exemplo.cta} fundo={principal} tinta={fundo} />
            <Assinatura sistema={sistema} cor={principal} tamanho={4.6} so />
          </div>
        </>,
        "justify-center",
      )
      return (
        <div className={cn("grid size-full", horizontal ? "grid-cols-2" : "grid-rows-[54%_minmax(0,1fr)]")} style={{ backgroundColor: fundo }}>
          <BlocoImagem className="size-full rounded-none outline-0" fundo={apoio} cor={fundo} borda={horizontal ? "left" : "bottom"} />
          {texto}
        </div>
      )
    }

    case "lote": {
      const linhas = (exemplo.texto ?? "").split("|")
      return coluna(
        <>
          <div className="flex items-start justify-between" style={{ gap: cq(3) }}>
            <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
            <Assinatura sistema={sistema} cor={principal} tamanho={4.6} so />
          </div>
          <div className={cn("mt-auto flex", horizontal ? "items-end justify-between" : "flex-col")} style={{ gap: cq(4) }}>
            <Carimbo cor={escuro} texto={`${exemplo.titulo.toUpperCase()} · ${linhas[1]?.split(" ").pop()?.toUpperCase() ?? ""} · `} className={cn("w-[34cqmin] shrink-0", horizontal ? "order-2" : "self-end")} />
            <div className="flex min-w-0 flex-col" style={{ gap: cq(1.6) }}>
              <p style={t.titulo(horizontal ? 18 : 15, principal)}>{exemplo.titulo}</p>
              <ul className="flex flex-col">
                {linhas.map((linha) => (
                  <li key={linha} style={{ ...t.sistema(2.8, escuro), borderTop: `1px solid ${escuro}33`, paddingBlock: cq(1) }}>
                    {linha}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>,
        "",
        { backgroundColor: fundo },
      )
    }

    case "citacao":
      return coluna(
        <>
          <p aria-hidden style={t.titulo(26, apoio, { lineHeight: 0.7 })}>
            “
          </p>
          <p className="max-w-[92%]" style={t.titulo(horizontal ? 9 : 7, escuro, { fontStyle: "italic", fontWeight: 400 })}>
            {exemplo.titulo}
          </p>
          <div className="mt-auto flex items-end justify-between" style={{ gap: cq(2) }}>
            <p style={t.sistema(2.8, escuro)}>{exemplo.texto}</p>
            <Assinatura sistema={sistema} cor={principal} tamanho={4.6} so />
          </div>
        </>,
        "",
        { backgroundColor: fundo },
      )

    case "grafismo":
      return (
        <div className="relative flex size-full flex-col items-center justify-center text-center" style={{ backgroundColor: principal, ...pad, gap: cq(3) }}>
          <GrafismoFolhas cor={apoio} className="absolute inset-x-0 top-[5%] w-full" />
          <GrafismoFolhas cor={apoio} className="absolute inset-x-0 bottom-[5%] w-full rotate-180" />
          <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={apoio} />
          <p className="max-w-[86%]" style={t.titulo(horizontal ? 11 : 9, fundo)}>
            {exemplo.titulo}
          </p>
          <Assinatura sistema={sistema} cor={fundo} tamanho={4.6} />
        </div>
      )

    case "gradiente": {
      const produto = (
        <div className="grid min-h-0 place-items-center">
          <div className="aspect-square overflow-hidden rounded-full" style={{ width: cq(horizontal ? 70 : 52), backgroundColor: fundo }}>
            <Ilustracao desenho="frasco" cores={sistema.cores} grao={0} />
          </div>
        </div>
      )
      return (
        <div className={cn("grid size-full", horizontal ? "grid-cols-2" : "grid-rows-[minmax(0,1fr)_auto]")} style={{ background: `linear-gradient(170deg, ${fundo} 12%, ${apoio} 100%)` }}>
          {!horizontal && produto}
          {coluna(
            <>
              <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
              <p style={t.titulo(horizontal ? 12 : 10, principal)}>{exemplo.titulo}</p>
              {exemplo.texto && <p style={t.texto(3.4, escuro)}>{exemplo.texto}</p>}
              <div className="flex items-end justify-between" style={{ marginTop: cq(1.6), gap: cq(2) }}>
                <BotaoPeca sistema={sistema} texto={exemplo.cta} fundo={principal} tinta={fundo} />
                <Assinatura sistema={sistema} cor={principal} tamanho={4.6} so />
              </div>
            </>,
            "justify-center",
          )}
          {horizontal && produto}
        </div>
      )
    }

    case "moldura":
      return (
        <div className="relative flex size-full flex-col" style={{ backgroundColor: fundo, ...pad, gap: cq(3) }}>
          <div className="relative min-h-0 flex-1">
            <BlocoImagem className="absolute inset-0 size-full rounded-none outline-0" fundo={apoio} cor={principal} borda="bottom" />
            <GrafismoFolhas cor={principal} traco={2} className="absolute -top-[3cqmin] -left-[4cqmin] w-[60%] -rotate-12" />
            <GrafismoFolhas cor={principal} traco={2} className="absolute -right-[4cqmin] -bottom-[3cqmin] w-[60%] rotate-[168deg]" />
          </div>
          <div className="flex items-end justify-between" style={{ gap: cq(2) }}>
            <div className="flex flex-col" style={{ gap: cq(0.8) }}>
              <p style={t.titulo(7, principal)}>{exemplo.titulo}</p>
              <p style={t.sistema(2.8, escuro)}>{exemplo.texto}</p>
            </div>
            <Assinatura sistema={sistema} cor={principal} tamanho={4.6} so />
          </div>
        </div>
      )

    case "padrao":
      return (
        <div className="relative grid size-full place-items-center">
          <div className="absolute inset-0">
            <Ilustracao desenho="padrao" cores={sistema.cores} />
          </div>
          <div className="relative flex max-w-[70%] flex-col items-center text-center" style={{ backgroundColor: fundo, padding: cq(6), gap: cq(2.4), borderRadius: cq(3) }}>
            <Sobretitulo sistema={sistema} texto={exemplo.sobretitulo} cor={principal} />
            <p style={t.titulo(8, principal)}>{exemplo.titulo}</p>
            <Assinatura sistema={sistema} cor={principal} tamanho={4.2} />
          </div>
        </div>
      )

    case "carimbo":
      return (
        <>
          <BlocoImagem className="absolute inset-0 size-full rounded-none outline-0" fundo={apoio} cor={fundo} borda="left" />
          {coluna(
            <>
              <p className="max-w-[60%]" style={t.titulo(10, escuro)}>
                {exemplo.titulo}
              </p>
              <div className="mt-auto flex items-end justify-between">
                <Assinatura sistema={sistema} cor={escuro} tamanho={4.6} so />
                <Carimbo cor={escuro} texto={`${(exemplo.texto ?? "").toUpperCase()} · PIRENÓPOLIS · `} className="w-[30cqmin]" />
              </div>
            </>,
          )}
        </>
      )
  }
}

/* ---------- Mockups ---------- */

/** Mockup de um suporte físico ou digital com a marca aplicada. */
export function Mockup({ suporte, sistema, pecas, banner }: { suporte: SuporteMockup; sistema: SistemaMarca; pecas: ExemploPeca[]; banner: ExemploPeca }) {
  const { principal, apoio, fundo, escuro } = sistema.cores
  const t = textos(sistema)
  const palco = (filhos: ReactNode) => <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden bg-preenchimento [container-type:size]">{filhos}</div>

  switch (suporte) {
    case "frasco":
      return palco(
        <div className="relative flex flex-col items-center">
          <span className="rounded-t-[1.6cqmin]" style={{ width: cq(13), height: cq(9), backgroundColor: principal }} />
          <span style={{ width: cq(10), height: cq(3.5), backgroundColor: escuro, filter: "brightness(0.8)" }} />
          <div className="relative overflow-hidden" style={{ width: cq(28), height: cq(54), backgroundColor: escuro, borderRadius: cq(6) }}>
            <span className="absolute inset-y-[6%] left-[10%] w-[8%] rounded-full bg-white/15" />
            <div className="absolute flex flex-col items-center justify-center text-center" style={{ inset: `${cq(11)} ${cq(3)} ${cq(8)}`, backgroundColor: apoio, borderRadius: cq(1.4), gap: cq(1.2), padding: cq(1.6) }}>
              <Assinatura sistema={sistema} cor={principal} tamanho={6.4} so />
              <p style={t.titulo(3.4, principal)}>Hidratante de pequi</p>
              <p style={t.sistema(1.8, escuro)}>120 ml · Lote 12</p>
            </div>
          </div>
          <span className="absolute -bottom-[2.4cqmin] -z-0 h-[3cqmin] w-[34cqmin] rounded-[50%] bg-black/10 blur-[1cqmin]" />
        </div>,
      )

    case "sacola":
      return palco(
        <div className="relative" style={{ marginTop: cq(10) }}>
          <span className="absolute left-1/2 -translate-x-1/2 rounded-t-full border-b-0" style={{ top: cq(-14), width: cq(18), height: cq(17), border: `${cq(1.4)} solid ${escuro}`, borderBottom: 0, opacity: 0.55 }} />
          <div className="relative grid place-items-center" style={{ width: cq(50), height: cq(58), backgroundColor: apoio, borderRadius: cq(1.2) }}>
            <span className="absolute inset-x-0 top-0 bg-black/5" style={{ height: cq(6) }} />
            <Assinatura sistema={sistema} cor={principal} tamanho={7} />
            <Carimbo cor={principal} className="absolute right-[4cqmin] bottom-[4cqmin] w-[14cqmin] opacity-70" texto="DO CERRADO · LOTE 12 · " />
          </div>
        </div>,
      )

    case "cartao":
      return palco(
        <div className="relative" style={{ width: cq(76), height: cq(56) }}>
          <div className="absolute top-0 left-0 flex -rotate-6 flex-col justify-between shadow-sm" style={{ width: cq(50), height: cq(32), backgroundColor: fundo, padding: cq(3.2), borderRadius: cq(1) }}>
            <div className="flex flex-col" style={{ gap: cq(0.6) }}>
              <p style={t.titulo(3.6, principal)}>Ana Ribeiro</p>
              <p style={t.texto(2, escuro)}>Fundadora e produtora</p>
            </div>
            <div className="flex flex-col" style={{ gap: cq(0.4) }}>
              <p style={t.sistema(1.8, escuro)}>@raiznatural</p>
              <p style={t.sistema(1.8, escuro)}>Ribeirão Preto · SP</p>
            </div>
            <GrafismoFolhas cor={apoio} className="absolute right-[6%] bottom-[10%] w-[40%]" />
          </div>
          <div className="absolute right-0 bottom-0 grid rotate-3 place-items-center shadow-md" style={{ width: cq(50), height: cq(32), backgroundColor: principal, borderRadius: cq(1) }}>
            <Assinatura sistema={sistema} cor={fundo} tamanho={6} />
          </div>
        </div>,
      )

    case "etiqueta":
      return palco(
        <div className="relative flex flex-col items-center">
          <svg viewBox="0 0 40 30" className="absolute" style={{ width: cq(16), top: cq(-12) }} aria-hidden>
            <path d="M20 30 C14 18 26 12 20 0" fill="none" stroke={escuro} strokeWidth="1" />
          </svg>
          <div className="relative flex flex-col items-center text-center shadow-sm" style={{ width: cq(32), height: cq(58), backgroundColor: fundo, borderRadius: cq(3), padding: cq(3), gap: cq(1.6) }}>
            <span className="rounded-full bg-preenchimento" style={{ width: cq(3.6), height: cq(3.6), boxShadow: `inset 0 0 0 ${cq(0.5)} ${apoio}` }} />
            <Carimbo cor={escuro} className="w-[20cqmin]" />
            <p style={t.titulo(5, principal)}>Lote 12</p>
            <div className="flex w-full flex-col" style={{ gap: cq(0.6) }}>
              {["Pequi · 120 ml", "Validade 09/2027"].map((linha) => (
                <p key={linha} style={{ ...t.sistema(1.9, escuro), borderTop: `1px solid ${escuro}33`, paddingTop: cq(0.6) }}>
                  {linha}
                </p>
              ))}
            </div>
            <p className="mt-auto" style={t.titulo(2.6, escuro, { fontStyle: "italic", fontWeight: 400 })}>
              feito por Ana
            </p>
          </div>
        </div>,
      )

    case "perfil":
      return palco(
        <div className="flex flex-col bg-white shadow-sm" style={{ width: cq(48), height: cq(86), borderRadius: cq(4), padding: cq(3), gap: cq(2.4) }}>
          <div className="flex items-center" style={{ gap: cq(2) }}>
            <span className="grid shrink-0 place-items-center rounded-full" style={{ width: cq(11), height: cq(11), backgroundColor: principal }}>
              <Assinatura sistema={sistema} cor={fundo} tamanho={6} so />
            </span>
            <div className="flex min-w-0 flex-col">
              <p className="truncate" style={t.sistema(2.4, "var(--preto)", { fontWeight: 600 })}>
                raiznatural
              </p>
              <p className="line-clamp-2" style={t.sistema(1.8, "var(--grafite)")}>
                Cosméticos do cerrado, com lote e cooperativa no rótulo.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3" style={{ gap: cq(0.5) }}>
            {pecas.slice(0, 9).map((peca) => (
              <Peca key={peca.id} exemplo={peca} proporcao={[1, 1]} sistema={sistema} />
            ))}
          </div>
        </div>,
      )

    case "site":
      return palco(
        <div className="flex flex-col overflow-hidden bg-white shadow-sm" style={{ width: cq(118), borderRadius: cq(2) }}>
          <div className="flex items-center bg-black/5" style={{ height: cq(4.6), gap: cq(0.8), paddingInline: cq(2) }}>
            {[0, 1, 2].map((indice) => (
              <span key={indice} className="rounded-full bg-black/15" style={{ width: cq(1.4), height: cq(1.4) }} />
            ))}
          </div>
          <div className="flex items-center justify-between" style={{ padding: `${cq(2)} ${cq(4)}`, backgroundColor: fundo }}>
            <Assinatura sistema={sistema} cor={principal} tamanho={4} />
            <span className="flex" style={{ gap: cq(3) }}>
              {["Produtos", "Origem", "Lotes"].map((item) => (
                <span key={item} style={t.sistema(1.8, escuro)}>
                  {item}
                </span>
              ))}
            </span>
          </div>
          <Peca exemplo={banner} proporcao={[12, 5]} sistema={sistema} />
          <div className="grid grid-cols-3" style={{ gap: cq(1.6), padding: cq(2.4), backgroundColor: fundo }}>
            {(["pequi", "baru", "buriti"] as const).map((desenho) => (
              <div key={desenho} className="aspect-[4/3] overflow-hidden" style={{ borderRadius: cq(1) }}>
                <Ilustracao desenho={desenho} cores={sistema.cores} grao={0} />
              </div>
            ))}
          </div>
        </div>,
      )
  }
}
