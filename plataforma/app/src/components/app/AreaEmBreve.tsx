"use client"

import { ChartLine, Folder, NotebookText, Plug, RefreshCw, UsersRound, type LucideIcon } from "lucide-react"
import { EmptyState } from "@/components/hattie/EmptyState"
import { CabecalhoCanvas, Canvas } from "./Layout"

const AREAS: Record<string, { titulo: string; icone: LucideIcon; texto: string }> = {
  projetos: { titulo: "Projetos", icone: Folder, texto: "Um projeto junta peças, datas e objetivo de uma campanha. A Black Friday é uma boa primeira." },
  biblioteca: { titulo: "Biblioteca", icone: NotebookText, texto: "Tudo que você criar ou aprovar fica guardado aqui, pronto para baixar e publicar." },
  marketing: { titulo: "Marketing", icone: ChartLine, texto: "Calendário de posts, campanhas e, na próxima etapa, as métricas das suas redes." },
  parceiros: {
    titulo: "Parceiros",
    icone: UsersRound,
    texto: "Um designer parceiro entra para um ajuste pontual. Você vê o valor e o prazo antes de confirmar.",
  },
  automacoes: { titulo: "Automações", icone: RefreshCw, texto: "Tarefas que se repetem, como o post da semana, rodando sozinhas com a cara da sua marca." },
  conectores: { titulo: "Conectores", icone: Plug, texto: "Instagram, WhatsApp e a sua loja conectados ao Hattie." },
}

export function AreaEmBreve({ area }: { area: keyof typeof AREAS }) {
  const { titulo, icone, texto } = AREAS[area]
  return (
    <Canvas rotulo={titulo}>
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <CabecalhoCanvas titulo={titulo} />
        <EmptyState icone={icone} titulo="chega na próxima etapa" texto={texto} />
      </div>
    </Canvas>
  )
}
