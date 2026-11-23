"use client"

import { cn } from "@/lib/utils"
import { caminho, lugarDoRotulo, rota, type Caixa, type Lado, type P } from "@/lib/fluxo"

/*
 * Fluxograma da jornada, em três partes, com raias de quem faz cada passo: a Bia, o Hattie e o parceiro.
 * Formas de fluxograma: pílula preta para começo e fim, caixa para um passo, losango para uma decisão
 * e círculo lima para continuar na parte seguinte. As setas que voltam mostram os laços: o Hattie perguntando
 * de novo, a Bia ajustando com o Hattie, pedindo outra proposta ou uma revisão ao parceiro.
 */

type Raia = "bia" | "hattie" | "parceiro"
type Forma = "inicio" | "fim" | "passo" | "decisao" | "conector"

type No = { id: string; coluna: number; raia: Raia; sub?: 0 | 1; forma: Forma; texto: string; nota?: string }
type Seta = { de: string; para: string; saida: Lado; entrada: Lado; rotulo?: string; desvio?: number; trecho?: number; tracejada?: boolean }
type Parte = { numero: number; titulo: string; texto: string; nos: No[]; setas: Seta[] }

const PARTES: Parte[] = [
  {
    numero: 1,
    titulo: "chegar e criar a marca",
    texto: "Da conta nova à primeira versão da marca. O Hattie conduz as perguntas e a Bia pode pular o que não souber.",
    nos: [
      { id: "chega", coluna: 0, raia: "bia", forma: "inicio", texto: "A Bia chega ao Hattie" },
      { id: "conta", coluna: 1, raia: "bia", forma: "decisao", texto: "Tem conta?" },
      { id: "cria-conta", coluna: 2, raia: "bia", sub: 1, forma: "passo", texto: "Cria a conta", nota: "nome, e-mail e senha" },
      { id: "marca", coluna: 3, raia: "bia", forma: "decisao", texto: "Já tem uma marca?" },
      { id: "ideia", coluna: 4, raia: "bia", forma: "passo", texto: "Conta a ideia do jeito dela", nota: "texto, arquivos e links" },
      { id: "materiais", coluna: 4, raia: "bia", sub: 1, forma: "passo", texto: "Envia o que já tem", nota: "logo, manual, site e redes" },
      { id: "pergunta", coluna: 5, raia: "hattie", forma: "passo", texto: "Pergunta o que falta", nota: "com o plano dos pontos ao lado" },
      { id: "responde", coluna: 6, raia: "bia", forma: "passo", texto: "Responde, manda material ou pula", nota: "o que ela pular, o Hattie decide" },
      { id: "falta", coluna: 7, raia: "hattie", forma: "decisao", texto: "Falta algum ponto?" },
      { id: "le", coluna: 7, raia: "hattie", sub: 1, forma: "passo", texto: "Lê os materiais e organiza no cérebro", nota: "e aponta o que falta" },
      { id: "plimm", coluna: 8, raia: "bia", forma: "passo", texto: "Clica em Criar minha marca", nota: "o botão plimm" },
      { id: "cria", coluna: 9, raia: "hattie", forma: "passo", texto: "Pesquisa e cria a marca", nota: "e separa três opções de cores, letras e logo" },
      { id: "escolhe", coluna: 10, raia: "bia", forma: "passo", texto: "Escolhe cores, letras e logo", nota: "a aposta do Hattie já vem marcada" },
      { id: "ve", coluna: 11, raia: "bia", forma: "passo", texto: "Vê o todo em Olha como ficou", nota: "com as escolhas dela" },
      { id: "gostou", coluna: 12, raia: "bia", forma: "decisao", texto: "Gostou do todo?" },
      { id: "refaz", coluna: 12, raia: "hattie", forma: "passo", texto: "Ajusta o que ela pediu", nota: "e mostra de novo" },
      { id: "segue", coluna: 13, raia: "bia", forma: "conector", texto: "1", nota: "aprovar" },
    ],
    setas: [
      { de: "chega", para: "conta", saida: "direita", entrada: "esquerda" },
      { de: "conta", para: "cria-conta", saida: "base", entrada: "esquerda", rotulo: "não" },
      { de: "conta", para: "marca", saida: "direita", entrada: "esquerda", rotulo: "sim, entra" },
      { de: "cria-conta", para: "marca", saida: "direita", entrada: "base" },
      { de: "marca", para: "ideia", saida: "direita", entrada: "esquerda", rotulo: "não" },
      { de: "marca", para: "materiais", saida: "base", entrada: "esquerda", rotulo: "sim" },
      { de: "ideia", para: "pergunta", saida: "direita", entrada: "topo" },
      { de: "pergunta", para: "responde", saida: "direita", entrada: "base" },
      { de: "responde", para: "falta", saida: "direita", entrada: "topo" },
      { de: "falta", para: "pergunta", saida: "base", entrada: "base", rotulo: "sim, pergunta de novo", desvio: 26, trecho: 1 },
      { de: "falta", para: "plimm", saida: "direita", entrada: "base", rotulo: "não" },
      { de: "materiais", para: "le", saida: "base", entrada: "esquerda" },
      { de: "le", para: "cria", saida: "direita", entrada: "base" },
      { de: "plimm", para: "cria", saida: "direita", entrada: "topo" },
      { de: "cria", para: "escolhe", saida: "direita", entrada: "base" },
      { de: "escolhe", para: "ve", saida: "direita", entrada: "esquerda" },
      { de: "ve", para: "gostou", saida: "direita", entrada: "esquerda" },
      { de: "gostou", para: "refaz", saida: "base", entrada: "topo", rotulo: "não, pede ajuste" },
      { de: "refaz", para: "ve", saida: "esquerda", entrada: "base" },
      { de: "gostou", para: "segue", saida: "direita", entrada: "esquerda", rotulo: "sim" },
    ],
  },
  {
    numero: 2,
    titulo: "aprovar ponto por ponto e chamar um parceiro",
    texto: "Cada ponto da marca passa pela Bia. Ela aprova, ajusta com o Hattie ou chama um parceiro, conversa, pede orçamento e acompanha a entrega.",
    nos: [
      { id: "chega", coluna: 0, raia: "bia", forma: "conector", texto: "1", nota: "aprovar" },
      { id: "abre", coluna: 1, raia: "bia", forma: "passo", texto: "Abre um ponto da marca", nota: "propósito, nome, logo, cores…" },
      { id: "faz", coluna: 2, raia: "bia", forma: "decisao", texto: "O que faz com o ponto?" },
      { id: "edita", coluna: 2, raia: "hattie", forma: "passo", texto: "Conversa e propõe outra versão", nota: "Editar com o Hattie" },
      { id: "pedido", coluna: 3, raia: "hattie", sub: 1, forma: "passo", texto: "Monta o pedido e indica parceiros", nota: "com o ponto e a especialidade" },
      { id: "perfis", coluna: 4, raia: "bia", sub: 1, forma: "passo", texto: "Vê perfis, trabalhos e preços" },
      { id: "pergunta", coluna: 5, raia: "bia", sub: 1, forma: "passo", texto: "Pergunta e pede orçamento", nota: "na conversa com o parceiro" },
      { id: "proposta", coluna: 6, raia: "parceiro", forma: "passo", texto: "Tira as dúvidas e manda a proposta", nota: "valor, prazo e o que inclui" },
      { id: "serve", coluna: 7, raia: "bia", sub: 1, forma: "decisao", texto: "A proposta serve?" },
      { id: "aprova-proposta", coluna: 8, raia: "bia", sub: 1, forma: "passo", texto: "Aprova a proposta", nota: "o trabalho entra no quadro" },
      { id: "trabalha", coluna: 9, raia: "parceiro", forma: "passo", texto: "Recebe o cérebro da marca e trabalha", nota: "e entrega para revisão" },
      { id: "entrega", coluna: 10, raia: "bia", sub: 1, forma: "decisao", texto: "A entrega está boa?" },
      { id: "guarda", coluna: 11, raia: "hattie", sub: 1, forma: "passo", texto: "Guarda no cérebro e na biblioteca" },
      { id: "aprova", coluna: 12, raia: "bia", forma: "passo", texto: "Aprova o ponto" },
      { id: "falta", coluna: 13, raia: "bia", forma: "decisao", texto: "Falta aprovar algum ponto?" },
      { id: "segue", coluna: 14, raia: "bia", forma: "conector", texto: "2", nota: "dia a dia" },
    ],
    setas: [
      { de: "chega", para: "abre", saida: "direita", entrada: "esquerda" },
      { de: "abre", para: "faz", saida: "direita", entrada: "esquerda" },
      { de: "faz", para: "edita", saida: "base", entrada: "topo", rotulo: "ajustar com o Hattie" },
      { de: "edita", para: "abre", saida: "esquerda", entrada: "base", rotulo: "nova versão" },
      { de: "faz", para: "aprova", saida: "topo", entrada: "topo", rotulo: "aprovar", desvio: 44 },
      { de: "faz", para: "pedido", saida: "direita", entrada: "topo", rotulo: "chamar um parceiro", trecho: 1 },
      { de: "pedido", para: "perfis", saida: "direita", entrada: "base" },
      { de: "perfis", para: "pergunta", saida: "direita", entrada: "esquerda" },
      { de: "pergunta", para: "proposta", saida: "direita", entrada: "topo" },
      { de: "proposta", para: "serve", saida: "direita", entrada: "base" },
      { de: "serve", para: "proposta", saida: "base", entrada: "base", rotulo: "não, pede ajuste", desvio: 40, trecho: 2 },
      { de: "serve", para: "perfis", saida: "topo", entrada: "topo", rotulo: "não, procura outro", desvio: 34 },
      { de: "serve", para: "aprova-proposta", saida: "direita", entrada: "esquerda", rotulo: "sim" },
      { de: "aprova-proposta", para: "trabalha", saida: "direita", entrada: "topo" },
      { de: "trabalha", para: "entrega", saida: "direita", entrada: "base" },
      { de: "entrega", para: "trabalha", saida: "base", entrada: "base", rotulo: "não, pede revisão", desvio: 40, trecho: 2 },
      { de: "entrega", para: "guarda", saida: "direita", entrada: "topo", rotulo: "sim" },
      { de: "guarda", para: "aprova", saida: "direita", entrada: "base" },
      { de: "aprova", para: "falta", saida: "direita", entrada: "esquerda" },
      { de: "falta", para: "abre", saida: "topo", entrada: "topo", rotulo: "sim, próximo ponto", desvio: 84 },
      { de: "falta", para: "segue", saida: "direita", entrada: "esquerda", rotulo: "não" },
    ],
  },
  {
    numero: 3,
    titulo: "o dia a dia da marca",
    texto: "Com a marca aprovada, a Bia cria com o Hattie, tira dúvidas e chama parceiros para tarefas dos projetos. Tudo fica na biblioteca.",
    nos: [
      { id: "chega", coluna: 0, raia: "bia", forma: "conector", texto: "2", nota: "dia a dia" },
      { id: "inicio", coluna: 1, raia: "bia", forma: "passo", texto: "Abre o início", nota: "o que vamos criar hoje?" },
      { id: "precisa", coluna: 2, raia: "bia", forma: "decisao", texto: "Do que precisa?" },
      { id: "projeto", coluna: 3, raia: "bia", forma: "passo", texto: "Abre um projeto e pede", nota: "ou cria direto no canvas" },
      { id: "conversa", coluna: 3, raia: "hattie", sub: 1, forma: "passo", texto: "Responde com o cérebro da marca", nota: "legenda, ideia ou opinião" },
      { id: "tarefa", coluna: 3, raia: "parceiro", forma: "passo", texto: "Faz uma tarefa do projeto", nota: "mesmo caminho do orçamento da parte 2" },
      { id: "cria", coluna: 4, raia: "hattie", forma: "passo", texto: "Cria imagens, peças e textos", nota: "no estilo da marca" },
      { id: "bom", coluna: 5, raia: "bia", forma: "decisao", texto: "Ficou bom?" },
      { id: "ajusta", coluna: 5, raia: "hattie", sub: 1, forma: "passo", texto: "Ajusta, gera de novo ou edita", nota: "pedido no visor ou no canvas" },
      { id: "guarda", coluna: 6, raia: "bia", forma: "passo", texto: "Guarda, baixa ou publica", nota: "tudo fica na biblioteca" },
      { id: "fim", coluna: 7, raia: "bia", forma: "fim", texto: "Marca viva no dia a dia" },
    ],
    setas: [
      { de: "chega", para: "inicio", saida: "direita", entrada: "esquerda" },
      { de: "inicio", para: "precisa", saida: "direita", entrada: "esquerda" },
      { de: "precisa", para: "projeto", saida: "direita", entrada: "esquerda", rotulo: "uma peça" },
      { de: "precisa", para: "conversa", saida: "base", entrada: "esquerda", rotulo: "uma dúvida ou um texto", trecho: 1 },
      { de: "precisa", para: "tarefa", saida: "base", entrada: "esquerda", rotulo: "alguém para fazer", trecho: 1 },
      { de: "conversa", para: "inicio", saida: "base", entrada: "base", desvio: 30 },
      { de: "projeto", para: "cria", saida: "direita", entrada: "topo" },
      { de: "cria", para: "bom", saida: "direita", entrada: "base" },
      { de: "bom", para: "ajusta", saida: "base", entrada: "topo", rotulo: "não" },
      { de: "ajusta", para: "cria", saida: "esquerda", entrada: "base", rotulo: "de novo" },
      { de: "bom", para: "guarda", saida: "direita", entrada: "esquerda", rotulo: "sim" },
      { de: "tarefa", para: "guarda", saida: "direita", entrada: "base", rotulo: "a entrega vai para a biblioteca", trecho: 0 },
      { de: "guarda", para: "fim", saida: "direita", entrada: "esquerda" },
      { de: "fim", para: "inicio", saida: "topo", entrada: "topo", rotulo: "no dia seguinte", desvio: 70, tracejada: true },
    ],
  },
]

