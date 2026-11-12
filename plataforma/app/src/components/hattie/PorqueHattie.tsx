"use client"

import { useRef, useState, type ReactNode } from "react"
import { Info, MessageCircle, X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Botao } from "./Botao"
import { IconeHattie } from "./IconeHattie"

type Props = {
  /** Assunto da proposta, para o rótulo do botão (ex.: "Propósito"). */
  assunto: string
  children: ReactNode
  /** Abre a conversa com o Hattie sobre o assunto. Roda depois que o diálogo fecha. */
  aoPerguntar?: () => void
}

/**
 * O porquê de uma proposta, discreto: ícone de informação de 32 px que abre um diálogo.
 * Diálogo branco #F5F5F5, raio 24, sem contorno; assinatura do Hattie num círculo lima #E6F344,
 * título em Clash, texto de leitura em 15 px e a ação "Perguntar mais".
 */
export function PorqueHattie({ assunto, children, aoPerguntar }: Props) {
  const [aberto, setAberto] = useState(false)
  const depoisDeFechar = useRef<(() => void) | null>(null)

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label={`Por que o Hattie propôs ${assunto}`}>
              <Info />
            </Botao>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Por que eu propus isso</TooltipContent>
      </Tooltip>

      <DialogContent
        showCloseButton={false}
        className="gap-0 rounded-3xl bg-superficie p-0 shadow-(--sombra-flutuante) ring-0 sm:max-w-md"
        onCloseAutoFocus={(evento) => {
          const acao = depoisDeFechar.current
          if (!acao) return
          depoisDeFechar.current = null
          evento.preventDefault()
          acao()
        }}
      >
        <header className="flex items-center gap-3 p-5 pb-3">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-acao">
            <IconeHattie nome="hattie" tamanho={22} className="text-preto" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <DialogTitle className="font-heading text-titulo-3 font-medium lowercase">por que eu propus isso</DialogTitle>
            <p className="text-xs text-texto-3">{assunto}</p>
          </div>
          <DialogClose asChild>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Fechar" className="-me-1 self-start">
              <X />
            </Botao>
          </DialogClose>
        </header>

        <DialogDescription asChild>
          <div className="px-5 pb-5 text-corpo text-texto-2">{children}</div>
        </DialogDescription>

        {aoPerguntar && (
          <footer className="flex justify-end border-t border-borda-sutil px-5 py-3">
            <Botao
              variante="secundario"
              tamanho="sm"
              onClick={() => {
                depoisDeFechar.current = aoPerguntar
                setAberto(false)
              }}
            >
              <MessageCircle /> Perguntar mais
            </Botao>
          </footer>
        )}
      </DialogContent>
    </Dialog>
  )
}
