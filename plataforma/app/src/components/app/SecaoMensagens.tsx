"use client"

import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import type { Marca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Mensagens-chave: as ideias que a marca repete. Cada card traz a frase, uma explicação curta e as palavras
 * que carregam a ideia (o que antes era "palavras-chave" e "vocabulário"). Exemplos prontos ficam nas opções avançadas.
 */
export function SecaoMensagens({ secao, marca, aoEditar }: Props) {
  if (secao.conteudo.tipo !== "mensagens") return null
  const { resumo, mensagens } = secao.conteudo

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-mensagens" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-mensagens" titulo="o que a marca repete" quantidade={mensagens.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <p className="max-w-[70ch] text-sm text-texto-2">{resumo}</p>
        <ol className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {mensagens.map((mensagem, indice) => (
            <li key={mensagem.id} className="flex min-w-0">
              <article aria-labelledby={`mensagem-${mensagem.id}`} className="flex w-full flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
                <p className="flex items-center gap-2 text-xs text-texto-3 tabular-nums">
                  {String(indice + 1).padStart(2, "0")}
                  <span className="font-semibold text-texto-2">{mensagem.titulo}</span>
                </p>
                <h3 id={`mensagem-${mensagem.id}`} className="text-destaque leading-snug font-medium">
                  {mensagem.frase}
                </h3>
                <p className="text-sm text-texto-2">{mensagem.explicacao}</p>
                <div className="mt-auto flex flex-col gap-2 border-t border-borda-sutil pt-4">
                  <h4 className="text-xs font-semibold text-texto-2">Palavras que carregam essa ideia</h4>
                  <ul className="flex flex-wrap gap-1.5">
                    {mensagem.palavras.map((palavra) => (
                      <li key={palavra}>
                        <Tag>{palavra}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <VerMais resumo={`Exemplos prontos de cada mensagem em rótulo, post, loja e e-mail da ${marca.nome}`}>
        <section aria-labelledby="titulo-exemplos-mensagens" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-exemplos-mensagens" titulo="exemplos de uso" />
          <ul className="flex flex-col gap-3">
            {mensagens.map((mensagem) => (
              <li key={mensagem.id} className="grid grid-cols-1 gap-3 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[12rem_minmax(0,1fr)]">
                <h3 className="text-sm font-semibold">{mensagem.titulo}</h3>
                <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-[96px_1fr]">
                  {mensagem.exemplos.map((exemplo) => (
                    <div key={exemplo.onde} className="contents">
                      <dt className="text-xs text-texto-3 sm:pt-0.5">{exemplo.onde}</dt>
                      <dd className="text-sm">“{exemplo.texto}”</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        </section>
      </VerMais>
    </div>
  )
}