/* ---------- Geometria ---------- */

const PASSO = 196
const RAIA_ROTULO = 132
const MARGEM = 24
const RAIA_ALTURA = 292
const LINHA: [number, number] = [86, 214]
const TAMANHO: Record<Forma, { l: number; a: number }> = {
  inicio: { l: 160, a: 56 },
  fim: { l: 160, a: 56 },
  passo: { l: 164, a: 80 },
  decisao: { l: 152, a: 112 },
  conector: { l: 52, a: 52 },
}

const RAIAS: { id: Raia; nome: string; quem: string; fundo: string; tinta: string }[] = [
  { id: "bia", nome: "Bia", quem: "dona da marca", fundo: "bg-superficie", tinta: "text-texto" },
  { id: "hattie", nome: "Hattie", quem: "mago da marca", fundo: "bg-lima-suave", tinta: "text-texto" },
  { id: "parceiro", nome: "Parceiro", quem: "designer, fotógrafo…", fundo: "bg-(--rosa-suave)", tinta: "text-(--rosa-tinta)" },
]

function medidas(parte: Parte) {
  const raias = RAIAS.filter((raia) => parte.nos.some((no) => no.raia === raia.id))
  const lacoDeCima = Math.max(0, ...parte.setas.filter((seta) => seta.saida === "topo" && seta.entrada === "topo").map((seta) => seta.desvio ?? 40))
  const TOPO = 24 + lacoDeCima
  const topoDe = (raia: Raia) => TOPO + raias.findIndex((item) => item.id === raia) * RAIA_ALTURA
  const colunas = Math.max(...parte.nos.map((no) => no.coluna)) + 1
  const largura = RAIA_ROTULO + MARGEM * 2 + colunas * PASSO
  const altura = TOPO + raias.length * RAIA_ALTURA + 64
  const caixa = (no: No): Caixa => {
    const { l, a } = TAMANHO[no.forma]
    const cx = RAIA_ROTULO + MARGEM + no.coluna * PASSO + PASSO / 2
    const cy = topoDe(no.raia) + LINHA[no.sub ?? 0]
    return { x: cx - l / 2, y: cy - a / 2, l, a }
  }
  return { raias, topoDe, largura, altura, caixa }
}

