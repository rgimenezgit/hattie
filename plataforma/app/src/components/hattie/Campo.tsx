"use client"

import { forwardRef, useId, useState, type ComponentProps } from "react"
import { CircleAlert, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = ComponentProps<"input"> & { rotulo: string; erro?: string; dica?: string }

export const Campo = forwardRef<HTMLInputElement, Props>(function Campo({ rotulo, erro, dica, type, className, ...props }, ref) {
  const id = useId()
  const [visivel, setVisivel] = useState(false)
  const ehSenha = type === "password"
  const descricao = [erro ? `${id}-erro` : null, dica ? `${id}-dica` : null].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-detalhe font-medium text-texto-2">
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={ehSenha && visivel ? "text" : type}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao}
          className={cn(
            "h-11 w-full rounded-xl border border-transparent bg-preenchimento px-3.5 text-sm outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-texto-3",
            "hover:bg-preenchimento-hover focus-visible:border-borda-tag focus-visible:bg-superficie focus-visible:shadow-[0_0_0_4px_var(--preenchimento)]",
            "aria-invalid:border-erro aria-invalid:bg-erro-suave aria-invalid:focus-visible:shadow-[0_0_0_4px_var(--erro-suave)]",
            ehSenha && "pe-12",
          )}
          {...props}
        />
        {ehSenha && (
          <button
            type="button"
            onClick={() => setVisivel((atual) => !atual)}
            aria-label="Mostrar senha"
            aria-pressed={visivel}
            className="clique absolute inset-y-0 end-1.5 my-auto grid size-8 place-items-center rounded-lg text-texto-2 hover:bg-preenchimento-hover hover:text-texto"
          >
            {visivel ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
          </button>
        )}
      </div>
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 text-detalhe">
          <CircleAlert className="size-3.5 shrink-0 text-erro" strokeWidth={2.25} aria-hidden />
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="text-detalhe text-texto-3">
            {dica}
          </p>
        )
      )}
    </div>
  )
})
