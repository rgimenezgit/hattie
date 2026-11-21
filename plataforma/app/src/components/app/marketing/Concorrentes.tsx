"use client"

import { useState } from "react"
import { CalendarPlus, Check, Plus, Wand2 } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import { dataCurta, dataDe, formatar, haDias, somarDias } from "@/lib/marketing"
import { cn } from "@/lib/utils"
import { CANAIS, MONITOR_CONCORRENTES, NOVIDADES_CONCORRENTES, TIPOS_NOVIDADE, type MonitorConcorrente, type NovidadeConcorrente, type PostCalendario } from "@/lib/mock"
import { Canvas } from "../Layout"
import { useMarketing } from "./EstadoMarketing"
import { CabecalhoMarketing, SemDados } from "./ShellMarketing"

/**
 * Concorrentes: a leitura do Hattie, a comparação com a própria marca (sempre na tabela, para dar escala)
 * e o que cada um mudou na semana. Cada novidade vira uma ideia no calendário com um clique.
 */

/** Próximo dia bom (terça, quinta ou sábado) sem post, a partir de amanhã. */
function proximoDiaLivre(posts: PostCalendario[], hoje: string) {
  const ocupados = new Set(posts.map((post) => post.data))
  for (let deslocamento = 1; deslocamento < 60; deslocamento++) {
    const dia = somarDias(hoje, deslocamento)
    if ([2, 4, 6].includes(dataDe(dia).getDay()) && !ocupados.has(dia)) return dia
  }
  return somarDias(hoje, 1)
}

export function Concorrentes() {
  const { posts, abrirGerador } = useMarketing()
  const [adicionar, setAdicionar] = useState(false)
  if (posts.length === 0) return <SemDados titulo="concorrentes" />

  const outros = MONITOR_CONCORRENTES.filter((marca) => !marca.voce)

  return (
    <Canvas rotulo="Concorrentes">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6 md:py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <CabecalhoMarketing
            titulo="concorrentes"
            detalhe={`acompanho ${outros.length}`}
            acoes={
              <Botao variante="secundario" tamanho="sm" onClick={() => setAdicionar(true)}>
                <Plus /> Acompanhar outra marca
              </Botao>
            }
          />

          {/* Leitura do Hattie */}
          <section aria-labelledby="titulo-leitura-concorrentes" className="flex flex-col gap-4 rounded-3xl bg-superficie p-5 md:flex-row md:items-start md:gap-5 md:p-6">
            <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-acao-suave">
              <IconeHattie nome="lupa" tamanho={22} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 id="titulo-leitura-concorrentes" className="font-heading text-titulo-3 font-medium lowercase">
                  você engaja mais com menos posts
                </h2>
                <p className="max-w-prose text-sm leading-relaxed text-texto-2">
                  A Raiz Natural tem o maior engajamento do grupo, 5,8%, postando 3,5 vezes por semana. A Botica do Cerrado posta 5 vezes e ganha seguidores, mas cada post rende menos. Subir para 4 por semana em dezembro aproveita o seu ritmo sem cansar a audiência.
                </p>
              </div>
              <Botao variante="secundario" tamanho="sm" className="self-start" onClick={() => abrirGerador("Mais bastidor e origem, que é o que rende mais que os concorrentes.", 4)}>
                <Wand2 /> Montar dezembro com 4 por semana
              </Botao>
            </div>
          </section>

          <Comparativo />

          {/* O que mudou */}
          <section aria-labelledby="titulo-novidades" className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2 px-1">
              <h2 id="titulo-novidades" className="text-sm font-semibold">
                O que mudou nas últimas duas semanas
              </h2>
              <span className="text-xs text-texto-3">Atualizado toda segunda</span>
            </div>
            <ul className="grid gap-3 @3xl:grid-cols-2">
              {NOVIDADES_CONCORRENTES.map((novidade) => (
                <li key={novidade.id}>
                  <CartaoNovidade novidade={novidade} />
                </li>
              ))}
            </ul>
          </section>

          <VerMais resumo="Como eu acompanho os concorrentes">
            <ul className="flex max-w-prose flex-col gap-2.5 text-sm text-texto-2">
              <li>Olho só o que é público: perfil do Instagram, site, loja online e anúncios abertos.</li>
              <li>Toda segunda, comparo seguidores, frequência de posts, engajamento e preços, e conto aqui o que mudou.</li>
              <li>Os concorrentes vieram do mercado na estratégia. Pode acompanhar até 5 marcas.</li>
              <li>Engajamento é a soma de curtidas, comentários e salvamentos sobre o alcance estimado.</li>
            </ul>
          </VerMais>
        </div>
      </div>

      <AdicionarConcorrente aberta={adicionar} aoMudar={setAdicionar} />
    </Canvas>
  )
}

