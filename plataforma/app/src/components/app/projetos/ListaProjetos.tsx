"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Archive, ArchiveRestore, ArrowUpDown, Check, Copy, EllipsisVertical, LayoutGrid, List, Pencil, Pin, RotateCcw, SlidersHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Botao } from "@/components/hattie/Botao"
import { Busca } from "@/components/hattie/Busca"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { Tag } from "@/components/hattie/Tag"
import { agoraProjeto, haQuanto, novoId } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import { SITUACOES_PROJETO, type ItemProjeto, type ProjetoMarca, type SituacaoProjeto, type TipoProjeto } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { useSistemaMarca, type SistemaMarca } from "../SistemaMarca"
import { CampoNome } from "./CampoNome"
import { useProjetos } from "./EstadoProjetos"
import { ItemMiniatura } from "./ItemPrevia"

/*
 * Lista de projetos da marca. Uma barra só para procurar: busca por nome, situação em pílulas, tipo, ordem
 * e grade ou lista. Os fixados vêm primeiro. Cada projeto mostra uma capa montada com o que há dentro dele.
 */

const TIPOS: TipoProjeto[] = ["Lançamento", "Campanha", "Catálogo", "Redes sociais", "Outro"]
type Filtro = "ativos" | SituacaoProjeto
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "ativos", rotulo: "Todos" },
  { id: "andamento", rotulo: "Em andamento" },
  { id: "concluido", rotulo: "Concluídos" },
  { id: "arquivado", rotulo: "Arquivados" },
]
type Ordem = "recentes" | "nome"
const ITEM_MENU = "h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4"

const semAcento = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

