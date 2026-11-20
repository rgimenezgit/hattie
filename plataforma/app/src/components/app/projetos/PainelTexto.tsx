"use client"

import { AlignCenter, AlignLeft, AlignRight, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ItemProjeto, PapelFonte } from "@/lib/mock"
import type { SistemaMarca } from "../SistemaMarca"
import { estiloDoTexto, idDoEstilo } from "./ItemPrevia"

/*
 * Painel de texto: aparece à direita do canvas quando um texto está selecionado ou em edição.
 * De cima para baixo: os estilos da tipografia da marca (o caminho curto), depois fonte, tamanho, peso,
 * alinhamento e cor, para quem quer mexer no detalhe. Escolher um estilo limpa os ajustes feitos à mão.
 */

const PESOS = [
  { valor: 400, rotulo: "Regular" },
  { valor: 500, rotulo: "Médio" },
  { valor: 700, rotulo: "Negrito" },
]

const ALINHAMENTOS = [
  { valor: "left", rotulo: "À esquerda", icone: AlignLeft },
  { valor: "center", rotulo: "Ao centro", icone: AlignCenter },
  { valor: "right", rotulo: "À direita", icone: AlignRight },
] as const

const TITULO = "text-xs font-medium text-texto-3"
const OPCAO = "h-8 rounded-full px-3 text-detalhe font-medium transition-[background-color,color] duration-150"
const ligada = (ativa: boolean) => (ativa ? "bg-preto text-lima" : "bg-preenchimento text-texto-2 hover:bg-preenchimento-hover hover:text-texto")

type Props = {
  item: ItemProjeto
  sistema: SistemaMarca
  aoMudar: (mudanca: Partial<ItemProjeto>) => void
  className?: string
}

