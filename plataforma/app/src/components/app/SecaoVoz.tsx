"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Mail, MessageCircle, MousePointerClick, Quote, SquareLibrary, Type, X, type LucideIcon } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { cn } from "@/lib/utils"
import type { ExemploVoz, GuiaVoz, Marca, Secao, TipoExemplo } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { corDoTexto } from "./PreviaSecao"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

const TIPOS: { id: TipoExemplo; rotulo: string; icone: LucideIcon }[] = [
  { id: "fala", rotulo: "Falas", icone: MessageCircle },
  { id: "post", rotulo: "Posts", icone: SquareLibrary },
  { id: "legenda", rotulo: "Legendas", icone: Type },
  { id: "cta", rotulo: "Chamadas", icone: MousePointerClick },
  { id: "email", rotulo: "E-mails", icone: Mail },
]

/**
 * Tom de voz em cinco blocos:
 * 1. Como a marca fala: introdução, traços e um espectro de tom.
 * 2. Exemplos: abas por tipo (falas, posts, legendas, chamadas, e-mails); cada aba é um carrossel de cards
 *    que imitam o canal, com botão de copiar.
 * 3. Faça e evite, com um exemplo em cada regra.
 * 4. Glossário e 5. palavras que a marca evita, com a troca e o motivo.
 */
