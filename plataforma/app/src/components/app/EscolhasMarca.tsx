"use client"

import Image from "next/image"
import type { Route } from "next"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Plimm } from "@/components/hattie/Plimm"
import { Tag } from "@/components/hattie/Tag"
import { useFontesGoogle } from "@/lib/usarFonteGoogle"
import { cn } from "@/lib/utils"
import { PESSOA, getSecao, type CombinacaoTipografica, type IdeiaLogo, type OpcaoPaleta } from "@/lib/mock"
import { useEstado } from "./Estado"
import { Logo, Simbolo } from "./Logo"
import { useMarca } from "./MarcaContexto"
import { comCombinacao, pilha, useSistemaMarca } from "./SistemaMarca"

/**
 * Primeiras escolhas, entre o fim da conversa (e o "estou criando") e o "olha como ficou".
 * Três passos: cores, tipografia e logo, cada um com três opções do Hattie e a aposta já marcada.
 * Cada passo mostra as opções com o que já foi escolhido antes (a tipografia nas cores escolhidas, o logo nas duas).
 * A escolha vai direto para o estado: o "olha como ficou" e o cérebro da marca mostram só o que a pessoa escolheu.
 */

const PASSOS = [
  {
    id: "cores",
    rotulo: "Cores",
    titulo: "escolha as cores",
    texto: (nome: string, marca: string) => `${nome}, montei três paletas a partir do que você me contou. A primeira é a minha aposta; fique com a que mais parece com a ${marca}.`,
  },
  {
    id: "tipografia",
    rotulo: "Tipografia",
    titulo: "escolha as letras",
    texto: () => "Cada combinação tem uma fonte para títulos, uma para textos e uma para botões e números. Já mostro tudo nas cores que você escolheu.",
  },
  {
    id: "logo",
    rotulo: "Logo",
    titulo: "escolha o logo",
    texto: () => "Por último, o logo. São três caminhos a partir da origem e do cuidado. Depois da escolha, eu gero todas as versões.",
  },
] as const

const FRASE_PADRAO = "Cuidado que vem da raiz."