export function PainelTexto({ item, sistema, aoMudar, className }: Props) {
  const estilos = sistema.estilosTipo.filter((estilo) => estilo.papel !== "sistema")
  const atual = idDoEstilo(item)
  const letra = estiloDoTexto(item, sistema)
  const tamanho = Number(letra.fontSize)
  const peso = Number(letra.fontWeight)
  const fonte: PapelFonte = item.fonte ?? sistema.estilosTipo.find((estilo) => estilo.id === atual)?.papel ?? (atual === "corpo" ? "texto" : "display")
  const mexido = item.fonte !== undefined || item.tamanho !== undefined || item.peso !== undefined
  const cores = [...new Set([sistema.cores.escuro, sistema.cores.principal, sistema.cores.apoio, "#101010", "#6B6B6B", "#F5F5F5"])]
  const fontes: { papel: PapelFonte; familia: string; uso: string }[] = [
    { papel: "display", familia: sistema.combinacao.display.familia, uso: "títulos" },
    { papel: "texto", familia: sistema.combinacao.texto.familia, uso: "textos" },
  ]

  return (
    <aside
      data-fora-do-canvas
      aria-label="Opções do texto"
      // Clicar numa opção não tira o cursor do texto em edição.
      onMouseDown={(evento) => (evento.target as Element).closest("button") && evento.preventDefault()}
      className={cn("flex max-h-[calc(100%-7.5rem)] w-60 flex-col gap-4 overflow-y-auto rounded-3xl bg-superficie p-4 shadow-(--sombra-flutuante) motion-safe:animate-[aparecer_160ms_var(--ease-saida)]", className)}
    >
      <h2 className="font-heading text-base font-medium lowercase">texto</h2>

      {estilos.length > 0 && (
        <section aria-label="Estilos da marca" className="flex flex-col gap-1.5">
          <h3 className={TITULO}>Estilos da {sistema.nome}</h3>
          <ul className="-mx-1.5 flex flex-col">
            {estilos.map((estilo) => {
              const ativo = estilo.id === atual
              return (
                <li key={estilo.id}>
                  <button
                    type="button"
                    aria-pressed={ativo}
                    onClick={() => aoMudar({ estiloTexto: estilo.id, fonte: undefined, tamanho: undefined, peso: undefined })}
                    className={cn("flex h-9 w-full items-center gap-2 rounded-full px-3 text-start", ativo ? "bg-lima-suave" : "hover:bg-preenchimento")}
                  >
                    <span
                      className="min-w-0 flex-1 truncate leading-none"
                      style={{
                        fontFamily: sistema.fonte[estilo.papel],
                        fontWeight: estilo.peso,
                        fontSize: Math.min(18, Math.max(12, estilo.tela.tamanho * 0.42)),
                        textTransform: estilo.caixa === "alta" ? "uppercase" : undefined,
                        letterSpacing: estilo.caixa === "alta" ? "0.06em" : undefined,
                      }}
                    >
                      {estilo.nome}
                    </span>
                    <span className="text-xs text-texto-3 tabular-nums">{estilo.tela.tamanho}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          {mexido && <p className="text-xs text-texto-3">Você mudou o estilo à mão. Escolher um estilo volta ao padrão dele.</p>}
        </section>
      )}

      <section aria-label="Fonte" className="flex flex-col gap-1.5">
        <h3 className={TITULO}>Fonte</h3>
        <div role="radiogroup" aria-label="Fonte" className="flex flex-col gap-1">
          {fontes.map((opcao) => (
            <button
              key={opcao.papel}
              type="button"
              role="radio"
              aria-checked={fonte === opcao.papel}
              onClick={() => aoMudar({ fonte: opcao.papel })}
              className={cn("flex h-9 items-center justify-between gap-2 rounded-full px-3 text-start text-sm transition-[background-color,color] duration-150", ligada(fonte === opcao.papel))}
            >
              <span className="truncate" style={{ fontFamily: sistema.fonte[opcao.papel] }}>
                {opcao.familia}
              </span>
              <span className={cn("text-xs", fonte === opcao.papel ? "text-lima/70" : "text-texto-3")}>{opcao.uso}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Tamanho" className="flex flex-col gap-1.5">
        <h3 className={TITULO}>Tamanho</h3>
        <div className="flex items-center gap-1 rounded-full bg-preenchimento p-1">
          <button type="button" aria-label="Diminuir o texto" onClick={() => aoMudar({ tamanho: Math.max(8, tamanho - (tamanho > 32 ? 4 : 1)) })} className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-preenchimento-hover">
            <Minus className="size-3.5" strokeWidth={2.25} />
          </button>
          <input
            type="number"
            aria-label="Tamanho do texto em pixels"
            min={8}
            max={200}
            value={Math.round(tamanho)}
            onChange={(evento) => {
              const valor = Number(evento.target.value)
              if (valor >= 8 && valor <= 200) aoMudar({ tamanho: valor })
            }}
            onKeyDown={(evento) => evento.stopPropagation()}
            className="h-7 min-w-0 flex-1 bg-transparent text-center text-sm font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" aria-label="Aumentar o texto" onClick={() => aoMudar({ tamanho: Math.min(200, tamanho + (tamanho >= 32 ? 4 : 1)) })} className="grid size-7 shrink-0 place-items-center rounded-full hover:bg-preenchimento-hover">
            <Plus className="size-3.5" strokeWidth={2.25} />
          </button>
        </div>
      </section>

      <section aria-label="Peso" className="flex flex-col gap-1.5">
        <h3 className={TITULO}>Peso</h3>
        <div role="radiogroup" aria-label="Peso" className="grid grid-cols-3 gap-1">
          {PESOS.map((opcao) => {
            const ativo = Math.abs(peso - opcao.valor) < 100 && (opcao.valor !== 500 || peso === 500 || peso === 600)
            return (
              <button key={opcao.valor} type="button" role="radio" aria-checked={ativo} onClick={() => aoMudar({ peso: opcao.valor })} className={cn(OPCAO, "px-0", ligada(ativo))}>
                {opcao.rotulo}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-label="Alinhamento" className="flex flex-col gap-1.5">
        <h3 className={TITULO}>Alinhamento</h3>
        <div role="radiogroup" aria-label="Alinhamento" className="grid grid-cols-3 gap-1">
          {ALINHAMENTOS.map((opcao) => {
            const ativo = (item.alinhamento ?? "left") === opcao.valor
            return (
              <button key={opcao.valor} type="button" role="radio" aria-checked={ativo} aria-label={opcao.rotulo} onClick={() => aoMudar({ alinhamento: opcao.valor })} className={cn(OPCAO, "grid place-items-center px-0", ligada(ativo))}>
                <opcao.icone className="size-4" strokeWidth={2} aria-hidden />
              </button>
            )
          })}
        </div>
      </section>

      <section aria-label="Cor" className="flex flex-col gap-2">
        <h3 className={TITULO}>Cor</h3>
        <div role="radiogroup" aria-label="Cor do texto" className="flex flex-wrap gap-2">
          {cores.map((cor) => {
            const ativa = (item.corTexto ?? "").toLowerCase() === cor.toLowerCase()
            return (
              <button
                key={cor}
                type="button"
                role="radio"
                aria-checked={ativa}
                aria-label={`Cor ${cor}`}
                title={cor}
                onClick={() => aoMudar({ corTexto: cor })}
                className={cn("size-6 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)] transition-[scale] duration-150 hover:scale-110", ativa && "outline-2 outline-offset-2 outline-preto outline-solid")}
                style={{ backgroundColor: cor }}
              />
            )
          })}
        </div>
      </section>
    </aside>
  )
}
