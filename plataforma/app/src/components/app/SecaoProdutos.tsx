"use client"

import { useState, type FormEvent } from "react"
import { Package, Pencil, Plus, Sparkle, UsersRound, Wrench } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { EnvioImagens, type ImagemEnviada } from "@/components/hattie/EnvioImagens"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import { getSecao, type Marca, type ProdutoMarca, type Publico, type Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto, avisarRemocao } from "./AcoesPonto"
import { useEstado } from "./Estado"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Produtos e serviços: o que a marca vende, separado do que a marca é.
 * Cada card mostra a foto (quando há), o que é, as características, os públicos e os diferenciais. Para quem é, como usar
 * e ingredientes ficam nas opções avançadas. Dá para adicionar, editar (fotos e públicos inclusive) e apagar pelo menu
 * de três pontos; os novos entram como rascunho para o Hattie completar.
 */
export function SecaoProdutos({ secao, marca, aoEditar }: Props) {
  const { produtos: salvos, salvarProdutos, publicosNovos } = useEstado()
  /** null: fechado; "novo": adicionar; um produto: editar. */
  const [formulario, setFormulario] = useState<"novo" | ProdutoMarca | null>(null)
  if (secao.conteudo.tipo !== "produtos") return null
  const produtos = salvos ?? secao.conteudo.produtos
  const comDetalhes = produtos.filter((produto) => produto.paraQuem || produto.comoUsar || produto.ingredientes?.length)
  const conteudoPublico = getSecao("publico")?.conteudo
  const publicos = [...(conteudoPublico?.tipo === "publico" ? conteudoPublico.publicos : []), ...publicosNovos]

  function excluir(alvo: ProdutoMarca) {
    const antes = produtos
    salvarProdutos(produtos.filter((produto) => produto.id !== alvo.id))
    avisarRemocao(`Tirei ${alvo.nome} da lista de produtos e serviços.`, () => salvarProdutos(antes))
  }

  function guardar(produto: ProdutoMarca) {
    const existe = produtos.some((item) => item.id === produto.id)
    salvarProdutos(existe ? produtos.map((item) => (item.id === produto.id ? produto : item)) : [...produtos, produto])
    notificar(
      existe
        ? { titulo: "produto atualizado", texto: `Guardei as mudanças em ${produto.nome}.`, tipo: "sucesso" }
        : { titulo: "produto anotado", texto: `Coloquei ${produto.nome} na lista. Eu completo os diferenciais a partir do que você escreveu.`, tipo: "sucesso" },
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-produtos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-produtos" titulo="o que a marca vende" quantidade={produtos.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={() => setFormulario("novo")}>
            <Plus /> Adicionar
          </Botao>
        </CabecalhoBloco>
        <p className="max-w-[70ch] text-sm text-texto-2">{secao.conteudo.resumo}</p>
        {produtos.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
            {produtos.map((produto) => (
              <li key={produto.id} className="flex min-w-0">
                <CartaoProduto produto={produto} publicos={publicos} aoEditarDados={() => setFormulario(produto)} aoExcluir={() => excluir(produto)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl bg-superficie p-5 text-sm text-texto-2 md:p-6">Nenhum produto ou serviço na lista. Adicione o primeiro para eu conhecer o que a marca vende.</p>
        )}
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
        key={formulario === null ? "fechado" : formulario === "novo" ? "novo" : formulario.id}
        aberta={formulario !== null}
        aoMudar={(aberta) => !aberta && setFormulario(null)}
        marca={marca}
        inicial={formulario !== null && formulario !== "novo" ? formulario : undefined}
        publicos={publicos}
        aoGuardar={guardar}
      />
    </div>
  )
}

function CartaoProduto({
  produto,
  publicos,
  aoEditarDados,
  aoExcluir,
}: {
  produto: ProdutoMarca
  publicos: Publico[]
  aoEditarDados: () => void
  aoExcluir: () => void
}) {
  const Icone = produto.tipo === "servico" ? Wrench : Package
  const [capa, ...outras] = produto.imagens ?? []
  const paraQuem = publicos.filter((publico) => produto.publicos?.includes(publico.id))
  return (
    <article aria-labelledby={`produto-${produto.id}`} className="flex w-full flex-col gap-4 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex items-start gap-3">
        {capa ? (
          <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-preenchimento">
            {/* eslint-disable-next-line @next/next/no-img-element -- foto enviada pela pessoa, guardada no navegador (blob) */}
            <img src={capa.url} alt={`Foto de ${produto.nome}`} className="size-full object-cover" />
            {outras.length > 0 && (
              <span className="absolute end-1 bottom-1 rounded-full bg-superficie/90 px-1.5 text-micro font-semibold tabular-nums">
                +{outras.length}
                <span className="sr-only"> {outras.length === 1 ? "foto" : "fotos"}</span>
              </span>
            )}
          </span>
        ) : (
          <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-preenchimento-ativo">
            <Icone className="size-4.5" strokeWidth={1.75} />
          </span>
        )}
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
        <MenuPonto
          ponto={produto.nome}
          className="-me-2 -mt-1"
          acoes={[{ rotulo: produto.imagens?.length ? "Editar produto e fotos" : "Editar e adicionar fotos", icone: Pencil, abrePainel: true, onSelect: aoEditarDados }]}
          aoExcluir={aoExcluir}
        />
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
      {paraQuem.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 text-xs text-texto-2">
          <UsersRound className="size-3.5" strokeWidth={2} aria-hidden />
          <span className="sr-only">Para os públicos:</span>
          {paraQuem.map((publico) => (
            <span key={publico.id} className="rounded-full bg-preenchimento px-2.5 py-1 font-medium text-texto">
              {publico.nome}
            </span>
          ))}
        </p>
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

function FormProduto({
  aberta,
  aoMudar,
  marca,
  inicial,
  publicos,
  aoGuardar,
}: {
  aberta: boolean
  aoMudar: (aberta: boolean) => void
  marca: Marca
  inicial?: ProdutoMarca
  publicos: Publico[]
  aoGuardar: (produto: ProdutoMarca) => void
}) {
  const [erro, setErro] = useState("")
  const [imagens, setImagens] = useState<ImagemEnviada[]>(inicial?.imagens ?? [])

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
    const oQueE = String(dados.get("oQueE") ?? "").trim()
    aoGuardar({
      ...inicial,
      id: inicial?.id ?? `novo-${Date.now()}`,
      tipo,
      nome,
      categoria: inicial?.categoria ?? (tipo === "servico" ? "Serviço" : "Produto"),
      oQueE: oQueE || "Eu escrevo a descrição a partir do nome e das características.",
      preco: String(dados.get("preco") ?? "").trim() || undefined,
      caracteristicas: String(dados.get("caracteristicas") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      diferenciais: inicial?.diferenciais ?? [],
      imagens,
      publicos: dados.getAll("publicos").map(String),
      rascunho: inicial ? inicial.rascunho : true,
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
      largura="lg"
      titulo={inicial ? `editar ${inicial.nome.toLowerCase()}` : "novo produto ou serviço"}
      descricao={inicial ? "Mude o que quiser. As fotos e os públicos ajudam nas peças e nas mensagens." : `Escreva o básico. Eu completo o resto com o que já sei da ${marca.nome}.`}
      rodape={
        <div className="flex w-full justify-end gap-2">
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Cancelar
          </Botao>
          <Botao variante="primario" type="submit" form="form-produto">
            {inicial ? "Guardar" : "Adicionar"}
          </Botao>
        </div>
      }
    >
      <form id="form-produto" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <Campo name="nome" rotulo="Nome" placeholder="Ex.: Bálsamo de copaíba" defaultValue={inicial?.nome} erro={erro} onChange={() => erro && setErro("")} />
          <CampoLista
            name="tipo"
            rotulo="É um"
            defaultValue={inicial?.tipo ?? "produto"}
            opcoes={[
              { valor: "produto", rotulo: "Produto" },
              { valor: "servico", rotulo: "Serviço" },
            ]}
          />
        </div>
        <CampoArea name="oQueE" rotulo="O que é" dica="Opcional" placeholder="Numa frase: o que é e para que serve." defaultValue={inicial?.oQueE} compacto />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_10rem]">
          <Campo name="caracteristicas" rotulo="Características" dica="Separe por vírgula" placeholder="Ex.: vegano, 50 g, pote de vidro" defaultValue={inicial?.caracteristicas.join(", ")} />
          <Campo name="preco" rotulo="Preço" dica="Opcional" placeholder="Ex.: R$ 45" defaultValue={inicial?.preco} />
        </div>
        <EnvioImagens rotulo="Fotos" dica="A primeira vira a capa do card. Até 6 fotos." imagens={imagens} aoMudar={setImagens} limite={6} compacto />
        {publicos.length > 0 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-detalhe font-medium text-texto-2">Para quais públicos</legend>
            <div className="flex flex-wrap gap-2">
              {publicos.map((publico) => (
                <label
                  key={publico.id}
                  className="flex cursor-pointer items-center gap-2 rounded-full bg-preenchimento px-3.5 py-2 text-sm transition-[background-color] duration-150 select-none hover:bg-preenchimento-hover has-checked:bg-preto has-checked:text-lima has-focus-visible:ring-2 has-focus-visible:ring-preto has-focus-visible:ring-offset-2"
                >
                  <input type="checkbox" name="publicos" value={publico.id} defaultChecked={inicial?.publicos?.includes(publico.id)} className="peer sr-only" />
                  <UsersRound className="size-3.5" strokeWidth={2} aria-hidden />
                  {publico.nome}
                </label>
              ))}
            </div>
            <p className="text-detalhe text-texto-3">Os públicos vêm de Público e personas.</p>
          </fieldset>
        )}
      </form>
    </Janela>
  )
}
