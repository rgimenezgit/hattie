"use client"

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"
import { Armchair, Camera, Check, ChevronDown, Copy, Film, Frame, Layers, MessageCircle, Palette, PenLine, Plus, RefreshCw, Shapes, SquarePen, Sun, Users, X, type LucideIcon } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Aviso } from "@/components/hattie/Aviso"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { EnvioImagens, type ImagemEnviada } from "@/components/hattie/EnvioImagens"
import { Campo, CampoArea, CampoLista } from "@/components/hattie/Campo"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"
import type { CamadaFoto, EstiloFoto, IdCamadaFoto, ImagemFoto, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { Ilustracao, type CoresDesenho } from "./Ilustracao"
import { useEstado } from "./Estado"

type Props = { secao: Secao; aoEditar: () => void }

type Paleta = { nome: string; hex: string }[]
type Valor = (camada: IdCamadaFoto, campo: string) => string | undefined

/**
 * O que muda entre fotografia e ilustração: ícones das camadas, linhas do resumo, prévia, imagem dos cards,
 * prompt e os textos de apoio. A estrutura (briefing, imagens, camadas, avaliação) é a mesma.
 */
type ConfigEstilo = {
  tipo: "fotografia" | "ilustracao"
  rotuloAbas: string
  icones: Partial<Record<IdCamadaFoto, LucideIcon>>
  resumo: [string, IdCamadaFoto, string][]
  previa: (dados: { estilo: EstiloFoto; paleta: Paleta; valor: Valor }) => ReactNode
  imagem: (estilo: EstiloFoto, imagem: ImagemFoto) => ReactNode
  prompt: string
  textos: {
    gerando: string
    nota: string
    evitar: string
    descricao: string
    registro: string
    referencias: string
    novo: string
    exNome: string
    exUso: string
    camadas: string
    cegas: string
    escorrega: string
  }
}

/** Cores do desenho a partir da paleta da camada de cor: principal, apoio, fundo claro, escuro e destaque. */
export function coresDaPaleta(paleta: Paleta, fundo?: string): CoresDesenho {
  const hex = (indice: number, padrao: string) => paleta[indice]?.hex ?? padrao
  return { principal: hex(0, "#2F4A3A"), apoio: hex(1, "#C9A27E"), fundo: fundo ?? hex(2, "#F2EBDD"), escuro: hex(3, "#5C3B28"), destaque: hex(4, hex(1, "#C9A27E")) }
}

const paletaDe = (estilo: EstiloFoto) => estilo.camadas.find((camada) => camada.id === "cor")?.paleta ?? []

const FOTOGRAFIA: ConfigEstilo = {
  tipo: "fotografia",
  rotuloAbas: "Estilos fotográficos",
  icones: { cor: Palette, luz: Sun, camera: Camera, sujeitos: Users, ambiente: Armchair, acabamento: Film },
  resumo: [
    ["Luz", "luz", "Fonte"],
    ["Câmera", "camera", "Profundidade de campo"],
    ["Pessoas", "sujeitos", "Linguagem corporal"],
    ["Materiais", "ambiente", "Materiais"],
    ["Tratamento", "cor", "Gradação"],
    ["Acabamento", "acabamento", "Pós-produção"],
  ],
  previa: ({ paleta, valor }) => {
    const [apoio, claro, escuro] = [paleta[1]?.hex ?? "#C9A27E", paleta[2]?.hex ?? "#F2EBDD", paleta[3]?.hex ?? "#5C3B28"]
    return (
      <>
        <BlocoImagem className="aspect-[4/5] rounded-2xl" fundo={claro} cor={escuro} borda="right" legenda={`Luz ${valor("luz", "Direção")?.toLowerCase().split(",")[0] ?? "lateral"}`} />
        <BlocoImagem className="aspect-[4/5] rounded-2xl" fundo={apoio} cor={claro} borda="left" legenda="Detalhe de mãos e produto" />
        <BlocoImagem className="aspect-[4/5] rounded-2xl" fundo={paleta[0]?.hex ?? "#2F4A3A"} cor={apoio} borda="bottom" legenda="Ambiente e colheita" />
      </>
    )
  },
  imagem: (_estilo, imagem) => <BlocoImagem className="aspect-[4/3] rounded-none outline-0" fundo={imagem.fundo} cor={imagem.luz} borda={imagem.borda} />,
  prompt: "Fotografia",
  textos: {
    gerando: "Aplicando as seis camadas do estilo em cada cena.",
    nota: "Nesta versão de teste, as imagens são esboços de composição nas cores do estilo. O prompt de cada uma já está pronto para gerar a imagem de verdade.",
    evitar: "O que tira a foto do estilo, em qualquer cena",
    descricao: "O que aparece nas fotos: cenas, pessoas, lugares, objetos",
    registro: "Uma frase: o que a foto transmite",
    referencias: "O ideal é de 15 a 30 imagens, em cenas diferentes, que mostrem o mesmo jeito de fotografar.",
    novo: "Um estilo para outro uso, como produto em fundo neutro ou bastidores. Ele começa a partir de um estilo que já existe, e você ajusta as camadas.",
    exNome: "Ex.: Produto em fundo neutro",
    exUso: "Ex.: Loja online e catálogo",
    camadas: "cor, luz, câmera e composição, sujeitos, ambiente e acabamento",
    cegas: "{config.textos.cegas}",
    escorrega: "{config.textos.escorrega}",
  },
}

const LEGENDAS_ILUSTRACAO = { pequi: "Ingrediente", paisagem: "Paisagem de origem", frasco: "Produto e folhas" } as const

const ILUSTRACAO: ConfigEstilo = {
  tipo: "ilustracao",
  rotuloAbas: "Estilos de ilustração",
  icones: { cor: Palette, traco: PenLine, forma: Shapes, textura: Layers, figuras: Users, composicao: Frame },
  resumo: [
    ["Cor", "cor", "Aplicação"],
    ["Traço", "traco", "Espessura"],
    ["Forma", "forma", "Geometria"],
    ["Textura", "textura", "Textura"],
    ["Figuras", "figuras", "Pessoas"],
    ["Composição", "composicao", "Respiro"],
  ],
  previa: ({ paleta }) => (
    <>
      {(["pequi", "paisagem", "frasco"] as const).map((desenho) => (
        <div key={desenho} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Ilustracao desenho={desenho} cores={coresDaPaleta(paleta)} />
          <span className="absolute bottom-2 left-2 rounded-full bg-background px-2.5 py-1 text-xs font-medium">{LEGENDAS_ILUSTRACAO[desenho]}</span>
        </div>
      ))}
    </>
  ),
  imagem: (estilo, imagem) => (
    <div className="aspect-[4/3]">
      <Ilustracao desenho={imagem.desenho ?? "pequi"} cores={coresDaPaleta(paletaDe(estilo), imagem.fundo)} />
    </div>
  ),
  prompt: "Ilustração",
  textos: {
    gerando: "Aplicando as seis camadas do estilo em cada desenho.",
    nota: "Nesta versão de teste, as ilustrações são esboços nas cores e no traço do estilo. O prompt de cada uma já está pronto para gerar a imagem de verdade.",
    evitar: "O que tira a ilustração do estilo, em qualquer desenho",
    descricao: "O que aparece nos desenhos: ingredientes, plantas, pessoas, objetos, paisagens",
    registro: "Uma frase: o que o desenho transmite",
    referencias: "O ideal é de 15 a 30 ilustrações com o mesmo traço, em assuntos diferentes.",
    novo: "Um estilo para outro uso, como ícones ilustrados ou padrões de embalagem. Ele começa a partir de um estilo que já existe, e você ajusta as camadas.",
    exNome: "Ex.: Padrão de embalagem",
    exUso: "Ex.: Papel de presente e caixas",
    camadas: "cor, traço, forma, textura, figuras e composição",
    cegas: "Coloque 8 ilustrações aprovadas ao lado de 2 novas e peça para alguém apontar as que vieram de outra mão. Se ninguém acerta, o traço está consistente.",
    escorrega: "Traço mudando de espessura, cor fora da paleta, detalhe demais, sombra e brilho, figura com cara de mascote e desenho com cara de banco de imagens.",
  },
}

const ESCALA = [
  { nota: 5, texto: "Não dá para distinguir das referências" },
  { nota: 4, texto: "Consistente; diferenças só aparecem lado a lado" },
  { nota: 3, texto: "Reconhecível, mas a camada já escorregou" },
  { nota: 2, texto: "Parcialmente alinhada, inconsistência visível" },
  { nota: 1, texto: "Quebra o sistema da marca nesta camada" },
]

const media = (notas: number[]) => notas.reduce((soma, nota) => soma + nota, 0) / notas.length
const pronta = (notas: number[]) => media(notas) >= 4 && Math.min(...notas) > 2
const formatar = (numero: number) => numero.toFixed(1).replace(".", ",")

/** Estilo fotográfico: cor, luz, câmera e composição, sujeitos e personas, ambiente e produção, acabamento. */
export function SecaoFotografia(props: Props) {
  return <SecaoEstiloImagem {...props} config={FOTOGRAFIA} />
}

/** Estilo de ilustração: cor, traço, forma, textura, figuras e composição. */
export function SecaoIlustracao(props: Props) {
  return <SecaoEstiloImagem {...props} config={ILUSTRACAO} />
}

/**
 * Estilo de imagem, montado pelas camadas do playbook de imagens de marca: registro emocional, seis camadas e o que evitar.
 * Cada estilo começa como briefing com prévia; aprovado, o Hattie gera imagens de exemplo com nota por camada.
 * Dá para criar outros estilos e editar cada camada separadamente.
 */
function SecaoEstiloImagem({ secao, aoEditar, config }: Props & { config: ConfigEstilo }) {
  const { estilosFoto, salvarEstilosFoto, estilosIlustracao, salvarEstilosIlustracao } = useEstado()
  const [salvos, salvarEstilos] = config.tipo === "fotografia" ? [estilosFoto, salvarEstilosFoto] : [estilosIlustracao, salvarEstilosIlustracao]
  const inicial = secao.conteudo.tipo === config.tipo ? secao.conteudo.estilos : []
  const estilos = salvos ?? inicial
  const [ativoId, setAtivoId] = useState(estilos[0]?.id ?? "")
  const [gerandoId, setGerandoId] = useState<string | null>(null)
  const [editando, setEditando] = useState<IdCamadaFoto | "evitar" | "briefing" | null>(null)
  const [criando, setCriando] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])
  if (secao.conteudo.tipo !== config.tipo || estilos.length === 0) return null
  const ativo = estilos.find((estilo) => estilo.id === ativoId) ?? estilos[0]

  function atualizar(id: string, mudar: (estilo: EstiloFoto) => EstiloFoto) {
    salvarEstilos(estilos.map((estilo) => (estilo.id === id ? mudar(estilo) : estilo)))
  }

  function gerar(estilo: EstiloFoto) {
    setGerandoId(estilo.id)
    timer.current = setTimeout(() => {
      atualizar(estilo.id, (atual) => ({ ...atual, status: "pronto", desatualizado: false }))
      setGerandoId(null)
      notificar({ titulo: config.tipo === "fotografia" ? "imagens prontas" : "ilustrações prontas", texto: `Gerei ${estilo.imagens.length} ${config.tipo === "fotografia" ? "imagens" : "ilustrações"} no estilo ${estilo.nome}.`, som: "tcharam" })
    }, 2200)
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby={`titulo-estilos-${config.tipo}`} className="flex flex-col gap-3">
        <CabecalhoBloco id={`titulo-estilos-${config.tipo}`} titulo="estilos" quantidade={estilos.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={() => setCriando(true)}>
            <Plus /> Criar<span className="max-sm:sr-only"> outro estilo</span>
          </Botao>
        </CabecalhoBloco>
        <Abas value={ativo.id} onValueChange={setAtivoId}>
          <ListaAbas rotulo={config.rotuloAbas} itens={estilos.map((estilo) => ({ valor: estilo.id, rotulo: estilo.nome }))} />
          {estilos.map((estilo) => (
            <ConteudoAba key={estilo.id} value={estilo.id} className="flex flex-col gap-10">
              <Briefing config={config} estilo={estilo} gerando={gerandoId === estilo.id} aoAprovar={() => gerar(estilo)} aoEditar={aoEditar} aoEditarBriefing={() => setEditando("briefing")}
                aoMudarReferencias={(imagens) => atualizar(estilo.id, (atual) => ({ ...atual, referencias: imagens }))}
              />
              {estilo.status === "pronto" && gerandoId !== estilo.id && (
                <Imagens
                  config={config}
                  estilo={estilo}
                  aoGerarDeNovo={() => gerar(estilo)}
                  aoGerarMais={() => {
                    const extras = estilo.imagens.slice(0, 3).map((imagem, indice) => ({ ...imagem, id: `${imagem.id}-${Date.now()}-${indice}`, notas: imagem.notas.map((nota) => Math.max(3, nota - (indice % 2))) }))
                    atualizar(estilo.id, (atual) => ({ ...atual, imagens: [...atual.imagens, ...extras] }))
                    notificar({ titulo: "mais imagens", texto: `Gerei mais três ${config.tipo === "fotografia" ? "imagens" : "ilustrações"} no mesmo estilo.`, tipo: "sucesso" })
                  }}
                />
              )}
              <Camadas config={config} estilo={estilo} aoEditarCamada={setEditando} />
            </ConteudoAba>
          ))}
        </Abas>
      </section>

      <Avaliacao config={config} />

      <EditarCamada
        estilo={ativo}
        alvo={editando}
        aoFechar={() => setEditando(null)}
        aoSalvar={(mudanca) => {
          atualizar(ativo.id, (atual) => ({ ...mudanca(atual), desatualizado: atual.status === "pronto" }))
          setEditando(null)
          notificar({ titulo: "estilo atualizado", texto: `Guardei a mudança em ${ativo.nome}.`, tipo: "sucesso" })
        }}
      />
      <CriarEstilo
        config={config}
        aberta={criando}
        aoMudar={setCriando}
        estilos={estilos}
        aoCriar={(novo) => {
          salvarEstilos([...estilos, novo])
          setAtivoId(novo.id)
          setCriando(false)
          notificar({ titulo: "estilo criado", texto: `${novo.nome} começou como briefing. Ajuste as camadas e aprove para gerar as imagens.`, tipo: "sucesso" })
        }}
      />
    </div>
  )
}

