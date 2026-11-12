"use client"

import { Coins, HandHeart, Heart, Leaf, MessageCircle, Settings2, type LucideIcon } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { cn } from "@/lib/utils"
import type { ClusterDiferencial, Diferencial, Secao, TipoCluster } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"

type Props = { secao: Secao; aoEditar: () => void }

const CLUSTER: Record<TipoCluster, { titulo: string; pergunta: string; icone: LucideIcon }> = {
  funcional: { titulo: "Funcionais", pergunta: "O que o produto faz melhor", icone: Settings2 },
  emocional: { titulo: "Emocionais", pergunta: "Como a pessoa se sente", icone: Heart },
  social: { titulo: "Sociais", pergunta: "O que a compra faz pelas pessoas em volta", icone: HandHeart },
  ambiental: { titulo: "Ambientais", pergunta: "O cuidado com o lugar de onde tudo vem", icone: Leaf },
  economico: { titulo: "Econômicos", pergunta: "O que a pessoa ganha no bolso", icone: Coins },
}

/**
 * Diferenciais por frente: funcionais, emocionais, sociais, ambientais e econômicos.
 * O Hattie só ativa as frentes que fazem sentido para a marca; as que ficam de fora aparecem no fim, com o motivo.
 */
export function SecaoDiferenciais({ secao, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "diferenciais") return null
  const { principal, clusters } = secao.conteudo
  const ativos = clusters.filter((cluster) => cluster.diferenciais.length > 0)
  const fora = clusters.filter((cluster) => cluster.diferenciais.length === 0)
  const todos = ativos.flatMap((cluster) => cluster.diferenciais)
  const fortes = todos.filter((diferencial) => diferencial.forca === "forte").length

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-principal" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-principal" titulo="o que mais diferencia">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{principal}</p>
          <dl className="grid grid-cols-2 gap-y-4 border-t border-borda-sutil pt-4 @3xl:grid-cols-4">
            <Fato rotulo="Frentes ativas" valor={`${ativos.length} de ${clusters.length}`} />
            <Fato rotulo="Diferenciais" valor={String(todos.length)} divisoria />
            <Fato rotulo="Fortes hoje" valor={String(fortes)} divisoria />
            <Fato rotulo="Em construção" valor={String(todos.length - fortes)} divisoria />
          </dl>
        </div>
      </section>

      <section aria-labelledby="titulo-frentes" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-frentes" titulo="por frente" quantidade={ativos.length}>
          <Legenda />
        </CabecalhoBloco>
        <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
          {ativos.map((cluster) => (
            <li key={cluster.id} className="flex min-w-0">
              <CartaoCluster cluster={cluster} />
            </li>
          ))}
        </ul>
      </section>

      {fora.length > 0 && (
        <section aria-labelledby="titulo-fora" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-fora" titulo="ficou de fora" quantidade={fora.length} />
          <ul className="flex flex-col gap-3">
            {fora.map((cluster) => {
              const info = CLUSTER[cluster.id]
              return (
                <li key={cluster.id} className="flex flex-col gap-3 rounded-3xl border border-dashed border-borda-tag p-5 @3xl:flex-row @3xl:items-start @3xl:gap-5">
                  <div className="flex items-center gap-3 @3xl:w-56 @3xl:shrink-0">
                    <IconeCluster icone={info.icone} apagado />
                    <div className="flex flex-col">
                      <h3 className="text-base font-semibold text-texto-2">{info.titulo}</h3>
                      <p className="text-xs text-texto-3">{info.pergunta}</p>
                    </div>
                  </div>
                  <p className="flex-1 text-sm text-texto-2">{cluster.foraPorque}</p>
                  <Botao variante="secundario" tamanho="sm" className="self-start" onClick={aoEditar}>
                    <MessageCircle /> Conversar sobre isso
                  </Botao>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}

function Fato({ rotulo, valor, divisoria = false }: { rotulo: string; valor: string; divisoria?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-0.5 pe-4", divisoria && "@3xl:border-s @3xl:border-borda-sutil @3xl:ps-4")}>
      <dt className="text-xs text-texto-3">{rotulo}</dt>
      <dd className="text-sm font-medium tabular-nums">{valor}</dd>
    </div>
  )
}

function Forca({ forca }: { forca: Diferencial["forca"] }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-texto-2">
      <span aria-hidden className={cn("size-2 rounded-full", forca === "forte" ? "bg-acao-forte" : "border-[1.5px] border-texto-3")} />
      {forca}
    </span>
  )
}

function Legenda() {
  return (
    <div className="hidden items-center gap-3 sm:flex" aria-hidden>
      <Forca forca="forte" />
      <Forca forca="em construção" />
    </div>
  )
}

function IconeCluster({ icone: Icone, apagado = false }: { icone: LucideIcon; apagado?: boolean }) {
  return (
    <span aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-full", apagado ? "bg-preenchimento text-texto-3" : "bg-preenchimento-ativo text-texto")}>
      <Icone className="size-4" strokeWidth={2} />
    </span>
  )
}

function CartaoCluster({ cluster }: { cluster: ClusterDiferencial }) {
  const info = CLUSTER[cluster.id]
  return (
    <article aria-labelledby={`cluster-${cluster.id}`} className="flex w-full min-w-0 flex-col rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex items-center gap-3 pb-4">
        <IconeCluster icone={info.icone} />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 id={`cluster-${cluster.id}`} className="flex items-baseline gap-2 text-base font-semibold">
            {info.titulo}
            <span className="text-xs font-medium text-texto-3 tabular-nums">{cluster.diferenciais.length}</span>
          </h3>
          <p className="text-xs text-texto-2">{info.pergunta}</p>
        </div>
      </header>
      <ul className="flex flex-col">
        {cluster.diferenciais.map((diferencial) => (
          <li key={diferencial.titulo} className="flex flex-col gap-1 border-t border-borda-sutil py-3.5 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold">{diferencial.titulo}</h4>
              <Forca forca={diferencial.forca} />
            </div>
            <p className="text-sm text-texto-2">{diferencial.descricao}</p>
            <p className="text-xs text-texto-3">
              <span className="font-medium">Prova:</span> {diferencial.prova}
            </p>
          </li>
        ))}
      </ul>
    </article>
  )
}
