"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState } from "react"
import { CalendarClock, Check, ImagePlus, RefreshCw, Trash2, Undo2, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Botao } from "@/components/hattie/Botao"
import { CampoLista } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { Tag } from "@/components/hattie/Tag"
import { dataLonga, formatar } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { CANAIS, STATUS_POST, type CanalPost, type PostCalendario } from "@/lib/mock"
import { useMarca } from "../MarcaContexto"
import { useMarketing } from "./EstadoMarketing"

/*
 * Detalhe de um post do calendário, num painel à direita. A Bia vê a peça, muda dia, hora e canal,
 * edita a legenda (ou pede outra ao Hattie) e anda com o post: ideia → aprovado → agendado → publicado.
 * Publicado, o painel mostra como o post foi.
 */

const OUTRAS_LEGENDAS = [
  "Do cerrado para a sua rotina: três gotas e um minuto.",
  "Você sabe de onde vem cada gota. Lote, cooperativa e data no rótulo.",
  "Feito em pequenos lotes, com calma. Quando acaba, a gente espera o próximo.",
]

export function DetalhePost() {
  const { posts, postAberto, abrirPost } = useMarketing()
  const post = posts.find((item) => item.id === postAberto) ?? null
  return (
    <Sheet open={!!post} onOpenChange={(aberto) => !aberto && abrirPost(null)}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 border-0 bg-superficie p-0 data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-lg sm:rounded-s-3xl">
        {post && <Conteudo key={post.id} post={post} />}
      </SheetContent>
    </Sheet>
  )
}

