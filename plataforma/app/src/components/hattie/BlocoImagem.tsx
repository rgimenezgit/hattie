import { fillStyle } from "@/lib/dither/style"
import { cn } from "@/lib/utils"

type Props = {
  legenda?: string
  cor?: string
  fundo?: string
  borda?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function BlocoImagem({ legenda, cor = "var(--cinza-medio)", fundo, borda = "bottom", className }: Props) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-neutro-hover outline outline-1 -outline-offset-1 outline-black/10", className)}
      style={fundo ? { backgroundColor: fundo } : undefined}
    >
      <div aria-hidden className="absolute inset-0" style={fillStyle("gradient", { color: cor, edge: borda, length: 28 })} />
      {legenda && (
        <span className="absolute bottom-2 left-2 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
          {legenda}
        </span>
      )}
    </div>
  )
}
