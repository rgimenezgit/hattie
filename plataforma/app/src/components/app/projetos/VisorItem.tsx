"use client"

import { useEffect, useState } from "react"
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  EllipsisVertical,
  Eraser,
  Expand,
  FlipHorizontal2,
  FolderInput,
  Frame,
  ImagePlus,
  Images,
  LayoutTemplate,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Trash2,
  Wallpaper,
  X,
  ZoomIn,
  type LucideIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
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
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { dataCurtaProjeto, horaCurta, type OpcoesPedido } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import { TIPOS_ITEM, type AjustesImagem, type ItemProjeto, type ProjetoMarca } from "@/lib/mock"
import type { SistemaMarca } from "../SistemaMarca"
import type { AcoesProjeto } from "./EstadoProjetos"
import { ItemNoCanvas } from "./ItemPrevia"

/*
 * Visor de um item do projeto: abre por cima da tela, sem sair de onde a pessoa está (grade, thread ou canvas).
 * À esquerda, o item grande, com as setas para o anterior e o próximo e, embaixo, o campo para pedir uma mudança
 * com atalhos de pedidos comuns. À direita, três abas:
 * - Hattie: o que dá para fazer com um clique (gerar de novo, variações, fundo, ampliar) e usar o item numa peça.
 * - Ajustes: exposição, contraste, saturação, temperatura e espelhar, só para imagens. Valem em todas as vistas.
 * - Detalhes: o pedido que gerou o item, quem fez, quando, onde está e as opções de geração.
 * Cada mudança do Hattie nasce como uma versão nova ao lado da original; o visor passa para ela.
 */

const ITEM_MENU = "h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4"
const SEM_AJUSTES: AjustesImagem = { exposicao: 0, contraste: 0, saturacao: 0, temperatura: 0 }
const AUTOR: Record<ItemProjeto["autor"], string> = { hattie: "Você, com o Hattie", voce: "Você", parceiro: "Um parceiro" }

type Atalho = { rotulo: string; pedido: string; icone: LucideIcon; nota: string }

const COM_O_HATTIE: Record<"imagem" | "video" | "peca" | "texto", Atalho[]> = {
  imagem: [
    { rotulo: "Gerar de novo", pedido: "Gera de novo, com o mesmo pedido", icone: RefreshCw, nota: "Outra tentativa do mesmo pedido" },
    { rotulo: "Variações", pedido: "Faz variações desta imagem", icone: Images, nota: "Mesma ideia, outros enquadramentos" },
    { rotulo: "Remover o fundo", pedido: "Remove o fundo e deixa só o produto", icone: Eraser, nota: "Produto recortado, pronto para peças" },
    { rotulo: "Trocar o fundo", pedido: "Troca o fundo por uma cor da marca", icone: Wallpaper, nota: "Com uma cor da paleta" },
    { rotulo: "Ampliar", pedido: "Amplia a imagem para o dobro do tamanho", icone: ZoomIn, nota: "Dobro do tamanho, mais nitidez" },
    { rotulo: "Expandir", pedido: "Expande a imagem para os lados", icone: Expand, nota: "Mais cena em volta do que já existe" },
  ],
  video: [
    { rotulo: "Gerar de novo", pedido: "Gera o vídeo de novo, com o mesmo pedido", icone: RefreshCw, nota: "Outra tentativa do mesmo pedido" },
    { rotulo: "Versão para story", pedido: "Faz uma versão na vertical, para story", icone: Smartphone, nota: "9:16, com área segura" },
  ],
  peca: [
    { rotulo: "Gerar de novo", pedido: "Gera a peça de novo, com o mesmo pedido", icone: RefreshCw, nota: "Outra tentativa do mesmo pedido" },
    { rotulo: "Outro layout", pedido: "Tenta outro layout para esta peça", icone: LayoutTemplate, nota: "Mesmo texto, outra composição" },
    { rotulo: "Versão para story", pedido: "Faz uma versão desta peça para story", icone: Smartphone, nota: "9:16, com área segura" },
  ],
  texto: [
    { rotulo: "Outro jeito de dizer", pedido: "Escreve de outro jeito, com a mesma ideia", icone: RefreshCw, nota: "Mesma ideia, outras palavras" },
    { rotulo: "Mais curto", pedido: "Deixa o texto mais curto", icone: Eraser, nota: "Corta o que sobra" },
  ],
}

