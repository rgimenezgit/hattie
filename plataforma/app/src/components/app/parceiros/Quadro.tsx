"use client"

import Link from "next/link"
import type { Route } from "next"
import { Check, FolderKanban, Plus } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { notificar } from "@/components/hattie/Notificacao"
import { cn } from "@/lib/utils"
import { ETAPAS, formatarReal, getParceiro, type TrabalhoParceiro } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { AvatarParceiro, primeiroNome } from "./Comuns"
import { useParceiros } from "./EstadoParceiros"
import { TopoParceiros } from "./ShellParceiros"

/**
 * Quadro dos trabalhos com parceiros, por etapa: pedido enviado, proposta, em andamento, para revisar e concluído.
 * O card inteiro leva à conversa; a entrega é aprovada daqui e a proposta, na conversa.
 */
export function QuadroParceiros() {
  const marca = useMarca()
  const { trabalhos } = useParceiros()
  const emCurso = trabalhos.filter((trabalho) => trabalho.etapa !== "entregue").length
  const revisar = trabalhos.filter((trabalho) => trabalho.etapa === "revisao" || trabalho.etapa === "proposta").length
  const investido = trabalhos.filter((trabalho) => ["andamento", "revisao", "entregue"].includes(trabalho.etapa)).reduce((soma, trabalho) => soma + (trabalho.valor ?? 0), 0)

  return (
    <Canvas rotulo="Quadro de trabalhos com parceiros">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-6">
          <TopoParceiros
            titulo="quadro"
            acoes={
              <Botao variante="secundario" tamanho="sm" asChild>
                <Link href={`/marca/${marca.slug}/parceiros` as Route}>
                  <Plus /> Contratar
                </Link>
              </Botao>
            }
          />

          <dl className="grid grid-cols-3 gap-3 rounded-3xl bg-superficie p-5 md:p-6">
            {[
              ["Em curso", String(emCurso)],
              ["Esperando seu ok", String(revisar)],
              ["Investido em 2026", formatarReal(investido)],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-xs text-texto-3">{rotulo}</dt>
                <dd className="font-heading text-destaque font-medium tabular-nums @xl:text-titulo-3 @3xl:text-titulo-2">{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-6 @3xl:grid @3xl:grid-cols-5 @3xl:gap-2.5">
            {ETAPAS.map((etapa) => {
              const lista = trabalhos.filter((trabalho) => trabalho.etapa === etapa.id)
              return (
                <section key={etapa.id} aria-labelledby={`etapa-${etapa.id}`} className="flex min-w-0 flex-col gap-3">
                  <h2 id={`etapa-${etapa.id}`} title={etapa.descricao} className="flex items-baseline gap-2 px-1 text-sm font-semibold">
                    {etapa.titulo}
                    <span className="text-xs font-medium text-texto-3 tabular-nums">{lista.length}</span>
                  </h2>
                  <ul className="flex flex-col gap-2">
                    {lista.map((trabalho) => (
                      <li key={trabalho.id}>
                        <CartaoTrabalho trabalho={trabalho} />
                      </li>
                    ))}
                    {lista.length === 0 && <li className="rounded-2xl bg-superficie/50 px-3 py-5 text-center text-xs text-texto-3">Nada aqui agora</li>}
                  </ul>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </Canvas>
  )
}

/** Card do trabalho: o card inteiro abre a conversa; o botão de aprovar fica por cima do link. */
function CartaoTrabalho({ trabalho }: { trabalho: TrabalhoParceiro }) {
  const marca = useMarca()
  const { aprovarEntrega } = useParceiros()
  const parceiro = getParceiro(trabalho.parceiro)
  if (!parceiro) return null
  const conversa = `/marca/${marca.slug}/parceiros/mensagens/${trabalho.id}` as Route

  return (
    <article
      aria-labelledby={`trabalho-${trabalho.id}`}
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl bg-superficie p-3.5 transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)",
      )}
    >
      <div className="flex flex-col gap-1">
        {trabalho.projeto && (
          <p className="flex items-center gap-1 text-micro text-texto-3">
            <FolderKanban className="size-3 shrink-0" strokeWidth={2} aria-hidden />
            <span className="truncate">{trabalho.projeto}</span>
          </p>
        )}
        <h3 id={`trabalho-${trabalho.id}`} className="text-sm leading-snug font-semibold">
          <Link href={conversa} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto">
            {trabalho.titulo}
          </Link>
        </h3>
        <p className="flex min-w-0 items-center gap-1.5 text-xs text-texto-2">
          <AvatarParceiro parceiro={parceiro} tamanho={20} />
          <span className="truncate">{parceiro.nome}</span>
        </p>
      </div>
      <p className="flex flex-col text-xs">
        <span className={cn("tabular-nums", trabalho.valor ? "font-semibold" : "text-texto-3")}>{trabalho.valor ? formatarReal(trabalho.valor) : "Sem valor ainda"}</span>
        <span className="text-texto-3">{trabalho.prazo}</span>
      </p>
      {trabalho.etapa === "andamento" && trabalho.progresso !== undefined && (
        <div className="flex items-center gap-2" aria-label={`${trabalho.progresso}% feito`}>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-preenchimento-ativo">
            <span className="block h-full rounded-full bg-texto" style={{ width: `${trabalho.progresso}%` }} />
          </span>
          <span className="text-micro text-texto-3 tabular-nums">{trabalho.progresso}%</span>
        </div>
      )}
      {trabalho.etapa === "revisao" && (
        <Botao
          variante="primario"
          tamanho="sm"
          className="relative z-10 w-full"
          onClick={() => {
            aprovarEntrega(trabalho.id)
            notificar({ titulo: "entrega aprovada", texto: `Guardei os arquivos na biblioteca e liberei o pagamento para ${primeiroNome(parceiro)}.`, som: "tcharam" })
          }}
        >
          <Check /> Aprovar entrega
        </Botao>
      )}
      {trabalho.etapa === "proposta" && (
        <Botao variante="primario" tamanho="sm" className="relative z-10 w-full" asChild>
          <Link href={conversa}>Ver proposta</Link>
        </Botao>
      )}
    </article>
  )
}
