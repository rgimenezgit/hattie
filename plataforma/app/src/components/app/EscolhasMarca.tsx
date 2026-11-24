"use client"

import Image from "next/image"
import type { Route } from "next"
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Plimm } from "@/components/hattie/Plimm"
import { Tag } from "@/components/hattie/Tag"
import { useFontesGoogle } from "@/lib/usarFonteGoogle"
import { cn } from "@/lib/utils"
import {
  DIFERENCIAIS_SUGERIDOS,
  LIMITES_ESCOLHA,
  PALAVRAS_PERSONALIDADE,
  PESSOA,
  getSecao,
  type CombinacaoTipografica,
  type Diferencial,
  type IdeiaLogo,
  type OpcaoNome,
  type OpcaoPaleta,
  type StatusChecagem,
  type TipoCluster,
  type TracoPersonalidade,
} from "@/lib/mock"
import { useEstado } from "./Estado"
import { iniciaisDe, Logo, Simbolo } from "./Logo"
import { useMarca } from "./MarcaContexto"
import { comCombinacao, pilha, useSistemaMarca } from "./SistemaMarca"

/**
 * Primeiras escolhas, entre o fim da conversa (e o "estou criando") e o "olha como ficou". Seis passos, nesta ordem:
 * 1. Diferenciais: de 3 a 4 entre os que o Hattie separou, mais os que a pessoa escrever.
 * 2. Personalidade: de 3 a 5 entre dez palavras, mais as que a pessoa escrever.
 * 3. Nome, 4. Cores, 5. Tipografia e 6. Logo: três ou quatro opções, com a aposta do Hattie já marcada.
 * Nos dois primeiros, nada vem marcado: o Hattie sugere, a pessoa decide. Os passos visuais mostram as opções com o
 * que já foi escolhido antes (a tipografia nas cores escolhidas, o logo com o nome e as cores).
 * A escolha vai direto para o estado: o "olha como ficou" e o cérebro da marca mostram só o que a pessoa escolheu.
 */

type IdPasso = "diferenciais" | "personalidade" | "nome" | "cores" | "tipografia" | "logo"

const PASSOS: { id: IdPasso; rotulo: string; titulo: string; texto: (pessoa: string, marca: string) => string }[] = [
  {
    id: "diferenciais",
    rotulo: "Diferenciais",
    titulo: "o que te diferencia",
    texto: (pessoa, marca) =>
      `${pessoa}, separei o que a ${marca} tem de diferente a partir da nossa conversa. Escolha de 3 a 4 que você quer que as pessoas lembrem. Marquei as minhas sugestões; se faltar algum, escreva no campo abaixo.`,
  },
  {
    id: "personalidade",
    rotulo: "Personalidade",
    titulo: "o jeito da marca",
    texto: (_, marca) =>
      `Se a ${marca} fosse uma pessoa, como ela seria? Escolha de 3 a 5 palavras. Separei dez a partir do que você me contou e marquei as minhas sugestões, mas quem conhece a marca é você. Se a palavra certa estiver faltando, escreva a sua.`,
  },
  {
    id: "nome",
    rotulo: "Nome",
    titulo: "escolha o nome",
    texto: () => "Com os diferenciais e o jeito da marca definidos, trouxe quatro nomes, cada um de um território. Já chequei domínio, Instagram e registro. A minha aposta já vem marcada.",
  },
  {
    id: "cores",
    rotulo: "Cores",
    titulo: "escolha as cores",
    texto: () => "Agora as cores. Montei três paletas a partir do que você escolheu até aqui. A minha aposta já vem marcada; fique com a que mais parece com a marca.",
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
    texto: () => "Por último, o logo. São três caminhos a partir da origem e do cuidado, já com o nome e as cores. Depois da escolha, eu gero todas as versões.",
  },
]

const FRASE_PADRAO = "Cuidado que vem da raiz."

const ROTULO_CLUSTER: Record<TipoCluster, string> = { funcional: "Funcional", emocional: "Emocional", social: "Social", ambiental: "Ambiental", economico: "Econômico" }

const SEM_DIFERENCIAIS = { ids: [] as string[], proprios: [] as Diferencial[] }
const SEM_PERSONALIDADE = { ids: [] as string[], proprias: [] as TracoPersonalidade[] }