function Conteudo({ post }: { post: PostCalendario }) {
  const marca = useMarca()
  const { hoje, salvarPost, excluirPost, abrirPost } = useMarketing()
  const [rascunho, setRascunho] = useState(post)
  const [reescrevendo, setReescrevendo] = useState(false)
  const mudou = JSON.stringify({ ...rascunho, nova: false }) !== JSON.stringify({ ...post, nova: false })
  const publicado = post.status === "publicado"
  const passado = rascunho.data < hoje

  const guardar = (mudanca: Partial<PostCalendario> = {}, aviso?: { titulo: string; texto: string }) => {
    const novo = { ...rascunho, ...mudanca }
    setRascunho(novo)
    salvarPost(novo)
    if (aviso) notificar({ ...aviso, tipo: "sucesso" })
  }

  const reescrever = () => {
    setReescrevendo(true)
    setTimeout(() => {
      setReescrevendo(false)
      const proxima = OUTRAS_LEGENDAS[(OUTRAS_LEGENDAS.indexOf(rascunho.legenda) + 1) % OUTRAS_LEGENDAS.length]
      setRascunho((atual) => ({ ...atual, legenda: proxima }))
    }, 900)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-start gap-2 px-5 pt-4 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <TagStatus status={rascunho.status} />
            {post.nova && (
              <Tag tom="acao" tamanho="sm">
                nova ideia do Hattie
              </Tag>
            )}
          </div>
          <SheetTitle className="text-base leading-snug font-semibold">{rascunho.titulo}</SheetTitle>
          <SheetDescription className="text-xs text-texto-2">
            {CANAIS[rascunho.canal].rotulo} · {dataLonga(rascunho.data)}, {rascunho.hora.replace(":00", "h")}
          </SheetDescription>
        </div>
        <Botao variante="fantasma" tamanho="icone" aria-label="Fechar" onClick={() => abrirPost(null)}>
          <X />
        </Botao>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        {post.mudou && (
          <p className="flex gap-2 rounded-2xl bg-acao-suave px-3.5 py-2.5 text-xs">
            <IconeHattie nome="hattie" tamanho={16} className="shrink-0" />
            {post.mudou}
          </p>
        )}

        {/* Peça */}
        <div className="overflow-hidden rounded-2xl bg-preenchimento">
          {rascunho.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagem do próprio app
            <img src={rascunho.imagem} alt={`Peça: ${rascunho.titulo}`} className={cn("object-cover", rascunho.canal === "story" || rascunho.canal === "reels" ? "mx-auto aspect-[9/16] h-80 w-auto" : "aspect-[4/3] w-full")} />
          ) : (
            <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 p-6 text-center">
              <ImagePlus className="size-6 text-texto-2" strokeWidth={1.75} aria-hidden />
              <p className="text-sm font-medium">{rascunho.canal === "email" || rascunho.canal === "whatsapp" ? "Mensagem só de texto" : "Ainda sem peça"}</p>
              {rascunho.canal !== "email" && rascunho.canal !== "whatsapp" && <p className="text-xs text-texto-2">Crie com o Hattie num projeto; a peça volta para cá.</p>}
            </div>
          )}
        </div>
        {!publicado && rascunho.canal !== "email" && rascunho.canal !== "whatsapp" && (
          <Botao variante="secundario" tamanho="sm" asChild className="-mt-3 self-start">
            <Link href={`/marca/${marca.slug}/projetos/novembro` as Route}>
              <ImagePlus /> {rascunho.imagem ? "Trocar a peça no projeto" : "Criar a peça no projeto"}
            </Link>
          </Botao>
        )}

        {/* Métricas, quando publicado */}
        {publicado && post.metricas && (
          <section aria-labelledby="titulo-como-foi" className="flex flex-col gap-2">
            <h3 id="titulo-como-foi" className="text-xs font-medium text-texto-3">
              Como foi
            </h3>
            <dl className="grid grid-cols-4 gap-2">
              {(
                [
                  ["Alcance", post.metricas.alcance],
                  ["Curtidas", post.metricas.curtidas],
                  ["Salvamentos", post.metricas.salvamentos],
                  ["Comentários", post.metricas.comentarios],
                ] as const
              ).map(([rotulo, valor]) => (
                <div key={rotulo} className="flex flex-col gap-0.5 rounded-2xl bg-preenchimento px-3 py-2.5">
                  <dt className="text-micro text-texto-2">{rotulo}</dt>
                  <dd className="text-base font-semibold tabular-nums">{formatar(valor, "numero")}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Quando e onde */}
        <section aria-labelledby="titulo-quando" className="flex flex-col gap-3">
          <h3 id="titulo-quando" className="text-xs font-medium text-texto-3">
            Quando e onde
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-detalhe font-medium text-texto-2">Dia</span>
              <input
                type="date"
                value={rascunho.data}
                disabled={publicado}
                onChange={(evento) => evento.target.value && setRascunho((atual) => ({ ...atual, data: evento.target.value }))}
                className="h-10 rounded-xl bg-preenchimento px-3 text-sm outline-none focus-visible:bg-preenchimento-hover disabled:opacity-60"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-detalhe font-medium text-texto-2">Hora</span>
              <input
                type="time"
                step={1800}
                value={rascunho.hora}
                disabled={publicado}
                onChange={(evento) => evento.target.value && setRascunho((atual) => ({ ...atual, hora: evento.target.value }))}
                className="h-10 rounded-xl bg-preenchimento px-3 text-sm outline-none focus-visible:bg-preenchimento-hover disabled:opacity-60"
              />
            </label>
          </div>
          {!publicado && (
            <CampoLista
              rotulo="Canal"
              value={rascunho.canal}
              onChange={(evento) => setRascunho((atual) => ({ ...atual, canal: evento.target.value as CanalPost }))}
              opcoes={(Object.keys(CANAIS) as CanalPost[]).map((canal) => ({ valor: canal, rotulo: CANAIS[canal].rotulo }))}
            />
          )}
          {!publicado && passado && <p className="text-xs text-atencao-texto">Esse dia já passou. Escolha outro para agendar.</p>}
          {!publicado && <p className="text-xs text-texto-3">Para a Raiz Natural, terça e quinta às 19h e sábado às 10h rendem mais.</p>}
        </section>

        {/* Texto */}
        <section aria-labelledby="titulo-texto" className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 id="titulo-texto" className="text-xs font-medium text-texto-3">
              {rascunho.canal === "email" ? "Texto do e-mail" : "Legenda"}
            </h3>
            {!publicado && (
              <Botao variante="fantasma" tamanho="sm" disabled={reescrevendo} onClick={reescrever}>
                <RefreshCw className={cn(reescrevendo && "animate-spin motion-reduce:animate-none")} /> {reescrevendo ? "Escrevendo…" : "Outra versão"}
              </Botao>
            )}
          </div>
          <textarea
            aria-label="Legenda do post"
            value={rascunho.legenda}
            readOnly={publicado}
            onChange={(evento) => setRascunho((atual) => ({ ...atual, legenda: evento.target.value }))}
            rows={4}
            className="field-sizing-content min-h-24 w-full resize-none rounded-2xl bg-preenchimento px-3.5 py-3 text-sm leading-relaxed outline-none focus-visible:bg-preenchimento-hover"
          />
          {rascunho.mensagem && (
            <p className="text-xs text-texto-2">
              Carrega a mensagem-chave <span className="font-medium text-texto">{rascunho.mensagem}</span>.
            </p>
          )}
        </section>
      </div>

      {/* Ações pelo momento do post */}
      <footer className="flex flex-wrap items-center gap-2 border-t border-borda-sutil px-5 py-3">
        {rascunho.status === "ideia" && (
          <Botao variante="primario" onClick={() => guardar({ status: "aprovado" }, { titulo: "post aprovado", texto: "Falta escolher a hora e agendar." })}>
            <Check /> Aprovar
          </Botao>
        )}
        {rascunho.status === "aprovado" && (
          <Botao variante="primario" disabled={passado} onClick={() => guardar({ status: "agendado" }, { titulo: "agendado", texto: `Sai ${dataLonga(rascunho.data)}, às ${rascunho.hora.replace(":00", "h")}.` })}>
            <CalendarClock /> Agendar
          </Botao>
        )}
        {rascunho.status === "agendado" && (
          <Botao variante="secundario" onClick={() => guardar({ status: "aprovado" }, { titulo: "fora da agenda", texto: "O post continua aprovado, sem hora para sair." })}>
            <Undo2 /> Tirar da agenda
          </Botao>
        )}
        {mudou && !publicado && (
          <Botao variante={rascunho.status === "ideia" || rascunho.status === "aprovado" ? "secundario" : "primario"} onClick={() => guardar({}, { titulo: "guardado", texto: "As mudanças do post estão no calendário." })}>
            Guardar mudanças
          </Botao>
        )}
        {!publicado && (
          <Botao variante="fantasma" className="ms-auto" onClick={() => excluirPost(post.id)}>
            <Trash2 /> Excluir
          </Botao>
        )}
      </footer>
    </div>
  )
}

/** Status do post: tag com ponto, cor e texto (nunca só a cor). */
export function TagStatus({ status, className }: { status: PostCalendario["status"]; className?: string }) {
  const tom = status === "publicado" ? "sucesso" : status === "agendado" ? "neutra" : status === "aprovado" ? "feita" : "acao"
  return (
    <Tag tom={tom} tamanho="sm" ponto={status !== "publicado"} className={className}>
      {status === "publicado" && <Check />}
      {STATUS_POST[status].rotulo.toLowerCase()}
    </Tag>
  )
}
