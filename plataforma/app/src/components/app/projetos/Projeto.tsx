"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  EllipsisVertical,
  Folder,
  FolderInput,
  FolderOpen,
  FolderPlus,
  Frame,
  LayoutGrid,
  Layers,
  MessagesSquare,
  Pencil,
  Pin,
  Plus,
  RotateCcw,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"
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
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { haQuanto } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import { SITUACOES_PROJETO, type ItemProjeto, type PaginaProjeto, type ProjetoMarca, type VistaProjeto } from "@/lib/mock"
import { BotaoColuna, Canvas, ColunaLateral } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { useSistemaMarca } from "../SistemaMarca"
import { useMidia } from "../useMidia"
import { CampoNome } from "./CampoNome"
import { CampoPedido, Historia } from "./Conversa"
import { useAcoesProjeto, useProjetos, type AcoesProjeto } from "./EstadoProjetos"
import { VisorItem } from "./VisorItem"
import { VistaCanvas } from "./VistaCanvas"
import { VistaGrade } from "./VistaGrade"

/*
 * Um projeto aberto. Três partes:
 * 1. Coluna do projeto (esquerda): "Todos os arquivos", as páginas (soltas ou dentro de pastas) e o botão da conversa.
 * 2. A página, vista de três jeitos: Canvas (quadro livre), Grade (cards para organizar) e Thread (a história dos pedidos).
 * 3. Conversa com o Hattie (direita): abre ao lado do canvas ou da grade. Na Thread, o campo fica na própria página.
 * Os itens são os mesmos nas três vistas; mudar num lugar muda em todos.
 * Abrir um item (duplo clique no canvas, clique na grade ou na thread) mostra o visor por cima, sem trocar de vista.
 */

const TODOS = "tudo"
const ITEM_MENU = "h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4"

const VISTAS: { id: VistaProjeto; rotulo: string; icone: LucideIcon; explica: string }[] = [
  { id: "canvas", rotulo: "Canvas", icone: Frame, explica: "Quadro livre: os itens ficam onde você colocar" },
  { id: "grade", rotulo: "Grade", icone: LayoutGrid, explica: "Itens em cards, para achar e organizar" },
  { id: "thread", rotulo: "Thread", icone: MessagesSquare, explica: "Os pedidos e o que saiu de cada um, em ordem" },
]

export function Projeto({ projetoId }: { projetoId: string }) {
  const marca = useMarca()
  const { projetos } = useProjetos()
  const projeto = projetos.find((item) => item.id === projetoId)
  if (!projeto)
    return (
      <Canvas rotulo="Projeto">
        <div className="grid flex-1 place-items-center p-6">
          <div role="status" className="flex max-w-sm flex-col items-center gap-3 text-center">
            <IconeHattie nome="hattie" tamanho={44} className="text-preto" />
            <p className="font-heading text-titulo-3 font-medium lowercase">esse projeto saiu daqui</p>
            <p className="text-sm text-texto-2">Ele pode ter sido apagado, ou a página foi recarregada antes de eu guardar. Os outros projetos continuam na lista.</p>
            <Botao variante="secundario" tamanho="sm" asChild>
              <Link href={`/marca/${marca.slug}/projetos` as Route}>
                <ArrowLeft /> Ver os projetos
              </Link>
            </Botao>
          </div>
        </div>
      </Canvas>
    )
  return <ProjetoAberto key={projeto.id} projeto={projeto} />
}

