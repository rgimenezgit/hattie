"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, BookOpen, Check, KanbanSquare, MessagesSquare, PenLine, Send } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Plimm } from "@/components/hattie/Plimm"
import { EmptyState } from "@/components/hattie/EmptyState"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import { ETAPAS, formatarReal, getParceiro, getSecao, type ConversaParceiro, type MensagemParceiro, type Parceiro } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { AvatarParceiro, primeiroNome } from "./Comuns"
import { useParceiros } from "./EstadoParceiros"
import { TopoParceiros } from "./ShellParceiros"

/**
 * Mensagens com parceiros: lista de conversas (uma por trabalho) e a conversa aberta, com propostas
 * que a pessoa aprova ali mesmo e as notas do Hattie. No celular, a lista e a conversa ocupam a tela uma de cada vez.
 */
export function MensagensParceiros({ conversaId }: { conversaId?: string }) {
  const { conversas } = useParceiros()
  const aberta = conversas.find((conversa) => conversa.id === conversaId) ?? (conversaId ? undefined : conversas[0])

  return (
    <Canvas rotulo="Mensagens com parceiros">
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 px-4 py-4 md:px-6 md:py-5">
        <TopoParceiros titulo="mensagens" />
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 @3xl:grid-cols-[17rem_minmax(0,1fr)]">
          <ListaConversas conversas={conversas} ativa={aberta?.id} className={cn(conversaId && "hidden @3xl:flex")} />
          {aberta ? (
            <Conversa key={aberta.id} conversa={aberta} className={cn(!conversaId && "hidden @3xl:flex")} />
          ) : (
            <div className={cn("grid place-items-center rounded-3xl bg-superficie", !conversaId && "hidden @3xl:grid")}>
              <EmptyState icone={MessagesSquare} titulo="conversa não encontrada" texto="Ela pode ter sido arquivada. Escolha outra na lista." />
            </div>
          )}
        </div>
      </div>
    </Canvas>
  )
}

