"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Route } from "next"
import { Botao } from "@/components/hattie/Botao"
import { CampoArea, CampoLista } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { dataCurta, somarDias, type PedidoCalendario } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { CANAIS, DATAS_COMEMORATIVAS, type CanalPost } from "@/lib/mock"
import { useMarca } from "../MarcaContexto"
import { useMarketing } from "./EstadoMarketing"

/*
 * Pedido de calendário ao Hattie. A Bia escolhe o período, o objetivo, os canais e o ritmo;
 * o Hattie já sugere tudo a partir dos números da marca, então o caminho mais curto é só apertar o plimm.
 * As ideias voltam marcadas como "nova" no calendário, esperando o ok.
 */

const PERIODOS = [
  { valor: "resto-novembro", rotulo: "O resto de novembro" },
  { valor: "dezembro", rotulo: "Dezembro inteiro" },
  { valor: "proximas-4", rotulo: "As próximas 4 semanas" },
]

const OBJETIVOS: { valor: PedidoCalendario["objetivo"]; rotulo: string }[] = [
  { valor: "natal", rotulo: "Vender os kits de Natal" },
  { valor: "lancamento", rotulo: "Lançar o óleo de pequi" },
  { valor: "seguidores", rotulo: "Ganhar seguidores" },
  { valor: "lojistas", rotulo: "Atrair lojistas" },
]

const CANAIS_PEDIDO: CanalPost[] = ["feed", "carrossel", "story", "reels", "email", "whatsapp"]

function periodoDe(valor: string, hoje: string) {
  if (valor === "dezembro") return { inicio: "2026-12-01", fim: "2026-12-31" }
  if (valor === "proximas-4") return { inicio: somarDias(hoje, 1), fim: somarDias(hoje, 28) }
  return { inicio: somarDias(hoje, 1), fim: "2026-11-30" }
}

export function GerarCalendario() {
  const { gerador, fecharGerador } = useMarketing()
  return (
    <Janela aberta={!!gerador} aoMudar={(aberta) => !aberta && fecharGerador()} titulo="calendário com o Hattie" descricao="Eu monto as ideias; você aprova, muda ou descarta." largura="lg">
      {gerador && <Formulario observacaoInicial={gerador.observacao} porSemanaInicial={gerador.porSemana} />}
    </Janela>
  )
}

