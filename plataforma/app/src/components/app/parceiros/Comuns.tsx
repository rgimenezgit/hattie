"use client"

import Link from "next/link"
import type { Route } from "next"
import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AtSign, BookOpen, Info, Play, Send, Star, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { Plimm } from "@/components/hattie/Plimm"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import { PROJETOS, SECOES, cerebroSugerido, getSecao, precoDoParceiro, type CorParceiro, type Parceiro, type Secao, type TrabalhoPortfolio } from "@/lib/mock"
import { useEstado } from "../Estado"
import { Ilustracao } from "../Ilustracao"
import { useMarca } from "../MarcaContexto"
import { useParceiros } from "./EstadoParceiros"

const FUNDO_AVATAR: Record<CorParceiro, string> = { lilas: "bg-lilas", azul: "bg-azul", rosa: "bg-rosa", cinza: "bg-cinza" }

export const primeiroNome = (parceiro: Pick<Parceiro, "nome">) => parceiro.nome.split(" ")[0]
export const nota = (valor: number) => valor.toFixed(1).replace(".", ",")

/** Avatar do parceiro: iniciais em preto #101010 sobre uma cor da paleta do Hattie, enquanto não há foto. */
export function AvatarParceiro({ parceiro, tamanho = 40, className }: { parceiro: Pick<Parceiro, "nome" | "cor">; tamanho?: number; className?: string }) {
  const iniciais = parceiro.nome
    .split(" ")
    .filter((parte) => parte.length > 2)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-preto", FUNDO_AVATAR[parceiro.cor], className)}
      style={{ width: tamanho, height: tamanho, fontSize: Math.round(tamanho * 0.36) }}
    >
      {iniciais}
    </span>
  )
}

/** Nota com estrela cheia e número de avaliações. */
export function Nota({ parceiro, className }: { parceiro: Pick<Parceiro, "nota" | "avaliacoes">; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs tabular-nums", className)}>
      <Star className="size-3.5 fill-current text-preto" strokeWidth={0} aria-hidden />
      <span className="font-semibold">{nota(parceiro.nota)}</span>
      <span className="text-texto-3">({parceiro.avaliacoes})</span>
      <span className="sr-only">avaliações, nota {nota(parceiro.nota)} de 5</span>
    </span>
  )
}