function Briefing({
  config,
  estilo,
  gerando,
  aoAprovar,
  aoEditar,
  aoEditarBriefing,
  aoMudarReferencias,
}: {
  config: ConfigEstilo
  estilo: EstiloFoto
  gerando: boolean
  aoAprovar: () => void
  aoEditar: () => void
  aoEditarBriefing: () => void
  aoMudarReferencias: (imagens: ImagemEnviada[]) => void
}) {
  const paleta = paletaDe(estilo)
  const [apoio, claro, escuro] = [paleta[1]?.hex ?? "#C9A27E", paleta[2]?.hex ?? "#F2EBDD", paleta[3]?.hex ?? "#5C3B28"]
  const valor = (id: IdCamadaFoto, rotulo: string) => estilo.camadas.find((camada) => camada.id === id)?.campos.find((campo) => campo.rotulo === rotulo)?.valor

  return (
    <article aria-label={`Briefing do estilo ${estilo.nome}`} className="flex flex-col gap-5 rounded-3xl bg-superficie p-5 md:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-titulo-2 font-medium lowercase">{estilo.nome}</h3>
          {estilo.status === "briefing" ? (
            <Tag tom="atencao" ponto tamanho="sm">
              briefing para aprovar
            </Tag>
          ) : (
            <Tag tom="sucesso" ponto tamanho="sm">
              aprovado
            </Tag>
          )}
        </div>
        <p className="text-xs text-texto-2">{estilo.uso}</p>
        </div>
        <Botao variante="fantasma" tamanho="sm" onClick={aoEditarBriefing} aria-label={`Editar nome, uso e registro de ${estilo.nome}`}>
          <SquarePen /> Editar
        </Botao>
      </header>
      <div className="flex flex-col gap-2">
        <p className="max-w-[62ch] text-destaque font-light">{estilo.registro}</p>
        {estilo.descricao && <p className="max-w-[70ch] text-sm text-texto-2">{estilo.descricao}</p>}
      </div>

      <div className="grid grid-cols-2 gap-2 @3xl:grid-cols-4" aria-label="Prévia do estilo">
        <div className="flex flex-col overflow-hidden rounded-2xl">
          {paleta.map((item) => (
            <span key={item.hex} className="flex flex-1 items-end px-2.5 py-1.5 text-micro" style={{ backgroundColor: item.hex, color: item.hex === claro || item.hex === apoio ? escuro : claro, minHeight: 28 }}>
              {item.nome} · {item.hex}
            </span>
          ))}
        </div>
        {config.previa({ estilo, paleta, valor })}
      </div>

      <div className="border-t border-borda-sutil pt-4">
        <EnvioImagens
          rotulo={`Imagens de referência${estilo.referencias?.length ? "" : " (nenhuma ainda)"}`}
          dica={`${config.textos.referencias} Elas guiam a geração.`}
          imagens={estilo.referencias ?? []}
          aoMudar={aoMudarReferencias}
          compacto
        />
      </div>

      <dl className="grid grid-cols-1 gap-y-3 border-t border-borda-sutil pt-4 sm:grid-cols-2 @4xl:grid-cols-3">
        {config.resumo.map(([rotulo, camada, campo]) => [rotulo, valor(camada, campo)]).map(([rotulo, texto]) => (
          <div key={rotulo} className="flex flex-col gap-0.5 pe-4">
            <dt className="text-xs text-texto-3">{rotulo}</dt>
            <dd className="text-sm">{texto}</dd>
          </div>
        ))}
      </dl>

      {gerando ? (
        <div aria-live="polite" className="flex items-center gap-3 rounded-2xl bg-preenchimento p-4">
          <IconeHattie nome="asterisco" tamanho={18} className="animate-spin [animation-duration:1.4s] motion-reduce:animate-none" />
          <p className="text-sm">
            <span className="font-semibold">Gerando {config.tipo === "fotografia" ? "as imagens" : "as ilustrações"}.</span> <span className="text-texto-2">{config.textos.gerando}</span>
          </p>
        </div>
      ) : (
        estilo.status === "briefing" && (
          <Aviso
            tipo="info"
            titulo={`Aprove o briefing para eu gerar ${config.tipo === "fotografia" ? "as primeiras imagens" : "as primeiras ilustrações"}`}
            acao={
              <div className="flex flex-wrap gap-2">
                <Botao variante="secundario" tamanho="sm" onClick={aoEditar}>
                  <MessageCircle /> Ajustar com o Hattie
                </Botao>
                <Botao variante="primario" tamanho="sm" onClick={aoAprovar}>
                  <Check /> Aprovar e gerar
                </Botao>
              </div>
            }
          >
            Confira as camadas abaixo. Dá para editar cada uma antes de aprovar.
          </Aviso>
        )
      )}
    </article>
  )
}

