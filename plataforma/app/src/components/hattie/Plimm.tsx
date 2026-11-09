"use client"

import Link from "next/link"
import type { Route } from "next"
import { cn } from "@/lib/utils"
import { IconeHattie } from "./IconeHattie"

type Props = {
  rotulo?: string
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
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-lima whitespace-nowrap text-preto select-none",
    "transition-[translate,box-shadow,background-color] duration-150 ease-out",
    "hover:-translate-y-0.5 hover:shadow-[0_4px_0_var(--preto)]",
    "active:translate-y-0.5 active:bg-lima-forte active:shadow-none",
    "motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0",
    "aria-disabled:pointer-events-none aria-disabled:bg-cinza aria-disabled:text-grafite",
    somenteIcone ? (tamanho === "lg" ? "size-11" : "size-9 pointer-coarse:size-11") : tamanho === "lg" ? "h-11 px-5" : "h-9 px-3.5 pointer-coarse:h-11",
    className,
  )

  const conteudo = (
    <>
      <IconeHattie
        nome="asterisco"
        tamanho={tamanho === "lg" ? 20 : 16}
        className={cn(carregando && "animate-spin [animation-duration:1s] motion-reduce:animate-none")}
      />
      {somenteIcone ? (
        <span className="sr-only">{carregando ? "Criando" : rotulo}</span>
      ) : (
        <span className={cn("font-heading leading-none font-semibold lowercase", tamanho === "lg" ? "text-[21px]" : "text-base")}>{carregando ? "plimm…" : rotulo}</span>
      )}
    </>
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {conteudo}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={(evento) => {
        if (disabled || carregando) {
          evento.preventDefault()
          return
        }
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
