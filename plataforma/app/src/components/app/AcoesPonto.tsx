"use client"

import type { Route } from "next"
import { createContext, use, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { SquarePen, Trash2, UsersRound } from "lucide-react"
import { MenuAcoes, type ItemMenu } from "@/components/hattie/MenuAcoes"
import { notificar } from "@/components/hattie/Notificacao"
import { guardarPedidoParceiro } from "@/lib/pedidoParceiro"
import { getSecao, type EspecialidadeParceiro } from "@/lib/mock"
import { useEstado } from "./Estado"
import { useMarca } from "./MarcaContexto"

/*
 * Ações de um ponto da marca: todo container com conteúdo único (um produto, uma persona, o logo, um estilo de foto…)
 * tem o menu de três pontos com "Editar com o Hattie" e "Contratar um parceiro" para aquele ponto específico.
 * O contexto vem do cérebro: qual seção está aberta e como abrir o painel de edição focado num ponto.
 */

/** Especialidade de parceiro mais ligada a cada seção do cérebro. */
const ESPECIALIDADE: Record<string, EspecialidadeParceiro> = {
  nome: "Naming",
  tagline: "Naming",
  mensagens: "Texto e copy",
  "tom-de-voz": "Texto e copy",
  produtos: "Embalagem",
  logo: "Logo e marca",
  cores: "Logo e marca",
  tipografia: "Logo e marca",
  grafismos: "Ilustração",
  fotografia: "Fotografia",
  ilustracao: "Ilustração",
  aplicacoes: "Social media",
  movimento: "Motion",
}

export function especialidadeDaSecao(secaoId: string): EspecialidadeParceiro {
  return ESPECIALIDADE[secaoId] ?? "Estratégia de marca"
}

type Contexto = { secaoId: string; editar: (secaoId: string, foco?: string) => void }

const Ctx = createContext<Contexto | null>(null)

export function AcoesPontoProvider({ secaoId, editar, children }: Contexto & { children: ReactNode }) {
  return <Ctx value={{ secaoId, editar }}>{children}</Ctx>
}

/** Pedido que chega pronto em Parceiros: o ponto, a seção e a marca. */
export function usePedirParceiro() {
  const router = useRouter()
  const marca = useMarca()
  const { nomeMarca } = useEstado()
  const nome = marca.slug === "raiz-natural" ? nomeMarca : marca.nome
  return (secaoId: string, ponto?: string) => {
    const secao = getSecao(secaoId)
    const alvo = ponto && ponto !== secao?.titulo ? `${ponto} (${secao?.titulo.toLowerCase()})` : (secao?.titulo.toLowerCase() ?? "a marca")
    guardarPedidoParceiro(`Preciso de um parceiro de ${especialidadeDaSecao(secaoId).toLowerCase()} para cuidar deste ponto da ${nome}: ${alvo}. Quem eu contratar recebe o cérebro da marca.`)
    router.push(`/marca/${marca.slug}/parceiros` as Route)
  }
}

/**
 * Aviso de item apagado, com "Desfazer". Apagar não pede confirmação: o item some na hora e volta pelo aviso.
 * `texto` diz o que saiu e de onde ("Tirei a Aesop das referências.").
 */
export function avisarRemocao(texto: string, desfazer: () => void) {
  notificar({ titulo: "apagado", texto, som: "puff", acao: { rotulo: "Desfazer", aoClicar: desfazer } })
}

type MenuPontoProps = {
  ponto: string
  className?: string
  /** Ações próprias do item, antes das padrão (ex.: "Editar produto"). */
  acoes?: ItemMenu[]
  /** Com esta função, o menu ganha "Excluir" no fim. */
  aoExcluir?: () => void
  /** Motivo para não excluir agora ("fica pelo menos um"): o item aparece desativado com a nota. */
  excluirBloqueado?: string
}

/**
 * Menu de três pontos de um ponto da marca. `ponto` é o nome do que está no container ("Óleo de pequi", "o logo").
 * Fora do cérebro (sem contexto), não aparece.
 */
export function MenuPonto({ ponto, className, acoes = [], aoExcluir, excluirBloqueado }: MenuPontoProps) {
  const contexto = use(Ctx)
  const pedir = usePedirParceiro()
  if (!contexto) return null
  const { secaoId, editar } = contexto
  const itens: ItemMenu[] = [
    ...acoes,
    { rotulo: "Editar com o Hattie", icone: SquarePen, abrePainel: true, onSelect: () => editar(secaoId, ponto) },
    { rotulo: "Contratar um parceiro", icone: UsersRound, onSelect: () => pedir(secaoId, ponto) },
  ]
  if (aoExcluir) itens.push({ rotulo: "Excluir", icone: Trash2, separarAntes: true, onSelect: aoExcluir, desativado: Boolean(excluirBloqueado), nota: excluirBloqueado })
  return <MenuAcoes rotulo={`Ações de ${ponto}`} className={className} itens={itens} />
}
