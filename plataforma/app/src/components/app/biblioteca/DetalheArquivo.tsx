"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect } from "react"
import { ChevronLeft, ChevronRight, Download, FolderInput, Link2, MoreHorizontal, Star, Trash2, Wand2, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import { dataLonga } from "@/lib/biblioteca"
import { CORES_BUSCA, ORIGENS, PARCEIROS, PROJETOS, QUEM_APARECE, STATUS_ARQUIVO, TIPOS_ARQUIVO, type ArquivoBiblioteca } from "@/lib/mock"
import { useMarca } from "../MarcaContexto"
import type { SistemaMarca } from "../SistemaMarca"
import { PreviaArquivo } from "./PreviaArquivo"

export type AcoesArquivo = {
  baixar: (ids: string[]) => void
  copiarLink: (arquivo: ArquivoBiblioteca) => void
  favoritar: (id: string) => void
  mover: (ids: string[], projeto: string | undefined) => void
  apagar: (ids: string[]) => void
}

export function feitoPor(arquivo: ArquivoBiblioteca) {
  if (arquivo.origem === "parceiro") return PARCEIROS.find((item) => item.id === arquivo.parceiro)?.nome ?? ORIGENS.parceiro
  return arquivo.origem === "hattie" ? "Você, com o Hattie" : "Você enviou"
}

/**
 * Detalhe de um arquivo, num painel à direita (tela cheia no celular): prévia grande, ações e tudo que se sabe dele.
 * Setas do teclado passam para o anterior e o próximo. Quem aparece e as etiquetas viram filtro com um clique.
 */
export function DetalheArquivo({
  arquivo,
  todos,
  sistema,
  acoes,
  aoMudar,
  aoFiltrar,
}: {
  arquivo: ArquivoBiblioteca | null
  /** Lista visível, na ordem da tela, para anterior e próximo. */
  todos: ArquivoBiblioteca[]
  sistema: SistemaMarca
  acoes: AcoesArquivo
  aoMudar: (id: string | null) => void
  aoFiltrar: (tipo: "aparece" | "busca", valor: string) => void
}) {
  const marca = useMarca()
  const indice = arquivo ? todos.findIndex((item) => item.id === arquivo.id) : -1
  const anterior = indice > 0 ? todos[indice - 1] : undefined
  const proximo = indice >= 0 && indice < todos.length - 1 ? todos[indice + 1] : undefined

  useEffect(() => {
    if (!arquivo) return
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.target instanceof Element && evento.target.closest("input, textarea, [role=menu]")) return
      if (evento.key === "ArrowLeft" && anterior) aoMudar(anterior.id)
      if (evento.key === "ArrowRight" && proximo) aoMudar(proximo.id)
    }
    window.addEventListener("keydown", aoTeclar)
    return () => window.removeEventListener("keydown", aoTeclar)
  }, [arquivo, anterior, proximo, aoMudar])

  const projeto = PROJETOS.find((item) => item.id === arquivo?.projeto)
  const usadoEm = (arquivo?.usadoEm ?? []).map((id) => todos.find((item) => item.id === id)).filter(Boolean) as ArquivoBiblioteca[]

  return (
    <Sheet open={!!arquivo} onOpenChange={(aberto) => !aberto && aoMudar(null)}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 border-0 bg-superficie p-0 data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-xl sm:rounded-s-3xl">
        {arquivo && (
          <>
            <header className="flex items-start gap-2 px-5 pt-4 pb-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <SheetTitle className="text-base leading-snug font-semibold">{arquivo.nome}</SheetTitle>
                <SheetDescription className="text-xs text-texto-2">
                  {TIPOS_ARQUIVO[arquivo.tipo].rotulo} · {arquivo.formato}
                </SheetDescription>
              </div>
              <div className="flex shrink-0 items-center">
                <Botao
                  variante="fantasma"
                  tamanho="icone"
                  aria-pressed={!!arquivo.favorito}
                  aria-label={arquivo.favorito ? "Tirar dos favoritos" : "Favoritar"}
                  onClick={() => acoes.favoritar(arquivo.id)}
                >
                  <Star className={cn(arquivo.favorito && "fill-current")} />
                </Botao>
                <MenuArquivo arquivos={[arquivo]} acoes={acoes} aoApagar={() => aoMudar(proximo?.id ?? anterior?.id ?? null)} />
                <span aria-hidden className="mx-1 hidden h-5 w-px bg-borda-sutil sm:block" />
                <Botao variante="fantasma" tamanho="icone" className="hidden sm:inline-flex" aria-label="Arquivo anterior" disabled={!anterior} onClick={() => anterior && aoMudar(anterior.id)}>
                  <ChevronLeft />
                </Botao>
                <Botao variante="fantasma" tamanho="icone" className="hidden sm:inline-flex" aria-label="Próximo arquivo" disabled={!proximo} onClick={() => proximo && aoMudar(proximo.id)}>
                  <ChevronRight />
                </Botao>
                <Botao variante="fantasma" tamanho="icone" aria-label="Fechar" onClick={() => aoMudar(null)}>
                  <X />
                </Botao>
              </div>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6">
              <div className="aspect-[4/3] shrink-0 overflow-hidden rounded-2xl">
                <PreviaArquivo arquivo={arquivo} sistema={sistema} />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Botao variante="primario" onClick={() => acoes.baixar([arquivo.id])}>
                  <Download /> Baixar {arquivo.extensao}
                </Botao>
                <Botao variante="secundario" onClick={() => acoes.copiarLink(arquivo)}>
                  <Link2 /> Copiar link
                </Botao>
                <Botao variante="secundario" asChild>
                  <Link href={`/marca/${marca.slug}/hattie` as Route}>
                    <Wand2 /> Editar com o Hattie
                  </Link>
                </Botao>
              </div>

              <section aria-labelledby="titulo-descricao" className="flex flex-col gap-1.5">
                <h3 id="titulo-descricao" className="flex items-center gap-1.5 text-xs text-texto-3">
                  <IconeHattie nome="hattie" tamanho={14} className="text-texto-3" />
                  Como eu descrevi, para a busca achar
                </h3>
                <p className="text-sm">{arquivo.descricao}</p>
              </section>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {[
                  ["Feito por", feitoPor(arquivo)],
                  ["Criado em", dataLonga(arquivo.data)],
                  ["Projeto", projeto?.nome ?? "Sem projeto"],
                  ["Situação", STATUS_ARQUIVO[arquivo.status]],
                  ["Arquivo", `${arquivo.extensao} · ${arquivo.tamanho}`],
                  ["Versão", arquivo.versao ? `${arquivo.versao}ª versão` : "Primeira versão"],
                ].map(([rotulo, valor]) => (
                  <div key={rotulo} className="flex min-w-0 flex-col gap-0.5">
                    <dt className="text-xs text-texto-3">{rotulo}</dt>
                    <dd className="break-words">{valor}</dd>
                  </div>
                ))}
              </dl>

              {arquivo.aparece.length > 0 && (
                <section aria-labelledby="titulo-aparece" className="flex flex-col gap-2">
                  <h3 id="titulo-aparece" className="text-xs text-texto-3">
                    Quem aparece
                  </h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {arquivo.aparece.map((id) => {
                      const quem = QUEM_APARECE.find((item) => item.id === id)
                      if (!quem) return null
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => aoFiltrar("aparece", id)}
                            className="clique inline-flex h-8 items-center rounded-full bg-preenchimento px-3 text-detalhe transition-[background-color] duration-150 hover:bg-preenchimento-hover"
                          >
                            {quem.nome}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}

              {arquivo.cores.length > 0 && (
                <section aria-labelledby="titulo-cores-arquivo" className="flex flex-col gap-2">
                  <h3 id="titulo-cores-arquivo" className="text-xs text-texto-3">
                    Cores
                  </h3>
                  <ul className="flex flex-wrap gap-3">
                    {arquivo.cores.map((hex) => (
                      <li key={hex} className="flex items-center gap-2 text-xs">
                        <span aria-hidden className="size-6 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.08)]" style={{ backgroundColor: hex }} />
                        <span className="flex flex-col leading-tight">
                          <span>{CORES_BUSCA.find((cor) => cor.hex === hex)?.nome}</span>
                          <span className="text-texto-3 uppercase">{hex}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section aria-labelledby="titulo-etiquetas" className="flex flex-col gap-2">
                <h3 id="titulo-etiquetas" className="text-xs text-texto-3">
                  Etiquetas
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {arquivo.tags.map((tag) => (
                    <li key={tag}>
                      <button type="button" onClick={() => aoFiltrar("busca", tag)} className="rounded-md focus-visible:outline-offset-1">
                        <Tag className="hover:bg-preenchimento">{tag}</Tag>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {usadoEm.length > 0 && (
                <section aria-labelledby="titulo-usado" className="flex flex-col gap-2">
                  <h3 id="titulo-usado" className="text-xs text-texto-3">
                    Usado em
                  </h3>
                  <ul className="flex flex-col gap-1">
                    {usadoEm.map((item) => (
                      <li key={item.id}>
                        <button type="button" onClick={() => aoMudar(item.id)} className="flex w-full items-center gap-3 rounded-2xl p-1.5 text-start hover:bg-preenchimento">
                          <span className="h-10 w-13 shrink-0 overflow-hidden rounded-lg">
                            <PreviaArquivo arquivo={item} sistema={sistema} />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium">{item.nome}</span>
                            <span className="text-xs text-texto-3">{TIPOS_ARQUIVO[item.tipo].rotulo}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

/** Menu de mais ações (mover para projeto e apagar), para um arquivo ou para a seleção. */
export function MenuArquivo({
  arquivos,
  acoes,
  aoApagar,
  claro = false,
}: {
  arquivos: ArquivoBiblioteca[]
  acoes: AcoesArquivo
  aoApagar?: () => void
  /** Sobre fundo preto (barra de seleção). */
  claro?: boolean
}) {
  const ids = arquivos.map((item) => item.id)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Botao variante="fantasma" tamanho="icone" aria-label="Mais ações" className={cn(claro && "text-branco hover:bg-branco/10 hover:text-branco")}>
          <MoreHorizontal />
        </Botao>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4">
            <FolderInput aria-hidden /> Mover para projeto
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-60 rounded-2xl p-1">
            {PROJETOS.map((projeto) => (
              <DropdownMenuItem key={projeto.id} className="h-9 rounded-xl px-2.5 text-sm" onSelect={() => acoes.mover(ids, projeto.id)}>
                {projeto.nome}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-9 rounded-xl px-2.5 text-sm" onSelect={() => acoes.mover(ids, undefined)}>
              Tirar do projeto
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="h-9 gap-2.5 rounded-xl px-2.5 text-sm text-erro-texto focus:text-erro-texto [&_svg]:size-4"
          onSelect={() => {
            acoes.apagar(ids)
            aoApagar?.()
          }}
        >
          <Trash2 aria-hidden /> Apagar {ids.length > 1 ? `${ids.length} arquivos` : ""}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
