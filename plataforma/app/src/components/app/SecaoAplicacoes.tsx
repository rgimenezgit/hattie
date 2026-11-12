"use client"

import { useState } from "react"
import Link from "next/link"
import type { Route } from "next"
import { ChevronRight, Grid3x3 } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { ExemploPeca, FormatoPeca, RecursoPeca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { useMarca } from "./MarcaContexto"
import { Mockup, Peca } from "./PecasMarca"
import { useSistemaMarca, type SistemaMarca } from "./SistemaMarca"

type Props = { secao: Secao; aoEditar: () => void }

const COLUNAS: Record<number, string> = { 2: "@4xl:grid-cols-2", 3: "@4xl:grid-cols-3", 4: "@4xl:grid-cols-4" }

function nomeDoRecurso(recurso: RecursoPeca, sistema: SistemaMarca) {
  const nomes: Record<RecursoPeca, string> = {
    logo: "Logo",
    cores: "Cores",
    tipografia: sistema.combinacao.display.familia,
    fotografia: sistema.estiloFoto ? `Foto · ${sistema.estiloFoto.nome}` : "Fotografia",
    ilustracao: sistema.estiloIlustracao ? `Ilustração · ${sistema.estiloIlustracao.nome}` : "Ilustração",
    grafismos: "Grafismos",
    gradiente: "Gradiente",
  }
  return nomes[recurso]
}

/**
 * Aplicações da marca: de onde vêm as peças (as diretrizes do cérebro), mockups, regras de diagramação,
 * peças de comunicação por formato (com grid e zona segura) e explorações gráficas.
 * Tudo é montado com o logo, a paleta, a combinação tipográfica, os grafismos e os estilos de foto e ilustração.
 */
export function SecaoAplicacoes({ secao, aoEditar }: Props) {
  const sistema = useSistemaMarca()
  const marca = useMarca()
  const [grade, setGrade] = useState(false)
  if (secao.conteudo.tipo !== "aplicacoes") return null
  const guia = secao.conteudo
  const quadrado = guia.formatos.find((formato) => formato.id === "post-quadrado")
  const banner = guia.formatos.find((formato) => formato.id === "banner")?.exemplos.find((exemplo) => exemplo.layout === "dividido") ?? guia.exploracoes[0]
  const grade3x3 = [...(quadrado?.exemplos ?? []), ...guia.exploracoes].slice(0, 9)

  return (
    <div className="flex flex-col gap-10">
      <section aria-label="De onde vêm as peças" className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
        <div className="-mt-1 -me-2 flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-texto-3">{secao.titulo}</p>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </div>
        <p className="max-w-[62ch] text-destaque font-light">Cada peça junta o que já está no cérebro da marca. Quando uma diretriz muda, as peças mudam junto.</p>
        <ul className="grid grid-cols-1 gap-x-4 border-t border-borda-sutil pt-2 sm:grid-cols-2 @4xl:grid-cols-3" aria-label="Diretrizes usadas nas peças">
          {sistema.fontes.map((fonte) => {
            const pronta = fonte.status === "aprovada" || fonte.definida
            return (
              <li key={fonte.id} className="min-w-0">
                <Link
                  href={`/marca/${marca.slug}/cerebro/${fonte.id}` as Route}
                  className="clique group/fonte -mx-2 flex items-center gap-2 rounded-xl px-2 py-2.5 hover:bg-preenchimento"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold">{fonte.titulo}</span>
                    <span className="truncate text-xs text-texto-2">{fonte.detalhe}</span>
                  </span>
                  <Tag tom={pronta ? "sucesso" : "neutra"} tamanho="sm" className="shrink-0">
                    {fonte.status === "aprovada" ? "aprovada" : fonte.definida ? "escolhida" : "proposta"}
                  </Tag>
                  <ChevronRight className="size-4 shrink-0 text-texto-3 transition-transform duration-150 group-hover/fonte:translate-x-0.5" strokeWidth={2} aria-hidden />
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="titulo-mockups" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-mockups" titulo="mockups" quantidade={guia.mockups.length} />
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
          {guia.mockups.map((mockup) => (
            <li key={mockup.id} className="flex min-w-0">
              <article aria-labelledby={`mockup-${mockup.id}`} className="flex w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie">
                <Mockup suporte={mockup.suporte} sistema={sistema} pecas={grade3x3} banner={banner} />
                <div className="flex flex-col gap-0.5 p-4">
                  <h3 id={`mockup-${mockup.id}`} className="text-sm font-semibold">
                    {mockup.nome}
                  </h3>
                  <p className="text-xs text-texto-2">{mockup.especificacao}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-diagramacao" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-diagramacao" titulo="regras de diagramação" quantidade={guia.regras.length} />
        <ul className="grid grid-cols-1 gap-x-6 rounded-3xl bg-superficie p-5 sm:grid-cols-2 md:p-6 @4xl:grid-cols-4">
          {guia.regras.map((regra) => (
            <li key={regra.titulo} className="flex flex-col gap-1 border-t border-borda-sutil py-4 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0 @4xl:[&:nth-child(-n+4)]:border-t-0 @4xl:[&:nth-child(-n+4)]:pt-0">
              <span className="font-heading text-titulo-3 font-medium">{regra.numero}</span>
              <h3 className="text-sm font-semibold">{regra.titulo}</h3>
              <p className="text-sm text-texto-2">{regra.texto}</p>
              {regra.titulo === "Tipografia" && (
                <p className="text-xs text-texto-3">
                  {sistema.combinacao.display.familia}, {sistema.combinacao.texto.familia} e {sistema.combinacao.sistema.familia}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-pecas" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-pecas" titulo="peças de comunicação" quantidade={guia.formatos.length}>
          <Botao variante="secundario" tamanho="sm" aria-pressed={grade} onClick={() => setGrade((valor) => !valor)}>
            <Grid3x3 /> {grade ? "Esconder grid" : "Mostrar grid"}
          </Botao>
        </CabecalhoBloco>
        <Abas defaultValue={guia.formatos[0].id}>
          <ListaAbas rotulo="Formatos" itens={guia.formatos.map((formato) => ({ valor: formato.id, rotulo: formato.nome }))} />
          {guia.formatos.map((formato) => (
            <ConteudoAba key={formato.id} value={formato.id} className="flex flex-col gap-4">
              <Formato formato={formato} sistema={sistema} grade={grade} />
            </ConteudoAba>
          ))}
        </Abas>
      </section>

      <section aria-labelledby="titulo-exploracoes" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-exploracoes" titulo="explorações gráficas" quantidade={guia.exploracoes.length} />
        <p className="max-w-[70ch] text-sm text-texto-2">Jeitos de combinar os recursos da marca que dão variedade ao feed sem sair do sistema.</p>
        <ul className="grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-2 @4xl:grid-cols-3">
          {guia.exploracoes.map((exploracao) => (
            <li key={exploracao.id} className="min-w-0">
              <FiguraPeca exemplo={exploracao} proporcao={[1, 1]} sistema={sistema} descricao={exploracao.ideia} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Formato({ formato, sistema, grade }: { formato: FormatoPeca; sistema: SistemaMarca; grade: boolean }) {
  const [largura, altura] = formato.proporcao
  const razao = largura / altura
  const dados = [
    ["Medida", formato.medida],
    ["Margem", formato.margem],
    ["Colunas", String(formato.colunas)],
    ["Título", formato.titulo],
    ...(formato.zonaSegura ? [["Zona segura", formato.zonaSegura.texto]] : []),
  ]
  return (
    <>
      <div className="grid grid-cols-1 gap-5 rounded-3xl bg-superficie p-5 md:p-6 @4xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @4xl:gap-0">
        <dl className="grid grid-cols-2 gap-y-3 @4xl:pe-6">
          {dados.map(([rotulo, valor]) => (
            <div key={rotulo} className="flex flex-col gap-0.5 pe-4">
              <dt className="text-xs text-texto-3">{rotulo}</dt>
              <dd className="text-sm tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col gap-2 border-t border-borda-sutil pt-4 @4xl:border-t-0 @4xl:border-s @4xl:ps-6 @4xl:pt-0">
          <h3 className="text-xs text-texto-3">{formato.grupo}</h3>
          <ul className="flex flex-col gap-1.5 text-sm">
            {formato.regras.map((regra) => (
              <li key={regra} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-texto-3" />
                {regra}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ul
        className={cn(
          "grid gap-x-3 gap-y-6",
          razao >= 1.4 ? "grid-cols-1 @4xl:grid-cols-2" : cn("grid-cols-2", COLUNAS[Math.min(formato.exemplos.length, 4)]),
          razao >= 1.4 && formato.exemplos.length % 2 === 1 && "@4xl:[&>li:first-child]:col-span-2",
        )}
      >
        {formato.exemplos.map((exemplo) => (
          <li key={exemplo.id} className="min-w-0">
            <FiguraPeca exemplo={exemplo} proporcao={formato.proporcao} sistema={sistema} grade={grade ? formato : false} zona={formato.zonaSegura} />
          </li>
        ))}
      </ul>
    </>
  )
}

function FiguraPeca({
  exemplo,
  proporcao,
  sistema,
  grade = false,
  zona,
  descricao,
}: {
  exemplo: ExemploPeca
  proporcao: [number, number]
  sistema: SistemaMarca
  grade?: FormatoPeca | false
  zona?: FormatoPeca["zonaSegura"]
  descricao?: string
}) {
  return (
    <figure className="flex flex-col gap-2.5">
      <Peca exemplo={exemplo} proporcao={proporcao} sistema={sistema} grade={grade} zona={zona} className="rounded-2xl" />
      <figcaption className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold">{exemplo.nome}</span>
        {descricao && <span className="text-xs text-texto-2">{descricao}</span>}
        <span className="flex flex-wrap gap-1">
          {exemplo.recursos.map((recurso) => (
            <Tag key={recurso} tamanho="sm">
              {nomeDoRecurso(recurso, sistema)}
            </Tag>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
