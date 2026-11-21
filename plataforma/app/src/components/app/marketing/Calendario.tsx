"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState, type DragEvent } from "react"
import { ArrowRight, Check, ChevronLeft, ChevronRight, Plus, RefreshCw, UserRoundSearch } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { comemoracaoDe, dataCurta, dataDe, DIAS_SEMANA, DIAS_SEMANA_LONGOS, MESES, semanasDoMes, sugerirMudancas, type Mudanca } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { CANAIS, DATAS_COMEMORATIVAS, STATUS_POST, type PostCalendario, type StatusPost } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { TagStatus } from "./DetalhePost"
import { useMarketing } from "./EstadoMarketing"
import { CabecalhoMarketing, SemDados } from "./ShellMarketing"

/**
 * Calendário de posts. Grade do mês (segunda a domingo) em telas largas e lista por dia no celular.
 * Arrastar um post muda o dia; no detalhe, o campo de data faz o mesmo sem arrastar.
 * O Hattie monta ideias (plimm) e sugere ajustes a partir dos números e dos concorrentes (atualizar).
 */

const ORDEM_DIAS = [1, 2, 3, 4, 5, 6, 0]

/** Marca de cada status no post, sempre junto do texto do status na legenda e no detalhe. */
const ESTILO_STATUS: Record<StatusPost, string> = {
  ideia: "bg-acao-suave",
  aprovado: "bg-preenchimento",
  agendado: "bg-preto text-branco",
  publicado: "bg-preenchimento text-texto-2",
}

