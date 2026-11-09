"use client"

import Link from "next/link"
import type { Route } from "next"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  Copy,
  FileText,
  MessageCircle,
  MessagesSquare,
  PanelRightClose,
  PanelRightOpen,
  Pencil,
  Plus,
  SkipForward,
  Sparkle,
  Trash2,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Botao } from "@/components/hattie/Botao"
import { Composer } from "@/components/hattie/Composer"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { MenuAcoes } from "@/components/hattie/MenuAcoes"
import { notificar } from "@/components/hattie/Notificacao"
import { SeloSom } from "@/components/hattie/SeloSom"
import { cn } from "@/lib/utils"
import { CONVERSAS, PASSOS_PLANO, type Mensagem, type StatusPasso } from "@/lib/mock"
import { useEstado } from "./Estado"
import { Canvas, CabecalhoCanvas, ColunaLateral } from "./Layout"
import { useMarca } from "./MarcaContexto"

const OUTRAS: Record<string, Mensagem[]> = {
  "legenda-pequi": [
    { id: "o1", autor: "pessoa", texto: "Hattie, deixa a legenda do óleo de pequi mais curta?" },
    { id: "o2", autor: "hattie", texto: "Claro, Bia. Tirei a segunda frase e deixei o ingrediente na frente: “Óleo de pequi do cerrado. Hidrata sem pesar.”" },
  ],
  "black-friday": [
    { id: "o3", autor: "pessoa", texto: "Posso usar vermelho na Black Friday?" },
    { id: "o4", autor: "hattie", texto: "Prefiro a argila com o cacau, Bia. Elas chamam atenção e continuam com a cara da Raiz Natural." },
  ],
}

function MensagemHattie({ mensagem }: { mensagem: Mensagem }) {
  return (
    <article className="group/msg flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <IconeHattie nome="hattie" tamanho={32} label="Hattie" className="text-preto" />
        <MenuAcoes
          rotulo="Ações da mensagem"
          className="opacity-0 group-hover/msg:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 pointer-coarse:opacity-100"
          itens={[
            {
              rotulo: "Copiar texto",
              icone: Copy,
              onSelect: () => {
                navigator.clipboard?.writeText(mensagem.texto)
                notificar({ titulo: "copiado", texto: "O texto está na sua área de transferência." })
              },
            },
          ]}
        />
      </div>
      <p className="max-w-[68ch] text-[15px] leading-relaxed">{mensagem.texto}</p>
    </article>
  )
}

