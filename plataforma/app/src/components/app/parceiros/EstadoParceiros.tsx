"use client"

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { CONVERSAS_PARCEIROS, TRABALHOS_INICIAIS, getParceiro, type ConversaParceiro, type MensagemParceiro, type TrabalhoParceiro } from "@/lib/mock"

export type Pedido = {
  assunto: string
  mensagem: string
  servicos: string[]
  orcamento?: string
  prazo?: string
  /** Nome do projeto da marca. */
  projeto?: string
  tarefa?: string
  /** Seções do cérebro que o parceiro vai ver (ids de SECOES). */
  anexos: string[]
  nomeMarca: string
}

type Contexto = {
  trabalhos: TrabalhoParceiro[]
  conversas: ConversaParceiro[]
  naoLidas: number
  /** Cria o trabalho no quadro e a conversa. Devolve o id da conversa. */
  contratar: (parceiroId: string, pedido: Pedido) => string
  enviarMensagem: (conversaId: string, texto: string) => void
  aprovarProposta: (conversaId: string) => void
  aprovarEntrega: (trabalhoId: string) => void
  lerConversa: (conversaId: string) => void
}

const Ctx = createContext<Contexto | null>(null)

const agora = () => new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

/**
 * Estado da área de parceiros, compartilhado entre Contratar, Mensagens, Quadro e perfil:
 * um pedido vira conversa e card no quadro; aprovar a proposta move o trabalho para "em andamento".
 */
export function EstadoParceirosProvider({ children }: { children: ReactNode }) {
  const [trabalhos, setTrabalhos] = useState(TRABALHOS_INICIAIS)
  const [conversas, setConversas] = useState(CONVERSAS_PARCEIROS)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const adicionar = useCallback((conversaId: string, mensagem: MensagemParceiro, naoLida = false) => {
    setConversas((atual) =>
      atual.map((conversa) =>
        conversa.id === conversaId
          ? { ...conversa, mensagens: [...conversa.mensagens, mensagem], naoLidas: conversa.naoLidas + (naoLida ? 1 : 0) }
          : conversa,
      ),
    )
  }, [])

  const contratar = useCallback(
    (parceiroId: string, pedido: Pedido) => {
      const parceiro = getParceiro(parceiroId)
      const id = `pedido-${Date.now()}`
      const primeiro = parceiro?.nome.split(" ")[0] ?? "o parceiro"
      const detalhes = [pedido.servicos.length ? `Ajuda com: ${pedido.servicos.join(", ")}.` : "", pedido.orcamento ? `Orçamento: ${pedido.orcamento}.` : "", pedido.prazo ? `Prazo: ${pedido.prazo}.` : ""]
        .filter(Boolean)
        .join(" ")
      const mensagens: MensagemParceiro[] = [{ id: `${id}-1`, autor: "pessoa", texto: [pedido.mensagem, detalhes].filter(Boolean).join("\n\n"), quando: `hoje, ${agora()}` }]
      const ligacao = pedido.projeto ? `Liguei o pedido ao projeto ${pedido.projeto}${pedido.tarefa ? `, na tarefa ${pedido.tarefa}` : ""}.` : ""
      const partilha = pedido.anexos.length ? `${primeiro} já pode ver estas partes da ${pedido.nomeMarca}:` : ""
      if (ligacao || partilha) {
        mensagens.push({
          id: `${id}-2`,
          autor: "hattie",
          texto: [ligacao, partilha].filter(Boolean).join(" "),
          quando: `hoje, ${agora()}`,
          anexos: pedido.anexos.length ? pedido.anexos : undefined,
        })
      }
      setConversas((atual) => [{ id, parceiro: parceiroId, assunto: pedido.assunto, naoLidas: 0, mensagens }, ...atual])
      setTrabalhos((atual) => [{ id, titulo: pedido.assunto, parceiro: parceiroId, etapa: "pedido", prazo: pedido.prazo ?? "A combinar", projeto: pedido.projeto, tarefa: pedido.tarefa }, ...atual])
      timers.current.push(
        setTimeout(
          () =>
            adicionar(
              id,
              { id: `${id}-3`, autor: "parceiro", texto: `Oi! Recebi seu pedido e já estou lendo o que você compartilhou da marca. Te mando uma proposta com valor e prazo até amanhã.`, quando: `hoje, ${agora()}` },
              true,
            ),
          4000,
        ),
      )
      return id
    },
    [adicionar],
  )

  const enviarMensagem = useCallback(
    (conversaId: string, texto: string) => adicionar(conversaId, { id: `${conversaId}-${Date.now()}`, autor: "pessoa", texto, quando: `hoje, ${agora()}` }),
    [adicionar],
  )

  const aprovarProposta = useCallback(
    (conversaId: string) => {
      setConversas((atual) =>
        atual.map((conversa) =>
          conversa.id === conversaId
            ? { ...conversa, mensagens: conversa.mensagens.map((mensagem) => (mensagem.proposta ? { ...mensagem, proposta: { ...mensagem.proposta, status: "aprovada" as const } } : mensagem)) }
            : conversa,
        ),
      )
      setTrabalhos((atual) => atual.map((trabalho) => (trabalho.id === conversaId ? { ...trabalho, etapa: "andamento", progresso: 5 } : trabalho)))
      adicionar(conversaId, {
        id: `${conversaId}-aprovada-${Date.now()}`,
        autor: "hattie",
        texto: "Proposta aprovada. O valor fica reservado e só vai para o parceiro quando você aprovar a entrega.",
        quando: `hoje, ${agora()}`,
      })
    },
    [adicionar],
  )

  const aprovarEntrega = useCallback(
    (trabalhoId: string) => setTrabalhos((atual) => atual.map((trabalho) => (trabalho.id === trabalhoId ? { ...trabalho, etapa: "entregue", prazo: `Concluído hoje` } : trabalho))),
    [],
  )

  const lerConversa = useCallback(
    (conversaId: string) => setConversas((atual) => (atual.some((conversa) => conversa.id === conversaId && conversa.naoLidas > 0) ? atual.map((conversa) => (conversa.id === conversaId ? { ...conversa, naoLidas: 0 } : conversa)) : atual)),
    [],
  )

  const naoLidas = conversas.reduce((soma, conversa) => soma + conversa.naoLidas, 0)

  const valor = useMemo(
    () => ({ trabalhos, conversas, naoLidas, contratar, enviarMensagem, aprovarProposta, aprovarEntrega, lerConversa }),
    [trabalhos, conversas, naoLidas, contratar, enviarMensagem, aprovarProposta, aprovarEntrega, lerConversa],
  )
  return <Ctx value={valor}>{children}</Ctx>
}

export function useParceiros() {
  const contexto = use(Ctx)
  if (!contexto) throw new Error("useParceiros precisa estar dentro do EstadoParceirosProvider")
  return contexto
}
