import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Tag: rótulo que descreve, nunca age. Canto de 6 px, Poppins 400 em 12 px e contorno de 1 px
 * em preto #101010 a 16%. O botão é pílula cheia em Poppins 500; a tag nunca tem preenchimento forte.
 * neutra: palavras, categorias, anexos.
 * acao: espera o ok da pessoa (lima-suave #F1F4C9, ponto lima-forte #77A00F).
 * feita: concluída (texto em grafite #333333 com check).
 */
const tagVariants = cva("inline-flex shrink-0 items-center gap-1.5 rounded-md border font-normal whitespace-nowrap [&_svg]:shrink-0", {
  variants: {
    tom: {
      neutra: "border-borda-tag text-texto-2",
      acao: "border-transparent bg-acao-suave text-texto",
      feita: "border-borda-sutil text-texto-2",
    },
    tamanho: {
      sm: "h-5 px-1.5 text-micro [&_svg]:size-2.5",
      md: "h-6 px-2 text-xs [&_svg]:size-3",
      lg: "h-8 px-2.5 text-sm [&_svg]:size-3.5",
    },
  },
  defaultVariants: { tom: "neutra", tamanho: "md" },
})

type Props = ComponentProps<"span"> & VariantProps<typeof tagVariants> & { ponto?: boolean }

export function Tag({ tom, tamanho, ponto = false, className, children, ...props }: Props) {
  return (
    <span className={cn(tagVariants({ tom, tamanho }), className)} {...props}>
      {ponto && <span aria-hidden className={cn("size-1.5 rounded-full", tom === "acao" ? "bg-acao-forte" : "bg-texto-3")} />}
      {children}
    </span>
  )
}
