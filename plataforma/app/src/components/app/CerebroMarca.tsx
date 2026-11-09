"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  CircleX,
  Copy,
  Download,
  FileText,
  Link2,
  ListTree,
  RotateCcw,
  Search,
  SquarePen,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Botao } from "@/components/hattie/Botao"
import { Composer, type ComposerHandle } from "@/components/hattie/Composer"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { MenuAcoes, type ItemMenu } from "@/components/hattie/MenuAcoes"
import { notificar } from "@/components/hattie/Notificacao"
import { StatusBadge } from "@/components/hattie/StatusBadge"
import { cn } from "@/lib/utils"
import { GRUPOS_CEREBRO, SECOES, VISAO_GERAL, getSecao, type Secao } from "@/lib/mock"
import { useEstado } from "./Estado"
import { Canvas, CabecalhoCanvas, ColunaLateral } from "./Layout"
import { useMarca } from "./MarcaContexto"
import { PreviaSecao } from "./PreviaSecao"
import { useMidia } from "./useMidia"

type MensagemEdicao = { id: number; autor: "hattie" | "pessoa"; texto: string }

const APROVAR = "Gostei, pode aprovar"

function useAcoesSecao(secao: Secao, aoEditar: (id: string) => void) {
  const router = useRouter()
  const marca = useMarca()
  const { secoes, aprovar, reabrir } = useEstado()
  const aprovada = secoes[secao.id] === "aprovada"

  const itens: ItemMenu[] = [
    aprovada
      ? { rotulo: "Reabrir para ajustes", icone: RotateCcw, onSelect: () => reabrir(secao.id) }
      : {
          rotulo: "Aprovar",
          icone: CircleCheck,
          onSelect: () => {
            aprovar(secao.id)
            notificar({
              titulo: "guardado no cérebro",
              texto: `${secao.titulo} aprovado. Tudo que você criar já usa essa decisão.`,
              som: "cling",
            })
          },
        },
    { rotulo: "Editar com o Hattie", icone: SquarePen, abrePainel: true, onSelect: () => aoEditar(secao.id) },
    { rotulo: "Contratar um parceiro", icone: UsersRound, onSelect: () => router.push(`/marca/${marca.slug}/parceiros` as Route) },
  ]
  if (secao.extra) {
    const extra = secao.extra
    const { conteudo } = secao
    itens.push(
      extra.icone === "copiar" && conteudo.tipo === "cores"
        ? {
            rotulo: extra.rotulo,
            icone: Copy,
            separarAntes: true,
            onSelect: () => {
              navigator.clipboard?.writeText(conteudo.cores.map((cor) => `${cor.nome} ${cor.hex}`).join("\n"))
              notificar({ titulo: "cores copiadas", texto: "Os hex estão na sua área de transferência." })
            },
          }
        : { rotulo: extra.rotulo, icone: Download, separarAntes: true, emBreve: true },
    )
  }
  return { itens, aprovada }
}

