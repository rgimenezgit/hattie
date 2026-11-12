"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ChevronDown, UserRoundSearch, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Botao } from "@/components/hattie/Botao"
import { Plimm } from "@/components/hattie/Plimm"
import { Busca } from "@/components/hattie/Busca"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { cn } from "@/lib/utils"
import { ESPECIALIDADES, FAIXAS, PARCEIROS, PESSOA, type EspecialidadeParceiro, type Parceiro } from "@/lib/mock"
import { CabecalhoBloco } from "../Blocos"
import { useEstado } from "../Estado"
import { Canvas } from "../Layout"
import { CartaoParceiro } from "./Comuns"
import { TopoParceiros } from "./ShellParceiros"

const SUGESTOES = [
  { rotulo: "Ensaio de fotos", texto: "Quero um ensaio de fotos dos produtos no estilo Origem natural, para o site e o Instagram. Até R$ 2.500, ainda este mês." },
  { rotulo: "Rótulo novo", texto: "Preciso do rótulo do óleo de baru seguindo o do pequi, com arquivo pronto para a gráfica." },
  { rotulo: "Posts do mês", texto: "Quero alguém para cuidar dos posts de dezembro, com legendas na voz da marca. Até R$ 1.000." },
  { rotulo: "Vídeo de lançamento", texto: "Quero um vídeo curto de lançamento do kit de Natal para reels e stories." },
  { rotulo: "Loja virtual", texto: "Quero uma loja virtual simples para vender os kits, com a cara da marca." },
]

const PALAVRAS: [RegExp, EspecialidadeParceiro][] = [
  [/foto|ensaio/i, "Fotografia"],
  [/logo|símbolo|simbolo/i, "Logo e marca"],
  [/embala|rótulo|rotulo|caixa/i, "Embalagem"],
  [/post|instagram|rede|social|stories/i, "Social media"],
  [/site|loja virtual|página|pagina|e-commerce/i, "Site"],
  [/vídeo|video|reels|anima|motion/i, "Motion"],
  [/ilustra|desenho|padrão|padrao/i, "Ilustração"],
  [/texto|legenda|copy|e-mail|email/i, "Texto e copy"],
  [/nome|naming/i, "Naming"],
  [/estratégia|estrategia|posicionamento/i, "Estratégia de marca"],
]

type Indicacao = { parceiro: Parceiro; motivo: string }

/** Lê o pedido como o Hattie faria: serviços citados, orçamento e afinidade com o nicho da marca. */
function indicar(pedido: string): { lista: Indicacao[]; entendeu: EspecialidadeParceiro[] } {
  // "para o site e o Instagram" diz onde a peça vai ser usada, e fica fora da leitura do serviço.
  const destino = /\b(para|no|na|nos|nas|pelo|pela|em)\s+(o\s+|a\s+|os\s+|as\s+)?(site|instagram|redes?(\s+sociais)?|e-mail|stories)((\s*,\s*|\s+e\s+)(o\s+|a\s+|os\s+|as\s+)?(site|instagram|redes?(\s+sociais)?|e-mail|stories))*/gi
  const servico = pedido.replace(destino, " ")
  const entendeu = PALAVRAS.filter(([regra]) => regra.test(servico)).map(([, especialidade]) => especialidade)
  const valor = Number(pedido.match(/R\$\s*([\d.]+)/)?.[1]?.replace(/\./g, "") ?? 0)
  const pontuar = (parceiro: Parceiro) =>
    parceiro.especialidades.filter((item) => entendeu.includes(item)).length * 10 +
    parceiro.nota +
    (parceiro.disponivel ? 2 : -6) +
    (parceiro.nichos.some((nicho) => /cosm/i.test(nicho)) ? 1.5 : 0) +
    (valor && valor <= 1500 && parceiro.faixa === 1 ? 3 : 0) +
    (valor && valor <= 3000 && parceiro.faixa === 3 ? -2 : 0)
  const lista = [...PARCEIROS]
    .sort((a, b) => pontuar(b) - pontuar(a))
    .slice(0, 3)
    .map((parceiro) => {
      const faz = parceiro.especialidades.find((item) => entendeu.includes(item)) ?? parceiro.especialidades[0]
      const nicho = parceiro.nichos.find((item) => /cosm/i.test(item)) ?? parceiro.nichos[0]
      return { parceiro, motivo: `Faz ${faz.toLowerCase()}, já atendeu ${nicho.toLowerCase()} e responde ${parceiro.resposta}.` }
    })
  return { lista, entendeu }
}

