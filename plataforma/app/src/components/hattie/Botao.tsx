"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * Botões da plataforma: pílula cheia, Poppins 500, sem contorno.
 * primario: confirmar e seguir (preto #101010). Solta a onda no clique.
 * secundario: ação de apoio (preto #101010 a 5%).
 * fantasma: ícones e ações discretas, fundo só no hover.
 * link: ação em texto, sublinha no hover.
 * O plimm (lima #E6F344) é componente próprio.
 */
export const botaoVariants = cva(
  [
    "clique inline-flex shrink-0 items-center justify-center rounded-full font-sans font-medium whitespace-nowrap select-none",
    "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variante: {
        primario: "onda bg-preto text-branco hover:bg-grafite",
        secundario: "bg-preenchimento text-texto hover:bg-preenchimento-hover active:bg-preenchimento-ativo",
        fantasma: "text-texto-2 hover:bg-preenchimento hover:text-texto active:bg-preenchimento-hover",
        link: "text-texto underline-offset-4 hover:underline",
      },
      tamanho: {
        sm: "h-8 gap-1.5 px-3 text-detalhe [&_svg]:size-3.5",
        md: "h-10 gap-2 px-4 text-sm pointer-coarse:h-11 [&_svg]:size-4",
        lg: "h-12 gap-2 px-5 text-base [&_svg]:size-[18px]",
        "icone-sm": "size-8 [&_svg]:size-3.5",
        icone: "size-9 pointer-coarse:size-11 [&_svg]:size-4",
        "icone-lg": "size-11 [&_svg]:size-5",
      },
    },
    compoundVariants: [{ variante: "link", class: "h-auto rounded-md px-0 pointer-coarse:h-auto active:scale-100" }],
    defaultVariants: { variante: "secundario", tamanho: "md" },
  },
)

type Props = React.ComponentProps<"button"> & VariantProps<typeof botaoVariants> & { asChild?: boolean }

/** Liga a onda do clique: marca o elemento; o atributo sai quando a animação termina. */
export function dispararOnda(elemento: HTMLElement) {
  elemento.removeAttribute("data-onda")
  void elemento.offsetWidth
  elemento.setAttribute("data-onda", "")
}

export function Botao({ className, variante, tamanho, asChild = false, onClick, onAnimationEnd, ...props }: Props) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      className={cn(botaoVariants({ variante, tamanho }), className)}
      onClick={(evento: React.MouseEvent<HTMLButtonElement>) => {
        if (variante === "primario") dispararOnda(evento.currentTarget)
        onClick?.(evento)
      }}
      onAnimationEnd={(evento: React.AnimationEvent<HTMLButtonElement>) => {
        if (evento.animationName === "onda-clique") evento.currentTarget.removeAttribute("data-onda")
        onAnimationEnd?.(evento)
      }}
      {...props}
    />
  )
}