/** Miniatura de um trabalho do portfólio, desenhada no tipo e nas cores do trabalho. */
export function MiniaturaTrabalho({ trabalho, className }: { trabalho: TrabalhoPortfolio; className?: string }) {
  const { fundo, tinta } = trabalho
  const cq = (valor: number) => `${valor}cqmin`
  const conteudo = () => {
    switch (trabalho.tipo) {
      case "foto":
        return <BlocoImagem className="size-full rounded-none outline-0" fundo={fundo} cor={tinta} borda="bottom" />
      case "video":
        return (
          <>
            <BlocoImagem className="size-full rounded-none outline-0" fundo={fundo} cor={tinta} borda="left" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid place-items-center rounded-full bg-black/45 text-white" style={{ width: cq(22), height: cq(22) }}>
                <Play className="size-1/2 fill-current" strokeWidth={0} />
              </span>
            </span>
          </>
        )
      case "logo":
        return (
          <span className="grid size-full place-items-center font-serif font-medium" style={{ color: tinta, fontSize: cq(26), letterSpacing: "-0.04em" }}>
            {trabalho.cliente
              .split(" ")
              .map((parte) => parte[0])
              .join("")
              .slice(0, 2)}
          </span>
        )
      case "embalagem":
        return (
          <span className="grid size-full place-items-end justify-center" style={{ paddingTop: cq(14) }}>
            <span className="relative grid place-items-center" style={{ width: cq(34), height: cq(62), backgroundColor: tinta, borderRadius: `${cq(5)} ${cq(5)} ${cq(2)} ${cq(2)}` }}>
              <span className="absolute grid place-items-center text-center font-serif" style={{ inset: `${cq(18)} ${cq(4)} ${cq(12)}`, backgroundColor: fundo, color: tinta, fontSize: cq(5), borderRadius: cq(1.4) }}>
                {trabalho.cliente.split(" ")[0]}
              </span>
            </span>
          </span>
        )
      case "post":
        return (
          <span className="flex size-full flex-col justify-end" style={{ padding: cq(10), gap: cq(3) }}>
            <span className="font-serif leading-none font-medium" style={{ color: tinta, fontSize: cq(13) }}>
              {trabalho.titulo}
            </span>
            <span className="rounded-full" style={{ backgroundColor: tinta, opacity: 0.4, height: cq(2.4), width: "60%" }} />
          </span>
        )
      case "site":
        return (
          <span className="flex size-full flex-col" style={{ padding: cq(8), gap: cq(3) }}>
            <span className="flex items-center justify-between">
              <span className="rounded-full" style={{ backgroundColor: tinta, height: cq(3), width: "26%" }} />
              <span className="flex" style={{ gap: cq(2) }}>
                {[0, 1, 2].map((indice) => (
                  <span key={indice} className="rounded-full" style={{ backgroundColor: tinta, opacity: 0.5, height: cq(2), width: cq(7) }} />
                ))}
              </span>
            </span>
            <span className="flex-1" style={{ backgroundColor: tinta, opacity: 0.18, borderRadius: cq(2) }} />
            <span className="font-serif leading-none" style={{ color: tinta, fontSize: cq(9) }}>
              {trabalho.cliente}
            </span>
          </span>
        )
      case "ilustracao":
        return <Ilustracao desenho={(["pequi", "baru", "buriti", "padrao"] as const)[trabalho.id.charCodeAt(1) % 4]} cores={{ fundo, principal: tinta, apoio: `color-mix(in srgb, ${tinta} 45%, ${fundo})`, escuro: tinta, destaque: `color-mix(in srgb, ${tinta} 70%, ${fundo})` }} grao={0} />
      case "texto":
        return (
          <span className="flex size-full flex-col" style={{ padding: cq(10), gap: cq(3) }}>
            <span className="font-serif leading-none" style={{ color: tinta, fontSize: cq(26) }}>
              “
            </span>
            {[86, 72, 80, 54].map((largura) => (
              <span key={largura} className="rounded-full" style={{ backgroundColor: tinta, opacity: 0.45, height: cq(3), width: `${largura}%` }} />
            ))}
          </span>
        )
    }
  }
  return (
    <div role="img" aria-label={`${trabalho.titulo}, para ${trabalho.cliente}`} className={cn("relative overflow-hidden [container-type:size]", className)} style={{ backgroundColor: fundo }}>
      {conteudo()}
    </div>
  )
}

/**
 * Card do parceiro: três trabalhos no topo, avatar, nome (leva ao perfil), título, nota, especialidades,
 * preço e o botão Contratar. O card inteiro é clicável; o botão fica por cima do link.
 */
