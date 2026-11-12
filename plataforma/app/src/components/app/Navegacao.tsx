import type { ReactNode } from "react"
import { Badge, ChartLine, Folder, House, NotebookText, Plug, RefreshCw, UsersRound, type LucideIcon } from "lucide-react"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { cn } from "@/lib/utils"

type PropsIcone = { className?: string; ativo?: boolean }

/** Selo "Marca" do Figma. Ativo: selo cheio em preto #101010 com o "A" vazado em lima #E6F344. */
export function IconeMarca({ className, ativo = false }: PropsIcone) {
  return (
    <span className={cn("relative grid size-5 place-items-center", className)} aria-hidden>
      <Badge className="size-5" strokeWidth={ativo ? 2 : 1.75} fill={ativo ? "currentColor" : "none"} />
      <span className={cn("absolute text-[9px] leading-none font-bold", ativo && "text-lima")}>A</span>
    </span>
  )
}

export type ItemNavegacao = { segmento: string | null; rotulo: string; icone: (props: PropsIcone) => ReactNode }

/**
 * Ícone Lucide do rail. Ativo: versão cheia (preenchida) e traço 2.
 * Ícones de linha aberta (gráfico, setas) não preenchem bem; ativos, ganham traço 2,5.
 */
const lucide = (Icone: LucideIcon, preenche = true) =>
  function IconeLucide({ className, ativo = false }: PropsIcone) {
    return (
      <Icone
        className={cn("size-5", className)}
        strokeWidth={ativo ? (preenche ? 2 : 2.5) : 1.75}
        fill={ativo && preenche ? "currentColor" : "none"}
        aria-hidden
      />
    )
  }

export const NAVEGACAO: ItemNavegacao[] = [
  { segmento: null, rotulo: "Início", icone: lucide(House) },
  { segmento: "hattie", rotulo: "Hattie", icone: ({ className }) => <IconeHattie nome="hattie" tamanho={20} className={className} /> },
  { segmento: "cerebro", rotulo: "Marca", icone: IconeMarca },
  { segmento: "projetos", rotulo: "Projetos", icone: lucide(Folder) },
  { segmento: "biblioteca", rotulo: "Biblioteca", icone: lucide(NotebookText) },
  { segmento: "marketing", rotulo: "Marketing", icone: lucide(ChartLine, false) },
  { segmento: "parceiros", rotulo: "Parceiros", icone: lucide(UsersRound) },
  { segmento: "automacoes", rotulo: "Automações", icone: lucide(RefreshCw, false) },
  { segmento: "conectores", rotulo: "Conectores", icone: lucide(Plug) },
]