function Sumario({ secaoAtual, aoNavegar }: { secaoAtual?: string; aoNavegar?: () => void }) {
  const marca = useMarca()
  const { secoes } = useEstado()
  const [busca, setBusca] = useState("")
  const [fechados, setFechados] = useState<Record<string, boolean>>({})
  const termo = busca.trim().toLowerCase()
  const pendentesTotal = SECOES.filter((secao) => secoes[secao.id] === "pendente").length
  const lista = useRef<HTMLElement>(null)
  const prefixo = useId()
  const resultados = termo ? SECOES.filter((secao) => secao.titulo.toLowerCase().includes(termo)).length : SECOES.length

  useEffect(() => {
    lista.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" })
  }, [secaoAtual])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <label className="flex h-10 items-center gap-2 rounded-full border-[1.5px] border-ink px-3.5 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink">
        <Search className="size-4.5 shrink-0 text-ink-soft" strokeWidth={2} aria-hidden />
        <span className="sr-only">Buscar no cérebro da marca</span>
        <input
          type="search"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar"
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-cinza-medio [&::-webkit-search-cancel-button]:hidden"
        />
        {busca && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={() => setBusca("")}
            className="-me-2 grid size-8 place-items-center rounded-full hover:bg-ink/6"
          >
            <CircleX className="size-4.5" strokeWidth={2} />
          </button>
        )}
      </label>

      <nav ref={lista} aria-label="Seções da marca" className="relative -mx-2 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4">
        <Link
          href={`/marca/${marca.slug}/cerebro` as Route}
          onClick={aoNavegar}
          aria-current={!secaoAtual ? "page" : undefined}
          className={cn(
            "flex h-9 items-center justify-between rounded-full px-3 text-sm",
            !secaoAtual ? "bg-lima-suave font-medium" : "hover:bg-ink/6",
          )}
        >
          Visão geral
          {pendentesTotal > 0 && (
            <span className="text-sm text-ink-soft tabular-nums">
              {pendentesTotal}
              <span className="sr-only"> esperando seu ok</span>
            </span>
          )}
        </Link>

        {GRUPOS_CEREBRO.map((grupo) => {
          const itens = SECOES.filter((secao) => secao.grupo === grupo.id && (!termo || secao.titulo.toLowerCase().includes(termo)))
          if (termo && itens.length === 0) return null
          const todos = SECOES.filter((secao) => secao.grupo === grupo.id)
          const aprovadas = todos.filter((secao) => secoes[secao.id] === "aprovada").length
          const completo = aprovadas === todos.length
          const aberto = termo ? true : !fechados[grupo.id]
          const idLista = `${prefixo}-${grupo.id}`
          return (
            <div key={grupo.id} className="flex flex-col">
              <button
                type="button"
                aria-expanded={aberto}
                aria-controls={idLista}
                disabled={Boolean(termo)}
                onClick={() => setFechados((atual) => ({ ...atual, [grupo.id]: aberto }))}
                className="flex h-9 items-center gap-2 rounded-full px-3 text-left text-sm hover:bg-ink/6 disabled:hover:bg-transparent"
              >
                <ChevronDown
                  className={cn("size-4 shrink-0 text-ink-soft transition-transform duration-150", !aberto && "-rotate-90")}
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="flex-1 font-medium">{grupo.titulo}</span>
                <span
                  className={cn(
                    "flex h-7 items-center gap-1 rounded-full px-2.5 text-sm tabular-nums",
                    completo ? "bg-ink/6 text-ink-soft" : "bg-lima-suave text-preto",
                  )}
                >
                  {completo ? (
                    <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
                  ) : (
                    <span aria-hidden className="size-1.5 rounded-full bg-lima-forte" />
                  )}
                  {aprovadas}/{todos.length}
                  <span className="sr-only"> aprovadas</span>
                </span>
              </button>
              {aberto && (
                <ul id={idLista} className="ms-5 flex flex-col border-s border-cinza ps-2">
                  {itens.map((secao) => {
                    const ativa = secao.id === secaoAtual
                    const pendente = secoes[secao.id] === "pendente"
                    return (
                      <li key={secao.id}>
                        <Link
                          href={`/marca/${marca.slug}/cerebro/${secao.id}` as Route}
                          onClick={aoNavegar}
                          aria-current={ativa ? "page" : undefined}
                          className={cn(
                            "flex h-8 items-center justify-between gap-2 rounded-full px-3 text-sm",
                            ativa ? "bg-lima-suave font-medium" : "text-ink-soft hover:bg-ink/6 hover:text-ink",
                          )}
                        >
                          <span className="truncate">{secao.titulo}</span>
                          {pendente ? (
                            <span aria-hidden className="size-2 shrink-0 rounded-full bg-lima-forte" />
                          ) : (
                            <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
                          )}
                          <span className="sr-only">{pendente ? ", esperando seu ok" : ", aprovada"}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
        {termo && resultados === 0 && (
          <p role="status" className="px-4 py-3 text-sm text-ink-soft">
            Nada encontrado para “{busca.trim()}”.
          </p>
        )}
      </nav>
    </div>
  )
}

function CardSecao({ secao, destaque = false, aoEditar }: { secao: Secao; destaque?: boolean; aoEditar: (id: string) => void }) {
  const marca = useMarca()
  const { itens, aprovada } = useAcoesSecao(secao, aoEditar)
  return (
    <article
      className={cn(
        "group/card relative flex min-h-40 flex-col gap-3 rounded-3xl border-2 bg-branco p-5 transition-[border-color] duration-150",
        destaque && !aprovada ? "border-lima" : "border-transparent hover:border-ink/15",
        destaque && "@2xl:col-span-2",
      )}
    >
      <header className="flex items-start gap-3">
        <h3 className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
          <Link
            href={`/marca/${marca.slug}/cerebro/${secao.id}` as Route}
            className="text-lg leading-tight font-medium after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
          >
            {secao.titulo}
          </Link>
          <StatusBadge status={aprovada ? "aprovada" : "pendente"} compacto={aprovada} />
        </h3>
        <MenuAcoes rotulo={`Ações de ${secao.titulo}`} itens={itens} className="-me-2 -mt-1" />
      </header>
      <PreviaSecao secao={secao} modo="card" marca={marca} />
    </article>
  )
}

function PainelEdicao({ secaoId, aoFechar }: { secaoId: string; aoFechar: () => void }) {
  const { secoes, aprovar } = useEstado()
  const secao = getSecao(secaoId)!
  const aprovada = secoes[secao.id] === "aprovada"
  const [mensagens, setMensagens] = useState<MensagemEdicao[]>([])
  const fim = useRef<HTMLDivElement>(null)
  const composer = useRef<ComposerHandle>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => composer.current?.focar())
    return () => {
      cancelAnimationFrame(id)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (mensagens.length) fim.current?.scrollIntoView({ block: "end" })
  }, [mensagens.length])

  function enviar(texto: string) {
    const limpo = texto.trim()
    if (!limpo) return
    const aprovar_ = limpo === APROVAR
    setMensagens((atual) => [...atual, { id: atual.length, autor: "pessoa", texto: limpo }])
    if (aprovar_) {
      aprovar(secao.id)
      notificar({ titulo: "guardado no cérebro", texto: `${secao.titulo} aprovado.`, som: "cling" })
    }
    timer.current = setTimeout(() => {
      setMensagens((atual) => [
        ...atual,
        {
          id: atual.length,
          autor: "hattie",
          texto: aprovar_
            ? "Guardei no cérebro da sua marca. Quer revisar a próxima proposta?"
            : "Anotado. Nesta versão de teste eu ainda não reescrevo de verdade, mas é aqui que a gente ajusta cada detalhe juntos.",
        },
      ])
    }, 700)
  }

  return (
    <div
      className="flex min-h-0 flex-1 flex-col gap-4"
      onKeyDown={(evento) => {
        if (evento.key === "Escape") aoFechar()
      }}
    >
      <div
        role="log"
        aria-live="polite"
        aria-label={`Conversa sobre ${secao.titulo}`}
        className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
      >
        <div className="mt-auto flex items-start gap-3">
          <IconeHattie nome="hattie" tamanho={32} label="Hattie" className="shrink-0 text-preto" />
          <p className="font-heading text-lg leading-tight font-medium lowercase">
            {aprovada ? "quer ajustar alguma coisa aqui?" : "isso resume bem a sua marca?"}
          </p>
        </div>
        <div className="rounded-2xl bg-ink/6 p-4 text-sm">
          <p className="mb-2 text-sm font-medium text-ink-soft">{secao.titulo}</p>
          <p className="leading-relaxed">{secao.resumo}</p>
        </div>
        {mensagens.map((mensagem) =>
          mensagem.autor === "pessoa" ? (
            <p key={mensagem.id} className="max-w-[85%] self-end rounded-[20px] rounded-br-md bg-preto px-4 py-2.5 text-sm text-lima">
              <span className="sr-only">Você: </span>
              {mensagem.texto}
            </p>
          ) : (
            <div key={mensagem.id} className="flex items-start gap-3">
              <IconeHattie nome="hattie" tamanho={28} className="shrink-0 text-preto" />
              <p className="leading-relaxed">
                <span className="sr-only">Hattie: </span>
                {mensagem.texto}
              </p>
            </div>
          ),
        )}
        {mensagens.length === 0 && (
          <div role="group" className="flex flex-wrap justify-end gap-2" aria-label="Respostas rápidas">
            {[!aprovada && APROVAR, "Deixa mais curto", "Quero outra opção"].filter(Boolean).map((sugestao) => (
              <button
                key={sugestao as string}
                type="button"
                onClick={() => enviar(sugestao as string)}
                className="h-8 rounded-full bg-ink/6 px-3 text-[13px] transition-[background-color] duration-150 hover:bg-lima-suave"
              >
                {sugestao}
              </button>
            ))}
          </div>
        )}
        <div ref={fim} />
      </div>
      <Composer ref={composer} tamanho="compacto" rotulo={`Ajuste em ${secao.titulo}`} placeholder="Quer alterar alguma coisa?" onEnviar={enviar} />
    </div>
  )
}

function VisaoGeral({ aoEditar }: { aoEditar: (id: string) => void }) {
  const marca = useMarca()
  const { secoes } = useEstado()
  const pendentes = SECOES.filter((secao) => secoes[secao.id] === "pendente")
  return (
    <div className="flex flex-col gap-4">
      {pendentes.length > 0 && (
        <div className="flex flex-col gap-3 rounded-3xl bg-lima-suave p-4 @xl:flex-row @xl:items-center">
          <IconeHattie nome="hattie" tamanho={32} className="shrink-0 text-preto" />
          <p className="flex-1 text-sm">
            Bia, {pendentes.length} {pendentes.length === 1 ? "proposta espera" : "propostas esperam"} o seu ok. Você já pode criar com o
            Hattie enquanto isso.
          </p>
          <Botao variante="primario" tamanho="sm" asChild>
            <Link href={`/marca/${marca.slug}/cerebro/${pendentes[0].id}` as Route}>Revisar uma por uma</Link>
          </Botao>
        </div>
      )}
      <div className="grid gap-3 @2xl:grid-cols-2">
        {VISAO_GERAL.map((id, indice) => (
          <CardSecao key={id} secao={getSecao(id)!} destaque={indice === 0} aoEditar={aoEditar} />
        ))}
      </div>
    </div>
  )
}

function DetalheSecao({ secao, aoEditar }: { secao: Secao; aoEditar: (id: string) => void }) {
  const marca = useMarca()
  const { aprovar, reabrir, secoes } = useEstado()
  const aprovada = secoes[secao.id] === "aprovada"
  const indice = SECOES.findIndex((item) => item.id === secao.id)
  const proxima = SECOES[indice + 1]
  const anterior = SECOES[indice - 1]

  return (
    <div className="flex flex-col gap-6">
      {!(secao.conteudo.tipo === "texto" && secao.conteudo.texto === secao.resumo) && (
        <p className="max-w-[60ch] text-lg leading-snug">{secao.resumo}</p>
      )}
      <PreviaSecao secao={secao} modo="completo" marca={marca} />

      <section aria-label="Por que eu propus isso" className="flex gap-3 rounded-3xl bg-lilas-suave p-5">
        <IconeHattie nome="hattie" tamanho={32} className="shrink-0 text-preto" />
        <div className="flex flex-col gap-1">
          <h2 className="font-heading text-[21px] leading-tight font-medium lowercase">por que eu propus isso</h2>
          <p className="max-w-[65ch] text-[15px] leading-relaxed">{secao.porque}</p>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        {aprovada ? (
          <Botao variante="secundario" onClick={() => reabrir(secao.id)}>
            <RotateCcw /> Reabrir para ajustes
          </Botao>
        ) : (
          <Botao
            variante="primario"
            onClick={() => {
              aprovar(secao.id)
              notificar({ titulo: "guardado no cérebro", texto: `${secao.titulo} aprovado.`, som: "cling" })
            }}
          >
            <Check /> Aprovar
          </Botao>
        )}
        <Botao variante="secundario" data-editar onClick={() => aoEditar(secao.id)}>
          <SquarePen /> Editar com o Hattie
        </Botao>
        <Botao variante="terciario" asChild>
          <Link href={`/marca/${marca.slug}/parceiros` as Route}>Contratar um parceiro</Link>
        </Botao>
      </div>

      <nav aria-label="Outras seções" className="flex justify-between gap-4 border-t border-ink/10 pt-5">
        {anterior ? (
          <Link
            href={`/marca/${marca.slug}/cerebro/${anterior.id}` as Route}
            className="flex items-center gap-2 text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
            {anterior.titulo}
          </Link>
        ) : (
          <span />
        )}
        {proxima && (
          <Link href={`/marca/${marca.slug}/cerebro/${proxima.id}` as Route} className="flex items-center gap-2 font-medium">
            {proxima.titulo}
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  )
}

export function CerebroMarca({ secaoId }: { secaoId?: string }) {
  const marca = useMarca()
  const { nomeMarca, secoes } = useEstado()
  const [editando, setEditando] = useState<string | null>(null)
  const [sumarioCelular, setSumarioCelular] = useState(false)
  const secao = secaoId ? getSecao(secaoId) : undefined
  const nome = marca.slug === "raiz-natural" ? nomeMarca : marca.nome
  const secaoEditada = useMemo(() => (editando ? getSecao(editando) : undefined), [editando])
  const telaLarga = useMidia("(min-width: 1280px)")

  function fecharEdicao() {
    const titulo = secaoEditada?.titulo
    setEditando(null)
    requestAnimationFrame(() => {
      const alvo =
        document.querySelector<HTMLElement>(`[aria-label="Ações de ${titulo}"]`) ?? document.querySelector<HTMLElement>("[data-editar]")
      alvo?.focus()
    })
  }

  const acoesMarca: ItemMenu[] = [
    {
      rotulo: "Compartilhar link da marca",
      icone: Link2,
      onSelect: () => {
        navigator.clipboard?.writeText(`${window.location.origin}/marca/${marca.slug}/cerebro`)
        notificar({ titulo: "link copiado", texto: "Quem abrir o link vê a sua marca sem precisar de conta." })
      },
    },
    {
      rotulo: "Baixar livro da marca (PDF)",
      icone: FileText,
      emBreve: true,
    },
    {
      rotulo: "Convidar pessoa",
      icone: UserPlus,
      emBreve: true,
    },
  ]

  return (
    <>
      <ColunaLateral rotulo="Sumário da marca" className="hidden pt-1 lg:flex">
        <Sumario secaoAtual={secaoId} />
      </ColunaLateral>

      <Canvas rotulo={secao ? secao.titulo : "Visão geral da marca"}>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
          <div className="flex flex-col gap-5">
            {secao && (
              <Link
                href={`/marca/${marca.slug}/cerebro` as Route}
                className="flex items-center gap-2 self-start text-sm font-medium text-ink-soft hover:text-ink"
              >
                <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
                Visão geral
              </Link>
            )}
            <CabecalhoCanvas
              titulo={secao ? secao.titulo : nome}
              subtitulo={secao ? undefined : "visão geral"}
              grande={!secao}
              acoes={
                <>
                  <Sheet open={sumarioCelular} onOpenChange={setSumarioCelular}>
                    <SheetTrigger asChild>
                      <Botao variante="fantasma" tamanho="icone" aria-label="Sumário da marca" className="lg:hidden">
                        <ListTree />
                      </Botao>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full gap-0 bg-background p-4 data-[side=left]:sm:max-w-xs">
                      <SheetTitle className="mb-3 font-heading text-[21px] font-medium lowercase">{nome}</SheetTitle>
                      <SheetDescription className="sr-only">Seções da marca</SheetDescription>
                      <Sumario secaoAtual={secaoId} aoNavegar={() => setSumarioCelular(false)} />
                    </SheetContent>
                  </Sheet>
                  {secao && <StatusBadge status={secoes[secao.id]} />}
                  <MenuAcoes rotulo="Ações da marca" itens={acoesMarca} />
                </>
              }
            />
            {secao ? <DetalheSecao secao={secao} aoEditar={setEditando} /> : <VisaoGeral aoEditar={setEditando} />}
          </div>
        </div>
      </Canvas>

      {secaoEditada && telaLarga && (
        <ColunaLateral
          titulo="editar com o hattie"
          className="w-80"
          acao={
            <Botao variante="fantasma" tamanho="icone" aria-label="Fechar edição" onClick={fecharEdicao}>
              <X />
            </Botao>
          }
        >
          <PainelEdicao key={secaoEditada.id} secaoId={secaoEditada.id} aoFechar={fecharEdicao} />
        </ColunaLateral>
      )}
      {secaoEditada && !telaLarga && (
        <Sheet open onOpenChange={(aberto) => !aberto && fecharEdicao()}>
          <SheetContent side="right" className="w-full gap-0 bg-background p-4 data-[side=right]:sm:max-w-sm">
            <SheetTitle className="mb-3 font-heading text-[21px] font-medium lowercase">editar com o hattie</SheetTitle>
            <SheetDescription className="sr-only">Ajuste de {secaoEditada.titulo}</SheetDescription>
            <PainelEdicao key={`m-${secaoEditada.id}`} secaoId={secaoEditada.id} aoFechar={fecharEdicao} />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}