/** Tabela no desktop, cartões no celular. A própria marca sempre aparece, para dar escala. */
function Comparativo() {
  const maiorPosts = Math.max(...MONITOR_CONCORRENTES.map((marca) => marca.postsSemana))
  const maiorEngajamento = Math.max(...MONITOR_CONCORRENTES.map((marca) => marca.engajamento))
  return (
    <section aria-labelledby="titulo-comparativo" className="flex flex-col gap-3">
      <h2 id="titulo-comparativo" className="px-1 text-sm font-semibold">
        Lado a lado, nos últimos 30 dias
      </h2>

      <div className="hidden overflow-hidden rounded-3xl bg-superficie @3xl:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-texto-3">
              <th scope="col" className="px-5 pt-4 pb-2 text-start font-medium">
                Marca
              </th>
              <th scope="col" className="px-3 pt-4 pb-2 text-end font-medium">
                Seguidores
              </th>
              <th scope="col" className="px-3 pt-4 pb-2 text-end font-medium">
                Novos
              </th>
              <th scope="col" className="w-[18%] px-3 pt-4 pb-2 text-start font-medium">
                Posts por semana
              </th>
              <th scope="col" className="w-[18%] px-3 pt-4 pb-2 text-start font-medium">
                Engajamento
              </th>
              <th scope="col" className="px-5 pt-4 pb-2 text-start font-medium">
                Preço e novidade
              </th>
            </tr>
          </thead>
          <tbody>
            {MONITOR_CONCORRENTES.map((marca) => (
              <tr key={marca.id} className={cn("border-t border-borda-sutil", marca.voce && "bg-acao-suave")}>
                <th scope="row" className="px-5 py-3 text-start font-medium">
                  <span className="flex items-center gap-2">
                    {marca.nome}
                    {marca.voce && (
                      <Tag tom="neutra" tamanho="sm">
                        você
                      </Tag>
                    )}
                  </span>
                </th>
                <td className="px-3 py-3 text-end tabular-nums">{formatar(marca.seguidores, "numero")}</td>
                <td className="px-3 py-3 text-end text-texto-2 tabular-nums">+{formatar(marca.novosSeguidores, "numero")}</td>
                <td className="px-3 py-3">
                  <Barra valor={marca.postsSemana} maximo={maiorPosts} texto={marca.postsSemana.toLocaleString("pt-BR")} destaque={marca.voce} />
                </td>
                <td className="px-3 py-3">
                  <Barra valor={marca.engajamento} maximo={maiorEngajamento} texto={formatar(marca.engajamento, "porcentagem")} destaque={marca.voce} />
                </td>
                <td className="px-5 py-3">
                  <span className="flex flex-col">
                    <span className="tabular-nums">{marca.preco}</span>
                    {marca.novidade && <span className="text-xs text-texto-2">{marca.novidade}</span>}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-2 @3xl:hidden">
        {MONITOR_CONCORRENTES.map((marca) => (
          <li key={marca.id}>
            <CartaoComparativo marca={marca} maiorPosts={maiorPosts} maiorEngajamento={maiorEngajamento} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function CartaoComparativo({ marca, maiorPosts, maiorEngajamento }: { marca: MonitorConcorrente; maiorPosts: number; maiorEngajamento: number }) {
  return (
    <article aria-labelledby={`comp-${marca.id}`} className={cn("flex flex-col gap-3 rounded-3xl p-4", marca.voce ? "bg-acao-suave" : "bg-superficie")}>
      <div className="flex items-center justify-between gap-2">
        <h3 id={`comp-${marca.id}`} className="flex items-center gap-2 text-sm font-semibold">
          {marca.nome}
          {marca.voce && (
            <Tag tom="neutra" tamanho="sm">
              você
            </Tag>
          )}
        </h3>
        <span className="shrink-0 text-xs whitespace-nowrap text-texto-2 tabular-nums">
          {formatar(marca.seguidores, "numero")} seguidores
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex flex-col gap-1">
          <dt className="text-texto-3">Posts por semana</dt>
          <dd>
            <Barra valor={marca.postsSemana} maximo={maiorPosts} texto={marca.postsSemana.toLocaleString("pt-BR")} destaque={marca.voce} />
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-texto-3">Engajamento</dt>
          <dd>
            <Barra valor={marca.engajamento} maximo={maiorEngajamento} texto={formatar(marca.engajamento, "porcentagem")} destaque={marca.voce} />
          </dd>
        </div>
      </dl>
      <p className="text-xs text-texto-2">
        {marca.preco}
        {marca.novidade && ` · ${marca.novidade}`}
      </p>
    </article>
  )
}

/** Barra fina com o valor escrito ao lado; a própria marca em preto, as outras em cinza. */
function Barra({ valor, maximo, texto, destaque }: { valor: number; maximo: number; texto: string; destaque?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-preenchimento-ativo">
        <span className={cn("block h-full rounded-full", destaque ? "bg-texto" : "bg-cinza-medio")} style={{ width: `${Math.max(4, (valor / maximo) * 100)}%` }} />
      </span>
      <span className="w-10 shrink-0 text-end text-xs font-medium tabular-nums">{texto}</span>
    </span>
  )
}

function CartaoNovidade({ novidade }: { novidade: NovidadeConcorrente }) {
  const { hoje, posts, novoPost, abrirPost, setMes } = useMarketing()
  const [criado, setCriado] = useState<string | null>(null)
  const marca = MONITOR_CONCORRENTES.find((item) => item.id === novidade.concorrente)
  const existe = criado && posts.some((post) => post.id === criado)

  const criarIdeia = () => {
    const dia = proximoDiaLivre(posts, hoje)
    const id = novoPost({ data: dia, titulo: novidade.ideia.titulo, canal: novidade.ideia.canal, legenda: novidade.ideia.legenda, origem: "hattie", hora: dataDe(dia).getDay() === 6 ? "10:00" : "19:00" })
    setCriado(id)
    setMes(dia.slice(0, 7))
    notificar({ titulo: "ideia no calendário", texto: `"${novidade.ideia.titulo}" ficou para ${dataCurta(dia)}, esperando o seu ok.`, tipo: "sucesso", acao: { rotulo: "Abrir", aoClicar: () => abrirPost(id) } })
  }

  return (
    <article aria-labelledby={`novidade-${novidade.id}`} className="flex h-full flex-col gap-3 rounded-3xl bg-superficie p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="font-semibold">{marca?.nome}</span>
        <Tag tom="neutra" tamanho="sm">
          {TIPOS_NOVIDADE[novidade.tipo]}
        </Tag>
        <span className="text-texto-3">{haDias(novidade.data, hoje)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 id={`novidade-${novidade.id}`} className="text-sm font-semibold">
          {novidade.titulo}
        </h3>
        <p className="text-xs leading-relaxed text-texto-2">{novidade.texto}</p>
      </div>
      <div className="flex gap-2.5 rounded-2xl bg-preenchimento px-3.5 py-3">
        <IconeHattie nome="hattie" tamanho={18} className="shrink-0" />
        <p className="text-xs leading-relaxed">{novidade.sugestao}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {existe ? (
          <Botao variante="secundario" tamanho="sm" onClick={() => abrirPost(criado)}>
            <Check /> Ideia criada, abrir
          </Botao>
        ) : (
          <Botao variante="secundario" tamanho="sm" onClick={criarIdeia}>
            <CalendarPlus /> Criar ideia no calendário
          </Botao>
        )}
        <span className="text-xs text-texto-3">
          {CANAIS[novidade.ideia.canal].rotulo}: {novidade.ideia.titulo}
        </span>
      </div>
    </article>
  )
}

function AdicionarConcorrente({ aberta, aoMudar }: { aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  const [nome, setNome] = useState("")
  const [perfil, setPerfil] = useState("")
  const [erro, setErro] = useState("")
  const enviar = () => {
    if (!nome.trim()) {
      setErro("Escreva o nome da marca.")
      return
    }
    aoMudar(false)
    notificar({ titulo: "anotado", texto: `Começo a acompanhar a ${nome.trim()}. Os primeiros números chegam na segunda.`, tipo: "sucesso" })
    setNome("")
    setPerfil("")
    setErro("")
  }
  return (
    <Janela
      aberta={aberta}
      aoMudar={aoMudar}
      titulo="acompanhar outra marca"
      descricao="Pode ser um concorrente direto ou uma marca que você admira."
      rodape={
        <>
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Cancelar
          </Botao>
          <Botao variante="primario" type="submit" form="form-concorrente">
            Acompanhar
          </Botao>
        </>
      }
    >
      <form
        id="form-concorrente"
        className="flex flex-col gap-4"
        onSubmit={(evento) => {
          evento.preventDefault()
          enviar()
        }}
      >
        <Campo rotulo="Nome da marca" value={nome} onChange={(evento) => (setNome(evento.target.value), setErro(""))} erro={erro || undefined} autoComplete="off" />
        <Campo rotulo="Instagram ou site (opcional)" value={perfil} onChange={(evento) => setPerfil(evento.target.value)} placeholder="@marca ou marca.com.br" autoComplete="off" />
        <p className="text-xs text-texto-3">Olho só o que é público. Você está acompanhando 3 de 5 marcas.</p>
      </form>
    </Janela>
  )
}
