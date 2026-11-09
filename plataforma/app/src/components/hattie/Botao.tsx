import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const botaoVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-sans font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,scale] duration-150 ease-out active:scale-[.96] motion-reduce:active:scale-100",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variante: {
        primario: "bg-preto text-branco hover:bg-grafite",
        secundario: "border-[1.5px] border-ink text-ink hover:bg-ink/6",
        terciario: "text-ink underline-offset-4 hover:underline",
        fantasma: "text-ink-soft hover:bg-ink/6 hover:text-ink",
      },
      tamanho: {
        md: "h-10 px-4 text-sm pointer-coarse:h-11 [&_svg]:size-4",
        sm: "h-8 px-3 text-sm [&_svg]:size-3.5",
        icone: "size-9 pointer-coarse:size-11 [&_svg]:size-4",
        "icone-sm": "size-8 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variante: "secundario", tamanho: "md" },
  },
)

type Props = React.ComponentProps<"button"> & VariantProps<typeof botaoVariants> & { asChild?: boolean }

export function Botao({ className, variante, tamanho, asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot.Root : "button"
  return <Comp className={cn(botaoVariants({ variante, tamanho }), className)} {...props} />
}
