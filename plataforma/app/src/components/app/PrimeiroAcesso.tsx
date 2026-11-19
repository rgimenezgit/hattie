"use client"

import Image from "next/image"
import Link from "next/link"
import { useId, useRef, useState, type DragEvent } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, CircleHelp, Download, FileUp, Play, Sparkle } from "lucide-react"
import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Botao } from "@/components/hattie/Botao"
import { Composer, type ComposerHandle } from "@/components/hattie/Composer"
import { Janela } from "@/components/hattie/Janela"
import { Segmentado } from "@/components/hattie/Segmentado"
import { cn } from "@/lib/utils"
import { PESSOA } from "@/lib/mock"
import { useEstado } from "./Estado"

const IDEIAS = [
  "Faço cosméticos naturais em Ribeirão Preto, com ingredientes do cerrado, e vendo pelo Instagram e WhatsApp.",
  "Tenho uma confeitaria artesanal em Londrina e quero começar a vender bolos por encomenda para empresas.",
  "Vou abrir um estúdio de tatuagem fine line em Belo Horizonte, focado em quem faz a primeira tatuagem.",
]

const EXEMPLOS = ["Cosméticos naturais", "Confeitaria artesanal", "Estúdio de tatuagem"]

/** Vídeos de tutorial. Por enquanto são marcadores; os vídeos de verdade entram depois. */
const VIDEOS = [
  { id: "ideia", titulo: "Como contar a sua ideia", texto: "O que escrever para eu acertar de primeira.", duracao: "0:45", fundo: "var(--lilas)", cor: "var(--violeta)" },
  { id: "importar", titulo: "Trazendo a marca que você já tem", texto: "Logo, manual, posts e links: o que mandar.", duracao: "1:10", fundo: "var(--lima)", cor: "var(--preto)" },
  { id: "referencias", titulo: "Referências que ajudam", texto: "Marcas que você admira e por quê.", duracao: "0:50", fundo: "var(--azul)", cor: "var(--preto)" },
  { id: "aprovar", titulo: "Aprovando ponto por ponto", texto: "Do primeiro rascunho à marca pronta.", duracao: "1:30", fundo: "var(--rosa)", cor: "var(--preto)" },
]

/** Passo a passo de cada modo, aberto pelo "Como preencher". */
const GUIA = {
  criar: {
    titulo: "como contar a sua ideia",
    descricao: "Escreva do seu jeito, como se fosse para uma amiga. Quanto mais ingredientes, melhor a marca.",
    passos: [
      ["O que você vende", "Produto ou serviço, e o que ele tem de especial. Ex.: cosméticos com óleo de pequi, feitos em lote pequeno."],
      ["Para quem", "Quem compra hoje ou quem você quer alcançar. Idade, região, o que essa pessoa valoriza."],
      ["Onde vende", "Instagram, WhatsApp, feira, loja física, site. Ajuda a pensar nas peças."],
      ["O que te inspira", "Marcas, lugares, cores, músicas. Pode colar links ou mandar prints."],
      ["Anexos", "Fotos dos produtos, rascunhos e qualquer material que você já tenha. PDF, imagens e vídeos."],
    ],
    exemplo: IDEIAS[0],
  },
  importar: {
    titulo: "como trazer a sua marca",
    descricao: "Eu leio o que você já tem, organizo no cérebro da marca e aponto o que está faltando.",
    passos: [
      ["Arraste os arquivos", "Logo (de preferência em SVG ou PNG), manual de marca, posts, fotos e apresentações."],
      ["Cole os links", "Site, Instagram, loja virtual. Eu leio cores, fontes, textos e o jeito de falar."],
      ["Conte o que quer mudar", "Se tem algo que você não gosta ou quer atualizar, escreva no campo de texto."],
      ["Confira o que encontrei", "Depois da leitura, você revisa ponto por ponto e completa o que faltar comigo."],
    ],
    exemplo: "Minha marca é a Raiz Natural. O site é raiznatural.com.br e o Instagram é @raiznatural. Quero modernizar o logo sem perder o verde.",
  },
} as const

/**
 * Primeiro acesso: o Hattie feliz, "vamos tirar sua marca do chapéu", o seletor Criar marca / Importar marca e o campo.
 * O topo não se mexe ao trocar de modo (a página começa do alto e só o que fica abaixo do campo muda).
 * Importar mostra uma área grande para soltar arquivos. Os dois modos têm "Como preencher", com o passo a passo,
 * e embaixo há um carrossel de vídeos de tutorial.
 */