function promptDaImagem(config: ConfigEstilo, estilo: EstiloFoto, imagem: ImagemFoto) {
  const camadas = estilo.camadas
    .map((camada) => `${camada.titulo}: ${camada.campos.map((campo) => `${campo.rotulo.toLowerCase()} ${campo.valor.charAt(0).toLowerCase()}${campo.valor.slice(1)}`).join("; ")}.`)
    .join(" ")
  const paleta = estilo.camadas.find((camada) => camada.paleta)?.paleta?.map((cor) => `${cor.nome} ${cor.hex}`).join(", ")
  return `${config.prompt} no estilo "${estilo.nome}". ${estilo.registro} Cena: ${imagem.cena}, enquadramento ${imagem.enquadramento.toLowerCase()}. ${camadas}${paleta ? ` Paleta: ${paleta}.` : ""} Evitar: ${estilo.evitar.join(", ").toLowerCase()}.`
}

function Imagens({ config, estilo, aoGerarDeNovo, aoGerarMais }: { config: ConfigEstilo; estilo: EstiloFoto; aoGerarDeNovo: () => void; aoGerarMais: () => void }) {
  const prontas = estilo.imagens.filter((imagem) => pronta(imagem.notas)).length
  return (
    <section aria-labelledby={`titulo-imagens-${estilo.id}`} className="flex flex-col gap-3">
      <CabecalhoBloco id={`titulo-imagens-${estilo.id}`} titulo={config.tipo === "fotografia" ? "imagens do estilo" : "ilustrações do estilo"} quantidade={estilo.imagens.length}>
        <span className="hidden text-xs text-texto-3 sm:inline">
          {prontas} de {estilo.imagens.length} prontas para uso
        </span>
        <Botao variante="secundario" tamanho="sm" onClick={aoGerarMais}>
          <Plus /> Gerar mais
        </Botao>
      </CabecalhoBloco>
      {estilo.desatualizado && (
        <Aviso
          tipo="atencao"
          titulo={`O estilo mudou depois ${config.tipo === "fotografia" ? "destas imagens" : "destas ilustrações"}`}
          acao={
            <Botao variante="secundario" tamanho="sm" onClick={aoGerarDeNovo}>
              <RefreshCw /> Gerar de novo
            </Botao>
          }
        >
          Gere de novo para seguir as camadas atualizadas.
        </Aviso>
      )}
      <ul className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 @4xl:grid-cols-3">
        {estilo.imagens.map((imagem) => (
          <li key={imagem.id} className="flex min-w-0">
            <CartaoImagem config={config} estilo={estilo} imagem={imagem} />
          </li>
        ))}
      </ul>
      <p className="text-xs text-texto-3">{config.textos.nota}</p>
    </section>
  )
}

