"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent, type ReactNode, type RefObject } from "react"
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Clapperboard,
  Download,
  FileText,
  Folder,
  FolderOpen,
  Image as IconeImagem,
  LayoutGrid,
  LayoutTemplate,
  Library,
  List,
  PenTool,
  Presentation,
  Search,
  Shapes,
  SlidersHorizontal,
  Stamp,
  Star,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Botao } from "@/components/hattie/Botao"
import { CampoLista } from "@/components/hattie/Campo"
import { EnvioImagens, type ImagemEnviada } from "@/components/hattie/EnvioImagens"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { cn } from "@/lib/utils"
import { buscar, dataCurta, grupoDaData, noPeriodo, SUGESTOES_BUSCA, type Entendido } from "@/lib/biblioteca"
import {
  ARQUIVOS,
  GRUPOS_APARECE,
  HOJE_BIBLIOTECA,
  ORIGENS,
  PROJETOS,
  QUEM_APARECE,
  STATUS_ARQUIVO,
  TIPOS_ARQUIVO,
  type ArquivoBiblioteca,
  type TipoArquivo,
} from "@/lib/mock"
import { Canvas, ColunaLateral } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { useSistemaMarca, type SistemaMarca } from "../SistemaMarca"
import { DetalheArquivo, feitoPor, MenuArquivo, type AcoesArquivo } from "./DetalheArquivo"
import { PreviaArquivo } from "./PreviaArquivo"

/*
 * Biblioteca da marca. Três níveis, do mais largo para o mais fino:
 * 1. Onde olhar (coluna lateral): tudo, favoritos, um tipo ou um projeto.
 * 2. O que procurar (barra única): busca por frase, filtros num menu só, ordem e grade ou lista.
 *    O que está valendo aparece logo abaixo, em pílulas que dá para tirar.
 * 3. Os arquivos, agrupados por data.
 */

/** Lugar escolhido na coluna: "tudo", "favoritos", "tipo:foto", "projeto:pequi" ou "projeto:sem". */
type Lugar = string
type Filtros = { aparece: string; periodo: string; origem: string; status: string }
const PADRAO: Filtros = { aparece: "todos", periodo: "todos", origem: "todos", status: "todos" }
type Ordem = "recentes" | "antigos" | "nome"

const ICONE_TIPO: Record<TipoArquivo, LucideIcon> = {
  foto: IconeImagem,
  ilustracao: PenTool,
  grafismo: Shapes,
  peca: LayoutTemplate,
  apresentacao: Presentation,
  video: Clapperboard,
  logo: Stamp,
  documento: FileText,
}
const ORDEM_TIPOS = Object.keys(TIPOS_ARQUIVO) as TipoArquivo[]

const OPCOES_FILTRO: { chave: keyof Filtros; rotulo: string; grupos: { rotulo?: string; opcoes: { valor: string; rotulo: string }[] }[] }[] = [
  {
    chave: "aparece",
    rotulo: "Quem aparece",
    grupos: (Object.keys(GRUPOS_APARECE) as (keyof typeof GRUPOS_APARECE)[]).map((grupo) => ({
      rotulo: GRUPOS_APARECE[grupo],
      opcoes: QUEM_APARECE.filter((item) => item.grupo === grupo).map((item) => ({ valor: item.id, rotulo: item.nome })),
    })),
  },
  {
    chave: "periodo",
    rotulo: "Data",
    grupos: [
      {
        opcoes: [
          { valor: "hoje", rotulo: "Hoje" },
          { valor: "semana", rotulo: "Esta semana" },
          { valor: "mes", rotulo: "Este mês" },
          { valor: "mes-passado", rotulo: "Mês passado" },
          { valor: "3meses", rotulo: "Últimos 3 meses" },
        ],
      },
    ],
  },
  { chave: "origem", rotulo: "Feito por", grupos: [{ opcoes: (["hattie", "voce", "parceiro"] as const).map((valor) => ({ valor, rotulo: ORIGENS[valor] })) }] },
  { chave: "status", rotulo: "Situação", grupos: [{ opcoes: (["rascunho", "aprovado", "publicado"] as const).map((valor) => ({ valor, rotulo: STATUS_ARQUIVO[valor] })) }] },
]

const OPCOES_ORDEM: { valor: Ordem; rotulo: string }[] = [
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "antigos", rotulo: "Mais antigos" },
  { valor: "nome", rotulo: "Nome, de A a Z" },
]

function noLugar(arquivo: ArquivoBiblioteca, lugar: Lugar) {
  if (lugar === "tudo") return true
  if (lugar === "favoritos") return !!arquivo.favorito
  if (lugar.startsWith("tipo:")) return arquivo.tipo === lugar.slice(5)
  if (lugar === "projeto:sem") return !arquivo.projeto
  return arquivo.projeto === lugar.slice(8)
}

function nomeDoLugar(lugar: Lugar): { titulo: string; nomeProprio: boolean } {
  if (lugar === "tudo") return { titulo: "tudo", nomeProprio: false }
  if (lugar === "favoritos") return { titulo: "favoritos", nomeProprio: false }
  if (lugar.startsWith("tipo:")) return { titulo: TIPOS_ARQUIVO[lugar.slice(5) as TipoArquivo].plural.toLowerCase(), nomeProprio: false }
  if (lugar === "projeto:sem") return { titulo: "sem projeto", nomeProprio: false }
  return { titulo: PROJETOS.find((projeto) => projeto.id === lugar.slice(8))?.nome ?? "projeto", nomeProprio: true }
}

