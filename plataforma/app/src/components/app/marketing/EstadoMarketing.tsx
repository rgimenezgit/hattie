"use client"

import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react"
import { notificar } from "@/components/hattie/Notificacao"
import { montarCalendario, type PedidoCalendario } from "@/lib/marketing"
import { HOJE_MARKETING, LEADS, POSTS_CALENDARIO, type EtapaLead, type Lead, type PostCalendario } from "@/lib/mock"
import { useMarca } from "../MarcaContexto"

/*
 * Estado da área de Marketing, compartilhado entre visão geral, calendário, concorrentes e leads.
 * Uma ideia criada em Concorrentes aparece no Calendário; um lojista que vira cliente conta na meta da visão geral.
 * Nesta versão de teste, tudo volta ao exemplo quando a página recarrega.
 */

type Contexto = {
  hoje: string
  posts: PostCalendario[]
  leads: Lead[]
  /** id do post aberto no detalhe, de qualquer tela. */
  postAberto: string | null
  abrirPost: (id: string | null) => void
  /** Pedido de calendário ao Hattie, aberto de qualquer tela. `observacao` já vem escrita quando o pedido nasce de um post ou de um concorrente. */
  gerador: { observacao: string; porSemana?: number } | null
  abrirGerador: (observacao?: string, porSemana?: number) => void
  fecharGerador: () => void
  /** Mês aberto no calendário ("2026-11"), para o pedido levar a Bia direto às ideias novas. */
  mes: string
  setMes: (mes: string) => void
  salvarPost: (post: PostCalendario) => void
  novoPost: (dados: Partial<PostCalendario> & Pick<PostCalendario, "data" | "titulo">) => string
  excluirPost: (id: string) => void
  /** O Hattie monta as ideias do período. Devolve quantas criou. */
  gerarCalendario: (pedido: PedidoCalendario) => number
  aprovarIdeias: () => void
  descartarIdeias: () => void
  aplicarMudancas: (mudancas: { post: string; aplicar: (post: PostCalendario) => PostCalendario }[]) => void
  moverLead: (id: string, etapa: EtapaLead) => void
  novoLead: (dados: Pick<Lead, "nome" | "tipo" | "origem" | "interesse"> & Partial<Lead>) => string
  responderLead: (id: string, texto: string) => void
}

const Ctx = createContext<Contexto | null>(null)

let sequencia = 0

export function EstadoMarketingProvider({ children }: { children: ReactNode }) {
  const marca = useMarca()
  // Os dados de exemplo são da Raiz Natural; as outras marcas começam vazias, esperando as fontes.
  const exemplo = marca.slug === "raiz-natural"
  const [posts, setPosts] = useState<PostCalendario[]>(exemplo ? POSTS_CALENDARIO : [])
  const [leads, setLeads] = useState<Lead[]>(exemplo ? LEADS : [])
  const [postAberto, abrirPost] = useState<string | null>(null)
  const [gerador, setGerador] = useState<{ observacao: string; porSemana?: number } | null>(null)
  const abrirGerador = useCallback((observacao = "", porSemana?: number) => setGerador({ observacao, porSemana }), [])
  const fecharGerador = useCallback(() => setGerador(null), [])
  const [mes, setMes] = useState(HOJE_MARKETING.slice(0, 7))

  const salvarPost = useCallback((post: PostCalendario) => setPosts((atual) => atual.map((item) => (item.id === post.id ? { ...post, nova: false } : item))), [])

  const novoPost = useCallback((dados: Partial<PostCalendario> & Pick<PostCalendario, "data" | "titulo">) => {
    const id = `pc-manual-${Date.now().toString(36)}-${++sequencia}`
    setPosts((atual) => [...atual, { hora: "19:00", canal: "feed", legenda: "", status: "ideia", origem: "voce", ...dados, id }])
    return id
  }, [])

  const excluirPost = useCallback((id: string) => {
    let antes: PostCalendario[] = []
    setPosts((atual) => {
      antes = atual
      return atual.filter((post) => post.id !== id)
    })
    abrirPost(null)
    notificar({ titulo: "apagado", texto: "Tirei o post do calendário.", som: "puff", acao: { rotulo: "Desfazer", aoClicar: () => setPosts(antes) } })
  }, [])

  const gerarCalendario = useCallback(
    (pedido: PedidoCalendario) => {
      const ideias = montarCalendario(pedido, posts)
      // As ideias anteriores ainda sem ok saem da marcação de "nova"; as novas entram marcadas.
      setPosts((atual) => [...atual.map((post) => ({ ...post, nova: false })), ...ideias])
      return ideias.length
    },
    [posts],
  )

  const aprovarIdeias = useCallback(() => {
    setPosts((atual) => atual.map((post) => (post.nova ? { ...post, status: "aprovado", nova: false } : post)))
    notificar({ titulo: "calendário aprovado", texto: "As ideias viraram posts aprovados. Falta só criar as peças que ainda não têm imagem.", som: "cling" })
  }, [])

  const descartarIdeias = useCallback(() => {
    let antes: PostCalendario[] = []
    setPosts((atual) => {
      antes = atual
      return atual.filter((post) => !post.nova)
    })
    notificar({ titulo: "ideias descartadas", texto: "O calendário voltou a ser o de antes.", acao: { rotulo: "Desfazer", aoClicar: () => setPosts(antes) } })
  }, [])

  const aplicarMudancas = useCallback((mudancas: { post: string; aplicar: (post: PostCalendario) => PostCalendario }[]) => {
    setPosts((atual) =>
      atual.map((post) => {
        const mudanca = mudancas.find((item) => item.post === post.id)
        return mudanca ? mudanca.aplicar(post) : post
      }),
    )
  }, [])

  const moverLead = useCallback((id: string, etapa: EtapaLead) => setLeads((atual) => atual.map((lead) => (lead.id === id ? { ...lead, etapa, ultimoContato: HOJE_MARKETING } : lead))), [])

  const novoLead = useCallback((dados: Pick<Lead, "nome" | "tipo" | "origem" | "interesse"> & Partial<Lead>) => {
    const id = `ld-manual-${Date.now().toString(36)}-${++sequencia}`
    setLeads((atual) => [{ cidade: "", etapa: "novo", ultimoContato: HOJE_MARKETING, aguardando: "voce", mensagens: [], ...dados, id }, ...atual])
    return id
  }, [])

  const responderLead = useCallback((id: string, texto: string) => {
    setLeads((atual) =>
      atual.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              etapa: lead.etapa === "novo" ? "conversa" : lead.etapa,
              aguardando: "lead",
              ultimoContato: HOJE_MARKETING,
              mensagens: [...lead.mensagens, { autor: "voce", texto, quando: "agora" }],
              sugestao: undefined,
            }
          : lead,
      ),
    )
  }, [])

  const valor = useMemo(
    () => ({ hoje: HOJE_MARKETING, posts, leads, postAberto, abrirPost, gerador, abrirGerador, fecharGerador, mes, setMes, salvarPost, novoPost, excluirPost, gerarCalendario, aprovarIdeias, descartarIdeias, aplicarMudancas, moverLead, novoLead, responderLead }),
    [posts, leads, postAberto, gerador, abrirGerador, fecharGerador, mes, setMes, salvarPost, novoPost, excluirPost, gerarCalendario, aprovarIdeias, descartarIdeias, aplicarMudancas, moverLead, novoLead, responderLead],
  )
  return <Ctx value={valor}>{children}</Ctx>
}

export function useMarketing() {
  const contexto = use(Ctx)
  if (!contexto) throw new Error("useMarketing precisa estar dentro do EstadoMarketingProvider")
  return contexto
}