function ListaConversas({ conversas, ativa, className }: { conversas: ConversaParceiro[]; ativa?: string; className?: string }) {
  const marca = useMarca()
  return (
    <nav aria-label="Conversas" className={cn("flex min-h-0 flex-col gap-0.5 overflow-y-auto rounded-3xl bg-superficie p-2", className)}>
      {conversas.map((conversa) => {
        const parceiro = getParceiro(conversa.parceiro)
        if (!parceiro) return null
        const ultima = conversa.mensagens.at(-1)
        const atual = conversa.id === ativa
        return (
          <Link
            key={conversa.id}
            href={`/marca/${marca.slug}/parceiros/mensagens/${conversa.id}` as Route}
            aria-current={atual ? "page" : undefined}
            className={cn("flex items-start gap-3 rounded-2xl p-2.5", atual ? "bg-preenchimento" : "hover:bg-preenchimento/60")}
          >
            <AvatarParceiro parceiro={parceiro} tamanho={36} />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-baseline justify-between gap-2">
                <span className={cn("truncate text-sm", conversa.naoLidas ? "font-semibold" : "font-medium")}>{parceiro.nome}</span>
                <span className="shrink-0 text-micro text-texto-3">{ultima?.quando.split(",")[0]}</span>
              </span>
              <span className="truncate text-xs text-texto-2">{conversa.assunto}</span>
              <span className="flex items-center gap-2">
                <span className={cn("line-clamp-1 flex-1 text-xs", conversa.naoLidas ? "text-texto" : "text-texto-3")}>
                  {ultima?.proposta ? `Proposta: ${formatarReal(ultima.proposta.valor)}` : ultima?.texto}
                </span>
                {conversa.naoLidas > 0 && (
                  <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-preto px-1 text-micro font-semibold text-lima tabular-nums">
                    {conversa.naoLidas}
                    <span className="sr-only"> não lidas</span>
                  </span>
                )}
              </span>
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function Conversa({ conversa, className }: { conversa: ConversaParceiro; className?: string }) {
  const marca = useMarca()
  const { trabalhos, enviarMensagem, aprovarProposta, lerConversa } = useParceiros()
  const parceiro = getParceiro(conversa.parceiro)
  const trabalho = trabalhos.find((item) => item.id === conversa.id)
  const etapa = ETAPAS.find((item) => item.id === trabalho?.etapa)
  const [texto, setTexto] = useState("")
  const fim = useRef<HTMLDivElement>(null)
  const campo = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    lerConversa(conversa.id)
  }, [conversa.id, conversa.naoLidas, lerConversa])
  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" })
  }, [conversa.mensagens.length])

  if (!parceiro) return null
  const base = `/marca/${marca.slug}/parceiros`

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!texto.trim()) return
    enviarMensagem(conversa.id, texto.trim())
    setTexto("")
  }

  return (
    <section aria-label={`Conversa com ${parceiro.nome}`} className={cn("flex min-h-[28rem] min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie", className)}>
      <header className="flex items-center gap-3 border-b border-borda-sutil p-3 md:px-4">
        <Link href={`${base}/mensagens` as Route} aria-label="Voltar para as conversas" className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-preenchimento @3xl:hidden">
          <ArrowLeft className="size-4" strokeWidth={2} />
        </Link>
        <AvatarParceiro parceiro={parceiro} tamanho={40} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link href={`${base}/perfil/${parceiro.id}` as Route} className="truncate text-sm font-semibold hover:underline hover:underline-offset-4">
            {parceiro.nome}
          </Link>
          <span className="truncate text-xs text-texto-2">
            {conversa.assunto}
            {trabalho?.projeto && <span className="text-texto-3"> · {trabalho.projeto}</span>}
          </span>
        </div>
        {etapa && (
          <Tag tom={trabalho?.etapa === "revisao" || trabalho?.etapa === "proposta" ? "acao" : trabalho?.etapa === "entregue" ? "feita" : "neutra"} className="hidden sm:inline-flex">
            {etapa.titulo}
          </Tag>
        )}
        <Botao variante="fantasma" tamanho="icone" asChild>
          <Link href={`${base}/quadro` as Route} aria-label="Ver no quadro">
            <KanbanSquare />
          </Link>
        </Botao>
      </header>

      <div role="log" aria-live="polite" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-5">
        {conversa.mensagens.map((mensagem) => (
          <Mensagem
            key={mensagem.id}
            mensagem={mensagem}
            parceiro={parceiro}
            aoAprovar={() => {
              aprovarProposta(conversa.id)
              notificar({ titulo: "proposta aprovada", texto: `${primeiroNome(parceiro)} já pode começar. O trabalho foi para Em andamento no quadro.`, som: "cling" })
            }}
            aoAjustar={() => {
              setTexto("Podemos ajustar a proposta? ")
              campo.current?.focus()
            }}
          />
        ))}
        <div ref={fim} />
      </div>

      <form onSubmit={enviar} className="flex items-end gap-2 border-t border-borda-sutil px-4 py-3">
        <label htmlFor={`resposta-${conversa.id}`} className="sr-only">
          Mensagem para {parceiro.nome}
        </label>
        <textarea
          ref={campo}
          id={`resposta-${conversa.id}`}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === "Enter" && !evento.shiftKey) {
              evento.preventDefault()
              evento.currentTarget.form?.requestSubmit()
            }
          }}
          rows={1}
          placeholder={`Escreva para ${primeiroNome(parceiro)}`}
          className="field-sizing-content max-h-32 min-h-10 flex-1 resize-none rounded-2xl bg-preenchimento px-3.5 py-2.5 text-sm leading-snug outline-none placeholder:text-texto-3 focus-visible:bg-preenchimento-hover"
        />
        <Plimm type="submit" icone={Send} somenteIcone rotulo="Enviar mensagem" disabled={!texto.trim()} />
      </form>
    </section>
  )
}

