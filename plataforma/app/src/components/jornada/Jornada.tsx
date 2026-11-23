"use client"

import Image from "next/image"
import Link from "next/link"
import type { Route } from "next"
import { useEffect, useRef, useState, type PointerEvent as EventoPonteiro } from "react"
import { ArrowLeft, ArrowUpRight, Download, Maximize2, Minus, Plus, Scan, SquarePen, X } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Botao } from "@/components/hattie/Botao"
import { caminho, lugarDoRotulo, rota, type Caixa, type Lado, type P } from "@/lib/fluxo"
import { cn } from "@/lib/utils"
import { useMidia } from "../app/useMidia"
import { Fluxograma } from "./Fluxograma"

/*
 * Jornada da Bia, para apresentação: como ela chega, cria a marca com o Hattie, aprova ponto por ponto,
 * chama um parceiro (perfil, proposta e orçamento, quadro) e cria as peças no dia a dia.
 * No computador, um quadro com as telas de verdade (capturadas do protótipo) ligadas por setas:
 * linha cheia é o caminho principal, tracejada é um caminho alternativo, rosa é o caminho com parceiro.
 * No celular, as mesmas etapas em lista. Clicar numa tela abre a imagem grande e o link para a tela.
 */

type Linha = "alternativa" | "principal" | "parceiro"
type Tipo = "principal" | "alternativo" | "parceiro"

type No = {
  id: string
  titulo: string
  texto: string
  /** Captura da tela em /public/jornada. Sem ela, o card mostra só o texto (ex.: importar marca). */
  imagem?: string
  href?: string
  coluna: number
  linha: Linha
  /** O que dá para fazer nesta tela, em frases curtas. */
  acoes?: string[]
}

/** Seta entre telas. `de` igual a `para` desenha um laço (a pessoa faz algo e continua na mesma tela). `duplo`: vai e volta. */
type Aresta = { de: string; para: string; saida: Lado; entrada: Lado; tipo: Tipo; rotulo?: string; duplo?: boolean; desvio?: number; trecho?: number }

const M = "/marca/raiz-natural"

