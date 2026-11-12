import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatusSecao } from "@/lib/mock"
import { Tag } from "./Tag"

type Props = { status: StatusSecao; compacto?: boolean; className?: string }

export function StatusBadge({ status, compacto = false, className }: Props) {
  if (status === "aprovada") {
    return (
      <Tag tom="sucesso" className={cn(compacto && "w-6 justify-center px-0", className)}>
        <Check strokeWidth={2.5} aria-hidden />
        <span className={cn(compacto && "sr-only")}>Aprovada</span>
      </Tag>
    )
  }
  return (
    <Tag tom="acao" ponto className={cn(compacto && "w-6 justify-center px-0", className)}>
      <span className={cn(compacto && "sr-only")}>Esperando seu ok</span>
    </Tag>
  )
}
