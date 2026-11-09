"use client"

import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { SeloSom, type Som } from "./SeloSom"

type Opcoes = {
  titulo: string
  texto?: string
  som?: Som
  tipo?: "padrao" | "sucesso" | "erro"
}

export function notificar({ titulo, texto, som, tipo = "padrao" }: Opcoes) {
  toast.custom(() => (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className={cn(
        "flex w-[min(92vw,420px)] items-start gap-3.5 rounded-md border-2 border-ink p-4",
        tipo === "padrao" && "bg-hattie text-ink",
        tipo === "sucesso" && "bg-lima text-preto",
        tipo === "erro" && "border-preto bg-preto text-branco",
      )}
    >
      {som && tipo !== "erro" && <SeloSom som={som} fixo className="shrink-0 px-3 py-1.5 [&>span:last-child]:text-base" />}
      <div className="flex flex-col gap-1">
        <p className="font-heading text-[21px] leading-tight font-medium lowercase">{titulo}</p>
        {texto && <p className="text-base">{texto}</p>}
      </div>
    </div>
  ))
}