type Filtros = { especialidade: string; faixa: string; nota: string; onde: string; ordem: string }
const PADRAO: Filtros = { especialidade: "todas", faixa: "todas", nota: "todas", onde: "todos", ordem: "relevancia" }

const OPCOES = {
  especialidade: [{ valor: "todas", rotulo: "Todas" }, ...ESPECIALIDADES.map((item) => ({ valor: item, rotulo: item }))],
  faixa: [{ valor: "todas", rotulo: "Todos" }, ...([1, 2, 3] as const).map((faixa) => ({ valor: String(faixa), rotulo: `${FAIXAS[faixa].rotulo} · ${FAIXAS[faixa].texto}` }))],
  nota: [
    { valor: "todas", rotulo: "Todas" },
    { valor: "4.5", rotulo: "4,5 ou mais" },
    { valor: "4.8", rotulo: "4,8 ou mais" },
  ],
  onde: [
    { valor: "todos", rotulo: "Qualquer lugar" },
    { valor: "perto", rotulo: "Perto de você" },
    { valor: "brasil", rotulo: "No Brasil" },
    { valor: "fora", rotulo: "Fora do Brasil" },
  ],
  ordem: [
    { valor: "relevancia", rotulo: "Relevância" },
    { valor: "nota", rotulo: "Maior nota" },
    { valor: "preco", rotulo: "Menor preço" },
    { valor: "projetos", rotulo: "Mais projetos" },
  ],
}

const ROTULOS: Record<keyof Filtros, string> = { especialidade: "Especialidade", faixa: "Preço", nota: "Nota", onde: "Onde", ordem: "Ordenar" }

const perto = (parceiro: Parceiro) => parceiro.cidade.endsWith("SP")

function filtrar(lista: Parceiro[], termo: string, filtros: Filtros) {
  const busca = termo.trim().toLowerCase()
  const resultado = lista.filter(
    (parceiro) =>
      (!busca || [parceiro.nome, parceiro.titulo, parceiro.cidade, parceiro.pais, ...parceiro.especialidades, ...parceiro.nichos].join(" ").toLowerCase().includes(busca)) &&
      (filtros.especialidade === "todas" || parceiro.especialidades.includes(filtros.especialidade as EspecialidadeParceiro)) &&
      (filtros.faixa === "todas" || parceiro.faixa === Number(filtros.faixa)) &&
      (filtros.nota === "todas" || parceiro.nota >= Number(filtros.nota)) &&
      (filtros.onde === "todos" || (filtros.onde === "perto" ? perto(parceiro) : filtros.onde === "brasil" ? parceiro.pais === "Brasil" : parceiro.pais !== "Brasil")),
  )
  const ordem: Record<string, (a: Parceiro, b: Parceiro) => number> = {
    relevancia: (a, b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque)) || b.nota - a.nota,
    nota: (a, b) => b.nota - a.nota || b.avaliacoes - a.avaliacoes,
    preco: (a, b) => a.faixa - b.faixa || (a.preco.valor ?? 99999) - (b.preco.valor ?? 99999),
    projetos: (a, b) => b.projetos - a.projetos,
  }
  return resultado.sort(ordem[filtros.ordem])
}

/**
 * Contratar: o Hattie apresenta a área e lê o pedido para indicar três parceiros; depois, busca e filtros
 * (especialidade, preço, nota, lugar e ordem) e listas por recorte: destaque, o que falta na marca, perto e orçamento.
 */
