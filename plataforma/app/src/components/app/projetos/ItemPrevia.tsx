"use client"

import type { CSSProperties } from "react"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { cn } from "@/lib/utils"
import { ARQUIVOS, type AjustesImagem, type ArquivoBiblioteca, type ItemProjeto } from "@/lib/mock"
import { PreviaArquivo } from "../biblioteca/PreviaArquivo"
import { Peca } from "../PecasMarca"
import type { SistemaMarca } from "../SistemaMarca"

/* Desenho de um item do projeto. As três vistas (canvas, grade e thread) usam o mesmo desenho. */

/** A miniatura da biblioteca pede um arquivo; o item do projeto vira um, com o que ela precisa. */
function comoArquivo(item: ItemProjeto): ArquivoBiblioteca {
  const guardado = item.arquivo ? ARQUIVOS.find((arquivo) => arquivo.id === item.arquivo) : undefined
  if (guardado) return guardado
  return {
    id: item.id,
    nome: item.nome,
    tipo: item.tipo === "video" ? "video" : item.tipo === "peca" ? "peca" : "foto",
    descricao: item.nome,
    formato: "",
    extensao: "PNG",
    tamanho: "",
    data: item.criado.slice(0, 10),
    origem: item.autor,
    aparece: [],
    tags: [],
    cores: [],
    status: "rascunho",
    previa: item.previa!,
  }
}

/** "titulo" e "corpo" são os estilos básicos; os outros ids vêm da tipografia da marca. */
export const idDoEstilo = (item: ItemProjeto) => (item.estiloTexto === "titulo" ? "h2" : !item.estiloTexto || item.estiloTexto === "corpo" ? "corpo" : item.estiloTexto)

/**
 * Letra de um texto do projeto: parte do estilo da tipografia da marca (fonte, tamanho, peso, entrelinha)
 * e aplica por cima o que a pessoa mudou no painel de texto.
 */
export function estiloDoTexto(item: ItemProjeto, sistema: SistemaMarca): CSSProperties {
  const id = idDoEstilo(item)
  const estilo = sistema.estilosTipo.find((atual) => atual.id === id)
  const padrao = id === "corpo" ? { tamanho: 17, linha: 28, peso: 400, papel: "texto" as const } : { tamanho: 30, linha: 36, peso: 500, papel: "display" as const }
  const tamanho = item.tamanho ?? estilo?.tela.tamanho ?? padrao.tamanho
  const proporcao = estilo ? estilo.tela.linha / estilo.tela.tamanho : padrao.linha / padrao.tamanho
  return {
    fontFamily: sistema.fonte[item.fonte ?? estilo?.papel ?? padrao.papel],
    fontSize: tamanho,
    lineHeight: proporcao,
    fontWeight: item.peso ?? estilo?.peso ?? padrao.peso,
    letterSpacing: estilo ? `${estilo.letras / 100}em` : undefined,
    textTransform: estilo?.caixa === "alta" ? "uppercase" : undefined,
    textAlign: item.alinhamento,
    color: item.corTexto ?? "var(--texto)",
  }
}

/** Ajustes do visor (exposição, contraste, saturação, temperatura) como filtro, para valer em todas as vistas. */
export function filtroDe(ajustes?: AjustesImagem): CSSProperties | undefined {
  if (!ajustes) return undefined
  const { exposicao, contraste, saturacao, temperatura, espelhada } = ajustes
  const partes = [
    exposicao && `brightness(${1 + exposicao / 200})`,
    contraste && `contrast(${1 + contraste / 200})`,
    saturacao && `saturate(${1 + saturacao / 100})`,
    temperatura > 0 && `sepia(${temperatura / 220})`,
    temperatura < 0 && `hue-rotate(${temperatura / 5}deg) saturate(${1 - temperatura / 400})`,
  ].filter(Boolean)
  if (partes.length === 0 && !espelhada) return undefined
  return { filter: partes.join(" ") || undefined, transform: espelhada ? "scaleX(-1)" : undefined }
}

