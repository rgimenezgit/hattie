"use client"

import { Check, CircleAlert, TriangleAlert, X } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { FORMA_DO_SOM, type Som } from "./SeloSom"
import { IconeHattie } from "./IconeHattie"

type Opcoes = {
  titulo: string
  texto?: string
  som?: Som
  tipo?: "padrao" | "sucesso" | "atencao" | "erro"
  /** Ação curta dentro do aviso, como "Desfazer". */
  acao?: { rotulo: string; aoClicar: () => void }
}

/**
 * Alerta. Cartão preto #101010 com sombra, sem contorno.
 * À esquerda, um círculo de 32 px: forma do selo em lima #E6F344, check em verde #1F9D55,
 * atenção em amarelo #F2B705 e erro em vermelho #E0352B.
 * No meio, o nome do selo em Clash 600 lima (quando há som), título em Poppins 600 e texto em 13 px.
 * Erro não leva selo nem piada.
 */
export function CartaoAlerta({ titulo, texto, som, tipo = "padrao", acao, aoFechar }: Opcoes & { aoFechar?: () => void }) {
  const comSelo = som && tipo !== "erro" && tipo !== "atencao"
  return (
    <div
      role={tipo === "erro" ? "alert" : "status"}
      className="flex w-[min(92vw,400px)] items-start gap-3 rounded-2xl bg-preto p-3 pe-2 text-branco shadow-(--sombra-flutuante)"
    >
      <span
        aria-hidden
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          tipo === "erro" ? "bg-erro text-branco" : tipo === "atencao" ? "bg-atencao text-preto" : tipo === "sucesso" ? "bg-sucesso text-branco" : "bg-lima text-preto",
        )}
      >
        {tipo === "erro" ? (
          <CircleAlert className="size-4" strokeWidth={2.25} />
        ) : tipo === "atencao" ? (
          <TriangleAlert className="size-4" strokeWidth={2.25} />
        ) : comSelo ? (
          <IconeHattie nome={FORMA_DO_SOM[som]} tamanho={16} />
        ) : (
          <Check className="size-4" strokeWidth={2.5} />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
        {comSelo && <span className="font-heading text-xs leading-none font-semibold text-lima lowercase">{som}</span>}
        <p className="text-sm font-semibold first-letter:uppercase">{titulo}</p>
        {texto && <p className="text-detalhe text-cinza">{texto}</p>}
        {acao && (
          <button
            type="button"
            onClick={() => {
              acao.aoClicar()
              aoFechar?.()
            }}
            className="mt-1 self-start text-sm font-semibold text-lima underline-offset-4 hover:underline"
          >
            {acao.rotulo}
          </button>
        )}
      </div>
      {aoFechar && (
        <button
          type="button"
          aria-label="Fechar aviso"
          onClick={aoFechar}
          className="clique grid size-7 shrink-0 place-items-center rounded-full text-cinza hover:bg-branco/10 hover:text-branco"
        >
          <X className="size-3.5" strokeWidth={2.25} />
        </button>
      )}
    </div>
  )
}

export function notificar(opcoes: Opcoes) {
  toast.custom((id) => <CartaoAlerta {...opcoes} aoFechar={() => toast.dismiss(id)} />)
}
