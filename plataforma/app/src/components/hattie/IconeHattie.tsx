import { cn } from "@/lib/utils"

export const ICONES_HATTIE = [
  "asterisco",
  "bola-de-cristal",
  "brilho",
  "caderno-de-tarefas",
  "calendario",
  "castelo",
  "chapeu",
  "estrela",
  "estrela-vazada",
  "selo",
  "vassoura",
  "cadeado",
  "caldeirao",
  "chave",
  "coracao",
  "lupa",
  "olho",
  "pena",
  "pergaminho",
  "porta",
  "raio",
  "sino",
  "varinha",
  "vela",
  "puff-nuvem",
  "hattie",
] as const

export type NomeIcone = (typeof ICONES_HATTIE)[number]

type Props = {
  nome: NomeIcone
  label?: string
  tamanho?: number
  className?: string
}

export function IconeHattie({ nome, label, tamanho = 20, className }: Props) {
  const url = nome === "hattie" ? "url(/personagem/hattie-avatar.svg)" : `url(/icones/${nome}.svg)`
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: tamanho,
        height: tamanho,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  )
}
