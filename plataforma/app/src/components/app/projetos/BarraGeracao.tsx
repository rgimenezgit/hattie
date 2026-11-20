"use client"

import { useRef, useState } from "react"
import { ArrowUp, ChevronDown, Clapperboard, Clock, Image as IconeImagem, ImagePlus, LayoutTemplate, Palette, Ratio, Sparkles, Upload, X, type LucideIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Botao } from "@/components/hattie/Botao"
import { Plimm } from "@/components/hattie/Plimm"
import { getSecao, type GeracaoItem } from "@/lib/mock"

/*
 * Barra de geração: abre acima da barra do canvas quando a pessoa escolhe Imagem, Vídeo ou Peça.
 * Em cima, o pedido; embaixo, as opções em pílulas: imagem de referência, proporção, resolução (ou duração)
 * e estilo, que traz os estilos da marca e alguns tipos prontos. O que for gerado nasce no centro da tela,
 * ou no ponto que a pessoa marcar clicando no canvas.
 */

export type TipoGeracao = "imagem" | "video" | "peca"

type Opcao = { rotulo: string; formato: [number, number]; nota?: string }

const PROPORCOES: Record<TipoGeracao, Opcao[]> = {
  imagem: [
    { rotulo: "4:5", formato: [4, 5], nota: "Post" },
    { rotulo: "1:1", formato: [1, 1], nota: "Quadrado" },
    { rotulo: "3:4", formato: [3, 4], nota: "Retrato" },
    { rotulo: "16:9", formato: [16, 9], nota: "Paisagem" },
    { rotulo: "9:16", formato: [9, 16], nota: "Story" },
  ],
  video: [
    { rotulo: "9:16", formato: [9, 16], nota: "Reels e story" },
    { rotulo: "16:9", formato: [16, 9], nota: "Paisagem" },
    { rotulo: "1:1", formato: [1, 1], nota: "Quadrado" },
  ],
  peca: [
    { rotulo: "Post 4:5", formato: [4, 5] },
    { rotulo: "Story 9:16", formato: [9, 16] },
    { rotulo: "Quadrado 1:1", formato: [1, 1] },
    { rotulo: "Banner 16:9", formato: [16, 9] },
  ],
}

const RESOLUCOES = [
  { valor: "1K", nota: "Rápida, para testar ideias" },
  { valor: "2K", nota: "Redes sociais e loja" },
  { valor: "4K", nota: "Site grande e impressão" },
]

const DURACOES = ["5 s", "10 s", "15 s"]

const TIPOS_PRONTOS = ["Fotografia de produto", "Produto em cena", "Pessoas e mãos", "Fundo de uma cor"]

const INFO: Record<TipoGeracao, { titulo: string; placeholder: string; icone: LucideIcon }> = {
  imagem: { titulo: "Nova imagem", placeholder: "O que aparece na imagem? Ex.: o frasco na bancada, com luz da manhã", icone: IconeImagem },
  video: { titulo: "Novo vídeo", placeholder: "O que acontece no vídeo? Ex.: a gota do óleo caindo em câmera lenta", icone: Clapperboard },
  peca: { titulo: "Nova peça", placeholder: "Sobre o que é a peça? Ex.: post de lançamento do óleo de pequi", icone: LayoutTemplate },
}

const PILULA =
  "flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-preenchimento px-3 text-detalhe font-medium transition-[background-color] duration-150 hover:bg-preenchimento-hover data-[state=open]:bg-preenchimento-hover [&_svg]:size-3.5"

type Props = {
  tipo: TipoGeracao
  marca: string
  aoEnviar: (texto: string, opcoes: { formato: [number, number]; geracao: GeracaoItem }) => void
  /** Imagem do computador, colocada direto no canvas. */
  aoEnviarArquivo: (arquivo: File) => void
  aoFechar: () => void
}