const RAPIDOS: Record<"imagem" | "video" | "peca" | "texto", string[]> = {
  imagem: ["Fundo mais claro", "Mais perto do produto", "Luz de fim de tarde", "Sem as folhas"],
  video: ["Mais lento", "Com legenda", "Começa pelo frasco"],
  peca: ["Título maior", "Troca a foto", "Menos texto"],
  texto: ["Mais direto", "Com o lote e a cooperativa", "Para legenda de post"],
}

type Props = {
  item: ItemProjeto | null
  /** Itens da tela, na ordem, para anterior e próximo. */
  lista: ItemProjeto[]
  projeto: ProjetoMarca
  sistema: SistemaMarca
  acoes: AcoesProjeto
  /** O Hattie está criando: o campo e os atalhos esperam. */
  ocupado: boolean
  aoMudar: (id: string | null) => void
  /** Pede uma mudança ao Hattie. Devolve os ids do que vai nascer. */
  aoPedir: (texto: string, opcoes: OpcoesPedido) => string[]
  aoVerNoCanvas: (item: ItemProjeto) => void
}

export function VisorItem({ item, lista, projeto, sistema, acoes, ocupado, aoMudar, aoPedir, aoVerNoCanvas }: Props) {
  const indice = item ? lista.findIndex((atual) => atual.id === item.id) : -1
  const anterior = indice > 0 ? lista[indice - 1] : undefined
  const proximo = indice >= 0 && indice < lista.length - 1 ? lista[indice + 1] : undefined
  const [aba, setAba] = useState("hattie")
  const [texto, setTexto] = useState("")

  useEffect(() => {
    if (!item) return
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.target instanceof Element && evento.target.closest("input, textarea, [role=menu], [role=slider]")) return
      if (evento.key === "ArrowLeft" && anterior) aoMudar(anterior.id)
      if (evento.key === "ArrowRight" && proximo) aoMudar(proximo.id)
    }
    window.addEventListener("keydown", aoTeclar)
    return () => window.removeEventListener("keydown", aoTeclar)
  }, [item, anterior, proximo, aoMudar])

  if (!item) return null
  const tipo = item.tipo === "forma" ? "imagem" : item.tipo
  const pagina = projeto.paginas.find((atual) => atual.id === item.pagina)
  const comAjustes = item.tipo === "imagem" && !item.criando
  const abaAtual = aba === "ajustes" && !comAjustes ? "hattie" : aba
  const ajustes = item.ajustes ?? SEM_AJUSTES
  const mexido = !!item.ajustes && (ajustes.exposicao !== 0 || ajustes.contraste !== 0 || ajustes.saturacao !== 0 || ajustes.temperatura !== 0 || !!ajustes.espelhada)
  const proporcao = item.tipo === "texto" ? 4 / 3 : item.l / Math.max(item.a, 1)

  const pedir = (pedido: string, opcoes: OpcoesPedido = { sobre: item }) => {
    if (ocupado || !pedido.trim()) return
    const ids = aoPedir(pedido.trim(), opcoes)
    setTexto("")
    if (ids[0]) aoMudar(ids[0])
  }
  const mudarAjuste = (mudanca: Partial<AjustesImagem>) => acoes.atualizarItens([item.id], { ajustes: { ...ajustes, ...mudanca } })
  const baixar = (formato: string) => notificar({ titulo: "baixando", texto: `${item.nome} em ${formato} está a caminho.`, tipo: "sucesso" })
  const copiarPedido = () => {
    navigator.clipboard?.writeText(item.pedido ?? "")
    notificar({ titulo: "pedido copiado", texto: "O texto do pedido está na sua área de transferência." })
  }

  return (
    <Dialog open onOpenChange={(aberto) => !aberto && aoMudar(null)}>
      <DialogContent
        showCloseButton={false}
        aria-describedby="visor-descricao"
        className="flex h-svh max-h-svh w-full max-w-none flex-col gap-0 overflow-hidden rounded-none bg-superficie p-0 ring-0 sm:max-w-none lg:h-[min(860px,calc(100svh-3rem))] lg:w-[min(1280px,calc(100vw-3rem))] lg:flex-row lg:rounded-[32px]"
      >
        {/* O item, grande */}
        <div className="relative flex min-h-0 flex-1 flex-col bg-canvas lg:min-w-0">
          <div className="relative min-h-0 flex-1 p-4 pb-2 [container-type:size] sm:p-8 sm:pb-3">
            <div className="grid size-full place-items-center">
              <div
                className={cn("shadow-(--sombra-campo)", item.tipo === "texto" ? "rounded-2xl bg-superficie p-[6cqmin]" : "rounded-[10px]")}
                style={{ aspectRatio: item.tipo === "texto" ? undefined : `${proporcao}`, width: item.tipo === "texto" ? "min(100cqw, 640px)" : `min(100cqw, calc(100cqh * ${proporcao}))` }}
              >
                <ItemNoCanvas item={item} sistema={sistema} />
              </div>
            </div>
            {anterior && (
              <Botao variante="secundario" tamanho="icone" aria-label="Item anterior" onClick={() => aoMudar(anterior.id)} className="absolute top-1/2 left-3 -translate-y-1/2 bg-superficie shadow-(--sombra-campo) hover:bg-superficie">
                <ChevronLeft />
              </Botao>
            )}
            {proximo && (
              <Botao variante="secundario" tamanho="icone" aria-label="Próximo item" onClick={() => aoMudar(proximo.id)} className="absolute top-1/2 right-3 -translate-y-1/2 bg-superficie shadow-(--sombra-campo) hover:bg-superficie">
                <ChevronRight />
              </Botao>
            )}
          </div>

          {/* Pedir uma mudança */}
          {!item.criando && item.tipo !== "forma" && (
            <div className="flex flex-col gap-2 px-4 pb-4 sm:px-8 sm:pb-6">
              <ul className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" aria-label="Mudanças rápidas">
                {RAPIDOS[tipo].map((rapido) => (
                  <li key={rapido} className="shrink-0">
                    <button type="button" disabled={ocupado} onClick={() => pedir(rapido)} className="clique h-8 rounded-full bg-superficie px-3 text-detalhe font-medium hover:bg-acao-suave disabled:opacity-40">
                      {rapido}
                    </button>
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(evento) => {
                  evento.preventDefault()
                  pedir(texto)
                }}
                className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-superficie py-1.5 ps-2 pe-1.5 shadow-(--sombra-campo) focus-within:shadow-(--sombra-flutuante)"
              >
                <IconeHattie nome="hattie" tamanho={24} className="shrink-0 text-preto" />
                <input
                  aria-label="Pedir uma mudança ao Hattie"
                  value={texto}
                  onChange={(evento) => setTexto(evento.target.value)}
                  placeholder={ocupado ? "Estou criando, já volto" : "O que muda? Ex.: fundo mais claro"}
                  disabled={ocupado}
                  className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-texto-3"
                />
                <Plimm type="submit" icone={ArrowUp} somenteIcone rotulo="Pedir a mudança" disabled={ocupado || !texto.trim()} />
              </form>
            </div>
          )}
        </div>

        {/* Painel */}
        <div className="flex max-h-[50svh] min-h-0 shrink-0 flex-col lg:max-h-none lg:w-[22rem]">
          <header className="flex items-start gap-1 px-5 pt-4 pb-3">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <DialogTitle className="truncate text-base leading-snug font-semibold">{item.nome}</DialogTitle>
              <DialogDescription id="visor-descricao" className="truncate text-xs text-texto-2">
                {TIPOS_ITEM[item.tipo].rotulo} · {pagina?.nome ?? "Sem página"}
                {lista.length > 1 && indice >= 0 && ` · ${indice + 1} de ${lista.length}`}
              </DialogDescription>
            </div>
            {item.tipo !== "texto" && !item.criando && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Botao variante="secundario" tamanho="sm">
                    <Download /> Baixar
                  </Botao>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-1">
                  <DropdownMenuLabel className="text-xs font-medium text-texto-3">Baixar como</DropdownMenuLabel>
                  {(item.tipo === "video" ? ["MP4", "GIF"] : ["PNG", "JPG", "PDF"]).map((formato) => (
                    <DropdownMenuItem key={formato} className={ITEM_MENU} onSelect={() => baixar(formato)}>
                      {formato}
                      <span className="ms-auto text-xs text-texto-3">{formato === "PNG" ? "fundo transparente" : formato === "JPG" ? "mais leve" : formato === "PDF" ? "para gráfica" : formato === "MP4" ? "redes sociais" : "sem som"}</span>
                    </DropdownMenuItem>
                  ))}
                  {item.tipo !== "video" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={ITEM_MENU} onSelect={() => baixar("1080 px, para Instagram")}>
                        Tamanho para Instagram
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Mais ações" className="grid size-8 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento">
                <EllipsisVertical className="size-4" strokeWidth={2} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1">
                <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoVerNoCanvas(item)}>
                  <Frame aria-hidden /> Ver no canvas
                </DropdownMenuItem>
                {item.pedido && (
                  <DropdownMenuItem className={ITEM_MENU} onSelect={copiarPedido}>
                    <Copy aria-hidden /> Copiar o pedido
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className={ITEM_MENU}
                  onSelect={() => {
                    const [copia] = acoes.duplicarItens([item.id])
                    if (copia) aoMudar(copia)
                  }}
                >
                  <Images aria-hidden /> Duplicar
                </DropdownMenuItem>
                {projeto.paginas.length > 1 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className={ITEM_MENU}>
                      <FolderInput aria-hidden /> Mover para
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-52 rounded-2xl p-1">
                      {projeto.paginas
                        .filter((atual) => atual.id !== item.pagina)
                        .map((atual) => (
                          <DropdownMenuItem key={atual.id} className={ITEM_MENU} onSelect={() => acoes.moverItens([item.id], atual.id)}>
                            <span className="truncate">{atual.nome}</span>
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={ITEM_MENU}
                  onSelect={() => {
                    aoMudar(proximo?.id ?? anterior?.id ?? null)
                    acoes.removerItens([item.id])
                  }}
                >
                  <Trash2 aria-hidden /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Fechar" onClick={() => aoMudar(null)}>
              <X />
            </Botao>
          </header>

          <Abas value={abaAtual} onValueChange={setAba} className="min-h-0 flex-1 gap-0">
            <ListaAbas
              rotulo="O que fazer com o item"
              fundo="cartao"
              className="px-5 pb-3 md:mx-0 md:px-5"
              itens={[{ valor: "hattie", rotulo: "Hattie" }, ...(comAjustes ? [{ valor: "ajustes", rotulo: "Ajustes" }] : []), { valor: "detalhes", rotulo: "Detalhes" }]}
            />

            <ConteudoAba value="hattie" className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              <div className="flex flex-col gap-5">
                <section aria-label="Mudar com o Hattie" className="flex flex-col gap-1">
                  <h3 className="pb-1 text-xs font-medium text-texto-3">Mudar com um clique</h3>
                  <ul className="-mx-2 flex flex-col">
                    {COM_O_HATTIE[tipo].map((atalho) => (
                      <li key={atalho.rotulo}>
                        <button type="button" disabled={ocupado || item.criando} onClick={() => pedir(atalho.pedido)} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-start hover:bg-preenchimento disabled:opacity-40">
                          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-preenchimento">
                            <atalho.icone className="size-4" strokeWidth={2} />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="text-sm font-medium">{atalho.rotulo}</span>
                            <span className="truncate text-xs text-texto-2">{atalho.nota}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
                {item.tipo === "imagem" && (
                  <section aria-label="Usar esta imagem" className="flex flex-col gap-2">
                    <h3 className="text-xs font-medium text-texto-3">Usar esta imagem</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { rotulo: "Num post", pedido: `Post com a imagem ${item.nome}`, formato: [4, 5] as [number, number] },
                        { rotulo: "Num story", pedido: `Story com a imagem ${item.nome}`, formato: [9, 16] as [number, number] },
                        { rotulo: "Num banner", pedido: `Banner com a imagem ${item.nome}`, formato: [16, 9] as [number, number] },
                      ].map((uso) => (
                        <Botao key={uso.rotulo} variante="secundario" tamanho="sm" disabled={ocupado || item.criando} onClick={() => pedir(uso.pedido, { tipo: "peca", formato: uso.formato, geracao: { referencia: item.nome } })}>
                          <ImagePlus /> {uso.rotulo}
                        </Botao>
                      ))}
                    </div>
                  </section>
                )}
                <p className="text-xs text-texto-3">Cada mudança nasce como uma versão nova ao lado da original. Nada é apagado.</p>
              </div>
            </ConteudoAba>

            {comAjustes && (
              <ConteudoAba value="ajustes" className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
                <div className="flex flex-col gap-5">
                  <section aria-label="Luz" className="flex flex-col gap-3">
                    <h3 className="text-xs font-medium text-texto-3">Luz</h3>
                    <Deslizante rotulo="Exposição" valor={ajustes.exposicao} aoMudar={(valor) => mudarAjuste({ exposicao: valor })} />
                    <Deslizante rotulo="Contraste" valor={ajustes.contraste} aoMudar={(valor) => mudarAjuste({ contraste: valor })} />
                  </section>
                  <section aria-label="Cor" className="flex flex-col gap-3">
                    <h3 className="text-xs font-medium text-texto-3">Cor</h3>
                    <Deslizante rotulo="Saturação" valor={ajustes.saturacao} aoMudar={(valor) => mudarAjuste({ saturacao: valor })} />
                    <Deslizante rotulo="Temperatura" valor={ajustes.temperatura} aoMudar={(valor) => mudarAjuste({ temperatura: valor })} pontas={["fria", "quente"]} />
                  </section>
                  <div className="flex flex-wrap gap-1.5">
                    <Botao variante="secundario" tamanho="sm" aria-pressed={!!ajustes.espelhada} className={cn(ajustes.espelhada && "bg-preto text-lima hover:bg-grafite")} onClick={() => mudarAjuste({ espelhada: !ajustes.espelhada })}>
                      <FlipHorizontal2 /> Espelhar
                    </Botao>
                    <Botao variante="fantasma" tamanho="sm" disabled={!mexido} onClick={() => acoes.atualizarItens([item.id], { ajustes: undefined })}>
                      <RotateCcw /> Voltar ao original
                    </Botao>
                  </div>
                  <p className="text-xs text-texto-3">Os ajustes valem no canvas, na grade e no arquivo baixado.</p>
                </div>
              </ConteudoAba>
            )}

            <ConteudoAba value="detalhes" className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              <div className="flex flex-col gap-5">
                {item.pedido && (
                  <section aria-label="Pedido" className="flex flex-col gap-2">
                    <h3 className="text-xs font-medium text-texto-3">Pedido</h3>
                    <p className="rounded-2xl bg-preenchimento px-3.5 py-3 text-sm leading-relaxed">{item.pedido}</p>
                    <Botao variante="fantasma" tamanho="sm" className="self-start" onClick={copiarPedido}>
                      <Copy /> Copiar o pedido
                    </Botao>
                  </section>
                )}
                <dl className="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-2.5 text-sm">
                  <Dado rotulo="Feito por" valor={AUTOR[item.autor]} />
                  <Dado rotulo="Quando" valor={`${dataCurtaProjeto(item.criado)}, ${horaCurta(item.criado)}`} />
                  <Dado rotulo="Página" valor={pagina?.nome ?? "Sem página"} />
                  {item.tipo !== "texto" && <Dado rotulo="Proporção" valor={item.geracao?.proporcao ?? nomeDaProporcao(item.l / Math.max(item.a, 1))} />}
                  {item.geracao?.resolucao && <Dado rotulo="Resolução" valor={item.geracao.resolucao} />}
                  {item.geracao?.duracao && <Dado rotulo="Duração" valor={item.geracao.duracao} />}
                  {item.geracao?.estilo && <Dado rotulo="Estilo" valor={item.geracao.estilo} />}
                  {item.geracao?.referencia && <Dado rotulo="Referência" valor={item.geracao.referencia} />}
                  {item.arquivo && <Dado rotulo="Biblioteca" valor="Guardado" />}
                </dl>
                <Botao variante="secundario" tamanho="sm" className="self-start" onClick={() => aoVerNoCanvas(item)}>
                  <Frame /> Ver no canvas
                </Botao>
              </div>
            </ConteudoAba>
          </Abas>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function nomeDaProporcao(valor: number) {
  const conhecidas: [string, number][] = [
    ["1:1", 1],
    ["4:5", 4 / 5],
    ["3:4", 3 / 4],
    ["9:16", 9 / 16],
    ["16:9", 16 / 9],
    ["16:10", 16 / 10],
    ["4:3", 4 / 3],
  ]
  return conhecidas.reduce((melhor, atual) => (Math.abs(atual[1] - valor) < Math.abs(melhor[1] - valor) ? atual : melhor))[0]
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="contents">
      <dt className="pt-px text-xs text-texto-3">{rotulo}</dt>
      <dd className="min-w-0 break-words">{valor}</dd>
    </div>
  )
}

/** Controle deslizante de -100 a 100. Duplo clique no valor volta a zero. */
function Deslizante({ rotulo, valor, aoMudar, pontas }: { rotulo: string; valor: number; aoMudar: (valor: number) => void; pontas?: [string, string] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-sm">
        <span>{rotulo}</span>
        <button type="button" aria-label={`${rotulo}: ${valor}. Voltar a zero`} onClick={() => aoMudar(0)} className={cn("rounded-full px-1.5 text-xs tabular-nums", valor === 0 ? "text-texto-3" : "font-medium text-texto hover:bg-preenchimento")}>
          {valor > 0 ? `+${valor}` : valor}
        </button>
      </span>
      <input type="range" min={-100} max={100} step={1} value={valor} onChange={(evento) => aoMudar(Number(evento.target.value))} className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-preenchimento-ativo accent-[var(--preto)]" />
      {pontas && (
        <span className="flex justify-between text-micro text-texto-3" aria-hidden>
          <span>{pontas[0]}</span>
          <span>{pontas[1]}</span>
        </span>
      )}
    </label>
  )
}