export function Calendario() {
  const marca = useMarca()
  const { hoje, posts, mes, setMes, abrirGerador, salvarPost, novoPost, abrirPost } = useMarketing()
  const [atualizar, setAtualizar] = useState(false)
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [alvo, setAlvo] = useState<string | null>(null)

  if (posts.length === 0) return <SemDados titulo="calendário" />

  const [ano, mesIndice] = mes.split("-").map(Number)
  const semanas = semanasDoMes(ano, mesIndice - 1)
  const doMes = posts.filter((post) => post.data.startsWith(mes)).sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))
  const novas = posts.filter((post) => post.nova)
  const porDia = (dia: string) => posts.filter((post) => post.data === dia).sort((a, b) => a.hora.localeCompare(b.hora))
  const contagem = (status: StatusPost) => doMes.filter((post) => post.status === status).length

  const irPara = (deslocamento: number) => {
    const data = new Date(ano, mesIndice - 1 + deslocamento, 1)
    setMes(`${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`)
  }

  const mover = (id: string, dia: string) => {
    const post = posts.find((item) => item.id === id)
    if (!post || post.data === dia) return
    if (dia < hoje) {
      notificar({ titulo: "esse dia já passou", texto: "Escolha um dia a partir de hoje para o post.", tipo: "atencao" })
      return
    }
    salvarPost({ ...post, data: dia })
    notificar({ titulo: "post movido", texto: `"${post.titulo}" agora sai ${dataCurta(dia)}.`, acao: { rotulo: "Desfazer", aoClicar: () => salvarPost(post) } })
  }

  const criarNoDia = (dia: string) => {
    const id = novoPost({ data: dia, titulo: "Post novo", legenda: "" })
    abrirPost(id)
  }

  const soltar = (evento: DragEvent, dia: string) => {
    evento.preventDefault()
    const id = evento.dataTransfer.getData("text/plain")
    setAlvo(null)
    setArrastando(null)
    if (id) mover(id, dia)
  }

  return (
    <Canvas rotulo="Calendário de posts">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
          <CabecalhoMarketing
            titulo="calendário"
            acoes={
              <>
                <Botao variante="secundario" tamanho="sm" onClick={() => setAtualizar(true)}>
                  <RefreshCw /> Atualizar<span className="hidden sm:inline"> com o Hattie</span>
                </Botao>
                <Plimm rotulo="gerar posts" onClick={() => abrirGerador()} />
              </>
            }
          />

          {novas.length > 0 && (
            <section aria-labelledby="titulo-novas" className="flex flex-col gap-3 rounded-3xl bg-acao-suave p-4 @2xl:flex-row @2xl:items-center @2xl:gap-4 md:px-5">
              <IconeHattie nome="hattie" tamanho={28} className="hidden shrink-0 @2xl:block" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <h2 id="titulo-novas" className="text-sm font-semibold">
                  {novas.length} {novas.length === 1 ? "ideia nova" : "ideias novas"} esperando o seu ok
                </h2>
                <p className="text-xs text-texto-2">
                  De {dataCurta(novas[0].data)} a {dataCurta(novas[novas.length - 1].data)}. Abra uma para mudar o texto, o dia ou o canal, ou aprove todas de uma vez.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <DescartarNovas />
                <AprovarNovas />
              </div>
            </section>
          )}

          {/* Mês e legenda */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex items-center gap-1">
              <Botao variante="fantasma" tamanho="icone" aria-label="Mês anterior" onClick={() => irPara(-1)}>
                <ChevronLeft />
              </Botao>
              <h2 className="min-w-36 text-center font-heading text-titulo-3 font-medium lowercase" aria-live="polite">
                {MESES[mesIndice - 1]} {ano}
              </h2>
              <Botao variante="fantasma" tamanho="icone" aria-label="Próximo mês" onClick={() => irPara(1)}>
                <ChevronRight />
              </Botao>
              {mes !== hoje.slice(0, 7) && (
                <Botao variante="secundario" tamanho="sm" className="ms-1" onClick={() => setMes(hoje.slice(0, 7))}>
                  Hoje
                </Botao>
              )}
            </div>
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5" aria-label="O que cada cor quer dizer">
              {(Object.keys(STATUS_POST) as StatusPost[]).map((status) => (
                <li key={status} className="flex items-center gap-1.5 text-xs text-texto-2" title={STATUS_POST[status].explica}>
                  <span aria-hidden className={cn("size-3 rounded-[4px]", ESTILO_STATUS[status])} />
                  {STATUS_POST[status].rotulo}
                  <span className="text-texto-3 tabular-nums">{contagem(status)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Grade do mês, em telas largas */}
          <div role="grid" aria-label={`Posts de ${MESES[mesIndice - 1]}`} className="hidden flex-col gap-1 @3xl:flex">
            <div role="row" className="grid grid-cols-7 gap-1">
              {ORDEM_DIAS.map((dia) => (
                <span role="columnheader" key={dia} className="px-2 pb-1 text-xs font-medium text-texto-3">
                  <abbr title={DIAS_SEMANA_LONGOS[dia]} className="no-underline">
                    {DIAS_SEMANA[dia]}
                  </abbr>
                </span>
              ))}
            </div>
            {semanas.map((semana) => (
              <div role="row" key={semana[0]} className="grid grid-cols-7 gap-1">
                {semana.map((dia) => {
                  const foraDoMes = !dia.startsWith(mes)
                  const passado = dia < hoje
                  const comemoracao = comemoracaoDe(dia)
                  const lista = porDia(dia)
                  const ehHoje = dia === hoje
                  return (
                    <div
                      role="gridcell"
                      key={dia}
                      aria-label={`${dataCurta(dia)}${comemoracao ? `, ${comemoracao.nome}` : ""}, ${lista.length} ${lista.length === 1 ? "post" : "posts"}`}
                      onDragOver={(evento) => {
                        if (!arrastando || passado) return
                        evento.preventDefault()
                        evento.dataTransfer.dropEffect = "move"
                        if (alvo !== dia) setAlvo(dia)
                      }}
                      onDragLeave={() => alvo === dia && setAlvo(null)}
                      onDrop={(evento) => soltar(evento, dia)}
                      className={cn(
                        "group/dia flex min-h-28 min-w-0 flex-col gap-1 rounded-2xl p-1.5 transition-[background-color,box-shadow] duration-150",
                        foraDoMes ? "bg-superficie/40" : "bg-superficie",
                        passado && !foraDoMes && "bg-superficie/70",
                        alvo === dia && "bg-acao-suave shadow-[inset_0_0_0_1.5px_var(--lima-forte)]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-1 px-0.5">
                        <span
                          className={cn(
                            "grid size-6 place-items-center rounded-full text-xs tabular-nums",
                            ehHoje ? "bg-preto font-semibold text-lima" : foraDoMes ? "text-texto-3" : passado ? "text-texto-3" : "font-medium",
                          )}
                        >
                          {dataDe(dia).getDate()}
                          {ehHoje && <span className="sr-only"> (hoje)</span>}
                        </span>
                        {!passado && !foraDoMes && (
                          <button
                            type="button"
                            onClick={() => criarNoDia(dia)}
                            aria-label={`Novo post em ${dataCurta(dia)}`}
                            className="grid size-6 place-items-center rounded-full text-texto-3 opacity-0 transition-[opacity] duration-150 group-hover/dia:opacity-100 hover:bg-preenchimento hover:text-texto focus-visible:opacity-100 pointer-coarse:opacity-100"
                          >
                            <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
                          </button>
                        )}
                      </div>
                      {comemoracao && <p className="truncate px-1 text-micro font-medium text-(--rosa-tinta)">{comemoracao.nome}</p>}
                      <ul className="flex min-w-0 flex-col gap-1">
                        {lista.map((post) => (
                          <li key={post.id}>
                            <ChipPost post={post} arrastavel={post.status !== "publicado"} aoArrastar={(id) => setArrastando(id)} aoSoltar={() => (setArrastando(null), setAlvo(null))} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            ))}
            <p className="px-1 pt-1 text-xs text-texto-3">Arraste um post para outro dia. No celular ou pelo teclado, abra o post e mude a data.</p>
          </div>

          {/* Lista por dia, em telas estreitas */}
          <ListaMes posts={doMes} mes={mes} aoCriar={criarNoDia} />

          <aside aria-labelledby="titulo-parceiro" className="flex flex-col gap-3 rounded-3xl bg-superficie p-4 @2xl:flex-row @2xl:items-center md:px-5">
            <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-preenchimento">
              <UserRoundSearch className="size-4.5" strokeWidth={1.75} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h2 id="titulo-parceiro" className="text-sm font-semibold">
                Quer alguém cuidando das redes?
              </h2>
              <p className="text-xs text-texto-2">Um parceiro de social media recebe este calendário, a marca e as peças, e publica por você.</p>
            </div>
            <Botao variante="secundario" tamanho="sm" asChild className="self-start @2xl:self-center">
              <Link href={`/marca/${marca.slug}/parceiros` as Route}>
                Ver parceiros <ArrowRight />
              </Link>
            </Botao>
          </aside>
        </div>
      </div>

      <AtualizarComHattie aberta={atualizar} aoMudar={setAtualizar} />
    </Canvas>
  )
}

/** Post na grade: abre o detalhe no clique e pode ser arrastado (menos os publicados). */
function ChipPost({ post, arrastavel, aoArrastar, aoSoltar }: { post: PostCalendario; arrastavel: boolean; aoArrastar: (id: string) => void; aoSoltar: () => void }) {
  const { abrirPost } = useMarketing()
  return (
    <button
      type="button"
      draggable={arrastavel}
      onDragStart={(evento) => {
        evento.dataTransfer.setData("text/plain", post.id)
        evento.dataTransfer.effectAllowed = "move"
        aoArrastar(post.id)
      }}
      onDragEnd={aoSoltar}
      onClick={() => abrirPost(post.id)}
      aria-label={`${post.titulo}, ${CANAIS[post.canal].curto}, ${post.hora.replace(":00", "h")}, ${STATUS_POST[post.status].rotulo.toLowerCase()}${post.nova ? ", ideia nova" : ""}`}
      className={cn(
        "flex w-full min-w-0 flex-col items-start gap-0 rounded-lg px-1.5 py-1 text-start transition-[background-color,box-shadow,opacity] duration-150",
        ESTILO_STATUS[post.status],
        post.status === "agendado" ? "hover:bg-grafite" : "hover:shadow-[inset_0_0_0_1px_var(--borda-tag)]",
        post.nova && "shadow-[inset_0_0_0_1.5px_var(--lima-forte)]",
        arrastavel && "cursor-grab active:cursor-grabbing",
      )}
    >
      <span className={cn("flex w-full items-center gap-1 text-micro", post.status === "agendado" ? "text-cinza" : "text-texto-2")}>
        <span className="tabular-nums">{post.hora.replace(":00", "h")}</span>
        <span aria-hidden>·</span>
        <span className="truncate">{CANAIS[post.canal].curto}</span>
        {post.status === "publicado" && <Check className="ms-auto size-3 shrink-0" strokeWidth={2.5} aria-hidden />}
      </span>
      <span className="line-clamp-2 w-full text-xs leading-snug font-medium">{post.titulo}</span>
    </button>
  )
}

/** Lista do mês para o celular: só os dias com post ou data comemorativa. */
function ListaMes({ posts, mes, aoCriar }: { posts: PostCalendario[]; mes: string; aoCriar: (dia: string) => void }) {
  const { hoje, abrirPost } = useMarketing()
  const [passados, setPassados] = useState(false)
  const todos = [...new Set([...posts.map((post) => post.data), ...DATAS_COMEMORATIVAS.filter((data) => data.data.startsWith(mes)).map((data) => data.data)])].sort()
  // No mês atual, a lista começa hoje; os dias que já passaram ficam a um toque.
  const anteriores = todos.filter((dia) => dia < hoje)
  const dias = passados ? todos : todos.filter((dia) => dia >= hoje)
  return (
    <div className="flex flex-col gap-4 @3xl:hidden">
      {anteriores.length > 0 && (
        <Botao variante="secundario" tamanho="sm" className="self-start" aria-expanded={passados} onClick={() => setPassados(!passados)}>
          {passados ? "Esconder os dias que passaram" : `Ver os dias que passaram (${anteriores.length})`}
        </Botao>
      )}
      {dias.length === 0 && <p className="rounded-3xl bg-superficie px-4 py-8 text-center text-sm text-texto-2">Nenhum post neste mês ainda.</p>}
      {dias.map((dia) => {
        const lista = posts.filter((post) => post.data === dia)
        const comemoracao = comemoracaoDe(dia)
        return (
          <section key={dia} aria-labelledby={`dia-${dia}`} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <h3 id={`dia-${dia}`} className={cn("flex items-baseline gap-2 text-sm font-semibold", dia < hoje && "text-texto-2")}>
                {dataCurta(dia)}
                {dia === hoje && <span className="rounded-full bg-preto px-2 py-0.5 text-micro font-medium text-lima">hoje</span>}
                {comemoracao && <span className="text-xs font-medium text-(--rosa-tinta)">{comemoracao.nome}</span>}
              </h3>
              {dia >= hoje && (
                <Botao variante="fantasma" tamanho="icone-sm" aria-label={`Novo post em ${dataCurta(dia)}`} onClick={() => aoCriar(dia)}>
                  <Plus />
                </Botao>
              )}
            </div>
            <ul className="flex flex-col gap-1 rounded-3xl bg-superficie p-2">
              {lista.length === 0 && <li className="px-2 py-3 text-xs text-texto-3">Sem post neste dia.</li>}
              {lista.map((post) => (
                <li key={post.id}>
                  <button type="button" onClick={() => abrirPost(post.id)} className={cn("flex w-full items-center gap-3 rounded-2xl p-2 text-start hover:bg-preenchimento", post.nova && "bg-acao-suave")}>
                    {post.imagem ? (
                      // eslint-disable-next-line @next/next/no-img-element -- imagem do próprio app
                      <img src={post.imagem} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl bg-preenchimento text-micro font-medium text-texto-2">
                        {CANAIS[post.canal].curto}
                      </span>
                    )}
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="line-clamp-2 text-sm leading-snug font-medium">{post.titulo}</span>
                      <span className="flex flex-wrap items-center gap-1.5 text-xs text-texto-2">
                        {post.hora.replace(":00", "h")} · {CANAIS[post.canal].curto}
                        <TagStatus status={post.status} />
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function AprovarNovas() {
  const { aprovarIdeias } = useMarketing()
  return (
    <Botao variante="primario" tamanho="sm" onClick={aprovarIdeias}>
      <Check /> Aprovar todas
    </Botao>
  )
}

function DescartarNovas() {
  const { descartarIdeias } = useMarketing()
  return (
    <Botao variante="fantasma" tamanho="sm" onClick={descartarIdeias}>
      Descartar
    </Botao>
  )
}

/** O Hattie olha os números e os concorrentes e sugere ajustes nos posts que ainda não saíram. A Bia escolhe quais aplicar. */
function AtualizarComHattie({ aberta, aoMudar }: { aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  return (
    <Janela aberta={aberta} aoMudar={aoMudar} titulo="atualizar com o Hattie" descricao="Olhei os números da semana e o que os concorrentes fizeram." largura="lg">
      {aberta && <ListaMudancas aoFechar={() => aoMudar(false)} />}
    </Janela>
  )
}

function ListaMudancas({ aoFechar }: { aoFechar: () => void }) {
  const { hoje, posts, aplicarMudancas, abrirPost } = useMarketing()
  const [mudancas] = useState<Mudanca[]>(() => sugerirMudancas(posts, hoje))
  const [escolhidas, setEscolhidas] = useState<string[]>(() => mudancas.map((mudanca) => mudanca.id))

  if (mudancas.length === 0)
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <IconeHattie nome="estrela" tamanho={28} />
        <p className="text-sm font-medium">Está tudo em dia.</p>
        <p className="max-w-xs text-xs text-texto-2">Os posts que vêm aí já estão nos melhores dias e horários. Volto a olhar na segunda.</p>
        <Botao variante="secundario" tamanho="sm" className="mt-2" onClick={aoFechar}>
          Fechar
        </Botao>
      </div>
    )

  const aplicar = () => {
    const lista = mudancas.filter((mudanca) => escolhidas.includes(mudanca.id))
    aplicarMudancas(lista)
    aoFechar()
    notificar({ titulo: "calendário atualizado", texto: `${lista.length} ${lista.length === 1 ? "post mudou" : "posts mudaram"}. Cada um mostra o que eu mudei e por quê.`, tipo: "sucesso" })
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {mudancas.map((mudanca) => {
          const marcada = escolhidas.includes(mudanca.id)
          return (
            <li key={mudanca.id}>
              <label className={cn("flex cursor-pointer gap-3 rounded-2xl p-3.5 transition-[background-color] duration-150", marcada ? "bg-acao-suave" : "bg-preenchimento")}>
                <input
                  type="checkbox"
                  checked={marcada}
                  onChange={() => setEscolhidas((atual) => (marcada ? atual.filter((id) => id !== mudanca.id) : [...atual, mudanca.id]))}
                  className="mt-0.5 size-4 shrink-0 accent-(--preto)"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="text-sm font-semibold">{mudanca.titulo}</span>
                  <span className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-texto-2 line-through decoration-texto-3">{mudanca.antes}</span>
                    <ArrowRight className="size-3 text-texto-3" aria-label="passa para" />
                    <span className="font-medium">{mudanca.depois}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-texto-2">{mudanca.porque}</span>
                  <button
                    type="button"
                    onClick={(evento) => {
                      evento.preventDefault()
                      aoFechar()
                      abrirPost(mudanca.post)
                    }}
                    className="self-start text-xs font-medium underline-offset-4 hover:underline"
                  >
                    Ver o post
                  </button>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-borda-sutil pt-4">
        <Botao variante="fantasma" onClick={aoFechar}>
          Agora não
        </Botao>
        <Botao variante="primario" disabled={escolhidas.length === 0} onClick={aplicar}>
          <Check /> Aplicar {escolhidas.length} {escolhidas.length === 1 ? "mudança" : "mudanças"}
        </Botao>
      </div>
    </div>
  )
}