export function PrimeiroAcesso() {
  const router = useRouter()
  const { iniciarCriacao, concluirCriacao } = useEstado()
  const [modo, setModo] = useState<"criar" | "importar">("criar")
  const [guia, setGuia] = useState(false)
  const composer = useRef<ComposerHandle>(null)
  const criar = modo === "criar"

  function enviar(texto: string, anexos: string[]) {
    iniciarCriacao(texto || "Seguem os materiais da minha marca.", anexos)
    if (criar) {
      router.push("/marca/raiz-natural/hattie/criacao")
      return
    }
    concluirCriacao()
    router.push("/marca/raiz-natural/criando")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background px-4 py-6 md:px-10">
      <Link href="/" aria-label="Hattie" className="self-start">
        <Image src="/logos/hattie-logomarca.svg" alt="" width={160} height={34} priority className="h-7 w-auto" />
      </Link>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-6 pt-[6vh] pb-8">
        <div className="flex flex-col items-center gap-4 text-center animate-entrada">
          <Image src="/personagem/hattie-feliz.svg" alt="" width={1553} height={1024} priority className="h-24 w-auto md:h-28" />
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-titulo-1 font-medium lowercase md:text-display">vamos tirar sua marca do chapéu</h1>
            <p className="text-destaque leading-snug text-texto-2">
              Oi, {PESSOA.nome}! {criar ? "Me conta a sua ideia do seu jeito." : "Me mostra a marca que você já tem."}
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-2.5">
          <Segmentado
            rotulo="O que você quer fazer"
            valor={modo}
            onChange={(valor) => setModo(valor as "criar" | "importar")}
            opcoes={[
              { valor: "criar", rotulo: "Criar marca", icone: Sparkle },
              { valor: "importar", rotulo: "Importar marca", icone: Download },
            ]}
          />
          {!criar && <AreaSoltar aoSoltar={(lista) => composer.current?.anexar(lista)} />}
          <Composer
            ref={composer}
            autoFocus
            rotulo={criar ? "Sua ideia de marca" : "Materiais da sua marca"}
            placeholder={criar ? "Me conta sua ideia: o que você vende, pra quem, onde, e o que te inspira" : "Cole os links da marca (site, Instagram) ou conte o que quer mudar"}
            exigirTexto={criar ? "Me conta pelo menos uma frase sobre a sua ideia." : "Solte um arquivo na área acima ou cole um link."}
            sugestoes={criar ? IDEIAS : undefined}
            onEnviar={enviar}
          />
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2">
            <p className="text-xs text-texto-2">
              {criar ? "Pode mandar PDF, imagens, vídeos e links. Quanto mais ingredientes, melhor a marca." : "Eu leio cores, fontes, textos e o jeito de falar de tudo que você mandar."}
            </p>
            <button type="button" onClick={() => setGuia(true)} className="inline-flex items-center gap-1.5 text-xs font-semibold underline-offset-4 hover:underline">
              <CircleHelp className="size-3.5" strokeWidth={2.25} aria-hidden /> Como preencher
            </button>
          </div>
        </div>

        <div className="flex min-h-8 flex-wrap items-center justify-center gap-2">
          {criar && (
            <>
              <span className="text-sm text-texto-2">Experimente:</span>
              {EXEMPLOS.map((exemplo, indice) => (
                <button
                  key={exemplo}
                  type="button"
                  onClick={() => composer.current?.preencher(IDEIAS[indice])}
                  className="clique h-8 rounded-full bg-preenchimento px-3 text-detalhe font-medium hover:bg-preenchimento-hover"
                >
                  {exemplo}
                </button>
              ))}
            </>
          )}
        </div>

        <Tutoriais />
      </main>

      <JanelaGuia modo={modo} aberta={guia} aoMudar={setGuia} aoUsarExemplo={(texto) => composer.current?.preencher(texto)} />
    </div>
  )
}

