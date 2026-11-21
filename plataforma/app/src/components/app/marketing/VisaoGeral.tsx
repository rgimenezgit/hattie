"use client"

import Link from "next/link"
import type { Route } from "next"
import { ArrowDownRight, ArrowRight, ArrowUpRight, Info, MessageCircleReply, Swords, Wand2 } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Minilinha } from "@/components/hattie/Minilinha"
import { Plimm } from "@/components/hattie/Plimm"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { dataCurta, formatar, somarDias } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { CANAIS, CANAIS_VENDA, INDICADORES_MARKETING, LEITURA_SEMANA, MELHORES_HORARIOS, METAS_MARKETING, SEMANAS_MARKETING, type IndicadorMarketing, type MetaMarketing } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { TagStatus } from "./DetalhePost"
import { useMarketing } from "./EstadoMarketing"
import { CabecalhoMarketing, SemDados } from "./ShellMarketing"

/**
 * Visão geral do marketing: a leitura do Hattie sobre a semana, com o que fazer a seguir,
 * os números essenciais, as metas que vieram dos objetivos, os posts da semana e o que mais rendeu.
 */
export function VisaoGeral() {
  const marca = useMarca()
  const { hoje, posts, leads, abrirGerador } = useMarketing()
  const base = `/marca/${marca.slug}/marketing`

  if (posts.length === 0 && leads.length === 0) return <SemDados titulo="visão geral" />

  const lojistasEsperando = leads.filter((lead) => lead.tipo === "lojista" && lead.aguardando === "voce" && (lead.etapa === "novo" || lead.etapa === "conversa")).length
  const lojasClientes = leads.filter((lead) => lead.tipo === "lojista" && lead.etapa === "cliente").length
  const ideias = posts.filter((post) => post.status === "ideia").length

  const semana = posts.filter((post) => post.data >= hoje && post.data <= somarDias(hoje, 6)).sort((a, b) => `${a.data}${a.hora}`.localeCompare(`${b.data}${b.hora}`))
  const melhores = posts
    .filter((post) => post.status === "publicado" && post.metricas)
    .sort((a, b) => (b.metricas?.alcance ?? 0) - (a.metricas?.alcance ?? 0))
    .slice(0, 3)
  const melhor = melhores[0]

  const leitura = [
    "O alcance subiu 18%, puxado pelos posts de mãos e produto.",
    lojistasEsperando > 0 ? `${lojistasEsperando === 1 ? "Um lojista pediu catálogo e espera" : `${lojistasEsperando} lojistas pediram catálogo e esperam`} a sua resposta.` : "Os lojistas que pediram catálogo já tiveram resposta.",
    "E a Botica do Cerrado lançou um kit de Natal a R$ 89.",
  ].join(" ")

  return (
    <Canvas rotulo="Visão geral do marketing">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <CabecalhoMarketing titulo="visão geral" detalhe="últimos 30 dias" acoes={<Plimm rotulo="criar posts" onClick={() => abrirGerador()} />} />

          {/* Leitura do Hattie */}
          <section aria-labelledby="titulo-leitura" className="flex flex-col gap-4 rounded-3xl bg-superficie p-5 md:flex-row md:items-start md:gap-5 md:p-6">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-acao-suave">
              <IconeHattie nome="bola-de-cristal" tamanho={22} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 id="titulo-leitura" className="font-heading text-titulo-3 font-medium lowercase">
                  {LEITURA_SEMANA.titulo}
                </h2>
                <p className="max-w-prose text-sm leading-relaxed text-texto-2">{leitura}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="O que fazer agora">
                {lojistasEsperando > 0 && (
                  <li>
                    <Botao variante="primario" tamanho="sm" asChild>
                      <Link href={`${base}/leads` as Route}>
                        <MessageCircleReply /> Responder {lojistasEsperando === 1 ? "o lojista" : `os ${lojistasEsperando} lojistas`}
                      </Link>
                    </Botao>
                  </li>
                )}
                {melhor && (
                  <li>
                    <Botao variante="secundario" tamanho="sm" onClick={() => abrirGerador(`Mais posts como "${melhor.titulo}": mãos, produto e luz natural.`)}>
                      <Wand2 /> Mais posts como o que mais rendeu
                    </Botao>
                  </li>
                )}
                <li>
                  <Botao variante="secundario" tamanho="sm" asChild>
                    <Link href={`${base}/concorrentes` as Route}>
                      <Swords /> Ver o kit da Botica
                    </Link>
                  </Botao>
                </li>
              </ul>
            </div>
          </section>

          {/* Números */}
          <section aria-labelledby="titulo-numeros" className="flex flex-col gap-3">
            <h2 id="titulo-numeros" className="px-1 text-sm font-semibold">
              Como a marca está
            </h2>
            <ul className="grid grid-cols-1 gap-3 @md:grid-cols-2 @4xl:grid-cols-3">
              {INDICADORES_MARKETING.map((indicador) => (
                <li key={indicador.id}>
                  <CartaoIndicador indicador={indicador} />
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-6 @4xl:grid-cols-5">
            {/* Metas */}
            <section aria-labelledby="titulo-metas" className="flex flex-col gap-3 @4xl:col-span-3">
              <div className="flex items-baseline justify-between gap-2 px-1">
                <h2 id="titulo-metas" className="text-sm font-semibold">
                  Metas
                </h2>
                <Link href={`/marca/${marca.slug}/cerebro/objetivos` as Route} className="text-xs text-texto-2 underline-offset-4 hover:text-texto hover:underline">
                  Vêm dos objetivos da estratégia
                </Link>
              </div>
              <ul className="flex flex-col gap-3">
                {METAS_MARKETING.map((meta) => (
                  <li key={meta.id}>
                    <CartaoMeta meta={meta.id === "lojas" ? { ...meta, atual: lojasClientes } : meta} href={(meta.id === "lojas" ? `${base}/leads` : `${base}/concorrentes`) as Route} />
                  </li>
                ))}
              </ul>
            </section>

            {/* Esta semana */}
            <section aria-labelledby="titulo-semana" className="flex flex-col gap-3 @4xl:col-span-2">
              <div className="flex items-baseline justify-between gap-2 px-1">
                <h2 id="titulo-semana" className="text-sm font-semibold">
                  Próximos 7 dias
                </h2>
                <Link href={`${base}/calendario` as Route} className="flex items-center gap-1 text-xs text-texto-2 underline-offset-4 hover:text-texto hover:underline">
                  Calendário{ideias > 0 && `, ${ideias} ${ideias === 1 ? "ideia" : "ideias"} para aprovar`} <ArrowRight className="size-3" aria-hidden />
                </Link>
              </div>
              <ListaSemana posts={semana} />
            </section>
          </div>

          {/* O que mais rendeu */}
          {melhores.length > 0 && (
            <section aria-labelledby="titulo-melhores" className="flex flex-col gap-3">
              <h2 id="titulo-melhores" className="px-1 text-sm font-semibold">
                O que mais rendeu no mês
              </h2>
              <ul className="grid gap-3 @2xl:grid-cols-3">
                {melhores.map((post, posicao) => (
                  <li key={post.id}>
                    <CartaoMelhor post={post} posicao={posicao} aoRepetir={() => abrirGerador(`Mais posts como "${post.titulo}" (${CANAIS[post.canal].rotulo.toLowerCase()}, ${post.hora.replace(":00", "h")}).`)} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <VerMais resumo="Canais de venda, melhores horários e o que cada número quer dizer">
            <div className="grid gap-6 @3xl:grid-cols-2">
              <section aria-labelledby="titulo-canais" className="flex flex-col gap-3">
                <h3 id="titulo-canais" className="text-xs font-medium text-texto-3">
                  De onde vêm os pedidos
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {CANAIS_VENDA.map((canal) => (
                    <li key={canal.canal} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-sm">
                      <span>{canal.canal}</span>
                      <span aria-hidden className="h-2 overflow-hidden rounded-full bg-preenchimento-ativo">
                        <span className="block h-full rounded-full bg-texto" style={{ width: `${canal.porcentagem}%` }} />
                      </span>
                      <span className="text-end font-medium tabular-nums">{canal.porcentagem}%</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="titulo-horarios" className="flex flex-col gap-3">
                <h3 id="titulo-horarios" className="text-xs font-medium text-texto-3">
                  Quando postar
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {MELHORES_HORARIOS.map((horario) => (
                    <li key={horario.dia} className="flex flex-col text-sm">
                      <span className="font-medium">
                        {horario.dia}, {horario.hora}
                      </span>
                      <span className="text-xs text-texto-2">{horario.porque}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section aria-labelledby="titulo-glossario" className="flex flex-col gap-3 @3xl:col-span-2">
                <h3 id="titulo-glossario" className="text-xs font-medium text-texto-3">
                  O que cada número quer dizer
                </h3>
                <dl className="grid gap-x-6 gap-y-2.5 @2xl:grid-cols-2">
                  {INDICADORES_MARKETING.map((indicador) => (
                    <div key={indicador.id} className="flex flex-col text-sm">
                      <dt className="font-medium">{indicador.rotulo}</dt>
                      <dd className="text-xs text-texto-2">{indicador.explica}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </VerMais>
        </div>
      </div>
    </Canvas>
  )
}

/** Indicador: valor grande, variação com seta e sinal (nunca só a cor) e a linha das últimas 8 semanas. */
function CartaoIndicador({ indicador }: { indicador: IndicadorMarketing }) {
  const subiu = indicador.variacao >= 0
  const Seta = subiu ? ArrowUpRight : ArrowDownRight
  return (
    <article aria-labelledby={`indicador-${indicador.id}`} className="flex h-full flex-col gap-3 rounded-3xl bg-superficie p-4 pb-3">
      <div className="flex items-start justify-between gap-2">
        <h3 id={`indicador-${indicador.id}`} className="text-xs text-texto-2">
          {indicador.rotulo}
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label={`O que é: ${indicador.rotulo}`} className="-m-1.5 grid size-7 shrink-0 place-items-center rounded-full text-texto-3 hover:bg-preenchimento hover:text-texto">
              <Info className="size-3.5" strokeWidth={2} aria-hidden />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">{indicador.explica}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="font-heading text-titulo-2 leading-none font-medium tabular-nums">{formatar(indicador.valor, indicador.formato)}</p>
        <p className={cn("flex items-center gap-0.5 text-xs font-medium tabular-nums", subiu ? "text-sucesso-texto" : "text-erro-texto")}>
          <Seta className="size-3.5" strokeWidth={2.25} aria-hidden />
          {subiu ? "+" : "−"}
          {Math.abs(indicador.variacao)}%<span className="sr-only"> em relação aos 30 dias anteriores</span>
        </p>
      </div>
      <Minilinha rotulo={indicador.rotulo} serie={indicador.serie} periodos={SEMANAS_MARKETING.map((semana) => `semana de ${semana}`)} formatar={(valor) => formatar(valor, indicador.formato)} />
    </article>
  )
}

function CartaoMeta({ meta, href }: { meta: MetaMarketing; href: Route }) {
  const porcentagem = Math.min(100, Math.round((meta.atual / meta.alvo) * 100))
  const valor = meta.unidade === "%" ? `${meta.atual}% de ${meta.alvo}%` : `${meta.atual} de ${meta.alvo} lojas`
  return (
    <article aria-labelledby={`meta-${meta.id}`} className="flex flex-col gap-3 rounded-3xl bg-superficie p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <h3 id={`meta-${meta.id}`} className="text-sm font-semibold">
            {meta.titulo}
          </h3>
          <p className="text-xs text-texto-3">{meta.prazo}</p>
        </div>
        <Tag tom={meta.ritmo === "no ritmo" ? "sucesso" : "atencao"} tamanho="sm" ponto>
          {meta.ritmo}
        </Tag>
      </div>
      <div className="flex items-center gap-3">
        <span
          role="progressbar"
          aria-label={meta.titulo}
          aria-valuemin={0}
          aria-valuemax={meta.alvo}
          aria-valuenow={meta.atual}
          aria-valuetext={valor}
          className="h-2 flex-1 overflow-hidden rounded-full bg-preenchimento-ativo"
        >
          <span className="block h-full rounded-full bg-texto transition-[width] duration-300 ease-out" style={{ width: `${porcentagem}%` }} />
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums">{valor}</span>
      </div>
      <p className="text-xs leading-relaxed text-texto-2">{meta.explica}</p>
      <Link href={href} className="flex items-center gap-1 self-start text-xs font-medium underline-offset-4 hover:underline">
        {meta.dica} <ArrowRight className="size-3" aria-hidden />
      </Link>
    </article>
  )
}

function ListaSemana({ posts }: { posts: ReturnType<typeof useMarketing>["posts"] }) {
  const { abrirPost } = useMarketing()
  if (posts.length === 0) return <p className="rounded-3xl bg-superficie px-4 py-8 text-center text-sm text-texto-2">Nada marcado para os próximos dias.</p>
  return (
    <ul className="flex flex-col gap-1 rounded-3xl bg-superficie p-2">
      {posts.map((post) => (
        <li key={post.id}>
          <button type="button" onClick={() => abrirPost(post.id)} className="flex w-full items-center gap-3 rounded-2xl p-2 text-start hover:bg-preenchimento">
            {post.imagem ? (
              // eslint-disable-next-line @next/next/no-img-element -- imagem do próprio app
              <img src={post.imagem} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
            ) : (
              <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-preenchimento text-micro font-medium text-texto-2">
                {CANAIS[post.canal].curto}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{post.titulo}</span>
              <span className="truncate text-xs text-texto-2">
                {dataCurta(post.data)}, {post.hora.replace(":00", "h")} · {CANAIS[post.canal].curto}
              </span>
            </span>
            <TagStatus status={post.status} className="hidden @sm:inline-flex" />
          </button>
        </li>
      ))}
    </ul>
  )
}

function CartaoMelhor({ post, posicao, aoRepetir }: { post: ReturnType<typeof useMarketing>["posts"][number]; posicao: number; aoRepetir: () => void }) {
  const { abrirPost } = useMarketing()
  return (
    <article aria-labelledby={`melhor-${post.id}`} className="flex h-full flex-col overflow-hidden rounded-3xl bg-superficie">
      <button type="button" onClick={() => abrirPost(post.id)} className="group relative block text-start" aria-labelledby={`melhor-${post.id}`}>
        {post.imagem && (
          // eslint-disable-next-line @next/next/no-img-element -- imagem do próprio app
          <img src={post.imagem} alt="" className="aspect-[16/10] w-full object-cover transition-[opacity] duration-150 group-hover:opacity-90" />
        )}
        {posicao === 0 && (
          <span className="absolute start-3 top-3 flex h-6 items-center gap-1 rounded-full bg-preto px-2 text-micro font-medium text-lima">
            <IconeHattie nome="estrela" tamanho={12} /> o que mais rendeu
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 id={`melhor-${post.id}`} className="text-sm font-semibold">
            {post.titulo}
          </h3>
          <p className="text-xs text-texto-2">
            {CANAIS[post.canal].rotulo} · {dataCurta(post.data)}
          </p>
        </div>
        {post.metricas && (
          <dl className="grid grid-cols-3 gap-2 text-xs">
            {(
              [
                ["Alcance", post.metricas.alcance],
                ["Salvos", post.metricas.salvamentos],
                ["Comentários", post.metricas.comentarios],
              ] as const
            ).map(([rotulo, valor]) => (
              <div key={rotulo} className="flex flex-col">
                <dt className="text-texto-3">{rotulo}</dt>
                <dd className="font-semibold tabular-nums">{formatar(valor, "numero")}</dd>
              </div>
            ))}
          </dl>
        )}
        <Botao variante="secundario" tamanho="sm" className="mt-auto self-start" onClick={aoRepetir}>
          <Wand2 /> Fazer mais assim
        </Botao>
      </div>
    </article>
  )
}
