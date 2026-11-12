"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Faiscas } from "./Faiscas"
import { IconeHattie } from "./IconeHattie"

/**
 * Plimm: botão lima #E6F344 com texto preto #101010 em Clash Display, ícone e faíscas no clique.
 * Sem ícone, é o botão de criar (✱ que dá meia-volta). Com ícone, é o botão de mandar algo:
 * enviar mensagem, pedido ou prompt.
 */
type Props = {
  rotulo?: string
  /** Ícone no lugar do ✱, para enviar mensagem, pedido ou prompt. */
  icone?: LucideIcon
  /** Id do formulário, quando o botão fica fora dele (rodapé de janela). */
  form?: string
  tamanho?: "md" | "lg"
  somenteIcone?: boolean
  href?: Route
  onClick?: () => void
  carregando?: boolean
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
}

export function Plimm({
  rotulo = "plimm",
  icone: Icone,
  form,
  tamanho = "md",
  somenteIcone = false,
  href,
  onClick,
  carregando = false,
  disabled = false,
  type = "button",
  className,
}: Props) {
  const classes = cn(
    "relative inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-lima whitespace-nowrap text-preto select-none",
    "transition-[translate,box-shadow,background-color,scale] duration-150 ease-(--ease-mola)",
    "hover:-translate-y-0.5 hover:shadow-[0_4px_0_var(--preto)]",
    "active:translate-y-0.5 active:scale-[.97] active:bg-lima-forte active:shadow-none active:duration-75",
    "motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    "aria-disabled:pointer-events-none aria-disabled:bg-cinza aria-disabled:text-grafite",
    somenteIcone ? (tamanho === "lg" ? "size-11" : "size-9 pointer-coarse:size-11") : tamanho === "lg" ? "h-11 px-5" : "h-9 px-3.5 pointer-coarse:h-11",
    className,
  )

  const [giro, setGiro] = useState(0)
  const aoClicar = () => setGiro((atual) => atual + 1)

  const conteudo = (
    <>
      {Icone && !carregando ? (
        <Icone aria-hidden className={tamanho === "lg" ? "size-5" : "size-4"} strokeWidth={2.25} />
      ) : (
        <IconeHattie
          key={`icone-${giro}`}
          nome="asterisco"
          tamanho={tamanho === "lg" ? 20 : 16}
          className={cn(carregando ? "animate-spin [animation-duration:1s] motion-reduce:animate-none" : giro > 0 && "animate-giro-plimm")}
        />
      )}
      {somenteIcone ? (
        <span className="sr-only">{carregando ? "Criando" : rotulo}</span>
      ) : (
        <span className={cn("font-heading leading-none font-semibold lowercase", tamanho === "lg" ? "text-titulo-3" : "text-base")}>{carregando && !Icone ? "plimm…" : rotulo}</span>
      )}
      {giro > 0 && !carregando && <Faiscas key={`faiscas-${giro}`} />}
    </>
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} onClick={aoClicar}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button
      type={type}
      form={form}
      onClick={(evento) => {
        if (disabled || carregando) {
          evento.preventDefault()
          return
        }
        aoClicar()
        onClick?.()
      }}
      aria-disabled={disabled || undefined}
      aria-busy={carregando || undefined}
      className={classes}
    >
      {conteudo}
    </button>
  )
}