const NOS: No[] = [
  { id: "criar-conta", titulo: "Criar conta", texto: "Nome, e-mail e senha, ou entrar com o Google. O painel lilás já apresenta o mago da marca.", imagem: "criar-conta", href: "/criar-conta", coluna: 0, linha: "principal", acoes: ["Criar com e-mail ou Google", "Ir para Entrar, se já tem conta"] },
  { id: "entrar", titulo: "Entrar", texto: "Quem já tem conta volta para as marcas dela.", imagem: "entrar", href: "/entrar", coluna: 0, linha: "alternativa", acoes: ["Recuperar a senha", "Trocar de marca depois de entrar"] },
  { id: "comecar", titulo: "Primeiro acesso", texto: "A Bia conta a ideia do jeito dela. Quanto mais material, melhor a primeira versão.", imagem: "comecar", href: "/comecar", coluna: 1, linha: "principal", acoes: ["Escrever, anexar arquivos e links", "Ver o guia Como preencher", "Assistir aos vídeos de um minuto"] },
  { id: "importar", titulo: "Importar uma marca", texto: "Quem já tem marca manda logo, manual, site e redes. O Hattie lê tudo e organiza no cérebro.", coluna: 1, linha: "alternativa", acoes: ["Soltar arquivos na área grande", "O Hattie aponta o que falta"] },
  { id: "criacao", titulo: "Conversa de criação", texto: "O Hattie pergunta só o que falta, com o plano dos pontos ao lado. A Bia responde, manda material ou pula.", imagem: "criacao", href: `${M}/hattie/criacao`, coluna: 2, linha: "principal", acoes: ["Pular uma pergunta: o Hattie decide", "Voltar a um ponto pelo plano", "Clicar em Criar minha marca"] },
  { id: "criando", titulo: "O Hattie cria a marca", texto: "Lê tudo, pesquisa o mercado, estuda concorrentes e monta estratégia, nome, voz e visual.", imagem: "criando", href: `${M}/criando`, coluna: 3, linha: "principal", acoes: ["Leva alguns segundos", "Cada etapa aparece na lista"] },
  { id: "escolhas", titulo: "Escolher cores, letras e logo", texto: "Três opções de cada, com a aposta do Hattie já marcada. Cada passo mostra as opções com o que veio antes.", imagem: "escolhas", href: `${M}/escolhas`, coluna: 4, linha: "principal", acoes: ["Ficar com a aposta e avançar", "Comparar as três opções", "Voltar a um passo anterior"] },
  { id: "pronta", titulo: "Olha como ficou", texto: "O primeiro impacto da marca inteira, antes de entrar no detalhe de cada ponto.", imagem: "pronta", href: `${M}/pronta`, coluna: 5, linha: "principal", acoes: ["Ver logo, mockups, cores e peças", "Pedir ajuste ao Hattie", "Começar a validação"] },
  { id: "cerebro", titulo: "Visão geral do cérebro", texto: "Todas as decisões da marca num lugar, com o que já foi aprovado e o que falta.", imagem: "cerebro-visao", href: `${M}/cerebro`, coluna: 5, linha: "alternativa", acoes: ["Abrir qualquer ponto", "Ver o progresso por grupo"] },
  { id: "validar", titulo: "Aprovar ponto por ponto", texto: "Cada ponto mostra a proposta e o porquê. A Bia decide o que fazer com ele.", imagem: "validar", href: `${M}/cerebro/nome`, coluna: 6, linha: "principal", acoes: ["Aprovar e seguir para o próximo", "Editar com o Hattie", "Contratar um parceiro para o ponto"] },
  { id: "editar", titulo: "Editar com o Hattie", texto: "Um painel abre ao lado do ponto. A Bia conta o que quer mudar e o Hattie propõe outra versão.", coluna: 6, linha: "alternativa", acoes: ["Pedir em texto livre", "Comparar antes de aprovar"] },
  { id: "parceiros", titulo: "Contratar um parceiro", texto: "O pedido chega escrito, com o ponto da marca, e os parceiros certos aparecem primeiro.", imagem: "parceiros", href: `${M}/parceiros`, coluna: 6, linha: "parceiro", acoes: ["Filtrar por especialidade e preço", "Escolher o que o parceiro vê da marca"] },
  { id: "perfil", titulo: "Perfil do parceiro", texto: "Trabalhos, pacotes com preço e prazo, e o que outras marcas acharam.", imagem: "perfil", href: `${M}/parceiros/perfil/ana-prado`, coluna: 7, linha: "parceiro", acoes: ["Ver pacotes e prazos", "Mandar mensagem ou pedir orçamento"] },
  { id: "mensagens", titulo: "Conversa, proposta e orçamento", texto: "A Bia pergunta, o parceiro tira dúvidas e manda a proposta com valor e prazo.", imagem: "mensagens", href: `${M}/parceiros/mensagens/ensaio-origem`, coluna: 8, linha: "parceiro", acoes: ["Aprovar a proposta", "Pedir ajuste no valor ou no prazo", "Procurar outro parceiro"] },
  { id: "quadro", titulo: "Acompanhar no quadro", texto: "Cada trabalho anda por pedido, proposta, em andamento, revisão e entregue.", imagem: "quadro", href: `${M}/parceiros/quadro`, coluna: 9, linha: "parceiro", acoes: ["Pedir revisão da entrega", "Aprovar e guardar a entrega"] },
  { id: "inicio", titulo: "Início da marca", texto: "\"O que vamos criar hoje?\", com projetos recentes e modelos que já preenchem o pedido.", imagem: "inicio", href: M, coluna: 7, linha: "principal", acoes: ["Pedir algo direto no campo", "Abrir um projeto recente", "Usar um modelo pronto"] },
  { id: "hattie", titulo: "Conversa com o Hattie", texto: "Uma legenda, uma ideia de post ou uma opinião, sempre com o cérebro da marca.", imagem: "hattie", href: `${M}/hattie/nova`, coluna: 7, linha: "alternativa", acoes: ["Perguntar qualquer coisa da marca", "Voltar para o início"] },
  { id: "projetos", titulo: "Projetos", texto: "Cada entrega num projeto: lançamento, campanha, catálogo. Com filtros, grade ou lista.", imagem: "projetos", href: `${M}/projetos`, coluna: 8, linha: "principal", acoes: ["Criar um projeto com o primeiro pedido", "Fixar, concluir ou arquivar"] },
  { id: "projeto", titulo: "Criar no projeto", texto: "Canvas, grade e thread. A Bia pede e o Hattie cria imagens e peças ali mesmo.", imagem: "projeto", href: `${M}/projetos/pequi`, coluna: 9, linha: "principal", acoes: ["Pedir ajuste ou gerar de novo", "Ajustar a imagem no visor", "Organizar em páginas e pastas"] },
  { id: "biblioteca", titulo: "Biblioteca", texto: "Tudo o que a marca criou, enviou ou recebeu de parceiros, com busca por frase.", imagem: "biblioteca", href: `${M}/biblioteca`, coluna: 10, linha: "principal", acoes: ["Procurar como se fala", "Baixar, compartilhar ou mover", "Usar num projeto"] },
]

