"use client"

import type { ComponentProps } from "react"
import type { LucideIcon } from "lucide-react"
import { Tabs as TabsPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

export type ItemAba = { valor: string; rotulo: string; icone?: LucideIcon; quantidade?: number }

/** Raiz das abas. Guarda qual aba está aberta; o resto vem de ListaAbas e ConteudoAba. */
export function Abas({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col gap-3", className)} {...props} />
}

type PropsLista = {
  itens: ItemAba[]
  /** Nome do grupo para leitores de tela. */
  rotulo: string
  /** Sobre o palco cinza, a trilha é branca; sobre um card branco, a trilha é cinza. */
  fundo?: "palco" | "cartao"
  /** Centraliza a trilha quando ela cabe na largura. */
  centro?: boolean
  className?: string
}

/**
 * Abas da plataforma: trilha em pílula com 4 px de respiro e abas de 32 px.
 * Aba em repouso: Poppins 500 em grafite #333333, ícone de 16 px, quantidade em cinza-médio.
 * Hover: preenchimento neutro. Ativa: pílula lima #E6F344 com texto preto #101010, sem sombra.
 * Quando não cabe, a trilha rola na horizontal sem barra visível, e a aba ativa entra na tela ao receber foco.
 */
export function ListaAbas({ itens, rotulo, fundo = "palco", centro = false, className }: PropsLista) {
  return (
    <div className={cn("no-scrollbar -mx-4 flex overflow-x-auto px-4 md:mx-0 md:px-0", centro && "md:justify-center", className)}>
      <TabsPrimitive.List
        aria-label={rotulo}
        className={cn("inline-flex shrink-0 items-center gap-0.5 rounded-full p-1", fundo === "palco" ? "bg-superficie" : "bg-preenchimento")}
      >
        {itens.map((item) => (
          <TabsPrimitive.Trigger
            key={item.valor}
            value={item.valor}
            onFocus={(evento) => evento.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
            className={cn(
              "group/aba inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium whitespace-nowrap text-texto-2 outline-none select-none",
              "transition-[background-color,color] duration-150",
              "hover:bg-preenchimento hover:text-texto",
              "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-texto",
              "data-[state=active]:bg-acao data-[state=active]:text-preto data-[state=active]:hover:bg-acao",
              "disabled:pointer-events-none disabled:opacity-40",
            )}
          >
            {item.icone && <item.icone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />}
            {item.rotulo}
            {item.quantidade !== undefined && (
              <span className="text-xs text-texto-3 tabular-nums group-data-[state=active]/aba:text-preto/60">{item.quantidade}</span>
            )}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </div>
  )
}

/** Conteúdo de uma aba. Sem contorno de foco próprio: o foco vai para o que está dentro. */
export function ConteudoAba({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />
}
