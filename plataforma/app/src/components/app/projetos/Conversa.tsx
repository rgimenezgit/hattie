"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import { Composer } from "@/components/hattie/Composer"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { SeloSom } from "@/components/hattie/SeloSom"
import { dataCurtaProjeto, horaCurta } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import type { ItemProjeto, MensagemProjeto, ProjetoMarca } from "@/lib/mock"
import type { SistemaMarca } from "../SistemaMarca"
import { ItemMiniatura } from "./ItemPrevia"

/*
 * Conversa do projeto com o Hattie. Aparece em dois lugares com o mesmo conteúdo:
 * - no painel da direita, ao lado do canvas ou da grade (compacta);
 * - na vista Thread, ocupando a página, com os itens grandes e o que a pessoa colocou à mão no meio da história.
 */

const SUGESTOES = ["3 posts de lançamento com legenda", "Uma foto do frasco na bancada, com luz da manhã", "Um story com a oferta da semana", "Um vídeo curto mostrando a textura"]

/** Entrada da história: uma mensagem ou um grupo de itens que a pessoa (ou um parceiro) colocou à mão. */
type Entrada = { tipo: "mensagem"; quando: string; mensagem: MensagemProjeto } | { tipo: "manual"; quando: string; autor: ItemProjeto["autor"]; itens: ItemProjeto[] }

function montarHistoria(mensagens: MensagemProjeto[], itens: ItemProjeto[], comManuais: boolean): Entrada[] {
  const entradas: Entrada[] = mensagens.map((mensagem) => ({ tipo: "mensagem", quando: mensagem.quando, mensagem }))
  if (comManuais) {
    const pedidos = new Set(mensagens.flatMap((mensagem) => mensagem.itens ?? []))
    const grupos = new Map<string, ItemProjeto[]>()
    for (const item of itens) {
      if (pedidos.has(item.id) || item.criando) continue
      const chave = `${item.criado.slice(0, 10)}-${item.autor}-${item.pagina}`
      grupos.set(chave, [...(grupos.get(chave) ?? []), item])
    }
    for (const grupo of grupos.values()) entradas.push({ tipo: "manual", quando: grupo[0].criado, autor: grupo[0].autor, itens: grupo })
  }
  return entradas.sort((a, b) => a.quando.localeCompare(b.quando))
}

type PropsHistoria = {
  projeto: ProjetoMarca
  /** Página em foco, ou null para a conversa do projeto inteiro. */
  pagina: string | null
  sistema: SistemaMarca
  /** Compacta: painel estreito, miniaturas pequenas e só as mensagens. */
  compacta?: boolean
  criando: boolean
  aoVerItem: (item: ItemProjeto) => void
  vazio?: ReactNode
}

export function Historia({ projeto, pagina, sistema, compacta = false, criando, aoVerItem, vazio }: PropsHistoria) {
  const fim = useRef<HTMLDivElement>(null)
  const mensagens = projeto.conversa.filter((mensagem) => !pagina || mensagem.pagina === pagina)
  const itens = projeto.itens.filter((item) => !pagina || item.pagina === pagina)
  const historia = montarHistoria(mensagens, itens, !compacta)
  const nomePagina = (id: string) => projeto.paginas.find((item) => item.id === id)?.nome

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" })
  }, [historia.length, criando])

  if (historia.length === 0 && !criando) return <>{vazio}</>

  return (
    <ol className={cn("flex flex-col", compacta ? "gap-5" : "gap-7")}>
      {historia.map((entrada, indice) => {
        const novoDia = entrada.quando.slice(0, 10) !== historia[indice - 1]?.quando.slice(0, 10)
        const chave = entrada.tipo === "mensagem" ? entrada.mensagem.id : `manual-${entrada.itens[0].id}`
        return (
          <li key={chave} className="flex flex-col gap-4">
            {novoDia && !compacta && (
              <p className="flex items-center gap-3 text-xs text-texto-3">
                <span aria-hidden className="h-px flex-1 bg-borda-sutil" />
                {dataCurtaProjeto(entrada.quando)}
                <span aria-hidden className="h-px flex-1 bg-borda-sutil" />
              </p>
            )}
            {entrada.tipo === "manual" ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-texto-2">
                  <span className="font-semibold text-texto">{entrada.autor === "parceiro" ? (projeto.parceiro ?? "Um parceiro") : entrada.autor === "hattie" ? "O Hattie" : "Você"}</span>{" "}
                  {entrada.autor === "parceiro" ? "entregou" : "colocou"} {entrada.itens.length === 1 ? "um item" : `${entrada.itens.length} itens`}
                  {!pagina && ` em ${nomePagina(entrada.itens[0].pagina)}`} · {horaCurta(entrada.quando)}
                </p>
                <Itens itens={entrada.itens} sistema={sistema} compacta={compacta} menor aoVerItem={aoVerItem} />
              </div>
            ) : entrada.mensagem.autor === "pessoa" ? (
              <div className="flex flex-col items-end gap-1.5">
                {entrada.mensagem.sobre && <p className="max-w-[85%] truncate text-xs text-texto-2">Sobre {entrada.mensagem.sobre}</p>}
                <p className={cn("max-w-[85%] rounded-[20px] rounded-br-md bg-preto px-4 py-2.5 leading-relaxed text-lima", compacta ? "text-sm" : "text-corpo md:max-w-[70%]")}>
                  <span className="sr-only">Você: </span>
                  {entrada.mensagem.texto}
                </p>
              </div>
            ) : (
              <article className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <IconeHattie nome="hattie" tamanho={compacta ? 24 : 32} label="Hattie" className="text-preto" />
                  <span className="text-xs text-texto-3">
                    {horaCurta(entrada.mensagem.quando)}
                    {!pagina && ` · em ${nomePagina(entrada.mensagem.pagina)}`}
                  </span>
                </div>
                <p className={cn("max-w-[68ch] leading-relaxed", compacta ? "text-sm" : "text-corpo")}>{entrada.mensagem.texto}</p>
                {entrada.mensagem.itens && (
                  <Itens
                    itens={entrada.mensagem.itens.map((id) => projeto.itens.find((item) => item.id === id)).filter((item): item is ItemProjeto => !!item)}
                    sistema={sistema}
                    compacta={compacta}
                    aoVerItem={aoVerItem}
                    apagados={entrada.mensagem.itens.filter((id) => !projeto.itens.some((item) => item.id === id)).length}
                  />
                )}
              </article>
            )}
          </li>
        )
      })}
      {criando && (
        <li className="flex items-center gap-3">
          <IconeHattie nome="hattie" tamanho={compacta ? 24 : 32} className="text-preto" />
          <SeloSom som="hmm…" fixo className="motion-safe:animate-pulse" />
          <span className="sr-only">O Hattie está criando</span>
        </li>
      )}
      <div ref={fim} aria-hidden />
    </ol>
  )
}