export function ContratarParceiros() {
  const { nomeMarca } = useEstado()
  const [pedido, setPedido] = useState("")
  const [lendo, setLendo] = useState(false)
  const [indicacao, setIndicacao] = useState<ReturnType<typeof indicar> | null>(null)
  const [busca, setBusca] = useState("")
  const [filtros, setFiltros] = useState<Filtros>(PADRAO)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listaRef = useRef<HTMLElement>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const filtrando = busca.trim() !== "" || (Object.keys(PADRAO) as (keyof Filtros)[]).some((chave) => chave !== "ordem" && filtros[chave] !== PADRAO[chave])
  const resultados = filtrar(PARCEIROS, busca, filtros)

  function encontrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!pedido.trim()) return
    setLendo(true)
    setIndicacao(null)
    timer.current = setTimeout(() => {
      setIndicacao(indicar(pedido))
      setLendo(false)
    }, 1400)
  }

  function verTodos(mudanca: Partial<Filtros>) {
    setFiltros({ ...PADRAO, ...mudanca })
    requestAnimationFrame(() => listaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  const recortes = [
    { id: "destaque", titulo: "em destaque", texto: "Notas mais altas e muitos projetos entregues", lista: filtrar(PARCEIROS.filter((p) => p.destaque), "", { ...PADRAO, ordem: "nota" }), ver: { nota: "4.8" } },
    {
      id: "falta",
      titulo: "para o que falta na marca",
      texto: "O estilo fotográfico e a ilustração estão prontos para virar ensaio, rótulo e vídeo",
      lista: filtrar(PARCEIROS.filter((p) => p.especialidades.some((item) => ["Fotografia", "Embalagem", "Ilustração", "Motion"].includes(item))), "", { ...PADRAO, ordem: "nota" }),
    },
    { id: "perto", titulo: "perto de você", texto: "Parceiros em São Paulo, para ir até a produção", lista: filtrar(PARCEIROS.filter(perto), "", PADRAO), ver: { onde: "perto" } },
    { id: "orcamento", titulo: "cabem no orçamento", texto: "Preços de entrada, ótimos para as peças do dia a dia", lista: filtrar(PARCEIROS.filter((p) => p.faixa === 1), "", { ...PADRAO, ordem: "preco" }), ver: { faixa: "1" } },
  ]

  return (
    <Canvas rotulo="Contratar um parceiro">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-10">
          <TopoParceiros titulo="contratar um parceiro" />

          <section aria-labelledby="titulo-hattie-parceiros" className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
            <div className="flex flex-col items-start gap-3 sm:flex-row md:gap-4">
              <IconeHattie nome="hattie" tamanho={44} className="shrink-0 text-preto" />
              <div className="flex max-w-[64ch] flex-col gap-1.5">
                <h2 id="titulo-hattie-parceiros" className="font-heading text-titulo-3 font-medium lowercase md:text-titulo-2">
                  precisa de uma mão na marca, {PESSOA.nome.toLowerCase()}?
                </h2>
                <p className="text-sm text-texto-2">
                  Designers, fotógrafos e estrategistas para construir a {nomeMarca} ou cuidar dela no dia a dia. Me conta o que você precisa e eu indico os três que mais combinam
                  com a marca.
                </p>
              </div>
            </div>

            <form onSubmit={encontrar} className="flex flex-col gap-3 rounded-2xl bg-preenchimento p-3 transition-[background-color] duration-150 focus-within:bg-preenchimento-hover">
              <label htmlFor="pedido-parceiro" className="sr-only">
                O que você precisa
              </label>
              <textarea
                id="pedido-parceiro"
                value={pedido}
                onChange={(evento) => setPedido(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" && (evento.metaKey || evento.ctrlKey)) evento.currentTarget.form?.requestSubmit()
                }}
                rows={3}
                placeholder="Ex.: Quero um ensaio de fotos dos produtos no estilo Origem natural, para o site e o Instagram. Até R$ 2.500, ainda este mês."
                className="field-sizing-content max-h-48 min-h-20 resize-none bg-transparent px-1.5 py-1 text-sm leading-relaxed outline-none placeholder:text-texto-3"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pedidos prontos">
                  {SUGESTOES.map((sugestao) => (
                    <button
                      key={sugestao.rotulo}
                      type="button"
                      onClick={() => setPedido(sugestao.texto)}
                      className="clique h-8 rounded-full bg-superficie px-3 text-detalhe transition-[background-color] duration-150 hover:bg-preenchimento-hover"
                    >
                      {sugestao.rotulo}
                    </button>
                  ))}
                </div>
                <Plimm type="submit" icone={UserRoundSearch} rotulo="encontrar parceiros" disabled={!pedido.trim()} carregando={lendo} className="shrink-0 self-end" />
              </div>
            </form>

            {lendo && (
              <div aria-live="polite" className="flex items-center gap-3 text-sm">
                <IconeHattie nome="asterisco" tamanho={18} className="animate-spin [animation-duration:1.4s] motion-reduce:animate-none" />
                <span>
                  <span className="font-semibold">Lendo o pedido e o cérebro da {nomeMarca}.</span> <span className="text-texto-2">Já separo três nomes.</span>
                </span>
              </div>
            )}
          </section>

          {indicacao && (
            <section aria-labelledby="titulo-indicados" className="flex flex-col gap-3">
              <CabecalhoBloco id="titulo-indicados" titulo="indicados para você" quantidade={indicacao.lista.length}>
                <Botao variante="fantasma" tamanho="sm" onClick={() => setIndicacao(null)}>
                  <X /> Limpar
                </Botao>
              </CabecalhoBloco>
              <p className="flex items-start gap-2 text-sm text-texto-2">
                <IconeHattie nome="hattie" tamanho={20} className="shrink-0 text-preto" />
                {indicacao.entendeu.length
                  ? `Entendi que você precisa de ${indicacao.entendeu.map((item) => item.toLowerCase()).join(" e ")}. Escolhi pela especialidade, pela nota e por quem já atendeu marcas como a sua.`
                  : "Não achei um serviço claro no pedido, então separei os parceiros mais bem avaliados. Me conta um pouco mais para eu acertar."}
              </p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
                {indicacao.lista.map(({ parceiro, motivo }) => (
                  <li key={parceiro.id} className="flex min-w-0">
                    <CartaoParceiro parceiro={parceiro} motivo={motivo} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section ref={listaRef} aria-labelledby="titulo-todos-parceiros" className="flex scroll-mt-4 flex-col gap-4">
            <CabecalhoBloco id="titulo-todos-parceiros" titulo={filtrando ? "parceiros encontrados" : "todos os parceiros"} quantidade={filtrando ? resultados.length : PARCEIROS.length} />
            <div className="flex flex-col gap-2 @3xl:flex-row @3xl:items-center">
              <Busca valor={busca} aoMudar={setBusca} rotulo="Buscar parceiros" placeholder="Nome, serviço ou cidade" className="h-9 w-full @3xl:w-72" />
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 @3xl:mx-0 @3xl:px-0" role="group" aria-label="Filtros">
                {(Object.keys(OPCOES) as (keyof Filtros)[]).map((chave) => (
                  <Filtro
                    key={chave}
                    rotulo={ROTULOS[chave]}
                    valor={filtros[chave]}
                    padrao={PADRAO[chave]}
                    opcoes={OPCOES[chave]}
                    aoMudar={(valor) => setFiltros((atual) => ({ ...atual, [chave]: valor }))}
                  />
                ))}
                {filtrando && (
                  <Botao
                    variante="fantasma"
                    tamanho="sm"
                    className="shrink-0"
                    onClick={() => {
                      setFiltros(PADRAO)
                      setBusca("")
                    }}
                  >
                    <X /> Limpar
                  </Botao>
                )}
              </div>
            </div>

            {filtrando ? (
              resultados.length ? (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4">
                  {resultados.map((parceiro) => (
                    <li key={parceiro.id} className="flex min-w-0">
                      <CartaoParceiro parceiro={parceiro} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p role="status" className="rounded-3xl bg-superficie p-6 text-sm text-texto-2">
                  Nenhum parceiro com esses filtros. Tente tirar um deles ou me conte o que você precisa lá em cima.
                </p>
              )
            ) : (
              <div className="flex flex-col gap-8">
                {recortes.map((recorte) => (
                  <section key={recorte.id} aria-labelledby={`recorte-${recorte.id}`} className="flex flex-col gap-3">
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex min-w-0 flex-col">
                        <h3 id={`recorte-${recorte.id}`} className="flex items-baseline gap-2 font-heading text-base font-medium lowercase">
                          {recorte.titulo}
                          <span className="font-sans text-xs text-texto-3 tabular-nums">{recorte.lista.length}</span>
                        </h3>
                        <p className="text-xs text-texto-2">{recorte.texto}</p>
                      </div>
                      {recorte.ver && (
                        <Botao variante="fantasma" tamanho="sm" className="shrink-0" onClick={() => verTodos(recorte.ver)}>
                          Ver todos
                        </Botao>
                      )}
                    </div>
                    <ul className="no-scrollbar -mx-4 flex scroll-px-4 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 md:-mx-6 md:scroll-px-6 md:px-6" aria-label={recorte.titulo}>
                      {recorte.lista.map((parceiro) => (
                        <li key={parceiro.id} className="flex w-[17.5rem] shrink-0 snap-start">
                          <CartaoParceiro parceiro={parceiro} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Canvas>
  )
}

function Filtro({
  rotulo,
  valor,
  padrao,
  opcoes,
  aoMudar,
}: {
  rotulo: string
  valor: string
  padrao: string
  opcoes: { valor: string; rotulo: string }[]
  aoMudar: (valor: string) => void
}) {
  const ativo = valor !== padrao
  const escolhido = opcoes.find((opcao) => opcao.valor === valor)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "clique inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-detalhe whitespace-nowrap transition-[background-color] duration-150",
          ativo ? "bg-lima font-medium text-preto" : "bg-superficie hover:bg-preenchimento-hover",
        )}
      >
        {ativo ? `${rotulo}: ${escolhido?.rotulo.split(" · ")[0]}` : rotulo}
        <ChevronDown className={cn("size-3.5", ativo ? "text-preto" : "text-texto-2")} strokeWidth={2} aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        <DropdownMenuLabel>{rotulo}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={valor} onValueChange={aoMudar}>
          {opcoes.map((opcao) => (
            <DropdownMenuRadioItem key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