function ProjetoAberto({ projeto }: { projeto: ProjetoMarca }) {
  const marca = useMarca()
  const sistema = useSistemaMarca()
  const router = useRouter()
  const { criando, pedir, pendente, limparPendente, projetos, definir, mudar } = useProjetos()
  const acoes = useAcoesProjeto(projeto)
  const telaLarga = useMidia("(min-width: 1280px)")
  const [lugar, setLugar] = useState<string>(projeto.paginas[0]?.id ?? TODOS)
  const [vista, setVista] = useState<VistaProjeto>("canvas")
  const [conversa, setConversa] = useState(false)
  const [sobre, setSobre] = useState<ItemProjeto | null>(null)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [foco, setFoco] = useState<{ ids: string[]; vez: number }>({ ids: [], vez: 0 })
  const [renomeandoPagina, setRenomeandoPagina] = useState<string | null>(null)
  /** id do item aberto no visor. */
  const [aberto, setAberto] = useState<string | null>(null)

  const pagina = lugar === TODOS ? null : (projeto.paginas.find((item) => item.id === lugar) ?? projeto.paginas[0] ?? null)
  const itens = pagina ? projeto.itens.filter((item) => item.pagina === pagina.id) : projeto.itens
  const vistaAtual: VistaProjeto = !pagina && vista === "canvas" ? "grade" : vista
  const ocupado = criando === projeto.id
  const lista = `/marca/${marca.slug}/projetos` as Route

  const irPara = (novo: string) => {
    setLugar(novo)
    setSelecionados([])
  }

  const abrir = (item: ItemProjeto) => (item.tipo === "forma" ? verItem(item) : setAberto(item.id))

  const verItem = (item: ItemProjeto) => {
    setAberto(null)
    setLugar(item.pagina)
    setVista("canvas")
    setSelecionados([item.id])
    setFoco((atual) => ({ ids: [item.id], vez: atual.vez + 1 }))
  }

  const enviar = (texto: string, ajuste = sobre) => {
    const destino = pagina?.id ?? projeto.paginas[0]?.id
    if (!destino) return
    const ids = pedir(projeto.id, destino, texto, ajuste ? { sobre: ajuste } : {})
    setSobre(null)
    setSelecionados(ids)
    // Num ajuste, a original entra no quadro junto com a nova versão, para comparar.
    setFoco((atual) => ({ ids: ajuste ? [...ids, ajuste.id] : ids, vez: atual.vez + 1 }))
  }

  const pedirAjuste = (item: ItemProjeto) => {
    setSobre(item)
    if (vistaAtual !== "thread") setConversa(true)
  }

  // Projeto que nasceu com um pedido: o Hattie começa assim que a tela abre.
  useEffect(() => {
    if (pendente?.projeto !== projeto.id) return
    const espera = setTimeout(() => {
      limparPendente()
      setConversa(true)
      const destino = projeto.paginas[0]?.id
      if (!destino) return
      const ids = pedir(projeto.id, destino, pendente.texto)
      setFoco((atual) => ({ ids, vez: atual.vez + 1 }))
    }, 0)
    return () => clearTimeout(espera)
  }, [pendente, projeto.id, projeto.paginas, pedir, limparPendente])

  const novaPagina = (pasta?: string) => {
    const id = acoes.novaPagina(pasta)
    irPara(id)
    setVista("canvas")
    setRenomeandoPagina(id)
  }

  const apagarProjeto = () => {
    const antes = projetos
    definir(projetos.filter((item) => item.id !== projeto.id))
    router.push(lista)
    notificar({ titulo: "apagado", texto: `Tirei o projeto ${projeto.nome} da lista.`, som: "puff", acao: { rotulo: "Desfazer", aoClicar: () => definir(antes) } })
  }

  const painelConversa = (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
        <Historia
          projeto={projeto}
          pagina={pagina?.id ?? null}
          sistema={sistema}
          compacta
          criando={ocupado}
          aoVerItem={verItem}
          vazio={
            <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
              <IconeHattie nome="hattie" tamanho={40} className="text-preto" />
              <p className="font-heading text-base font-medium lowercase">o que vamos criar?</p>
              <p className="text-sm text-texto-2">
                Peça do seu jeito. O que eu criar aparece {pagina ? `em ${pagina.nome}` : "no projeto"}, com as cores e as fontes da {sistema.nome}.
              </p>
            </div>
          }
        />
      </div>
      <CampoPedido sobre={sobre} aoTirarSobre={() => setSobre(null)} aoEnviar={(texto) => enviar(texto)} desabilitado={ocupado} comSugestoes={projeto.conversa.length === 0} />
    </div>
  )

  const vazioGrade = (
    <div role="status" className="flex flex-col items-center gap-3 rounded-3xl bg-superficie px-6 py-12 text-center">
      <IconeHattie nome="hattie" tamanho={44} className="text-preto" />
      <p className="font-heading text-titulo-3 font-medium lowercase">nada por aqui ainda</p>
      <p className="max-w-sm text-sm text-texto-2">Crie direto no canvas ou conte para mim o que você precisa. Tudo que nascer aparece aqui.</p>
      <div className="flex flex-wrap justify-center gap-2">
        {pagina && (
          <Botao variante="secundario" tamanho="sm" onClick={() => setVista("canvas")}>
            <Frame /> Abrir o canvas
          </Botao>
        )}
        <Botao variante="secundario" tamanho="sm" onClick={() => setConversa(true)}>
          <IconeHattie nome="hattie" tamanho={16} /> Pedir ao Hattie
        </Botao>
      </div>
    </div>
  )

  return (
    <>
      <ColunaLateral rotulo={`Projeto ${projeto.nome}`} className="hidden lg:flex">
        <CabecalhoProjeto
          projeto={projeto}
          voltar={lista}
          aoRenomear={(nome) => mudar(projeto.id, (anterior) => ({ ...anterior, nome }))}
          aoFixar={() => mudar(projeto.id, (anterior) => ({ ...anterior, fixado: !anterior.fixado }))}
          aoMudarSituacao={() => mudar(projeto.id, (anterior) => ({ ...anterior, situacao: anterior.situacao === "andamento" ? "concluido" : "andamento" }))}
          aoApagar={apagarProjeto}
        />
        <NavProjeto
          projeto={projeto}
          lugar={pagina?.id ?? TODOS}
          acoes={acoes}
          renomeando={renomeandoPagina}
          aoRenomear={setRenomeandoPagina}
          aoIr={irPara}
          aoNovaPagina={novaPagina}
        />
        {vistaAtual !== "thread" && (
          <Botao variante={conversa ? "secundario" : "primario"} className="w-full" aria-pressed={conversa} onClick={() => setConversa(!conversa)}>
            <IconeHattie nome="hattie" tamanho={18} /> {conversa ? "Fechar a conversa" : "Pedir ao Hattie"}
          </Botao>
        )}
      </ColunaLateral>

      <Canvas rotulo={pagina ? `Página ${pagina.nome}` : "Todos os arquivos do projeto"}>
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 pt-4 pb-3 md:px-6 md:pt-5">
            <div className="flex min-w-0 flex-1 basis-40 items-center gap-2">
              <BotaoColuna />
              <Botao variante="fantasma" tamanho="icone" aria-label="Voltar para os projetos" asChild className="-ms-1.5 lg:hidden">
                <Link href={lista}>
                  <ArrowLeft />
                </Link>
              </Botao>
              <h1 className="min-w-0 font-heading text-titulo-3 font-medium @xl:text-titulo-2">
                <span className="hidden truncate lg:block">{pagina ? pagina.nome : "todos os arquivos"}</span>
                <NavCelular projeto={projeto} lugar={pagina?.id ?? TODOS} aoIr={irPara} aoNovaPagina={() => novaPagina()}>
                  {pagina ? pagina.nome : "todos os arquivos"}
                </NavCelular>
              </h1>
              <span className="shrink-0 pt-1 text-sm text-texto-3 tabular-nums">{itens.length}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div role="group" aria-label="Como ver a página" className="flex items-center gap-0.5 rounded-full bg-superficie p-1">
                {VISTAS.map((opcao) => {
                  const ativa = vistaAtual === opcao.id
                  const fora = opcao.id === "canvas" && !pagina
                  return (
                    <Tooltip key={opcao.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-pressed={ativa}
                          aria-disabled={fora || undefined}
                          aria-label={opcao.rotulo}
                          onClick={() => !fora && setVista(opcao.id)}
                          className={cn(
                            "flex h-9 items-center gap-2 rounded-full px-2.5 text-sm font-medium transition-[background-color,color] duration-150 @2xl:px-3.5",
                            ativa ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento hover:text-texto",
                            fora && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-texto-2",
                          )}
                        >
                          <opcao.icone className="size-4" strokeWidth={2} aria-hidden />
                          <span className="hidden @2xl:inline">{opcao.rotulo}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{fora ? "O canvas é de uma página. Escolha uma na coluna." : opcao.explica}</TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
              {vistaAtual !== "thread" && (
                <Botao variante={conversa ? "secundario" : "primario"} tamanho="md" className="h-9 lg:hidden" aria-pressed={conversa} aria-label="Pedir ao Hattie" onClick={() => setConversa(!conversa)}>
                  <IconeHattie nome="hattie" tamanho={18} />
                  <span className="hidden sm:inline">Pedir</span>
                </Botao>
              )}
            </div>
          </header>

          {vistaAtual === "canvas" && pagina && (
            <VistaCanvas
              key={pagina.id}
              projeto={projeto}
              pagina={pagina}
              itens={itens}
              sistema={sistema}
              acoes={acoes}
              selecionados={selecionados}
              aoSelecionar={setSelecionados}
              aoPedir={(texto, opcoes) => pedir(projeto.id, pagina.id, texto, opcoes)}
              aoPedirAjuste={pedirAjuste}
              aoAbrir={abrir}
              aoAbrirConversa={() => setConversa(true)}
              foco={foco}
            />
          )}
          {vistaAtual === "grade" && (
            <VistaGrade
              key={pagina?.id ?? TODOS}
              projeto={projeto}
              pagina={pagina?.id ?? null}
              itens={itens}
              sistema={sistema}
              acoes={acoes}
              aoAbrir={abrir}
              aoVerItem={verItem}
              aoPedirAjuste={pedirAjuste}
              aoIrParaPagina={irPara}
              vazio={vazioGrade}
            />
          )}
          {vistaAtual === "thread" && (
            <div className="flex min-h-0 flex-1 flex-col px-4 md:px-6">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-2xl py-4">
                  <Historia
                    projeto={projeto}
                    pagina={pagina?.id ?? null}
                    sistema={sistema}
                    criando={ocupado}
                    aoVerItem={abrir}
                    vazio={
                      <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <IconeHattie nome="hattie" tamanho={56} className="text-preto" />
                        <p className="font-heading text-titulo-3 font-medium lowercase">a história começa no primeiro pedido</p>
                        <p className="max-w-sm text-sm text-texto-2">Cada pedido fica aqui com o que saiu dele, em ordem. Dá para voltar, comparar e pedir de novo.</p>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="mx-auto w-full max-w-2xl pt-1 pb-4 md:pb-5">
                <CampoPedido sobre={sobre} aoTirarSobre={() => setSobre(null)} aoEnviar={(texto) => enviar(texto)} desabilitado={ocupado} comSugestoes={projeto.conversa.length === 0} />
              </div>
            </div>
          )}
        </div>
      </Canvas>

      <VisorItem
        item={projeto.itens.find((item) => item.id === aberto) ?? null}
        lista={itens.filter((item) => item.tipo !== "forma")}
        projeto={projeto}
        sistema={sistema}
        acoes={acoes}
        ocupado={ocupado}
        aoMudar={setAberto}
        aoPedir={(texto, opcoes) => pedir(projeto.id, opcoes.sobre?.pagina ?? projeto.itens.find((item) => item.id === aberto)?.pagina ?? pagina?.id ?? projeto.paginas[0].id, texto, opcoes)}
        aoVerNoCanvas={verItem}
      />

      {conversa && vistaAtual !== "thread" && telaLarga && (
        <ColunaLateral
          lado="direita"
          titulo="pedir ao hattie"
          className="w-80"
          acao={
            <Botao variante="fantasma" tamanho="icone" aria-label="Fechar a conversa" onClick={() => setConversa(false)}>
              <X />
            </Botao>
          }
        >
          {painelConversa}
        </ColunaLateral>
      )}
      {conversa && vistaAtual !== "thread" && !telaLarga && (
        <Sheet open onOpenChange={(aberta) => !aberta && setConversa(false)}>
          <SheetContent side="right" className="w-full gap-0 bg-background p-4 data-[side=right]:sm:max-w-sm">
            <SheetTitle className="mb-3 font-heading text-titulo-3 font-medium lowercase">pedir ao hattie</SheetTitle>
            <SheetDescription className="sr-only">Conversa do projeto {projeto.nome}</SheetDescription>
            {painelConversa}
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

/* ---------- Coluna do projeto ---------- */

function CabecalhoProjeto({
  projeto,
  voltar,
  aoRenomear,
  aoFixar,
  aoMudarSituacao,
  aoApagar,
}: {
  projeto: ProjetoMarca
  voltar: Route
  aoRenomear: (nome: string) => void
  aoFixar: () => void
  aoMudarSituacao: () => void
  aoApagar: () => void
}) {
  const [renomeando, setRenomeando] = useState(false)
  return (
    <div className="flex flex-col gap-1.5 border-b border-borda-sutil pb-3">
      <Link href={voltar} className="flex items-center gap-1.5 self-start rounded-full py-1 ps-1 pe-2 text-xs font-medium text-texto-2 hover:text-texto">
        <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden /> Projetos
      </Link>
      <div className="flex items-start gap-1 ps-1">
        {renomeando ? (
          <CampoNome nome={projeto.nome} rotulo="Nome do projeto" aoGuardar={aoRenomear} aoFechar={() => setRenomeando(false)} className="font-heading text-base font-medium" />
        ) : (
          <h2 className="min-w-0 flex-1 font-heading text-base leading-tight font-medium text-balance">{projeto.nome}</h2>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Ações do projeto" className="-mt-1 grid size-8 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento">
            <EllipsisVertical className="size-4" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1" onCloseAutoFocus={(evento) => renomeando && evento.preventDefault()}>
            <DropdownMenuItem className={ITEM_MENU} onSelect={() => setRenomeando(true)}>
              <Pencil aria-hidden /> Renomear
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM_MENU} onSelect={aoFixar}>
              <Pin aria-hidden /> {projeto.fixado ? "Tirar dos fixados" : "Fixar no topo"}
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM_MENU} onSelect={aoMudarSituacao}>
              {projeto.situacao === "andamento" ? <Check aria-hidden /> : <RotateCcw aria-hidden />}
              {projeto.situacao === "andamento" ? "Marcar como concluído" : "Reabrir o projeto"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className={ITEM_MENU} onSelect={aoApagar}>
              <Trash2 aria-hidden /> Excluir projeto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="ps-1 text-xs text-texto-3">
        {SITUACOES_PROJETO[projeto.situacao]} · editado {haQuanto(projeto.atualizado)}
      </p>
    </div>
  )
}

type PropsNav = {
  projeto: ProjetoMarca
  lugar: string
  acoes: AcoesProjeto
  renomeando: string | null
  aoRenomear: (id: string | null) => void
  aoIr: (lugar: string) => void
  aoNovaPagina: (pasta?: string) => void
}

function NavProjeto({ projeto, lugar, acoes, renomeando, aoRenomear, aoIr, aoNovaPagina }: PropsNav) {
  const [fechadas, setFechadas] = useState<string[]>([])
  const conta = (pagina: string) => projeto.itens.filter((item) => item.pagina === pagina).length
  const soltas = projeto.paginas.filter((pagina) => !pagina.pasta || !projeto.pastas.some((pasta) => pasta.id === pagina.pasta))
  const umaSo = projeto.paginas.length <= 1

  const linhaPagina = (pagina: PaginaProjeto, dentro = false) => {
    const atual = lugar === pagina.id
    return (
      <li key={pagina.id} className={cn("group/linha flex h-9 items-center rounded-full pe-1", atual ? "bg-lima-suave" : "hover:bg-preenchimento", dentro && "ms-4")}>
        {renomeando === pagina.id ? (
          <span className="flex min-w-0 flex-1 px-1.5">
            <CampoNome nome={pagina.nome} rotulo="Nome da página" aoGuardar={(nome) => acoes.renomearPagina(pagina.id, nome)} aoFechar={() => aoRenomear(null)} className="text-sm" />
          </span>
        ) : (
          <button type="button" aria-current={atual ? "page" : undefined} onClick={() => aoIr(pagina.id)} onDoubleClick={() => aoRenomear(pagina.id)} className={cn("flex h-full min-w-0 flex-1 items-center gap-2.5 ps-3 text-start text-sm", atual ? "font-medium" : "text-texto-2 group-hover/linha:text-texto")}>
            <Frame className="size-4 shrink-0" strokeWidth={atual ? 2.25 : 1.75} aria-hidden />
            <span className="flex-1 truncate">{pagina.nome}</span>
          </button>
        )}
        <span className="px-2 text-xs text-texto-3 tabular-nums group-focus-within/linha:hidden group-hover/linha:hidden pointer-coarse:hidden">{conta(pagina.id)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label={`Ações da página ${pagina.nome}`} className="hidden size-7 shrink-0 place-items-center rounded-full text-texto-2 group-focus-within/linha:grid group-hover/linha:grid hover:bg-preto/10 hover:text-texto data-[state=open]:grid pointer-coarse:grid">
            <EllipsisVertical className="size-4" strokeWidth={2} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-2xl p-1" onCloseAutoFocus={(evento) => evento.preventDefault()}>
            <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoRenomear(pagina.id)}>
              <Pencil aria-hidden /> Renomear
            </DropdownMenuItem>
            {projeto.pastas.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className={ITEM_MENU}>
                  <FolderInput aria-hidden /> Mover para pasta
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-52 rounded-2xl p-1">
                  {projeto.pastas
                    .filter((pasta) => pasta.id !== pagina.pasta)
                    .map((pasta) => (
                      <DropdownMenuItem key={pasta.id} className={ITEM_MENU} onSelect={() => acoes.moverPagina(pagina.id, pasta.id)}>
                        <Folder aria-hidden /> <span className="truncate">{pasta.nome}</span>
                      </DropdownMenuItem>
                    ))}
                  {pagina.pasta && (
                    <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.moverPagina(pagina.id, undefined)}>
                      Fora de pastas
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className={cn(ITEM_MENU, umaSo && "text-texto-3 data-[disabled]:opacity-100")} disabled={umaSo} onSelect={() => acoes.removerPagina(pagina.id)}>
              <Trash2 aria-hidden /> Excluir página
              {umaSo && <span className="ms-auto ps-3 text-xs text-texto-2">fica pelo menos uma</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    )
  }

  return (
    <nav aria-label="Páginas do projeto" className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1">
      <button
        type="button"
        aria-current={lugar === TODOS ? "page" : undefined}
        onClick={() => aoIr(TODOS)}
        className={cn("flex h-9 shrink-0 items-center gap-2.5 rounded-full px-3 text-start text-sm", lugar === TODOS ? "bg-lima-suave font-medium" : "text-texto-2 hover:bg-preenchimento hover:text-texto")}
      >
        <Layers className="size-4 shrink-0" strokeWidth={lugar === TODOS ? 2.25 : 1.75} aria-hidden />
        <span className="flex-1 truncate">Todos os arquivos</span>
        <span className="text-xs text-texto-3 tabular-nums">{projeto.itens.length}</span>
      </button>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between ps-3 pe-1 pb-1">
          <h3 className="text-xs text-texto-3">Páginas</h3>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Nova página ou pasta" className="grid size-7 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento">
              <Plus className="size-4" strokeWidth={2} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 rounded-2xl p-1" onCloseAutoFocus={(evento) => evento.preventDefault()}>
              <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoNovaPagina()}>
                <Frame aria-hidden /> Nova página
              </DropdownMenuItem>
              <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoRenomear(acoes.novaPasta())}>
                <FolderPlus aria-hidden /> Nova pasta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="flex flex-col gap-0.5">
          {soltas.map((pagina) => linhaPagina(pagina))}
          {projeto.pastas.map((pasta) => {
            const aberta = !fechadas.includes(pasta.id)
            const paginas = projeto.paginas.filter((pagina) => pagina.pasta === pasta.id)
            const Icone = aberta ? FolderOpen : Folder
            return (
              <li key={pasta.id} className="flex flex-col gap-0.5">
                <div className="group/linha flex h-9 items-center rounded-full pe-1 hover:bg-preenchimento">
                  {renomeando === pasta.id ? (
                    <span className="flex min-w-0 flex-1 px-1.5">
                      <CampoNome nome={pasta.nome} rotulo="Nome da pasta" aoGuardar={(nome) => acoes.renomearPasta(pasta.id, nome)} aoFechar={() => aoRenomear(null)} className="text-sm" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={aberta}
                      onClick={() => setFechadas((atual) => (aberta ? [...atual, pasta.id] : atual.filter((id) => id !== pasta.id)))}
                      onDoubleClick={() => aoRenomear(pasta.id)}
                      className="flex h-full min-w-0 flex-1 items-center gap-2.5 ps-3 text-start text-sm text-texto-2 group-hover/linha:text-texto"
                    >
                      <Icone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                      <span className="flex-1 truncate">{pasta.nome}</span>
                      <ChevronRight className={cn("size-3.5 shrink-0 text-texto-3 transition-[rotate] duration-150", aberta && "rotate-90")} strokeWidth={2} aria-hidden />
                    </button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger aria-label={`Ações da pasta ${pasta.nome}`} className="hidden size-7 shrink-0 place-items-center rounded-full text-texto-2 group-focus-within/linha:grid group-hover/linha:grid hover:bg-preto/10 hover:text-texto data-[state=open]:grid pointer-coarse:grid">
                      <EllipsisVertical className="size-4" strokeWidth={2} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 rounded-2xl p-1" onCloseAutoFocus={(evento) => evento.preventDefault()}>
                      <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoNovaPagina(pasta.id)}>
                        <Plus aria-hidden /> Nova página aqui
                      </DropdownMenuItem>
                      <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoRenomear(pasta.id)}>
                        <Pencil aria-hidden /> Renomear
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.removerPasta(pasta.id)}>
                        <Trash2 aria-hidden /> Excluir pasta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {aberta && (
                  <ul className="flex flex-col gap-0.5">
                    {paginas.map((pagina) => linhaPagina(pagina, true))}
                    {paginas.length === 0 && <li className="ms-4 px-3 py-1.5 text-xs text-texto-3">Pasta vazia</li>}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

/** No celular (sem a coluna), o título vira o botão que troca de página. */
function NavCelular({ projeto, lugar, aoIr, aoNovaPagina, children }: { projeto: ProjetoMarca; lugar: string; aoIr: (lugar: string) => void; aoNovaPagina: () => void; children: ReactNode }) {
  const grupos = [
    { id: "soltas", titulo: undefined as string | undefined, paginas: projeto.paginas.filter((pagina) => !pagina.pasta || !projeto.pastas.some((pasta) => pasta.id === pagina.pasta)) },
    ...projeto.pastas.map((pasta) => ({ id: pasta.id, titulo: pasta.nome as string | undefined, paginas: projeto.paginas.filter((pagina) => pagina.pasta === pasta.id) })),
  ].filter((grupo) => grupo.paginas.length > 0)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex max-w-full min-w-0 items-center gap-1.5 rounded-full text-start hover:bg-superficie lg:hidden">
        <span className="truncate">{children}</span>
        <ChevronDown className="size-5 shrink-0 text-texto-2" strokeWidth={2} aria-hidden />
        <span className="sr-only">, trocar de página</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[70svh] w-64 overflow-y-auto rounded-2xl p-1">
        <DropdownMenuLabel className="truncate text-xs font-medium text-texto-3">{projeto.nome}</DropdownMenuLabel>
        <DropdownMenuItem className={ITEM_MENU} onSelect={() => aoIr(TODOS)}>
          <Layers aria-hidden /> <span className="flex-1">Todos os arquivos</span>
          {lugar === TODOS && <Check aria-label="aberto agora" />}
        </DropdownMenuItem>
        {grupos.map((grupo) => (
          <div key={grupo.id}>
            <DropdownMenuSeparator />
            {grupo.titulo && <DropdownMenuLabel className="text-xs font-medium text-texto-3">{grupo.titulo}</DropdownMenuLabel>}
            {grupo.paginas.map((pagina) => (
              <DropdownMenuItem key={pagina.id} className={ITEM_MENU} onSelect={() => aoIr(pagina.id)}>
                <Frame aria-hidden /> <span className="flex-1 truncate">{pagina.nome}</span>
                {lugar === pagina.id && <Check aria-label="aberta agora" />}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} onSelect={aoNovaPagina}>
          <Plus aria-hidden /> Nova página
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