const ARESTAS: Aresta[] = [
  { de: "criar-conta", para: "comecar", saida: "direita", entrada: "esquerda", tipo: "principal" },
  { de: "entrar", para: "comecar", saida: "direita", entrada: "esquerda", tipo: "alternativo", rotulo: "já tem conta" },
  { de: "comecar", para: "criacao", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "criar do zero" },
  { de: "comecar", para: "importar", saida: "topo", entrada: "base", tipo: "alternativo", rotulo: "já tem marca" },
  { de: "importar", para: "criando", saida: "direita", entrada: "topo", tipo: "alternativo", rotulo: "o Hattie lê os materiais" },
  { de: "criacao", para: "criacao", saida: "topo", entrada: "topo", tipo: "principal", rotulo: "responde ou pula", desvio: 44, trecho: 1 },
  { de: "criacao", para: "criando", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "plimm" },
  { de: "criando", para: "escolhas", saida: "direita", entrada: "esquerda", tipo: "principal" },
  { de: "escolhas", para: "escolhas", saida: "topo", entrada: "topo", tipo: "principal", rotulo: "compara e escolhe", desvio: 44, trecho: 1 },
  { de: "escolhas", para: "pronta", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "plimm" },
  { de: "pronta", para: "criando", saida: "base", entrada: "base", tipo: "alternativo", rotulo: "pede ajuste ao Hattie", desvio: 40, trecho: 1 },
  { de: "pronta", para: "validar", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "começar a validação" },
  { de: "pronta", para: "cerebro", saida: "topo", entrada: "base", tipo: "alternativo", rotulo: "ver tudo", duplo: true },
  { de: "validar", para: "editar", saida: "topo", entrada: "base", tipo: "alternativo", rotulo: "ajusta e volta", duplo: true },
  { de: "validar", para: "inicio", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "aprovou tudo" },
  { de: "validar", para: "parceiros", saida: "base", entrada: "topo", tipo: "parceiro", rotulo: "chamar um parceiro" },
  { de: "parceiros", para: "perfil", saida: "direita", entrada: "esquerda", tipo: "parceiro" },
  { de: "perfil", para: "mensagens", saida: "direita", entrada: "esquerda", tipo: "parceiro", rotulo: "pede orçamento" },
  { de: "mensagens", para: "mensagens", saida: "topo", entrada: "topo", tipo: "parceiro", rotulo: "pede ajuste na proposta", desvio: 36, trecho: 1 },
  { de: "mensagens", para: "perfil", saida: "base", entrada: "base", tipo: "parceiro", rotulo: "procura outro parceiro", desvio: 34, trecho: 1 },
  { de: "mensagens", para: "quadro", saida: "direita", entrada: "esquerda", tipo: "parceiro", rotulo: "aprova a proposta" },
  { de: "quadro", para: "quadro", saida: "topo", entrada: "topo", tipo: "parceiro", rotulo: "pede revisão", desvio: 36, trecho: 1 },
  { de: "quadro", para: "biblioteca", saida: "direita", entrada: "base", tipo: "parceiro", rotulo: "a entrega vai para a biblioteca" },
  { de: "inicio", para: "hattie", saida: "topo", entrada: "base", tipo: "alternativo", rotulo: "pergunta e volta", duplo: true },
  { de: "inicio", para: "projetos", saida: "direita", entrada: "esquerda", tipo: "principal" },
  { de: "projetos", para: "projeto", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "abrir um projeto" },
  { de: "projeto", para: "projeto", saida: "topo", entrada: "topo", tipo: "principal", rotulo: "pede ajuste ou gera de novo", desvio: 44, trecho: 1 },
  { de: "projeto", para: "biblioteca", saida: "direita", entrada: "esquerda", tipo: "principal", rotulo: "tudo fica guardado" },
]

