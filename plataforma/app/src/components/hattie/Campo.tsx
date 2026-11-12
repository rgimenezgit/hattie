"use client"

import { forwardRef, useId, useState, type ComponentProps } from "react"
import { ChevronDown, CircleAlert, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = ComponentProps<"input"> & { rotulo: string; erro?: string; dica?: string }

const CAMPO = [
  "w-full rounded-xl border border-transparent bg-preenchimento px-3.5 text-sm outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-texto-3",
  "hover:bg-preenchimento-hover focus-visible:border-borda-tag focus-visible:bg-superficie focus-visible:shadow-[0_0_0_4px_var(--preenchimento)]",
  "aria-invalid:border-erro aria-invalid:bg-erro-suave aria-invalid:focus-visible:shadow-[0_0_0_4px_var(--erro-suave)]",
]

function Moldura({ id, rotulo, erro, dica, className, children }: { id: string; rotulo: string; erro?: string; dica?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-detalhe font-medium text-texto-2">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 text-detalhe font-medium text-erro-texto">
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
}

const descreve = (id: string, erro?: string, dica?: string) =>
  [erro ? `${id}-erro` : null, dica ? `${id}-dica` : null].filter(Boolean).join(" ") || undefined

/** Texto longo, mesmo visual do Campo, cresce com o conteúdo. */
export function CampoArea({ rotulo, erro, dica, className, ...props }: ComponentProps<"textarea"> & { rotulo: string; erro?: string; dica?: string }) {
  const id = useId()
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica} className={className}>
      <textarea
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descreve(id, erro, dica)}
        rows={3}
        className={cn(CAMPO, "field-sizing-content min-h-22 max-h-48 resize-none py-2.5 leading-relaxed")}
        {...props}
      />
    </Moldura>
  )
}

/** Lista de opções nativa, mesmo visual do Campo. */
export function CampoLista({
  rotulo,
  erro,
  dica,
  opcoes,
  className,
  ...props
}: ComponentProps<"select"> & { rotulo: string; erro?: string; dica?: string; opcoes: { valor: string; rotulo: string }[] }) {
  const id = useId()
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descreve(id, erro, dica)}
          className={cn(CAMPO, "h-11 appearance-none pe-10")}
          {...props}
        >
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 end-3.5 my-auto size-4 text-texto-2" strokeWidth={2} aria-hidden />
      </div>
    </Moldura>
  )
}

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
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 text-detalhe font-medium text-erro-texto">
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