export function EscolhasMarca() {
  const router = useRouter()
  const marca = useMarca()
  const { nomeMarca, paletaEscolhida, escolherPaleta, tipografiaEscolhida, escolherTipografia, logoEscolhido, escolherLogo } = useEstado()
  const [passo, setPasso] = useState(0)
  const [montando, setMontando] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nome = marca.slug === "raiz-natural" ? nomeMarca : marca.nome

  const tipografia = getSecao("tipografia")?.conteudo
  const combinacoes = tipografia?.tipo === "tipografia" ? tipografia.combinacoes : []
  const frase = tipografia?.tipo === "tipografia" ? tipografia.frase : FRASE_PADRAO
  const logo = getSecao("logo")?.conteudo
  const ideias = logo?.tipo === "logo" ? logo.ideias : []
  const paletas: OpcaoPaleta[] = marca.opcoesPaleta ?? [{ id: "atual", nome: "Paleta da marca", ideia: "As cores que a marca já usa.", cores: marca.paleta, porque: [], aposta: true }]

  const apostaDe = <T extends { id: string; aposta?: boolean }>(lista: T[]) => (lista.find((item) => item.aposta) ?? lista[0])?.id
  const escolhas = [paletaEscolhida ?? apostaDe(paletas), tipografiaEscolhida ?? apostaDe(combinacoes), logoEscolhido ?? apostaDe(ideias)]

  // As três combinações carregam de uma vez, para a troca entre elas ser imediata.
  useFontesGoogle(combinacoes.flatMap((combinacao) => [combinacao.display, combinacao.texto, combinacao.sistema].map((fonte) => ({ familia: fonte.familia, pesos: fonte.pesos }))))

  useEffect(() => {
    router.prefetch(`/marca/${marca.slug}/pronta` as Route)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [router, marca.slug])

  function irPara(indice: number) {
    setPasso(indice)
    window.scrollTo({ top: 0 })
    // O foco vai para o título do passo, para o leitor de tela anunciar a nova pergunta.
    requestAnimationFrame(() => titulo.current?.focus({ preventScroll: true }))
  }

  function montar() {
    // Guarda as apostas que a pessoa não trocou, para o resto da marca saber que foram escolhidas.
    escolherPaleta(escolhas[0] ?? null)
    escolherTipografia(escolhas[1] ?? null)
    escolherLogo(escolhas[2] ?? null)
    setMontando(true)
    timer.current = setTimeout(() => router.push(`/marca/${marca.slug}/pronta` as Route), 1200)
  }

  const atual = PASSOS[passo]
  const ultimo = passo === PASSOS.length - 1

  return (
    <div className="min-h-svh bg-background px-4 pt-6 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={160} height={34} priority className="h-8 w-auto" />
        <ol aria-label="Escolhas da marca" className="flex items-center gap-1">
          {PASSOS.map((item, indice) => {
            const feito = indice < passo
            const agora = indice === passo
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => irPara(indice)}
                  disabled={indice > passo}
                  aria-current={agora ? "step" : undefined}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium transition-[background-color,color] duration-150 pointer-coarse:h-11",
                    agora ? "bg-preto text-lima" : feito ? "text-texto hover:bg-preenchimento" : "text-texto-3",
                  )}
                >
                  {feito ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden /> : <span className="tabular-nums">{indice + 1}</span>}
                  <span className={cn(!agora && "max-sm:sr-only")}>{item.rotulo}</span>
                  {feito && <span className="sr-only">, escolhido</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 pt-10 pb-8 md:pt-14">
        <header className="flex flex-col gap-3">
          <h1 ref={titulo} tabIndex={-1} className="font-heading text-titulo-1 font-medium lowercase outline-none md:text-[2.75rem] md:leading-none">
            {atual.titulo}
          </h1>
          <p className="flex max-w-[62ch] gap-2.5 text-texto-2">
            <IconeHattie nome="hattie" tamanho={20} className="mt-0.5 shrink-0 text-texto" />
            <span>{atual.texto(PESSOA.nome, nome)}</span>
          </p>
        </header>

        {atual.id === "cores" && (
          <Opcoes rotulo="Paletas">
            {paletas.map((opcao) => (
              <Opcao key={opcao.id} grupo="paleta" opcao={opcao} marcada={escolhas[0] === opcao.id} aoMarcar={() => escolherPaleta(opcao.id)} detalhe={opcao.cores.map((cor) => cor.hex).join(" · ")}>
                <PreviaPaleta opcao={opcao} nome={nome} simbolo={ideias.find((ideia) => ideia.id === escolhas[2])?.simbolo ?? "gota"} />
              </Opcao>
            ))}
          </Opcoes>
        )}

        {atual.id === "tipografia" && (
          <Opcoes rotulo="Combinações de fontes">
            {combinacoes.map((combinacao) => (
              <Opcao
                key={combinacao.id}
                grupo="tipografia"
                opcao={combinacao}
                marcada={escolhas[1] === combinacao.id}
                aoMarcar={() => escolherTipografia(combinacao.id)}
                detalhe={`${combinacao.display.familia} · ${combinacao.texto.familia} · ${combinacao.sistema.familia}`}
              >
                <PreviaTipografia combinacao={combinacao} frase={frase} />
              </Opcao>
            ))}
          </Opcoes>
        )}

        {atual.id === "logo" && (
          <Opcoes rotulo="Ideias de logo">
            {ideias.map((ideia) => (
              <Opcao key={ideia.id} grupo="logo" opcao={{ ...ideia, ideia: ideia.conceito }} marcada={escolhas[2] === ideia.id} aoMarcar={() => escolherLogo(ideia.id)}>
                <PreviaLogo ideia={ideia} nome={nome} />
              </Opcao>
            ))}
          </Opcoes>
        )}
      </main>

      <footer className="sticky bottom-0 -mx-4 bg-background/95 px-4 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          {passo > 0 ? (
            <Botao variante="fantasma" onClick={() => irPara(passo - 1)} disabled={montando}>
              <ArrowLeft /> Voltar
            </Botao>
          ) : (
            <p className="text-sm text-texto-2 max-sm:sr-only">Dá para ajustar tudo depois, no cérebro da marca.</p>
          )}
          {ultimo ? (
            <Plimm rotulo={montando ? "montando…" : "montar minha marca"} carregando={montando} onClick={montar} className="ms-auto" />
          ) : (
            <Botao variante="primario" onClick={() => irPara(passo + 1)} className="ms-auto">
              Continuar <ArrowRight />
            </Botao>
          )}
        </div>
        <span className="sr-only" aria-live="polite">
          {montando ? "O Hattie está montando a marca com as suas escolhas" : ""}
        </span>
      </footer>
    </div>
  )
}

function Opcoes({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {children}
    </div>
  )
}

/**
 * Card de escolha. É um rádio de verdade (escondido), então as setas do teclado trocam a opção.
 * Marcado ganha fundo lima-suave e o ✓ em preto e lima, sem contorno.
 */