/** Área grande para soltar os arquivos da marca no modo Importar. Sem contorno: fundo neutro, lima-suave ao arrastar. */
function AreaSoltar({ aoSoltar }: { aoSoltar: (lista: FileList | null) => void }) {
  const id = useId()
  const entrada = useRef<HTMLInputElement>(null)
  const [arrastando, setArrastando] = useState(false)
  const [quantos, setQuantos] = useState(0)

  function receber(lista: FileList | null) {
    if (!lista?.length) return
    aoSoltar(lista)
    setQuantos((atual) => atual + lista.length)
  }

  return (
    <div
      onDragOver={(evento: DragEvent) => {
        evento.preventDefault()
        setArrastando(true)
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={(evento: DragEvent) => {
        evento.preventDefault()
        setArrastando(false)
        receber(evento.dataTransfer.files)
      }}
      className={cn(
        "flex flex-col items-center gap-3 rounded-3xl px-6 py-8 text-center transition-[background-color] duration-150 motion-safe:animate-[aparecer_200ms_ease-out]",
        arrastando ? "bg-acao-suave" : "bg-superficie shadow-(--sombra-campo)",
      )}
    >
      <span className={cn("grid size-14 place-items-center rounded-full transition-[background-color] duration-150", arrastando ? "bg-lima" : "bg-preenchimento")}>
        <FileUp className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-heading text-titulo-3 font-medium lowercase">{arrastando ? "pode soltar" : "arraste os arquivos da sua marca"}</p>
        <p className="text-sm text-texto-2">Logo, manual, posts, fotos e apresentações. PDF, imagens e vídeos.</p>
      </div>
      <Botao variante="secundario" tamanho="sm" onClick={() => entrada.current?.click()}>
        Escolher do computador
      </Botao>
      <input ref={entrada} id={id} type="file" multiple accept="image/*,video/*,application/pdf" className="sr-only" onChange={(evento) => receber(evento.target.files)} />
      {quantos > 0 && (
        <p role="status" className="text-xs font-medium text-texto-2">
          {quantos === 1 ? "1 arquivo pronto" : `${quantos} arquivos prontos`}. Eles aparecem no campo abaixo.
        </p>
      )}
    </div>
  )
}

/** Carrossel de tutoriais em vídeo (marcadores até os vídeos de verdade chegarem). */
function Tutoriais() {
  const trilho = useRef<HTMLUListElement>(null)
  const [aberto, setAberto] = useState<(typeof VIDEOS)[number] | null>(null)
  const andar = (sentido: 1 | -1) => trilho.current?.scrollBy({ left: sentido * 296, behavior: "smooth" })

  return (
    <section aria-labelledby="titulo-tutoriais" className="mt-6 flex w-full max-w-4xl flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <h2 id="titulo-tutoriais" className="font-heading text-titulo-3 font-medium lowercase">
            aprenda em um minuto
          </h2>
          <p className="text-sm text-texto-2">Vídeos curtos sobre como preencher e o que acontece depois.</p>
        </div>
        <div className="hidden shrink-0 gap-1 sm:flex">
          <Botao variante="secundario" tamanho="icone" aria-label="Vídeos anteriores" onClick={() => andar(-1)}>
            <ChevronLeft />
          </Botao>
          <Botao variante="secundario" tamanho="icone" aria-label="Próximos vídeos" onClick={() => andar(1)}>
            <ChevronRight />
          </Botao>
        </div>
      </div>
      <ul ref={trilho} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:scroll-px-0 md:px-0">
        {VIDEOS.map((video) => (
          <li key={video.id} className="w-72 shrink-0 snap-start">
            <button type="button" onClick={() => setAberto(video)} className="group/video flex w-full flex-col gap-2 rounded-3xl bg-superficie p-2 text-start transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)">
              <span className="relative block aspect-video overflow-hidden rounded-2xl">
                <BlocoImagem className="size-full rounded-none outline-0" fundo={video.fundo} cor={video.cor} borda="bottom" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full bg-preto text-lima transition-[scale] duration-150 group-hover/video:scale-110 motion-reduce:transition-none">
                    <Play className="size-5 translate-x-px fill-current" strokeWidth={0} aria-hidden />
                  </span>
                </span>
                <span className="absolute right-2 bottom-2 rounded-md bg-preto/70 px-1.5 py-0.5 text-micro font-medium text-branco tabular-nums">{video.duracao}</span>
              </span>
              <span className="flex flex-col px-1.5 pb-1.5">
                <span className="text-sm font-semibold">{video.titulo}</span>
                <span className="text-xs text-texto-2">{video.texto}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Janela aberta={!!aberto} aoMudar={(valor) => !valor && setAberto(null)} largura="xl" titulo={aberto?.titulo.toLowerCase() ?? ""} descricao={aberto?.texto}>
        {aberto && (
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <BlocoImagem className="size-full rounded-none outline-0" fundo={aberto.fundo} cor={aberto.cor} borda="bottom" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="rounded-full bg-preto px-4 py-2 text-sm font-medium text-lima">O vídeo entra aqui em breve</span>
            </span>
          </div>
        )}
      </Janela>
    </section>
  )
}

function JanelaGuia({
  modo,
  aberta,
  aoMudar,
  aoUsarExemplo,
}: {
  modo: "criar" | "importar"
  aberta: boolean
  aoMudar: (aberta: boolean) => void
  aoUsarExemplo: (texto: string) => void
}) {
  const guia = GUIA[modo]
  return (
    <Janela
      aberta={aberta}
      aoMudar={aoMudar}
      largura="lg"
      titulo={guia.titulo}
      descricao={guia.descricao}
      rodape={
        <div className="flex w-full justify-end gap-2">
          <Botao variante="fantasma" onClick={() => aoMudar(false)}>
            Fechar
          </Botao>
          <Botao
            variante="primario"
            onClick={() => {
              aoUsarExemplo(guia.exemplo)
              aoMudar(false)
            }}
          >
            Usar o exemplo
          </Botao>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <ol className="flex flex-col gap-3">
          {guia.passos.map(([titulo, texto], indice) => (
            <li key={titulo} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-lima text-xs font-semibold text-preto tabular-nums">{indice + 1}</span>
              <span className="flex flex-col pt-0.5">
                <span className="text-sm font-semibold">{titulo}</span>
                <span className="text-sm text-texto-2">{texto}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-1 rounded-2xl bg-preenchimento p-4">
          <span className="text-xs font-semibold text-texto-2">Exemplo</span>
          <p className="text-sm">“{guia.exemplo}”</p>
        </div>
      </div>
    </Janela>
  )
}
