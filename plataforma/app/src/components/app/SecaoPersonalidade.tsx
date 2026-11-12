"use client"

import { Compass, Crown, Feather, Flame, HandHeart, Lightbulb, Shield, Smile, Sparkles, Sun, TriangleAlert, Users, Wand2, type LucideIcon } from "lucide-react"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { Arquetipo, Atributo, Marca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/** Ícone de cada um dos 12 arquétipos clássicos. */
const ICONE_ARQUETIPO: Record<string, LucideIcon> = {
  cuidador: HandHeart,
  explorador: Compass,
  sabio: Lightbulb,
  criador: Feather,
  mago: Wand2,
  heroi: Shield,
  governante: Crown,
  inocente: Sun,
  "cara-comum": Users,
  amante: Flame,
  bobo: Smile,
  rebelde: Sparkles,
}

/**
 * Arquétipo: a mistura em uma frase e uma barra de proporção; depois um card para o primário e outro para o secundário,
 * cada um com a essência do arquétipo, motivação, desejo e medo, como a marca age dentro dele e o cuidado com o exagero.
 */
export function SecaoArquetipos({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "arquetipos") return null
  const { mistura, primario, secundario } = secao.conteudo
  const partes = [primario, secundario].filter(Boolean) as Arquetipo[]

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-mistura" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-mistura" titulo="a mistura">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{mistura}</p>
          <div className="flex flex-col gap-2.5 border-t border-borda-sutil pt-4">
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={partes.map((parte) => `${parte.nome} ${parte.peso}%`).join(", ")}>
              {partes.map((parte, indice) => (
                <span key={parte.id} className={cn("h-full rounded-full", indice === 0 ? "bg-texto" : "bg-cinza-medio")} style={{ width: `${parte.peso}%` }} />
              ))}
            </div>
            <ul className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm" aria-hidden>
              {partes.map((parte, indice) => (
                <li key={parte.id} className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", indice === 0 ? "bg-texto" : "bg-cinza-medio")} />
                  <span className="font-medium">{parte.nome}</span>
                  <span className="text-texto-2 tabular-nums">
                    {parte.peso}% · {indice === 0 ? "primário" : "secundário"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {partes.map((arquetipo, indice) => (
        <CartaoArquetipo key={arquetipo.id} arquetipo={arquetipo} papel={indice === 0 ? "primário" : "secundário"} marca={marca} />
      ))}
    </div>
  )
}

function CartaoArquetipo({ arquetipo, papel, marca }: { arquetipo: Arquetipo; papel: "primário" | "secundário"; marca: Marca }) {
  const Icone = ICONE_ARQUETIPO[arquetipo.id] ?? Sparkles
  const titulo = `arquetipo-${arquetipo.id}`
  return (
    <section aria-labelledby={titulo} className="flex flex-col gap-3">
      <CabecalhoBloco id={`${titulo}-bloco`} titulo={`arquétipo ${papel}`} />
      <article className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
        <header className="flex items-start gap-4">
          <span aria-hidden className={cn("grid shrink-0 place-items-center rounded-full bg-preenchimento-ativo", papel === "primário" ? "size-14" : "size-12")}>
            <Icone className={papel === "primário" ? "size-6" : "size-5"} strokeWidth={1.75} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 id={titulo} className={cn("font-heading font-medium lowercase", papel === "primário" ? "text-titulo-1" : "text-titulo-2")}>
                {arquetipo.nome}
              </h3>
              <Tag tamanho="sm">
                {papel} · {arquetipo.peso}%
              </Tag>
            </div>
            <p className="text-sm text-texto-2">{arquetipo.lema}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 border-t border-borda-sutil pt-4 @3xl:grid-cols-2 @3xl:gap-0">
          <div className="flex flex-col gap-4 @3xl:pe-6">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-semibold text-texto-2">O que é</h4>
              <p className="text-corpo">{arquetipo.essencia}</p>
            </div>
            <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-[96px_1fr]">
              {[
                ["Motivação", arquetipo.motivacao],
                ["Desejo", arquetipo.desejo],
                ["Medo", arquetipo.medo],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="contents">
                  <dt className="text-xs text-texto-3 sm:pt-0.5">{rotulo}</dt>
                  <dd className="text-sm">{valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-3 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
            <h4 className="text-xs font-semibold text-texto-2">
              Como a {marca.nome} age como {arquetipo.nome}
            </h4>
            <p className="text-sm">{arquetipo.naMarca}</p>
            <ul className="flex flex-col gap-1.5">
              {arquetipo.comportamentos.map((comportamento) => (
                <li key={comportamento} className="flex gap-2 text-sm text-texto-2">
                  <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-texto-3" />
                  {comportamento}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="flex gap-2.5 border-t border-borda-sutil pt-4 text-sm text-texto-2">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-atencao-texto" strokeWidth={2} aria-hidden />
          <span>
            <span className="font-semibold text-texto">Cuidado com o exagero. </span>
            {arquetipo.exagero}
          </span>
        </p>
      </article>
    </section>
  )
}

/**
 * Atributos: um bloco por atributo. À esquerda, número, nome e a frase-título; à direita, o que significa,
 * como aparece na marca e onde se vê (rótulo, atendimento, posts…).
 */
export function SecaoAtributos({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "atributos") return null
  const { resumo, atributos } = secao.conteudo

  return (
    <section aria-labelledby="titulo-atributos" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-atributos" titulo="como a marca é" quantidade={atributos.length}>
        <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
          <p>{secao.porque}</p>
        </PorqueHattie>
      </CabecalhoBloco>
      <p className="max-w-[70ch] text-sm text-texto-2">{resumo}</p>
      <ol className="flex flex-col gap-3">
        {atributos.map((atributo, indice) => (
          <li key={atributo.id}>
            <CartaoAtributo atributo={atributo} numero={indice + 1} marca={marca} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function CartaoAtributo({ atributo, numero, marca }: { atributo: Atributo; numero: number; marca: Marca }) {
  return (
    <article
      aria-labelledby={`atributo-${atributo.id}`}
      className="grid grid-cols-1 gap-5 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @3xl:gap-0"
    >
      <header className="flex flex-col gap-2 @3xl:pe-6">
        <p className="flex items-center gap-2 text-xs text-texto-3 tabular-nums">
          {String(numero).padStart(2, "0")}
          {atributo.arquetipo && <Tag tamanho="sm">do {atributo.arquetipo}</Tag>}
        </p>
        <h3 id={`atributo-${atributo.id}`} className="font-heading text-titulo-2 font-medium lowercase">
          {atributo.nome}
        </h3>
        <p className="text-destaque font-light">{atributo.titulo}</p>
      </header>

      <div className="flex flex-col gap-4 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-semibold text-texto-2">O que significa</h4>
          <p className="text-sm">{atributo.significado}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-semibold text-texto-2">Como aparece na {marca.nome}</h4>
          <p className="text-sm">{atributo.naMarca}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-semibold text-texto-2">Onde se vê</h4>
          <dl className="flex flex-col">
            {atributo.ondeSeVe.map((item) => (
              <div key={item.onde} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-borda-sutil py-2 first:border-t-0 first:pt-0">
                <dt className="text-xs text-texto-3 pt-0.5">{item.onde}</dt>
                <dd className="text-sm text-texto-2">{item.como}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  )
}
