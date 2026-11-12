"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState } from "react"
import { ArrowLeft, BadgeCheck, Clock, Languages, Link2, MapPin, Send, Sparkle, Star } from "lucide-react"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { notificar } from "@/components/hattie/Notificacao"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import { getParceiro, precoDoParceiro, type AvaliacaoParceiro } from "@/lib/mock"
import { CabecalhoBloco } from "../Blocos"
import { Canvas } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { AvatarParceiro, JanelaContratar, MiniaturaTrabalho, nota, primeiroNome } from "./Comuns"

function Estrelas({ valor, tamanho = 14 }: { valor: number; tamanho?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Nota ${nota(valor)} de 5`} role="img">
      {[1, 2, 3, 4, 5].map((posicao) => (
        <Star
          key={posicao}
          aria-hidden
          style={{ width: tamanho, height: tamanho }}
          strokeWidth={0}
          className={cn("fill-current", valor >= posicao - 0.25 ? "text-preto" : "text-preenchimento-ativo")}
        />
      ))}
    </span>
  )
}

/**
 * Perfil do parceiro, como uma rede profissional: capa, foto, nome e selos, título e local;
 * card de contratação com preço, especialidades, nota e tempo de resposta; sobre, trabalhos,
 * serviços com preço e prazo, experiência e avaliações de outras marcas.
 */
export function PerfilParceiro({ id }: { id: string }) {
  const marca = useMarca()
  const parceiro = getParceiro(id)
  const [contratando, setContratando] = useState(false)
  if (!parceiro) return null
  const preco = precoDoParceiro(parceiro)
  const nome = primeiroNome(parceiro)

  return (
    <Canvas rotulo={`Perfil de ${parceiro.nome}`}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
          <div className="flex flex-col">
            <Link href={`/marca/${marca.slug}/parceiros` as Route} className="mb-4 flex items-center gap-2 self-start text-sm font-medium text-texto-2 hover:text-texto">
              <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
              Parceiros
            </Link>
            <div className="h-28 overflow-hidden rounded-3xl md:h-40" aria-hidden>
              <BlocoImagem className="size-full rounded-none outline-0" fundo={parceiro.capa[0]} cor={parceiro.capa[1]} borda="right" />
            </div>
            <header className="flex flex-col gap-3 px-1 md:px-5">
              <div className="flex items-end justify-between gap-3">
                <AvatarParceiro parceiro={parceiro} tamanho={104} className="relative -mt-12 ring-6 ring-canvas md:-mt-14" />
                <Botao
                  variante="fantasma"
                  tamanho="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href)
                    notificar({ titulo: "link copiado", texto: `Mande o perfil de ${nome} para quem decide com você.`, tipo: "sucesso" })
                  }}
                >
                  <Link2 /> Copiar link
                </Botao>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {parceiro.destaque && (
                    <Tag>
                      <Sparkle className="fill-current" /> Parceiro destaque
                    </Tag>
                  )}
                  <Tag>
                    <BadgeCheck /> Verificado pelo Hattie
                  </Tag>
                </div>
                <h1 className="font-heading text-titulo-2 font-medium md:text-titulo-1">{parceiro.nome}</h1>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-texto-2">
                  <span>@{parceiro.usuario}</span>
                  <span aria-hidden>·</span>
                  <span>No Hattie desde {parceiro.desde}</span>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" strokeWidth={2} aria-hidden />
                    {parceiro.cidade}, {parceiro.pais}
                  </span>
                </p>
                <p className="max-w-[60ch] text-destaque font-light">{parceiro.titulo}</p>
              </div>
            </header>
          </div>

          <section aria-label="Contratar" className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[minmax(0,1fr)_17rem] @3xl:gap-0">
            <div className="flex flex-col gap-4 @3xl:pe-6">
              {parceiro.disponivel ? (
                <Tag tom="sucesso" ponto className="self-start">
                  Aceitando projetos
                </Tag>
              ) : (
                <Tag tom="atencao" ponto className="self-start">
                  {parceiro.agenda}
                </Tag>
              )}
              <div className="flex flex-col">
                <p className="font-heading text-titulo-2 font-medium md:text-titulo-1">{preco.valor}</p>
                <p className="text-sm text-texto-2">{preco.modelo === "valor combinado no pedido" ? "O valor sai na proposta, depois do seu pedido" : preco.modelo}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {parceiro.especialidades.map((especialidade) => (
                  <Tag key={especialidade} tamanho="lg">
                    {especialidade}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
              <div className="flex items-center gap-2">
                <Estrelas valor={parceiro.nota} />
                <span className="text-sm font-semibold tabular-nums">{nota(parceiro.nota)}</span>
                <span className="text-xs text-texto-3">{parceiro.avaliacoes} avaliações</span>
              </div>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-texto-3" strokeWidth={1.75} aria-hidden />
                  <dt className="sr-only">Tempo de resposta</dt>
                  <dd>Responde {parceiro.resposta}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="size-4 text-texto-3" strokeWidth={1.75} aria-hidden />
                  <dt className="sr-only">Idiomas</dt>
                  <dd>{parceiro.idiomas.join(", ")}</dd>
                </div>
              </dl>
              <Botao variante="primario" className="w-full" onClick={() => setContratando(true)}>
                <Send /> Contratar {nome}
              </Botao>
              <p className="text-xs text-texto-3">Conversar é grátis. Você só paga quando aprovar a proposta.</p>
            </div>
          </section>

          <section aria-labelledby="titulo-sobre" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-sobre" titulo="sobre" />
            <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
              <p className="max-w-[70ch] text-sm leading-relaxed">{parceiro.bio}</p>
              <dl className="grid grid-cols-2 gap-y-4 border-t border-borda-sutil pt-4 @3xl:grid-cols-3">
                {[
                  ["Projetos entregues", String(parceiro.projetos)],
                  ["Anos de experiência", String(parceiro.anos)],
                  ["Costuma atender", parceiro.nichos.join(", ")],
                ].map(([rotulo, valor]) => (
                  <div key={rotulo} className="flex flex-col gap-0.5 pe-4">
                    <dt className="text-xs text-texto-3">{rotulo}</dt>
                    <dd className={cn(rotulo === "Costuma atender" ? "text-sm" : "font-heading text-titulo-3 font-medium tabular-nums")}>{valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section aria-labelledby="titulo-trabalhos" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-trabalhos" titulo="trabalhos" quantidade={parceiro.trabalhos.length} />
            <ul className="grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2 @4xl:grid-cols-3">
              {parceiro.trabalhos.map((trabalho) => (
                <li key={trabalho.id} className="flex flex-col gap-2">
                  <MiniaturaTrabalho trabalho={trabalho} className="aspect-[4/3] rounded-2xl" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{trabalho.titulo}</span>
                    <span className="text-xs text-texto-2">{trabalho.cliente}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="titulo-servicos" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-servicos" titulo="serviços e preços" quantidade={parceiro.servicos.length} />
            <ul className="flex flex-col rounded-3xl bg-superficie p-5 md:p-6">
              {parceiro.servicos.map((servico) => (
                <li
                  key={servico.nome}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-t border-borda-sutil py-3.5 first:border-t-0 first:pt-0 last:pb-0 @3xl:grid-cols-[minmax(0,1fr)_10rem_7rem] @3xl:items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{servico.nome}</span>
                    <span className="text-xs text-texto-2">{servico.inclui}</span>
                  </div>
                  <span className="order-3 col-span-2 text-xs text-texto-3 @3xl:order-none @3xl:col-span-1 @3xl:text-sm @3xl:text-texto-2">Prazo: {servico.prazo}</span>
                  <span className="text-end text-sm font-semibold tabular-nums">{servico.preco}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="titulo-experiencia" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-experiencia" titulo="experiência" />
            <ol className="flex flex-col rounded-3xl bg-superficie p-5 md:p-6">
              {parceiro.experiencia.map((item, indice) => (
                <li key={item.periodo} className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
                  <span aria-hidden className={cn("mt-1.5 size-2.5 justify-self-center rounded-full", indice === 0 ? "bg-preto" : "bg-preenchimento-ativo")} />
                  {indice < parceiro.experiencia.length - 1 && <span aria-hidden className="absolute top-5 bottom-0 left-[9.5px] w-px bg-borda-sutil" />}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.cargo}</span>
                    <span className="text-xs text-texto-2">
                      {item.lugar} · {item.periodo}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="titulo-avaliacoes" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-avaliacoes" titulo="avaliações" quantidade={parceiro.avaliacoes}>
              <span className="flex items-center gap-2">
                <Estrelas valor={parceiro.nota} />
                <span className="text-sm font-semibold tabular-nums">{nota(parceiro.nota)}</span>
              </span>
            </CabecalhoBloco>
            <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
              {parceiro.depoimentos.map((avaliacao) => (
                <li key={`${avaliacao.autor}-${avaliacao.quando}`} className="flex min-w-0">
                  <CartaoAvaliacao avaliacao={avaliacao} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <JanelaContratar parceiro={parceiro} aberta={contratando} aoMudar={setContratando} />
    </Canvas>
  )
}

function CartaoAvaliacao({ avaliacao }: { avaliacao: AvaliacaoParceiro }) {
  return (
    <article className="flex w-full flex-col gap-3 rounded-3xl bg-superficie p-5">
      <Estrelas valor={avaliacao.nota} tamanho={12} />
      <p className="text-sm leading-relaxed">“{avaliacao.texto}”</p>
      <p className="mt-auto text-xs text-texto-2">
        <span className="font-semibold text-texto">{avaliacao.autor}</span> · {avaliacao.marca} · {avaliacao.quando}
      </p>
    </article>
  )
}