export function CartaoParceiro({ parceiro, motivo, className }: { parceiro: Parceiro; motivo?: string; className?: string }) {
  const marca = useMarca()
  const [contratando, setContratando] = useState(false)
  const preco = precoDoParceiro(parceiro)
  const extras = parceiro.especialidades.length - 2
  return (
    <article className={cn("group/parceiro relative flex w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)", className)}>
      <div className="grid h-28 grid-cols-3 gap-0.5" aria-hidden>
        {parceiro.trabalhos.slice(0, 3).map((trabalho) => (
          <MiniaturaTrabalho key={trabalho.id} trabalho={trabalho} className="h-full" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <AvatarParceiro parceiro={parceiro} tamanho={48} className="relative -mt-10 ring-4 ring-superficie" />
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-1">
            {!parceiro.disponivel && (
              <Tag tom="atencao" tamanho="sm">
                agenda cheia
              </Tag>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base leading-tight font-semibold">
            <Link
              href={`/marca/${marca.slug}/parceiros/perfil/${parceiro.id}` as Route}
              className="after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-texto"
            >
              {parceiro.nome}
            </Link>
          </h3>
          <p className="line-clamp-2 text-xs text-texto-2">{parceiro.titulo}</p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-texto-3">
            <Nota parceiro={parceiro} />
            <span aria-hidden>·</span>
            <span>
              {parceiro.cidade}
              {parceiro.pais !== "Brasil" && `, ${parceiro.pais}`}
            </span>
          </p>
        </div>
        {motivo && <p className="rounded-xl bg-preenchimento px-3 py-2 text-xs">{motivo}</p>}
        <div className="flex flex-wrap gap-1">
          {parceiro.especialidades.slice(0, 2).map((especialidade) => (
            <Tag key={especialidade} tamanho="sm">
              {especialidade}
            </Tag>
          ))}
          {extras > 0 && <Tag tamanho="sm">+{extras}</Tag>}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-borda-sutil pt-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold">{preco.valor}</span>
            <span className="text-xs text-texto-3">{preco.modelo}</span>
          </div>
          <Botao variante="secundario" tamanho="sm" className="relative z-10" onClick={() => setContratando(true)} aria-label={`Contratar ${parceiro.nome}`}>
            Contratar
          </Botao>
        </div>
      </div>
      <JanelaContratar parceiro={parceiro} aberta={contratando} aoMudar={setContratando} />
    </article>
  )
}

const ORCAMENTOS = ["Ainda não sei", "Até R$ 1.000", "De R$ 1.000 a R$ 3.000", "De R$ 3.000 a R$ 8.000", "Acima de R$ 8.000"]
const PRAZOS = ["Sem pressa", "Em até 2 semanas", "Ainda este mês", "Tenho uma data certa"]
const SEM_PROJETO = ""
const PROJETO_NOVO = "novo"
const OUTRA_TAREFA = "outra"
const GRUPOS_CEREBRO: { id: Secao["grupo"]; rotulo: string }[] = [
  { id: "estrategia", rotulo: "Estratégia" },
  { id: "verbal", rotulo: "Verbal" },
  { id: "personalidade", rotulo: "Personalidade" },
  { id: "visual", rotulo: "Visual" },
]

/**
 * Janela de contratar: projeto e tarefa da marca, serviços do parceiro, mensagem, o que o parceiro vê
 * do cérebro da marca (já marcado pela especialidade) e orçamento e prazo opcionais.
 * Enviar cria a conversa e o card no quadro, ligados ao projeto.
 */
export function JanelaContratar({ parceiro, aberta, aoMudar }: { parceiro: Parceiro; aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  const marca = useMarca()
  const router = useRouter()
  const { nomeMarca } = useEstado()
  const { contratar } = useParceiros()
  const [projetoId, setProjetoId] = useState(SEM_PROJETO)
  const [tarefa, setTarefa] = useState("")
  const [servicos, setServicos] = useState<string[]>([])
  const [anexos, setAnexos] = useState(() => cerebroSugerido(parceiro))
  const [erro, setErro] = useState("")
  const [erroProjeto, setErroProjeto] = useState("")
  const nome = primeiroNome(parceiro)
  const projeto = PROJETOS.find((item) => item.id === projetoId)
  const id = `contratar-${parceiro.id}`

  function limpar() {
    setErro("")
    setErroProjeto("")
    setServicos([])
    setProjetoId(SEM_PROJETO)
    setTarefa("")
    setAnexos(cerebroSugerido(parceiro))
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const mensagem = String(dados.get("mensagem") ?? "").trim()
    const nomeProjeto = projetoId === PROJETO_NOVO ? String(dados.get("projeto-novo") ?? "").trim() : projeto?.nome
    const tarefaFinal = tarefa === OUTRA_TAREFA || projetoId === PROJETO_NOVO ? String(dados.get("tarefa-nova") ?? "").trim() : tarefa
    const faltaProjeto = projetoId === PROJETO_NOVO && !nomeProjeto
    setErroProjeto(faltaProjeto ? "Dê um nome ao projeto." : "")
    setErro(mensagem ? "" : `Conte para ${nome} o que você precisa.`)
    if (!mensagem || faltaProjeto) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const orcamento = String(dados.get("orcamento") ?? "")
    const prazo = String(dados.get("prazo") ?? "")
    const conversa = contratar(parceiro.id, {
      assunto: tarefaFinal || servicos[0] || `Pedido para ${nome}`,
      mensagem,
      servicos,
      orcamento: orcamento && orcamento !== ORCAMENTOS[0] ? orcamento : undefined,
      prazo: prazo && prazo !== PRAZOS[0] ? prazo : undefined,
      projeto: nomeProjeto || undefined,
      tarefa: tarefaFinal || undefined,
      anexos,
      nomeMarca,
    })
    aoMudar(false)
    limpar()
    notificar({ titulo: "pedido enviado", texto: `${nome} costuma responder ${parceiro.resposta}. A conversa está em Mensagens.`, tipo: "sucesso" })
    router.push(`/marca/${marca.slug}/parceiros/mensagens/${conversa}` as Route)
  }

  const alternarAnexo = (secao: string) => setAnexos((atual) => (atual.includes(secao) ? atual.filter((item) => item !== secao) : [...atual, secao]))

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) limpar()
      }}
      largura="lg"
      titulo={`contratar ${nome.toLowerCase()}`}
      descricao="A resposta chega aqui mesmo, em Mensagens."
      rodape={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <p className="flex flex-1 items-start gap-1.5 text-xs text-texto-2">
            <Info className="mt-px size-3.5 shrink-0" strokeWidth={2} aria-hidden />
            Conversar é grátis. Você paga ao aprovar a proposta, e o valor vai para {nome} quando você aprovar a entrega.
          </p>
          <div className="flex shrink-0 justify-end gap-2">
            <Botao variante="fantasma" onClick={() => aoMudar(false)}>
              Cancelar
            </Botao>
            <Plimm type="submit" form={`form-${id}`} icone={Send} rotulo="enviar pedido" />
          </div>
        </div>
      }
    >
      <form id={`form-${id}`} onSubmit={enviar} className="flex flex-col gap-6" noValidate>
        <div className="flex items-center gap-3">
          <AvatarParceiro parceiro={parceiro} tamanho={40} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold">{parceiro.nome}</span>
            <span className="flex items-center gap-2 text-xs text-texto-2">
              <Nota parceiro={parceiro} />
              <span aria-hidden>·</span>
              {precoDoParceiro(parceiro).valor}
            </span>
          </div>
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-semibold">Onde entra este trabalho</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CampoLista
              name="projeto"
              rotulo="Projeto"
              value={projetoId}
              onChange={(evento) => {
                setProjetoId(evento.target.value)
                setTarefa("")
                setErroProjeto("")
              }}
              opcoes={[
                { valor: SEM_PROJETO, rotulo: "Sem projeto" },
                ...PROJETOS.map((item) => ({ valor: item.id, rotulo: item.nome })),
                { valor: PROJETO_NOVO, rotulo: "Criar projeto novo" },
              ]}
            />
            {projetoId === PROJETO_NOVO ? (
              <Campo name="projeto-novo" rotulo="Nome do projeto" placeholder="Ex.: Feira de dezembro" erro={erroProjeto} onChange={() => erroProjeto && setErroProjeto("")} />
            ) : (
              <CampoLista
                name="tarefa"
                rotulo="Tarefa"
                value={tarefa}
                disabled={!projeto}
                onChange={(evento) => setTarefa(evento.target.value)}
                opcoes={[
                  { valor: "", rotulo: projeto ? "Escolha uma tarefa" : "Escolha um projeto antes" },
                  ...(projeto?.tarefas ?? []).map((item) => ({ valor: item, rotulo: item })),
                  ...(projeto ? [{ valor: OUTRA_TAREFA, rotulo: "Outra tarefa" }] : []),
                ]}
              />
            )}
          </div>
          {(tarefa === OUTRA_TAREFA || projetoId === PROJETO_NOVO) && <Campo name="tarefa-nova" rotulo="Tarefa" dica="Opcional" placeholder="Ex.: Fotos do estande" />}
        </fieldset>

        <div className="flex flex-col gap-3">
          <span id={`servicos-${id}`} className="text-sm font-semibold">
            Com o que {nome} pode ajudar
          </span>
          <ToggleGroup type="multiple" value={servicos} onValueChange={setServicos} aria-labelledby={`servicos-${id}`} className="flex flex-wrap justify-start gap-1.5">
            {[...parceiro.servicos.map((servico) => servico.nome), "Outra coisa"].map((servico) => (
              <ToggleGroupItem
                key={servico}
                value={servico}
                className="h-8 rounded-full bg-preenchimento px-3 text-detalhe font-normal text-texto transition-[background-color] duration-150 hover:bg-preenchimento-hover data-[state=on]:bg-lima data-[state=on]:font-medium data-[state=on]:text-preto"
              >
                {servico}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="flex flex-col gap-3">
          <CampoArea
            name="mensagem"
            rotulo="Sua mensagem"
            placeholder={`Conte para ${nome} o que você precisa, para quando e onde vai usar.`}
            erro={erro}
            onChange={() => erro && setErro("")}
          />
          <div className="flex flex-col gap-2">
            <span id={`anexos-${id}`} className="text-xs text-texto-2">
              {nome} vai ver da {nomeMarca}
            </span>
            <ul aria-labelledby={`anexos-${id}`} className="flex flex-wrap items-center gap-1.5">
              {anexos.map((secaoId) => {
                const secao = getSecao(secaoId)
                if (!secao) return null
                return (
                  <li key={secaoId} className="inline-flex h-7 items-center gap-1 rounded-full bg-preenchimento ps-2.5 pe-0.5 text-xs">
                    <BookOpen className="size-3 text-texto-3" strokeWidth={2} aria-hidden />
                    {secao.titulo}
                    <button
                      type="button"
                      onClick={() => alternarAnexo(secaoId)}
                      aria-label={`Tirar ${secao.titulo}`}
                      className="grid size-6 place-items-center rounded-full text-texto-3 hover:bg-preenchimento-hover hover:text-texto"
                    >
                      <X className="size-3" strokeWidth={2.25} />
                    </button>
                  </li>
                )
              })}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Botao variante="fantasma" tamanho="sm" className="h-7">
                      <AtSign /> Mencionar da marca
                    </Botao>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-72 w-60 overflow-y-auto rounded-2xl p-1">
                    {GRUPOS_CEREBRO.map((grupo, indice) => (
                      <DropdownMenuGroup key={grupo.id}>
                        {indice > 0 && <DropdownMenuSeparator />}
                        <DropdownMenuLabel className="text-xs font-medium text-texto-3">{grupo.rotulo}</DropdownMenuLabel>
                        {SECOES.filter((secao) => secao.grupo === grupo.id).map((secao) => (
                          <DropdownMenuCheckboxItem
                            key={secao.id}
                            checked={anexos.includes(secao.id)}
                            onSelect={(evento) => {
                              evento.preventDefault()
                              alternarAnexo(secao.id)
                            }}
                            className="rounded-xl text-sm"
                          >
                            {secao.titulo}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuGroup>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <CampoLista name="orcamento" rotulo="Quanto quer investir" dica="Opcional" opcoes={ORCAMENTOS.map((item) => ({ valor: item, rotulo: item }))} />
          <CampoLista name="prazo" rotulo="Para quando" dica="Opcional" opcoes={PRAZOS.map((item) => ({ valor: item, rotulo: item }))} />
        </div>
      </form>
    </Janela>
  )
}
