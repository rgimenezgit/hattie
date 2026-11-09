import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StatusSecao } from "@/lib/mock"

type Props = { status: StatusSecao; compacto?: boolean; className?: string }

export function StatusBadge({ status, compacto = false, className }: Props) {
  if (status === "aprovada") {
    return (
      <span
        className={cn(
          "inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-ink/6 text-xs font-medium text-ink-soft",
          compacto ? "w-6 justify-center" : "px-2",
          className,
        )}
      >
        <Check className="size-3" strokeWidth={2.5} aria-hidden />
        <span className={cn(compacto && "sr-only")}>Aprovada</span>
      </span>
    )
  }
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-lima-suave text-xs font-medium text-preto",
        compacto ? "w-6 justify-center" : "px-2",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-lima-forte" />
      <span className={cn(compacto && "sr-only")}>Esperando seu ok</span>
    </span>
  )
}