export function EscolhasMarca() {
  const router = useRouter()
  const marca = useMarca()
  const estado = useEstado()
  const { nomeMarca, nomeEscolhido, escolherNome, paletaEscolhida, escolherPaleta, tipografiaEscolhida, escolherTipografia, logoEscolhido, escolherLogo } = estado
  const diferenciais = estado.diferenciaisEscolhidos ?? SEM_DIFERENCIAIS
  const personalidade = estado.personalidadeEscolhida ?? SEM_PERSONALIDADE
  const [passo, setPasso] = useState(0)
  const [montando, setMontando] = useState(false)
  const titulo = useRef<HTMLHeadingElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nome = marca.slug === "raiz-natural" ? nomeMarca : marca.nome

  const secaoDiferenciais = getSecao("diferencial")?.conteudo
  const opcoesDiferenciais =
    secaoDiferenciais?.tipo === "diferenciais" ? secaoDiferenciais.clusters.flatMap((cluster) => cluster.diferenciais.map((diferencial) => ({ ...diferencial, cluster: cluster.id }))) : []
  const secaoNome = getSecao("nome")?.conteudo
  const nomes = secaoNome?.tipo === "nome" ? secaoNome.opcoes : []
  const tipografia = getSecao("tipografia")?.conteudo
  const combinacoes = tipografia?.tipo === "tipografia" ? tipografia.combinacoes : []
  const frase = tipografia?.tipo === "tipografia" ? tipografia.frase : FRASE_PADRAO
  const logo = getSecao("logo")?.conteudo
  const ideias = logo?.tipo === "logo" ? logo.ideias : []
  const paletas: OpcaoPaleta[] = marca.opcoesPaleta ?? [{ id: "atual", nome: "Paleta da marca", ideia: "As cores que a marca já usa.", cores: marca.paleta, porque: [], aposta: true }]

  const apostaDe = <T extends { id: string; aposta?: boolean }>(lista: T[]) => (lista.find((item) => item.aposta) ?? lista[0])?.id
  const escolhas = {
    nome: nomeEscolhido ?? apostaDe(nomes),
    paleta: paletaEscolhida ?? apostaDe(paletas),
    tipografia: tipografiaEscolhida ?? apostaDe(combinacoes),
    logo: logoEscolhido ?? apostaDe(ideias),
  }

  const totalDiferenciais = diferenciais.ids.length + diferenciais.proprios.length
  const totalPalavras = personalidade.ids.length + personalidade.proprias.length

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

  // Atualizações a partir do valor atual: cliques rápidos seguidos não se perdem. O limite também é checado aqui.
  function alternarDiferencial(id: string) {
    estado.salvarDiferenciais((atual) => {
      const base = atual ?? SEM_DIFERENCIAIS
      if (base.ids.includes(id)) return { ...base, ids: base.ids.filter((item) => item !== id) }
      if (base.ids.length + base.proprios.length >= LIMITES_ESCOLHA.diferenciais.max) return base
      return { ...base, ids: [...base.ids, id] }
    })
  }

  function alternarPalavra(id: string) {
    estado.salvarPersonalidade((atual) => {
      const base = atual ?? SEM_PERSONALIDADE
      if (base.ids.includes(id)) return { ...base, ids: base.ids.filter((item) => item !== id) }
      if (base.ids.length + base.proprias.length >= LIMITES_ESCOLHA.personalidade.max) return base
      return { ...base, ids: [...base.ids, id] }
    })
  }

  function escolherNomePor(id: string) {
    const opcao = nomes.find((item) => item.id === id)
    if (opcao) escolherNome(opcao.id, opcao.nome)
  }

  function montar() {
    // Guarda as apostas que a pessoa não trocou, para o resto da marca saber que foram escolhidas.
    if (escolhas.nome) escolherNomePor(escolhas.nome)
    escolherPaleta(escolhas.paleta ?? null)
    escolherTipografia(escolhas.tipografia ?? null)
    escolherLogo(escolhas.logo ?? null)
    setMontando(true)
    timer.current = setTimeout(() => router.push(`/marca/${marca.slug}/pronta` as Route), 1200)
  }

  const atual = PASSOS[passo]
  const ultimo = passo === PASSOS.length - 1
  const limite = atual.id === "diferenciais" ? LIMITES_ESCOLHA.diferenciais : atual.id === "personalidade" ? LIMITES_ESCOLHA.personalidade : null
  const total = atual.id === "diferenciais" ? totalDiferenciais : totalPalavras
  const faltam = limite ? Math.max(0, limite.min - total) : 0
  const cheio = limite ? total >= limite.max : false
  const avisoContagem = !limite
    ? ""
    : faltam > 0
      ? `Escolha mais ${faltam === 1 ? "um" : faltam} para continuar.`
      : cheio
        ? `Chegou a ${limite.max}. Para trocar, desmarque um.`
        : `${total} escolhidos, dá para marcar até ${limite.max}.`

  return (
    <div className="min-h-svh bg-background px-4 pt-6 md:px-10">
      <div className="flex items-center justify-between gap-4">
        <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={160} height={34} priority className="h-8 w-auto" />
        <p className="text-sm text-texto-2 md:hidden">
          <span className="font-semibold text-texto tabular-nums">
            {passo + 1} de {PASSOS.length}
          </span>{" "}
          · {atual.rotulo}
        </p>
        <ol aria-label="Escolhas da marca" className="flex items-center gap-0.5 max-md:hidden">
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
                    "flex h-9 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium transition-[background-color,color] duration-150",
                    agora ? "bg-preto text-lima" : feito ? "text-texto hover:bg-preenchimento" : "text-texto-3",
                  )}
                >
                  {feito ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden /> : <span className="tabular-nums">{indice + 1}</span>}
                  <span className={cn(!agora && "max-lg:sr-only")}>{item.rotulo}</span>
                  {feito && <span className="sr-only">, escolhido</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-preenchimento md:hidden" aria-hidden>
        <div className="h-full rounded-full bg-preto transition-[width] duration-300" style={{ width: `${((passo + 1) / PASSOS.length) * 100}%` }} />
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 pt-8 pb-8 md:pt-14">
        <header className="flex flex-col gap-3">
          <h1 ref={titulo} tabIndex={-1} className="font-heading text-titulo-1 font-medium lowercase outline-none md:text-[2.75rem] md:leading-none">
            {atual.titulo}
          </h1>
          <p className="flex max-w-[66ch] gap-2.5 text-texto-2">
            <IconeHattie nome="hattie" tamanho={20} className="mt-0.5 shrink-0 text-texto" />
            <span>{atual.texto(PESSOA.nome, nome)}</span>
          </p>
        </header>

        {atual.id === "diferenciais" && (
          <>
            <Marcaveis rotulo="Diferenciais" colunas="lg:grid-cols-3">
              {opcoesDiferenciais.map((diferencial) => {
                const marcado = diferenciais.ids.includes(diferencial.titulo)
                return (
                  <Marcavel
                    key={diferencial.titulo}
                    titulo={diferencial.titulo}
                    texto={diferencial.descricao}
                    detalhe={ROTULO_CLUSTER[diferencial.cluster]}
                    sugerida={DIFERENCIAIS_SUGERIDOS.includes(diferencial.titulo)}
                    marcado={marcado}
                    bloqueado={cheio && !marcado}
                    aoAlternar={() => alternarDiferencial(diferencial.titulo)}
                  />
                )
              })}
              {diferenciais.proprios.map((proprio) => (
                <Marcavel
                  key={proprio.titulo}
                  titulo={proprio.titulo}
                  texto="Escrito por você. No cérebro da marca, eu procuro a prova com você."
                  propria
                  marcado
                  aoAlternar={() => estado.salvarDiferenciais((atual) => ({ ...(atual ?? SEM_DIFERENCIAIS), proprios: (atual ?? SEM_DIFERENCIAIS).proprios.filter((item) => item.titulo !== proprio.titulo) }))}
                />
              ))}
            </Marcaveis>
            <EscreverProprio
              rotulo="Faltou algum diferencial? Escreva o seu"
              exemplo="Ex.: entrega em Ribeirão Preto no mesmo dia"
              maximo={80}
              cheio={cheio}
              existentes={[...opcoesDiferenciais.map((item) => item.titulo), ...diferenciais.proprios.map((item) => item.titulo)]}
              aoAdicionar={(texto) =>
                estado.salvarDiferenciais((atual) => {
                  const base = atual ?? SEM_DIFERENCIAIS
                  return { ...base, proprios: [...base.proprios, { titulo: texto, descricao: "Escrito por você. O Hattie procura a prova com você.", prova: "A confirmar", forca: "em construção" }] }
                })
              }
            />
          </>
        )}

        {atual.id === "personalidade" && (
          <>
            <Marcaveis rotulo="Palavras de personalidade" colunas="grid-cols-2 lg:grid-cols-5">
              {PALAVRAS_PERSONALIDADE.map((palavra) => {
                const marcado = personalidade.ids.includes(palavra.id)
                return (
                  <Marcavel
                    key={palavra.id}
                    titulo={palavra.palavra}
                    texto={palavra.explicacao}
                    palavra
                    sugerida={palavra.sugerida}
                    marcado={marcado}
                    bloqueado={cheio && !marcado}
                    aoAlternar={() => alternarPalavra(palavra.id)}
                  />
                )
              })}
              {personalidade.proprias.map((propria) => (
                <Marcavel
                  key={propria.id}
                  titulo={propria.palavra}
                  texto="Palavra sua. No cérebro da marca, eu escrevo o que ela quer dizer na prática."
                  palavra
                  propria
                  marcado
                  aoAlternar={() => estado.salvarPersonalidade((atual) => ({ ...(atual ?? SEM_PERSONALIDADE), proprias: (atual ?? SEM_PERSONALIDADE).proprias.filter((item) => item.id !== propria.id) }))}
                />
              ))}
            </Marcaveis>
            <EscreverProprio
              rotulo="Faltou alguma palavra? Escreva a sua"
              exemplo="Ex.: divertida"
              maximo={24}
              cheio={cheio}
              existentes={[...PALAVRAS_PERSONALIDADE.map((item) => item.palavra), ...personalidade.proprias.map((item) => item.palavra)]}
              aoAdicionar={(texto) => {
                const palavra = texto.charAt(0).toUpperCase() + texto.slice(1)
                estado.salvarPersonalidade((atual) => {
                  const base = atual ?? SEM_PERSONALIDADE
                  return {
                    ...base,
                    proprias: [
                      ...base.proprias,
                      { id: `propria-${palavra.toLowerCase()}`, palavra, explicacao: "Palavra escolhida por você. O Hattie escreve o que ela quer dizer na prática.", naPratica: "A definir com o Hattie." },
                    ],
                  }
                })
              }}
            />
          </>
        )}

        {atual.id === "nome" && (
          <Opcoes rotulo="Nomes" colunas="md:grid-cols-2">
            {nomes.map((opcao) => (
              <Opcao
                key={opcao.id}
                grupo="nome"
                opcao={{ ...opcao, ideia: opcao.significado }}
                marcada={escolhas.nome === opcao.id}
                aoMarcar={() => escolherNomePor(opcao.id)}
                detalhe={`Território ${opcao.territorio.toLowerCase()} · ${opcao.soa.toLowerCase()}`}
              >
                <PreviaNome opcao={opcao} />
              </Opcao>
            ))}
          </Opcoes>
        )}

        {atual.id === "cores" && (
          <Opcoes rotulo="Paletas">
            {paletas.map((opcao) => (
              <Opcao key={opcao.id} grupo="paleta" opcao={opcao} marcada={escolhas.paleta === opcao.id} aoMarcar={() => escolherPaleta(opcao.id)}>
                <PreviaPaleta opcao={opcao} />
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
                marcada={escolhas.tipografia === combinacao.id}
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
              <Opcao key={ideia.id} grupo="logo" opcao={{ ...ideia, ideia: ideia.conceito }} marcada={escolhas.logo === ideia.id} aoMarcar={() => escolherLogo(ideia.id)}>
                <PreviaLogo ideia={ideia} nome={nome} />
              </Opcao>
            ))}
          </Opcoes>
        )}
      </main>

      <footer className="sticky bottom-0 -mx-4 bg-background/95 px-4 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2">
          {passo > 0 ? (
            <Botao variante="fantasma" onClick={() => irPara(passo - 1)} disabled={montando}>
              <ArrowLeft /> Voltar
            </Botao>
          ) : (
            !limite && <p className="text-sm text-texto-2 max-sm:sr-only">Dá para ajustar tudo depois, no cérebro da marca.</p>
          )}
          <p aria-live="polite" className={cn("ms-auto text-sm text-texto-2 max-sm:order-first max-sm:w-full", faltam > 0 && "font-medium text-texto")}>
            {avisoContagem}
          </p>
          {ultimo ? (
            <Plimm rotulo={montando ? "montando…" : "montar minha marca"} carregando={montando} onClick={montar} className={cn(!limite && "ms-auto")} />
          ) : (
            <Botao variante="primario" onClick={() => irPara(passo + 1)} disabled={faltam > 0} className={cn(!limite && "ms-auto", "max-sm:ms-auto")}>
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

/* ---------- Escolha de várias (diferenciais e personalidade) ---------- */

function Marcaveis({ rotulo, colunas, children }: { rotulo: string; colunas: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{rotulo}</legend>
      <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", colunas)}>{children}</div>
    </fieldset>
  )
}

/**
 * Card que marca e desmarca (caixa de seleção de verdade, escondida). Marcado ganha fundo lima-suave e o ✓,
 * sem contorno. Com o limite cheio, os não marcados ficam apagados até a pessoa desmarcar um.
 * "sugestão" mostra o que o Hattie escolheria; "escrito por você" marca o que veio do campo livre.
 */
function Marcavel({
  titulo,
  texto,
  detalhe,
  palavra = false,
  sugerida = false,
  propria = false,
  marcado,
  bloqueado = false,
  aoAlternar,
}: {
  titulo: string
  texto: string
  detalhe?: string
  palavra?: boolean
  sugerida?: boolean
  propria?: boolean
  marcado: boolean
  bloqueado?: boolean
  aoAlternar: () => void
}) {
  return (
    <label
      className={cn(
        "group flex flex-col gap-2 rounded-3xl p-4 transition-[background-color,opacity] duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-texto",
        marcado ? "bg-acao-suave" : "bg-preenchimento",
        bloqueado ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        !marcado && !bloqueado && "hover:bg-preenchimento-hover",
      )}
    >
      <input type="checkbox" checked={marcado} onChange={aoAlternar} disabled={bloqueado} className="sr-only" />
      <span className="flex items-start gap-2">
        <span className={cn("min-w-0 flex-1", palavra ? "font-heading text-titulo-3 leading-tight font-medium lowercase" : "text-base leading-snug font-semibold")}>{titulo}</span>
        <span
          aria-hidden
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full transition-[background-color,color] duration-150",
            marcado ? "bg-preto text-lima" : "bg-superficie text-transparent group-hover:text-texto-3",
          )}
        >
          <Check className="size-3.5" strokeWidth={2.5} />
        </span>
      </span>
      {(sugerida || propria || detalhe) && (
        <span className="flex flex-wrap items-center gap-1.5">
          {sugerida && (
            <Tag tom="acao" ponto tamanho="sm">
              sugestão
            </Tag>
          )}
          {propria && <Tag tamanho="sm">escrito por você</Tag>}
          {detalhe && <span className="text-xs text-texto-3">{detalhe}</span>}
        </span>
      )}
      <span className="text-sm text-texto-2">{texto}</span>
    </label>
  )
}

/** Campo livre para a pessoa somar o que faltou. O que ela escreve entra marcado e conta no limite. */
function EscreverProprio({
  rotulo,
  exemplo,
  maximo,
  cheio,
  existentes,
  aoAdicionar,
}: {
  rotulo: string
  exemplo: string
  maximo: number
  cheio: boolean
  existentes: string[]
  aoAdicionar: (texto: string) => void
}) {
  const [texto, setTexto] = useState("")
  const [erro, setErro] = useState("")

  function adicionar(evento: FormEvent) {
    evento.preventDefault()
    const limpo = texto.trim()
    if (!limpo) return setErro("Escreva antes de adicionar.")
    if (cheio) return setErro("Chegou ao limite. Desmarque um para incluir o seu.")
    if (existentes.some((item) => item.toLowerCase() === limpo.toLowerCase())) return setErro("Esse já está na lista. É só marcar.")
    aoAdicionar(limpo)
    setTexto("")
    setErro("")
  }

  return (
    <form onSubmit={adicionar} className="flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-start">
      <Campo
        rotulo={rotulo}
        placeholder={exemplo}
        value={texto}
        maxLength={maximo}
        onChange={(evento) => {
          setTexto(evento.target.value)
          if (erro) setErro("")
        }}
        erro={erro || undefined}
        className="flex-1"
      />
      <Botao type="submit" variante="secundario" className="self-start sm:mt-6 sm:h-11">
        <Plus /> Adicionar
      </Botao>
    </form>
  )
}

/* ---------- Escolha de uma (nome, cores, tipografia e logo) ---------- */

function Opcoes({ rotulo, colunas = "md:grid-cols-3", children }: { rotulo: string; colunas?: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={rotulo} className={cn("grid grid-cols-1 gap-3", colunas)}>
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
        marcada ? "bg-acao-suave" : "bg-preenchimento hover:bg-preenchimento-hover",
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
            className={cn("ms-auto grid size-7 shrink-0 place-items-center rounded-full transition-[background-color,color] duration-150", marcada ? "bg-preto text-lima" : "bg-superficie text-transparent group-hover:text-texto-3")}
          >
            <Check className="size-4" strokeWidth={2.5} />
          </span>
        </span>
        <span className="text-sm text-texto-2">{opcao.ideia}</span>
        {detalhe && <span className="text-xs text-texto-3 tabular-nums">{detalhe}</span>}
        {opcao.porque.length > 0 && (
          // No celular, só a opção marcada abre os motivos, para as opções caberem na rolagem sem cansar.
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

const COR_CHECAGEM: Record<StatusChecagem, string> = { livre: "bg-sucesso", verificar: "bg-atencao", "em uso": "bg-erro" }

/** O nome grande, ainda sem as cores da marca (elas vêm depois), e as checagens de domínio, Instagram e registro. */
function PreviaNome({ opcao }: { opcao: OpcaoNome }) {
  return (
    <span className="flex flex-col gap-3 rounded-2xl bg-superficie p-4">
      <span className="grid min-h-24 place-items-center text-center font-serif text-[2rem] leading-tight">{opcao.nome}</span>
      <span className="flex flex-col gap-1 text-xs text-texto-2">
        {opcao.checagens.map((checagem) => (
          <span key={checagem.canal} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-2 shrink-0 rounded-full", COR_CHECAGEM[checagem.status])} />
            <span className="font-medium text-texto">{checagem.canal}</span>
            <span className="truncate">{checagem.status}</span>
          </span>
        ))}
      </span>
      {opcao.atencao && <span className="text-xs text-atencao-texto">{opcao.atencao}</span>}
    </span>
  )
}

/** Só a paleta: faixas na proporção de uso (principal, apoio, fundo e escura), com nome e hex embaixo de cada cor. */
function PreviaPaleta({ opcao }: { opcao: OpcaoPaleta }) {
  const pesos = ["flex-[3]", "flex-[2]", "flex-[2]", "flex-[1.5]"]
  return (
    <span className="flex flex-col gap-2">
      <span aria-hidden className="flex aspect-[2/1] overflow-hidden rounded-2xl md:aspect-[16/10]">
        {opcao.cores.map((cor, indice) => (
          <span key={cor.hex} className={pesos[indice] ?? "flex-1"} style={{ backgroundColor: cor.hex }} />
        ))}
      </span>
      <span className="flex gap-1">
        {opcao.cores.map((cor, indice) => (
          <span key={cor.hex} className={cn("flex min-w-0 flex-col ps-1", pesos[indice] ?? "flex-1")}>
            <span className="truncate text-xs font-medium">{cor.nome}</span>
            <span className="text-micro text-texto-3 uppercase tabular-nums">{cor.hex}</span>
          </span>
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
    <span aria-hidden className="flex aspect-[2/1] flex-col justify-between gap-3 rounded-2xl p-5 md:aspect-[16/10]" style={{ backgroundColor: cores.fundo }}>
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
      <span className="grid aspect-[2/1] place-items-center px-4 md:aspect-[16/10]" style={{ backgroundColor: cores.fundo }}>
        <Logo tipo="composta" simbolo={ideia.simbolo} nome={nome} tinta={cores.principal} altura={34} className="max-w-full" />
      </span>
      <span className="grid h-16 grid-cols-2 gap-1">
        <span className="grid place-items-center" style={{ backgroundColor: cores.principal }}>
          <Simbolo simbolo={ideia.simbolo} tinta={cores.fundo} tamanho={34} iniciais={iniciaisDe(nome)} />
        </span>
        <span className="grid place-items-center" style={{ backgroundColor: cores.apoio }}>
          <Simbolo simbolo={ideia.simbolo} tinta={cores.escuro} tamanho={34} iniciais={iniciaisDe(nome)} />
        </span>
      </span>
    </span>
  )
}
