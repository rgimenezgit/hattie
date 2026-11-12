"use client"

import { useRef, useState, type FormEvent, type ReactNode } from "react"
import {
  ArrowUpRight,
  Ban,
  Compass,
  Flag,
  Frown,
  Heart,
  Megaphone,
  MessageCircle,
  Plus,
  Sparkles,
  Store,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { Marca, Persona, Publico, Secao } from "@/lib/mock"
import { useEstado } from "./Estado"
import { corDoTexto } from "./PreviaSecao"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Público e personas, em três camadas:
 * 1. Público macro: quem a marca atende, numa frase e em poucos dados.
 * 2. Públicos: recortes do macro, cada um com demografia (quem é) e psicografia (como pensa e vive).
 * 3. Personas: uma pessoa por público, com objetivos, dores, motivações, objeções, gatilhos e canais.
 * Públicos e personas novos entram como rascunho, e o Hattie completa.
 */
export function SecaoPublico({ secao, marca, aoEditar }: Props) {
  const { publicosNovos, personasNovas } = useEstado()
  const [novoPublico, setNovoPublico] = useState(false)
  const [novaPersona, setNovaPersona] = useState(false)
  if (secao.conteudo.tipo !== "publico") return null
  const { macro } = secao.conteudo
  const publicos = [...secao.conteudo.publicos, ...publicosNovos]
  const personas = [...secao.conteudo.personas, ...personasNovas]
  const nomeDoPublico = (id: string) => publicos.find((publico) => publico.id === id)?.nome

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-macro" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-macro" titulo="público macro">
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <p className="max-w-[62ch] text-destaque font-light">{macro.descricao}</p>
          <dl className="grid grid-cols-2 gap-y-4 border-t border-borda-sutil pt-4 @3xl:grid-cols-4">
            {macro.destaques.map((dado, indice) => (
              <div key={dado.rotulo} className={cn("flex flex-col gap-0.5 pe-4", indice > 0 && "@3xl:border-s @3xl:border-borda-sutil @3xl:ps-4")}>
                <dt className="text-xs text-texto-3">{dado.rotulo}</dt>
                <dd className="text-sm font-medium">{dado.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="titulo-publicos" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-publicos" titulo="públicos" quantidade={publicos.length}>
          <Botao variante="secundario" tamanho="sm" onClick={() => setNovoPublico(true)}>
            <Plus /> Adicionar público
          </Botao>
        </CabecalhoBloco>
        <div className="flex flex-col gap-3">
          {publicos.map((publico) => (
            <CartaoPublico key={publico.id} publico={publico} personas={personas.filter((persona) => persona.publicoId === publico.id).length} aoCompletar={aoEditar} />
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-personas" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-personas" titulo="personas" quantidade={personas.length}>
          <Botao variante="secundario" tamanho="sm" onClick={() => setNovaPersona(true)}>
            <Plus /> Adicionar persona
          </Botao>
        </CabecalhoBloco>
        <ul className="grid grid-cols-1 gap-3 @5xl:grid-cols-2">
          {personas.map((persona, indice) => (
            <li key={persona.id} className="flex min-w-0">
              <CartaoPersona persona={persona} cor={marca.paleta[indice % marca.paleta.length].hex} publico={nomeDoPublico(persona.publicoId)} marca={marca} aoEditar={aoEditar} />
            </li>
          ))}
        </ul>
      </section>

      <FormPublico aberta={novoPublico} aoMudar={setNovoPublico} />
      <FormPersona aberta={novaPersona} aoMudar={setNovaPersona} publicos={publicos} />
    </div>
  )
}

/** Cabeçalho das três camadas: título em Clash, quantidade discreta e a ação à direita. */
function CabecalhoBloco({ id, titulo, quantidade, children }: { id: string; titulo: string; quantidade?: number; children: ReactNode }) {
  return (
    <div className="flex min-h-8 items-center justify-between gap-3">
      <h2 id={id} className="flex items-baseline gap-2 font-heading text-titulo-3 font-medium lowercase">
        {titulo}
        {quantidade !== undefined && <span className="font-sans text-xs font-medium text-texto-3 tabular-nums">{quantidade}</span>}
      </h2>
      {children}
    </div>
  )
}

function CartaoPublico({ publico, personas, aoCompletar }: { publico: Publico; personas: number; aoCompletar: () => void }) {
  const vazio = publico.demografia.length === 0 && publico.psicografia.length === 0
  return (
    <article aria-labelledby={`publico-${publico.id}`} className="flex flex-col gap-4 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={`publico-${publico.id}`} className="text-base font-semibold">
            {publico.nome}
          </h3>
          {publico.rascunho ? <Tag tamanho="sm">rascunho</Tag> : <Tag tamanho="sm">{publico.peso}</Tag>}
          <span className="text-xs text-texto-3">
            {personas === 1 ? "1 persona" : `${personas} personas`}
          </span>
        </div>
        {publico.descricao && <p className="max-w-[70ch] text-sm text-texto-2">{publico.descricao}</p>}
      </header>

      {vazio ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-preenchimento p-4">
          <p className="text-sm text-texto-2">Ainda sem demografia e psicografia. Eu completo a partir do que você já me contou.</p>
          <Botao variante="secundario" tamanho="sm" onClick={aoCompletar}>
            <MessageCircle /> Completar com o Hattie
          </Botao>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 border-t border-borda-sutil pt-4 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @3xl:gap-0">
          <div className="flex flex-col gap-3 @3xl:pe-6">
            <h4 className="text-xs font-semibold text-texto-2">Demografia</h4>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              {publico.demografia.map((dado) => (
                <div key={dado.rotulo} className="flex flex-col gap-0.5">
                  <dt className="text-xs text-texto-3">{dado.rotulo}</dt>
                  <dd className="text-sm">{dado.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-3 @3xl:border-s @3xl:border-borda-sutil @3xl:ps-6">
            <h4 className="text-xs font-semibold text-texto-2">Psicografia</h4>
            <dl className="grid grid-cols-[minmax(96px,auto)_1fr] gap-x-4 gap-y-2.5">
              {publico.psicografia.map((grupo) => (
                <div key={grupo.titulo} className="col-span-2 grid grid-cols-subgrid items-baseline">
                  <dt className="text-xs text-texto-3">{grupo.titulo}</dt>
                  <dd className="text-sm">{grupo.itens.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </article>
  )
}

function Avatar({ persona, cor, tamanho = "md" }: { persona: Persona; cor: string; tamanho?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-full font-heading font-semibold", tamanho === "lg" ? "size-14 text-titulo-3" : "size-11 text-base")}
      style={{ backgroundColor: cor, color: corDoTexto(cor) }}
    >
      {persona.nome[0]}
    </span>
  )
}

function Lista({ icone: Icone, titulo, itens }: { icone: LucideIcon; titulo: string; itens: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h4 className="flex items-center gap-1.5 text-xs font-semibold text-texto-2">
        <Icone className="size-3.5 text-texto-3" strokeWidth={2} aria-hidden />
        {titulo}
      </h4>
      <ul className="flex flex-col gap-1 text-sm">
        {itens.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="mt-[0.55em] size-1 shrink-0 rounded-full bg-texto-3" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CartaoPersona({
  persona,
  cor,
  publico,
  marca,
  aoEditar,
}: {
  persona: Persona
  cor: string
  publico?: string
  marca: Marca
  aoEditar: () => void
}) {
  const [aberta, setAberta] = useState(false)
  const depoisDeFechar = useRef<(() => void) | null>(null)
  const vazia = persona.objetivos.length === 0 && persona.dores.length === 0

  return (
    <article aria-labelledby={`persona-${persona.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
      <header className="flex items-center gap-3">
        <Avatar persona={persona} cor={cor} />
        <div className="flex min-w-0 flex-1 flex-col">
          <h3 id={`persona-${persona.id}`} className="text-base font-semibold">
            {persona.nome}, {persona.idade}
          </h3>
          <p className="text-xs text-texto-2">
            {[persona.ocupacao, persona.cidade].filter(Boolean).join(" · ")}
          </p>
        </div>
        {persona.rascunho ? <Tag tamanho="sm">rascunho</Tag> : publico && <Tag tamanho="sm">{publico}</Tag>}
      </header>

      {persona.frase && (
        <blockquote className="border-s-2 border-acao ps-3 text-corpo text-texto italic">“{persona.frase}”</blockquote>
      )}

      {vazia ? (
        <div className="flex flex-1 flex-col items-start gap-3">
          <p className="text-sm text-texto-2">Eu completo objetivos, dores, motivações e canais a partir do público dela.</p>
          <Botao variante="secundario" tamanho="sm" onClick={aoEditar}>
            <MessageCircle /> Completar com o Hattie
          </Botao>
        </div>
      ) : (
        <>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <Lista icone={Target} titulo="Objetivos" itens={persona.objetivos} />
            <Lista icone={Frown} titulo="Dores" itens={persona.dores} />
          </div>
          <footer className="flex items-end justify-between gap-3 border-t border-borda-sutil pt-3">
            <p className="min-w-0 text-xs text-texto-2">
              <span className="text-texto-3">Onde ela está: </span>
              {persona.canais.join(" · ")}
            </p>
            <Botao variante="secundario" tamanho="sm" className="-mb-0.5" onClick={() => setAberta(true)}>
              Ver completa <ArrowUpRight />
            </Botao>
          </footer>
        </>
      )}

      <Janela
        aberta={aberta}
        aoMudar={setAberta}
        largura="xl"
        titulo={`${persona.nome.toLowerCase()}, ${persona.idade}`}
        descricao={[persona.ocupacao, persona.cidade, publico].filter(Boolean).join(" · ")}
        topo={<Avatar persona={persona} cor={cor} tamanho="lg" />}
        onCloseAutoFocus={(evento) => {
          const acao = depoisDeFechar.current
          if (!acao) return
          depoisDeFechar.current = null
          evento.preventDefault()
          acao()
        }}
        rodape={
          <Botao
            variante="secundario"
            tamanho="sm"
            onClick={() => {
              depoisDeFechar.current = aoEditar
              setAberta(false)
            }}
          >
            <MessageCircle /> Ajustar com o Hattie
          </Botao>
        }
      >
        <div className="flex flex-col gap-5">
          <blockquote className="border-s-2 border-acao ps-4 text-destaque font-light italic">“{persona.frase}”</blockquote>
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-semibold text-texto-2">História</h4>
            <p className="text-corpo text-texto-2">{persona.historia}</p>
          </div>
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <Lista icone={Target} titulo="Objetivos" itens={persona.objetivos} />
            <Lista icone={Frown} titulo="Dores" itens={persona.dores} />
            <Lista icone={Heart} titulo="Motivações" itens={persona.motivacoes} />
            <Lista icone={Ban} titulo="Objeções na compra" itens={persona.objecoes} />
            <Lista icone={Zap} titulo="O que faz ela decidir" itens={persona.gatilhos} />
            <Lista icone={Compass} titulo="Onde ela está" itens={persona.canais} />
            <Lista icone={Store} titulo="Referências que ela admira" itens={persona.referencias} />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 rounded-2xl bg-acao-suave p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-medium text-texto-2">
                <Sparkles className="size-3.5" strokeWidth={2} aria-hidden />
                Como a {marca.nome} ajuda
              </h4>
              <p className="text-sm">{persona.comoAjudamos}</p>
            </div>
            <div className="flex flex-col gap-1.5 rounded-2xl bg-preenchimento p-4">
              <h4 className="flex items-center gap-1.5 text-xs font-medium text-texto-2">
                <Megaphone className="size-3.5" strokeWidth={2} aria-hidden />O que dizer para ela
              </h4>
              <p className="text-sm font-medium">{persona.mensagem}</p>
            </div>
          </div>
        </div>
      </Janela>
    </article>
  )
}

/** Depois de marcar os erros, leva o foco ao primeiro campo com problema. */
function focarErro(form: HTMLFormElement) {
  requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
}

function FormPublico({ aberta, aoMudar }: { aberta: boolean; aoMudar: (aberta: boolean) => void }) {
  const { adicionarPublico } = useEstado()
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Dá um nome para esse público.")
      focarErro(evento.currentTarget)
      return
    }
    adicionarPublico({
      id: `publico-${Date.now()}`,
      nome,
      descricao: String(dados.get("descricao") ?? "").trim(),
      peso: "Novo",
      demografia: [],
      psicografia: [],
      rascunho: true,
    })
    setErro("")
    aoMudar(false)
    notificar({ titulo: "público anotado", texto: `${nome} entrou como rascunho. Quando quiser, eu completo os dados.`, tipo: "sucesso" })
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      titulo="novo público"
      descricao="Um recorte de quem compra da marca. Eu completo demografia e psicografia depois."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-publico">
          <Flag /> Adicionar público
        </Botao>
      }
    >
      <form id="form-publico" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <Campo name="nome" rotulo="Nome do público" placeholder="Ex.: Mães de primeira viagem" erro={erro} autoFocus />
        <CampoArea name="descricao" rotulo="Quem são" placeholder="O que elas compram, quando e por quê" dica="Opcional" />
      </form>
    </Janela>
  )
}

function FormPersona({ aberta, aoMudar, publicos }: { aberta: boolean; aoMudar: (aberta: boolean) => void; publicos: Publico[] }) {
  const { adicionarPersona } = useEstado()
  const [erros, setErros] = useState<{ nome?: string; idade?: string }>({})

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const nome = String(dados.get("nome") ?? "").trim()
    const idade = Number(dados.get("idade"))
    const novosErros = {
      nome: nome ? undefined : "Dá um nome para ela.",
      idade: Number.isInteger(idade) && idade >= 14 && idade <= 99 ? undefined : "Coloca uma idade entre 14 e 99.",
    }
    if (novosErros.nome || novosErros.idade) {
      setErros(novosErros)
      focarErro(evento.currentTarget)
      return
    }
    adicionarPersona({
      id: `persona-${Date.now()}`,
      publicoId: String(dados.get("publico")),
      nome,
      idade,
      ocupacao: String(dados.get("ocupacao") ?? "").trim(),
      cidade: String(dados.get("cidade") ?? "").trim(),
      frase: String(dados.get("frase") ?? "").trim(),
      historia: "",
      objetivos: [],
      dores: [],
      motivacoes: [],
      objecoes: [],
      gatilhos: [],
      canais: [],
      referencias: [],
      comoAjudamos: "",
      mensagem: "",
      rascunho: true,
    })
    setErros({})
    aoMudar(false)
    notificar({ titulo: "persona anotada", texto: `${nome} entrou como rascunho. Eu completo o resto a partir do público dela.`, tipo: "sucesso" })
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErros({})
      }}
      largura="lg"
      titulo="nova persona"
      descricao="Uma pessoa que representa um público. Com o básico, eu completo objetivos, dores e canais."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-persona">
          <Plus /> Adicionar persona
        </Botao>
      }
    >
      <form id="form-persona" onSubmit={enviar} className="grid gap-4 sm:grid-cols-2" noValidate>
        <Campo name="nome" rotulo="Nome" placeholder="Ex.: Júlia" erro={erros.nome} autoFocus />
        <Campo name="idade" rotulo="Idade" type="number" inputMode="numeric" min={14} max={99} placeholder="Ex.: 34" erro={erros.idade} />
        <Campo name="ocupacao" rotulo="O que ela faz" placeholder="Ex.: Professora" />
        <Campo name="cidade" rotulo="Onde mora" placeholder="Ex.: São Carlos, SP" />
        <CampoLista
          name="publico"
          rotulo="Público"
          className="sm:col-span-2"
          opcoes={publicos.map((publico) => ({ valor: publico.id, rotulo: publico.nome }))}
        />
        <CampoArea name="frase" rotulo="Uma frase dela" placeholder="Algo que ela diria sobre cuidar de si" dica="Opcional" className="sm:col-span-2" />
      </form>
    </Janela>
  )
}
