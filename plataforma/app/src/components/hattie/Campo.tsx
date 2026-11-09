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
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium">
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
            "h-11 w-full rounded-xl border border-cinza-medio bg-transparent px-4 text-base outline-none transition-[border-color] duration-150 placeholder:text-cinza-medio hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-invalid:border-2 aria-invalid:border-ink",
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
            className="absolute inset-y-0 end-1 my-auto grid size-9 place-items-center rounded-full text-ink-soft hover:bg-ink/6 hover:text-ink"
          >
            {visivel ? <EyeOff className="size-4.5" strokeWidth={2} /> : <Eye className="size-4.5" strokeWidth={2} />}
          </button>
        )}
      </div>
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 text-sm font-medium">
          <CircleAlert className="size-4 shrink-0" strokeWidth={2} aria-hidden />
          {erro}
        </p>
      ) : (
        dica && (
          <p id={`${id}-dica`} className="text-sm text-ink-soft">
            {dica}
          </p>
        )
      )}
    </div>
  )
})