export function ListaProjetos() {
  const marca = useMarca()
  const sistema = useSistemaMarca()
  const router = useRouter()
  const { projetos, definir, mudar, criar } = useProjetos()
  const [consulta, setConsulta] = useState("")
  const [filtro, setFiltro] = useState<Filtro>("ativos")
  const [tipo, setTipo] = useState<TipoProjeto | "todos">("todos")
  const [ordem, setOrdem] = useState<Ordem>("recentes")
  const [vista, setVista] = useState<"grade" | "lista">("grade")
  const [novo, setNovo] = useState(false)
  const [renomeando, setRenomeando] = useState<string | null>(null)
  const href = (id: string) => `/marca/${marca.slug}/projetos/${id}` as Route

  const visiveis = projetos
    .filter(
      (projeto) =>
        (filtro === "ativos" ? projeto.situacao !== "arquivado" : projeto.situacao === filtro) &&
        (tipo === "todos" || projeto.tipo === tipo) &&
        (!consulta.trim() || semAcento(`${projeto.nome} ${projeto.descricao}`).includes(semAcento(consulta.trim()))),
    )
    .sort((a, b) => (ordem === "nome" ? a.nome.localeCompare(b.nome, "pt-BR") : b.atualizado.localeCompare(a.atualizado)))
  const filtrando = consulta.trim() !== "" || filtro !== "ativos" || tipo !== "todos"
  const fixados = filtrando ? [] : visiveis.filter((projeto) => projeto.fixado)
  const demais = filtrando ? visiveis : visiveis.filter((projeto) => !projeto.fixado)

  const acoesDe = (projeto: ProjetoMarca): AcoesCartao => ({
    renomear: () => setRenomeando(projeto.id),
    fixar: () => mudar(projeto.id, (anterior) => ({ ...anterior, fixado: !anterior.fixado })),
    duplicar: () => {
      const copia: ProjetoMarca = { ...projeto, id: novoId("projeto"), nome: `${projeto.nome} (cópia)`, fixado: false, atualizado: agoraProjeto() }
      definir([copia, ...projetos])
      notificar({ titulo: "projeto duplicado", texto: `A cópia de ${projeto.nome} está na lista.`, tipo: "sucesso" })
    },
    situacao: (situacao) => mudar(projeto.id, (anterior) => ({ ...anterior, situacao })),
    apagar: () => {
      const antes = projetos
      definir(projetos.filter((item) => item.id !== projeto.id))
      notificar({ titulo: "apagado", texto: `Tirei o projeto ${projeto.nome} da lista.`, som: "puff", acao: { rotulo: "Desfazer", aoClicar: () => definir(antes) } })
    },
  })

  const lista = (itens: ProjetoMarca[]) =>
    vista === "grade" ? (
      <ul className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
        {itens.map((projeto) => (
          <li key={projeto.id} className="min-w-0">
            <CartaoProjeto
              projeto={projeto}
              sistema={sistema}
              href={href(projeto.id)}
              acoes={acoesDe(projeto)}
              renomeando={renomeando === projeto.id}
              aoGuardarNome={(nome) => mudar(projeto.id, (anterior) => ({ ...anterior, nome }))}
              aoFecharNome={() => setRenomeando(null)}
            />
          </li>
        ))}
      </ul>
    ) : (
      <ul className="flex flex-col overflow-hidden rounded-3xl bg-superficie p-1.5">
        {itens.map((projeto) => (
          <li key={projeto.id} className="group/linha relative flex items-center gap-3 rounded-2xl p-1.5 pe-2 hover:bg-preenchimento">
            <span className="h-12 w-16 shrink-0 overflow-hidden rounded-lg">
              <Capa projeto={projeto} sistema={sistema} simples />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              {renomeando === projeto.id ? (
                <CampoNome nome={projeto.nome} rotulo="Nome do projeto" aoGuardar={(nome) => mudar(projeto.id, (anterior) => ({ ...anterior, nome }))} aoFechar={() => setRenomeando(null)} className="-mx-1.5 px-1.5 py-0.5 text-sm font-medium" />
              ) : (
                <Link href={href(projeto.id)} className="flex items-center gap-1.5 truncate text-sm font-medium after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-texto">
                  {projeto.fixado && <Pin className="size-3.5 shrink-0 fill-current" strokeWidth={2} aria-label="Fixado" />}
                  <span className="truncate">{projeto.nome}</span>
                </Link>
              )}
              <span className="truncate text-xs text-texto-3">{projeto.descricao}</span>
            </div>
            <span className="hidden w-28 shrink-0 text-xs text-texto-2 @2xl:block">{projeto.tipo}</span>
            <span className="hidden w-36 shrink-0 text-xs text-texto-2 tabular-nums @4xl:block">{resumoDe(projeto)}</span>
            <span className="hidden w-28 shrink-0 @3xl:block">
              <TagSituacao situacao={projeto.situacao} />
            </span>
            <span className="w-24 shrink-0 text-end text-xs text-texto-3">{haQuanto(projeto.atualizado)}</span>
            <span className="relative z-10">
              <MenuProjeto projeto={projeto} acoes={acoesDe(projeto)} />
            </span>
          </li>
        ))}
      </ul>
    )

  return (
    <Canvas rotulo="Projetos">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-5">
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-borda-sutil pb-3">
            <div className="flex min-w-0 flex-1 items-baseline gap-2">
              <h1 className="font-heading text-titulo-3 font-medium lowercase @xl:text-titulo-2">projetos</h1>
              <span className="text-sm text-texto-3 tabular-nums">{projetos.filter((projeto) => projeto.situacao !== "arquivado").length}</span>
            </div>
            <Plimm rotulo="novo projeto" onClick={() => setNovo(true)} />
          </header>

          {projetos.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Busca valor={consulta} aoMudar={setConsulta} rotulo="Procurar projeto" placeholder="Procurar projeto" className="h-9 w-full bg-superficie sm:w-56" />
              <div role="group" aria-label="Situação" className="flex flex-wrap gap-1.5">
                {FILTROS.map((opcao) => (
                  <button
                    key={opcao.id}
                    type="button"
                    aria-pressed={filtro === opcao.id}
                    onClick={() => setFiltro(opcao.id)}
                    className={cn("h-8 rounded-full px-3 text-detalhe font-medium transition-[background-color] duration-150", filtro === opcao.id ? "bg-preto text-lima" : "bg-superficie text-texto-2 hover:text-texto")}
                  >
                    {opcao.rotulo}
                  </button>
                ))}
              </div>
              <div className="ms-auto flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Botao variante={tipo === "todos" ? "fantasma" : "secundario"} tamanho="sm">
                      <SlidersHorizontal /> {tipo === "todos" ? "Tipo" : tipo}
                    </Botao>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1">
                    <DropdownMenuLabel className="text-xs font-medium text-texto-3">Tipo de projeto</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={tipo} onValueChange={(valor) => setTipo(valor as TipoProjeto | "todos")}>
                      <DropdownMenuRadioItem value="todos">Todos os tipos</DropdownMenuRadioItem>
                      {TIPOS.map((opcao) => (
                        <DropdownMenuRadioItem key={opcao} value={opcao}>
                          {opcao}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Botao variante="fantasma" tamanho="sm" aria-label={`Ordem: ${ordem === "nome" ? "nome, de A a Z" : "mais recentes"}`}>
                      <ArrowUpDown /> <span className="max-sm:sr-only">{ordem === "nome" ? "Nome" : "Recentes"}</span>
                    </Botao>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1">
                    <DropdownMenuRadioGroup value={ordem} onValueChange={(valor) => setOrdem(valor as Ordem)}>
                      <DropdownMenuRadioItem value="recentes">Mais recentes</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="nome">Nome, de A a Z</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-0.5 rounded-full bg-superficie p-1" role="group" aria-label="Como mostrar">
                  {(
                    [
                      ["grade", LayoutGrid, "Em grade"],
                      ["lista", List, "Em lista"],
                    ] as const
                  ).map(([valor, Icone, rotulo]) => (
                    <button
                      key={valor}
                      type="button"
                      aria-label={rotulo}
                      aria-pressed={vista === valor}
                      onClick={() => setVista(valor)}
                      className={cn("grid size-8 place-items-center rounded-full transition-[background-color] duration-150", vista === valor ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento")}
                    >
                      <Icone className="size-4" strokeWidth={2} aria-hidden />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {projetos.length === 0 ? (
            <Vazio titulo="o primeiro projeto começa aqui" texto="Um projeto junta tudo de uma entrega: as páginas, as imagens, os textos e a conversa comigo. Um lançamento ou uma campanha é um bom começo.">
              <Plimm rotulo="novo projeto" onClick={() => setNovo(true)} />
            </Vazio>
          ) : visiveis.length === 0 ? (
            <Vazio titulo="nenhum projeto assim" texto="Tente outro nome ou tire um filtro.">
              <Botao
                variante="secundario"
                tamanho="sm"
                onClick={() => {
                  setConsulta("")
                  setFiltro("ativos")
                  setTipo("todos")
                }}
              >
                Ver todos
              </Botao>
            </Vazio>
          ) : (
            <div className="flex flex-col gap-7">
              {fixados.length > 0 && (
                <section aria-labelledby="titulo-fixados" className="flex flex-col gap-3">
                  <h2 id="titulo-fixados" className="flex items-baseline gap-2 text-sm font-semibold">
                    Fixados <span className="text-xs font-normal text-texto-3 tabular-nums">{fixados.length}</span>
                  </h2>
                  {lista(fixados)}
                </section>
              )}
              {demais.length > 0 && (
                <section aria-labelledby="titulo-demais" className="flex flex-col gap-3">
                  <h2 id="titulo-demais" className={cn("flex items-baseline gap-2 text-sm font-semibold", fixados.length === 0 && "sr-only")}>
                    {filtrando ? "Resultado" : "Todos"} <span className="text-xs font-normal text-texto-3 tabular-nums">{demais.length}</span>
                  </h2>
                  {lista(demais)}
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      <NovoProjeto
        aberta={novo}
        aoMudar={setNovo}
        marca={sistema.nome}
        aoCriar={(dados, pedido) => {
          const id = criar(dados, pedido)
          router.push(href(id))
        }}
      />
    </Canvas>
  )
}

/* ---------- Partes ---------- */

const resumoDe = (projeto: ProjetoMarca) => {
  const itens = projeto.itens.length
  const paginas = projeto.paginas.length
  return `${itens} ${itens === 1 ? "item" : "itens"} · ${paginas} ${paginas === 1 ? "página" : "páginas"}`
}

function TagSituacao({ situacao }: { situacao: SituacaoProjeto }) {
  return (
    <Tag tamanho="sm" tom={situacao === "andamento" ? "acao" : situacao === "concluido" ? "sucesso" : "feita"} ponto={situacao === "andamento"}>
      {situacao === "concluido" && <Check />}
      {SITUACOES_PROJETO[situacao].toLowerCase()}
    </Tag>
  )
}

function Vazio({ titulo, texto, children }: { titulo: string; texto: string; children?: React.ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-3xl bg-superficie px-6 py-12 text-center">
      <IconeHattie nome="hattie" tamanho={44} className="text-preto" />
      <p className="font-heading text-titulo-3 font-medium lowercase">{titulo}</p>
      <p className="max-w-md text-sm text-texto-2">{texto}</p>
      {children}
    </div>
  )
}

/** Capa do projeto: até três itens dele, o primeiro maior. Sem itens, o pontilhado. */
function Capa({ projeto, sistema, simples = false }: { projeto: ProjetoMarca; sistema: SistemaMarca; simples?: boolean }) {
  const comImagem = (item: ItemProjeto) => item.tipo === "imagem" || item.tipo === "peca" || item.tipo === "video"
  const itens = [...projeto.itens.filter(comImagem), ...projeto.itens.filter((item) => item.tipo === "texto")].slice(0, simples ? 1 : 3)
  if (itens.length === 0)
    return <span aria-hidden className="block size-full bg-preenchimento bg-[radial-gradient(var(--cinza)_1.5px,transparent_2px)] bg-size-[16px_16px] bg-position-[8px_8px]" />
  return (
    <div aria-hidden className={cn("grid size-full gap-1", itens.length === 3 ? "grid-cols-[3fr_2fr] grid-rows-2" : itens.length === 2 ? "grid-cols-2" : "")}>
      {itens.map((item, indice) => (
        <div key={item.id} className={cn("min-h-0 min-w-0 overflow-hidden", itens.length === 3 && indice === 0 && "row-span-2")}>
          <ItemMiniatura item={item} sistema={sistema} />
        </div>
      ))}
    </div>
  )
}

type AcoesCartao = {
  renomear: () => void
  fixar: () => void
  duplicar: () => void
  situacao: (situacao: SituacaoProjeto) => void
  apagar: () => void
}

function CartaoProjeto({
  projeto,
  sistema,
  href,
  acoes,
  renomeando,
  aoGuardarNome,
  aoFecharNome,
}: {
  projeto: ProjetoMarca
  sistema: SistemaMarca
  href: Route
  acoes: AcoesCartao
  renomeando: boolean
  aoGuardarNome: (nome: string) => void
  aoFecharNome: () => void
}) {
  return (
    <article className="group/card relative flex h-full flex-col gap-2 rounded-3xl bg-superficie p-1.5 transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-preenchimento">
        <Capa projeto={projeto} sistema={sistema} />
        {projeto.fixado && (
          <span className="absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-superficie/90" title="Fixado">
            <Pin className="size-3.5 fill-current" strokeWidth={2} aria-label="Fixado" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 items-start gap-1 ps-2 pb-1.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {renomeando ? (
            <CampoNome nome={projeto.nome} rotulo="Nome do projeto" aoGuardar={aoGuardarNome} aoFechar={aoFecharNome} className="-mx-1.5 px-1.5 py-0.5 text-sm font-semibold" />
          ) : (
            <Link href={href} className="truncate text-sm leading-snug font-semibold after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto">
              {projeto.nome}
            </Link>
          )}
          <p className="line-clamp-2 min-h-8 text-xs text-texto-2">{projeto.descricao}</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 text-xs text-texto-3">
            <TagSituacao situacao={projeto.situacao} />
            <span className="tabular-nums">{resumoDe(projeto)}</span>
            <span className="ms-auto">{haQuanto(projeto.atualizado)}</span>
          </p>
        </div>
        <span className="relative z-10">
          <MenuProjeto projeto={projeto} acoes={acoes} />
        </span>
      </div>
    </article>
  )
}

function MenuProjeto({ projeto, acoes }: { projeto: ProjetoMarca; acoes: AcoesCartao }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Ações de ${projeto.nome}`} className="grid size-8 shrink-0 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento">
        <EllipsisVertical className="size-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1" onCloseAutoFocus={(evento) => evento.preventDefault()}>
        <DropdownMenuItem className={ITEM_MENU} onSelect={acoes.renomear}>
          <Pencil aria-hidden /> Renomear
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} onSelect={acoes.fixar}>
          <Pin aria-hidden /> {projeto.fixado ? "Tirar dos fixados" : "Fixar no topo"}
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} onSelect={acoes.duplicar}>
          <Copy aria-hidden /> Duplicar
        </DropdownMenuItem>
        {projeto.situacao !== "arquivado" && (
          <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.situacao(projeto.situacao === "andamento" ? "concluido" : "andamento")}>
            {projeto.situacao === "andamento" ? <Check aria-hidden /> : <RotateCcw aria-hidden />}
            {projeto.situacao === "andamento" ? "Marcar como concluído" : "Reabrir"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className={ITEM_MENU} onSelect={() => acoes.situacao(projeto.situacao === "arquivado" ? "andamento" : "arquivado")}>
          {projeto.situacao === "arquivado" ? <ArchiveRestore aria-hidden /> : <Archive aria-hidden />}
          {projeto.situacao === "arquivado" ? "Tirar do arquivo" : "Arquivar"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} onSelect={acoes.apagar}>
          <Trash2 aria-hidden /> Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NovoProjeto({
  aberta,
  aoMudar,
  marca,
  aoCriar,
}: {
  aberta: boolean
  aoMudar: (aberta: boolean) => void
  marca: string
  aoCriar: (dados: { nome: string; descricao: string; tipo: TipoProjeto }, pedido?: string) => void
}) {
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Dê um nome ao projeto.")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const pedido = String(dados.get("pedido") ?? "").trim()
    aoCriar({ nome, descricao: pedido || "Projeto novo, ainda sem descrição.", tipo: (String(dados.get("tipo")) as TipoProjeto) || "Outro" }, pedido || undefined)
    setErro("")
    aoMudar(false)
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      titulo="novo projeto"
      descricao={`Um lugar para tudo de uma entrega da ${marca}: páginas, imagens, textos e a conversa comigo.`}
      rodape={<Plimm type="submit" form="form-projeto" rotulo="criar projeto" />}
    >
      <form id="form-projeto" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
          <Campo name="nome" rotulo="Nome" placeholder="Ex.: Kit de Natal" erro={erro} onChange={() => erro && setErro("")} autoFocus />
          <CampoLista name="tipo" rotulo="Tipo" defaultValue="Campanha" opcoes={TIPOS.map((tipo) => ({ valor: tipo, rotulo: tipo }))} />
        </div>
        <CampoArea name="pedido" rotulo="O que você quer criar primeiro?" dica="Opcional. Eu começo assim que o projeto abrir." placeholder="Ex.: 3 posts de lançamento do kit, com legenda" />
      </form>
    </Janela>
  )
}
