"use client"

import Link from "next/link"
import type { Route } from "next"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { CalendarDays, Check, ChartLine, Plug, Swords, UsersRound, type LucideIcon } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { EmptyState } from "@/components/hattie/EmptyState"
import { cn } from "@/lib/utils"
import { NOVIDADES_CONCORRENTES } from "@/lib/mock"
import { BotaoColuna, Canvas, ColunaLateral } from "../Layout"
import { useMarca } from "../MarcaContexto"
import { DetalhePost } from "./DetalhePost"
import { GerarCalendario } from "./GerarCalendario"
import { EstadoMarketingProvider, useMarketing } from "./EstadoMarketing"

/*
 * Área de Marketing: coluna com as quatro partes e as fontes de dados, a página ao lado
 * e o detalhe do post, que abre de qualquer parte (visão geral, calendário, concorrentes).
 */

type Item = { segmento: string | null; rotulo: string; icone: LucideIcon }

const ITENS: Item[] = [
  { segmento: null, rotulo: "Visão geral", icone: ChartLine },
  { segmento: "calendario", rotulo: "Calendário", icone: CalendarDays },
  { segmento: "concorrentes", rotulo: "Concorrentes", icone: Swords },
  { segmento: "leads", rotulo: "Leads", icone: UsersRound },
]

const FONTES: { nome: string; conectada: boolean; detalhe: string }[] = [
  { nome: "Instagram", conectada: true, detalhe: "@raiznatural" },
  { nome: "WhatsApp", conectada: true, detalhe: "Conversas e pedidos" },
  { nome: "Loja online", conectada: false, detalhe: "Vendas do site" },
]

function useSegmento() {
  const caminho = usePathname()
  return caminho.split("/marketing")[1]?.split("/")[1] || null
}

/** Contagens que pedem atenção: ideias para aprovar, novidades dos concorrentes e leads esperando resposta. */
function useContagens(): Record<string, number> {
  const { posts, leads } = useMarketing()
  return {
    calendario: posts.filter((post) => post.status === "ideia").length,
    concorrentes: posts.length > 0 ? NOVIDADES_CONCORRENTES.length : 0,
    leads: leads.filter((lead) => lead.aguardando === "voce" && lead.etapa !== "cliente" && lead.etapa !== "perdido").length,
  }
}

export function ShellMarketing({ children }: { children: ReactNode }) {
  return (
    <EstadoMarketingProvider>
      <ColunaLateral titulo="marketing" rotulo="Marketing" className="hidden lg:flex">
        <NavMarketing />
      </ColunaLateral>
      {children}
      <DetalhePost />
      <GerarCalendario />
    </EstadoMarketingProvider>
  )
}

