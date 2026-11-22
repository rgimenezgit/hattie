"use client"

import { useEffect, useId, useMemo, useState, type CSSProperties } from "react"
import { Copy, ExternalLink, RotateCcw } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { VerMais } from "@/components/hattie/VerMais"
import { FONTES_CURADAS, pilhaDaFonte, urlEspecime, type FonteCatalogo } from "@/lib/fontes"
import { carregarFonteGoogle, useFontesGoogle } from "@/lib/usarFonteGoogle"
import { cn } from "@/lib/utils"
import { type CombinacaoTipografica, type EstiloTipografico, type FonteMarca, type GuiaTipografia, type Marca, type PapelFonte, type Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto } from "./AcoesPonto"
import { useEstado } from "./Estado"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

const PAPEIS: { id: PapelFonte; rotulo: string; funcao: string }[] = [
  { id: "display", rotulo: "Display", funcao: "Títulos e chamadas" },
  { id: "texto", rotulo: "Texto", funcao: "Textos, legendas e rótulos" },
  { id: "sistema", rotulo: "Sistema", funcao: "Botões, números e telas" },
]

const fonteDoPapel = (combinacao: CombinacaoTipografica, papel: PapelFonte) => combinacao[papel]
const familiaCss = (fonte: FonteMarca) => pilhaDaFonte(fonte.familia, fonte.categoria === "display" ? "sans-serif" : fonte.categoria)

/**
 * A combinação que a pessoa escolheu depois da conversa (ou a aposta do Hattie): as três fontes, aplicações,
 * a escala completa (headline a interface, tela e celular, com CSS para copiar), espaçamento e guias
 * e um espaço de teste no estilo de um site de fontes, ligado ao Google Fonts.
 */
export function SecaoTipografia({ secao, marca, aoEditar }: Props) {
  const { tipografiaEscolhida } = useEstado()
  const guia = secao.conteudo.tipo === "tipografia" ? secao.conteudo : null
  const escolhida = guia ? (guia.combinacoes.find((item) => item.id === tipografiaEscolhida) ?? guia.combinacoes.find((item) => item.aposta) ?? guia.combinacoes[0]) : null
  useFontesGoogle(escolhida ? PAPEIS.map((papel) => ({ familia: escolhida[papel.id].familia, pesos: escolhida[papel.id].pesos })) : [])
  if (!guia || !escolhida) return null
  return <Sistema guia={guia} combinacao={escolhida} marca={marca} secao={secao} aoEditar={aoEditar} />
}

function Sistema({
  guia,
  combinacao,
  marca,
  secao,
  aoEditar,
}: {
  guia: GuiaTipografia
  combinacao: CombinacaoTipografica
  marca: Marca
  secao: Secao
  aoEditar: () => void
}) {
  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-fontes" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-fontes" titulo="as fontes" quantidade={3}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <MenuPonto ponto="as fontes" />
        </CabecalhoBloco>
        <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {PAPEIS.map((papel) => (
            <li key={papel.id} className="flex min-w-0">
              <CartaoFonte papel={papel} fonte={fonteDoPapel(combinacao, papel.id)} />
            </li>
          ))}
        </ul>
      </section>
      <Aplicacoes guia={guia} combinacao={combinacao} marca={marca} />
      <VerMais resumo="Escala de tamanhos, espaçamento entre título e texto, guias e espaço para testar as fontes">
        <Escala guia={guia} combinacao={combinacao} />
        <Espacamento guia={guia} combinacao={combinacao} />
        <EspacoDeTeste guia={guia} combinacoes={[combinacao]} />
      </VerMais>
    </div>
  )
}

