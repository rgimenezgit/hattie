import type { ReactNode } from "react"
import { Badge, ChartLine, Folder, House, NotebookText, Plug, RefreshCw, UsersRound } from "lucide-react"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { cn } from "@/lib/utils"

export function IconeMarca({ className }: { className?: string }) {
  return (
    <span className={cn("relative grid size-5 place-items-center", className)} aria-hidden>
      <Badge className="size-5" strokeWidth={1.75} />
      <span className="absolute text-[9px] leading-none font-bold">A</span>
    </span>
  )
}

export type ItemNavegacao = { segmento: string | null; rotulo: string; icone: (props: { className?: string }) => ReactNode }

const lucide = (Icone: typeof House) =>
  function IconeLucide({ className }: { className?: string }) {
    return <Icone className={cn("size-5", className)} strokeWidth={1.75} aria-hidden />
  }

export const NAVEGACAO: ItemNavegacao[] = [
  { segmento: null, rotulo: "Início", icone: lucide(House) },
  { segmento: "cerebro", rotulo: "Marca", icone: IconeMarca },
  { segmento: "projetos", rotulo: "Projetos", icone: lucide(Folder) },
  { segmento: "biblioteca", rotulo: "Biblioteca", icone: lucide(NotebookText) },
  { segmento: "marketing", rotulo: "Marketing", icone: lucide(ChartLine) },
  { segmento: "hattie", rotulo: "Hattie", icone: ({ className }) => <IconeHattie nome="hattie" tamanho={20} className={className} /> },
  { segmento: "parceiros", rotulo: "Parceiros", icone: lucide(UsersRound) },
  { segmento: "automacoes", rotulo: "Automações", icone: lucide(RefreshCw) },
  { segmento: "conectores", rotulo: "Conectores", icone: lucide(Plug) },
]