function MensagemPessoa({ mensagem }: { mensagem: Mensagem }) {
  return (
    <div className="flex flex-col items-end gap-2">
      <p className="max-w-[85%] rounded-[20px] rounded-br-md bg-preto px-4 py-2.5 text-[15px] leading-relaxed text-lima md:max-w-[70%]">
        <span className="sr-only">Você: </span>
        {mensagem.texto}
      </p>
      {mensagem.anexos && mensagem.anexos.length > 0 && (
        <ul className="flex flex-wrap justify-end gap-2" aria-label="Materiais enviados">
          {mensagem.anexos.map((anexo) => (
            <li key={anexo} className="flex h-8 items-center gap-2 rounded-full bg-branco px-3 text-xs">
              <FileText className="size-4" strokeWidth={2} aria-hidden />
              {anexo}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Digitando() {
  return (
    <div className="flex items-center gap-3">
      <IconeHattie nome="hattie" tamanho={32} className="text-preto" />
      <SeloSom som="hmm…" fixo className="motion-safe:animate-pulse" />
      <span className="sr-only">O Hattie está pensando</span>
    </div>
  )
}

function IconeStatus({ status }: { status: StatusPasso }) {
  if (status === "respondido")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-lima text-preto">
        <Check className="size-3" strokeWidth={3} aria-hidden />
      </span>
    )
  if (status === "atual")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink">
        <span className="size-1.5 rounded-full bg-ink" />
      </span>
    )
  if (status === "pulado")
    return (
      <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-dashed border-cinza-medio">
        <IconeHattie nome="hattie" tamanho={10} className="text-ink-soft" />
      </span>
    )
  return <span className="size-5 shrink-0 rounded-full border-2 border-cinza" />
}

const ROTULO_STATUS: Record<StatusPasso, string> = {
  respondido: "respondido",
  atual: "em conversa agora",
  pendente: "falta conversar",
  pulado: "o Hattie decide",
}

function Plano({ aoFechar }: { aoFechar?: () => void }) {
  const router = useRouter()
  const marca = useMarca()
  const { passos, etapa, digitando, pularPasso, irParaPasso, concluirCriacao } = useEstado()
  const resolvidos = PASSOS_PLANO.filter((passo) => passos[passo.id] === "respondido" || passos[passo.id] === "pulado").length
  const faltam = PASSOS_PLANO.length - resolvidos
  const rascunho = etapa === "rascunho"

  const grupos = [
    { titulo: "Base de toda marca", itens: PASSOS_PLANO.filter((passo) => passo.tipo === "base") },
    { titulo: "Para a sua marca", itens: PASSOS_PLANO.filter((passo) => passo.tipo === "adicional") },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink-soft">Os pontos que toda marca precisa, mais os que fazem sentido para a sua.</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium tabular-nums">
            {resolvidos} de {PASSOS_PLANO.length} pontos
          </span>
        </div>
        <Progress value={(resolvidos / PASSOS_PLANO.length) * 100} aria-label="Progresso do plano" className="h-1.5" />
      </div>

      <div className="relative -mx-2 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2">
        {grupos.map((grupo) => (
          <section key={grupo.titulo} className="flex flex-col gap-1">
            <h3 className="flex items-center gap-2 px-3 pb-1 text-sm font-medium text-ink-soft">
              {grupo.titulo === "Para a sua marca" && <Sparkle className="size-3.5" strokeWidth={2} aria-hidden />}
              {grupo.titulo}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {grupo.itens.map((passo) => {
                const status = passos[passo.id]
                return (
                  <li
                    key={passo.id}
                    className={cn("group/passo flex min-h-10 items-center gap-2.5 rounded-xl ps-2.5 pe-1 text-sm", status === "atual" && "bg-ink/6")}
                  >
                    <IconeStatus status={status} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className={cn("truncate", status === "atual" ? "font-semibold" : status === "pendente" ? "text-ink-soft" : "")}>
                        {passo.titulo}
                      </span>
                      <span className={cn("text-xs text-ink-soft", status === "respondido" && "sr-only")}>{ROTULO_STATUS[status]}</span>
                    </span>
                    {rascunho && !digitando && status !== "atual" && (
                      <MenuAcoes
                        rotulo={`Opções de ${passo.titulo}`}
                        className="opacity-60 group-hover/passo:opacity-100 focus-visible:opacity-100"
                        itens={[
                          { rotulo: "Conversar sobre este ponto", icone: MessageCircle, onSelect: () => irParaPasso(passo.id) },
                          ...(status !== "pulado"
                            ? [{ rotulo: "Pular, o Hattie decide", icone: SkipForward, onSelect: () => pularPasso(passo.id) }]
                            : []),
                        ]}
                      />
                    )}
                    {rascunho && status === "atual" && (
                      <Botao variante="fantasma" tamanho="sm" className="px-3 text-sm" disabled={digitando} onClick={() => pularPasso(passo.id)}>
                        Pular
                      </Botao>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-cinza pt-4">
        {rascunho ? (
          <>
            {faltam > 0 && (
              <p className="text-sm text-ink-soft">
                {faltam === 1 ? "O ponto que falta" : `Os ${faltam} pontos que faltam`} eu decido com base no que você já me contou. Você revisa tudo depois.
              </p>
            )}
            <Botao
              variante="primario"
              className="w-full"
              onClick={() => {
                concluirCriacao()
                aoFechar?.()
                router.push(`/marca/${marca.slug}/criando` as Route)
              }}
            >
              Criar minha marca
            </Botao>
          </>
        ) : (
          <Botao variante="secundario" className="w-full" asChild>
            <Link href={`/marca/${marca.slug}/cerebro` as Route}>Ver a marca</Link>
          </Botao>
        )}
      </div>
    </div>
  )
}

function ListaConversas({ atual, aoNavegar }: { atual: string; aoNavegar?: () => void }) {
  const marca = useMarca()
  const { nomeMarca, etapa } = useEstado()
  return (
    <ul className="flex flex-col gap-1">
      {CONVERSAS.map((conversa) => {
        const titulo = conversa.id === "criacao" && etapa === "rascunho" ? nomeMarca : conversa.titulo
        const ativa = conversa.id === atual
        return (
          <li key={conversa.id} className={cn("group/conversa flex items-center rounded-full pe-1", ativa ? "bg-lima-suave" : "hover:bg-ink/6")}>
            <Link
              href={`/marca/${marca.slug}/hattie/${conversa.id}` as Route}
              onClick={aoNavegar}
              aria-current={ativa ? "page" : undefined}
              className="flex h-9 min-w-0 flex-1 flex-col justify-center ps-3 text-sm"
            >
              <span className={cn("truncate", ativa && "font-medium")}>{titulo}</span>
            </Link>
            <MenuAcoes
              rotulo={`Opções de ${titulo}`}
              className={cn("size-8", !ativa && "opacity-0 group-hover/conversa:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100")}
              itens={[
                { rotulo: "Renomear", icone: Pencil, emBreve: true },
                { rotulo: "Apagar conversa", icone: Trash2, emBreve: true, separarAntes: true },
              ]}
            />
          </li>
        )
      })}
    </ul>
  )
}

export function ChatHattie({ conversaId }: { conversaId: string }) {
  const marca = useMarca()
  const estado = useEstado()
  const fim = useRef<HTMLDivElement>(null)
  const [planoAberto, setPlanoAberto] = useState(true)
  const [planoCelular, setPlanoCelular] = useState(false)
  const [conversasCelular, setConversasCelular] = useState(false)
  const [locais, setLocais] = useState<Mensagem[]>([])

  const criacao = conversaId === "criacao"
  const nova = conversaId === "nova"
  const mensagens = criacao ? estado.mensagens : [...(OUTRAS[conversaId] ?? []), ...locais]
  const titulo = criacao ? (estado.etapa === "rascunho" ? estado.nomeMarca : "Marca da Bia") : nova ? "Nova conversa" : CONVERSAS.find((c) => c.id === conversaId)?.titulo ?? "Conversa"
  const passoAtual = PASSOS_PLANO.find((passo) => estado.passos[passo.id] === "atual")
  const ultima = mensagens.at(-1)
  const mostrarSugestoes = criacao && estado.etapa === "rascunho" && passoAtual && ultima?.autor === "hattie" && !estado.digitando

  useEffect(() => {
    fim.current?.scrollIntoView({ block: "end" })
  }, [mensagens.length, estado.digitando])

  function enviar(texto: string, anexos: string[]) {
    if (criacao) {
      estado.responder(texto || "Seguem os materiais.")
      return
    }
    setLocais((atual) => [
      ...atual,
      { id: `l${atual.length}`, autor: "pessoa", texto: texto || "Seguem os materiais.", anexos },
      { id: `l${atual.length + 1}`, autor: "hattie", texto: "Anotado, Bia. Nesta versão de teste eu ainda não respondo de verdade, mas é aqui que a nossa conversa acontece." },
    ])
  }

  const botaoPlano = criacao && (
    <>
      <Sheet open={planoCelular} onOpenChange={setPlanoCelular}>
        <SheetTrigger asChild>
          <Botao variante="secundario" tamanho="sm" className="xl:hidden">
            Plano
          </Botao>
        </SheetTrigger>
        <SheetContent side="right" className="w-full gap-0 bg-background p-6 data-[side=right]:sm:max-w-sm">
          <SheetTitle className="font-heading text-[21px] font-medium lowercase">plano</SheetTitle>
          <SheetDescription className="sr-only">Pontos da criação da marca</SheetDescription>
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <Plano aoFechar={() => setPlanoCelular(false)} />
          </div>
        </SheetContent>
      </Sheet>
      {!planoAberto && (
        <Botao variante="fantasma" tamanho="icone" aria-label="Mostrar plano" className="hidden xl:inline-flex" onClick={() => setPlanoAberto(true)}>
          <PanelRightOpen />
        </Botao>
      )}
    </>
  )

  return (
    <>
      <ColunaLateral
        titulo="conversas"
        className="hidden lg:flex"
        acao={
          <Botao variante="fantasma" tamanho="icone" aria-label="Nova conversa" asChild>
            <Link href={`/marca/${marca.slug}/hattie/nova` as Route}>
              <Plus />
            </Link>
          </Botao>
        }
      >
        <ListaConversas atual={conversaId} />
      </ColunaLateral>

      <Canvas rotulo="Conversa">
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6 md:pt-5">
          <CabecalhoCanvas
            titulo={titulo}
            acoes={
              <>
                <Sheet open={conversasCelular} onOpenChange={setConversasCelular}>
                  <SheetTrigger asChild>
                    <Botao variante="fantasma" tamanho="icone" aria-label="Conversas" className="lg:hidden">
                      <MessagesSquare />
                    </Botao>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full gap-0 bg-background p-6 data-[side=left]:sm:max-w-sm">
                    <SheetTitle className="font-heading text-[21px] font-medium lowercase">conversas</SheetTitle>
                    <SheetDescription className="sr-only">Suas conversas com o Hattie</SheetDescription>
                    <div className="mt-4">
                      <ListaConversas atual={conversaId} aoNavegar={() => setConversasCelular(false)} />
                    </div>
                  </SheetContent>
                </Sheet>
                {botaoPlano}
                <MenuAcoes
                  rotulo="Opções da conversa"
                  itens={[
                    { rotulo: "Renomear", icone: Pencil, emBreve: true },
                    { rotulo: "Apagar conversa", icone: Trash2, emBreve: true, separarAntes: true },
                  ]}
                />
              </>
            }
          />

          <div role="log" aria-label={`Conversa: ${titulo}`} aria-live="polite" className="relative -mx-4 min-h-0 flex-1 overflow-y-auto px-4 md:-mx-6 md:px-6">
            <div className="mx-auto flex max-w-2xl flex-col gap-6 py-6">
              {nova && mensagens.length === 0 && (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <IconeHattie nome="hattie" tamanho={64} className="text-preto" />
                  <p className="font-heading text-[21px] leading-tight font-medium lowercase">sobre o que vamos conversar?</p>
                  <p className="max-w-sm text-sm text-ink-soft">Eu já conheço a {estado.nomeMarca}. Pode pedir uma legenda, uma ideia de post ou uma opinião sincera.</p>
                </div>
              )}
              {mensagens.map((mensagem) =>
                mensagem.autor === "hattie" ? (
                  <MensagemHattie key={mensagem.id} mensagem={mensagem} />
                ) : (
                  <MensagemPessoa key={mensagem.id} mensagem={mensagem} />
                ),
              )}
              {criacao && estado.digitando && <Digitando />}
              {mostrarSugestoes && passoAtual && (
                <div role="group" className="flex flex-wrap gap-2" aria-label="Respostas rápidas">
                  {passoAtual.sugestoes.map((sugestao) => (
                    <button
                      key={sugestao}
                      type="button"
                      onClick={() => estado.responder(sugestao)}
                      className="h-8 rounded-full bg-branco px-3 text-[13px] transition-[background-color,scale] duration-150 hover:bg-lima-suave active:scale-[.96] motion-reduce:active:scale-100"
                    >
                      {sugestao}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => estado.pularPasso(passoAtual.id)}
                    className="flex h-8 items-center gap-1.5 rounded-full border border-dashed border-ink/40 px-3 text-[13px] text-ink-soft transition-[background-color,color] duration-150 hover:bg-ink/6 hover:text-ink"
                  >
                    <SkipForward className="size-4" strokeWidth={2} aria-hidden />
                    Pular, você decide
                  </button>
                </div>
              )}
              <div ref={fim} />
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl pt-1 pb-4 md:pb-5">
            <Composer
              tamanho="compacto"
              rotulo="Mensagem para o Hattie"
              placeholder={criacao && estado.etapa === "rascunho" ? "Responde do seu jeito, ou manda materiais" : "Pede pro Hattie"}
              onEnviar={enviar}
              desabilitado={criacao && estado.digitando}
            />
          </div>
        </div>
      </Canvas>

      {criacao && planoAberto && (
        <ColunaLateral
          titulo="plano"
          className="hidden xl:flex"
          acao={
            <Botao variante="fantasma" tamanho="icone" aria-label="Esconder plano" onClick={() => setPlanoAberto(false)}>
              <PanelRightClose />
            </Botao>
          }
        >
          <Plano />
        </ColunaLateral>
      )}
    </>
  )
}
