"use client"

import { Compass, Crown, Feather, Flame, HandHeart, Lightbulb, Shield, Smile, Sparkles, Sun, TriangleAlert, Users, Wand2, type LucideIcon } from "lucide-react"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import { cn } from "@/lib/utils"
import type { Arquetipo, Atributo, Marca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto } from "./AcoesPonto"

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

/* ---------- Personalidade: o jeito da marca em palavras ---------- */

/**
 * Personalidade: o clima da marca em poucas palavras, cada uma com uma explicação curta e um exemplo na prática.
 * Vem antes da voz e do visual. Nas opções avançadas, "se a marca fosse" uma pessoa, um lugar, um som e um material.
 */
export function SecaoPersonalidadeMarca({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "personalidade") return null
  const { resumo, tracos, seFosse } = secao.conteudo

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-jeito" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-jeito" titulo="o jeito da marca" quantidade={tracos.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <p className="max-w-[62ch] text-destaque font-light">{resumo}</p>
        <ul className="grid grid-cols-1 gap-3 @2xl:grid-cols-2 @5xl:grid-cols-3">
          {tracos.map((traco) => (
            <li key={traco.id} className="flex min-w-0">
              <article aria-labelledby={`traco-${traco.id}`} className="flex w-full flex-col gap-2 rounded-3xl bg-superficie p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 id={`traco-${traco.id}`} className="font-heading text-titulo-2 font-medium lowercase">
                    {traco.palavra}
                  </h3>
                  <MenuPonto ponto={traco.palavra.toLowerCase()} className="-me-2" />
                </div>
                <p className="text-sm">{traco.explicacao}</p>
                <p className="mt-auto pt-2 text-xs text-texto-2">
                  <span className="font-semibold text-texto">Na prática: </span>
                  {traco.naPratica}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <VerMais resumo={`Se a ${marca.nome} fosse uma pessoa, um lugar, um som e um material`}>
        <section aria-labelledby="titulo-se-fosse" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-se-fosse" titulo={`se a ${marca.nome.toLowerCase()} fosse`} />
          <dl className="grid grid-cols-1 gap-3 @2xl:grid-cols-2">
            {seFosse.map((item) => (
              <div key={item.titulo} className="flex flex-col gap-1 rounded-3xl bg-superficie p-5">
                <dt className="text-xs font-semibold text-texto-2">{item.titulo}</dt>
                <dd className="text-sm">{item.texto}</dd>
              </div>
            ))}
          </dl>
        </section>
      </VerMais>
    </div>
  )
}

/* ---------- Arquétipo ---------- */

/**
 * Arquétipo: à vista, só a mistura, em uma frase, com a barra de proporção e o lema de cada arquétipo.
 * Nas opções avançadas: o card de cada um (o que é e como aparece na marca), motivação, desejo, medo,
 * comportamentos e o cuidado com o exagero.
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
          <MenuPonto ponto="a mistura" />
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{mistura}</p>
          <div className="flex flex-col gap-2.5 border-t border-borda-sutil pt-4">
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={partes.map((parte) => `${parte.nome} ${parte.peso}%`).join(", ")}>
              {partes.map((parte, indice) => (
                <span key={parte.id} className={cn("h-full rounded-full", indice === 0 ? "bg-texto" : "bg-cinza-medio")} style={{ width: `${parte.peso}%` }} />
              ))}
            </div>
            <ul className="flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm" aria-hidden>
              {partes.map((parte, indice) => (
                <li key={parte.id} className={cn("flex flex-col gap-0.5", indice > 0 && "sm:items-end sm:text-end")}>
                  <span className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", indice === 0 ? "bg-texto" : "bg-cinza-medio")} />
                    <span className="font-medium">{parte.nome}</span>
                    <span className="text-texto-2 tabular-nums">
                      {parte.peso}% · {indice === 0 ? "primário" : "secundário"}
                    </span>
                  </span>
                  <span className="text-xs text-texto-2">{parte.lema}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <VerMais resumo={`O que é cada arquétipo, como aparece na ${marca.nome}, motivação, medo e comportamentos`}>
        <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
          {partes.map((arquetipo, indice) => (
            <li key={arquetipo.id} className="flex min-w-0">
              <CartaoArquetipo arquetipo={arquetipo} papel={indice === 0 ? "primário" : "secundário"} marca={marca} />
            </li>
          ))}
        </ul>
        {partes.map((arquetipo) => (
          <DetalheArquetipo key={arquetipo.id} arquetipo={arquetipo} />
        ))}
      </VerMais>
    </div>
  )
}

function CartaoArquetipo({ arquetipo, papel, marca }: { arquetipo: Arquetipo; papel: "primário" | "secundário"; marca: Marca }) {
  const Icone = ICONE_ARQUETIPO[arquetipo.id] ?? Sparkles
  const titulo = `arquetipo-${arquetipo.id}`
  return (
    <article aria-labelledby={titulo} className="flex w-full flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex items-start gap-4">
        <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-preenchimento-ativo">
          <Icone className="size-5" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 id={titulo} className="font-heading text-titulo-2 font-medium lowercase">
              {arquetipo.nome}
            </h3>
            <Tag tamanho="sm">
              {papel} · {arquetipo.peso}%
            </Tag>
          </div>
          <p className="text-sm text-texto-2">{arquetipo.lema}</p>
        </div>
        <MenuPonto ponto={`o arquétipo ${arquetipo.nome}`} className="-me-2 -mt-1" />
      </header>
      <div className="flex flex-col gap-4 border-t border-borda-sutil pt-4">
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-semibold text-texto-2">O que é</h4>
          <p className="text-sm">{arquetipo.essencia}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xs font-semibold text-texto-2">Na {marca.nome}</h4>
          <p className="text-sm">{arquetipo.naMarca}</p>
        </div>
      </div>
    </article>
  )
}

function DetalheArquetipo({ arquetipo }: { arquetipo: Arquetipo }) {
  const id = `detalhe-arquetipo-${arquetipo.id}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <CabecalhoBloco id={id} titulo={`${arquetipo.nome.toLowerCase()} em detalhe`} />
      <div className="grid grid-cols-1 gap-5 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-2 @3xl:gap-0">
        <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-[96px_1fr] @3xl:pe-6">
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
        <div className="flex flex-col gap-3 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
          <h4 className="text-xs font-semibold text-texto-2">Comportamentos</h4>
          <ul className="flex flex-col gap-1.5">
            {arquetipo.comportamentos.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-texto-2">
                <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-texto-3" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="flex gap-2.5 border-t border-borda-sutil pt-4 text-sm text-texto-2 @3xl:col-span-2 @3xl:mt-5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-atencao-texto" strokeWidth={2} aria-hidden />
          <span>
            <span className="font-semibold text-texto">Cuidado com o exagero. </span>
            {arquetipo.exagero}
          </span>
        </p>
      </div>
    </section>
  )
}

/* ---------- Atributos: forças da marca em frases ---------- */

/**
 * Atributos: as forças da marca, cada uma numa frase. O card mostra a frase, o nome curto e o que significa;
 * como aparece na marca e onde se vê ficam nas opções avançadas.
 */
export function SecaoAtributos({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "atributos") return null
  const { resumo, atributos } = secao.conteudo

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-atributos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-atributos" titulo="as forças da marca" quantidade={atributos.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <p className="max-w-[70ch] text-sm text-texto-2">{resumo}</p>
        <ol className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
          {atributos.map((atributo, indice) => (
            <li key={atributo.id} className="flex min-w-0">
              <CartaoAtributo atributo={atributo} numero={indice + 1} />
            </li>
          ))}
        </ol>
      </section>

      <VerMais resumo={`Como cada força aparece na ${marca.nome}: rótulo, atendimento, posts`}>
        {atributos.map((atributo) => (
          <DetalheAtributo key={atributo.id} atributo={atributo} marca={marca} />
        ))}
      </VerMais>
    </div>
  )
}

function CartaoAtributo({ atributo, numero }: { atributo: Atributo; numero: number }) {
  return (
    <article aria-labelledby={`atributo-${atributo.id}`} className="flex w-full flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
      <p className="flex items-center gap-2 text-xs text-texto-3 tabular-nums">
        {String(numero).padStart(2, "0")}
        <span className="font-semibold text-texto-2">{atributo.nome}</span>
        {atributo.arquetipo && <Tag tamanho="sm">do {atributo.arquetipo}</Tag>}
        <MenuPonto ponto={atributo.nome} className="-my-1 -me-2 ms-auto" />
      </p>
      <h3 id={`atributo-${atributo.id}`} className="text-destaque leading-snug font-medium">
        {atributo.titulo}
      </h3>
      <p className="text-sm text-texto-2">{atributo.significado}</p>
    </article>
  )
}

function DetalheAtributo({ atributo, marca }: { atributo: Atributo; marca: Marca }) {
  const id = `detalhe-atributo-${atributo.id}`
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3">
      <h3 id={id} className="text-sm font-semibold">
        {atributo.nome}
      </h3>
      <div className="grid grid-cols-1 gap-5 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @3xl:gap-0">
        <div className="flex flex-col gap-1 @3xl:pe-6">
          <h4 className="text-xs font-semibold text-texto-2">Como aparece na {marca.nome}</h4>
          <p className="text-sm">{atributo.naMarca}</p>
        </div>
        <div className="flex flex-col gap-2 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
          <h4 className="text-xs font-semibold text-texto-2">Onde se vê</h4>
          <dl className="flex flex-col">
            {atributo.ondeSeVe.map((item) => (
              <div key={item.onde} className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 border-t border-borda-sutil py-2 first:border-t-0 first:pt-0">
                <dt className="pt-0.5 text-xs text-texto-3">{item.onde}</dt>
                <dd className="text-sm text-texto-2">{item.como}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