const ETAPAS = [
  { numero: 1, titulo: "chegar", de: 0, ate: 0 },
  { numero: 2, titulo: "começar", de: 1, ate: 1 },
  { numero: 3, titulo: "criar a marca", de: 2, ate: 5 },
  { numero: 4, titulo: "aprovar", de: 6, ate: 6 },
  { numero: 5, titulo: "usar no dia a dia", de: 7, ate: 10 },
]

/* ---------- Geometria do quadro ---------- */

const COLUNA = 432
const CARD = 288
const IMAGEM = 180 // 288 × 180 = proporção 16:10 das capturas (1440 × 900)
const ALTURA_CARD = IMAGEM + 176
const MARGEM = 48
const TOPO = 120 // espaço das etapas e dos laços de cima
const Y: Record<Linha, number> = { alternativa: TOPO, principal: TOPO + ALTURA_CARD + 150, parceiro: TOPO + 2 * (ALTURA_CARD + 150) + 30 }
const LARGURA = MARGEM * 2 + COLUNA * 10 + CARD
const ALTURA = Y.parceiro + ALTURA_CARD + 110

const xDe = (no: No) => MARGEM + no.coluna * COLUNA
/** Caixa usada pelas setas: a área da imagem do card, para as setas chegarem na altura da tela, não do texto. */
const caixaDe = (no: No): Caixa => ({ x: xDe(no), y: Y[no.linha], l: CARD, a: IMAGEM })
/** Setas que saem ou chegam pela base usam a base do card inteiro (abaixo do texto). */
const caixaComTexto = (no: No): Caixa => ({ x: xDe(no), y: Y[no.linha], l: CARD, a: ALTURA_CARD })

function trajeto(a: Aresta): P[] {
  const de = NOS.find((no) => no.id === a.de)!
  const para = NOS.find((no) => no.id === a.para)!
  const caixa = (no: No, lado: Lado) => (lado === "base" ? caixaComTexto(no) : caixaDe(no))
  if (de === para) return rota(caixaDe(de), a.saida, caixaDe(de), a.entrada, { desvio: a.desvio })
  return rota(caixa(de, a.saida), a.saida, caixa(para, a.entrada), a.entrada, { desvio: a.desvio, quebra: (COLUNA - CARD) / 2 })
}

const COR: Record<Tipo, string> = { principal: "var(--preto)", alternativo: "var(--texto-3)", parceiro: "var(--rosa-forte)" }

/* ---------- Página ---------- */

