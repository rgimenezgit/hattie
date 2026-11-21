"use client"

import { useState } from "react"
import { Copy, MessageCircleReply, Plus, Send, X } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { Tag } from "@/components/hattie/Tag"
import { diasEntre, formatar, haDias } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { ETAPAS_LEAD, ORIGENS_LEAD, TIPOS_LEAD, type EtapaLead, type Lead, type OrigemLead, type TipoLead } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarketing } from "./EstadoMarketing"
import { CabecalhoMarketing, SemDados } from "./ShellMarketing"

/**
 * Leads: quem chegou pelo Instagram, WhatsApp, site, feira ou indicação, por etapa.
 * O topo avisa quem espera resposta; cada lead abre num painel com a conversa,
 * a resposta sugerida pelo Hattie (editável) e a troca de etapa.
 */

type Filtro = "todos" | TipoLead

const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "lojista", rotulo: "Lojistas" },
  { valor: "empresa", rotulo: "Empresas" },
  { valor: "cliente", rotulo: "Clientes finais" },
]

const emAberto = (lead: Lead) => lead.etapa !== "cliente" && lead.etapa !== "perdido"
const esperaVoce = (lead: Lead) => lead.aguardando === "voce" && emAberto(lead)

export function Leads() {
  const { hoje, leads } = useMarketing()
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const [aberto, setAberto] = useState<string | null>(null)
  const [novo, setNovo] = useState(false)
  if (leads.length === 0) return <SemDados titulo="leads" />

  const lista = leads.filter((lead) => filtro === "todos" || lead.tipo === filtro)
  const esperando = leads.filter(esperaVoce).sort((a, b) => a.ultimoContato.localeCompare(b.ultimoContato))
  const abertos = leads.filter(emAberto)
  const negociacao = abertos.reduce((soma, lead) => soma + (lead.valor ?? 0), 0)
  const fechados = leads.filter((lead) => lead.etapa === "cliente")
  const origens = Object.entries(leads.reduce<Record<string, number>>((conta, lead) => ({ ...conta, [lead.origem]: (conta[lead.origem] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1])
  const maisAntigo = esperando[0]

  return (
    <Canvas rotulo="Leads">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <CabecalhoMarketing
            titulo="leads"
            detalhe={`${abertos.length} em aberto`}
            acoes={
              <Botao variante="secundario" tamanho="sm" onClick={() => setNovo(true)}>
                <Plus /> Anotar lead
              </Botao>
            }
          />

          {maisAntigo && (
            <section aria-labelledby="titulo-esperando" className="flex flex-col gap-3 rounded-3xl bg-preto p-4 text-branco @2xl:flex-row @2xl:items-center md:px-5">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <h2 id="titulo-esperando" className="text-sm font-semibold">
                  {esperando.length === 1 ? "1 pessoa espera" : `${esperando.length} pessoas esperam`} a sua resposta
                </h2>
                <p className="text-xs text-cinza">
                  {maisAntigo.nome} está esperando {haDias(maisAntigo.ultimoContato, hoje)}. Já deixei {esperando.filter((lead) => lead.sugestao).length === esperando.length ? "uma resposta pronta para cada uma" : "respostas prontas"}.
                </p>
              </div>
              <Botao variante="secundario" tamanho="sm" className="self-start bg-branco/10 text-branco hover:bg-branco/20 @2xl:self-center" onClick={() => setAberto(maisAntigo.id)}>
                <MessageCircleReply /> Responder {maisAntigo.nome}
              </Botao>
            </section>
          )}

          <dl className="grid grid-cols-2 gap-3 rounded-3xl bg-superficie p-5 @3xl:grid-cols-4 md:p-6">
            {[
              ["Em aberto", String(abertos.length)],
              ["Em negociação", formatar(negociacao, "moeda")],
              ["Fecharam", String(fechados.length)],
              ["Chegam mais por", origens[0] ? ORIGENS_LEAD[origens[0][0] as OrigemLead] : "—"],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="flex min-w-0 flex-col gap-0.5">
                <dt className="text-xs text-texto-3">{rotulo}</dt>
                <dd className="truncate font-heading text-destaque font-medium tabular-nums @xl:text-titulo-3">{valor}</dd>
              </div>
            ))}
          </dl>

          <div role="group" aria-label="Filtrar por tipo" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
            {FILTROS.map((item) => {
              const quantidade = item.valor === "todos" ? leads.length : leads.filter((lead) => lead.tipo === item.valor).length
              return (
                <button
                  key={item.valor}
                  type="button"
                  aria-pressed={filtro === item.valor}
                  onClick={() => setFiltro(item.valor)}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-detalhe font-medium transition-[background-color,color] duration-150 pointer-coarse:h-10",
                    filtro === item.valor ? "bg-preto text-lima" : "bg-superficie text-texto-2 hover:text-texto",
                  )}
                >
                  {item.rotulo}
                  <span className={cn("text-xs tabular-nums", filtro === item.valor ? "text-lima/70" : "text-texto-3")}>{quantidade}</span>
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-6 @4xl:grid @4xl:grid-cols-5 @4xl:gap-2.5">
            {ETAPAS_LEAD.map((etapa) => {
              const daEtapa = lista.filter((lead) => lead.etapa === etapa.id)
              return (
                <section key={etapa.id} aria-labelledby={`etapa-lead-${etapa.id}`} className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-col px-1">
                    <h2 id={`etapa-lead-${etapa.id}`} className="flex items-baseline gap-2 text-sm font-semibold">
                      {etapa.titulo}
                      <span className="text-xs font-medium text-texto-3 tabular-nums">{daEtapa.length}</span>
                    </h2>
                    <p className="text-micro text-texto-3">{etapa.explica}</p>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {daEtapa.map((lead) => (
                      <li key={lead.id}>
                        <CartaoLead lead={lead} aoAbrir={() => setAberto(lead.id)} />
                      </li>
                    ))}
                    {daEtapa.length === 0 && <li className="rounded-2xl bg-superficie/50 px-3 py-5 text-center text-xs text-texto-3">Nada aqui agora</li>}
                  </ul>
                </section>
              )
            })}
          </div>

          <p className="px-1 text-xs text-texto-3">Os leads chegam sozinhos das mensagens do Instagram e do WhatsApp conectados. Feira e indicação você anota aqui.</p>
        </div>
      </div>

      <DetalheLead id={aberto} aoFechar={() => setAberto(null)} />
      <NovoLead aberta={novo} aoMudar={setNovo} aoCriar={(id) => setAberto(id)} />
    </Canvas>
  )
}

function CartaoLead({ lead, aoAbrir }: { lead: Lead; aoAbrir: () => void }) {
  const { hoje } = useMarketing()
  const espera = esperaVoce(lead)
  const dias = diasEntre(lead.ultimoContato, hoje)
  return (
    <article aria-labelledby={`lead-${lead.id}`} className="relative flex flex-col gap-2.5 rounded-2xl bg-superficie p-3.5 transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)">
      <div className="flex flex-col gap-1">
        <p className="flex items-center gap-1.5 text-micro text-texto-3">
          {TIPOS_LEAD[lead.tipo]} · {ORIGENS_LEAD[lead.origem]}
        </p>
        <h3 id={`lead-${lead.id}`} className="text-sm leading-snug font-semibold">
          <button type="button" onClick={aoAbrir} className="text-start after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto">
            {lead.nome}
          </button>
        </h3>
        <p className="line-clamp-2 text-xs text-texto-2">{lead.interesse}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {lead.valor ? <span className="text-xs font-semibold tabular-nums">{formatar(lead.valor, "moeda")}</span> : <span className="text-xs text-texto-3">{lead.cidade}</span>}
        {espera ? (
          <Tag tom={dias >= 2 ? "atencao" : "acao"} tamanho="sm" ponto>
            espera você {dias <= 0 ? "desde hoje" : `há ${dias} ${dias === 1 ? "dia" : "dias"}`}
          </Tag>
        ) : (
          lead.etapa === "perdido" && lead.motivo && <span className="line-clamp-1 text-micro text-texto-3">{lead.motivo}</span>
        )}
      </div>
    </article>
  )
}

function DetalheLead({ id, aoFechar }: { id: string | null; aoFechar: () => void }) {
  const { leads } = useMarketing()
  const lead = leads.find((item) => item.id === id) ?? null
  return (
    <Sheet open={!!lead} onOpenChange={(aberto) => !aberto && aoFechar()}>
      <SheetContent side="right" showCloseButton={false} className="w-full gap-0 border-0 bg-superficie p-0 data-[side=right]:w-full data-[side=right]:border-0 data-[side=right]:sm:max-w-lg sm:rounded-s-3xl">
        {lead && <ConteudoLead key={lead.id} lead={lead} aoFechar={aoFechar} />}
      </SheetContent>
    </Sheet>
  )
}

function ConteudoLead({ lead, aoFechar }: { lead: Lead; aoFechar: () => void }) {
  const { hoje, moverLead, responderLead } = useMarketing()
  const [resposta, setResposta] = useState(lead.sugestao ?? "")
  const canal = lead.origem === "whatsapp" || lead.origem === "feira" || lead.origem === "indicacao" ? "WhatsApp" : lead.origem === "site" ? "e-mail" : "Instagram"

  const enviar = () => {
    if (!resposta.trim()) return
    responderLead(lead.id, resposta.trim())
    setResposta("")
    notificar({ titulo: "resposta enviada", texto: `Mandei pelo ${canal} para ${lead.nome}. Aviso aqui quando responderem.`, som: "zuum" })
  }

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(resposta)
      notificar({ titulo: "copiado", texto: "A resposta está na sua área de transferência." })
    } catch {
      notificar({ titulo: "não deu para copiar", texto: "Selecione o texto e copie com o teclado.", tipo: "atencao" })
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-start gap-2 px-5 pt-4 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <SheetTitle className="text-base leading-snug font-semibold">{lead.nome}</SheetTitle>
          <SheetDescription className="text-xs text-texto-2">
            {[TIPOS_LEAD[lead.tipo], lead.cidade, `veio por ${ORIGENS_LEAD[lead.origem]}`].filter(Boolean).join(" · ")}
          </SheetDescription>
        </div>
        <Botao variante="fantasma" tamanho="icone" aria-label="Fechar" onClick={aoFechar}>
          <X />
        </Botao>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <dl className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5 rounded-2xl bg-preenchimento px-3 py-2.5">
            <dt className="text-micro text-texto-2">Quer</dt>
            <dd className="text-sm font-medium">{lead.interesse}</dd>
          </div>
          <div className="flex flex-col gap-0.5 rounded-2xl bg-preenchimento px-3 py-2.5">
            <dt className="text-micro text-texto-2">Valor estimado</dt>
            <dd className="text-sm font-medium tabular-nums">{lead.valor ? formatar(lead.valor, "moeda") : "Ainda sem valor"}</dd>
          </div>
        </dl>

        <CampoLista
          rotulo="Etapa"
          value={lead.etapa}
          onChange={(evento) => {
            const etapa = evento.target.value as EtapaLead
            moverLead(lead.id, etapa)
            notificar({ titulo: "etapa mudou", texto: `${lead.nome} agora está em ${ETAPAS_LEAD.find((item) => item.id === etapa)?.titulo.toLowerCase()}.`, tipo: "sucesso" })
          }}
          opcoes={ETAPAS_LEAD.map((etapa) => ({ valor: etapa.id, rotulo: etapa.titulo }))}
          dica={lead.etapa === "perdido" && lead.motivo ? `Motivo: ${lead.motivo}` : `Último contato ${haDias(lead.ultimoContato, hoje)}`}
        />

        <section aria-labelledby="titulo-conversa-lead" className="flex flex-col gap-2">
          <h3 id="titulo-conversa-lead" className="text-xs font-medium text-texto-3">
            Conversa
          </h3>
          {lead.mensagens.length === 0 && <p className="text-xs text-texto-3">Nenhuma mensagem ainda.</p>}
          <ol className="flex flex-col gap-2">
            {lead.mensagens.map((mensagem, indice) => (
              <li key={indice} className={cn("flex max-w-[88%] flex-col gap-1", mensagem.autor === "voce" ? "self-end items-end" : "self-start")}>
                <p className={cn("rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", mensagem.autor === "voce" ? "rounded-br-md bg-preto text-branco" : "rounded-bl-md bg-preenchimento")}>{mensagem.texto}</p>
                <span className="px-1 text-micro text-texto-3">
                  {mensagem.autor === "voce" ? "Você" : lead.nome} · {mensagem.quando}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {emAberto(lead) && (
        <footer className="flex flex-col gap-2 border-t border-borda-sutil px-5 py-3">
          {lead.sugestao && resposta === lead.sugestao && (
            <p className="flex items-center gap-1.5 text-xs text-texto-2">
              <IconeHattie nome="hattie" tamanho={14} /> Escrevi na voz da Raiz Natural. Mude o que quiser.
            </p>
          )}
          <CampoArea rotulo={`Responder pelo ${canal}`} compacto value={resposta} onChange={(evento) => setResposta(evento.target.value)} placeholder="Escreva a resposta" />
          <div className="flex items-center justify-end gap-2">
            {resposta && (
              <Botao variante="fantasma" tamanho="sm" onClick={copiar}>
                <Copy /> Copiar
              </Botao>
            )}
            <Plimm icone={Send} rotulo="enviar" disabled={!resposta.trim()} onClick={enviar} />
          </div>
        </footer>
      )}
    </div>
  )
}

function NovoLead({ aberta, aoMudar, aoCriar }: { aberta: boolean; aoMudar: (aberta: boolean) => void; aoCriar: (id: string) => void }) {
  const { novoLead } = useMarketing()
  const [nome, setNome] = useState("")
  const [tipo, setTipo] = useState<TipoLead>("lojista")
  const [origem, setOrigem] = useState<OrigemLead>("feira")
  const [interesse, setInteresse] = useState("")
  const [erro, setErro] = useState("")

  const salvar = () => {
    if (!nome.trim()) {
      setErro("Escreva o nome da pessoa ou da empresa.")
      return
    }
    const id = novoLead({ nome: nome.trim(), tipo, origem, interesse: interesse.trim() || "Ainda sem detalhe", aguardando: "voce" })
    aoMudar(false)
    setNome("")
    setInteresse("")
    setErro("")
    aoCriar(id)
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={aoMudar}
      titulo="anotar lead"
      descricao="Para quem chegou pela feira, por indicação ou por telefone."
      rodape={
        <>
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Cancelar
          </Botao>
          <Botao variante="primario" type="submit" form="form-lead">
            Anotar
          </Botao>
        </>
      }
    >
      <form
        id="form-lead"
        className="flex flex-col gap-4"
        onSubmit={(evento) => {
          evento.preventDefault()
          salvar()
        }}
      >
        <Campo rotulo="Nome" value={nome} onChange={(evento) => (setNome(evento.target.value), setErro(""))} erro={erro || undefined} autoComplete="off" />
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoLista rotulo="Tipo" value={tipo} onChange={(evento) => setTipo(evento.target.value as TipoLead)} opcoes={(Object.keys(TIPOS_LEAD) as TipoLead[]).map((valor) => ({ valor, rotulo: TIPOS_LEAD[valor] }))} />
          <CampoLista rotulo="Como chegou" value={origem} onChange={(evento) => setOrigem(evento.target.value as OrigemLead)} opcoes={(Object.keys(ORIGENS_LEAD) as OrigemLead[]).map((valor) => ({ valor, rotulo: ORIGENS_LEAD[valor] }))} />
        </div>
        <CampoArea rotulo="O que quer (opcional)" compacto value={interesse} onChange={(evento) => setInteresse(evento.target.value)} placeholder="Ex.: conheceu na feira e quer revender" />
      </form>
    </Janela>
  )
}