/* ---------- Componente ---------- */

export function Fluxograma({ zoom }: { zoom: number }) {
  return (
    <div className="flex flex-col gap-10">
      {PARTES.map((parte) => (
        <ParteFluxo key={parte.numero} parte={parte} zoom={zoom} />
      ))}
      <Legenda />
    </div>
  )
}

function ParteFluxo({ parte, zoom }: { parte: Parte; zoom: number }) {
  const { raias, topoDe, largura, altura, caixa } = medidas(parte)
  const porId = new Map(parte.nos.map((no) => [no.id, no]))
  const linhas = parte.setas.map((seta) => {
    const pontos: P[] = rota(caixa(porId.get(seta.de)!), seta.saida, caixa(porId.get(seta.para)!), seta.entrada, { desvio: seta.desvio })
    return { seta, pontos }
  })

  return (
    <section aria-labelledby={`parte-${parte.numero}`} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 px-1">
        <h2 id={`parte-${parte.numero}`} className="flex items-center gap-2.5 font-heading text-titulo-3 font-medium lowercase">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lima text-sm font-semibold text-preto">{parte.numero}</span>
          {parte.titulo}
        </h2>
        <p className="max-w-[80ch] text-sm text-texto-2">{parte.texto}</p>
      </div>

      <div className="max-w-full self-start overflow-x-auto rounded-[28px] bg-canvas shadow-(--sombra-canvas)">
        <div style={{ width: largura * zoom, height: altura * zoom }}>
          <div className="relative origin-top-left" style={{ width: largura, height: altura, transform: `scale(${zoom})` }} role="img" aria-label={descreverParte(parte)}>
            {/* Raias */}
            {raias.map((raia) => (
              <div key={raia.id} className="absolute inset-x-3" style={{ top: topoDe(raia.id) + 6, height: RAIA_ALTURA - 12 }}>
                <div className={cn("absolute inset-0 rounded-3xl opacity-70", raia.fundo)} />
                <div className="absolute top-0 bottom-0 left-0 flex w-[120px] flex-col justify-center gap-0.5 ps-4">
                  <span className={cn("font-heading text-titulo-3 leading-none font-medium lowercase", raia.tinta)}>{raia.nome}</span>
                  <span className="text-xs text-texto-2">{raia.quem}</span>
                </div>
              </div>
            ))}

            {/* Setas */}
            <svg className="pointer-events-none absolute inset-0 overflow-visible" width={largura} height={altura} aria-hidden>
              <defs>
                <marker id={`seta-${parte.numero}`} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                  <path d="M1 1.5 L8.5 5 L1 8.5" fill="none" stroke="var(--preto)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </marker>
              </defs>
              {linhas.map(({ seta, pontos }) => (
                <path
                  key={`${seta.de}-${seta.para}`}
                  d={caminho(pontos)}
                  fill="none"
                  stroke="var(--preto)"
                  strokeWidth={1.75}
                  strokeDasharray={seta.tracejada ? "6 5" : undefined}
                  strokeLinecap="round"
                  markerEnd={`url(#seta-${parte.numero})`}
                />
              ))}
            </svg>

            {/* Formas */}
            {parte.nos.map((no) => {
              const c = caixa(no)
              return (
                <div key={no.id} className="absolute" style={{ left: c.x, top: c.y, width: c.l, height: c.a }}>
                  <Forma no={no} />
                </div>
              )
            })}

            {/* Rótulos das setas */}
            {linhas
              .filter(({ seta }) => seta.rotulo)
              .map(({ seta, pontos }) => {
                const lugar = lugarDoRotulo(pontos, seta.trecho)
                return (
                  <span
                    key={`r-${seta.de}-${seta.para}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-branco px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-texto shadow-[0_0_0_1px_oklch(0_0_0/0.06)]"
                    style={{ left: lugar.x, top: lugar.y }}
                  >
                    {seta.rotulo}
                  </span>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Forma({ no }: { no: No }) {
  if (no.forma === "inicio" || no.forma === "fim")
    return (
      <div className={cn("grid size-full place-items-center rounded-full px-4 text-center text-[13px] leading-tight font-semibold", no.forma === "inicio" ? "bg-preto text-lima" : "bg-lima text-preto")}>
        {no.texto}
      </div>
    )
  if (no.forma === "conector")
    return (
      <div className="relative size-full">
        <div className="grid size-full place-items-center rounded-full bg-lima font-heading text-lg font-semibold text-preto">{no.texto}</div>
        {no.nota && <span className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 text-[11px] font-medium whitespace-nowrap text-texto-2">{no.nota}</span>}
      </div>
    )
  if (no.forma === "decisao")
    return (
      <div className="relative grid size-full place-items-center">
        <svg viewBox="0 0 152 112" className="absolute inset-0 size-full" aria-hidden>
          <path d="M76 3 L149 56 L76 109 L3 56 Z" fill="var(--branco)" stroke="var(--preto)" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
        <span className="relative max-w-[92px] text-center text-[12px] leading-tight font-semibold">{no.texto}</span>
      </div>
    )
  return (
    <div className="flex size-full flex-col items-center justify-center gap-0.5 rounded-2xl bg-branco px-3 text-center shadow-(--sombra-campo)">
      <span className="text-[13px] leading-tight font-semibold">{no.texto}</span>
      {no.nota && <span className="text-[11px] leading-tight text-texto-2">{no.nota}</span>}
    </div>
  )
}

/** Texto para leitores de tela: os passos e as decisões da parte, em ordem. */
function descreverParte(parte: Parte) {
  const porId = new Map(parte.nos.map((no) => [no.id, no]))
  const caminhos = parte.setas.map((seta) => `${porId.get(seta.de)?.texto} → ${porId.get(seta.para)?.texto}${seta.rotulo ? ` (${seta.rotulo})` : ""}`)
  return `Fluxograma da parte ${parte.numero}, ${parte.titulo}: ${caminhos.join("; ")}.`
}

function Legenda() {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 px-1 text-xs text-texto-2" aria-label="Legenda do fluxograma">
      <li className="flex items-center gap-2">
        <span className="h-5 w-12 rounded-full bg-preto" aria-hidden /> começo e fim
      </li>
      <li className="flex items-center gap-2">
        <span className="h-5 w-10 rounded-md bg-branco shadow-[0_0_0_1px_oklch(0_0_0/0.1),0_2px_6px_oklch(0_0_0/0.08)]" aria-hidden /> passo
      </li>
      <li className="flex items-center gap-2">
        <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden>
          <path d="M14 1 L27 11 L14 21 L1 11 Z" fill="var(--branco)" stroke="var(--preto)" strokeWidth="1.5" />
        </svg>
        decisão
      </li>
      <li className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-full bg-lima text-[11px] font-semibold text-preto" aria-hidden>
          1
        </span>
        continua na parte seguinte
      </li>
      <li className="flex items-center gap-2">
        <svg width="28" height="8" aria-hidden>
          <line x1="1" y1="4" x2="27" y2="4" stroke="var(--preto)" strokeWidth="1.75" strokeDasharray="5 4" strokeLinecap="round" />
        </svg>
        volta mais tarde
      </li>
    </ul>
  )
}