function Formulario({ observacaoInicial, porSemanaInicial = 3 }: { observacaoInicial: string; porSemanaInicial?: number }) {
  const marca = useMarca()
  const router = useRouter()
  const caminho = usePathname()
  const { hoje, gerarCalendario, fecharGerador, setMes } = useMarketing()
  const [periodo, setPeriodo] = useState(observacaoInicial && porSemanaInicial === 3 ? "proximas-4" : "dezembro")
  const [objetivo, setObjetivo] = useState<PedidoCalendario["objetivo"]>("natal")
  const [canais, setCanais] = useState<CanalPost[]>(["feed", "carrossel", "story"])
  const [porSemana, setPorSemana] = useState(porSemanaInicial)
  const [comemorativas, setComemorativas] = useState(true)
  const [observacao, setObservacao] = useState(observacaoInicial)
  const [montando, setMontando] = useState(false)

  const { inicio, fim } = periodoDe(periodo, hoje)
  const datas = DATAS_COMEMORATIVAS.filter((data) => data.data >= inicio && data.data <= fim)
  const semanas = Math.max(1, Math.round((new Date(`${fim}T12:00`).getTime() - new Date(`${inicio}T12:00`).getTime()) / (7 * 86_400_000)))
  const estimativa = semanas * porSemana + (comemorativas ? datas.length : 0)

  const alternar = (canal: CanalPost) => setCanais((atual) => (atual.includes(canal) ? atual.filter((item) => item !== canal) : [...atual, canal]))

  const montar = () => {
    if (canais.length === 0) return
    setMontando(true)
    // O tempo de "pensar" deixa claro que o Hattie está trabalhando; a regra roda na hora.
    setTimeout(() => {
      const criadas = gerarCalendario({ inicio, fim, objetivo, canais, porSemana, comemorativas, observacao })
      setMontando(false)
      fecharGerador()
      setMes(inicio.slice(0, 7))
      if (!caminho.endsWith("/calendario")) router.push(`/marca/${marca.slug}/marketing/calendario` as Route)
      notificar(
        criadas > 0
          ? { titulo: "calendário montado", texto: `Montei ${criadas} ${criadas === 1 ? "ideia" : "ideias"} entre ${dataCurta(inicio)} e ${dataCurta(fim)}. Estão marcadas no calendário, esperando o seu ok.`, som: "plimm" }
          : { titulo: "sem espaço livre", texto: "Todos os dias bons desse período já têm post. Escolha outro período ou menos posts por semana." },
      )
    }, 1200)
  }

  return (
    <form
      id="form-gerar"
      className="flex flex-col gap-5"
      onSubmit={(evento) => {
        evento.preventDefault()
        montar()
      }}
    >
      <p className="flex gap-2.5 rounded-2xl bg-acao-suave px-3.5 py-3 text-xs leading-relaxed">
        <IconeHattie nome="hattie" tamanho={18} className="shrink-0" />
        <span>
          Já deixei escolhido o que funciona melhor para a Raiz Natural: terça e quinta às 19h, sábado às 10h, e as mensagens-chave da estratégia. Se estiver bom, é só apertar o plimm.
        </span>
      </p>

      <div className="grid gap-4 @container sm:grid-cols-2">
        <CampoLista rotulo="Período" value={periodo} onChange={(evento) => setPeriodo(evento.target.value)} opcoes={PERIODOS} dica={`${dataCurta(inicio)} a ${dataCurta(fim)}`} />
        <CampoLista rotulo="Objetivo" value={objetivo} onChange={(evento) => setObjetivo(evento.target.value as PedidoCalendario["objetivo"])} opcoes={OBJETIVOS} dica="Muda os temas dos posts." />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-detalhe font-medium text-texto-2">Onde postar</legend>
        <div className="flex flex-wrap gap-2">
          {CANAIS_PEDIDO.map((canal) => {
            const ligado = canais.includes(canal)
            return (
              <button
                key={canal}
                type="button"
                aria-pressed={ligado}
                onClick={() => alternar(canal)}
                className={cn("flex h-9 items-center rounded-full px-3.5 text-detalhe font-medium transition-[background-color,color] duration-150 pointer-coarse:h-11", ligado ? "bg-preto text-lima" : "bg-preenchimento text-texto-2 hover:bg-preenchimento-hover hover:text-texto")}
              >
                {CANAIS[canal].curto}
              </button>
            )
          })}
        </div>
        {canais.length === 0 && (
          <p role="alert" className="text-detalhe font-medium text-erro-texto">
            Escolha pelo menos um lugar para postar.
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-detalhe font-medium text-texto-2">Posts por semana</legend>
        <div className="flex gap-1 self-start rounded-full bg-preenchimento p-1">
          {[2, 3, 4, 5].map((quantidade) => (
            <button
              key={quantidade}
              type="button"
              aria-pressed={porSemana === quantidade}
              onClick={() => setPorSemana(quantidade)}
              className={cn("h-8 min-w-11 rounded-full px-3 text-sm font-medium tabular-nums transition-[background-color,color] duration-150", porSemana === quantidade ? "bg-superficie text-texto shadow-(--sombra-flutuante)" : "text-texto-2 hover:text-texto")}
            >
              {quantidade}
            </button>
          ))}
        </div>
        <p className="text-detalhe text-texto-3">Hoje a marca posta 3,5 por semana. A Botica do Cerrado posta 5.</p>
      </fieldset>

      {datas.length > 0 && (
        <label className="flex items-start gap-3 rounded-2xl bg-preenchimento px-3.5 py-3">
          <input type="checkbox" checked={comemorativas} onChange={(evento) => setComemorativas(evento.target.checked)} className="mt-0.5 size-4 accent-(--preto)" />
          <span className="flex flex-col gap-0.5 text-sm">
            <span className="font-medium">Incluir as datas comemorativas</span>
            <span className="text-xs text-texto-2">{datas.map((data) => `${data.nome} (${dataCurta(data.data)})`).join(", ")}</span>
          </span>
        </label>
      )}

      <CampoArea
        rotulo="Algo mais? (opcional)"
        compacto
        value={observacao}
        onChange={(evento) => setObservacao(evento.target.value)}
        placeholder="Ex.: falar do cartão escrito à mão, evitar promoção agressiva"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borda-sutil pt-4">
        <p className="text-xs text-texto-2">
          Cerca de <span className="font-semibold text-texto tabular-nums">{estimativa}</span> ideias. Os dias que já têm post ficam como estão.
        </p>
        <div className="ms-auto flex items-center gap-2">
          <Botao type="button" variante="fantasma" onClick={fecharGerador}>
            Cancelar
          </Botao>
          <Plimm type="submit" rotulo={montando ? "montando…" : "montar calendário"} carregando={montando} disabled={canais.length === 0} />
        </div>
      </div>
      <span className="sr-only" aria-live="polite">
        {montando ? "O Hattie está montando o calendário" : ""}
      </span>
    </form>
  )
}
