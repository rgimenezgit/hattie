"use client"

import { useState, type ReactNode } from "react"
import { Check, Copy, Download, EllipsisVertical, FolderInput, Frame, Maximize2, Pencil, Trash2, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { haQuanto } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import { TIPOS_ITEM, type ItemProjeto, type ProjetoMarca, type TipoItemProjeto } from "@/lib/mock"
import type { SistemaMarca } from "../SistemaMarca"
import { CampoNome } from "./CampoNome"
import type { AcoesProjeto } from "./EstadoProjetos"
import { ItemMiniatura } from "./ItemPrevia"

/*
 * Vista Grade: os mesmos itens da página, arrumados em cards, para achar e organizar.
 * Filtro por tipo no topo; clicar num card abre o visor do item, sem sair da grade; o menu leva ao canvas,
 * renomeia, duplica, move de página e apaga.
 * Marcar vários abre a barra de ações embaixo. Em "Todos os arquivos", os itens vêm agrupados por página.
 */

const ORDEM_TIPOS: TipoItemProjeto[] = ["imagem", "video", "peca", "texto", "forma"]
const ITEM_MENU = "h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4"
const AUTOR: Record<ItemProjeto["autor"], string> = { hattie: "Hattie", voce: "Você", parceiro: "Parceiro" }

type Props = {
  projeto: ProjetoMarca
  /** Página em foco, ou null para o projeto inteiro (agrupado por página). */
  pagina: string | null
  itens: ItemProjeto[]
  sistema: SistemaMarca
  acoes: AcoesProjeto
  /** Abre o visor do item. */
  aoAbrir: (item: ItemProjeto) => void
  aoVerItem: (item: ItemProjeto) => void
  aoPedirAjuste: (item: ItemProjeto) => void
  aoIrParaPagina: (pagina: string) => void
  vazio: ReactNode
}

export function VistaGrade({ projeto, pagina, itens, sistema, acoes, aoAbrir, aoVerItem, aoPedirAjuste, aoIrParaPagina, vazio }: Props) {
  const [tipo, setTipo] = useState<TipoItemProjeto | "tudo">("tudo")
  const [marcados, setMarcados] = useState<string[]>([])
  const [renomeando, setRenomeando] = useState<string | null>(null)
  const tipos = ORDEM_TIPOS.filter((item) => itens.some((atual) => atual.tipo === item))
  const filtro = tipo !== "tudo" && tipos.includes(tipo) ? tipo : "tudo"
  const visiveis = itens.filter((item) => filtro === "tudo" || item.tipo === filtro).sort((a, b) => b.criado.localeCompare(a.criado))
  const selecao = marcados.filter((id) => visiveis.some((item) => item.id === id))
  const alternar = (id: string) => setMarcados((atual) => (atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]))

  if (itens.length === 0) return <div className="px-4 pb-6 md:px-6">{vazio}</div>

  const grupos: { id: string; titulo?: string; itens: ItemProjeto[] }[] = pagina
    ? [{ id: pagina, itens: visiveis }]
    : projeto.paginas.map((item) => ({ id: item.id, titulo: item.nome, itens: visiveis.filter((atual) => atual.pagina === item.id) })).filter((grupo) => grupo.itens.length > 0)

  const card = (item: ItemProjeto) => {
    const marcado = selecao.includes(item.id)
    return (
      <li key={item.id} className="min-w-0">
        <article className={cn("group/card relative flex h-full flex-col gap-2 rounded-3xl p-1.5 transition-[background-color,box-shadow] duration-150", marcado ? "bg-acao-suave" : "bg-superficie hover:shadow-(--sombra-flutuante)")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-preenchimento">
            <ItemMiniatura item={item} sistema={sistema} />
            <button
              type="button"
              role="checkbox"
              aria-checked={marcado}
              aria-label={`Selecionar ${item.nome}`}
              onClick={() => alternar(item.id)}
              className={cn(
                "absolute top-2 left-2 z-10 grid size-7 place-items-center rounded-full transition-[opacity,background-color] duration-150",
                marcado ? "bg-lima text-preto" : "bg-superficie/90 text-transparent hover:text-texto-3",
                !marcado && selecao.length === 0 && "opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100",
              )}
            >
              <Check className="size-4" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex min-w-0 items-start gap-1 ps-1.5 pb-1">
            <div className="flex min-w-0 flex-1 flex-col">
              {renomeando === item.id ? (
                <CampoNome nome={item.nome} rotulo={`Nome de ${item.nome}`} aoGuardar={(nome) => acoes.atualizarItens([item.id], { nome })} aoFechar={() => setRenomeando(null)} className="-mx-1.5 px-1.5 py-0.5 text-sm font-medium" />
              ) : (
                <button
                  type="button"
                  onClick={() => (selecao.length > 0 ? alternar(item.id) : aoAbrir(item))}
                  className="truncate text-start text-sm leading-snug font-medium after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto"
                >
                  {item.nome}
                </button>
              )}
              <span className="truncate text-xs text-texto-3">
                {TIPOS_ITEM[item.tipo].rotulo} · {AUTOR[item.autor]} · {haQuanto(item.criado)}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label={`Ações de ${item.nome}`} className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento">
                <EllipsisVertical className="size-4" strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1" onCloseAutoFocus={(evento) => evento.preventDefault()}>
                {item.tipo !== "forma" && (
                  <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoAbrir(item)}>
                    <Maximize2 aria-hidden /> Abrir
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoVerItem(item)}>
                  <Frame aria-hidden /> Ver no canvas
                </DropdownMenuItem>
                {item.tipo !== "forma" && (
                  <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoPedirAjuste(item)}>
                    <IconeHattie nome="hattie" tamanho={16} /> Pedir ajuste ao Hattie
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className={ITEM_MENU} onSelect={() => setRenomeando(item.id)}>
                  <Pencil aria-hidden /> Renomear
                </DropdownMenuItem>
                <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.duplicarItens([item.id])}>
                  <Copy aria-hidden /> Duplicar
                </DropdownMenuItem>
                <MoverPara projeto={projeto} fora={item.pagina} aoMover={(destino) => acoes.moverItens([item.id], destino)} />
                {(item.tipo === "imagem" || item.tipo === "video" || item.tipo === "peca") && (
                  <DropdownMenuItem className={ITEM_MENU} onSelect={() => notificar({ titulo: "baixando", texto: `${item.nome} está a caminho.`, tipo: "sucesso" })}>
                    <Download aria-hidden /> Baixar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.removerItens([item.id])}>
                  <Trash2 aria-hidden /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </article>
      </li>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-24 md:px-6">
      <div className="flex flex-col gap-5">
        {tipos.length > 1 && (
          <div role="group" aria-label="Tipo de item" className="flex flex-wrap gap-1.5">
            {(["tudo", ...tipos] as const).map((opcao) => {
              const ativo = filtro === opcao
              const quantidade = opcao === "tudo" ? itens.length : itens.filter((item) => item.tipo === opcao).length
              return (
                <button
                  key={opcao}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setTipo(opcao)}
                  className={cn("flex h-8 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium transition-[background-color] duration-150", ativo ? "bg-preto text-lima" : "bg-superficie text-texto-2 hover:text-texto")}
                >
                  {opcao === "tudo" ? "Tudo" : TIPOS_ITEM[opcao].plural}
                  <span className={cn("text-xs tabular-nums", ativo ? "text-lima/70" : "text-texto-3")}>{quantidade}</span>
                </button>
              )
            })}
          </div>
        )}

        {grupos.map((grupo) => (
          <section key={grupo.id} aria-label={grupo.titulo} className="flex flex-col gap-3">
            {grupo.titulo && (
              <h2 className="flex items-baseline gap-2 text-sm font-semibold">
                <button type="button" onClick={() => aoIrParaPagina(grupo.id)} className="underline-offset-4 hover:underline">
                  {grupo.titulo}
                </button>
                <span className="text-xs font-normal text-texto-3 tabular-nums">{grupo.itens.length}</span>
              </h2>
            )}
            <ul className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">{grupo.itens.map(card)}</ul>
          </section>
        ))}
      </div>

      {selecao.length > 0 && (
        <div role="toolbar" aria-label="Ações dos itens selecionados" className="fixed inset-x-0 bottom-5 z-20 mx-auto flex w-max max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full bg-preto p-1.5 ps-4 text-branco shadow-(--sombra-flutuante)">
          <span className="pe-2 text-sm font-medium tabular-nums">
            {selecao.length} {selecao.length === 1 ? "selecionado" : "selecionados"}
          </span>
          <Botao
            variante="fantasma"
            tamanho="sm"
            className="text-branco hover:bg-branco/15 hover:text-branco"
            onClick={() => {
              acoes.duplicarItens(selecao)
              setMarcados([])
            }}
          >
            <Copy /> <span className="max-sm:sr-only">Duplicar</span>
          </Botao>
          {projeto.paginas.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Botao variante="fantasma" tamanho="sm" className="text-branco hover:bg-branco/15 hover:text-branco data-[state=open]:bg-branco/15">
                  <FolderInput /> <span className="max-sm:sr-only">Mover</span>
                </Botao>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="top" className="w-56 rounded-2xl p-1">
                <DropdownMenuLabel className="text-xs font-medium text-texto-3">Mover para</DropdownMenuLabel>
                {projeto.paginas.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className={ITEM_MENU}
                    onSelect={() => {
                      acoes.moverItens(selecao, item.id)
                      setMarcados([])
                    }}
                  >
                    <span className="truncate">{item.nome}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Botao
            variante="fantasma"
            tamanho="sm"
            className="text-branco hover:bg-branco/15 hover:text-branco"
            onClick={() => {
              acoes.removerItens(selecao)
              setMarcados([])
            }}
          >
            <Trash2 /> <span className="max-sm:sr-only">Excluir</span>
          </Botao>
          <Botao variante="fantasma" tamanho="icone-sm" aria-label="Sair da seleção" className="text-branco hover:bg-branco/15 hover:text-branco" onClick={() => setMarcados([])}>
            <X />
          </Botao>
        </div>
      )}
    </div>
  )
}

/** Submenu "Mover para": as outras páginas do projeto. Some quando só há uma página. */
function MoverPara({ projeto, fora, aoMover }: { projeto: ProjetoMarca; fora: string; aoMover: (pagina: string) => void }) {
  const destinos = projeto.paginas.filter((item) => item.id !== fora)
  if (destinos.length === 0) return null
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={ITEM_MENU}>
        <FolderInput aria-hidden /> Mover para
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-52 rounded-2xl p-1">
        {destinos.map((item) => (
          <DropdownMenuItem key={item.id} className={ITEM_MENU} onSelect={() => aoMover(item.id)}>
            <span className="truncate">{item.nome}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
