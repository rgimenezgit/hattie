"use client"

import { useState, type FormEvent } from "react"
import { Package, Plus, Sparkle, Wrench } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import type { Marca, ProdutoMarca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Produtos e serviços: o que a marca vende, separado do que a marca é.
 * Cada card mostra o que é, as características e os diferenciais. Para quem é, como usar e ingredientes
 * ficam nas opções avançadas. Dá para adicionar produtos e serviços; os novos entram como rascunho para o Hattie completar.
 */
export function SecaoProdutos({ secao, marca, aoEditar }: Props) {
  const inicial = secao.conteudo.tipo === "produtos" ? secao.conteudo.produtos : []
  const [produtos, setProdutos] = useState<ProdutoMarca[]>(inicial)
  const [adicionando, setAdicionando] = useState(false)
  if (secao.conteudo.tipo !== "produtos") return null
  const comDetalhes = produtos.filter((produto) => produto.paraQuem || produto.comoUsar || produto.ingredientes?.length)

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-produtos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-produtos" titulo="o que a marca vende" quantidade={produtos.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={() => setAdicionando(true)}>
            <Plus /> Adicionar
          </Botao>
        </CabecalhoBloco>
        <p className="max-w-[70ch] text-sm text-texto-2">{secao.conteudo.resumo}</p>
        <ul className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
          {produtos.map((produto) => (
            <li key={produto.id} className="flex min-w-0">
              <CartaoProduto produto={produto} />
            </li>
          ))}
        </ul>
      </section>

      {comDetalhes.length > 0 && (
        <VerMais resumo="Para quem é, como usar e ingredientes de cada produto">
          <section aria-labelledby="titulo-detalhes-produtos" className="flex flex-col gap-3">
            <CabecalhoBloco id="titulo-detalhes-produtos" titulo="ficha de cada produto" quantidade={comDetalhes.length} />
            <ul className="flex flex-col gap-3">
              {comDetalhes.map((produto) => (
                <li key={produto.id} className="grid grid-cols-1 gap-4 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[12rem_minmax(0,1fr)]">
                  <h3 className="text-sm font-semibold">{produto.nome}</h3>
                  <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-[96px_1fr]">
                    {(
                      [
                        ["Para quem", produto.paraQuem],
                        ["Como usar", produto.comoUsar],
                        ["Ingredientes", produto.ingredientes?.join(", ")],
                      ] as const
                    )
                      .filter(([, valor]) => valor)
                      .map(([rotulo, valor]) => (
                        <div key={rotulo} className="contents">
                          <dt className="text-xs text-texto-3 sm:pt-0.5">{rotulo}</dt>
                          <dd className="text-sm">{valor}</dd>
                        </div>
                      ))}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        </VerMais>
      )}

      <FormProduto
        aberta={adicionando}
        aoMudar={setAdicionando}
        marca={marca}
        aoAdicionar={(produto) => {
          setProdutos((atual) => [...atual, produto])
          notificar({ titulo: "produto anotado", texto: `Coloquei ${produto.nome} na lista. Eu completo os diferenciais a partir do que você escreveu.`, tipo: "sucesso" })
        }}
      />
    </div>
  )
}

function CartaoProduto({ produto }: { produto: ProdutoMarca }) {
  const Icone = produto.tipo === "servico" ? Wrench : Package
  return (
    <article aria-labelledby={`produto-${produto.id}`} className="flex w-full flex-col gap-4 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex items-start gap-3">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-preenchimento-ativo">
          <Icone className="size-4.5" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 id={`produto-${produto.id}`} className="text-base font-semibold">
              {produto.nome}
            </h3>
            {produto.principal && (
              <Tag tamanho="sm">
                <Sparkle className="fill-current" /> carro-chefe
              </Tag>
            )}
            {produto.rascunho && (
              <Tag tom="acao" tamanho="sm" ponto>
                rascunho
              </Tag>
            )}
          </div>
          <p className="text-xs text-texto-3">
            {produto.categoria}
            {produto.preco && ` · ${produto.preco}`}
          </p>
        </div>
      </header>
      <p className="text-sm">{produto.oQueE}</p>
      {produto.caracteristicas.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Características">
          {produto.caracteristicas.map((item) => (
            <li key={item}>
              <Tag>{item}</Tag>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-col gap-1.5 border-t border-borda-sutil pt-4">
        <h4 className="text-xs font-semibold text-texto-2">O que tem de diferente</h4>
        {produto.diferenciais.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {produto.diferenciais.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-texto-3" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-texto-3">Eu completo a partir das características.</p>
        )}
      </div>
    </article>
  )
}

function FormProduto({ aberta, aoMudar, marca, aoAdicionar }: { aberta: boolean; aoMudar: (aberta: boolean) => void; marca: Marca; aoAdicionar: (produto: ProdutoMarca) => void }) {
  const [erro, setErro] = useState("")
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Dê um nome ao produto ou serviço.")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const tipo = dados.get("tipo") === "servico" ? "servico" : "produto"
    aoAdicionar({
      id: `novo-${Date.now()}`,
      tipo,
      nome,
      categoria: tipo === "servico" ? "Serviço" : "Produto",
      oQueE: String(dados.get("oQueE") ?? "").trim() || "Eu escrevo a descrição a partir do nome e das características.",
      preco: String(dados.get("preco") ?? "").trim() || undefined,
      caracteristicas: String(dados.get("caracteristicas") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      diferenciais: [],
      rascunho: true,
    })
    setErro("")
    aoMudar(false)
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      titulo="novo produto ou serviço"
      descricao={`Escreva o básico. Eu completo o resto com o que já sei da ${marca.nome}.`}
      rodape={
        <div className="flex w-full justify-end gap-2">
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Cancelar
          </Botao>
          <Botao variante="primario" type="submit" form="form-produto">
            Adicionar
          </Botao>
        </div>
      }
    >
      <form id="form-produto" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <Campo name="nome" rotulo="Nome" placeholder="Ex.: Bálsamo de copaíba" erro={erro} onChange={() => erro && setErro("")} />
          <CampoLista
            name="tipo"
            rotulo="É um"
            opcoes={[
              { valor: "produto", rotulo: "Produto" },
              { valor: "servico", rotulo: "Serviço" },
            ]}
          />
        </div>
        <CampoArea name="oQueE" rotulo="O que é" dica="Opcional" placeholder="Numa frase: o que é e para que serve." compacto />
        <Campo name="caracteristicas" rotulo="Características" dica="Separe por vírgula" placeholder="Ex.: vegano, 50 g, pote de vidro" />
        <Campo name="preco" rotulo="Preço" dica="Opcional" placeholder="Ex.: R$ 45" />
      </form>
    </Janela>
  )
}