/** Itens de uma entrada. Clicar leva ao item no canvas. */
function Itens({
  itens,
  sistema,
  compacta,
  menor = false,
  aoVerItem,
  apagados = 0,
}: {
  itens: ItemProjeto[]
  sistema: SistemaMarca
  compacta: boolean
  /** O que foi colocado à mão aparece menor que o que saiu de um pedido. */
  menor?: boolean
  aoVerItem: (item: ItemProjeto) => void
  apagados?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {itens.length > 0 && (
        <ul className={cn("flex flex-wrap", compacta ? "gap-1.5" : "gap-3")}>
          {itens.map((item) => {
            const proporcao = item.tipo === "texto" ? 4 / 3 : Math.min(Math.max(item.l / Math.max(item.a, 1), 0.5), 2)
            const altura = compacta ? 76 : menor ? 96 : 184
            return (
              <li key={item.id} className="flex flex-col gap-1.5" style={{ width: Math.round(altura * proporcao) }}>
                <button
                  type="button"
                  onClick={() => aoVerItem(item)}
                  aria-label={`Ver ${item.nome} no canvas`}
                  title={item.nome}
                  className={cn("overflow-hidden transition-[box-shadow,scale] duration-150 hover:shadow-(--sombra-flutuante) active:scale-[.98]", compacta ? "rounded-xl" : "rounded-2xl")}
                  style={{ height: altura }}
                >
                  <ItemMiniatura item={item} sistema={sistema} />
                </button>
                {!compacta && !menor && item.tipo !== "texto" && item.tipo !== "forma" && <span className="truncate px-0.5 text-xs text-texto-2">{item.nome}</span>}
              </li>
            )
          })}
        </ul>
      )}
      {apagados > 0 && <p className="text-xs text-texto-3">{apagados === 1 ? "Um item daqui foi apagado." : `${apagados} itens daqui foram apagados.`}</p>}
    </div>
  )
}

/** Campo do pedido, com o item em ajuste (quando há) logo acima. */
export function CampoPedido({
  sobre,
  aoTirarSobre,
  aoEnviar,
  desabilitado,
  comSugestoes = false,
  autoFocus = false,
}: {
  sobre: ItemProjeto | null
  aoTirarSobre: () => void
  aoEnviar: (texto: string) => void
  desabilitado: boolean
  comSugestoes?: boolean
  autoFocus?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      {comSugestoes && !sobre && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Ideias de pedido">
          {SUGESTOES.map((sugestao) => (
            <li key={sugestao}>
              <button type="button" disabled={desabilitado} onClick={() => aoEnviar(sugestao)} className="clique min-h-8 rounded-2xl bg-superficie px-3 py-1.5 text-start text-detalhe font-medium hover:bg-acao-suave disabled:opacity-40">
                {sugestao}
              </button>
            </li>
          ))}
        </ul>
      )}
      {sobre && (
        <p className="flex items-center gap-2 self-start rounded-full bg-acao-suave py-1 ps-3 pe-1 text-xs">
          <span className="text-texto-2">Ajustar</span>
          <span className="max-w-44 truncate font-medium">{sobre.nome}</span>
          <button type="button" aria-label="Tirar o item do pedido" onClick={aoTirarSobre} className="grid size-6 place-items-center rounded-full hover:bg-preto/10">
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </p>
      )}
      <Composer
        key={sobre?.id ?? "livre"}
        tamanho="compacto"
        rotulo="Pedido para o Hattie"
        placeholder={sobre ? "O que muda? Ex.: fundo mais claro" : "Peça uma foto, um post, um texto"}
        onEnviar={(texto) => texto && aoEnviar(texto)}
        desabilitado={desabilitado}
        autoFocus={autoFocus || !!sobre}
      />
    </div>
  )
}