function NavMarketing() {
  const marca = useMarca()
  const ativo = useSegmento()
  const contagens = useContagens()
  const { posts, leads } = useMarketing()
  // Sem dados ainda (marca nova), nenhuma fonte aparece como conectada.
  const comDados = posts.length > 0 || leads.length > 0
  const fontes = FONTES.map((fonte) => ({ ...fonte, conectada: comDados && fonte.conectada }))
  const base = `/marca/${marca.slug}/marketing`
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <nav aria-label="Partes do marketing" className="flex flex-col gap-1">
        {ITENS.map((item) => {
          const atual = ativo === item.segmento
          const contagem = item.segmento ? contagens[item.segmento] : 0
          return (
            <Link
              key={item.rotulo}
              href={`${base}${item.segmento ? `/${item.segmento}` : ""}` as Route}
              aria-current={atual ? "page" : undefined}
              className={cn("flex h-9 items-center gap-2.5 rounded-full px-3 text-sm", atual ? "bg-lima-suave font-medium" : "text-texto-2 hover:bg-preenchimento hover:text-texto")}
            >
              <item.icone className="size-4 shrink-0" strokeWidth={atual ? 2.25 : 1.75} aria-hidden />
              <span className="flex-1">{item.rotulo}</span>
              {contagem > 0 && (
                <span className={cn("grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-micro font-semibold tabular-nums", item.segmento === "leads" ? "bg-preto text-lima" : "bg-preenchimento text-texto-2")}>
                  {contagem}
                  <span className="sr-only">{item.segmento === "leads" ? " esperando resposta" : item.segmento === "calendario" ? " ideias para aprovar" : " novidades"}</span>
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <section aria-labelledby="titulo-fontes" className="mt-auto flex flex-col gap-2 rounded-2xl bg-preenchimento p-3">
        <h3 id="titulo-fontes" className="text-xs font-semibold">
          De onde vêm os números
        </h3>
        <ul className="flex flex-col gap-1.5">
          {fontes.map((fonte) => (
            <li key={fonte.nome} className="flex items-center gap-2 text-xs">
              <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full", fonte.conectada ? "bg-sucesso-suave text-sucesso-texto" : "bg-preenchimento-ativo text-texto-3")}>
                {fonte.conectada ? <Check className="size-3" strokeWidth={2.75} /> : <Plug className="size-3" strokeWidth={2.25} />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium">{fonte.nome}</span>
                <span className="truncate text-texto-2">{fonte.conectada ? fonte.detalhe : "Não conectada"}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link href={`/marca/${marca.slug}/conectores` as Route} className="self-start text-xs font-medium underline underline-offset-4 hover:text-texto-2">
          {comDados ? "Conectar a loja online" : "Conectar as redes"}
        </Link>
        <p className="text-micro text-texto-3">Nesta versão de teste, os números são de exemplo.</p>
      </section>
    </div>
  )
}

/** Cabeçalho das páginas da área: botão da coluna, título, ações e, sem a coluna, as partes em pílulas. */
export function CabecalhoMarketing({ titulo, detalhe, acoes }: { titulo: string; detalhe?: ReactNode; acoes?: ReactNode }) {
  const marca = useMarca()
  const ativo = useSegmento()
  const contagens = useContagens()
  const base = `/marca/${marca.slug}/marketing`
  return (
    <header className="flex flex-col gap-3 border-b border-borda-sutil pb-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 basis-48 items-center gap-2">
          <BotaoColuna />
          <h1 className="min-w-0 truncate font-heading text-titulo-3 font-medium lowercase @xl:text-titulo-2">{titulo}</h1>
          {detalhe && <span className="shrink-0 pt-1 text-xs text-texto-3">{detalhe}</span>}
        </div>
        {acoes && <div className="flex max-w-full flex-wrap items-center gap-2">{acoes}</div>}
      </div>
      <nav aria-label="Partes do marketing" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 lg:hidden">
        {ITENS.map((item) => {
          const atual = ativo === item.segmento
          const contagem = item.segmento ? contagens[item.segmento] : 0
          return (
            <Link
              key={item.rotulo}
              href={`${base}${item.segmento ? `/${item.segmento}` : ""}` as Route}
              aria-current={atual ? "page" : undefined}
              className={cn("flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium", atual ? "bg-preto text-lima" : "bg-superficie text-texto-2")}
            >
              {item.rotulo}
              {contagem > 0 && <span className={cn("text-xs tabular-nums", atual ? "text-lima/70" : "text-texto-3")}>{contagem}</span>}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

/** Marca sem dados ainda: conectar as redes é o primeiro passo. */
export function SemDados({ titulo }: { titulo: string }) {
  const marca = useMarca()
  return (
    <Canvas rotulo={titulo}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <CabecalhoMarketing titulo={titulo} />
        <EmptyState
          icone={Plug}
          titulo="conecte as redes primeiro"
          texto={`Com o Instagram e o WhatsApp da ${marca.nome} conectados, eu leio os números, monto o calendário e acompanho os concorrentes.`}
          acao={
            <Botao variante="primario" asChild>
              <Link href={`/marca/${marca.slug}/conectores` as Route}>
                <Plug /> Conectar as redes
              </Link>
            </Botao>
          }
        />
      </div>
    </Canvas>
  )
}
