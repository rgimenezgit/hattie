"use client"

import type { ComponentProps, ReactNode } from "react"
import { X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Botao } from "./Botao"

type Props = {
  aberta: boolean
  aoMudar: (aberta: boolean) => void
  titulo: string
  descricao?: string
  topo?: ReactNode
  rodape?: ReactNode
  largura?: "md" | "lg" | "xl"
  children: ReactNode
  onCloseAutoFocus?: ComponentProps<typeof DialogContent>["onCloseAutoFocus"]
}

/**
 * Diálogo da plataforma: branco #F5F5F5, raio 24, sem contorno, sombra flutuante.
 * Cabeçalho com título em Clash minúsculo e fechar; corpo rola sozinho; rodapé separado por uma linha sutil.
 */
export function Janela({ aberta, aoMudar, titulo, descricao, topo, rodape, largura = "md", children, onCloseAutoFocus }: Props) {
  return (
    <Dialog open={aberta} onOpenChange={aoMudar}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={onCloseAutoFocus}
        className={cn(
          "flex max-h-[min(88svh,760px)] flex-col gap-0 rounded-3xl bg-superficie p-0 shadow-(--sombra-flutuante) ring-0",
          largura === "md" && "sm:max-w-md",
          largura === "lg" && "sm:max-w-xl",
          largura === "xl" && "sm:max-w-3xl",
        )}
      >
        <header className="flex items-start gap-3 p-5 pb-3">
          {topo}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <DialogTitle className="font-heading text-titulo-3 font-medium lowercase">{titulo}</DialogTitle>
            {descricao ? (
              <DialogDescription className="text-detalhe text-texto-2">{descricao}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">{titulo}</DialogDescription>
            )}
          </div>
          <DialogClose asChild>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Fechar" className="-me-1">
              <X />
            </Botao>
          </DialogClose>
        </header>
        <div className="relative min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
        {rodape && <footer className="flex flex-wrap justify-end gap-2 border-t border-borda-sutil px-5 py-3">{rodape}</footer>}
      </DialogContent>
    </Dialog>
  )
}
