"use client"

import { useState, type FormEvent } from "react"
import { ArrowDownRight, ArrowUpRight, Eye, Lightbulb, MessageCircle, Plus, RefreshCw, Sparkles, TrendingUp, type LucideIcon } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { Minilinha } from "@/components/hattie/Minilinha"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { Concorrente, Indicador, InsightMercado, PainelMercado, Referencia, Secao, TipoConcorrente } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { useEstado } from "./Estado"

type Props = { secao: Secao; aoEditar: () => void }

/**
 * Mercado e concorrentes, em três blocos:
 * 1. Referências: marcas que inspiram, citadas no briefing ou sugeridas pelo Hattie, e o que levar de cada uma.
 * 2. Concorrentes: diretos e indiretos, cada grupo com a leitura do Hattie no topo.
 * 3. Mercado esta semana: painel simples que o Hattie atualiza toda segunda, com indicadores e insights.
 */
export function SecaoMercado({ secao, aoEditar }: Props) {
  const { referenciasNovas, concorrentesNovos } = useEstado()
  const [novaReferencia, setNovaReferencia] = useState(false)
  const [novoConcorrente, setNovoConcorrente] = useState(false)
  if (secao.conteudo.tipo !== "mercado") return null
  const { leituras, painel } = secao.conteudo
  const referencias = [...secao.conteudo.referencias, ...referenciasNovas]
  const concorrentes = [...secao.conteudo.concorrentes, ...concorrentesNovos]

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-referencias" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-referencias" titulo="referências" quantidade={referencias.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={() => setNovaReferencia(true)}>
            <Plus /> Adicionar<span className="max-sm:sr-only"> referência</span>
          </Botao>
        </CabecalhoBloco>
        <ul className="grid grid-cols-1 gap-3 @3xl:grid-cols-3">
          {referencias.map((referencia) => (
            <li key={referencia.id} className="flex min-w-0">
              <CartaoReferencia referencia={referencia} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-concorrentes" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-concorrentes" titulo="concorrentes" quantidade={concorrentes.length}>
          <Botao variante="secundario" tamanho="sm" onClick={() => setNovoConcorrente(true)}>
            <Plus /> Adicionar<span className="max-sm:sr-only"> concorrente</span>
          </Botao>
        </CabecalhoBloco>
        {(["direto", "indireto"] as const).map((tipo) => (
          <GrupoConcorrentes
            key={tipo}
            tipo={tipo}
            leitura={leituras[tipo]}
            concorrentes={concorrentes.filter((concorrente) => concorrente.tipo === tipo)}
            aoCompletar={aoEditar}
          />
        ))}
      </section>

      <Painel painel={painel} />

      <FormReferencia aberta={novaReferencia} aoMudar={setNovaReferencia} />
      <FormConcorrente aberta={novoConcorrente} aoMudar={setNovoConcorrente} />
    </div>
  )
}

function CartaoReferencia({ referencia }: { referencia: Referencia }) {
  return (
    <article aria-labelledby={`referencia-${referencia.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
      <header className="flex items-center gap-3">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-preenchimento font-heading text-base font-semibold">
          {referencia.nome[0]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 id={`referencia-${referencia.id}`} className="text-base font-semibold">
            {referencia.nome}
          </h3>
          <p className="text-xs text-texto-2">{referencia.segmento}</p>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-1">
        <h4 className="text-xs font-semibold text-texto-2">O que levar</h4>
        <p className="text-sm">{referencia.levar || "Eu completo o que vale levar dessa marca para a sua."}</p>
      </div>
      <footer className="border-t border-borda-sutil pt-3 text-xs text-texto-3">
        {referencia.origem === "briefing" ? "Você citou no briefing" : "Sugerida pelo Hattie"}
      </footer>
    </article>
  )
}

const ROTULO_TIPO: Record<TipoConcorrente, { titulo: string; explica: string }> = {
  direto: { titulo: "Diretos", explica: "Vendem o mesmo para a mesma pessoa" },
  indireto: { titulo: "Indiretos", explica: "Resolvem a mesma vontade de outro jeito" },
}

function GrupoConcorrentes({
  tipo,
  leitura,
  concorrentes,
  aoCompletar,
}: {
  tipo: TipoConcorrente
  leitura: string
  concorrentes: Concorrente[]
  aoCompletar: () => void
}) {
  const rotulo = ROTULO_TIPO[tipo]
  return (
    <article aria-labelledby={`grupo-${tipo}`} className="flex flex-col rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex flex-col gap-3 pb-4">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 id={`grupo-${tipo}`} className="text-base font-semibold">
            {rotulo.titulo}
          </h3>
          <span className="text-xs text-texto-3">
            {concorrentes.length} · {rotulo.explica}
          </span>
        </div>
        <p className="flex gap-2.5 rounded-2xl bg-acao-suave px-4 py-3 text-sm">
          <Lightbulb className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
          <span>
            <span className="sr-only">Leitura do Hattie: </span>
            {leitura}
          </span>
        </p>
      </header>

      <div role="table" aria-labelledby={`grupo-${tipo}`} className="flex flex-col text-sm">
        <div role="row" className="hidden grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2.5fr)_minmax(0,2.5fr)] gap-5 border-t border-borda-sutil py-2.5 text-xs text-texto-3 @4xl:grid">
          <span role="columnheader">Marca</span>
          <span role="columnheader">Preço e onde vende</span>
          <span role="columnheader">Forte em</span>
          <span role="columnheader">Brecha para você</span>
        </div>
        {concorrentes.map((concorrente) => (
          <div
            key={concorrente.id}
            role="row"
            className="grid grid-cols-1 gap-x-5 gap-y-2 border-t border-borda-sutil py-3.5 @4xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_minmax(0,2.5fr)_minmax(0,2.5fr)]"
          >
            <div role="cell" className="flex flex-col gap-0.5">
              <span className="flex flex-wrap items-center gap-2 font-semibold">
                {concorrente.nome}
                {concorrente.rascunho && <Tag tamanho="sm">rascunho</Tag>}
              </span>
              <span className="text-texto-2">{concorrente.descricao}</span>
            </div>
            <Celula rotulo="Preço e onde vende">
              <span className="tabular-nums">{concorrente.preco || "—"}</span>
              <span className="block text-texto-2">{concorrente.onde}</span>
            </Celula>
            {concorrente.rascunho ? (
              <div role="cell" className="flex items-start @4xl:col-span-2">
                <Botao variante="secundario" tamanho="sm" onClick={aoCompletar}>
                  <MessageCircle /> Analisar com o Hattie
                </Botao>
              </div>
            ) : (
              <>
                <Celula rotulo="Forte em">{concorrente.forte}</Celula>
                <Celula rotulo="Brecha para você" destaque>
                  {concorrente.brecha}
                </Celula>
              </>
            )}
          </div>
        ))}
      </div>
    </article>
  )
}

function Celula({ rotulo, destaque = false, children }: { rotulo: string; destaque?: boolean; children: React.ReactNode }) {
  return (
    <div role="cell" className="grid grid-cols-[112px_1fr] gap-3 @4xl:block">
      <span className="text-xs text-texto-3 @4xl:sr-only">{rotulo}</span>
      <span className={cn(destaque && "font-medium")}>{children}</span>
    </div>
  )
}

const INSIGHT: Record<InsightMercado["tipo"], { rotulo: string; icone: LucideIcon; fundo: string; tom: "neutra" | "sucesso" | "atencao" }> = {
  oportunidade: { rotulo: "Oportunidade", icone: Sparkles, fundo: "bg-acao", tom: "sucesso" },
  tendencia: { rotulo: "Tendência", icone: TrendingUp, fundo: "bg-info-suave", tom: "neutra" },
  atencao: { rotulo: "Atenção", icone: Eye, fundo: "bg-atencao", tom: "atencao" },
}

function Painel({ painel }: { painel: PainelMercado }) {
  const [atualizando, setAtualizando] = useState(false)

  return (
    <section aria-labelledby="titulo-painel" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-painel" titulo="mercado esta semana">
        <span className="hidden text-xs text-texto-3 sm:inline">Atualizado em {painel.atualizado}</span>
        <Botao
          variante="fantasma"
          tamanho="sm"
          disabled={atualizando}
          onClick={() => {
            setAtualizando(true)
            setTimeout(() => {
              setAtualizando(false)
              notificar({ titulo: "painel em dia", texto: "Nada mudou desde segunda. A próxima leitura sai em " + painel.proxima + ".", tipo: "sucesso" })
            }, 1200)
          }}
        >
          <RefreshCw className={cn(atualizando && "animate-spin motion-reduce:animate-none")} /> {atualizando ? "Atualizando…" : "Atualizar agora"}
        </Botao>
      </CabecalhoBloco>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 @5xl:grid-cols-4">
        {painel.indicadores.map((indicador) => (
          <li key={indicador.id} className="flex min-w-0">
            <CartaoIndicador indicador={indicador} semanas={painel.semanas} />
          </li>
        ))}
      </ul>

      <article aria-labelledby="titulo-insights" className="flex flex-col rounded-3xl bg-superficie p-5 md:p-6">
        <h3 id="titulo-insights" className="pb-1 text-base font-semibold">
          O que eu vi esta semana
        </h3>
        <ul className="flex flex-col">
          {painel.insights.map((insight) => {
            const tipo = INSIGHT[insight.tipo]
            return (
              <li key={insight.id} className="flex gap-3 border-b border-borda-sutil py-3.5 last:border-b-0 last:pb-0">
                <span aria-hidden className={cn("grid size-8 shrink-0 place-items-center rounded-full text-preto", tipo.fundo)}>
                  <tipo.icone className="size-4" strokeWidth={2} />
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-semibold">{insight.titulo}</span>
                    <Tag tamanho="sm" tom={tipo.tom}>
                      {tipo.rotulo}
                    </Tag>
                  </p>
                  <p className="text-sm text-texto-2">{insight.texto}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </article>

      <p className="text-xs text-texto-3">
        O Hattie lê buscas, preços e menções toda segunda. Próxima leitura em {painel.proxima}. Nesta versão de teste, os números são de exemplo.
      </p>
    </section>
  )
}

function CartaoIndicador({ indicador, semanas }: { indicador: Indicador; semanas: string[] }) {
  const sobe = indicador.variacao >= 0
  const Seta = sobe ? ArrowUpRight : ArrowDownRight
  const formatar = (valor: number) => (indicador.unidade === "R$" ? `R$ ${valor}` : String(valor))
  return (
    <article aria-labelledby={`indicador-${indicador.id}`} className="flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-superficie p-5">
      <h3 id={`indicador-${indicador.id}`} className="text-xs font-medium text-texto-2">
        {indicador.rotulo}
      </h3>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-titulo-2 font-semibold tabular-nums">{indicador.valor}</p>
        <p className="flex items-center gap-0.5 text-xs font-medium text-texto-2 tabular-nums">
          <Seta className="size-3.5" strokeWidth={2.25} aria-hidden />
          <span>
            {sobe ? "+" : "−"}
            {Math.abs(indicador.variacao)}%<span className="sr-only"> em 4 semanas</span>
          </span>
        </p>
      </div>
      <Minilinha rotulo={indicador.rotulo} serie={indicador.serie} periodos={semanas} formatar={formatar} />
      <p className="text-xs text-texto-3">{indicador.nota} · 8 semanas</p>
    </article>
  )
}

function focarErro(form: HTMLFormElement) {
  requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
}

function FormReferencia({ aberta, aoMudar }: { aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  const { adicionarReferencia } = useEstado()
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Qual é a marca?")
      focarErro(evento.currentTarget)
      return
    }
    adicionarReferencia({
      id: `referencia-${Date.now()}`,
      nome,
      segmento: String(dados.get("segmento") ?? "").trim() || "Segmento a definir",
      origem: "briefing",
      levar: String(dados.get("levar") ?? "").trim(),
      rascunho: true,
    })
    setErro("")
    aoMudar(false)
    notificar({ titulo: "referência anotada", texto: `Vou olhar a ${nome} e trazer o que vale levar para a sua marca.`, tipo: "sucesso" })
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      titulo="nova referência"
      descricao="Uma marca que você admira, de qualquer área."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-referencia">
          <Plus /> Adicionar referência
        </Botao>
      }
    >
      <form id="form-referencia" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <Campo name="nome" rotulo="Marca" placeholder="Ex.: Aesop" erro={erro} autoFocus />
        <Campo name="segmento" rotulo="Área" placeholder="Ex.: Moda, café, papelaria" />
        <CampoArea name="levar" rotulo="O que você admira nela" placeholder="O jeito de fotografar, o tom das mensagens, a embalagem" dica="Opcional" />
      </form>
    </Janela>
  )
}

function FormConcorrente({ aberta, aoMudar }: { aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  const { adicionarConcorrente } = useEstado()
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Qual é o concorrente?")
      focarErro(evento.currentTarget)
      return
    }
    adicionarConcorrente({
      id: `concorrente-${Date.now()}`,
      nome,
      tipo: String(dados.get("tipo")) === "indireto" ? "indireto" : "direto",
      descricao: String(dados.get("descricao") ?? "").trim(),
      preco: String(dados.get("preco") ?? "").trim(),
      onde: String(dados.get("onde") ?? "").trim(),
      forte: "",
      brecha: "",
      rascunho: true,
    })
    setErro("")
    aoMudar(false)
    notificar({ titulo: "concorrente anotado", texto: `Eu analiso a ${nome} e aponto o ponto forte e a brecha para você.`, tipo: "sucesso" })
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      largura="lg"
      titulo="novo concorrente"
      descricao="Com o básico, eu analiso o ponto forte e a brecha para a sua marca."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-concorrente">
          <Plus /> Adicionar concorrente
        </Botao>
      }
    >
      <form id="form-concorrente" onSubmit={enviar} className="grid gap-4 sm:grid-cols-2" noValidate>
        <Campo name="nome" rotulo="Nome" placeholder="Ex.: Ateliê da Serra" erro={erro} autoFocus />
        <CampoLista
          name="tipo"
          rotulo="Tipo"
          opcoes={[
            { valor: "direto", rotulo: "Direto: vende o mesmo" },
            { valor: "indireto", rotulo: "Indireto: outra solução" },
          ]}
        />
        <Campo name="preco" rotulo="Faixa de preço" placeholder="Ex.: R$ 40 a 80" />
        <Campo name="onde" rotulo="Onde vende" placeholder="Ex.: Instagram e feiras" />
        <CampoArea name="descricao" rotulo="O que vende" placeholder="Produtos, estilo, para quem" dica="Opcional" className="sm:col-span-2" />
      </form>
    </Janela>
  )
}
