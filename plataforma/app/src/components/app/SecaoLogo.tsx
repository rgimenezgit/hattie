"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Check, ChevronDown, Download, MessageCircle, RotateCcw, Sparkles, UserPlus, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { ErroLogo, IdeiaLogo, Marca, Secao, SistemaLogo } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { useEstado } from "./Estado"
import { baixarLogo, Logo, variacoesDeCor, type TipoLogo, type VariacaoCor } from "./Logo"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

const TIPOS: { id: TipoLogo; rotulo: string; altura: number; explica: string }[] = [
  { id: "composta", rotulo: "Composta", altura: 30, explica: "Símbolo e nome juntos. É a versão principal." },
  { id: "simbolo", rotulo: "Símbolo", altura: 56, explica: "Só o desenho, para perfil, tampa e carimbo." },
  { id: "tipografica", rotulo: "Tipográfica", altura: 30, explica: "Só o nome, para onde o símbolo já aparece por perto." },
]

/**
 * Logo em dois momentos.
 * Primeira visita: o briefing do logo e três ideias; escolher uma gera o sistema.
 * Gerado: o logo principal, as versões (composta, símbolo e tipográfica) em todas as cores da paleta,
 * cada uma com baixar, ajustar com o Hattie e pedir a um parceiro; regras de uso; área de proteção e tamanho mínimo.
 */