/** Espaço reservado enquanto o Hattie cria: pontilhado da marca e o ✱ girando. */
function Reservado({ rotulo }: { rotulo: string }) {
  return (
    <div role="status" className="relative grid size-full place-items-center overflow-hidden rounded-[10px] bg-superficie [container-type:size]">
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(var(--cinza)_1.5px,transparent_2px)] bg-size-[14px_14px]" />
      <span className="relative flex flex-col items-center gap-[4cqmin] text-texto-2">
        <IconeHattie nome="asterisco" tamanho={28} className="animate-spin text-preto [animation-duration:1.6s] motion-reduce:animate-none" />
        <span className="text-xs font-medium">criando {rotulo}…</span>
      </span>
    </div>
  )
}

function Forma({ item }: { item: ItemProjeto }) {
  const cor = item.cor ?? "var(--preto)"
  if (item.forma === "seta") {
    const meio = item.a / 2
    const ponta = Math.min(22, item.l / 3)
    return (
      <svg aria-hidden viewBox={`0 0 ${item.l} ${item.a}`} className="size-full overflow-visible" preserveAspectRatio="none">
        <line x1={2} y1={meio} x2={item.l - ponta} y2={meio} stroke={cor} strokeWidth={4} strokeLinecap="round" />
        <path d={`M${item.l - ponta} ${meio - ponta / 2} L${item.l} ${meio} L${item.l - ponta} ${meio + ponta / 2} Z`} fill={cor} stroke={cor} strokeWidth={2} strokeLinejoin="round" />
      </svg>
    )
  }
  return <div aria-hidden className={cn("size-full", item.forma === "elipse" ? "rounded-[50%]" : "rounded-[12px]")} style={{ backgroundColor: cor }} />
}

const ROTULO_CRIANDO: Record<ItemProjeto["tipo"], string> = { imagem: "a imagem", video: "o vídeo", peca: "a peça", texto: "o texto", forma: "a forma" }

/** Item no tamanho real, ocupando o quadro inteiro. É como ele aparece no canvas. */
export function ItemNoCanvas({ item, sistema }: { item: ItemProjeto; sistema: SistemaMarca }) {
  if (item.criando) return <Reservado rotulo={ROTULO_CRIANDO[item.tipo]} />
  if (item.tipo === "texto")
    return (
      <p className="break-words whitespace-pre-wrap" style={estiloDoTexto(item, sistema)}>
        {item.texto}
      </p>
    )
  if (item.tipo === "forma") return <Forma item={item} />
  if (!item.previa) return null
  if (item.previa.tipo === "peca") return <Peca exemplo={item.previa.exemplo} proporcao={item.previa.proporcao} sistema={sistema} className="h-full rounded-[10px]" />
  return (
    <div className="size-full overflow-hidden rounded-[10px]" style={filtroDe(item.ajustes)}>
      <PreviaArquivo arquivo={comoArquivo(item)} sistema={sistema} />
    </div>
  )
}

/** Item encaixado num quadro de miniatura (card da grade, thread, capa do projeto). Ocupa o pai inteiro. */
export function ItemMiniatura({ item, sistema, className }: { item: ItemProjeto; sistema: SistemaMarca; className?: string }) {
  if (item.criando)
    return (
      <div className={cn("size-full", className)}>
        <Reservado rotulo={ROTULO_CRIANDO[item.tipo]} />
      </div>
    )
  if (item.tipo === "texto")
    return (
      <div role="img" aria-label={`Texto: ${item.texto}`} className={cn("flex size-full flex-col overflow-hidden bg-preenchimento p-[9%] text-start", className)}>
        <p
          className={cn("line-clamp-6", idDoEstilo(item) === "corpo" || (item.tamanho ?? 99) < 20 ? "text-xs leading-relaxed" : "text-base leading-tight")}
          style={{ fontFamily: estiloDoTexto(item, sistema).fontFamily, fontWeight: estiloDoTexto(item, sistema).fontWeight, color: item.corTexto ?? "var(--texto)" }}
        >
          {item.texto}
        </p>
      </div>
    )
  if (item.tipo === "forma")
    return (
      <div role="img" aria-label={item.nome} className={cn("grid size-full place-items-center bg-preenchimento p-[20%]", className)}>
        <div className="w-full" style={{ aspectRatio: `${item.l} / ${Math.max(item.a, 12)}`, maxHeight: "100%" }}>
          <Forma item={item} />
        </div>
      </div>
    )
  if (!item.previa) return null
  return (
    <div className={cn("size-full overflow-hidden", className)} style={filtroDe(item.ajustes)}>
      <PreviaArquivo arquivo={comoArquivo(item)} sistema={sistema} />
    </div>
  )
}