export function SecaoVoz({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "voz") return null
  const guia = secao.conteudo

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-voz" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-voz" titulo="como a marca fala">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{guia.intro}</p>
          <div className="grid grid-cols-1 gap-6 border-t border-borda-sutil pt-4 @3xl:grid-cols-2 @3xl:gap-0">
            <div className="flex flex-col gap-3 @3xl:pe-6">
              <h3 className="text-xs font-semibold text-texto-2">Traços da voz</h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {guia.tracos.map((traco) => (
                  <div key={traco.nome} className="flex flex-col gap-0.5">
                    <dt className="text-sm font-semibold">{traco.nome}</dt>
                    <dd className="text-sm text-texto-2">{traco.descricao}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="flex flex-col gap-3 @3xl:border-s @3xl:border-borda-sutil @3xl:ps-6">
              <h3 className="text-xs font-semibold text-texto-2">Onde ela fica</h3>
              <Espectro linhas={guia.espectro} />
            </div>
          </div>
        </div>
      </section>

      <Exemplos exemplos={guia.exemplos} marca={marca} />

      <section aria-labelledby="titulo-regras" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-regras" titulo="faça e evite" />
        <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-2 @3xl:gap-0">
          <Regras titulo="Faça" regras={guia.faca} tipo="faca" />
          <Regras titulo="Evite" regras={guia.evite} tipo="evite" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-10 @4xl:grid-cols-2 @4xl:gap-3">
        <Glossario glossario={guia.glossario} />
        <Proibidas proibidas={guia.proibidas} />
      </div>
    </div>
  )
}

function Espectro({ linhas }: { linhas: GuiaVoz["espectro"] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {linhas.map((linha) => {
        const lado = linha.valor >= 50 ? linha.direita : linha.esquerda
        const outro = linha.valor >= 50 ? linha.esquerda : linha.direita
        const forca = Math.abs(linha.valor - 50) > 30 ? "bem mais" : "mais"
        return (
          <li key={linha.esquerda} className="grid grid-cols-[72px_minmax(0,1fr)_72px] items-center gap-2.5 text-xs sm:grid-cols-[96px_minmax(0,1fr)_96px] sm:gap-3">
            <span className={cn("text-end", linha.valor < 50 ? "font-semibold text-texto" : "text-texto-3")}>{linha.esquerda}</span>
            <span className="relative h-1.5 rounded-full bg-preenchimento-ativo" aria-hidden>
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-superficie" />
              <span
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-texto ring-2 ring-superficie"
                style={{ left: `${linha.valor}%` }}
              />
            </span>
            <span className={cn(linha.valor >= 50 ? "font-semibold text-texto" : "text-texto-3")}>{linha.direita}</span>
            <span className="sr-only">
              {forca} {lado.toLowerCase()} que {outro.toLowerCase()}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function Exemplos({ exemplos, marca }: { exemplos: ExemploVoz[]; marca: Marca }) {
  return (
    <section aria-labelledby="titulo-exemplos" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-exemplos" titulo="exemplos" quantidade={exemplos.length} />
      <Abas defaultValue="fala">
        <ListaAbas
          rotulo="Tipos de exemplo"
          itens={TIPOS.map((tipo) => ({
            valor: tipo.id,
            rotulo: tipo.rotulo,
            icone: tipo.icone,
            quantidade: exemplos.filter((exemplo) => exemplo.tipo === tipo.id).length,
          }))}
        />
        {TIPOS.map((tipo) => (
          <ConteudoAba key={tipo.id} value={tipo.id}>
            <Carrossel rotulo={tipo.rotulo}>
              {exemplos
                .filter((exemplo) => exemplo.tipo === tipo.id)
                .map((exemplo) => (
                  <CartaoExemplo key={exemplo.id} exemplo={exemplo} marca={marca} />
                ))}
            </Carrossel>
          </ConteudoAba>
        ))}
      </Abas>
    </section>
  )
}

/** Trilho horizontal com encaixe por card e setas que andam um card por vez. */
function Carrossel({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  const trilho = useRef<HTMLDivElement>(null)
  const [pontas, setPontas] = useState({ inicio: true, fim: false })

  useEffect(() => {
    const elemento = trilho.current
    if (!elemento) return
    const medir = () =>
      setPontas({
        inicio: elemento.scrollLeft <= 4,
        fim: elemento.scrollLeft + elemento.clientWidth >= elemento.scrollWidth - 4,
      })
    medir()
    elemento.addEventListener("scroll", medir, { passive: true })
    const observador = new ResizeObserver(medir)
    observador.observe(elemento)
    return () => {
      elemento.removeEventListener("scroll", medir)
      observador.disconnect()
    }
  }, [])

  function andar(direcao: 1 | -1) {
    const elemento = trilho.current
    const primeiro = elemento?.firstElementChild as HTMLElement | null
    if (!elemento || !primeiro) return
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    elemento.scrollBy({ left: direcao * (primeiro.offsetWidth + 12), behavior: reduzir ? "auto" : "smooth" })
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={trilho}
        role="region"
        aria-label={`Exemplos: ${rotulo}`}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-3xl outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {children}
      </div>
      {!(pontas.inicio && pontas.fim) && (
        <div className="flex justify-end gap-1">
          <Botao variante="secundario" tamanho="icone-sm" aria-label="Exemplo anterior" disabled={pontas.inicio} onClick={() => andar(-1)}>
            <ChevronLeft />
          </Botao>
          <Botao variante="secundario" tamanho="icone-sm" aria-label="Próximo exemplo" disabled={pontas.fim} onClick={() => andar(1)}>
            <ChevronRight />
          </Botao>
        </div>
      )}
    </div>
  )
}

function copiar(texto: string) {
  navigator.clipboard?.writeText(texto)
  notificar({ titulo: "texto copiado", texto: "É só colar onde você for usar.", tipo: "sucesso" })
}

function CartaoExemplo({ exemplo, marca }: { exemplo: ExemploVoz; marca: Marca }) {
  const fundo = marca.paleta[0].hex
  const creme = marca.paleta[2]?.hex ?? "#F5F5F5"
  const textoCompleto = [exemplo.titulo, exemplo.texto, exemplo.extra].filter(Boolean).join("\n\n")
  const iniciais = marca.nome
    .split(" ")
    .map((parte) => parte[0])
    .join("")

  return (
    <article
      aria-label={exemplo.situacao}
      className={cn(
        "flex shrink-0 snap-start flex-col gap-4 rounded-3xl bg-superficie p-5",
        exemplo.tipo === "cta" ? "w-[min(260px,80%)]" : "w-[min(320px,86%)]",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-texto-2">{exemplo.situacao}</p>
        <Botao variante="fantasma" tamanho="icone-sm" className="-me-2 -mt-1.5" aria-label={`Copiar: ${exemplo.situacao}`} onClick={() => copiar(textoCompleto)}>
          <Copy />
        </Botao>
      </header>

      {exemplo.tipo === "fala" && (
        <div className="flex flex-1 flex-col gap-2">
          <p className="flex items-center gap-2 text-xs text-texto-3">
            <span aria-hidden className="grid size-5 place-items-center rounded-full text-micro font-semibold" style={{ backgroundColor: fundo, color: corDoTexto(fundo) }}>
              {iniciais}
            </span>
            {marca.nome} · WhatsApp
          </p>
          <p className="rounded-2xl rounded-tl-md bg-preenchimento px-3.5 py-3 text-sm">{exemplo.texto}</p>
        </div>
      )}

      {exemplo.tipo === "post" && (
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex aspect-square flex-col justify-end gap-2 rounded-2xl p-5" style={{ backgroundColor: fundo, color: creme }}>
            <p className="font-serif text-titulo-2 leading-tight">{exemplo.titulo}</p>
            <p className="text-sm opacity-90">{exemplo.texto}</p>
          </div>
        </div>
      )}

      {exemplo.tipo === "legenda" && (
        <div className="flex flex-1 flex-col gap-2">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <span aria-hidden className="grid size-5 place-items-center rounded-full text-micro" style={{ backgroundColor: fundo, color: corDoTexto(fundo) }}>
              {iniciais}
            </span>
            {marca.nome.toLowerCase().replace(/\s/g, "")}
          </p>
          <p className="text-sm">{exemplo.texto}</p>
          {exemplo.extra && <p className="text-sm text-texto-2">{exemplo.extra}</p>}
        </div>
      )}

      {exemplo.tipo === "cta" && (
        <div className="flex flex-1 items-center justify-center rounded-2xl bg-preenchimento px-4 py-6">
          <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap" style={{ backgroundColor: fundo, color: creme }}>
            {exemplo.texto}
            <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden />
          </span>
        </div>
      )}

      {exemplo.tipo === "email" && (
        <div className="flex flex-1 flex-col gap-3 rounded-2xl bg-preenchimento p-4">
          <div className="flex flex-col gap-0.5 border-b border-borda-sutil pb-2.5">
            <p className="text-xs text-texto-3">Assunto</p>
            <p className="text-sm font-semibold">{exemplo.titulo}</p>
          </div>
          <p className="text-sm">{exemplo.texto}</p>
          {exemplo.extra && <p className="text-sm text-texto-2">{exemplo.extra}</p>}
        </div>
      )}
    </article>
  )
}

function Regras({ titulo, regras, tipo }: { titulo: string; regras: GuiaVoz["faca"]; tipo: "faca" | "evite" }) {
  const Icone = tipo === "faca" ? Check : X
  return (
    <div className={cn("flex flex-col gap-3", tipo === "faca" ? "@3xl:pe-6" : "border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0")}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <span aria-hidden className={cn("grid size-6 place-items-center rounded-full", tipo === "faca" ? "bg-sucesso text-branco" : "bg-erro text-branco")}>
          <Icone className="size-3.5" strokeWidth={2.5} />
        </span>
        {titulo}
      </h3>
      <ul className="flex flex-col">
        {regras.map((regra) => (
          <li key={regra.regra} className="flex flex-col gap-1 border-t border-borda-sutil py-3 first:border-t-0 first:pt-0">
            <p className="text-sm font-medium">{regra.regra}</p>
            <p className={cn("flex gap-1.5 text-sm", tipo === "faca" ? "text-texto-2" : "text-texto-3")}>
              <Quote className="mt-0.5 size-3 shrink-0 text-texto-3" strokeWidth={2.5} aria-hidden />
              <span className={cn(tipo === "evite" && "line-through decoration-erro/70")}>{regra.exemplo}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Glossario({ glossario }: { glossario: GuiaVoz["glossario"] }) {
  return (
    <section aria-labelledby="titulo-glossario" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-glossario" titulo="glossário" quantidade={glossario.length} />
      <dl className="flex flex-1 flex-col rounded-3xl bg-superficie px-5 md:px-6">
        {glossario.map((item) => (
          <div key={item.termo} className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-borda-sutil py-3.5 last:border-b-0">
            <dt className="text-sm font-semibold">{item.termo}</dt>
            <dd className="text-sm text-texto-2">{item.uso}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Proibidas({ proibidas }: { proibidas: GuiaVoz["proibidas"] }) {
  return (
    <section aria-labelledby="titulo-proibidas" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-proibidas" titulo="palavras que a marca evita" quantidade={proibidas.length} />
      <ul className="flex flex-1 flex-col rounded-3xl bg-superficie px-5 md:px-6">
        {proibidas.map((item) => (
          <li key={item.palavra} className="flex flex-col gap-0.5 border-b border-borda-sutil py-3.5 last:border-b-0">
            <p className="flex flex-wrap items-center gap-x-2 text-sm">
              <span className="text-texto-3 line-through decoration-texto-3/60">{item.palavra}</span>
              <ArrowRight className="size-3.5 text-texto-3" strokeWidth={2} aria-label="troca por" />
              <span className="font-semibold">{item.troca}</span>
            </p>
            <p className="text-xs text-texto-3">{item.motivo}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