function Opcao({
  grupo,
  opcao,
  marcada,
  aoMarcar,
  detalhe,
  children,
}: {
  grupo: string
  opcao: { id: string; nome: string; ideia: string; porque: string[]; aposta?: boolean }
  marcada: boolean
  aoMarcar: () => void
  detalhe?: string
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        "group flex cursor-pointer flex-col gap-4 rounded-3xl p-3 transition-[background-color] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-texto",
        marcada ? "bg-acao-suave" : "bg-superficie hover:bg-preenchimento",
      )}
    >
      <input type="radio" name={grupo} value={opcao.id} checked={marcada} onChange={aoMarcar} className="sr-only" />
      {children}
      <span className="flex flex-1 flex-col gap-2 px-1 pb-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold">{opcao.nome}</span>
          {opcao.aposta && (
            <Tag tom="acao" ponto tamanho="sm">
              minha aposta
            </Tag>
          )}
          <span
            aria-hidden
            className={cn("ms-auto grid size-7 shrink-0 place-items-center rounded-full transition-[background-color,color] duration-150", marcada ? "bg-preto text-lima" : "bg-preenchimento text-transparent group-hover:text-texto-3")}
          >
            <Check className="size-4" strokeWidth={2.5} />
          </span>
        </span>
        <span className="text-sm text-texto-2">{opcao.ideia}</span>
        {detalhe && <span className="text-xs text-texto-3 tabular-nums">{detalhe}</span>}
        {opcao.porque.length > 0 && (
          // No celular, só a opção marcada abre os motivos, para as três caberem na rolagem sem cansar.
          <span className={cn("mt-1 flex flex-col gap-1 border-t border-borda-sutil pt-3 text-sm", !marcada && "max-md:hidden")}>
            {opcao.porque.map((motivo) => (
              <span key={motivo} className="flex gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-sucesso" strokeWidth={2.5} aria-hidden />
                {motivo}
              </span>
            ))}
          </span>
        )}
      </span>
    </label>
  )
}

/** A paleta em faixas proporcionais ao uso (fundo maior, principal, apoio e escura) e o logo da aposta na cor principal. */
function PreviaPaleta({ opcao, nome, simbolo }: { opcao: OpcaoPaleta; nome: string; simbolo: IdeiaLogo["simbolo"] }) {
  const [principal, apoio, fundo, escura] = [opcao.cores[0], opcao.cores[1] ?? opcao.cores[0], opcao.cores[2] ?? opcao.cores[0], opcao.cores[3] ?? opcao.cores[0]]
  return (
    <span aria-hidden className="flex flex-col overflow-hidden rounded-2xl">
      <span className="grid aspect-[2/1] md:aspect-[16/10] place-items-center px-4" style={{ backgroundColor: fundo.hex }}>
        <Logo tipo="composta" simbolo={simbolo} nome={nome} tinta={principal.hex} altura={32} className="max-w-full" />
      </span>
      <span className="flex h-12">
        {[principal, apoio, escura].map((cor, indice) => (
          <span key={cor.hex + indice} className={cn(indice === 0 ? "flex-[3]" : "flex-[2]")} style={{ backgroundColor: cor.hex }} />
        ))}
      </span>
    </span>
  )
}

/** A frase da marca na fonte de títulos, um trecho na de texto e um botão na de sistema, nas cores já escolhidas. */
function PreviaTipografia({ combinacao, frase }: { combinacao: CombinacaoTipografica; frase: string }) {
  const sistema = comCombinacao(useSistemaMarca(), combinacao)
  const { cores } = sistema
  return (
    <span aria-hidden className="flex aspect-[2/1] md:aspect-[16/10] flex-col justify-between gap-3 rounded-2xl p-5" style={{ backgroundColor: cores.fundo }}>
      <span className="text-[1.75rem] leading-[1.05]" style={{ fontFamily: sistema.fonte.display, color: cores.principal, fontWeight: combinacao.display.pesos[1] ?? combinacao.display.pesos[0] }}>
        {frase}
      </span>
      <span className="flex flex-col gap-3">
        <span className="line-clamp-2 text-sm leading-snug" style={{ fontFamily: pilha(combinacao.texto.familia, combinacao.texto.categoria), color: cores.escuro }}>
          O pequi deste hidratante veio da cooperativa de Pirenópolis, colhido em setembro.
        </span>
        <span className="self-start rounded-full px-3.5 py-1.5 text-xs font-semibold" style={{ fontFamily: sistema.fonte.sistema, backgroundColor: cores.principal, color: cores.fundo }}>
          Ver de onde vem
        </span>
      </span>
    </span>
  )
}

/** O logo composto sobre o fundo e o símbolo sozinho na cor principal, como aparece no perfil. */
function PreviaLogo({ ideia, nome }: { ideia: IdeiaLogo; nome: string }) {
  const { cores } = useSistemaMarca()
  return (
    <span aria-hidden className="flex flex-col gap-1 overflow-hidden rounded-2xl">
      <span className="grid aspect-[2/1] md:aspect-[16/10] place-items-center px-4" style={{ backgroundColor: cores.fundo }}>
        <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={cores.principal} altura={34} className="max-w-full" />
      </span>
      <span className="grid h-16 grid-cols-2 gap-1">
        <span className="grid place-items-center" style={{ backgroundColor: cores.principal }}>
          <Simbolo simbolo={ideia.simbolo} tinta={cores.fundo} tamanho={34} />
        </span>
        <span className="grid place-items-center" style={{ backgroundColor: cores.apoio }}>
          <Simbolo simbolo={ideia.simbolo} tinta={cores.escuro} tamanho={34} />
        </span>
      </span>
    </span>
  )
}