function CartaoImagem({ config, estilo, imagem }: { config: ConfigEstilo; estilo: EstiloFoto; imagem: ImagemFoto }) {
  const [aberto, setAberto] = useState(false)
  const nota = media(imagem.notas)
  const ok = pronta(imagem.notas)
  return (
    <article aria-label={imagem.cena} className="flex w-full min-w-0 flex-col overflow-hidden rounded-3xl bg-superficie">
      {config.imagem(estilo, imagem)}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <h4 className="text-sm font-semibold">{imagem.cena}</h4>
            <p className="text-xs text-texto-2">{imagem.enquadramento}</p>
          </div>
          <Tag tom={ok ? "sucesso" : "atencao"} tamanho="sm">
            {formatar(nota)} · {ok ? "pronta" : "revisar"}
          </Tag>
        </div>
        {aberto && (
          <dl className="flex flex-col gap-1.5 border-t border-borda-sutil pt-3">
            {estilo.camadas.map((camada, indice) => {
              const valor = imagem.notas[indice] ?? 0
              return (
                <div key={camada.id} className="grid grid-cols-[104px_minmax(0,1fr)_16px] items-center gap-2 text-xs">
                  <dt className="text-texto-2">{camada.titulo}</dt>
                  <dd className="flex gap-0.5" aria-label={`${valor} de 5`}>
                    {[1, 2, 3, 4, 5].map((ponto) => (
                      <span key={ponto} className={cn("h-1.5 flex-1 rounded-full", ponto <= valor ? (valor <= 2 ? "bg-erro" : valor === 3 ? "bg-atencao" : "bg-sucesso") : "bg-preenchimento-ativo")} />
                    ))}
                  </dd>
                  <span className="text-end tabular-nums text-texto-2">{valor}</span>
                </div>
              )
            })}
          </dl>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-1">
          <Botao variante="fantasma" tamanho="sm" aria-expanded={aberto} onClick={() => setAberto((atual) => !atual)}>
            Notas por camada <ChevronDown className={cn("transition-transform duration-150", aberto && "rotate-180")} />
          </Botao>
          <Botao
            variante="fantasma"
            tamanho="sm"
            onClick={() => {
              navigator.clipboard?.writeText(promptDaImagem(config, estilo, imagem))
              notificar({ titulo: "prompt copiado", texto: "Ele leva as seis camadas do estilo e o que evitar.", tipo: "sucesso" })
            }}
          >
            <Copy /> Copiar prompt
          </Botao>
        </div>
      </div>
    </article>
  )
}

function Camadas({ config, estilo, aoEditarCamada }: { config: ConfigEstilo; estilo: EstiloFoto; aoEditarCamada: (id: IdCamadaFoto | "evitar" | "briefing") => void }) {
  return (
    <section aria-labelledby={`titulo-camadas-${estilo.id}`} className="flex flex-col gap-3">
      <CabecalhoBloco id={`titulo-camadas-${estilo.id}`} titulo="camadas do estilo" quantidade={estilo.camadas.length} />
      <ul className="grid grid-cols-1 gap-3 @4xl:grid-cols-2">
        {estilo.camadas.map((camada) => (
          <li key={camada.id} className="flex min-w-0">
            <CartaoCamada icone={config.icones[camada.id] ?? Palette} camada={camada} aoEditar={() => aoEditarCamada(camada.id)} />
          </li>
        ))}
        <li className="flex min-w-0">
          <article aria-labelledby={`evitar-${estilo.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
            <header className="flex items-start gap-3">
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-erro-suave text-erro-texto">
                <X className="size-4" strokeWidth={2.25} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <h4 id={`evitar-${estilo.id}`} className="text-base font-semibold">
                  O que evitar
                </h4>
                <p className="text-xs text-texto-2">{config.textos.evitar}</p>
              </div>
              <Botao variante="fantasma" tamanho="sm" onClick={() => aoEditarCamada("evitar")} aria-label="Editar o que evitar">
                <SquarePen /> Editar
              </Botao>
            </header>
            <ul className="flex flex-col gap-1.5 text-sm">
              {estilo.evitar.map((item) => (
                <li key={item} className="flex gap-2">
                  <X className="mt-0.5 size-3.5 shrink-0 text-erro" strokeWidth={2.5} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </li>
      </ul>
    </section>
  )
}

function CartaoCamada({ icone: Icone, camada, aoEditar }: { icone: LucideIcon; camada: CamadaFoto; aoEditar: () => void }) {
  return (
    <article aria-labelledby={`camada-${camada.id}`} className="flex w-full min-w-0 flex-col gap-4 rounded-3xl bg-superficie p-5">
      <header className="flex items-start gap-3">
        <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-preenchimento-ativo">
          <Icone className="size-4" strokeWidth={1.75} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <h4 id={`camada-${camada.id}`} className="text-base font-semibold">
            {camada.titulo}
          </h4>
          <p className="text-xs text-texto-2">{camada.pergunta}</p>
        </div>
        <Botao variante="fantasma" tamanho="sm" onClick={aoEditar} aria-label={`Editar ${camada.titulo}`}>
          <SquarePen /> Editar
        </Botao>
      </header>
      {camada.paleta && (
        <ul className="flex gap-1.5" aria-label="Paleta">
          {camada.paleta.map((cor) => (
            <li key={cor.hex} className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="h-8 rounded-lg outline outline-1 -outline-offset-1 outline-borda-sutil" style={{ backgroundColor: cor.hex }} />
              <span className="truncate text-micro text-texto-2">{cor.nome}</span>
              <span className="text-micro text-texto-3 tabular-nums">{cor.hex}</span>
            </li>
          ))}
        </ul>
      )}
      <dl className="flex flex-col">
        {camada.campos.map((campo) => (
          <div key={campo.rotulo} className="grid grid-cols-1 gap-0.5 border-t border-borda-sutil py-2.5 first:border-t-0 first:pt-0 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-3">
            <dt className="text-xs text-texto-3 sm:pt-0.5">{campo.rotulo}</dt>
            <dd className="text-sm">{campo.valor}</dd>
          </div>
        ))}
      </dl>
      {camada.proibidos && camada.proibidos.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-borda-sutil pt-3">
          <span className="text-xs text-texto-3">Fora do estilo:</span>
          {camada.proibidos.map((item) => (
            <Tag key={item} tom="erro" tamanho="sm">
              {item}
            </Tag>
          ))}
        </div>
      )}
    </article>
  )
}

function EditarCamada({
  estilo,
  alvo,
  aoFechar,
  aoSalvar,
}: {
  estilo: EstiloFoto
  alvo: IdCamadaFoto | "evitar" | "briefing" | null
  aoFechar: () => void
  aoSalvar: (mudanca: (estilo: EstiloFoto) => EstiloFoto) => void
}) {
  const camada = estilo.camadas.find((item) => item.id === alvo)
  const titulo = alvo === "evitar" ? "o que evitar" : alvo === "briefing" ? "o estilo" : (camada?.titulo.toLowerCase() ?? "")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const linhas = (nome: string) =>
      String(dados.get(nome) ?? "")
        .split("\n")
        .map((linha) => linha.trim())
        .filter(Boolean)
    if (alvo === "evitar") {
      aoSalvar((atual) => ({ ...atual, evitar: linhas("evitar") }))
      return
    }
    if (alvo === "briefing") {
      const texto = (nome: string, padrao: string) => String(dados.get(nome) ?? "").trim() || padrao
      aoSalvar((atual) => ({
        ...atual,
        nome: texto("nome", atual.nome),
        uso: texto("uso", atual.uso),
        registro: texto("registro", atual.registro),
        descricao: String(dados.get("descricao") ?? "").trim() || undefined,
      }))
      return
    }
    if (!camada) return
    aoSalvar((atual) => ({
      ...atual,
      camadas: atual.camadas.map((item) =>
        item.id === camada.id
          ? {
              ...item,
              campos: item.campos.map((campo, indice) => ({ ...campo, valor: String(dados.get(`campo-${indice}`) ?? campo.valor).trim() || campo.valor })),
              proibidos: item.proibidos ? linhas("proibidos") : undefined,
            }
          : item,
      ),
    }))
  }

  return (
    <Janela
      aberta={alvo !== null}
      aoMudar={(aberta) => !aberta && aoFechar()}
      largura="lg"
      titulo={`editar ${titulo}`}
      descricao={`No estilo ${estilo.nome}. As outras camadas ficam como estão.`}
      rodape={
        <>
          <Botao variante="fantasma" tamanho="sm" onClick={aoFechar}>
            Cancelar
          </Botao>
          <Botao variante="primario" tamanho="sm" type="submit" form="form-camada">
            <Check /> Salvar
          </Botao>
        </>
      }
    >
      <form id="form-camada" key={`${estilo.id}-${alvo}`} onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        {alvo === "briefing" ? (
          <>
            <Campo name="nome" rotulo="Nome do estilo" defaultValue={estilo.nome} />
            <Campo name="uso" rotulo="Onde vai ser usado" defaultValue={estilo.uso} />
            <CampoArea name="descricao" rotulo="Descrição do estilo" defaultValue={estilo.descricao ?? ""} />
            <CampoArea name="registro" rotulo="Como ele deve fazer sentir" dica="O registro emocional: uma frase que guia todas as outras decisões" defaultValue={estilo.registro} />
          </>
        ) : alvo === "evitar" ? (
          <CampoArea name="evitar" rotulo="O que evitar" dica="Um item por linha" defaultValue={estilo.evitar.join("\n")} />
        ) : (
          camada && (
            <>
              {camada.campos.map((campo, indice) => (
                <CampoArea key={campo.rotulo} name={`campo-${indice}`} rotulo={campo.rotulo} defaultValue={campo.valor} rows={1} compacto />
              ))}
              {camada.proibidos && <CampoArea name="proibidos" rotulo="Fora do estilo" dica="Um item por linha" defaultValue={camada.proibidos.join("\n")} />}
            </>
          )
        )}
      </form>
    </Janela>
  )
}

function CriarEstilo({ config, aberta, aoMudar, estilos, aoCriar }: { config: ConfigEstilo; aberta: boolean; aoMudar: (aberta: boolean) => void; estilos: EstiloFoto[]; aoCriar: (estilo: EstiloFoto) => void }) {
  const [erro, setErro] = useState("")
  const [referencias, setReferencias] = useState<ImagemEnviada[]>([])

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const nome = String(dados.get("nome") ?? "").trim()
    if (!nome) {
      setErro("Dá um nome para o estilo.")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const base = estilos.find((estilo) => estilo.id === dados.get("base")) ?? estilos[0]
    const id = `estilo-${Date.now()}`
    aoCriar({
      ...base,
      id,
      nome,
      uso: String(dados.get("uso") ?? "").trim() || "Uso a definir",
      registro: String(dados.get("registro") ?? "").trim() || base.registro,
      descricao: String(dados.get("descricao") ?? "").trim() || undefined,
      referencias,
      status: "briefing",
      desatualizado: false,
      camadas: base.camadas.map((camada) => ({ ...camada, campos: camada.campos.map((campo) => ({ ...campo })), proibidos: camada.proibidos ? [...camada.proibidos] : undefined })),
      evitar: [...base.evitar],
      imagens: base.imagens.map((imagem, indice) => ({ ...imagem, id: `${id}-${indice}` })),
    })
    setErro("")
    setReferencias([])
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) {
          setErro("")
          referencias.forEach((imagem) => URL.revokeObjectURL(imagem.url))
          setReferencias([])
        }
      }}
      largura="lg"
      titulo="novo estilo"
      descricao={config.textos.novo}
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-estilo">
          <Plus /> Criar estilo
        </Botao>
      }
    >
      <form id="form-estilo" onSubmit={enviar} className="grid gap-4 sm:grid-cols-2" noValidate>
        <Campo name="nome" rotulo="Nome do estilo" placeholder={config.textos.exNome} erro={erro} autoFocus />
        <Campo name="uso" rotulo="Onde vai ser usado" placeholder={config.textos.exUso} />
        <CampoArea
          name="descricao"
          rotulo="Descrição do estilo"
          placeholder={config.textos.descricao}
          className="sm:col-span-2"
        />
        <CampoArea name="registro" rotulo="Como ele deve fazer sentir" placeholder={config.textos.registro} dica="Opcional" compacto rows={1} className="sm:col-span-2" />
        <EnvioImagens
          rotulo="Imagens de referência"
          dica={config.textos.referencias}
          imagens={referencias}
          aoMudar={setReferencias}
          className="sm:col-span-2"
        />
        <CampoLista name="base" rotulo="Começar a partir de" dica="As camadas vêm desse estilo; depois você ajusta cada uma." className="sm:col-span-2" opcoes={estilos.map((estilo) => ({ valor: estilo.id, rotulo: estilo.nome }))} />
      </form>
    </Janela>
  )
}

function Avaliacao({ config }: { config: ConfigEstilo }) {
  return (
    <section aria-labelledby={`titulo-avaliacao-${config.tipo}`} className="flex flex-col gap-3">
      <CabecalhoBloco id={`titulo-avaliacao-${config.tipo}`} titulo={config.tipo === "fotografia" ? "como avalio cada imagem" : "como avalio cada ilustração"} />
      <div className="grid grid-cols-1 gap-6 rounded-3xl bg-superficie p-5 md:p-6 @4xl:grid-cols-2 @4xl:gap-0">
        <div className="flex flex-col gap-3 @4xl:pe-6">
          <p className="text-sm text-texto-2">{config.tipo === "fotografia" ? "Cada imagem" : "Cada ilustração"} ganha uma nota de 1 a 5 em cada camada: {config.textos.camadas}.</p>
          <ol className="flex flex-col">
            {ESCALA.map((item) => (
              <li key={item.nota} className="grid grid-cols-[28px_minmax(0,1fr)] items-baseline gap-2 border-t border-borda-sutil py-2 text-sm first:border-t-0 first:pt-0">
                <span className="font-semibold tabular-nums">{item.nota}</span>
                <span className="text-texto-2">{item.texto}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-col gap-3 border-t border-borda-sutil pt-5 @4xl:border-t-0 @4xl:border-s @4xl:ps-6 @4xl:pt-0">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">Pronta para uso</h4>
            <p className="text-sm text-texto-2">Média 4 ou mais, e nenhuma camada com nota 2 ou menos. Uma camada abaixo disso já tira a peça do estilo.</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">Teste às cegas</h4>
            <p className="text-sm text-texto-2">Misture 8 fotos aprovadas com 2 novas e peça para alguém apontar as que não pertencem. Se ninguém acerta, o estilo está consistente.</p>
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold">Onde costuma escorregar</h4>
            <p className="text-sm text-texto-2">Cor puxando para frio, luz dura, pessoa com cara de imagem gerada, cenário genérico, saturação alta e composição centralizada demais.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
