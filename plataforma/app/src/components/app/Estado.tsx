"use client"

import { createContext, use, useCallback, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"
import {
  PASSOS_PLANO,
  RECONHECIMENTOS,
  RESPOSTAS_EXEMPLO,
  SECOES,
  STATUS_INICIAL,
  getSecao,
  type Concorrente,
  type Diferencial,
  type EstiloFoto,
  type Mensagem,
  type MensagemChave,
  type ObjetivoMarca,
  type Persona,
  type ProdutoMarca,
  type Publico,
  type Referencia,
  type StatusPasso,
  type StatusSecao,
  type TracoPersonalidade,
} from "@/lib/mock"

type Etapa = "rascunho" | "pronta"

type EstadoApp = {
  nomeMarca: string
  etapa: Etapa
  passos: Record<string, StatusPasso>
  mensagens: Mensagem[]
  digitando: boolean
  secoes: Record<string, StatusSecao>
  iniciarCriacao: (texto: string, anexos: string[]) => void
  responder: (texto: string) => void
  pularPasso: (id: string) => void
  irParaPasso: (id: string) => void
  concluirCriacao: () => void
  aprovar: (id: string) => void
  reabrir: (id: string) => void
  publicosNovos: Publico[]
  personasNovas: Persona[]
  adicionarPublico: (publico: Publico) => void
  adicionarPersona: (persona: Persona) => void
  referenciasNovas: Referencia[]
  concorrentesNovos: Concorrente[]
  adicionarReferencia: (referencia: Referencia) => void
  adicionarConcorrente: (concorrente: Concorrente) => void
  nomeEscolhido: string | null
  escolherNome: (id: string, nome: string) => void
  /**
   * Primeiras escolhas, depois da conversa: diferenciais e personalidade (com o que a pessoa escreveu),
   * nome, paleta, tipografia e logo. Antes delas, valem as propostas e apostas do Hattie.
   */
  diferenciaisEscolhidos: { ids: string[]; proprios: Diferencial[] } | null
  salvarDiferenciais: Dispatch<SetStateAction<{ ids: string[]; proprios: Diferencial[] } | null>>
  personalidadeEscolhida: { ids: string[]; proprias: TracoPersonalidade[] } | null
  salvarPersonalidade: Dispatch<SetStateAction<{ ids: string[]; proprias: TracoPersonalidade[] } | null>>
  paletaEscolhida: string | null
  escolherPaleta: (id: string | null) => void
  logoEscolhido: string | null
  escolherLogo: (id: string | null) => void
  tipografiaEscolhida: string | null
  escolherTipografia: (id: string | null) => void
  estilosFoto: EstiloFoto[] | null
  salvarEstilosFoto: (estilos: EstiloFoto[]) => void
  estilosIlustracao: EstiloFoto[] | null
  salvarEstilosIlustracao: (estilos: EstiloFoto[]) => void
  /** Itens apagados (referências, concorrentes…), pelo id. Sai da tela e volta com "Desfazer". */
  removidos: Record<string, true>
  remover: (id: string) => void
  restaurar: (id: string) => void
  /** Lista de objetivos depois da primeira mudança; antes disso vale a do Hattie. */
  objetivos: ObjetivoMarca[] | null
  salvarObjetivos: (objetivos: ObjetivoMarca[]) => void
  /** Lista de produtos e serviços depois da primeira mudança. */
  produtos: ProdutoMarca[] | null
  salvarProdutos: (produtos: ProdutoMarca[]) => void
  /** Mensagens-chave depois da primeira mudança. */
  mensagensChave: MensagemChave[] | null
  salvarMensagensChave: (mensagens: MensagemChave[]) => void
}

const Contexto = createContext<EstadoApp | null>(null)

let contador = 0
const novoId = () => `m${++contador}`
const hattie = (texto: string): Mensagem => ({ id: novoId(), autor: "hattie", texto })
const pessoa = (texto: string, anexos?: string[]): Mensagem => ({ id: novoId(), autor: "pessoa", texto, anexos })

const INTRO =
  "Vou te fazer algumas perguntas para montar a base da sua marca. No plano ao lado estão os pontos que vamos passar. Se quiser pular algum, eu decido por você com base no que você já me contou."

function conversaPronta(): Mensagem[] {
  const mensagens: Mensagem[] = [
    pessoa("Faço cosméticos naturais em Ribeirão Preto, com ingredientes do cerrado, e vendo pelo Instagram e WhatsApp.", [
      "catalogo-2026.pdf",
      "fotos-produtos.zip",
    ]),
    hattie(`Oi, Bia! Li a sua ideia e os 2 materiais que você mandou. ${INTRO}`),
  ]
  PASSOS_PLANO.forEach((passo) => {
    mensagens.push(hattie(passo.pergunta), pessoa(RESPOSTAS_EXEMPLO[passo.id]))
  })
  mensagens.push(hattie("Tcharam! Montei a base da Raiz Natural. Tudo está no cérebro da sua marca esperando o seu ok."))
  return mensagens
}

function proximoPendente(passos: Record<string, StatusPasso>, depoisDe?: string) {
  const inicio = depoisDe ? PASSOS_PLANO.findIndex((passo) => passo.id === depoisDe) + 1 : 0
  const ordem = [...PASSOS_PLANO.slice(inicio), ...PASSOS_PLANO.slice(0, inicio)]
  return ordem.find((passo) => passos[passo.id] === "pendente")
}

export function EstadoProvider({ children }: { children: ReactNode }) {
  const [nomeMarca, setNomeMarca] = useState("Raiz Natural")
  const [etapa, setEtapa] = useState<Etapa>("pronta")
  const [passos, setPassos] = useState<Record<string, StatusPasso>>(() =>
    Object.fromEntries(PASSOS_PLANO.map((passo) => [passo.id, "respondido"])),
  )
  const [mensagens, setMensagens] = useState<Mensagem[]>(conversaPronta)
  const [digitando, setDigitando] = useState(false)
  const [secoes, setSecoes] = useState<Record<string, StatusSecao>>(STATUS_INICIAL)
  const [publicosNovos, setPublicosNovos] = useState<Publico[]>([])
  const [personasNovas, setPersonasNovas] = useState<Persona[]>([])
  const [referenciasNovas, setReferenciasNovas] = useState<Referencia[]>([])
  const [concorrentesNovos, setConcorrentesNovos] = useState<Concorrente[]>([])
  const [nomeEscolhido, setNomeEscolhido] = useState<string | null>(null)
  const [diferenciaisEscolhidos, salvarDiferenciais] = useState<{ ids: string[]; proprios: Diferencial[] } | null>(null)
  const [personalidadeEscolhida, salvarPersonalidade] = useState<{ ids: string[]; proprias: TracoPersonalidade[] } | null>(null)
  const [paletaEscolhida, escolherPaleta] = useState<string | null>(null)
  const [logoEscolhido, escolherLogo] = useState<string | null>(null)
  const [tipografiaEscolhida, escolherTipografia] = useState<string | null>(null)
  const [estilosFoto, salvarEstilosFoto] = useState<EstiloFoto[] | null>(null)
  const [estilosIlustracao, salvarEstilosIlustracao] = useState<EstiloFoto[] | null>(null)
  const [removidos, setRemovidos] = useState<Record<string, true>>({})
  const [objetivos, salvarObjetivos] = useState<ObjetivoMarca[] | null>(null)
  const [produtos, salvarProdutos] = useState<ProdutoMarca[] | null>(null)
  const [mensagensChave, salvarMensagensChave] = useState<MensagemChave[] | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const esperando = useRef<Mensagem[]>([])

  const descarregar = useCallback(() => {
    if (!timer.current) return
    clearTimeout(timer.current)
    timer.current = null
    const pendentes = esperando.current
    esperando.current = []
    setMensagens((atual) => [...atual, ...pendentes])
  }, [])

  const hattieResponde = useCallback((novas: Mensagem[]) => {
    descarregar()
    esperando.current = novas
    setDigitando(true)
    timer.current = setTimeout(() => {
      timer.current = null
      esperando.current = []
      setDigitando(false)
      setMensagens((atual) => [...atual, ...novas])
    }, 900)
  }, [descarregar])

  const iniciarCriacao = useCallback(
    (texto: string, anexos: string[]) => {
      const inicial: Record<string, StatusPasso> = Object.fromEntries(
        PASSOS_PLANO.map((passo, indice) => [passo.id, indice === 0 ? "atual" : "pendente"]),
      )
      setNomeMarca("Marca da Bia")
      setEtapa("rascunho")
      setPassos(inicial)
      setSecoes(Object.fromEntries(SECOES.map((secao) => [secao.id, "pendente"])))
      setMensagens([pessoa(texto, anexos)])
      const materiais = anexos.length ? ` e ${anexos.length === 1 ? "o material" : `os ${anexos.length} materiais`} que você mandou` : ""
      hattieResponde([hattie(`Oi, Bia! Li a sua ideia${materiais}. ${INTRO}`), hattie(PASSOS_PLANO[0].pergunta)])
    },
    [hattieResponde],
  )

  const avancar = useCallback(
    (resolvido: string, novoStatus: "respondido" | "pulado", abertura: string) => {
      const proximo: Record<string, StatusPasso> = { ...passos, [resolvido]: novoStatus }
      const seguinte = proximoPendente(proximo, resolvido)
      if (seguinte) proximo[seguinte.id] = "atual"
      setPassos(proximo)
      hattieResponde([
        hattie(
          seguinte
            ? `${abertura} ${seguinte.pergunta}`
            : `${abertura} Tenho o que preciso para montar a base da sua marca. Quando quiser, é só clicar em Criar minha marca.`,
        ),
      ])
    },
    [passos, hattieResponde],
  )

  const responder = useCallback(
    (texto: string) => {
      descarregar()
      setMensagens((atual) => [...atual, pessoa(texto)])
      const atual = PASSOS_PLANO.find((passo) => passos[passo.id] === "atual")
      if (!atual) {
        hattieResponde([hattie("Anotado, Bia. Isso vai junto para o cérebro da sua marca.")])
        return
      }
      const indice = Object.values(passos).filter((status) => status === "respondido").length
      avancar(atual.id, "respondido", RECONHECIMENTOS[indice % RECONHECIMENTOS.length])
    },
    [passos, avancar, hattieResponde, descarregar],
  )

  const pularPasso = useCallback(
    (id: string) => {
      descarregar()
      setMensagens((atual) => [...atual, pessoa("Pula esse, você decide.")])
      avancar(id, "pulado", "Combinado, esse ponto fica comigo.")
    },
    [avancar, descarregar],
  )

  const irParaPasso = useCallback(
    (id: string) => {
      const passo = PASSOS_PLANO.find((item) => item.id === id)
      if (!passo) return
      setPassos((atual) => {
        const proximo = { ...atual }
        for (const chave of Object.keys(proximo)) if (proximo[chave] === "atual") proximo[chave] = "pendente"
        proximo[id] = "atual"
        return proximo
      })
      hattieResponde([hattie(`Bora voltar em ${passo.titulo.toLowerCase()}. ${passo.pergunta}`)])
    },
    [hattieResponde],
  )

  const concluirCriacao = useCallback(() => {
    setPassos((atual) =>
      Object.fromEntries(Object.entries(atual).map(([id, status]) => [id, status === "respondido" ? status : "pulado"])),
    )
    setNomeMarca("Raiz Natural")
    setEtapa("pronta")
  }, [])

  const aprovar = useCallback((id: string) => {
    if (getSecao(id)) setSecoes((atual) => ({ ...atual, [id]: "aprovada" }))
  }, [])

  const reabrir = useCallback((id: string) => {
    setSecoes((atual) => ({ ...atual, [id]: "pendente" }))
  }, [])

  const adicionarPublico = useCallback((publico: Publico) => setPublicosNovos((atual) => [...atual, publico]), [])
  const adicionarPersona = useCallback((persona: Persona) => setPersonasNovas((atual) => [...atual, persona]), [])
  const adicionarReferencia = useCallback((referencia: Referencia) => setReferenciasNovas((atual) => [...atual, referencia]), [])
  const escolherNome = useCallback((id: string, nome: string) => {
    setNomeEscolhido(id)
    setNomeMarca(nome)
  }, [])
  const adicionarConcorrente = useCallback((concorrente: Concorrente) => setConcorrentesNovos((atual) => [...atual, concorrente]), [])
  const remover = useCallback((id: string) => setRemovidos((atual) => ({ ...atual, [id]: true })), [])
  const restaurar = useCallback((id: string) => {
    setRemovidos((atual) => {
      const proximo = { ...atual }
      delete proximo[id]
      return proximo
    })
  }, [])

  const valor = useMemo<EstadoApp>(
    () => ({
      nomeMarca,
      etapa,
      passos,
      mensagens,
      digitando,
      secoes,
      iniciarCriacao,
      responder,
      pularPasso,
      irParaPasso,
      concluirCriacao,
      aprovar,
      reabrir,
      publicosNovos,
      personasNovas,
      adicionarPublico,
      adicionarPersona,
      referenciasNovas,
      concorrentesNovos,
      adicionarReferencia,
      adicionarConcorrente,
      nomeEscolhido,
      escolherNome,
      diferenciaisEscolhidos,
      salvarDiferenciais,
      personalidadeEscolhida,
      salvarPersonalidade,
      paletaEscolhida,
      escolherPaleta,
      logoEscolhido,
      escolherLogo,
      tipografiaEscolhida,
      escolherTipografia,
      estilosFoto,
      salvarEstilosFoto,
      estilosIlustracao,
      salvarEstilosIlustracao,
      removidos,
      remover,
      restaurar,
      objetivos,
      salvarObjetivos,
      produtos,
      salvarProdutos,
      mensagensChave,
      salvarMensagensChave,
    }),
    [
      nomeMarca,
      etapa,
      passos,
      mensagens,
      digitando,
      secoes,
      iniciarCriacao,
      responder,
      pularPasso,
      irParaPasso,
      concluirCriacao,
      aprovar,
      reabrir,
      publicosNovos,
      personasNovas,
      adicionarPublico,
      adicionarPersona,
      referenciasNovas,
      concorrentesNovos,
      adicionarReferencia,
      adicionarConcorrente,
      nomeEscolhido,
      escolherNome,
      diferenciaisEscolhidos,
      personalidadeEscolhida,
      paletaEscolhida,
      logoEscolhido,
      tipografiaEscolhida,
      estilosFoto,
      estilosIlustracao,
      removidos,
      remover,
      restaurar,
      objetivos,
      produtos,
      mensagensChave,
    ],
  )

  return <Contexto value={valor}>{children}</Contexto>
}

export function useEstado() {
  const contexto = use(Contexto)
  if (!contexto) throw new Error("useEstado precisa estar dentro do EstadoProvider")
  return contexto
}