export function SecaoLogo({ secao, marca, aoEditar }: Props) {
  const { logoEscolhido, escolherLogo, secoes, nomeMarca } = useEstado()
  const [gerando, setGerando] = useState<IdeiaLogo | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  if (secao.conteudo.tipo !== "logo") return null
  const sistema = secao.conteudo
  const aprovada = secoes[secao.id] === "aprovada"
  const nome = marca.slug === "raiz-natural" ? nomeMarca : marca.nome
  const ideia = sistema.ideias.find((item) => item.id === logoEscolhido) ?? (aprovada ? (sistema.ideias.find((item) => item.aposta) ?? sistema.ideias[0]) : undefined)

  function gerar(escolha: IdeiaLogo) {
    setGerando(escolha)
    timer.current = setTimeout(() => {
      escolherLogo(escolha.id)
      setGerando(null)
      notificar({ titulo: "logo pronto", texto: `Gerei o logo a partir da ideia ${escolha.nome}, com todas as versões e cores.`, som: "tcharam" })
    }, 2200)
  }

  if (gerando) return <Gerando ideia={gerando} marca={marca} nome={nome} />

  if (!ideia)
    return (
      <div className="flex flex-col gap-10">
        <Briefing sistema={sistema} secao={secao} aoEditar={aoEditar} />
        <section aria-labelledby="titulo-ideias" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-ideias" titulo="escolha uma ideia" quantidade={sistema.ideias.length}>
            <Botao variante="secundario" tamanho="sm" onClick={aoEditar}>
              <MessageCircle /> Pedir outras<span className="max-sm:sr-only"> ideias</span>
            </Botao>
          </CabecalhoBloco>
          <p className="max-w-[70ch] text-sm text-texto-2">Escolha a ideia que mais combina com a sua marca. Eu gero o logo completo a partir dela: versões, cores e regras.</p>
          <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
            {sistema.ideias.map((item) => (
              <li key={item.id} className="flex min-w-0">
                <CartaoIdeia ideia={item} marca={marca} nome={nome} aoGerar={() => gerar(item)} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    )

  return <Sistema sistema={sistema} ideia={ideia} marca={marca} nome={nome} secao={secao} aoEditar={aoEditar} aoVoltar={() => escolherLogo(null)} />
}

function Briefing({ sistema, secao, aoEditar }: { sistema: SistemaLogo; secao: Secao; aoEditar: () => void }) {
  const { briefing } = sistema
  const colunas: { titulo: string; itens: string[] }[] = [
    { titulo: "Palavras", itens: briefing.palavras },
    { titulo: "Referências", itens: briefing.referencias },
    { titulo: "Evitar", itens: briefing.evitar },
    { titulo: "Onde vai aparecer", itens: briefing.usos },
  ]
  return (
    <section aria-labelledby="titulo-briefing-logo" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-briefing-logo" titulo="briefing do logo">
        <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
          <p>{secao.porque}</p>
        </PorqueHattie>
      </CabecalhoBloco>
      <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
        <p className="max-w-[62ch] text-destaque font-light">{briefing.conceito}</p>
        <dl className="grid grid-cols-1 gap-y-5 border-t border-borda-sutil pt-4 sm:grid-cols-2 @4xl:grid-cols-4">
          {colunas.map((coluna, indice) => (
            <div key={coluna.titulo} className={cn("flex flex-col gap-1.5 pe-4", indice > 0 && "@4xl:border-s @4xl:border-borda-sutil @4xl:ps-4")}>
              <dt className="text-xs font-semibold text-texto-2">{coluna.titulo}</dt>
              <dd>
                <ul className="flex flex-col gap-1 text-sm">
                  {coluna.itens.map((item) => (
                    <li key={item} className={cn(coluna.titulo === "Evitar" && "text-texto-2")}>
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function CartaoIdeia({ ideia, marca, nome, aoGerar }: { ideia: IdeiaLogo; marca: Marca; nome: string; aoGerar: () => void }) {
  const positiva = variacoesDeCor(marca.paleta)[0]
  return (
    <article aria-labelledby={`ideia-${ideia.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-4">
      <div className="grid aspect-[4/3] place-items-center rounded-2xl px-4" style={{ backgroundColor: positiva.fundo }}>
        <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={36} className="max-w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-3 px-1">
        <header className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`ideia-${ideia.id}`} className="text-base font-semibold">
              {ideia.nome}
            </h3>
            {ideia.aposta && (
              <Tag tom="acao" ponto tamanho="sm">
                minha aposta
              </Tag>
            )}
          </div>
          <p className="text-sm text-texto-2">{ideia.conceito}</p>
        </header>
        <ul className="flex flex-1 flex-col gap-1 border-t border-borda-sutil pt-3 text-sm">
          {ideia.porque.map((motivo) => (
            <li key={motivo} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-sucesso" strokeWidth={2.5} aria-hidden />
              {motivo}
            </li>
          ))}
        </ul>
        <Botao variante={ideia.aposta ? "primario" : "secundario"} tamanho="sm" className="self-start" onClick={aoGerar}>
          <Sparkles /> Gerar com esta ideia
        </Botao>
      </div>
    </article>
  )
}

function Gerando({ ideia, marca, nome }: { ideia: IdeiaLogo; marca: Marca; nome: string }) {
  const positiva = variacoesDeCor(marca.paleta)[0]
  return (
    <section aria-live="polite" className="flex flex-col items-center gap-6 rounded-3xl bg-superficie px-6 py-14 text-center">
      <div className="grid place-items-center rounded-2xl px-8 py-6 motion-safe:animate-pulse" style={{ backgroundColor: positiva.fundo }}>
        <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={40} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconeHattie nome="asterisco" tamanho={20} className="animate-spin text-texto [animation-duration:1.4s] motion-reduce:animate-none" />
        <p className="font-heading text-titulo-3 font-medium lowercase">gerando o logo</p>
        <p className="max-w-[44ch] text-sm text-texto-2">
          Estou desenhando as versões composta, símbolo e tipográfica a partir da ideia {ideia.nome}, em todas as cores da paleta.
        </p>
      </div>
    </section>
  )
}

function Sistema({
  sistema,
  ideia,
  marca,
  nome,
  secao,
  aoEditar,
  aoVoltar,
}: {
  sistema: SistemaLogo
  ideia: IdeiaLogo
  marca: Marca
  nome: string
  secao: Secao
  aoEditar: () => void
  aoVoltar: () => void
}) {
  const variacoes = variacoesDeCor(marca.paleta)
  const positiva = variacoes[0]
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-logo" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-logo" titulo="o logo">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={aoVoltar}>
            <RotateCcw /> Ver as ideias<span className="max-sm:sr-only"> de novo</span>
          </Botao>
        </CabecalhoBloco>
        <div className="flex flex-col overflow-hidden rounded-3xl bg-superficie">
          <div className="grid min-h-56 place-items-center px-6 py-12" style={{ backgroundColor: positiva.fundo }}>
            <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={64} className="max-w-full" />
          </div>
          <div className="flex flex-col gap-1 p-5 md:p-6">
            <p className="text-xs text-texto-3">Ideia {ideia.nome}</p>
            <p className="max-w-[62ch] text-destaque font-light">{ideia.conceito}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-versoes" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-versoes" titulo="versões" quantidade={variacoes.length * TIPOS.length} />
        <Abas defaultValue="composta">
          <ListaAbas
            rotulo="Tipos de logo"
            itens={TIPOS.map((tipo) => ({ valor: tipo.id, rotulo: tipo.rotulo, quantidade: variacoes.length }))}
          />
          {TIPOS.map((tipo) => (
            <ConteudoAba key={tipo.id} value={tipo.id} className="flex flex-col gap-3">
              <p className="text-sm text-texto-2">{tipo.explica}</p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
                {variacoes.map((variacao) => (
                  <li key={variacao.id} className="flex min-w-0">
                    <CartaoVariacao tipo={tipo} variacao={variacao} ideia={ideia} marca={marca} nome={nome} aoEditar={aoEditar} />
                  </li>
                ))}
              </ul>
            </ConteudoAba>
          ))}
        </Abas>
      </section>

      <Regras regras={sistema.regras} ideia={ideia} marca={marca} nome={nome} />
      <Espacamento espacamento={sistema.espacamento} ideia={ideia} marca={marca} nome={nome} />
    </div>
  )
}

function CartaoVariacao({
  tipo,
  variacao,
  ideia,
  marca,
  nome,
  aoEditar,
}: {
  tipo: (typeof TIPOS)[number]
  variacao: VariacaoCor
  ideia: IdeiaLogo
  marca: Marca
  nome: string
  aoEditar: () => void
}) {
  const arquivo = `${nome.toLowerCase().replace(/\s+/g, "-")}-${tipo.id}-${variacao.id}`
  const rotulo = `${tipo.rotulo} ${variacao.nome.toLowerCase()}`

  async function baixar(formato: "svg" | "png") {
    try {
      await baixarLogo(formato, { tipo: tipo.id, simbolo: ideia.simbolo, nome, tinta: variacao.tinta }, arquivo)
      notificar({ titulo: "arquivo baixado", texto: `${arquivo}.${formato}`, tipo: "sucesso" })
    } catch {
      notificar({ titulo: "não consegui gerar o arquivo", texto: "Tenta de novo em alguns segundos.", tipo: "erro" })
    }
  }

  return (
    <article aria-label={rotulo} className="flex w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie">
      <div className="grid aspect-[16/10] place-items-center px-5 outline outline-1 -outline-offset-1 outline-borda-sutil" style={{ backgroundColor: variacao.fundo }}>
        <Logo tipo={tipo.id} simbolo={ideia.simbolo} nome={nome} tinta={variacao.tinta} altura={tipo.altura} className="max-w-full" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold">{variacao.nome}</h3>
          <p className="text-xs text-texto-2">{variacao.descricao}</p>
          <p className="text-xs text-texto-3 tabular-nums">
            Fundo {variacao.fundo.toUpperCase()} · Logo {variacao.tinta.toUpperCase()}
          </p>
        </div>
        <div className="mt-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Botao variante="secundario" tamanho="sm" aria-label={`Baixar ${rotulo}`}>
                <Download /> Baixar <ChevronDown />
              </Botao>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 rounded-2xl p-1">
              <DropdownMenuItem className="h-9 rounded-xl text-sm" onSelect={() => baixar("svg")}>
                SVG <span className="ms-auto text-xs text-texto-3">vetor</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-9 rounded-xl text-sm" onSelect={() => baixar("png")}>
                PNG <span className="ms-auto text-xs text-texto-3">fundo transparente</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AcaoIcone rotulo={`Ajustar ${rotulo} com o Hattie`} dica="Ajustar com o Hattie" onClick={aoEditar}>
            <MessageCircle />
          </AcaoIcone>
          <Tooltip>
            <TooltipTrigger asChild>
              <Botao variante="fantasma" tamanho="icone-sm" asChild>
                <Link href={`/marca/${marca.slug}/parceiros` as Route} aria-label={`Pedir ${rotulo} a um parceiro`}>
                  <UserPlus />
                </Link>
              </Botao>
            </TooltipTrigger>
            <TooltipContent>Pedir a um parceiro</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </article>
  )
}

function AcaoIcone({ rotulo, dica, onClick, children }: { rotulo: string; dica: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Botao variante="fantasma" tamanho="icone-sm" aria-label={rotulo} onClick={onClick}>
          {children}
        </Botao>
      </TooltipTrigger>
      <TooltipContent>{dica}</TooltipContent>
    </Tooltip>
  )
}

/** Como cada erro de uso aparece na miniatura. */
function erroVisual(erro: ErroLogo, marca: Marca): { estilo?: CSSProperties; tinta?: string; fundo?: string } {
  const [principal, , , escura] = marca.paleta
  switch (erro) {
    case "esticar":
      return { estilo: { transform: "scaleX(1.45)" } }
    case "girar":
      return { estilo: { transform: "rotate(-14deg)" } }
    case "cor":
      return { tinta: "var(--azul-forte)" }
    case "sombra":
      return { estilo: { filter: "drop-shadow(2px 3px 2px rgb(0 0 0 / 0.45))" } }
    case "contraste":
      return { tinta: principal.hex, fundo: escura?.hex ?? principal.hex }
    default:
      return {}
  }
}

function Regras({ regras, ideia, marca, nome }: { regras: SistemaLogo["regras"]; ideia: IdeiaLogo; marca: Marca; nome: string }) {
  const positiva = variacoesDeCor(marca.paleta)[0]
  return (
    <section aria-labelledby="titulo-regras-logo" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-regras-logo" titulo="regras de uso" />
      <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] @4xl:gap-0">
        <div className="flex flex-col gap-3 @4xl:pe-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="grid size-6 place-items-center rounded-full bg-sucesso text-branco">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            Faça
          </h3>
          <ul className="flex flex-col">
            {regras.faca.map((regra) => (
              <li key={regra} className="border-t border-borda-sutil py-2.5 text-sm first:border-t-0 first:pt-0">
                {regra}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 border-t border-borda-sutil pt-5 @4xl:border-t-0 @4xl:border-s @4xl:ps-6 @4xl:pt-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="grid size-6 place-items-center rounded-full bg-erro text-branco">
              <X className="size-3.5" strokeWidth={2.5} />
            </span>
            Evite
          </h3>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {regras.evite.map((erro) => {
              const visual = erroVisual(erro.tipo, marca)
              return (
                <li key={erro.tipo} className="flex flex-col gap-2">
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl" style={{ backgroundColor: visual.fundo ?? positiva.fundo }}>
                    {erro.tipo === "separar" ? (
                      <span className="flex flex-col items-end gap-1">
                        <Logo tipo="simbolo" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={18} />
                        <Logo tipo="tipografica" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={14} />
                      </span>
                    ) : (
                      <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={visual.tinta ?? positiva.tinta} altura={18} style={visual.estilo} />
                    )}
                    <span aria-hidden className="absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-erro text-branco">
                      <X className="size-3" strokeWidth={3} />
                    </span>
                  </div>
                  <p className="text-xs text-texto-2">{erro.texto}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Espacamento({ espacamento, ideia, marca, nome }: { espacamento: SistemaLogo["espacamento"]; ideia: IdeiaLogo; marca: Marca; nome: string }) {
  const positiva = variacoesDeCor(marca.paleta)[0]
  const altura = 44
  const x = altura / 2
  return (
    <section aria-labelledby="titulo-espaco" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-espaco" titulo="área de proteção e tamanho mínimo" />
      <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @4xl:grid-cols-2 @4xl:gap-0">
        <div className="flex flex-col gap-4 @4xl:pe-6">
          <div className="grid place-items-center overflow-hidden rounded-2xl px-4 py-10" style={{ backgroundColor: positiva.fundo }}>
            <div className="relative" style={{ padding: x }}>
              <span aria-hidden className="absolute inset-0 rounded-sm border border-dashed" style={{ borderColor: positiva.tinta, opacity: 0.45 }} />
              <span aria-hidden className="absolute inset-y-0 left-0 border-e border-dotted" style={{ width: x, borderColor: positiva.tinta, opacity: 0.3 }} />
              <span aria-hidden className="absolute top-1/2 left-0 grid -translate-y-1/2 place-items-center text-micro font-semibold" style={{ width: x, color: positiva.tinta }}>
                x
              </span>
              <span aria-hidden className="absolute top-0 inset-x-0 grid place-items-center border-b border-dotted text-micro font-semibold" style={{ height: x, borderColor: positiva.tinta, color: positiva.tinta, opacity: 0.8 }}>
                x
              </span>
              <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={altura} />
            </div>
          </div>
          <p className="text-sm text-texto-2">{espacamento.protecao}</p>
        </div>
        <div className="flex flex-col gap-4 border-t border-borda-sutil pt-5 @4xl:border-t-0 @4xl:border-s @4xl:ps-6 @4xl:pt-0">
          <h3 className="text-xs font-semibold text-texto-2">Tamanho mínimo</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-texto-3">
              <tr>
                <th className="pb-2 font-medium">Versão</th>
                <th className="pb-2 font-medium">Na tela</th>
                <th className="pb-2 font-medium">Impresso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borda-sutil">
              {espacamento.minimos.map((minimo) => (
                <tr key={minimo.versao}>
                  <td className="py-2.5 font-medium">{minimo.versao}</td>
                  <td className="py-2.5 text-texto-2 tabular-nums">{minimo.digital}</td>
                  <td className="py-2.5 text-texto-2 tabular-nums">{minimo.impresso}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-texto-3">No tamanho mínimo, na tela</p>
            <div className="flex items-center gap-6 rounded-2xl px-4 py-4" style={{ backgroundColor: positiva.fundo }}>
              <Logo tipo="simbolo" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={24} />
              <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={positiva.tinta} altura={13} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
