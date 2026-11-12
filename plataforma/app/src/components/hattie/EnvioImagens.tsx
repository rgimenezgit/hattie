"use client"

import { useId, useRef, useState } from "react"
import { ImagePlus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImagemEnviada = { id: string; nome: string; url: string }

type Props = {
  imagens: ImagemEnviada[]
  aoMudar: (imagens: ImagemEnviada[]) => void
  rotulo: string
  dica?: string
  limite?: number
  /** Compacto: só as miniaturas e um quadrado de adicionar, sem a área grande de arrastar. */
  compacto?: boolean
  className?: string
}

/**
 * Envio de imagens: área de arrastar ou escolher do computador, miniaturas com botão de remover.
 * Só aceita imagens. As imagens ficam no navegador enquanto o app está aberto.
 */
export function EnvioImagens({ imagens, aoMudar, rotulo, dica, limite = 30, compacto = false, className }: Props) {
  const id = useId()
  const arquivo = useRef<HTMLInputElement>(null)
  const [arrastando, setArrastando] = useState(false)
  const cheio = imagens.length >= limite

  function adicionar(lista: FileList | null) {
    if (!lista) return
    const novas = [...lista]
      .filter((item) => item.type.startsWith("image/"))
      .slice(0, limite - imagens.length)
      .map((item, indice) => ({ id: `${Date.now()}-${indice}-${item.name}`, nome: item.name, url: URL.createObjectURL(item) }))
    if (novas.length) aoMudar([...imagens, ...novas])
  }

  function remover(alvo: ImagemEnviada) {
    URL.revokeObjectURL(alvo.url)
    aoMudar(imagens.filter((imagem) => imagem.id !== alvo.id))
  }

  const entrada = (
    <input
      ref={arquivo}
      id={id}
      type="file"
      accept="image/*"
      multiple
      className="sr-only"
      tabIndex={-1}
      aria-hidden
      onChange={(evento) => {
        adicionar(evento.target.files)
        evento.target.value = ""
      }}
    />
  )

  const miniaturas = imagens.length > 0 && (
    <ul className={cn("grid gap-2", compacto ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-4 sm:grid-cols-5")} aria-label="Imagens adicionadas">
      {imagens.map((imagem) => (
        <li key={imagem.id} className="group/miniatura relative aspect-square overflow-hidden rounded-xl bg-preenchimento">
          {/* eslint-disable-next-line @next/next/no-img-element -- imagem local do navegador (blob), sem otimização */}
          <img src={imagem.url} alt={imagem.nome} className="size-full object-cover" />
          <button
            type="button"
            onClick={() => remover(imagem)}
            aria-label={`Remover ${imagem.nome}`}
            className="clique absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-preto/80 text-branco opacity-100 hover:bg-preto sm:opacity-0 sm:group-hover/miniatura:opacity-100 sm:focus-visible:opacity-100"
          >
            <X className="size-3" strokeWidth={2.5} />
          </button>
        </li>
      ))}
      {compacto && !cheio && (
        <li>
          <button
            type="button"
            onClick={() => arquivo.current?.click()}
            className="clique flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-borda-tag text-xs text-texto-2 hover:bg-preenchimento"
          >
            <ImagePlus className="size-4" strokeWidth={1.75} aria-hidden />
            Adicionar
          </button>
        </li>
      )}
    </ul>
  )

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-detalhe font-medium text-texto-2">{rotulo}</span>
      {entrada}
      {(!compacto || imagens.length === 0) && !cheio && (
        <div
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
            "flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center transition-[background-color] duration-150",
            arrastando ? "bg-acao-suave" : "bg-preenchimento hover:bg-preenchimento-hover",
          )}
        >
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-superficie">
            <ImagePlus className="size-4" strokeWidth={1.75} />
          </span>
          <p className="text-sm">
            Arraste as imagens aqui ou{" "}
            <button type="button" onClick={() => arquivo.current?.click()} className="font-semibold underline underline-offset-4 hover:text-texto-2">
              escolha do computador
            </button>
          </p>
          {dica && <p className="text-xs text-texto-3">{dica}</p>}
        </div>
      )}
      {miniaturas}
      {imagens.length > 0 && (
        <p className="text-xs text-texto-3 tabular-nums" aria-live="polite">
          {imagens.length} de {limite} imagens
        </p>
      )}
    </div>
  )
}