export function BarraGeracao({ tipo, marca, aoEnviar, aoEnviarArquivo, aoFechar }: Props) {
  const fotografia = getSecao("fotografia")?.conteudo
  const ilustracao = getSecao("ilustracao")?.conteudo
  const estilosFoto = fotografia?.tipo === "fotografia" ? fotografia.estilos.map((estilo) => estilo.nome) : []
  const estilosIlustracao = ilustracao?.tipo === "ilustracao" ? ilustracao.estilos.map((estilo) => `Ilustração: ${estilo.nome}`) : []

  const [texto, setTexto] = useState("")
  const [proporcao, setProporcao] = useState(PROPORCOES[tipo][0].rotulo)
  const [resolucao, setResolucao] = useState("2K")
  const [duracao, setDuracao] = useState("10 s")
  const [estilo, setEstilo] = useState(estilosFoto[0] ?? TIPOS_PRONTOS[0])
  const [referencia, setReferencia] = useState<{ nome: string; url: string } | null>(null)
  const campoReferencia = useRef<HTMLInputElement>(null)
  const campoArquivo = useRef<HTMLInputElement>(null)
  const info = INFO[tipo]
  const formato = PROPORCOES[tipo].find((opcao) => opcao.rotulo === proporcao)?.formato ?? PROPORCOES[tipo][0].formato

  const enviar = () => {
    if (!texto.trim()) return
    aoEnviar(texto.trim(), {
      formato,
      geracao: {
        proporcao: `${formato[0]}:${formato[1]}`,
        resolucao: tipo === "imagem" ? resolucao : undefined,
        duracao: tipo === "video" ? duracao : undefined,
        estilo: tipo === "peca" ? undefined : estilo,
        referencia: referencia?.nome,
      },
    })
  }

  return (
    <form
      aria-label={info.titulo}
      onSubmit={(evento) => {
        evento.preventDefault()
        enviar()
      }}
      onKeyDown={(evento) => {
        evento.stopPropagation()
        if (evento.key === "Escape") aoFechar()
      }}
      className="pointer-events-auto flex w-full max-w-[640px] flex-col gap-2 rounded-3xl bg-superficie p-2.5 shadow-(--sombra-flutuante) motion-safe:animate-[aparecer_160ms_var(--ease-saida)]"
    >
      <div className="flex items-start gap-2">
        <span aria-hidden className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-lima text-preto">
          <info.icone className="size-4" strokeWidth={2} />
        </span>
        <textarea
          autoFocus
          aria-label={info.titulo}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === "Enter" && !evento.shiftKey && !evento.nativeEvent.isComposing) {
              evento.preventDefault()
              enviar()
            }
          }}
          placeholder={info.placeholder}
          rows={1}
          className="field-sizing-content max-h-32 min-h-9 w-full flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed outline-none placeholder:text-texto-3"
        />
        <Botao variante="fantasma" tamanho="icone-sm" aria-label="Fechar" onClick={aoFechar}>
          <X />
        </Botao>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {/* Referência */}
        <input
          ref={campoReferencia}
          type="file"
          accept="image/*"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(evento) => {
            const escolhido = evento.target.files?.[0]
            if (escolhido) setReferencia({ nome: escolhido.name, url: URL.createObjectURL(escolhido) })
            evento.target.value = ""
          }}
        />
        {referencia ? (
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-acao-suave py-1 ps-1 pe-1 text-detalhe font-medium">
            {/* eslint-disable-next-line @next/next/no-img-element -- imagem local do navegador (blob) */}
            <img src={referencia.url} alt="" className="size-6 rounded-full object-cover" />
            <span className="max-w-28 truncate">{referencia.nome}</span>
            <button
              type="button"
              aria-label="Tirar a referência"
              onClick={() => {
                URL.revokeObjectURL(referencia.url)
                setReferencia(null)
              }}
              className="grid size-6 place-items-center rounded-full hover:bg-preto/10"
            >
              <X className="size-3" strokeWidth={2.5} />
            </button>
          </span>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={() => campoReferencia.current?.click()} className={PILULA}>
                <ImagePlus strokeWidth={2} aria-hidden /> Referência
              </button>
            </TooltipTrigger>
            <TooltipContent>Uma imagem para eu seguir: o produto, um enquadramento, um clima</TooltipContent>
          </Tooltip>
        )}

        {/* Proporção ou formato */}
        <DropdownMenu>
          <DropdownMenuTrigger className={PILULA} aria-label={`${tipo === "peca" ? "Formato" : "Proporção"}: ${proporcao}`}>
            <Ratio strokeWidth={2} aria-hidden /> {proporcao} <ChevronDown className="text-texto-3" strokeWidth={2} aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52 rounded-2xl p-1">
            <DropdownMenuLabel className="text-xs font-medium text-texto-3">{tipo === "peca" ? "Formato" : "Proporção"}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={proporcao} onValueChange={setProporcao}>
              {PROPORCOES[tipo].map((opcao) => (
                <DropdownMenuRadioItem key={opcao.rotulo} value={opcao.rotulo} className="gap-3">
                  <span aria-hidden className="grid w-5 place-items-center">
                    <span className="rounded-[3px] bg-texto-3" style={{ width: opcao.formato[0] >= opcao.formato[1] ? 18 : (18 * opcao.formato[0]) / opcao.formato[1], height: opcao.formato[1] >= opcao.formato[0] ? 18 : (18 * opcao.formato[1]) / opcao.formato[0] }} />
                  </span>
                  <span className="flex-1">{opcao.rotulo}</span>
                  {opcao.nota && <span className="text-xs text-texto-3">{opcao.nota}</span>}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Resolução (imagem) ou duração (vídeo) */}
        {tipo === "imagem" && (
          <DropdownMenu>
            <DropdownMenuTrigger className={PILULA} aria-label={`Resolução: ${resolucao}`}>
              <Sparkles strokeWidth={2} aria-hidden /> {resolucao} <ChevronDown className="text-texto-3" strokeWidth={2} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-64 rounded-2xl p-1">
              <DropdownMenuLabel className="text-xs font-medium text-texto-3">Resolução</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={resolucao} onValueChange={setResolucao}>
                {RESOLUCOES.map((opcao) => (
                  <DropdownMenuRadioItem key={opcao.valor} value={opcao.valor} className="gap-3">
                    <span className="w-6 font-medium">{opcao.valor}</span>
                    <span className="flex-1 text-xs text-texto-2">{opcao.nota}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {tipo === "video" && (
          <DropdownMenu>
            <DropdownMenuTrigger className={PILULA} aria-label={`Duração: ${duracao}`}>
              <Clock strokeWidth={2} aria-hidden /> {duracao} <ChevronDown className="text-texto-3" strokeWidth={2} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-40 rounded-2xl p-1">
              <DropdownMenuLabel className="text-xs font-medium text-texto-3">Duração</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={duracao} onValueChange={setDuracao}>
                {DURACOES.map((opcao) => (
                  <DropdownMenuRadioItem key={opcao} value={opcao}>
                    {opcao}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Estilo */}
        {tipo !== "peca" && (
          <DropdownMenu>
            <DropdownMenuTrigger className={PILULA} aria-label={`Estilo: ${estilo}`}>
              <Palette strokeWidth={2} aria-hidden /> <span className="max-w-32 truncate">{estilo}</span> <ChevronDown className="text-texto-3" strokeWidth={2} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="max-h-80 w-64 overflow-y-auto rounded-2xl p-1">
              <DropdownMenuRadioGroup value={estilo} onValueChange={setEstilo}>
                {estilosFoto.length + estilosIlustracao.length > 0 && <DropdownMenuLabel className="text-xs font-medium text-texto-3">Estilos da {marca}</DropdownMenuLabel>}
                {[...estilosFoto, ...(tipo === "imagem" ? estilosIlustracao : [])].map((opcao) => (
                  <DropdownMenuRadioItem key={opcao} value={opcao}>
                    {opcao}
                  </DropdownMenuRadioItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-medium text-texto-3">Tipos prontos</DropdownMenuLabel>
                {TIPOS_PRONTOS.map((opcao) => (
                  <DropdownMenuRadioItem key={opcao} value={opcao}>
                    {opcao}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <span className="ms-auto flex items-center gap-1">
          {tipo === "imagem" && (
            <>
              <input
                ref={campoArquivo}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(evento) => {
                  const escolhido = evento.target.files?.[0]
                  if (escolhido) aoEnviarArquivo(escolhido)
                }}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Botao variante="fantasma" tamanho="icone-sm" aria-label="Enviar uma imagem do computador" onClick={() => campoArquivo.current?.click()}>
                    <Upload />
                  </Botao>
                </TooltipTrigger>
                <TooltipContent>Enviar uma imagem do computador</TooltipContent>
              </Tooltip>
            </>
          )}
          <Plimm type="submit" icone={ArrowUp} somenteIcone rotulo="Criar" disabled={!texto.trim()} />
        </span>
      </div>
    </form>
  )
}
