"use client"

import Image from "next/image"
import Link from "next/link"
import type { Route } from "next"
import { ArrowRight, Image as ImageIcon, LayoutGrid } from "lucide-react"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { SeloSom } from "@/components/hattie/SeloSom"
import { cn } from "@/lib/utils"
import { PESSOA, SECOES, getSecao, peca } from "@/lib/mock"
import { Logo } from "./Logo"
import { usePersonalidadeEscolhida } from "./EscolhasEstrategia"
import { useEstado } from "./Estado"
import { useMarca } from "./MarcaContexto"
import { Peca } from "./PecasMarca"
import { useSistemaMarca } from "./SistemaMarca"

/**
 * Mockups da primeira apresentação: um grande e três menores. `src` vazio mostra o espaço reservado;
 * as da Raiz Natural foram geradas com a fal.ai (GPT Image 2 Edit, com o logo de referência; ver scripts/imagens-marca).
 * As outras marcas, que ainda não têm mockups, mostram o espaço reservado.
 */
const MOCKUPS: { id: string; legenda: string; src?: string }[] = [
  { id: "destaque", legenda: "Produtos da marca na bancada", src: "/marcas/raiz-natural/mockups/1.jpg" },
  { id: "um", legenda: "Sacola de papel kraft", src: "/marcas/raiz-natural/mockups/2.jpg" },
  { id: "dois", legenda: "Etiqueta de presente", src: "/marcas/raiz-natural/mockups/3.jpg" },
  { id: "tres", legenda: "Cartão de visita", src: "/marcas/raiz-natural/mockups/4.jpg" },
]

const APLICACOES = [
  { exemplo: peca("pronta-post", "Post de lançamento", "foto-cheia"), proporcao: [4, 5] as [number, number], legenda: "Post" },
  { exemplo: peca("pronta-story", "Story", "gradiente"), proporcao: [9, 16] as [number, number], legenda: "Story" },
  { exemplo: peca("pronta-tipo", "Post de texto", "tipografico"), proporcao: [4, 5] as [number, number], legenda: "Post de texto" },
  { exemplo: peca("pronta-etiqueta", "Etiqueta", "carimbo"), proporcao: [3, 4] as [number, number], legenda: "Etiqueta" },
  { exemplo: peca("pronta-banner", "Banner do site", "dividido"), proporcao: [16, 9] as [number, number], legenda: "Banner do site" },
]

/**
 * "Olha como ficou": primeiro impacto depois que o Hattie cria a marca, antes da validação ponto a ponto.
 * Mostra o nome com o logo, a tagline, quatro mockups (um grande e três menores), o propósito, a personalidade,
 * a tipografia, as cores e algumas aplicações.
 * O botão principal começa a validação pela primeira seção; o secundário abre a visão geral do cérebro.
 */