export function Jornada() {
  const [aberto, setAberto] = useState<No | null>(null)
  const [vista, setVista] = useState<"telas" | "fluxograma">("telas")
  // No celular, o fluxograma começa menor; depois vale o que a pessoa escolher.
  const estreito = useMidia("(max-width: 767px)", false)
  const [zoomEscolhido, setZoomFluxo] = useState<number | null>(null)
  const zoomFluxo = zoomEscolhido ?? (estreito ? 0.5 : 0.82)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-4 pt-6 pb-4 md:px-8">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-1.5 self-start text-xs font-medium text-texto-2 hover:text-texto">
            <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden /> Mapa das telas
          </Link>
          <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={150} height={32} priority className="h-8 w-auto self-start" />
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-titulo-2 font-medium lowercase md:text-titulo-1">jornada da bia, do zero à marca no dia a dia</h1>
            <p className="max-w-[72ch] text-texto-2">
              Como a Bia chega, cria a Raiz Natural com o Hattie, aprova ponto por ponto, ajusta o que quiser, chama um parceiro quando precisa e cria as peças da marca.
            </p>
          </div>
          <div role="tablist" aria-label="Como ver a jornada" className="flex items-center gap-0.5 self-start rounded-full bg-superficie p-1">
            {(
              [
                ["telas", "Telas"],
                ["fluxograma", "Fluxograma"],
              ] as const
            ).map(([valor, rotulo]) => (
              <button
                key={valor}
                type="button"
                role="tab"
                aria-selected={vista === valor}
                onClick={() => setVista(valor)}
                className={cn("h-9 rounded-full px-4 text-sm font-medium transition-[background-color,color] duration-150", vista === valor ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento hover:text-texto")}
              >
                {rotulo}
              </button>
            ))}
          </div>
        </div>
        {vista === "telas" ? (
          <Legenda />
        ) : (
          <div className="flex items-center gap-0.5 rounded-full bg-superficie p-1">
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Diminuir o zoom" onClick={() => setZoomFluxo(Math.max(0.3, +(zoomFluxo - 0.1).toFixed(2)))}>
              <Minus />
            </Botao>
            <span className="w-11 text-center text-xs font-medium tabular-nums">{Math.round(zoomFluxo * 100)}%</span>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Aumentar o zoom" onClick={() => setZoomFluxo(Math.min(1.2, +(zoomFluxo + 0.1).toFixed(2)))}>
              <Plus />
            </Botao>
          </div>
        )}
      </header>

      {vista === "telas" ? (
        <>
          <p className="px-4 pb-3 text-xs text-texto-2 md:px-8">Arraste para mover, use o zoom no canto e clique numa tela para ver grande.</p>
          <Quadro aoAbrir={setAberto} />
          <Lista aoAbrir={setAberto} />
        </>
      ) : (
        <div className="px-4 pb-10 md:px-8">
          <Fluxograma zoom={zoomFluxo} />
        </div>
      )}

      <Dialog open={!!aberto} onOpenChange={(valor) => !valor && setAberto(null)}>
        <DialogContent showCloseButton={false} className="w-[min(1200px,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden rounded-3xl bg-superficie p-0 ring-0 sm:max-w-none">
          {aberto && (
            <>
              <div className="flex items-start gap-3 px-5 pt-4 pb-3">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <DialogTitle className="text-base font-semibold">{aberto.titulo}</DialogTitle>
                  <DialogDescription className="text-sm text-texto-2">{aberto.texto}</DialogDescription>
                </div>
                {aberto.href && (
                  <Botao variante="secundario" tamanho="sm" asChild>
                    <Link href={aberto.href as Route} target="_blank" rel="noopener noreferrer">
                      Abrir a tela <ArrowUpRight />
                    </Link>
                  </Botao>
                )}
                <Botao variante="fantasma" tamanho="icone-sm" aria-label="Fechar" onClick={() => setAberto(null)}>
                  <X />
                </Botao>
              </div>
              {aberto.imagem && (
                // eslint-disable-next-line @next/next/no-img-element -- captura estática do protótipo
                <img src={`/jornada/${aberto.imagem}.jpg`} alt={`Tela: ${aberto.titulo}`} className="block w-full bg-canvas" />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Legenda() {
  const itens: { tipo: Tipo; rotulo: string; tracejada?: boolean }[] = [
    { tipo: "principal", rotulo: "Caminho principal" },
    { tipo: "alternativo", rotulo: "Outro caminho", tracejada: true },
    { tipo: "parceiro", rotulo: "Com um parceiro" },
  ]
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-texto-2" aria-label="Legenda das setas">
      {itens.map((item) => (
        <li key={item.tipo} className="flex items-center gap-2">
          <svg width="28" height="8" aria-hidden>
            <line x1="1" y1="4" x2="27" y2="4" stroke={COR[item.tipo]} strokeWidth="2" strokeDasharray={item.tracejada ? "5 4" : undefined} strokeLinecap="round" />
          </svg>
          {item.rotulo}
        </li>
      ))}
    </ul>
  )
}

/* ---------- Quadro (computador) ---------- */

function Quadro({ aoAbrir }: { aoAbrir: (no: No) => void }) {
  const area = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.72)
  const arrasto = useRef<{ x: number; y: number; esquerda: number; topo: number; moveu: boolean } | null>(null)
  const [arrastando, setArrastando] = useState(false)

  const ajustar = () => {
    const elemento = area.current
    if (!elemento) return
    setZoom(Math.max(0.3, Math.min(1, (elemento.clientWidth - 32) / LARGURA, (elemento.clientHeight - 16) / ALTURA)))
    elemento.scrollTo({ left: 0, top: 0 })
  }

  // Ctrl/⌘ + roda dá zoom, como num quadro de design.
  useEffect(() => {
    const elemento = area.current
    if (!elemento) return
    const aoRolar = (evento: WheelEvent) => {
      if (!evento.ctrlKey && !evento.metaKey) return
      evento.preventDefault()
      setZoom((atual) => Math.max(0.3, Math.min(1.2, atual * Math.exp(-evento.deltaY * 0.004))))
    }
    elemento.addEventListener("wheel", aoRolar, { passive: false })
    return () => elemento.removeEventListener("wheel", aoRolar)
  }, [])

  const aoApertar = (evento: EventoPonteiro<HTMLDivElement>) => {
    if (evento.pointerType !== "mouse" || evento.button !== 0) return
    const elemento = area.current!
    arrasto.current = { x: evento.clientX, y: evento.clientY, esquerda: elemento.scrollLeft, topo: elemento.scrollTop, moveu: false }
  }
  const aoMover = (evento: EventoPonteiro<HTMLDivElement>) => {
    const atual = arrasto.current
    if (!atual) return
    const dx = evento.clientX - atual.x
    const dy = evento.clientY - atual.y
    if (!atual.moveu && Math.abs(dx) + Math.abs(dy) < 5) return
    if (!atual.moveu) {
      atual.moveu = true
      setArrastando(true)
      area.current!.setPointerCapture(evento.pointerId)
    }
    area.current!.scrollLeft = atual.esquerda - dx
    area.current!.scrollTop = atual.topo - dy
  }
  const aoSoltar = () => {
    // Um clique que virou arrasto não abre a tela.
    if (arrasto.current?.moveu) setTimeout(() => setArrastando(false), 0)
    arrasto.current = null
  }

  return (
    <section aria-label="Jornada em quadro" className="relative mx-4 mb-4 hidden min-h-0 flex-1 overflow-hidden rounded-[32px] bg-canvas shadow-(--sombra-canvas) md:mx-8 lg:flex">
      <div
        ref={area}
        onPointerDown={aoApertar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        className={cn("h-[calc(100svh-15rem)] min-h-[560px] w-full overflow-auto", arrastando ? "cursor-grabbing select-none" : "cursor-grab")}
      >
        <div style={{ width: LARGURA * zoom, height: ALTURA * zoom }}>
          <div className="relative origin-top-left" style={{ width: LARGURA, height: ALTURA, transform: `scale(${zoom})` }}>
            {/* Faixa do caminho com parceiro */}
            <div
              aria-hidden
              className="absolute rounded-[40px] bg-(--rosa-suave)/60"
              style={{ left: MARGEM + 5 * COLUNA - 28, top: Y.parceiro - 56, width: 3 * COLUNA + CARD + 56, height: ALTURA_CARD + 84 }}
            />
            <p className="absolute -translate-x-full font-heading text-base font-medium text-(--rosa-tinta) lowercase" style={{ left: MARGEM + 8 * COLUNA + CARD + 4, top: Y.parceiro - 44 }}>
              com um parceiro
            </p>

            {/* Etapas */}
            {ETAPAS.map((etapa) => (
              <div key={etapa.numero} className="absolute flex items-center gap-2.5" style={{ left: MARGEM + etapa.de * COLUNA, top: 24, width: (etapa.ate - etapa.de) * COLUNA + CARD }}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lima font-heading text-sm font-semibold text-preto">{etapa.numero}</span>
                <span className="font-heading text-titulo-3 font-medium lowercase">{etapa.titulo}</span>
                <span aria-hidden className="h-px flex-1 bg-borda-sutil" />
              </div>
            ))}

            {/* Setas */}
            <svg className="pointer-events-none absolute inset-0 overflow-visible" width={LARGURA} height={ALTURA} aria-hidden>
              <defs>
                {(Object.keys(COR) as Tipo[]).map((tipo) => (
                  <marker key={tipo} id={`ponta-${tipo}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                    <path d="M1 1.5 L8.5 5 L1 8.5" fill="none" stroke={COR[tipo]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </marker>
                ))}
              </defs>
              {ARESTAS.map((aresta) => {
                const pontos = trajeto(aresta)
                return (
                  <path
                    key={`${aresta.de}-${aresta.para}`}
                    d={caminho(pontos)}
                    fill="none"
                    stroke={COR[aresta.tipo]}
                    strokeWidth={2}
                    strokeDasharray={aresta.tipo === "alternativo" ? "7 6" : undefined}
                    strokeLinecap="round"
                    markerEnd={`url(#ponta-${aresta.tipo})`}
                    markerStart={aresta.duplo ? `url(#ponta-${aresta.tipo})` : undefined}
                  />
                )
              })}
            </svg>

            {/* Rótulos das setas */}
            {ARESTAS.filter((aresta) => aresta.rotulo).map((aresta) => {
              const lugar = lugarDoRotulo(trajeto(aresta), aresta.trecho)
              return (
                <span
                  key={`r-${aresta.de}-${aresta.para}`}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                    aresta.tipo === "parceiro" ? "bg-(--rosa-suave) text-(--rosa-tinta)" : aresta.tipo === "alternativo" ? "bg-superficie text-texto-2" : "bg-preto text-lima",
                  )}
                  style={{ left: lugar.x, top: lugar.y }}
                >
                  {aresta.rotulo}
                </span>
              )
            })}

            {/* Telas */}
            {NOS.map((no) => (
              <div key={no.id} className="absolute" style={{ left: xDe(no), top: Y[no.linha], width: CARD }}>
                <CartaoTela no={no} aoAbrir={() => !arrastando && aoAbrir(no)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute end-4 bottom-4 flex items-center gap-0.5 rounded-full bg-superficie p-1 shadow-(--sombra-flutuante)">
        <Botao variante="fantasma" tamanho="icone-sm" aria-label="Diminuir o zoom" onClick={() => setZoom((atual) => Math.max(0.3, atual - 0.1))}>
          <Minus />
        </Botao>
        <span className="w-11 text-center text-xs font-medium tabular-nums">{Math.round(zoom * 100)}%</span>
        <Botao variante="fantasma" tamanho="icone-sm" aria-label="Aumentar o zoom" onClick={() => setZoom((atual) => Math.min(1.2, atual + 0.1))}>
          <Plus />
        </Botao>
        <Botao variante="fantasma" tamanho="sm" onClick={ajustar}>
          <Scan /> Ver tudo
        </Botao>
      </div>
    </section>
  )
}

function CartaoTela({ no, aoAbrir, className }: { no: No; aoAbrir: () => void; className?: string }) {
  return (
    <article className={cn("group/tela flex flex-col gap-2.5", className)}>
      {no.imagem ? (
        <button
          type="button"
          onClick={aoAbrir}
          aria-label={`Ver a tela ${no.titulo} grande`}
          className={cn(
            "relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-superficie shadow-(--sombra-campo) transition-[box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:shadow-(--sombra-flutuante)",
            no.linha === "alternativa" && "opacity-90",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- captura estática do protótipo */}
          <img src={`/jornada/${no.imagem}.jpg`} alt="" draggable={false} className="size-full object-cover object-top" />
          <span className="absolute end-2 top-2 grid size-7 place-items-center rounded-full bg-superficie/90 opacity-0 transition-opacity duration-150 group-hover/tela:opacity-100">
            <Maximize2 className="size-3.5" strokeWidth={2} aria-hidden />
          </span>
        </button>
      ) : (
        <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-lima-suave p-5 text-center">
          <span className="grid size-10 place-items-center rounded-full bg-superficie">
            {no.id === "editar" ? <SquarePen className="size-4.5" strokeWidth={2} aria-hidden /> : <Download className="size-4.5" strokeWidth={2} aria-hidden />}
          </span>
          <span className="text-xs text-texto-2">{no.id === "editar" ? "Painel ao lado do ponto, no cérebro da marca" : "Mesma tela do primeiro acesso, na aba Importar marca"}</span>
        </div>
      )}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="text-sm font-semibold">{no.titulo}</h3>
        <p className="text-xs leading-relaxed text-texto-2">{no.texto}</p>
        {no.acoes && (
          <ul className="flex flex-col gap-0.5 pt-0.5" aria-label="O que dá para fazer">
            {no.acoes.map((acao) => (
              <li key={acao} className="flex gap-1.5 text-xs leading-snug">
                <span aria-hidden className="mt-[0.45em] size-1 shrink-0 rounded-full bg-texto-3" />
                {acao}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

/* ---------- Lista (celular e telas estreitas) ---------- */

function Lista({ aoAbrir }: { aoAbrir: (no: No) => void }) {
  const etapaDe = (no: No) => ETAPAS.find((etapa) => no.coluna >= etapa.de && no.coluna <= etapa.ate)!
  return (
    <div className="flex flex-col gap-8 px-4 pb-10 md:px-8 lg:hidden">
      {ETAPAS.map((etapa) => {
        const principais = NOS.filter((no) => etapaDe(no) === etapa && no.linha === "principal").sort((a, b) => a.coluna - b.coluna)
        const outras = NOS.filter((no) => etapaDe(no) === etapa && no.linha === "alternativa")
        const parceiro = etapa.numero === 4 ? NOS.filter((no) => no.linha === "parceiro").sort((a, b) => a.coluna - b.coluna) : []
        return (
          <section key={etapa.numero} aria-labelledby={`etapa-${etapa.numero}`} className="flex flex-col gap-3">
            <h2 id={`etapa-${etapa.numero}`} className="flex items-center gap-2.5">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lima font-heading text-sm font-semibold text-preto">{etapa.numero}</span>
              <span className="font-heading text-titulo-3 font-medium lowercase">{etapa.titulo}</span>
            </h2>
            <ol className="grid gap-4 sm:grid-cols-2">
              {principais.map((no) => (
                <li key={no.id}>
                  <CartaoTela no={no} aoAbrir={() => aoAbrir(no)} />
                </li>
              ))}
            </ol>
            {outras.length > 0 && (
              <div className="flex flex-col gap-3 rounded-3xl bg-superficie/60 p-3">
                <p className="px-1 text-xs font-medium text-texto-2">Outro caminho</p>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {outras.map((no) => (
                    <li key={no.id}>
                      <CartaoTela no={no} aoAbrir={() => aoAbrir(no)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {parceiro.length > 0 && (
              <div className="flex flex-col gap-3 rounded-3xl bg-(--rosa-suave)/60 p-3">
                <p className="px-1 font-heading text-base font-medium text-(--rosa-tinta) lowercase">com um parceiro</p>
                <ol className="grid gap-4 sm:grid-cols-2">
                  {parceiro.map((no) => (
                    <li key={no.id}>
                      <CartaoTela no={no} aoAbrir={() => aoAbrir(no)} />
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
