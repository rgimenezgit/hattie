"use client"

import { Check, Droplet, Leaf, MapPin, Package, Recycle, Sun, X, type LucideIcon } from "lucide-react"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { VerMais } from "@/components/hattie/VerMais"
import { peca, type ElementosGraficos, type Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto } from "./AcoesPonto"
import { Carimbo, GrafismoFolhas, Ilustracao } from "./Ilustracao"
import { NaPeca, type PecaExemplo } from "./NaPeca"
import { useSistemaMarca } from "./SistemaMarca"

type Props = { secao: Secao; aoEditar: () => void }

const ICONE: Record<ElementosGraficos["icones"][number]["desenho"], LucideIcon> = {
  folha: Leaf,
  gota: Droplet,
  lote: Package,
  sol: Sun,
  lugar: MapPin,
  reciclar: Recycle,
}

const PECAS_ELEMENTOS: PecaExemplo[] = [
  { exemplo: peca("el-folhas", "Post com folhas", "grafismo"), proporcao: [4, 5], legenda: "Post com folhas" },
  { exemplo: peca("el-gradiente", "Story no gradiente", "gradiente"), proporcao: [9, 16], legenda: "Story no gradiente" },
  { exemplo: peca("el-carimbo", "Etiqueta com carimbo", "carimbo"), proporcao: [3, 4], legenda: "Etiqueta com carimbo" },
  { exemplo: peca("el-padrao", "Post com padrão", "padrao"), proporcao: [4, 5], legenda: "Post com padrão" },
]

/**
 * Grafismos e elementos gráficos: grafismos, gradiente e ícones numa seção só, com os três aplicados em peças reais.
 * Regras de uso ficam nas opções avançadas.
 */
export function SecaoElementos({ secao, aoEditar }: Props) {
  const sistema = useSistemaMarca()
  if (secao.conteudo.tipo !== "elementos") return null
  const { resumo, grafismos, gradiente, icones, estiloIcones, regras } = secao.conteudo
  const cores = sistema.cores

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-elementos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-elementos" titulo="os elementos da marca">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <MenuPonto ponto="os elementos da marca" />
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{resumo}</p>
          <NaPeca pecas={PECAS_ELEMENTOS} sistema={sistema} className="border-t border-borda-sutil pt-4" />
        </div>
      </section>

      <section aria-labelledby="titulo-grafismos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-grafismos" titulo="grafismos" quantidade={grafismos.length} />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {grafismos.map((grafismo) => (
            <li key={grafismo.id} className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie">
              <div aria-hidden className="grid aspect-[4/3] place-items-center" style={{ backgroundColor: grafismo.desenho === "carimbo" ? cores.apoio : cores.fundo }}>
                {grafismo.desenho === "folhas" ? (
                  <GrafismoFolhas cor={cores.principal} className="size-3/5" />
                ) : grafismo.desenho === "carimbo" ? (
                  <Carimbo cor={cores.escuro} className="size-1/2" />
                ) : (
                  <Ilustracao desenho="padrao" cores={cores} grao={0} className="size-full" />
                )}
              </div>
              <div className="flex flex-col gap-0.5 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">{grafismo.nome}</h3>
                  <MenuPonto ponto={grafismo.nome} className="-me-2 -mt-1.5" />
                </div>
                <p className="text-xs text-texto-2">{grafismo.uso}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid grid-cols-1 gap-10 @4xl:grid-cols-2 @4xl:gap-3">
        <section aria-labelledby="titulo-gradiente" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-gradiente" titulo="gradiente">
            <MenuPonto ponto="o gradiente" />
          </CabecalhoBloco>
          <div className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-superficie">
            <div aria-hidden className="h-32" style={{ background: `linear-gradient(to bottom, ${gradiente.de}, ${gradiente.para})` }} />
            <div className="flex flex-col gap-1 p-4">
              <h3 className="text-sm font-semibold">{gradiente.nome}</h3>
              <p className="text-xs text-texto-2 uppercase">
                {gradiente.de} → {gradiente.para}
              </p>
              <p className="text-xs text-texto-2">{gradiente.uso}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="titulo-icones" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-icones" titulo="ícones" quantidade={icones.length}>
            <MenuPonto ponto="os ícones" />
          </CabecalhoBloco>
          <div className="flex flex-1 flex-col gap-4 rounded-3xl bg-superficie p-5">
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6 @4xl:grid-cols-3">
              {icones.map((icone) => {
                const Icone = ICONE[icone.desenho]
                return (
                  <li key={icone.id} className="flex flex-col items-center gap-1.5">
                    <span className="grid size-12 place-items-center rounded-2xl" style={{ backgroundColor: cores.fundo, color: cores.principal }}>
                      <Icone className="size-6" strokeWidth={1.5} aria-hidden />
                    </span>
                    <span className="text-xs text-texto-2">{icone.nome}</span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-auto text-xs text-texto-2">{estiloIcones}</p>
          </div>
        </section>
      </div>

      <VerMais resumo="Como usar e o que evitar com grafismos, gradiente e ícones">
        <section aria-labelledby="titulo-regras-elementos" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-regras-elementos" titulo="faça e evite" />
          <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-2 @3xl:gap-0">
            {(
              [
                ["Faça", regras.faca, Check, "text-sucesso"],
                ["Evite", regras.evite, X, "text-erro"],
              ] as const
            ).map(([titulo, itens, Icone, cor], indice) => (
              <div key={titulo} className={indice === 1 ? "flex flex-col gap-2 border-t border-borda-sutil pt-5 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0" : "flex flex-col gap-2 @3xl:pe-6"}>
                <h3 className="text-xs font-semibold text-texto-2">{titulo}</h3>
                <ul className="flex flex-col gap-1.5">
                  {itens.map((item) => (
                    <li key={item} className="flex gap-2 text-sm">
                      <Icone className={`mt-0.5 size-4 shrink-0 ${cor}`} strokeWidth={2.25} aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </VerMais>
    </div>
  )
}
