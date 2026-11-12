"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Check, Copy, Image as IconeImagem, Play, RotateCcw, Sparkles, Type, X } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { CurvaMotion, ExemploMotion, GuiaMotion, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { Carimbo, Ilustracao } from "./Ilustracao"
import { Simbolo } from "./Logo"
import { useSistemaMarca, type SistemaMarca } from "./SistemaMarca"

type Props = { secao: Secao; aoEditar: () => void }

const bezier = (curva?: CurvaMotion) => (curva ? `cubic-bezier(${curva.valores.join(", ")})` : "ease-out")
const virgula = (numero: number) => String(numero).replace(".", ",")

/** Estilo de animação de um exemplo: nome do keyframe, duração, curva e atraso. */
function animar(nome: string, ms: number, curva: string, atraso = 0, extra?: CSSProperties): CSSProperties {
  return { animation: `${nome} ${ms}ms ${curva} ${atraso}ms both`, ...extra }
}

/** Fica verdadeiro quando o elemento entra na tela, para os exemplos começarem pausados e tocarem à vista. */
function useNaTela<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const alvo = ref.current
    if (!alvo) return
    const observador = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        setVisivel(true)
        observador.disconnect()
      }
    }, { threshold: 0.4 })
    observador.observe(alvo)
    return () => observador.disconnect()
  }, [])
  return [ref, visivel] as const
}