export function MarcaPronta() {
  const marca = useMarca()
  const sistema = useSistemaMarca()
  const { cores, combinacao, fonte } = sistema
  const proposito = getSecao("proposito")?.resumo
  const tagline = getSecao("tagline")?.resumo
  const personalidade = getSecao("personalidade")?.conteudo
  const tracos = usePersonalidadeEscolhida(personalidade?.tipo === "personalidade" ? personalidade.tracos : [])
  const primeira = SECOES[0]
  // Os mockups prontos foram gerados com o nome, a paleta e o logo da aposta; com outra escolha, ficam os espaços reservados.
  const { paletaEscolhida, logoEscolhido, nomeEscolhido } = useEstado()
  const nomes = getSecao("nome")?.conteudo
  const nomeAposta = nomes?.tipo === "nome" ? nomes.opcoes.find((opcao) => opcao.aposta)?.id : undefined
  const logo = getSecao("logo")?.conteudo
  const logoAposta = logo?.tipo === "logo" ? logo.ideias.find((ideia) => ideia.aposta)?.id : undefined
  const paletaAposta = marca.opcoesPaleta?.find((opcao) => opcao.aposta)?.id
  const mockupsValem =
    marca.slug === "raiz-natural" &&
    (!nomeEscolhido || nomeEscolhido === nomeAposta) &&
    (!paletaEscolhida || paletaEscolhida === paletaAposta) &&
    (!logoEscolhido || logoEscolhido === logoAposta)

  return (
    <div className="min-h-svh bg-background px-4 py-6 md:px-10">
      <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={160} height={34} priority className="h-8 w-auto" />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 py-8 md:py-12">
        <header className="flex flex-col items-center gap-4 text-center">
          <SeloSom som="tcharam" />
          <h1 className="font-heading text-titulo-1 font-medium lowercase md:text-[3rem] md:leading-none">olha como ficou, {PESSOA.nome.toLowerCase()}</h1>
          <p className="max-w-[52ch] text-texto-2">
            Essa é a primeira versão da {sistema.nome}, com as cores, as letras e o logo que você escolheu. Dá uma olhada no todo; depois a gente passa ponto por ponto para você aprovar ou ajustar.
          </p>
        </header>

        <section aria-label={`Nome e logo da ${sistema.nome}`} className="flex flex-col items-center gap-5 rounded-[32px] px-6 py-12 text-center md:py-16" style={{ backgroundColor: cores.fundo }}>
          <Logo tipo="composta" simbolo={sistema.simbolo} nome={sistema.nome} tinta={cores.principal} altura={44} className="max-w-full md:hidden" />
          <Logo tipo="composta" simbolo={sistema.simbolo} nome={sistema.nome} tinta={cores.principal} altura={72} className="hidden max-w-full md:inline-flex" />
          {tagline && (
            <p className="text-titulo-3 md:text-titulo-2" style={{ fontFamily: fonte.display, color: cores.escuro }}>
              {tagline}
            </p>
          )}
        </section>

        <section aria-label="Mockups da marca" className="grid grid-cols-3 gap-2 sm:gap-3">
          {MOCKUPS.map((mockup, indice) => (
            <figure
              key={mockup.id}
              className={cn("relative overflow-hidden rounded-3xl", indice === 0 ? "col-span-3 aspect-[4/3] sm:aspect-video" : "aspect-square rounded-2xl sm:aspect-[4/3] sm:rounded-3xl")}
              style={{ backgroundColor: cores.fundo }}
            >
              {mockup.src && mockupsValem ? (
                <Image src={mockup.src} alt={mockup.legenda} fill sizes={indice === 0 ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 1024px) 340px, 33vw"} className="object-cover" />
              ) : (
                <>
                  <BlocoImagem className="absolute inset-0 size-full rounded-none outline-0" fundo={cores.fundo} cor={cores.apoio} borda={indice === 0 ? "bottom" : "right"} />
                  <figcaption
                    className={cn(
                      "absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-superficie/90 py-1.5 text-xs font-medium sm:bottom-3 sm:left-3 sm:px-3",
                      indice === 0 ? "px-3" : "px-1.5",
                    )}
                  >
                    <ImageIcon className="size-3.5" strokeWidth={2} aria-hidden />
                    <span className={cn(indice > 0 && "sr-only sm:not-sr-only")}>{mockup.legenda}</span>
                  </figcaption>
                </>
              )}
            </figure>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {proposito && (
            <section aria-labelledby="pronta-proposito" className="flex flex-col gap-2 rounded-3xl bg-superficie p-5 md:p-6">
              <h2 id="pronta-proposito" className="text-xs font-semibold text-texto-2">
                Propósito
              </h2>
              <p className="text-destaque font-light">{proposito}</p>
            </section>
          )}
          {tracos.length > 0 && (
            <section aria-labelledby="pronta-personalidade" className="flex flex-col gap-2 rounded-3xl bg-superficie p-5 md:p-6">
              <h2 id="pronta-personalidade" className="text-xs font-semibold text-texto-2">
                Personalidade
              </h2>
              <p className="flex flex-wrap gap-x-3 gap-y-1 font-heading text-titulo-3 font-medium lowercase">
                {tracos.map((traco) => (
                  <span key={traco.id}>{traco.palavra}</span>
                ))}
              </p>
            </section>
          )}
          <section aria-labelledby="pronta-tipografia" className="flex flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
            <h2 id="pronta-tipografia" className="text-xs font-semibold text-texto-2">
              Tipografia
            </h2>
            <div className="flex items-end gap-5">
              <span className="text-[4.5rem] leading-none" style={{ fontFamily: fonte.display, color: cores.principal }} aria-hidden>
                Aa
              </span>
              <div className="flex min-w-0 flex-col gap-0.5 pb-1">
                <span className="truncate text-sm font-semibold">{combinacao.display.familia}</span>
                <span className="truncate text-xs text-texto-2">títulos</span>
                <span className="mt-1 truncate text-sm font-semibold" style={{ fontFamily: fonte.texto }}>
                  {combinacao.texto.familia}
                </span>
                <span className="truncate text-xs text-texto-2">textos</span>
              </div>
            </div>
          </section>
          <section aria-labelledby="pronta-cores" className="flex flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
            <h2 id="pronta-cores" className="text-xs font-semibold text-texto-2">
              Cores
            </h2>
            <ul className="grid grid-cols-4 gap-2">
              {marca.paleta.slice(0, 4).map((cor) => (
                <li key={cor.hex} className="flex flex-col gap-1.5">
                  <span aria-hidden className="h-16 rounded-2xl shadow-[inset_0_0_0_1px_oklch(0_0_0/0.06)]" style={{ backgroundColor: cor.hex }} />
                  <span className="truncate text-xs font-medium">{cor.nome}</span>
                  <span className="text-micro text-texto-3 uppercase">{cor.hex}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section aria-labelledby="pronta-aplicacoes" className="flex flex-col gap-3">
          <h2 id="pronta-aplicacoes" className="font-heading text-titulo-3 font-medium lowercase">
            a marca no dia a dia
          </h2>
          <ul className="no-scrollbar -mx-4 flex items-end gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
            {APLICACOES.map((item) => (
              <li key={item.exemplo.id} className="flex shrink-0 flex-col gap-1.5">
                <div className="h-56 md:h-64">
                  <Peca exemplo={item.exemplo} proporcao={item.proporcao} sistema={sistema} className="h-full w-auto rounded-2xl shadow-(--sombra-campo)" />
                </div>
                <span className="text-xs text-texto-3">{item.legenda}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="pronta-proximo" className="flex flex-col gap-4 rounded-3xl bg-preto p-5 text-branco md:flex-row md:items-center md:p-6">
          <div className="flex flex-1 flex-col gap-1">
            <h2 id="pronta-proximo" className="font-heading text-titulo-3 font-medium text-lima lowercase">
              agora, ponto por ponto
            </h2>
            <p className="text-sm text-cinza">
              São {SECOES.length} decisões, do briefing às aplicações. Você aprova o que gostou e ajusta o resto comigo, ou chama um parceiro.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Botao variante="fantasma" asChild className="text-branco hover:bg-branco/10 hover:text-branco">
              <Link href={`/marca/${marca.slug}/cerebro` as Route}>
                <LayoutGrid /> Ver tudo
              </Link>
            </Botao>
            <Botao asChild className="bg-lima text-preto hover:bg-lima/85">
              <Link href={`/marca/${marca.slug}/cerebro/${primeira.id}` as Route}>
                Começar a validação <ArrowRight />
              </Link>
            </Botao>
          </div>
        </section>
      </main>
    </div>
  )
}
