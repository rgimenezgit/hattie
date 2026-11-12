"use client"

import { forwardRef, useId, useImperativeHandle, useRef, useState } from "react"
import { CircleAlert, FileText, Mic, RefreshCw, SlidersHorizontal, SquarePlus, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Plimm } from "./Plimm"

export type ComposerHandle = { preencher: (texto: string) => void; focar: () => void }

type Props = {
  placeholder: string
  rotulo: string
  onEnviar: (texto: string, anexos: string[]) => void
  sugestoes?: string[]
  tamanho?: "grande" | "compacto"
  autoFocus?: boolean
  exigirTexto?: string
  desabilitado?: boolean
  className?: string
}

function BotaoFerramenta({
  rotulo,
  onClick,
  disabled,
  children,
}: {
  rotulo: string
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={rotulo}
          aria-disabled={disabled || undefined}
          onClick={disabled ? undefined : onClick}
          className="clique grid size-8 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:active:scale-100"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{disabled ? `${rotulo} chega em breve` : rotulo}</TooltipContent>
    </Tooltip>
  )
}

export const Composer = forwardRef<ComposerHandle, Props>(function Composer(
  { placeholder, rotulo, onEnviar, sugestoes, tamanho = "grande", autoFocus, exigirTexto, desabilitado, className },
  ref,
) {
  const [texto, setTexto] = useState("")
  const [anexos, setAnexos] = useState<string[]>([])
  const [erro, setErro] = useState("")
  const [arrastando, setArrastando] = useState(false)
  const [usarCerebro, setUsarCerebro] = useState(true)
  const [pesquisar, setPesquisar] = useState(false)
  const campo = useRef<HTMLTextAreaElement>(null)
  const arquivo = useRef<HTMLInputElement>(null)
  const indiceSugestao = useRef(0)
  const id = useId()

  useImperativeHandle(ref, () => ({
    preencher: (novo) => {
      setTexto(novo)
      setErro("")
      requestAnimationFrame(() => campo.current?.focus())
    },
    focar: () => campo.current?.focus(),
  }))

  function adicionar(lista: FileList | null) {
    if (!lista) return
    setAnexos((atual) => [...atual, ...Array.from(lista).map((item) => item.name)])
  }

  function enviar() {
    if (desabilitado) return
    const limpo = texto.trim()
    if (!limpo && anexos.length === 0) {
      if (exigirTexto) {
        setErro(exigirTexto)
        campo.current?.focus()
      }
      return
    }
    onEnviar(limpo, anexos)
    setTexto("")
    setAnexos([])
    setErro("")
  }

  function sugerir() {
    if (!sugestoes?.length) return
    const proxima = sugestoes[indiceSugestao.current % sugestoes.length]
    indiceSugestao.current += 1
    setTexto(proxima)
    setErro("")
    campo.current?.focus()
  }

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault()
        enviar()
      }}
      onDragOver={(evento) => {
        evento.preventDefault()
        setArrastando(true)
      }}
      onDragLeave={(evento) => {
        if (!evento.currentTarget.contains(evento.relatedTarget as Node | null)) setArrastando(false)
      }}
      onDrop={(evento) => {
        evento.preventDefault()
        setArrastando(false)
        adicionar(evento.dataTransfer.files)
      }}
      className={cn(
        "flex w-full flex-col gap-2 rounded-3xl bg-superficie p-3 shadow-(--sombra-campo) transition-[box-shadow] duration-200",
        "focus-within:shadow-(--sombra-flutuante)",
        arrastando && "bg-acao-suave shadow-(--sombra-flutuante)",
        className,
      )}
    >
      <label htmlFor={id} className="sr-only">
        {rotulo}
      </label>
      <textarea
        id={id}
        ref={campo}
        value={texto}
        autoFocus={autoFocus}
        onChange={(evento) => {
          setTexto(evento.target.value)
          setErro("")
        }}
        onKeyDown={(evento) => {
          if (evento.key === "Enter" && !evento.shiftKey && !evento.nativeEvent.isComposing) {
            evento.preventDefault()
            enviar()
          }
        }}
        placeholder={placeholder}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        rows={tamanho === "grande" ? 2 : 1}
        className={cn(
          "field-sizing-content w-full resize-none bg-transparent px-1 text-corpo outline-none placeholder:text-texto-3",
          tamanho === "grande" ? "min-h-16 max-h-56" : "min-h-10 max-h-40",
        )}
      />

      {erro && (
        <p id={`${id}-erro`} role="alert" className="flex items-center gap-1.5 px-1 text-detalhe font-medium text-erro-texto">
          <CircleAlert className="size-4 shrink-0 text-erro" strokeWidth={2} aria-hidden />
          {erro}
        </p>
      )}

      {anexos.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Materiais anexados">
          {anexos.map((nome, indice) => (
            <li key={`${nome}-${indice}`} className="flex h-7 items-center gap-1.5 rounded-md border border-borda-tag ps-2 pe-0.5 text-xs">
              <FileText className="size-3.5 text-texto-2" strokeWidth={2} aria-hidden />
              <span className="max-w-48 truncate">{nome}</span>
              <button
                type="button"
                aria-label={`Remover ${nome}`}
                onClick={() => setAnexos((atual) => atual.filter((_, i) => i !== indice))}
                className="grid size-6 place-items-center rounded-sm text-texto-2 hover:bg-preenchimento-hover hover:text-texto"
              >
                <X className="size-3" strokeWidth={2} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-1">
        <BotaoFerramenta rotulo="Anexar materiais" onClick={() => arquivo.current?.click()}>
          <SquarePlus className="size-[18px]" strokeWidth={1.75} />
        </BotaoFerramenta>
        <input ref={arquivo} type="file" multiple className="sr-only" tabIndex={-1} aria-hidden onChange={(evento) => {
          adicionar(evento.target.files)
          evento.target.value = ""
        }} />

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger
                aria-label="Opções"
                className="clique grid size-8 place-items-center rounded-full text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento-hover"
              >
                <SlidersHorizontal className="size-[18px]" strokeWidth={1.75} />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Opções</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-60 rounded-2xl p-1">
            <DropdownMenuLabel className="text-xs text-texto-2">O Hattie vai</DropdownMenuLabel>
            <DropdownMenuCheckboxItem checked={usarCerebro} onCheckedChange={(valor) => setUsarCerebro(Boolean(valor))} className="h-9 rounded-xl text-sm">
              Usar o cérebro da marca
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={pesquisar} onCheckedChange={(valor) => setPesquisar(Boolean(valor))} className="h-9 rounded-xl text-sm">
              Pesquisar na internet
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ms-auto flex items-center gap-1">
          {sugestoes && (
            <BotaoFerramenta rotulo="Sugerir uma ideia" onClick={sugerir}>
              <RefreshCw className="size-[18px]" strokeWidth={1.75} />
            </BotaoFerramenta>
          )}
          <BotaoFerramenta rotulo="Ditado" disabled>
            <Mic className="size-[18px]" strokeWidth={1.75} />
          </BotaoFerramenta>
          <Plimm type="submit" disabled={desabilitado} className="ms-1" />
        </div>
      </div>
    </form>
  )
})