function CartaoFonte({ papel, fonte }: { papel: (typeof PAPEIS)[number]; fonte: FonteMarca }) {
  return (
    <article aria-label={`Fonte ${papel.rotulo.toLowerCase()}: ${fonte.familia}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold">Fonte {papel.rotulo.toLowerCase()}</p>
          <p className="text-xs text-texto-2">{fonte.uso}</p>
        </div>
        <a
          href={urlEspecime(fonte.familia)}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-texto-2 underline-offset-4 hover:text-texto hover:underline"
        >
          Google Fonts <ExternalLink className="size-3" strokeWidth={2} aria-hidden />
        </a>
      </header>
      <div className="flex flex-col gap-1 rounded-2xl bg-preenchimento p-4" style={{ fontFamily: familiaCss(fonte) }}>
        <p className="text-[64px] leading-none" style={{ fontWeight: fonte.pesos[1] ?? fonte.pesos[0] }} aria-hidden>
          Aa
        </p>
        <p className="text-titulo-3" style={{ fontWeight: fonte.pesos[1] ?? fonte.pesos[0] }}>
          {fonte.familia}
        </p>
      </div>
      <p className="truncate text-sm text-texto-2" style={{ fontFamily: familiaCss(fonte) }} aria-hidden>
        ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
      </p>
      <div className="mt-auto flex flex-col gap-1.5 border-t border-borda-sutil pt-3">
        <p className="text-xs text-texto-3">Pesos usados</p>
        <ul className="flex flex-wrap gap-3">
          {fonte.pesos.map((peso) => (
            <li key={peso} className="text-sm tabular-nums" style={{ fontFamily: familiaCss(fonte), fontWeight: peso }}>
              {peso}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function estiloCss(estilo: EstiloTipografico, combinacao: CombinacaoTipografica, tela: "tela" | "celular"): CSSProperties {
  const medida = estilo[tela]
  return {
    fontFamily: familiaCss(fonteDoPapel(combinacao, estilo.papel)),
    fontWeight: estilo.peso,
    fontSize: medida.tamanho,
    lineHeight: `${medida.linha}px`,
    letterSpacing: `${estilo.letras / 100}em`,
    textTransform: estilo.caixa === "alta" ? "uppercase" : undefined,
  }
}

function cssDoSistema(guia: GuiaTipografia, combinacao: CombinacaoTipografica) {
  const linhas = [
    ":root {",
    ...PAPEIS.map((papel) => `  --fonte-${papel.id}: ${familiaCss(fonteDoPapel(combinacao, papel.id))};`),
    "}",
    "",
  ]
  guia.estilos.forEach((estilo) => {
    linhas.push(
      `.${estilo.id} {`,
      `  font-family: var(--fonte-${estilo.papel});`,
      `  font-weight: ${estilo.peso};`,
      `  font-size: ${estilo.tela.tamanho}px;`,
      `  line-height: ${estilo.tela.linha}px;`,
      `  letter-spacing: ${estilo.letras / 100}em;`,
      ...(estilo.caixa === "alta" ? ["  text-transform: uppercase;"] : []),
      "}",
    )
  })
  linhas.push("", "@media (max-width: 640px) {")
  guia.estilos
    .filter((estilo) => estilo.celular.tamanho !== estilo.tela.tamanho)
    .forEach((estilo) => linhas.push(`  .${estilo.id} { font-size: ${estilo.celular.tamanho}px; line-height: ${estilo.celular.linha}px; }`))
  linhas.push("}")
  const importacao = `@import url("https://fonts.googleapis.com/css2?${PAPEIS.map((papel) => {
    const fonte = fonteDoPapel(combinacao, papel.id)
    return `family=${fonte.familia.replace(/\s+/g, "+")}:wght@${fonte.pesos.join(";")}`
  }).join("&")}&display=swap");`
  return `${importacao}\n\n${linhas.join("\n")}\n`
}

function Escala({ guia, combinacao }: { guia: GuiaTipografia; combinacao: CombinacaoTipografica }) {
  return (
    <section aria-labelledby="titulo-escala" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-escala" titulo="escala tipográfica" quantidade={guia.estilos.length}>
        <Botao
          variante="secundario"
          tamanho="sm"
          onClick={() => {
            navigator.clipboard?.writeText(cssDoSistema(guia, combinacao))
            notificar({ titulo: "CSS copiado", texto: "Fontes, tamanhos e entrelinhas prontos para colar no site.", tipo: "sucesso" })
          }}
        >
          <Copy /> Copiar CSS
        </Botao>
      </CabecalhoBloco>
      <Abas defaultValue="tela">
        <ListaAbas
          rotulo="Tamanho de tela"
          itens={[
            { valor: "tela", rotulo: "Tela grande" },
            { valor: "celular", rotulo: "Celular" },
          ]}
        />
        {(["tela", "celular"] as const).map((tela) => (
          <ConteudoAba key={tela} value={tela}>
            <ul className="flex flex-col rounded-3xl bg-superficie px-5 md:px-6">
              {guia.estilos.map((estilo) => {
                const fonte = fonteDoPapel(combinacao, estilo.papel)
                const medida = estilo[tela]
                return (
                  <li
                    key={estilo.id}
                    className="grid grid-cols-1 gap-3 border-b border-borda-sutil py-5 last:border-b-0 @3xl:grid-cols-[176px_minmax(0,1fr)] @3xl:items-baseline @3xl:gap-6"
                  >
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-sm font-semibold">{estilo.nome}</h3>
                      <p className="text-xs text-texto-2">
                        {fonte.familia} · {estilo.peso}
                      </p>
                      <p className="text-xs text-texto-3 tabular-nums">
                        {medida.tamanho}/{medida.linha} px · {estilo.letras > 0 ? "+" : ""}
                        {estilo.letras}%{estilo.caixa === "alta" ? " · caixa alta" : ""}
                      </p>
                      <p className="text-xs text-texto-3">{estilo.uso}</p>
                    </div>
                    <p className="min-w-0 break-words" style={estiloCss(estilo, combinacao, tela)}>
                      {estilo.id === "cta" ? (
                        <span className="inline-flex rounded-full bg-preto px-5 py-2.5 text-branco">{estilo.exemplo}</span>
                      ) : (
                        estilo.exemplo
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </ConteudoAba>
        ))}
      </Abas>
    </section>
  )
}

/** Faixa que mostra um espaço vertical com a medida em px. */
function Espaco({ px }: { px: number }) {
  return (
    <span aria-hidden className="relative flex items-center justify-end bg-info-suave" style={{ height: px }}>
      <span className="pe-2 text-micro text-texto-2 tabular-nums">{px} px</span>
    </span>
  )
}

function Espacamento({ guia, combinacao }: { guia: GuiaTipografia; combinacao: CombinacaoTipografica }) {
  const h2 = guia.estilos.find((estilo) => estilo.id === "h2")!
  const corpo = guia.estilos.find((estilo) => estilo.id === "corpo")!
  const legenda = guia.estilos.find((estilo) => estilo.id === "legenda")!
  return (
    <section aria-labelledby="titulo-espacamento-tipo" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-espacamento-tipo" titulo="espaçamento e guias" />
      <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @4xl:grid-cols-2 @4xl:gap-0">
        <div className="flex flex-col @4xl:pe-6">
          <p style={estiloCss(legenda, combinacao, "tela")}>Lote 12 · Pirenópolis</p>
          <Espaco px={8} />
          <p style={estiloCss(h2, combinacao, "tela")}>De onde vem cada gota</p>
          <Espaco px={16} />
          <p className="max-w-[60ch]" style={estiloCss(corpo, combinacao, "tela")}>
            {guia.paragrafo}
          </p>
          <Espaco px={24} />
          <p className="max-w-[60ch]" style={estiloCss(corpo, combinacao, "tela")}>
            Cada frasco traz o lote e a cooperativa de onde veio o ingrediente principal.
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-4 border-t border-borda-sutil pt-5 sm:grid-cols-2 @4xl:border-t-0 @4xl:border-s @4xl:ps-6 @4xl:pt-0">
          {guia.regras.map((regra) => (
            <div key={regra.titulo} className="flex flex-col gap-0.5">
              <dt className="text-sm font-semibold">{regra.titulo}</dt>
              <dd className="text-sm text-texto-2">{regra.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Aplicacoes({ guia, combinacao, marca }: { guia: GuiaTipografia; combinacao: CombinacaoTipografica; marca: Marca }) {
  const [principal, , creme, escura] = marca.paleta
  const estilo = (id: string, tela: "tela" | "celular" = "celular") => estiloCss(guia.estilos.find((item) => item.id === id)!, combinacao, tela)
  return (
    <section aria-labelledby="titulo-aplicacoes-tipo" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-aplicacoes-tipo" titulo="aplicações" quantidade={3} />
      <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
        <li className="flex flex-col gap-2">
          <div className="flex aspect-square flex-col justify-end gap-3 rounded-3xl p-6" style={{ backgroundColor: principal.hex, color: creme.hex }}>
            <p style={{ ...estilo("legenda"), color: creme.hex, opacity: 0.8 }}>Lote 12 · Pirenópolis</p>
            <p style={{ ...estilo("h1"), fontSize: 30, lineHeight: "34px" }}>{guia.frase}</p>
            <span className="self-start rounded-full px-4 py-2" style={{ ...estilo("cta"), backgroundColor: creme.hex, color: principal.hex }}>
              Ver de onde vem
            </span>
          </div>
          <p className="px-1 text-xs text-texto-2">Post do Instagram · legenda, H1 e CTA</p>
        </li>
        <li className="flex flex-col gap-2">
          <div className="grid aspect-square place-items-center rounded-3xl p-6" style={{ backgroundColor: escura?.hex ?? principal.hex }}>
            <div className="flex w-full max-w-56 flex-col items-center gap-2 rounded-2xl px-5 py-6 text-center" style={{ backgroundColor: creme.hex, color: principal.hex }}>
              <p style={{ ...estilo("h2"), fontSize: 22, lineHeight: "26px" }}>{marca.nome}</p>
              <p style={estilo("legenda")}>Hidratante de pequi</p>
              <p className="mt-1" style={{ ...estilo("corpo-pequeno"), fontSize: 10, lineHeight: "14px", color: escura?.hex }}>
                Óleo de pequi, manteiga de karité e vitamina E. Uso diário.
              </p>
              <p className="tabular-nums" style={{ ...estilo("interface"), fontSize: 10, lineHeight: "14px", color: escura?.hex }}>
                Lote 012 · 200 ml
              </p>
            </div>
          </div>
          <p className="px-1 text-xs text-texto-2">Rótulo · H2, legenda, texto pequeno e interface</p>
        </li>
        <li className="flex flex-col gap-2">
          <div className="flex aspect-square flex-col justify-center gap-3 rounded-3xl bg-branco p-6 outline outline-1 -outline-offset-1 outline-borda-sutil" style={{ color: escura?.hex ?? "#101010" }}>
            <p style={{ ...estilo("legenda"), color: principal.hex }}>E-mail · reposição</p>
            <p style={{ ...estilo("h2"), fontSize: 24, lineHeight: "28px" }}>Seu hidratante deve estar no fim</p>
            <p style={{ ...estilo("corpo"), fontSize: 14, lineHeight: "22px" }}>Faz 30 dias da sua última compra. O lote 13 chega na sexta. Quer que eu separe um para você?</p>
            <span className="self-start rounded-full px-4 py-2" style={{ ...estilo("cta"), backgroundColor: principal.hex, color: creme.hex }}>
              Separar o meu
            </span>
          </div>
          <p className="px-1 text-xs text-texto-2">E-mail · legenda, H2, texto e CTA</p>
        </li>
      </ul>
    </section>
  )
}

/** Espaço de teste no estilo de um site de fontes: escreve, troca a fonte, muda tamanho, peso, entrelinha e espaçamento. */
function EspacoDeTeste({ guia, combinacoes }: { guia: GuiaTipografia; combinacoes: CombinacaoTipografica[] }) {
  const idLista = useId()
  const opcoes = useMemo(() => {
    const vistas = new Map<string, { familia: string; categoria: FonteMarca["categoria"]; pesos: number[]; papel: string }>()
    combinacoes.forEach((combinacao) =>
      PAPEIS.forEach((papel) => {
        const fonte = combinacao[papel.id]
        if (!vistas.has(fonte.familia)) vistas.set(fonte.familia, { ...fonte, papel: combinacoes.length > 1 ? `${papel.rotulo} · ${combinacao.nome}` : papel.rotulo })
      }),
    )
    return [...vistas.values()]
  }, [combinacoes])
  const [catalogo, setCatalogo] = useState<FonteCatalogo[]>(FONTES_CURADAS)
  const [origem, setOrigem] = useState<"google" | "curada">("curada")
  const [familia, setFamilia] = useState(opcoes[0].familia)
  const [busca, setBusca] = useState("")
  const [texto, setTexto] = useState(guia.frase)
  const [tamanho, setTamanho] = useState(56)
  const [peso, setPeso] = useState(400)
  const [linha, setLinha] = useState(1.15)
  const [letras, setLetras] = useState(0)

  useEffect(() => {
    let ativo = true
    fetch("/api/fontes")
      .then((resposta) => resposta.json())
      .then((dados: { origem: "google" | "curada"; fontes: FonteCatalogo[] }) => {
        if (!ativo) return
        setCatalogo(dados.fontes)
        setOrigem(dados.origem)
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [])

  const atual = opcoes.find((opcao) => opcao.familia === familia) ?? catalogo.find((fonte) => fonte.familia === familia)
  const pesos = atual?.pesos.length ? atual.pesos : [400]
  const categoria = atual?.categoria === "display" || atual?.categoria === "handwriting" ? "sans-serif" : (atual?.categoria ?? "sans-serif")
  const estilo: CSSProperties = { fontFamily: pilhaDaFonte(familia, categoria), fontWeight: pesos.includes(peso) ? peso : pesos[0], lineHeight: linha, letterSpacing: `${letras / 100}em` }

  function escolherFonte(nova: string) {
    const fonte = opcoes.find((opcao) => opcao.familia === nova) ?? catalogo.find((item) => item.familia.toLowerCase() === nova.toLowerCase())
    if (!fonte) return
    carregarFonteGoogle(fonte.familia, fonte.pesos)
    setFamilia(fonte.familia)
    if (!fonte.pesos.includes(peso)) setPeso(fonte.pesos.includes(400) ? 400 : fonte.pesos[0])
  }

  function recomecar() {
    setTexto(guia.frase)
    setTamanho(56)
    setPeso(400)
    setLinha(1.15)
    setLetras(0)
    setFamilia(opcoes[0].familia)
    setBusca("")
  }

  return (
    <section aria-labelledby="titulo-teste" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-teste" titulo="teste as fontes">
        <Botao variante="fantasma" tamanho="sm" onClick={recomecar}>
          <RotateCcw /> Recomeçar
        </Botao>
      </CabecalhoBloco>
      <div className="flex flex-col overflow-hidden rounded-3xl bg-superficie">
        <div className="flex flex-col gap-4 border-b border-borda-sutil p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Fontes da marca">
            {opcoes.map((opcao) => (
              <button
                key={opcao.familia}
                type="button"
                aria-pressed={familia === opcao.familia}
                onClick={() => escolherFonte(opcao.familia)}
                className={cn(
                  "clique flex h-8 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium",
                  familia === opcao.familia ? "bg-acao text-preto" : "bg-preenchimento text-texto-2 hover:bg-preenchimento-hover hover:text-texto",
                )}
              >
                {opcao.familia}
                <span className="text-xs font-normal text-texto-3">{opcao.papel}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 @4xl:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
            <label className="col-span-2 flex flex-col gap-1.5 @4xl:col-span-1">
              <span className="text-xs font-medium text-texto-2">Outra fonte do Google</span>
              <input
                list={idLista}
                value={busca}
                onChange={(evento) => {
                  setBusca(evento.target.value)
                  escolherFonte(evento.target.value)
                }}
                placeholder={`Buscar entre ${catalogo.length} fontes`}
                className="h-9 rounded-xl bg-preenchimento px-3 text-sm outline-none placeholder:text-texto-3 hover:bg-preenchimento-hover focus-visible:bg-superficie focus-visible:shadow-(--sombra-campo)"
              />
              <datalist id={idLista}>
                {catalogo.map((fonte) => (
                  <option key={fonte.familia} value={fonte.familia}>
                    {fonte.categoria}
                  </option>
                ))}
              </datalist>
            </label>
            <Controle rotulo="Tamanho" valor={`${tamanho} px`}>
              <input type="range" min={12} max={120} value={tamanho} onChange={(evento) => setTamanho(Number(evento.target.value))} className="w-full accent-preto" aria-label="Tamanho" />
            </Controle>
            <Controle rotulo="Peso" valor={String(estilo.fontWeight)}>
              <select
                value={String(estilo.fontWeight)}
                onChange={(evento) => setPeso(Number(evento.target.value))}
                className="h-9 rounded-xl bg-preenchimento px-2 text-sm outline-none hover:bg-preenchimento-hover"
                aria-label="Peso"
              >
                {pesos.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Controle>
            <Controle rotulo="Entrelinha" valor={linha.toFixed(2)}>
              <input type="range" min={0.9} max={2} step={0.05} value={linha} onChange={(evento) => setLinha(Number(evento.target.value))} className="w-full accent-preto" aria-label="Entrelinha" />
            </Controle>
            <Controle rotulo="Entre letras" valor={`${letras > 0 ? "+" : ""}${letras}%`}>
              <input type="range" min={-6} max={20} value={letras} onChange={(evento) => setLetras(Number(evento.target.value))} className="w-full accent-preto" aria-label="Espaçamento entre letras" />
            </Controle>
          </div>
        </div>

        <label className="flex flex-col gap-2 p-5 md:p-6">
          <span className="sr-only">Texto de teste</span>
          <textarea
            value={texto}
            onChange={(evento) => setTexto(evento.target.value)}
            rows={2}
            placeholder="Escreva aqui para testar"
            className="field-sizing-content min-h-20 w-full resize-none bg-transparent outline-none placeholder:text-texto-3"
            style={{ ...estilo, fontSize: tamanho }}
          />
        </label>

        <ol className="flex flex-col border-t border-borda-sutil px-5 md:px-6" aria-label="Cascata de tamanhos">
          {[64, 40, 28, 20, 16, 13].map((medida) => (
            <li key={medida} className="flex items-baseline gap-4 border-b border-borda-sutil py-3 last:border-b-0">
              <span className="w-12 shrink-0 text-xs text-texto-3 tabular-nums">{medida} px</span>
              <span className="min-w-0 truncate" style={{ ...estilo, fontSize: medida }}>
                {texto || guia.frase}
              </span>
            </li>
          ))}
        </ol>
        <p className="border-t border-borda-sutil px-5 py-3 text-xs text-texto-3 md:px-6">
          {origem === "google" ? "Catálogo completo do Google Fonts." : "Lista com as fontes mais usadas do Google Fonts."} As fontes carregam direto do Google Fonts.
        </p>
      </div>
    </section>
  )
}

function Controle({ rotulo, valor, children }: { rotulo: string; valor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between text-xs font-medium text-texto-2">
        {rotulo}
        <span className="font-normal text-texto-3 tabular-nums">{valor}</span>
      </span>
      <div className="flex h-9 items-center">{children}</div>
    </div>
  )
}