/** Palco de um exemplo: pausa até aparecer na tela e recomeça a cada rodada. */
function Palco({ rodada, className, style, children }: { rodada: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const [ref, visivel] = useNaTela<HTMLDivElement>()
  return (
    <div ref={ref} key={rodada} data-ativo={visivel || undefined} className={cn("demo-motion relative overflow-hidden", className)} style={style}>
      {children}
    </div>
  )
}

/**
 * Motion da marca da cliente: conceito, princípios com números, curvas (CSS e After Effects), durações,
 * distâncias e cadência, exemplos ao vivo (texto, imagem, marca), coreografia de uma peça, faça e evite,
 * acessibilidade e os tokens para copiar. Os exemplos usam a paleta, a tipografia e o logo da marca.
 */
export function SecaoMotion({ secao, aoEditar }: Props) {
  const sistema = useSistemaMarca()
  if (secao.conteudo.tipo !== "motion") return null
  const guia = secao.conteudo
  const curva = (id: string) => guia.curvas.find((item) => item.id === id)

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="Conceito de motion" className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
        <div className="-mt-1 -me-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-texto-3">{secao.titulo}</p>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </div>
        <p className="max-w-[62ch] text-destaque font-light">{guia.conceito}</p>
        <dl className="grid grid-cols-2 gap-y-4 border-t border-borda-sutil pt-4 @3xl:grid-cols-4">
          {guia.resumo.map((item) => (
            <div key={item.rotulo} className="flex flex-col gap-0.5 pe-4">
              <dt className="text-xs text-texto-3">{item.rotulo}</dt>
              <dd className="font-heading text-titulo-3 font-medium">{item.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="titulo-principios-motion" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-principios-motion" titulo="princípios" quantidade={guia.principios.length} />
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-4">
          {guia.principios.map((principio, indice) => (
            <li key={principio.titulo} className="flex flex-col gap-2 rounded-3xl bg-superficie p-5">
              <span className="text-xs text-texto-3 tabular-nums">0{indice + 1}</span>
              <h3 className="text-base font-semibold">{principio.titulo}</h3>
              <p className="text-sm text-texto-2">{principio.texto}</p>
              <Tag tamanho="sm" className="mt-auto self-start">
                {principio.numero}
              </Tag>
            </li>
          ))}
        </ol>
      </section>

      <Curvas curvas={guia.curvas} cor={sistema.cores.principal} />
      <Duracoes guia={guia} curva={bezier(curva("assentar"))} cor={sistema.cores.principal} />
      <Medidas guia={guia} />
      <Exemplos guia={guia} sistema={sistema} />
      <Coreografia guia={guia} sistema={sistema} />
      <Regras guia={guia} />
      <Tokens guia={guia} nome={sistema.nome} />
    </div>
  )
}

/* ---------- Curvas ---------- */

function Curvas({ curvas, cor }: { curvas: CurvaMotion[]; cor: string }) {
  const [rodada, setRodada] = useState(0)
  return (
    <section aria-labelledby="titulo-curvas" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-curvas" titulo="curvas" quantidade={curvas.length}>
        <Botao variante="secundario" tamanho="sm" onClick={() => setRodada((valor) => valor + 1)}>
          <Play /> Ver todas
        </Botao>
      </CabecalhoBloco>
      <p className="max-w-[70ch] text-sm text-texto-2">
        A curva diz como a velocidade muda durante o movimento. As bolinhas fazem o mesmo trajeto em 1200 ms: a cheia segue a curva, a clara vai em velocidade constante para comparar.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
        {curvas.map((curva) => (
          <li key={curva.id} className="flex min-w-0">
            <CartaoCurva curva={curva} cor={cor} rodada={rodada} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartaoCurva({ curva, cor, rodada }: { curva: CurvaMotion; cor: string; rodada: number }) {
  const [propria, setPropria] = useState(0)
  const [x1, y1, x2, y2] = curva.valores
  const ponto = (x: number, y: number) => [x * 100, 100 - y * 100] as const
  const [a, b] = ponto(x1, y1)
  const [c, d] = ponto(x2, y2)
  const tinta = curva.fora ? "var(--erro)" : cor
  const css = `cubic-bezier(${curva.valores.join(", ")})`
  return (
    <article aria-labelledby={`curva-${curva.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          <h3 id={`curva-${curva.id}`} className="text-base font-semibold">
            {curva.nome}
          </h3>
          <p className="text-xs text-texto-2">{curva.uso}</p>
        </div>
        {curva.fora ? (
          <Tag tom="erro" tamanho="sm">
            fora da marca
          </Tag>
        ) : (
          <Botao variante="fantasma" tamanho="sm" onClick={() => setPropria((valor) => valor + 1)} aria-label={`Ver a curva ${curva.nome}`}>
            <Play /> Ver
          </Botao>
        )}
      </header>
      <div className="grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
        <svg viewBox={curva.fora ? "-10 -64 120 176" : "-10 -10 120 120"} className="aspect-square w-full rounded-xl bg-preenchimento" aria-hidden>
          <rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--borda-sutil)" strokeWidth="1" />
          <path d="M0 100 L100 0" stroke="var(--texto-3)" strokeWidth="1" strokeDasharray="3 3" />
          <path d={`M0 100 L${a} ${b} M100 0 L${c} ${d}`} stroke="var(--texto-3)" strokeWidth="1" />
          <circle cx={a} cy={b} r="3.5" fill="var(--superficie)" stroke="var(--texto-2)" strokeWidth="1.5" />
          <circle cx={c} cy={d} r="3.5" fill="var(--superficie)" stroke="var(--texto-2)" strokeWidth="1.5" />
          <path d={`M0 100 C${a} ${b} ${c} ${d} 100 0`} fill="none" stroke={tinta} strokeWidth="4" strokeLinecap="round" />
        </svg>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm">{curva.sensacao}</p>
          <Palco rodada={rodada + propria} className="h-7 rounded-full bg-preenchimento">
            <span className="absolute top-1.5 size-4 rounded-full opacity-25" style={{ backgroundColor: tinta, ...animar("demo-trilho", 1200, "linear", 200) }} />
            <span className="absolute top-1.5 size-4 rounded-full" style={{ backgroundColor: tinta, ...animar("demo-trilho", 1200, css, 200) }} />
          </Palco>
        </div>
      </div>
      <dl className="flex flex-col border-t border-borda-sutil pt-3 text-xs">
        <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-2 py-1">
          <dt className="text-texto-3">CSS e Figma</dt>
          <dd className="flex min-w-0 items-center gap-1">
            <code className="truncate font-mono">{css}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(css)
                notificar({ titulo: "curva copiada", texto: `${curva.nome}: ${css}`, tipo: "sucesso" })
              }}
              aria-label={`Copiar a curva ${curva.nome}`}
              className="clique grid size-7 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto"
            >
              <Copy className="size-3.5" strokeWidth={2} />
            </button>
          </dd>
        </div>
        <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2 py-1">
          <dt className="text-texto-3">After Effects</dt>
          <dd className="tabular-nums">
            Influência de saída {Math.round(x1 * 100)}%, de entrada {Math.round((1 - x2) * 100)}%
          </dd>
        </div>
      </dl>
    </article>
  )
}

/* ---------- Durações ---------- */

function Duracoes({ guia, curva, cor }: { guia: GuiaMotion; curva: string; cor: string }) {
  const [rodada, setRodada] = useState(0)
  const maior = Math.max(...guia.duracoes.map((item) => item.ms))
  return (
    <section aria-labelledby="titulo-duracoes" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-duracoes" titulo="durações" quantidade={guia.duracoes.length}>
        <Botao variante="secundario" tamanho="sm" onClick={() => setRodada((valor) => valor + 1)}>
          <RotateCcw /> Repetir
        </Botao>
      </CabecalhoBloco>
      <Palco rodada={rodada} className="rounded-3xl bg-superficie p-5 md:p-6">
        <ul className="flex flex-col">
          {guia.duracoes.map((duracao) => (
            <li key={duracao.id} className="grid grid-cols-[72px_64px_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-t border-borda-sutil py-3 first:border-t-0 first:pt-0 last:pb-0 @3xl:grid-cols-[96px_72px_minmax(0,1fr)_minmax(0,1.2fr)]">
              <span className="text-sm font-semibold">{duracao.nome}</span>
              <span className="text-sm tabular-nums">{duracao.ms} ms</span>
              <span className="h-2.5 rounded-full bg-preenchimento" aria-hidden>
                <span
                  className="block h-full origin-left rounded-full"
                  style={{ width: `${(duracao.ms / maior) * 100}%`, backgroundColor: cor, ...animar("demo-barra", duracao.ms, curva, 200) }}
                />
              </span>
              <span className="col-span-3 text-xs text-texto-2 @3xl:col-span-1 @3xl:text-sm">{duracao.uso}</span>
            </li>
          ))}
        </ul>
      </Palco>
      <p className="text-xs text-texto-3">Cada barra cresce no próprio tempo, com a curva Assentar. Em telas grandes e vídeos, acrescente 30%; no celular, tire 20%.</p>
    </section>
  )
}

/* ---------- Distâncias e cadência ---------- */

function Medidas({ guia }: { guia: GuiaMotion }) {
  const blocos = [
    { id: "distancias", titulo: "Distância, escala e desfoque", subtitulo: "Quanto cada coisa se move", itens: guia.distancias },
    { id: "cadencia", titulo: "Cadência", subtitulo: "O intervalo entre o que entra em sequência", itens: guia.cadencia },
  ]
  return (
    <section aria-labelledby="titulo-medidas" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-medidas" titulo="distâncias e cadência" />
      <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
        {blocos.map((bloco) => (
          <article key={bloco.id} aria-labelledby={`medida-${bloco.id}`} className="flex flex-col gap-4 rounded-3xl bg-superficie p-5">
            <header className="flex flex-col">
              <h3 id={`medida-${bloco.id}`} className="text-base font-semibold">
                {bloco.titulo}
              </h3>
              <p className="text-xs text-texto-2">{bloco.subtitulo}</p>
            </header>
            <dl className="flex flex-col">
              {bloco.itens.map((item) => (
                <div key={item.nome} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-t border-borda-sutil py-2.5 first:border-t-0 first:pt-0">
                  <dt className="text-sm">{item.nome}</dt>
                  <dd className="text-end text-sm font-semibold tabular-nums">{item.valor}</dd>
                  <dd className="col-span-2 text-xs text-texto-2">{item.uso}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ---------- Exemplos ---------- */

const GRUPOS = [
  { valor: "texto", rotulo: "Palavras e frases", icone: Type },
  { valor: "imagem", rotulo: "Imagens", icone: IconeImagem },
  { valor: "marca", rotulo: "Logo e peças", icone: Sparkles },
] as const

function Exemplos({ guia, sistema }: { guia: GuiaMotion; sistema: SistemaMarca }) {
  return (
    <section aria-labelledby="titulo-exemplos-motion" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-exemplos-motion" titulo="exemplos" quantidade={guia.exemplos.length} />
      <Abas defaultValue="texto">
        <ListaAbas rotulo="Tipos de exemplo" itens={GRUPOS.map((grupo) => ({ ...grupo, quantidade: guia.exemplos.filter((item) => item.grupo === grupo.valor).length }))} />
        {GRUPOS.map((grupo) => (
          <ConteudoAba key={grupo.valor} value={grupo.valor}>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
              {guia.exemplos
                .filter((item) => item.grupo === grupo.valor)
                .map((exemplo) => (
                  <li key={exemplo.id} className="flex min-w-0">
                    <CartaoExemplo exemplo={exemplo} guia={guia} sistema={sistema} />
                  </li>
                ))}
            </ul>
          </ConteudoAba>
        ))}
      </Abas>
    </section>
  )
}

function CartaoExemplo({ exemplo, guia, sistema }: { exemplo: ExemploMotion; guia: GuiaMotion; sistema: SistemaMarca }) {
  const [rodada, setRodada] = useState(0)
  const curva = guia.curvas.find((item) => item.id === exemplo.curva)
  const parametros = [
    `${exemplo.duracao} ms`,
    curva?.nome,
    exemplo.intervalo && `${exemplo.intervalo} ms entre ${exemplo.efeito === "letras" ? "letras" : exemplo.efeito === "linhas" ? "linhas" : exemplo.efeito === "lista" ? "itens" : "palavras"}`,
    exemplo.deslocamento && `${exemplo.deslocamento} px`,
  ].filter(Boolean) as string[]

  return (
    <article aria-labelledby={`exemplo-${exemplo.id}`} className="flex w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie">
      <Palco rodada={rodada} className="grid aspect-[4/3] place-items-center p-6" style={{ backgroundColor: sistema.cores.fundo }}>
        <Demo exemplo={exemplo} curva={bezier(curva)} sistema={sistema} />
      </Palco>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h3 id={`exemplo-${exemplo.id}`} className="text-sm font-semibold">
              {exemplo.titulo}
            </h3>
            <p className="text-xs text-texto-2">{exemplo.descricao}</p>
          </div>
          <Botao variante="fantasma" tamanho="sm" onClick={() => setRodada((valor) => valor + 1)} aria-label={`Repetir ${exemplo.titulo}`}>
            <RotateCcw /> Repetir
          </Botao>
        </div>
        <div className="mt-auto flex flex-wrap gap-1">
          {parametros.map((parametro) => (
            <Tag key={parametro} tamanho="sm">
              {parametro}
            </Tag>
          ))}
        </div>
      </div>
    </article>
  )
}

function Demo({ exemplo, curva, sistema }: { exemplo: ExemploMotion; curva: string; sistema: SistemaMarca }) {
  const { cores, fonte } = sistema
  const distancia = { "--demo-distancia": `${exemplo.deslocamento ?? 16}px` } as CSSProperties
  const passo = exemplo.intervalo ?? 0
  const atraso = 200
  const titulo: CSSProperties = { fontFamily: fonte.display, color: cores.principal, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 }

  switch (exemplo.efeito) {
    case "letras":
      return (
        <p aria-label={exemplo.texto} className="text-5xl" style={titulo}>
          {[...(exemplo.texto ?? "")].map((letra, indice) => (
            <span key={indice} aria-hidden className="inline-block" style={animar("demo-subir", exemplo.duracao, curva, atraso + indice * passo, distancia)}>
              {letra}
            </span>
          ))}
        </p>
      )
    case "palavras":
      return (
        <p aria-label={exemplo.texto} className="max-w-[12ch] text-center text-3xl" style={titulo}>
          {(exemplo.texto ?? "").split(" ").map((palavra, indice) => (
            <span key={indice} aria-hidden className="me-[0.25em] inline-block" style={animar("demo-subir", exemplo.duracao, curva, atraso + indice * passo, distancia)}>
              {palavra}
            </span>
          ))}
        </p>
      )
    case "linhas":
      return (
        <div aria-label={exemplo.texto?.replaceAll("|", " ")} className="flex w-full flex-col text-lg" style={{ ...titulo, lineHeight: 1.25 }}>
          {(exemplo.texto ?? "").split("|").map((linha, indice) => (
            <span key={indice} aria-hidden className="block overflow-hidden">
              <span className="block" style={animar("demo-linha", exemplo.duracao, curva, atraso + indice * passo)}>
                {linha}
              </span>
            </span>
          ))}
        </div>
      )
    case "desfoque":
      return (
        <div className="aspect-[4/3] w-3/4 overflow-hidden rounded-xl" style={animar("demo-desfoque", exemplo.duracao, curva, atraso)}>
          <BlocoImagem className="size-full rounded-none outline-0" fundo={cores.apoio} cor={cores.fundo} borda="left" />
        </div>
      )
    case "mascara":
      return (
        <div className="aspect-[4/3] w-3/4 overflow-hidden rounded-xl" style={animar("demo-mascara", exemplo.duracao, curva, atraso)}>
          <Ilustracao desenho="paisagem" cores={cores} />
        </div>
      )
    case "lista":
      return (
        <ul className="grid w-full grid-cols-3 gap-2">
          {(["pequi", "baru", "buriti"] as const).map((desenho, indice) => (
            <li key={desenho} className="overflow-hidden rounded-lg bg-white/70" style={animar("demo-subir", exemplo.duracao, curva, atraso + indice * passo, distancia)}>
              <div className="aspect-square">
                <Ilustracao desenho={desenho} cores={cores} grao={0} />
              </div>
              <p className="px-1.5 py-1 text-[10px] font-medium capitalize" style={{ fontFamily: fonte.texto, color: cores.escuro }}>
                {desenho}
              </p>
            </li>
          ))}
        </ul>
      )
    case "logo":
      return (
        <span className="inline-flex items-center gap-3" aria-label={sistema.nome}>
          <span aria-hidden style={animar("demo-escala", 640, curva, atraso)}>
            <Simbolo simbolo={sistema.simbolo} tinta={cores.principal} tamanho={52} />
          </span>
          <span aria-hidden className="font-serif text-3xl font-medium whitespace-nowrap" style={{ color: cores.principal, ...animar("demo-subir", 640, curva, atraso + 480, distancia) }}>
            {sistema.nome}
          </span>
        </span>
      )
    case "escala":
      return (
        <div className="relative grid aspect-square h-full max-h-full grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg bg-white/60 p-3">
          <div className="min-h-0 overflow-hidden rounded-md" style={animar("demo-escala", exemplo.duracao, curva, atraso)}>
            <Ilustracao desenho="frasco" cores={cores} />
          </div>
          <p aria-label={exemplo.texto} className="pt-2 text-base" style={titulo}>
            {(exemplo.texto ?? "").split(" ").map((palavra, indice) => (
              <span key={indice} aria-hidden className="me-[0.25em] inline-block" style={animar("demo-subir", exemplo.duracao, curva, atraso + 400 + indice * passo, distancia)}>
                {palavra}
              </span>
            ))}
          </p>
          <span className="absolute top-2 right-2 size-10" style={animar("demo-escala", 400, curva, atraso + 880)}>
            <Carimbo cor={cores.escuro} className="size-full" />
          </span>
        </div>
      )
    default:
      return null
  }
}

/* ---------- Coreografia ---------- */

function Coreografia({ guia, sistema }: { guia: GuiaMotion; sistema: SistemaMarca }) {
  const [rodada, setRodada] = useState(0)
  const { cores, fonte } = sistema
  const total = Math.max(...guia.coreografia.map((passo) => passo.inicio + passo.duracao))
  const fim = Math.ceil(total / 400) * 400
  const atraso = 300
  const passo = (elemento: string) => {
    const item = guia.coreografia.find((p) => p.elemento === elemento)
    const curva = bezier(guia.curvas.find((c) => c.id === item?.curva))
    return { ms: item?.duracao ?? 400, inicio: atraso + (item?.inicio ?? 0), curva }
  }
  const estilo = (elemento: string, nome: string, extra?: CSSProperties) => {
    const p = passo(elemento)
    return animar(nome, p.ms, p.curva, p.inicio, extra)
  }

  return (
    <section aria-labelledby="titulo-coreografia" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-coreografia" titulo="coreografia de uma peça">
        <Botao variante="secundario" tamanho="sm" onClick={() => setRodada((valor) => valor + 1)}>
          <RotateCcw /> Repetir
        </Botao>
      </CabecalhoBloco>
      <Palco rodada={rodada} className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[180px_minmax(0,1fr)] @3xl:items-center @3xl:gap-8">
        <div className="relative mx-auto flex aspect-[9/16] w-[180px] flex-col overflow-hidden rounded-2xl p-3.5" style={{ backgroundColor: cores.principal, ...estilo("Fundo", "aparecer") }} aria-label="Story de lançamento animado">
          <div className="aspect-[4/5] overflow-hidden rounded-lg" style={estilo("Imagem", "demo-desfoque")}>
            <BlocoImagem className="size-full rounded-none outline-0" fundo={cores.apoio} cor={cores.fundo} borda="bottom" />
          </div>
          <p className="mt-3 text-[22px]" style={{ fontFamily: fonte.display, color: cores.fundo, lineHeight: 1.05, letterSpacing: "-0.02em", ...estilo("Título", "demo-subir") }}>
            Novo lote de pequi
          </p>
          <p className="mt-1.5 text-[10px] leading-snug" style={{ fontFamily: fonte.texto, color: cores.fundo, opacity: 0.85, ...estilo("Texto", "demo-subir", { "--demo-distancia": "8px" } as CSSProperties) }}>
            Colhido em setembro, na cooperativa de Pirenópolis.
          </p>
          <span className="mt-auto self-start rounded-full px-3 py-1.5 text-[10px] font-semibold" style={{ fontFamily: fonte.sistema, backgroundColor: cores.destaque, color: cores.escuro, ...estilo("Botão", "demo-subir", { "--demo-distancia": "8px" } as CSSProperties) }}>
            Ver de onde vem
          </span>
          <span className="absolute right-3.5 bottom-3.5" style={estilo("Logo", "demo-escala")}>
            <Simbolo simbolo={sistema.simbolo} tinta={cores.fundo} tamanho={22} />
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <p className="text-sm text-texto-2">
            Cada elemento entra na ordem, e o próximo começa antes do anterior terminar. A peça fica pronta em {virgula(total / 1000)} s e parada pelo menos 2 s antes de qualquer saída.
          </p>
          <div className="relative flex flex-col gap-2">
            {guia.coreografia.map((item) => (
              <div key={item.elemento} className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
                <span className="text-xs text-texto-2">{item.elemento}</span>
                <span className="relative h-6 rounded-md bg-preenchimento">
                  <span
                    className="absolute inset-y-0 flex items-center rounded-md px-1.5 text-[10px] font-medium tabular-nums whitespace-nowrap"
                    style={{ left: `${(item.inicio / fim) * 100}%`, width: `${(item.duracao / fim) * 100}%`, backgroundColor: cores.principal, color: cores.fundo }}
                  >
                    {item.duracao}
                  </span>
                </span>
              </div>
            ))}
            <div className="pointer-events-none absolute inset-y-0 right-0 left-[76px]" aria-hidden>
              <span className="absolute inset-y-0 w-0.5 rounded-full bg-texto" style={animar("demo-cursor", fim, "linear", atraso)} />
            </div>
          </div>
          <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 text-[10px] text-texto-3 tabular-nums" aria-hidden>
            <span />
            <span className="flex justify-between">
              {Array.from({ length: fim / 400 + 1 }).map((_, indice) => (
                <span key={indice}>{indice * 400} ms</span>
              ))}
            </span>
          </div>
        </div>
      </Palco>
    </section>
  )
}

/* ---------- Faça, evite e acessibilidade ---------- */

function Regras({ guia }: { guia: GuiaMotion }) {
  const listas = [
    { id: "faca", titulo: "Faça", itens: guia.faca, Icone: Check, fundo: "bg-sucesso-suave text-sucesso-texto", marca: "text-sucesso" },
    { id: "evite", titulo: "Evite", itens: guia.evite, Icone: X, fundo: "bg-erro-suave text-erro-texto", marca: "text-erro" },
  ]
  return (
    <section aria-labelledby="titulo-regras-motion" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-regras-motion" titulo="faça, evite e acessibilidade" />
      <div className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
        {listas.map(({ id, titulo, itens, Icone, fundo, marca }) => (
          <article key={id} aria-labelledby={`regra-${id}`} className="flex flex-col gap-3 rounded-3xl bg-superficie p-5">
            <header className="flex items-center gap-2.5">
              <span aria-hidden className={cn("grid size-8 place-items-center rounded-full", fundo)}>
                <Icone className="size-4" strokeWidth={2.25} />
              </span>
              <h3 id={`regra-${id}`} className="text-base font-semibold">
                {titulo}
              </h3>
            </header>
            <ul className="flex flex-col gap-1.5 text-sm">
              {itens.map((item) => (
                <li key={item} className="flex gap-2">
                  <Icone className={cn("mt-0.5 size-3.5 shrink-0", marca)} strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <article aria-labelledby="regra-acessibilidade" className="flex flex-col gap-3 rounded-3xl bg-superficie p-5">
          <header className="flex flex-col">
            <h3 id="regra-acessibilidade" className="text-base font-semibold">
              Acessibilidade
            </h3>
            <p className="text-xs text-texto-2">Para quem sente enjoo ou tem sensibilidade a movimento</p>
          </header>
          <ul className="flex flex-col gap-1.5 text-sm">
            {guia.acessibilidade.map((item) => (
              <li key={item} className="border-t border-borda-sutil pt-1.5 first:border-t-0 first:pt-0">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-auto text-xs text-texto-3">Para testar, ligue reduzir movimento no sistema: os exemplos desta página passam a só aparecer.</p>
        </article>
      </div>
    </section>
  )
}

/* ---------- Tokens ---------- */

function Tokens({ guia, nome }: { guia: GuiaMotion; nome: string }) {
  const id = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  const codigo = [
    `/* Motion · ${nome} */`,
    ":root {",
    ...guia.duracoes.map((item) => `  --duracao-${item.id}: ${item.ms}ms;`),
    ...guia.curvas.filter((curva) => !curva.fora).map((curva) => `  --curva-${curva.id}: cubic-bezier(${curva.valores.join(", ")});`),
    "  --deslocamento-curto: 8px;",
    "  --deslocamento: 16px;",
    "  --deslocamento-longo: 32px;",
    ...guia.cadencia.filter((item) => item.valor.endsWith("ms")).map((item) => `  --intervalo-${id(item.nome.replace("Entre ", ""))}: ${item.valor.replace(" ", "")};`),
    "}",
  ].join("\n")

  return (
    <section aria-labelledby="titulo-tokens-motion" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-tokens-motion" titulo="tokens para o site e o design">
        <Botao
          variante="secundario"
          tamanho="sm"
          onClick={() => {
            navigator.clipboard?.writeText(codigo)
            notificar({ titulo: "tokens copiados", texto: "Cole no CSS do site ou mande para quem anima as peças.", tipo: "sucesso" })
          }}
        >
          <Copy /> Copiar tokens
        </Botao>
      </CabecalhoBloco>
      <pre className="overflow-x-auto rounded-3xl bg-superficie p-5 text-xs leading-relaxed md:p-6">
        <code className="font-mono">{codigo}</code>
      </pre>
    </section>
  )
}