function Mensagem({ mensagem, parceiro, aoAprovar, aoAjustar }: { mensagem: MensagemParceiro; parceiro: Parceiro; aoAprovar: () => void; aoAjustar: () => void }) {
  if (mensagem.autor === "hattie")
    return (
      <div className="flex items-start gap-2 self-center rounded-2xl bg-info-suave px-3 py-2.5 text-xs @3xl:max-w-[80%]">
        <IconeHattie nome="hattie" tamanho={16} className="mt-px shrink-0 text-preto" />
        <div className="flex flex-col gap-2">
          <p>
            <span className="sr-only">Hattie: </span>
            {mensagem.texto}
          </p>
          {mensagem.anexos && <AnexosCerebro anexos={mensagem.anexos} />}
        </div>
      </div>
    )

  if (mensagem.autor === "pessoa")
    return (
      <div className="flex max-w-[85%] flex-col items-end gap-1 self-end @3xl:max-w-[70%]">
        <p className="rounded-[20px] rounded-br-md bg-preto px-4 py-2.5 text-sm whitespace-pre-line text-lima">
          <span className="sr-only">Você: </span>
          {mensagem.texto}
        </p>
        <span className="text-micro text-texto-3">{mensagem.quando}</span>
      </div>
    )

  const proposta = mensagem.proposta
  return (
    <div className="flex max-w-[92%] items-end gap-2 @3xl:max-w-[75%]">
      <AvatarParceiro parceiro={parceiro} tamanho={28} />
      <div className="flex min-w-0 flex-col gap-1">
        {proposta ? (
          <article aria-label={`Proposta de ${parceiro.nome}`} className="flex flex-col gap-3 rounded-[20px] rounded-bl-md bg-preenchimento p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-texto-2">Proposta</span>
              {proposta.status === "aprovada" && (
                <Tag tom="sucesso" tamanho="sm">
                  <Check /> aprovada
                </Tag>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{proposta.titulo}</span>
              <span className="font-heading text-titulo-2 font-medium tabular-nums">{formatarReal(proposta.valor)}</span>
              <span className="text-xs text-texto-2">Prazo: {proposta.prazo}</span>
            </div>
            <ul className="flex flex-col gap-1 border-t border-borda-sutil pt-3 text-sm">
              {proposta.inclui.map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-texto-3" strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            {proposta.status === "aberta" && (
              <div className="flex flex-wrap gap-2">
                <Botao variante="primario" tamanho="sm" onClick={aoAprovar}>
                  <Check /> Aprovar proposta
                </Botao>
                <Botao variante="secundario" tamanho="sm" onClick={aoAjustar}>
                  <PenLine /> Pedir ajuste
                </Botao>
              </div>
            )}
          </article>
        ) : (
          <p className="rounded-[20px] rounded-bl-md bg-preenchimento px-4 py-2.5 text-sm whitespace-pre-line">
            <span className="sr-only">{parceiro.nome}: </span>
            {mensagem.texto}
          </p>
        )}
        <span className="text-micro text-texto-3">{mensagem.quando}</span>
      </div>
    </div>
  )
}

/** Partes do cérebro da marca citadas na conversa; cada uma abre a seção. */
function AnexosCerebro({ anexos }: { anexos: string[] }) {
  const marca = useMarca()
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Partes da marca compartilhadas">
      {anexos.map((secaoId) => {
        const secao = getSecao(secaoId)
        if (!secao) return null
        return (
          <li key={secaoId}>
            <Link
              href={`/marca/${marca.slug}/cerebro/${secao.id}` as Route}
              className="inline-flex h-7 items-center gap-1.5 rounded-full bg-superficie px-2.5 text-xs font-medium hover:bg-preenchimento"
            >
              <BookOpen className="size-3 text-texto-3" strokeWidth={2} aria-hidden />
              {secao.titulo}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