function rotuloDoFiltro(chave: keyof Filtros, valor: string) {
  const filtro = OPCOES_FILTRO.find((item) => item.chave === chave)
  return filtro?.grupos.flatMap((grupo) => grupo.opcoes).find((opcao) => opcao.valor === valor)?.rotulo ?? valor
}

/**
 * Biblioteca da marca: tudo que a pessoa criou com o Hattie, enviou ou recebeu de parceiros.
 */
export function Biblioteca() {
  const marca = useMarca()
  const sistema = useSistemaMarca()
  const campo = useRef<HTMLInputElement>(null)
  // Os arquivos de exemplo são da Raiz Natural; as outras marcas começam vazias.
  const [arquivos, setArquivos] = useState(marca.slug === "raiz-natural" ? ARQUIVOS : [])
  const [lugar, setLugar] = useState<Lugar>("tudo")
  const [consulta, setConsulta] = useState("")
  const [filtros, setFiltros] = useState(PADRAO)
  const [ordem, setOrdem] = useState<Ordem>("recentes")
  const [vista, setVista] = useState<"grade" | "lista">("grade")
  const [selecionados, setSelecionados] = useState<string[]>([])
  /** Modo de seleção ligado pelo botão "Selecionar" (no celular, é o único jeito de marcar). */
  const [selecionando, setSelecionando] = useState(false)
  const [aberto, setAberto] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const ultimoClicado = useRef<string | null>(null)
  const emSelecao = selecionando || selecionados.length > 0
  const sairDaSelecao = () => {
    setSelecionados([])
    setSelecionando(false)
  }

  // "/" leva à busca, como nos apps de arquivos.
  useEffect(() => {
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== "/" || (evento.target instanceof Element && evento.target.closest("input, textarea, [contenteditable]"))) return
      evento.preventDefault()
      campo.current?.focus()
    }
    window.addEventListener("keydown", aoTeclar)
    return () => window.removeEventListener("keydown", aoTeclar)
  }, [])

  const buscando = consulta.trim().length > 0
  const filtrosAtivos = (Object.keys(PADRAO) as (keyof Filtros)[]).filter((chave) => filtros[chave] !== PADRAO[chave])

  const resultado = useMemo(() => {
    const base = arquivos.filter(
      (arquivo) =>
        noLugar(arquivo, lugar) &&
        (filtros.aparece === "todos" || arquivo.aparece.includes(filtros.aparece)) &&
        (filtros.origem === "todos" || arquivo.origem === filtros.origem) &&
        (filtros.status === "todos" || arquivo.status === filtros.status) &&
        noPeriodo(arquivo.data, filtros.periodo),
    )
    if (buscando) return buscar(consulta, base)
    const ordenados = [...base].sort((a, b) => (ordem === "nome" ? a.nome.localeCompare(b.nome, "pt-BR") : ordem === "antigos" ? a.data.localeCompare(b.data) : b.data.localeCompare(a.data)))
    return { arquivos: ordenados, entendidos: [] as Entendido[], afrouxou: [] as string[], ignoradas: [] as string[] }
  }, [arquivos, lugar, filtros, consulta, buscando, ordem])
  const visiveis = resultado.arquivos

  const arquivoAberto = arquivos.find((arquivo) => arquivo.id === aberto) ?? null
  const selecionadosArquivos = arquivos.filter((arquivo) => selecionados.includes(arquivo.id))
  const { titulo, nomeProprio } = nomeDoLugar(lugar)

  const limparBusca = () => {
    setConsulta("")
    setFiltros(PADRAO)
  }
  const irPara = (novo: Lugar) => {
    setLugar(novo)
    limparBusca()
  }

  /* ---------- Ações ---------- */

  const acoes: AcoesArquivo = useMemo(
    () => ({
      baixar: (ids) => {
        const lista = arquivos.filter((arquivo) => ids.includes(arquivo.id))
        notificar(
          lista.length === 1
            ? { titulo: "baixando", texto: `${lista[0].nome}.${lista[0].extensao.toLowerCase()} está a caminho.`, tipo: "sucesso" }
            : { titulo: "baixando", texto: `Juntei os ${lista.length} arquivos num .zip.`, tipo: "sucesso" },
        )
      },
      copiarLink: (arquivo) => {
        navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#${arquivo.id}`)
        notificar({ titulo: "link copiado", texto: "Quem abrir o link vê o arquivo sem precisar de conta.", tipo: "sucesso" })
      },
      favoritar: (id) => setArquivos((atual) => atual.map((arquivo) => (arquivo.id === id ? { ...arquivo, favorito: !arquivo.favorito } : arquivo))),
      mover: (ids, projeto) => {
        setArquivos((atual) => atual.map((arquivo) => (ids.includes(arquivo.id) ? { ...arquivo, projeto } : arquivo)))
        const nome = PROJETOS.find((item) => item.id === projeto)?.nome
        notificar({ titulo: nome ? "movido" : "fora do projeto", texto: nome ? `${ids.length > 1 ? `${ids.length} arquivos foram` : "O arquivo foi"} para ${nome}.` : "O arquivo ficou sem projeto.", tipo: "sucesso" })
        setSelecionados([])
      },
      apagar: (ids) => {
        const antes = arquivos
        setArquivos((atual) => atual.filter((arquivo) => !ids.includes(arquivo.id)))
        setSelecionados([])
        notificar({
          titulo: ids.length > 1 ? `${ids.length} arquivos apagados` : "arquivo apagado",
          texto: "Fica na lixeira por 30 dias.",
          som: "puff",
          acao: { rotulo: "Desfazer", aoClicar: () => setArquivos(antes) },
        })
      },
    }),
    [arquivos],
  )

  /* ---------- Seleção: clique marca; com Shift, marca o intervalo ---------- */

  const alternar = useCallback(
    (id: string, evento?: MouseEvent) => {
      setSelecionados((atual) => {
        if (evento?.shiftKey && ultimoClicado.current) {
          const ids = visiveis.map((arquivo) => arquivo.id)
          const [de, ate] = [ids.indexOf(ultimoClicado.current), ids.indexOf(id)].sort((a, b) => a - b)
          if (de >= 0) return [...new Set([...atual, ...ids.slice(de, ate + 1)])]
        }
        return atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id]
      })
      ultimoClicado.current = id
    },
    [visiveis],
  )

  const abrirOuMarcar = (id: string, evento: MouseEvent) => {
    if (emSelecao || evento.shiftKey || evento.metaKey || evento.ctrlKey) {
      evento.preventDefault()
      alternar(id, evento)
    } else setAberto(id)
  }

  const tirarEntendido = (item: Entendido) => setConsulta((atual) => atual.replace(new RegExp(`\\b${escapar(item.trecho)}\\b`, "i"), " ").replace(/\s+/g, " ").trim())

  const vazia = arquivos.length === 0
  const mostraChips = buscando || filtrosAtivos.length > 0

  return (
    <>
      <ColunaLateral titulo="biblioteca" rotulo="Biblioteca" className="hidden lg:flex">
        <NavBiblioteca arquivos={arquivos} lugar={lugar} aoIr={irPara} />
      </ColunaLateral>

      <Canvas rotulo="Arquivos da biblioteca">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-5">
            <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-borda-sutil pb-3">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <h1 className={cn("min-w-0 font-heading text-titulo-3 font-medium @xl:text-titulo-2", !nomeProprio && "lowercase")}>
                  <span className="hidden truncate lg:block">{titulo}</span>
                  <NavCelular arquivos={arquivos} lugar={lugar} aoIr={irPara}>
                    {titulo}
                  </NavCelular>
                </h1>
                <span className="shrink-0 pt-1 text-sm text-texto-3 tabular-nums">{visiveis.length}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!vazia && (
                  <Botao
                    variante={emSelecao ? "secundario" : "fantasma"}
                    tamanho="sm"
                    aria-label={emSelecao ? "Sair da seleção" : "Selecionar arquivos"}
                    aria-pressed={emSelecao}
                    onClick={() => (emSelecao ? sairDaSelecao() : setSelecionando(true))}
                  >
                    <Check /> <span className="hidden sm:inline">{emSelecao ? "Pronto" : "Selecionar"}</span>
                  </Botao>
                )}
                <Botao variante="secundario" tamanho="sm" aria-label="Enviar arquivos" onClick={() => setEnviando(true)}>
                  <Upload /> <span className="hidden sm:inline">Enviar</span>
                </Botao>
              </div>
            </header>

            {!vazia && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <BuscaBiblioteca campo={campo} consulta={consulta} aoMudar={setConsulta} total={arquivos.length} />
                  <MenuFiltros filtros={filtros} ativos={filtrosAtivos.length} aoMudar={(chave, valor) => setFiltros((atual) => ({ ...atual, [chave]: valor }))} />
                  <MenuOrdem ordem={ordem} aoMudar={setOrdem} desligado={buscando} />
                  <div className="hidden items-center gap-0.5 rounded-full bg-superficie p-1 sm:flex" role="group" aria-label="Como mostrar">
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
                        className={cn("grid size-9 place-items-center rounded-full transition-[background-color] duration-150", vista === valor ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento")}
                      >
                        <Icone className="size-4" strokeWidth={2} aria-hidden />
                      </button>
                    ))}
                  </div>
                </div>

                {mostraChips && (
                  <div className="flex flex-col gap-1.5" aria-live="polite">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {buscando && (
                        <span className="me-0.5 inline-flex items-center gap-1.5 text-xs text-texto-2">
                          <IconeHattie nome="hattie" tamanho={16} className="text-preto" />
                          {resultado.entendidos.some((item) => item.categoria !== "termo" || !resultado.ignoradas.includes(item.valor)) ? "Entendi" : "Procurei pelas palavras"}
                        </span>
                      )}
                      {resultado.entendidos
                        .filter((item) => item.categoria !== "termo" || !resultado.ignoradas.includes(item.valor))
                        .map((item) => (
                          <Chip
                            key={`${item.categoria}-${item.valor}`}
                            rotulo={ROTULO_CATEGORIA[item.categoria]}
                            valor={item.rotulo}
                            cor={item.categoria === "cor" ? item.valor : undefined}
                            aoTirar={() => tirarEntendido(item)}
                          />
                        ))}
                      {filtrosAtivos.map((chave) => (
                        <Chip
                          key={chave}
                          rotulo={OPCOES_FILTRO.find((item) => item.chave === chave)?.rotulo ?? chave}
                          valor={rotuloDoFiltro(chave, filtros[chave])}
                          aoTirar={() => setFiltros((atual) => ({ ...atual, [chave]: PADRAO[chave] }))}
                        />
                      ))}
                      <button type="button" onClick={limparBusca} className="ms-1 text-xs font-medium text-texto-2 underline-offset-4 hover:text-texto hover:underline">
                        Limpar tudo
                      </button>
                    </div>
                    {buscando && visiveis.length > 0 && (resultado.afrouxou.length > 0 || resultado.ignoradas.length > 0) && (
                      <p className="text-xs text-texto-3">
                        {resultado.afrouxou.length > 0 && `Com tudo junto não achei nada, então deixei de fora ${resultado.afrouxou.join(" e ")}. `}
                        {resultado.ignoradas.length > 0 && `Não usei: ${resultado.ignoradas.join(", ")}.`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {vazia ? (
              <Vazio titulo="a biblioteca começa aqui" texto="Tudo que você criar comigo ou receber de parceiros fica guardado aqui. Se já tem fotos e artes, envie que eu organizo.">
                <Botao variante="secundario" tamanho="sm" onClick={() => setEnviando(true)}>
                  <Upload /> Enviar arquivos
                </Botao>
              </Vazio>
            ) : visiveis.length === 0 ? (
              <Vazio titulo="não achei nada assim" texto="Tente com outras palavras, tire um filtro ou procure pelo nome do produto.">
                <Botao variante="secundario" tamanho="sm" onClick={() => irPara("tudo")}>
                  Ver tudo
                </Botao>
              </Vazio>
            ) : buscando || ordem === "nome" ? (
              <Arquivos lista={visiveis} vista={vista} sistema={sistema} selecionados={selecionados} emSelecao={emSelecao} aoClicar={abrirOuMarcar} aoMarcar={alternar} acoes={acoes} />
            ) : (
              <div className="flex flex-col gap-7">
                {agrupar(visiveis).map(([grupo, lista]) => (
                  <section key={grupo} aria-labelledby={`grupo-${grupo}`} className="flex flex-col gap-3">
                    <h2 id={`grupo-${grupo}`} className="flex items-baseline gap-2 text-sm font-semibold">
                      {grupo}
                      <span className="text-xs font-normal text-texto-3 tabular-nums">{lista.length}</span>
                    </h2>
                    <Arquivos lista={lista} vista={vista} sistema={sistema} selecionados={selecionados} emSelecao={emSelecao} aoClicar={abrirOuMarcar} aoMarcar={alternar} acoes={acoes} />
                  </section>
                ))}
              </div>
            )}
          </div>

          {emSelecao && (
            <div className="pointer-events-none sticky bottom-0 z-20 mt-6 flex justify-center pb-1">
              <div role="toolbar" aria-label="Arquivos selecionados" className="pointer-events-auto flex items-center gap-1 rounded-full bg-preto py-1.5 ps-4 pe-1.5 text-branco shadow-(--sombra-flutuante)">
                <span className="me-2 text-sm font-medium whitespace-nowrap tabular-nums">
                  {selecionados.length === 0 ? "Toque nos arquivos" : `${selecionados.length} ${selecionados.length === 1 ? "selecionado" : "selecionados"}`}
                </span>
                {selecionados.length > 0 && (
                  <>
                    <button type="button" onClick={() => acoes.baixar(selecionados)} className="clique inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-lima hover:bg-branco/10">
                      <Download className="size-4" strokeWidth={2} aria-hidden /> Baixar
                    </button>
                    <MenuArquivo arquivos={selecionadosArquivos} acoes={acoes} claro />
                  </>
                )}
                <button type="button" aria-label="Sair da seleção" onClick={sairDaSelecao} className="clique grid size-9 place-items-center rounded-full text-cinza hover:bg-branco/10 hover:text-branco">
                  <X className="size-4" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          )}
        </div>

        <DetalheArquivo
          arquivo={arquivoAberto}
          todos={visiveis}
          sistema={sistema}
          acoes={acoes}
          aoMudar={setAberto}
          aoFiltrar={(qual, valor) => {
            setAberto(null)
            setLugar("tudo")
            if (qual === "aparece") {
              setConsulta("")
              setFiltros({ ...PADRAO, aparece: valor })
            } else {
              setFiltros(PADRAO)
              setConsulta(valor)
            }
          }}
        />

        <JanelaEnviar
          aberta={enviando}
          aoMudar={setEnviando}
          aoGuardar={(imagens, projeto) => {
            const novos: ArquivoBiblioteca[] = imagens.map((imagem) => ({
              id: imagem.id,
              nome: imagem.nome.replace(/\.[a-z0-9]+$/i, ""),
              tipo: "foto",
              descricao: "Foto enviada por você. Ainda estou lendo o que aparece nela.",
              formato: "Imagem enviada",
              extensao: /\.png$/i.test(imagem.nome) ? "PNG" : "JPG",
              tamanho: "—",
              data: HOJE_BIBLIOTECA,
              origem: "voce",
              projeto: projeto || undefined,
              aparece: [],
              tags: ["enviada"],
              cores: [],
              status: "aprovado",
              previa: { tipo: "enviada", url: imagem.url },
            }))
            setArquivos((atual) => [...novos, ...atual])
            irPara(projeto ? `projeto:${projeto}` : "tudo")
            notificar({ titulo: "guardado", texto: `${novos.length > 1 ? `Guardei ${novos.length} arquivos` : "Guardei o arquivo"}. Agora eu descrevo o que aparece em cada um, para a busca achar.`, tipo: "sucesso" })
          }}
        />
      </Canvas>
    </>
  )
}

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function agrupar(lista: ArquivoBiblioteca[]) {
  const grupos = new Map<string, ArquivoBiblioteca[]>()
  lista.forEach((arquivo) => {
    const grupo = grupoDaData(arquivo.data)
    grupos.set(grupo, [...(grupos.get(grupo) ?? []), arquivo])
  })
  return [...grupos]
}

function Vazio({ titulo, texto, children }: { titulo: string; texto: string; children?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-3xl bg-superficie px-6 py-12 text-center">
      <IconeHattie nome="hattie" tamanho={44} className="text-preto" />
      <p className="font-heading text-titulo-3 font-medium lowercase">{titulo}</p>
      <p className="max-w-sm text-sm text-texto-2">{texto}</p>
      {children}
    </div>
  )
}

/* ---------- Navegação: onde olhar ---------- */

type PropsNav = { arquivos: ArquivoBiblioteca[]; lugar: Lugar; aoIr: (lugar: Lugar) => void }

function usarSecoesNav(arquivos: ArquivoBiblioteca[]) {
  const conta = (lugar: Lugar) => arquivos.filter((arquivo) => noLugar(arquivo, lugar)).length
  return [
    {
      id: "inicio",
      itens: [
        { lugar: "tudo", rotulo: "Tudo", icone: Library, quantidade: arquivos.length },
        { lugar: "favoritos", rotulo: "Favoritos", icone: Star, quantidade: conta("favoritos") },
      ],
    },
    {
      id: "tipos",
      titulo: "Tipos",
      itens: ORDEM_TIPOS.map((tipo) => ({ lugar: `tipo:${tipo}`, rotulo: TIPOS_ARQUIVO[tipo].plural, icone: ICONE_TIPO[tipo], quantidade: conta(`tipo:${tipo}`) })).filter((item) => item.quantidade > 0),
    },
    {
      id: "projetos",
      titulo: "Projetos",
      itens: [
        ...PROJETOS.map((projeto) => ({ lugar: `projeto:${projeto.id}`, rotulo: projeto.nome, icone: Folder, quantidade: conta(`projeto:${projeto.id}`) })),
        { lugar: "projeto:sem", rotulo: "Sem projeto", icone: FolderOpen, quantidade: conta("projeto:sem") },
      ].filter((item) => item.quantidade > 0),
    },
  ].filter((secao) => secao.itens.length > 0)
}

function NavBiblioteca({ arquivos, lugar, aoIr }: PropsNav) {
  const secoes = usarSecoesNav(arquivos)
  return (
    <nav aria-label="Lugares da biblioteca" className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1">
      {secoes.map((secao) => (
        <div key={secao.id} className="flex flex-col gap-0.5">
          {secao.titulo && <h3 className="px-3 pb-1 text-xs text-texto-3">{secao.titulo}</h3>}
          {secao.itens.map((item) => {
            const atual = lugar === item.lugar
            return (
              <button
                key={item.lugar}
                type="button"
                aria-current={atual ? "page" : undefined}
                onClick={() => aoIr(item.lugar)}
                className={cn("flex h-9 items-center gap-2.5 rounded-full px-3 text-start text-sm", atual ? "bg-lima-suave font-medium" : "text-texto-2 hover:bg-preenchimento hover:text-texto")}
              >
                <item.icone className={cn("size-4 shrink-0", item.lugar === "favoritos" && atual && "fill-current")} strokeWidth={atual ? 2.25 : 1.75} aria-hidden />
                <span className="flex-1 truncate">{item.rotulo}</span>
                <span className="text-xs text-texto-3 tabular-nums">{item.quantidade}</span>
              </button>
            )
          })}
        </div>
      ))}
      <div className="mt-auto flex flex-col gap-2 rounded-2xl bg-preenchimento p-3">
        <p className="flex items-baseline justify-between text-xs">
          <span className="font-semibold">Espaço usado</span>
          <span className="text-texto-2 tabular-nums">1,4 de 10 GB</span>
        </p>
        <span className="h-1.5 overflow-hidden rounded-full bg-preenchimento-ativo" role="img" aria-label="14% do espaço usado">
          <span className="block h-full w-[14%] rounded-full bg-texto" />
        </span>
      </div>
    </nav>
  )
}

/** No celular (sem a coluna), o título vira o botão que troca de lugar. */
function NavCelular({ arquivos, lugar, aoIr, children }: PropsNav & { children: ReactNode }) {
  const secoes = usarSecoesNav(arquivos)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex max-w-full min-w-0 items-center gap-1.5 rounded-full text-start hover:bg-superficie lg:hidden">
        <span className="truncate">{children}</span>
        <ChevronDown className="size-5 shrink-0 text-texto-2" strokeWidth={2} aria-hidden />
        <span className="sr-only">, trocar o que ver</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[70svh] w-64 overflow-y-auto rounded-2xl p-1">
        <DropdownMenuRadioGroup value={lugar} onValueChange={aoIr}>
          {secoes.map((secao, indice) => (
            <DropdownMenuGroup key={secao.id}>
              {indice > 0 && <DropdownMenuSeparator />}
              {secao.titulo && <DropdownMenuLabel className="text-xs font-medium text-texto-3">{secao.titulo}</DropdownMenuLabel>}
              {secao.itens.map((item) => (
                <DropdownMenuRadioItem key={item.lugar} value={item.lugar} className="gap-2">
                  <span className="flex-1 truncate">{item.rotulo}</span>
                  <span className="text-xs text-texto-3 tabular-nums">{item.quantidade}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- Barra: busca, filtros, ordem ---------- */

/** Campo de busca por frase. Vazio e com foco, abre exemplos logo abaixo. */
function BuscaBiblioteca({ campo, consulta, aoMudar, total }: { campo: RefObject<HTMLInputElement | null>; consulta: string; aoMudar: (valor: string) => void; total: number }) {
  const [focado, setFocado] = useState(false)
  const caixa = useRef<HTMLFormElement>(null)
  const abertos = focado && !consulta
  return (
    <form
      ref={caixa}
      role="search"
      onSubmit={(evento: FormEvent) => evento.preventDefault()}
      onFocus={() => setFocado(true)}
      onBlur={(evento) => !caixa.current?.contains(evento.relatedTarget as Node) && setFocado(false)}
      className="relative min-w-0 flex-1"
    >
      <label htmlFor="busca-biblioteca" className="sr-only">
        Buscar na biblioteca
      </label>
      <p id="dica-busca-biblioteca" className="sr-only">
        Busca entre {total} arquivos. Escreva como fala, por exemplo: fotos do pequi em fundo verde.
      </p>
      <div className={cn("flex h-11 items-center gap-2.5 rounded-full bg-superficie ps-4 pe-1.5 transition-[box-shadow] duration-150", focado && "shadow-(--sombra-flutuante)")}>
        <Search className="size-4 shrink-0 text-texto-3" strokeWidth={2} aria-hidden />
        <input
          ref={campo}
          id="busca-biblioteca"
          type="search"
          value={consulta}
          onChange={(evento) => aoMudar(evento.target.value)}
          onKeyDown={(evento) => evento.key === "Escape" && (consulta ? aoMudar("") : evento.currentTarget.blur())}
          placeholder="Descreva o que procura"
          aria-describedby="dica-busca-biblioteca"
          autoComplete="off"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-texto-3 [&::-webkit-search-cancel-button]:hidden"
        />
        {consulta ? (
          <Botao variante="fantasma" tamanho="icone-sm" aria-label="Limpar busca" onClick={() => aoMudar("")}>
            <X />
          </Botao>
        ) : (
          <kbd className="me-1.5 hidden h-6 min-w-6 place-items-center rounded-md bg-preenchimento px-1.5 font-sans text-xs text-texto-3 md:grid" title="Aperte / para buscar">
            /
          </kbd>
        )}
      </div>
      {abertos && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 flex flex-col gap-1 rounded-3xl bg-superficie p-2 shadow-(--sombra-flutuante)">
          <p className="flex items-center gap-1.5 px-2.5 pt-1 pb-1.5 text-xs text-texto-3">
            <IconeHattie nome="hattie" tamanho={14} className="text-texto-3" />
            Escreva como você fala. Por exemplo:
          </p>
          {SUGESTOES_BUSCA.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              onClick={() => {
                aoMudar(sugestao)
                campo.current?.focus()
              }}
              className="flex h-9 items-center gap-2.5 rounded-full px-2.5 text-start text-sm hover:bg-preenchimento"
            >
              <Search className="size-3.5 text-texto-3" strokeWidth={2} aria-hidden />
              {sugestao}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}

const ROTULO_CATEGORIA: Record<Entendido["categoria"], string> = {
  tipo: "Tipo",
  aparece: "Quem aparece",
  cor: "Cor",
  periodo: "Data",
  origem: "Feito por",
  parceiro: "Parceiro",
  status: "Situação",
  projeto: "Projeto",
  termo: "Palavra",
}

/** O que está valendo na busca ou nos filtros. Tirar a pílula tira o critério. */
function Chip({ rotulo, valor, cor, aoTirar }: { rotulo: string; valor: string; cor?: string; aoTirar: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-superficie ps-2.5 pe-0.5 text-xs">
      {cor && <span aria-hidden className="size-3 rounded-full" style={{ backgroundColor: cor }} />}
      <span className="text-texto-3">{rotulo}</span>
      <span className="font-medium">{valor}</span>
      <button type="button" aria-label={`Tirar ${valor}`} onClick={aoTirar} className="grid size-6 place-items-center rounded-full text-texto-3 hover:bg-preenchimento hover:text-texto">
        <X className="size-3" strokeWidth={2.25} />
      </button>
    </span>
  )
}

/** Um botão só para todos os filtros; cada grupo abre ao lado. A quantidade de filtros ligados aparece no botão. */
function MenuFiltros({ filtros, ativos, aoMudar }: { filtros: Filtros; ativos: number; aoMudar: (chave: keyof Filtros, valor: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "clique inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm transition-[background-color] duration-150",
          ativos ? "bg-lima font-medium text-preto" : "bg-superficie text-texto hover:bg-preenchimento-hover",
        )}
      >
        <SlidersHorizontal className="size-4" strokeWidth={2} aria-hidden />
        <span className="hidden sm:inline">Filtros</span>
        {ativos > 0 && <span className="grid size-5 place-items-center rounded-full bg-preto text-micro font-semibold text-lima tabular-nums">{ativos}</span>}
        <span className="sr-only sm:hidden">Filtros</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1">
        {OPCOES_FILTRO.map((filtro) => {
          const valor = filtros[filtro.chave]
          return (
            <DropdownMenuSub key={filtro.chave}>
              <DropdownMenuSubTrigger className="h-10 gap-2 rounded-xl px-2.5 text-sm">
                <span className="flex-1">{filtro.rotulo}</span>
                {valor !== PADRAO[filtro.chave] && <span className="max-w-24 truncate text-xs text-texto-3">{rotuloDoFiltro(filtro.chave, valor)}</span>}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="max-h-80 w-60 overflow-y-auto rounded-2xl p-1">
                <DropdownMenuRadioGroup value={valor} onValueChange={(novo) => aoMudar(filtro.chave, novo)}>
                  <DropdownMenuRadioItem value="todos">Qualquer um</DropdownMenuRadioItem>
                  {filtro.grupos.map((grupo, indice) => (
                    <DropdownMenuGroup key={grupo.rotulo ?? indice}>
                      <DropdownMenuSeparator />
                      {grupo.rotulo && <DropdownMenuLabel className="text-xs font-medium text-texto-3">{grupo.rotulo}</DropdownMenuLabel>}
                      {grupo.opcoes.map((opcao) => (
                        <DropdownMenuRadioItem key={opcao.valor} value={opcao.valor}>
                          {opcao.rotulo}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuGroup>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Ordem. Com busca, a ordem é a relevância e o botão fica desligado. */
function MenuOrdem({ ordem, aoMudar, desligado }: { ordem: Ordem; aoMudar: (ordem: Ordem) => void; desligado: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={desligado}
        title={desligado ? "Na busca, o mais parecido vem primeiro" : undefined}
        className="clique inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-superficie px-3.5 text-sm transition-[background-color] duration-150 hover:bg-preenchimento-hover disabled:opacity-50"
      >
        <ArrowUpDown className="size-4" strokeWidth={2} aria-hidden />
        <span className="hidden @3xl:inline">{desligado ? "Mais parecidos" : OPCOES_ORDEM.find((opcao) => opcao.valor === ordem)?.rotulo}</span>
        <span className="sr-only @3xl:hidden">Ordenar</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1">
        <DropdownMenuLabel className="text-xs font-medium text-texto-3">Ordenar</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={ordem} onValueChange={(valor) => aoMudar(valor as Ordem)}>
          {OPCOES_ORDEM.map((opcao) => (
            <DropdownMenuRadioItem key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------- Grade e lista ---------- */

type PropsArquivos = {
  lista: ArquivoBiblioteca[]
  vista: "grade" | "lista"
  sistema: SistemaMarca
  selecionados: string[]
  emSelecao: boolean
  aoClicar: (id: string, evento: MouseEvent) => void
  aoMarcar: (id: string, evento?: MouseEvent) => void
  acoes: AcoesArquivo
}

function Arquivos({ lista, vista, sistema, selecionados, emSelecao: modoSelecao, aoClicar, aoMarcar, acoes }: PropsArquivos) {
  if (vista === "lista")
    return (
      <ul className="flex flex-col overflow-hidden rounded-3xl bg-superficie p-1.5">
        {lista.map((arquivo) => {
          const marcado = selecionados.includes(arquivo.id)
          const projeto = PROJETOS.find((item) => item.id === arquivo.projeto)
          return (
            <li key={arquivo.id} className={cn("group/linha relative flex items-center gap-3 rounded-2xl p-1.5 pe-2", marcado ? "bg-acao-suave" : "hover:bg-preenchimento")}>
              <Marcador marcado={marcado} visivel={modoSelecao} nome={arquivo.nome} aoMarcar={(evento) => aoMarcar(arquivo.id, evento)} />
              <span className="h-11 w-15 shrink-0 overflow-hidden rounded-lg">
                <PreviaArquivo arquivo={arquivo} sistema={sistema} />
              </span>
              <button type="button" onClick={(evento) => aoClicar(arquivo.id, evento)} className="flex min-w-0 flex-1 flex-col text-start after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-texto">
                <span className="truncate text-sm font-medium">{arquivo.nome}</span>
                <span className="truncate text-xs text-texto-3">
                  {TIPOS_ARQUIVO[arquivo.tipo].rotulo} · {arquivo.formato}
                </span>
              </button>
              <span className="hidden w-44 truncate text-xs text-texto-2 @3xl:block">{projeto?.nome ?? "Sem projeto"}</span>
              <span className="hidden w-36 truncate text-xs text-texto-2 @4xl:block">{feitoPor(arquivo)}</span>
              <span className="w-14 shrink-0 text-end text-xs text-texto-3 tabular-nums">{dataCurta(arquivo.data)}</span>
              <span className="relative z-10">
                <MenuArquivo arquivos={[arquivo]} acoes={acoes} />
              </span>
            </li>
          )
        })}
      </ul>
    )

  return (
    <ul className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5">
      {lista.map((arquivo) => {
        const marcado = selecionados.includes(arquivo.id)
        return (
          <li key={arquivo.id} className="min-w-0">
            <article className={cn("group/card relative flex h-full flex-col gap-2 rounded-3xl p-1.5 transition-[background-color,box-shadow] duration-150", marcado ? "bg-acao-suave" : "bg-superficie hover:shadow-(--sombra-flutuante)")}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <PreviaArquivo arquivo={arquivo} sistema={sistema} className="transition-[scale] duration-300 ease-(--ease-saida) group-hover/card:scale-[1.03] motion-reduce:group-hover/card:scale-100" />
                <span className="absolute top-2 left-2 z-10">
                  <Marcador marcado={marcado} visivel={modoSelecao} nome={arquivo.nome} aoMarcar={(evento) => aoMarcar(arquivo.id, evento)} sobreImagem />
                </span>
                <button
                  type="button"
                  aria-pressed={!!arquivo.favorito}
                  aria-label={arquivo.favorito ? `Tirar ${arquivo.nome} dos favoritos` : `Favoritar ${arquivo.nome}`}
                  onClick={() => acoes.favoritar(arquivo.id)}
                  className={cn(
                    "absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full bg-superficie/90 text-texto transition-opacity duration-150 hover:bg-superficie",
                    arquivo.favorito ? "opacity-100" : "opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 pointer-coarse:hidden",
                  )}
                >
                  <Star className={cn("size-4", arquivo.favorito && "fill-current")} strokeWidth={2} />
                </button>
              </div>
              <div className="flex min-w-0 flex-col px-1.5 pb-1">
                <button
                  type="button"
                  onClick={(evento) => aoClicar(arquivo.id, evento)}
                  className="line-clamp-2 text-start text-sm leading-snug font-medium after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto"
                >
                  {arquivo.nome}
                </button>
                <span className="flex items-center gap-1.5 truncate text-xs text-texto-3">
                  {TIPOS_ARQUIVO[arquivo.tipo].rotulo}
                  <span aria-hidden>·</span>
                  {dataCurta(arquivo.data)}
                  {arquivo.status === "rascunho" && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-texto-2">rascunho</span>
                    </>
                  )}
                </span>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}

/** Caixa de marcar do card. Aparece no hover, no foco ou quando há seleção. */
function Marcador({ marcado, visivel, nome, aoMarcar, sobreImagem = false }: { marcado: boolean; visivel: boolean; nome: string; aoMarcar: (evento: MouseEvent) => void; sobreImagem?: boolean }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={marcado}
      aria-label={`Selecionar ${nome}`}
      onClick={(evento) => {
        evento.stopPropagation()
        aoMarcar(evento)
      }}
      className={cn(
        "relative z-10 grid size-7 shrink-0 place-items-center rounded-full transition-[opacity,background-color] duration-150",
        marcado ? "bg-lima text-preto opacity-100" : cn(sobreImagem ? "bg-superficie/90 text-transparent hover:text-texto-3" : "bg-preenchimento-hover text-transparent hover:text-texto-3"),
        !marcado && !visivel && "opacity-0 group-hover/card:opacity-100 group-hover/linha:opacity-100 focus-visible:opacity-100 pointer-coarse:hidden",
      )}
    >
      <Check className="size-4" strokeWidth={2.5} />
    </button>
  )
}

/* ---------- Enviar ---------- */

function JanelaEnviar({ aberta, aoMudar, aoGuardar }: { aberta: boolean; aoMudar: (aberta: boolean) => void; aoGuardar: (imagens: ImagemEnviada[], projeto: string) => void }) {
  const [imagens, setImagens] = useState<ImagemEnviada[]>([])
  const [projeto, setProjeto] = useState("")
  return (
    <Janela
      aberta={aberta}
      aoMudar={aoMudar}
      largura="lg"
      titulo="enviar arquivos"
      descricao="Fotos, artes e documentos que você já tem. Eu descrevo cada um para a busca achar depois."
      rodape={
        <div className="flex w-full justify-end gap-2">
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Cancelar
          </Botao>
          <Plimm
            icone={Upload}
            rotulo="guardar na biblioteca"
            disabled={!imagens.length}
            onClick={() => {
              aoGuardar(imagens, projeto)
              setImagens([])
              setProjeto("")
              aoMudar(false)
            }}
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <EnvioImagens imagens={imagens} aoMudar={setImagens} rotulo="Arquivos" dica="Arraste para cá ou escolha do computador." />
        <CampoLista
          name="projeto-envio"
          rotulo="Guardar no projeto"
          dica="Opcional"
          value={projeto}
          onChange={(evento) => setProjeto(evento.target.value)}
          opcoes={[{ valor: "", rotulo: "Sem projeto" }, ...PROJETOS.map((item) => ({ valor: item.id, rotulo: item.nome }))]}
        />
      </div>
    </Janela>
  )
}
