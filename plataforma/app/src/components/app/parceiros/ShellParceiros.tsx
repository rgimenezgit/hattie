"use client"

import Link from "next/link"
import type { Route } from "next"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { KanbanSquare, MessagesSquare, UserRoundSearch, type LucideIcon } from "lucide-react"
import { notificar } from "@/components/hattie/Notificacao"
import { cn } from "@/lib/utils"
import { ETAPAS, getParceiro } from "@/lib/mock"
import { CabecalhoCanvas, ColunaLateral } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { AvatarParceiro } from "./Comuns"
import { EstadoParceirosProvider, useParceiros } from "./EstadoParceiros"

type Item = { segmento: string | null; caminho: string; rotulo: string; icone: LucideIcon }

const ITENS: Item[] = [
  { segmento: null, caminho: "", rotulo: "Contratar", icone: UserRoundSearch },
  { segmento: "mensagens", caminho: "/mensagens", rotulo: "Mensagens", icone: MessagesSquare },
  { segmento: "quadro", caminho: "/quadro", rotulo: "Quadro", icone: KanbanSquare },
]

/**
 * Área ativa pelo caminho, para funcionar tanto na coluna lateral (layout) quanto no topo de cada página.
 * O perfil do parceiro fica dentro de Contratar.
 */
function useItemAtivo() {
  const caminho = usePathname()
  const segmento = caminho.split("/parceiros")[1]?.split("/")[1] || null
  return segmento === "perfil" ? null : segmento
}

function useContagens() {
  const { naoLidas, trabalhos } = useParceiros()
  const ativos = trabalhos.filter((trabalho) => trabalho.etapa !== "entregue").length
  return { mensagens: naoLidas, quadro: ativos } as Record<string, number>
}

/** Área de parceiros: estado compartilhado, coluna lateral no desktop e a página ao lado. */
export function ShellParceiros({ children }: { children: ReactNode }) {
  return (
    <EstadoParceirosProvider>
      <ColunaLateral titulo="parceiros" rotulo="Parceiros" className="hidden lg:flex">
        <NavParceiros />
      </ColunaLateral>
      {children}
    </EstadoParceirosProvider>
  )
}

function NavParceiros() {
  const marca = useMarca()
  const ativo = useItemAtivo()
  const contagens = useContagens()
  const { trabalhos } = useParceiros()
  const base = `/marca/${marca.slug}/parceiros`
  const emCurso = trabalhos.filter((trabalho) => trabalho.etapa !== "entregue")

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <nav aria-label="Áreas de parceiros" className="flex flex-col gap-1">
        {ITENS.map((item) => {
          const atual = ativo === item.segmento
          const contagem = item.segmento ? contagens[item.segmento] : 0
          return (
            <Link
              key={item.rotulo}
              href={`${base}${item.caminho}` as Route}
              aria-current={atual ? "page" : undefined}
              className={cn("flex h-9 items-center gap-2.5 rounded-full px-3 text-sm", atual ? "bg-lima-suave font-medium" : "text-texto-2 hover:bg-preenchimento hover:text-texto")}
            >
              <item.icone className="size-4 shrink-0" strokeWidth={atual ? 2.25 : 1.75} aria-hidden />
              <span className="flex-1">{item.rotulo}</span>
              {contagem > 0 && (
                <span className={cn("grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-micro font-semibold tabular-nums", item.segmento === "mensagens" ? "bg-preto text-lima" : "bg-preenchimento text-texto-2")}>
                  {contagem}
                  <span className="sr-only">{item.segmento === "mensagens" ? " não lidas" : " em curso"}</span>
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {emCurso.length > 0 && (
        <section aria-labelledby="titulo-em-curso" className="flex min-h-0 flex-col gap-1.5">
          <h3 id="titulo-em-curso" className="px-3 text-xs text-texto-3">
            Trabalhando com você
          </h3>
          <ul className="-mx-1 flex min-h-0 flex-col gap-0.5 overflow-y-auto px-1">
            {emCurso.map((trabalho) => {
              const parceiro = getParceiro(trabalho.parceiro)
              if (!parceiro) return null
              return (
                <li key={trabalho.id}>
                  <Link href={`${base}/mensagens/${trabalho.id}` as Route} className="flex items-center gap-2.5 rounded-2xl px-2 py-1.5 hover:bg-preenchimento">
                    <AvatarParceiro parceiro={parceiro} tamanho={28} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs font-medium">{trabalho.titulo}</span>
                      <span className="truncate text-micro text-texto-3">
                        {parceiro.nome.split(" ")[0]} · {ETAPAS.find((etapa) => etapa.id === trabalho.etapa)?.titulo}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="mt-auto flex flex-col gap-1 rounded-2xl bg-preenchimento p-3">
        <p className="text-xs font-semibold">Quer ser parceiro?</p>
        <p className="text-xs text-texto-2">Designers, fotógrafos e estrategistas recebem pedidos de marcas que já têm o cérebro pronto.</p>
        <button
          type="button"
          onClick={() => notificar({ titulo: "em breve", texto: "O cadastro de parceiros abre na próxima etapa." })}
          className="mt-1 self-start text-xs font-medium underline underline-offset-4 hover:text-texto-2"
        >
          Quero me inscrever
        </button>
      </div>
    </div>
  )
}

/** Cabeçalho das páginas de parceiros; no celular, traz a navegação entre Contratar, Mensagens e Quadro. */
export function TopoParceiros({ titulo, subtitulo, acoes }: { titulo: string; subtitulo?: string; acoes?: ReactNode }) {
  const marca = useMarca()
  const ativo = useItemAtivo()
  const contagens = useContagens()
  return (
    <div className="flex flex-col gap-3">
      <nav aria-label="Áreas de parceiros" className="no-scrollbar -mx-4 flex overflow-x-auto px-4 lg:hidden">
        <div className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-superficie p-1">
          {ITENS.map((item) => {
            const atual = ativo === item.segmento
            const contagem = item.segmento ? contagens[item.segmento] : 0
            return (
              <Link
                key={item.rotulo}
                href={`/marca/${marca.slug}/parceiros${item.caminho}` as Route}
                aria-current={atual ? "page" : undefined}
                className={cn("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium whitespace-nowrap", atual ? "bg-acao text-preto" : "text-texto-2 hover:bg-preenchimento")}
              >
                <item.icone className="size-4" strokeWidth={1.75} aria-hidden />
                {item.rotulo}
                {contagem > 0 && <span className="text-xs text-texto-3 tabular-nums">{contagem}</span>}
              </Link>
            )
          })}
        </div>
      </nav>
      <CabecalhoCanvas titulo={titulo} subtitulo={subtitulo} acoes={acoes} />
    </div>
  )
}
