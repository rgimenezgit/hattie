"use client"

import { useState, type FormEvent } from "react"
import { Check, CircleDashed, CircleMinus, MessageCircle, Plus, RotateCcw, TriangleAlert } from "lucide-react"
import { Aviso } from "@/components/hattie/Aviso"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { Checagem, Marca, OpcaoNome, ProcessoNome, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { useEstado } from "./Estado"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Naming em dois momentos.
 * Pendente (primeira visita depois do briefing): opções lado a lado, cada uma com significado, por que funciona,
 * como soa, ponto de atenção e checagens; abaixo, como o Hattie chegou nelas.
 * Escolhido: o nome em destaque, o porquê organizado, o processo e as opções que ficaram.
 * Escolher um nome troca o nome da marca no app inteiro e aprova a seção.
 */
export function SecaoNome({ secao, marca, aoEditar }: Props) {
  const { secoes, nomeEscolhido, nomeMarca, escolherNome, aprovar, reabrir } = useEstado()
  const [sugeridas, setSugeridas] = useState<OpcaoNome[]>([])
  const [confirmar, setConfirmar] = useState<OpcaoNome | null>(null)
  const [sugerir, setSugerir] = useState(false)
  if (secao.conteudo.tipo !== "nome") return null
  const { processo } = secao.conteudo
  const opcoes = [...secao.conteudo.opcoes, ...sugeridas]
  const aprovada = secoes[secao.id] === "aprovada"
  const escolhida = aprovada ? (opcoes.find((opcao) => opcao.id === nomeEscolhido) ?? opcoes.find((opcao) => opcao.nome === nomeMarca)) : undefined

  function confirmarEscolha(opcao: OpcaoNome) {
    escolherNome(opcao.id, opcao.nome)
    aprovar(secao.id)
    setConfirmar(null)
    notificar({ titulo: "nome escolhido", texto: `${opcao.nome} agora é o nome da marca em todo o cérebro.`, som: "cling" })
  }

  return (
    <div className="flex flex-col gap-10">
      {escolhida ? (
        <NomeEscolhido
          opcao={escolhida}
          outras={opcoes.filter((opcao) => opcao.id !== escolhida.id)}
          marca={marca}
          aoEditar={aoEditar}
          aoReabrir={() => reabrir(secao.id)}
          aoTrocarPara={setConfirmar}
        />
      ) : (
        <section aria-labelledby="titulo-opcoes" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-opcoes" titulo="escolha um nome" quantidade={opcoes.length}>
            <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
              <p>{secao.porque}</p>
            </PorqueHattie>
            <Botao variante="secundario" tamanho="sm" onClick={() => setSugerir(true)}>
              <Plus /> Sugerir<span className="max-sm:sr-only"> um nome</span>
            </Botao>
          </CabecalhoBloco>
          <p className="max-w-[70ch] text-sm text-texto-2">
            Trouxe {opcoes.length} caminhos, cada um de um território. Escolha o que mais parece com a sua marca; dá para trocar depois.
          </p>
          <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
            {opcoes.map((opcao) => (
              <li key={opcao.id} className="flex min-w-0">
                <CartaoOpcao opcao={opcao} atual={opcao.id === nomeEscolhido} aoEscolher={() => setConfirmar(opcao)} />
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
            <p className="text-sm text-texto-2">Nenhum encaixou?</p>
            <Botao variante="secundario" tamanho="sm" onClick={aoEditar}>
              <MessageCircle /> Pedir outras opções
            </Botao>
          </div>
        </section>
      )}

      <Processo processo={processo} singular={Boolean(escolhida)} />

      <Janela
        aberta={confirmar !== null}
        aoMudar={(aberta) => !aberta && setConfirmar(null)}
        titulo="confirmar o nome"
        rodape={
          <>
            <Botao variante="fantasma" tamanho="sm" onClick={() => setConfirmar(null)}>
              Voltar
            </Botao>
            <Botao variante="primario" tamanho="sm" onClick={() => confirmar && confirmarEscolha(confirmar)}>
              <Check /> Escolher {confirmar?.nome}
            </Botao>
          </>
        }
      >
        {confirmar && <ConfirmacaoNome opcao={confirmar} cor={marca.paleta[0].hex} />}
      </Janela>

      <FormSugestao
        aberta={sugerir}
        aoMudar={setSugerir}
        aoSugerir={(opcao) => {
          setSugeridas((atual) => [...atual, opcao])
          notificar({ titulo: "nome anotado", texto: `Vou checar domínio, Instagram e registro de ${opcao.nome}.`, tipo: "sucesso" })
        }}
      />
    </div>
  )
}

/**
 * Conteúdo da confirmação, em três camadas: a prévia do nome (o que importa), o aviso de disponibilidade
 * (só quando falta confirmar algo) e a consequência da escolha, em linha discreta no fim.
 */
function ConfirmacaoNome({ opcao, cor }: { opcao: OpcaoNome; cor: string }) {
  const pendentes = opcao.checagens.filter((checagem) => checagem.status !== "livre")
  const livres = opcao.checagens.filter((checagem) => checagem.status === "livre").map((checagem) => checagem.canal)
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-2xl bg-preenchimento px-5 py-5">
        <p className="text-xs text-texto-3">Como vai aparecer</p>
        <p className="font-serif text-display leading-none" style={{ color: cor }}>
          {opcao.nome}
        </p>
        <p className="max-w-[46ch] text-sm text-texto-2">{opcao.significado}</p>
      </div>

      {pendentes.length > 0 && (
        <Aviso tipo={pendentes.some((checagem) => checagem.status === "em uso") ? "erro" : "atencao"} titulo="Antes de registrar">
          <div className="flex flex-col gap-1.5">
            <ul className="flex flex-col gap-1">
              {pendentes.map((checagem) => (
                <li key={checagem.canal}>
                  <span className="font-medium text-texto">{checagem.canal}</span>
                  <span className="text-texto-2">
                    {" "}
                    · {checagem.valor}: {checagem.status === "em uso" ? "já está em uso" : "falta confirmar"}
                  </span>
                </li>
              ))}
            </ul>
            {livres.length > 0 && (
              <p className="text-xs">
                {livres.length > 1 ? `${livres.slice(0, -1).join(", ")} e ${livres[livres.length - 1]} estão livres.` : `${livres[0]} está livre.`}
              </p>
            )}
          </div>
        </Aviso>
      )}

      <p className="text-xs text-texto-3">O nome passa a valer em todo o cérebro da marca. Dá para trocar depois.</p>
    </div>
  )
}

const STATUS: Record<Checagem["status"], { rotulo: string; icone: typeof Check; classe: string; texto: string }> = {
  livre: { rotulo: "livre", icone: Check, classe: "text-sucesso", texto: "text-sucesso-texto" },
  verificar: { rotulo: "a confirmar", icone: CircleDashed, classe: "text-atencao-texto", texto: "text-atencao-texto" },
  "em uso": { rotulo: "em uso", icone: CircleMinus, classe: "text-erro", texto: "text-erro-texto" },
}

function Checagens({ checagens }: { checagens: Checagem[] }) {
  return (
    <ul className="flex flex-col gap-1.5" aria-label="Disponibilidade">
      {checagens.map((checagem) => {
        const status = STATUS[checagem.status]
        return (
          <li key={checagem.canal} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-baseline gap-x-3 text-xs">
            <span className="text-texto-3">{checagem.canal}</span>
            <span className="truncate text-texto-2">{checagem.valor}</span>
            <span className={cn("flex items-center gap-1 self-center font-medium", status.texto)}>
              <status.icone className={cn("size-3.5", status.classe)} strokeWidth={2.5} aria-hidden />
              {status.rotulo}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function CartaoOpcao({ opcao, atual, aoEscolher }: { opcao: OpcaoNome; atual: boolean; aoEscolher: () => void }) {
  return (
    <article aria-labelledby={`nome-${opcao.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Tag tamanho="sm">{opcao.territorio}</Tag>
          {opcao.aposta && (
            <Tag tamanho="sm" tom="acao" ponto>
              minha aposta
            </Tag>
          )}
          {opcao.sugerida && <Tag tamanho="sm">sua sugestão</Tag>}
          {atual && <Tag tamanho="sm" tom="feita">escolhido antes</Tag>}
        </div>
        <h3 id={`nome-${opcao.id}`} className="font-heading text-titulo-1 font-medium">
          {opcao.nome}
        </h3>
        <p className="text-corpo text-texto">{opcao.significado}</p>
      </header>

      <div className="flex flex-1 flex-col gap-4 border-t border-borda-sutil pt-4">
        {opcao.porque.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-semibold text-texto-2">Por que funciona</h4>
            <ul className="flex flex-col gap-1 text-sm">
              {opcao.porque.map((motivo) => (
                <li key={motivo} className="flex gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-sucesso" strokeWidth={2.5} aria-hidden />
                  {motivo}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm">
          <span className="text-xs font-semibold text-texto-2">Como soa · </span>
          {opcao.soa}
        </p>
        {opcao.atencao && (
          <p className="flex gap-2 text-sm text-texto-2">
            <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-atencao-texto" strokeWidth={2.25} aria-hidden />
            <span>
              <span className="sr-only">Ponto de atenção: </span>
              {opcao.atencao}
            </span>
          </p>
        )}
      </div>

      <footer className="flex flex-col gap-4 border-t border-borda-sutil pt-4">
        <Checagens checagens={opcao.checagens} />
        <Botao variante={opcao.aposta ? "primario" : "secundario"} tamanho="sm" className="self-start" onClick={aoEscolher}>
          <Check /> Escolher {opcao.nome}
        </Botao>
      </footer>
    </article>
  )
}

function NomeEscolhido({
  opcao,
  outras,
  marca,
  aoEditar,
  aoReabrir,
  aoTrocarPara,
}: {
  opcao: OpcaoNome
  outras: OpcaoNome[]
  marca: Marca
  aoEditar: () => void
  aoReabrir: () => void
  aoTrocarPara: (opcao: OpcaoNome) => void
}) {
  return (
    <>
      <section aria-labelledby="titulo-escolhido" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-escolhido" titulo="nome da marca">
          <Botao variante="secundario" tamanho="sm" onClick={aoReabrir}>
            <RotateCcw /> Ver as opções de novo
          </Botao>
        </CabecalhoBloco>
        <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <p className="font-serif text-display leading-none" style={{ color: marca.paleta[0].hex }}>
              {opcao.nome}
            </p>
            <p className="max-w-[62ch] text-destaque font-light">{opcao.significado}</p>
          </div>
          <dl className="grid grid-cols-2 gap-y-4 border-t border-borda-sutil pt-4 @3xl:grid-cols-4">
            <Fato rotulo="Território" valor={opcao.territorio} />
            <Fato rotulo="Como soa" valor={opcao.soa} divisoria />
            {opcao.checagens.slice(0, 2).map((checagem) => (
              <Fato key={checagem.canal} rotulo={checagem.canal} valor={checagem.valor} divisoria />
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="titulo-porque-nome" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-porque-nome" titulo="por que esse nome">
          <Botao variante="secundario" tamanho="sm" onClick={aoEditar}>
            <MessageCircle /> Perguntar ao Hattie
          </Botao>
        </CabecalhoBloco>
        <div className="grid grid-cols-1 gap-5 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] @3xl:gap-0">
          <div className="flex flex-col gap-3 @3xl:pe-6">
            <h3 className="text-xs font-semibold text-texto-2">O que ele faz pela marca</h3>
            <ol className="flex flex-col gap-2.5">
              {opcao.porque.map((motivo, indice) => (
                <li key={motivo} className="flex gap-3 text-sm">
                  <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-preenchimento-ativo text-micro tabular-nums">
                    {indice + 1}
                  </span>
                  {motivo}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-3 border-t border-borda-sutil pt-4 @3xl:border-t-0 @3xl:border-s @3xl:ps-6 @3xl:pt-0">
            <h3 className="text-xs font-semibold text-texto-2">Disponibilidade</h3>
            <Checagens checagens={opcao.checagens} />
            {opcao.atencao && <p className="text-xs text-texto-3">{opcao.atencao}</p>}
          </div>
        </div>
      </section>

      {outras.length > 0 && (
        <section aria-labelledby="titulo-outras" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-outras" titulo="outras opções" quantidade={outras.length} />
          <ul className="flex flex-col rounded-3xl bg-superficie px-5 md:px-6">
            {outras.map((outra) => (
              <li
                key={outra.id}
                className="flex flex-col gap-3 border-b border-borda-sutil py-4 last:border-b-0 @3xl:flex-row @3xl:items-center @3xl:gap-6"
              >
                <div className="flex min-w-0 flex-col gap-0.5 @3xl:w-56 @3xl:shrink-0">
                  <h3 className="font-heading text-titulo-3 font-medium">{outra.nome}</h3>
                  <p className="text-xs text-texto-3">{outra.territorio}</p>
                </div>
                <p className="min-w-0 flex-1 text-sm text-texto-2">{outra.significado}</p>
                <Botao variante="secundario" tamanho="sm" className="self-start @3xl:self-center" onClick={() => aoTrocarPara(outra)}>
                  Trocar por esta
                </Botao>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function Fato({ rotulo, valor, divisoria = false }: { rotulo: string; valor: string; divisoria?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5 pe-4", divisoria && "@3xl:border-s @3xl:border-borda-sutil @3xl:ps-4")}>
      <dt className="text-xs text-texto-3">{rotulo}</dt>
      <dd className="truncate text-sm font-medium">{valor}</dd>
    </div>
  )
}

function Processo({ processo, singular = false }: { processo: ProcessoNome; singular?: boolean }) {
  const { funil } = processo
  return (
    <section aria-labelledby="titulo-processo" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-processo" titulo={singular ? "como cheguei nesse nome" : "como cheguei nesses nomes"} />
      <div className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
        <p className="text-sm text-texto-2">
          Gerei <strong className="font-semibold text-texto">{funil.gerados} nomes</strong>,{" "}
          <strong className="font-semibold text-texto">{funil.passaram}</strong> passaram nos critérios e trouxe os{" "}
          <strong className="font-semibold text-texto">{funil.finalistas}</strong> mais fortes.
        </p>
        <ol className="grid grid-cols-1 gap-y-5 border-t border-borda-sutil pt-4 @3xl:grid-cols-3">
          <Etapa numero={1} titulo="O que eu ouvi" primeira>
            <ul className="flex flex-col gap-1.5">
              {processo.ouvi.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Etapa>
          <Etapa numero={2} titulo="Territórios">
            <dl className="flex flex-col gap-1.5">
              {processo.territorios.map((territorio) => (
                <div key={territorio.nome}>
                  <dt className="inline font-medium text-texto">{territorio.nome}</dt>
                  <dd className="inline text-texto-2"> · {territorio.ideia}</dd>
                </div>
              ))}
            </dl>
          </Etapa>
          <Etapa numero={3} titulo="Critérios">
            <ul className="flex flex-col gap-1.5">
              {processo.criterios.map((criterio) => (
                <li key={criterio}>{criterio}</li>
              ))}
            </ul>
          </Etapa>
        </ol>
      </div>
    </section>
  )
}

function Etapa({ numero, titulo, primeira = false, children }: { numero: number; titulo: string; primeira?: boolean; children: React.ReactNode }) {
  return (
    <li className={cn("flex flex-col gap-2 text-sm text-texto-2 @3xl:pe-5", !primeira && "@3xl:border-s @3xl:border-borda-sutil @3xl:ps-5")}>
      <h3 className="flex items-center gap-2 text-xs font-semibold text-texto">
        <span aria-hidden className="grid size-5 place-items-center rounded-full bg-preenchimento-ativo text-micro tabular-nums">
          {numero}
        </span>
        {titulo}
      </h3>
      {children}
    </li>
  )
}

function FormSugestao({ aberta, aoMudar, aoSugerir }: { aberta: boolean; aoMudar: (aberta: boolean) => void; aoSugerir: (opcao: OpcaoNome) => void }) {
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Qual nome você pensou?")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const motivo = String(dados.get("motivo") ?? "").trim()
    aoSugerir({
      id: `sugestao-${Date.now()}`,
      nome,
      territorio: "Sua ideia",
      significado: motivo || "Eu completo o significado e o porquê depois de olhar o nome com calma.",
      porque: [],
      soa: "A definir",
      checagens: [
        { canal: "Domínio", valor: "checando", status: "verificar" },
        { canal: "Instagram", valor: "checando", status: "verificar" },
        { canal: "INPI", valor: "Classe 3, cosméticos", status: "verificar" },
      ],
      sugerida: true,
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
      titulo="sugerir um nome"
      descricao="Tem um nome em mente? Ele entra entre as opções e eu checo domínio, Instagram e registro."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-nome">
          <Plus /> Sugerir nome
        </Botao>
      }
    >
      <form id="form-nome" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <Campo name="nome" rotulo="Nome" placeholder="Ex.: Flor do Pequi" erro={erro} autoFocus />
        <CampoArea name="motivo" rotulo="Por que esse nome" placeholder="O que ele quer dizer para você" dica="Opcional" />
      </form>
    </Janela>
  )
}
