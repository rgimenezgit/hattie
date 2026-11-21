"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react"
import {
  Circle,
  Clapperboard,
  ClipboardCopy,
  Copy,
  CopyPlus,
  Download,
  FolderInput,
  Hand,
  Heading,
  Image as IconeImagem,
  LayoutTemplate,
  Maximize2,
  Minus,
  MousePointer2,
  MoveRight,
  Pencil,
  Pilcrow,
  Plus,
  RefreshCw,
  Scan,
  Shapes,
  Square,
  SquareDashedMousePointer,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react"
import { ContextMenu } from "radix-ui"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Botao } from "@/components/hattie/Botao"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { caixaDe, type Caixa, type OpcoesPedido } from "@/lib/projetos"
import { cn } from "@/lib/utils"
import type { FormaProjeto, GeracaoItem, ItemProjeto, PaginaProjeto, ProjetoMarca } from "@/lib/mock"
import type { SistemaMarca } from "../SistemaMarca"
import { BarraGeracao, type TipoGeracao } from "./BarraGeracao"
import type { AcoesProjeto } from "./EstadoProjetos"
import { estiloDoTexto, ItemNoCanvas } from "./ItemPrevia"
import { PainelTexto } from "./PainelTexto"

/*
 * Vista Canvas: a página como um quadro livre. Os itens ficam onde a pessoa colocar.
 * - Tela: arrastar com a mão (ou segurando espaço) e rolar movem; Ctrl/⌘ + rolar e pinça dão zoom.
 * - Seta: clicar seleciona, Shift soma, arrastar no vazio laça vários, arrastar um item move a seleção.
 * - Criar: texto e formas nascem onde a pessoa clicar. Imagem, vídeo e peça abrem a barra de geração acima
 *   da barra do canvas (pedido, referência, proporção, resolução e estilo); o resultado nasce no centro da tela
 *   ou no ponto marcado com um clique.
 * - Item selecionado: contorno fino em lima, barra de ações em cima e uma alça no canto para mudar o tamanho.
 *   Texto selecionado abre o painel de texto à direita. Duplo clique abre o visor (ou edita, se for texto).
 * - Botão direito: menu do item (abrir, gerar de novo, copiar o pedido, copiar e salvar a imagem) ou do canvas.
 * O teclado funciona com o canvas em foco: V, H, I, D, T, P, R, O e L trocam de ferramenta; setas movem;
 * Delete apaga; Esc solta.
 */

type Ferramenta = "selecionar" | "mao" | "imagem" | "video" | "texto" | "peca" | FormaProjeto
type Camera = { x: number; y: number; z: number }
type Ponto = { x: number; y: number }

const ZOOM_MIN = 0.1
const ZOOM_MAX = 3
const limitar = (valor: number, minimo: number, maximo: number) => Math.min(maximo, Math.max(minimo, valor))

/** Câmera que mostra os itens inteiros, com folga para a barra de ferramentas. Sem itens, centraliza a origem. */
function cameraPara(alvo: ItemProjeto[], tamanho: { l: number; a: number }): Camera {
  const caixa = caixaDe(alvo)
  if (!caixa) return { x: tamanho.l / 2, y: tamanho.a / 2 - 40, z: 1 }
  const margem = tamanho.l < 640 ? 32 : 88
  const baixo = 88 // espaço da barra de ferramentas
  const z = limitar(Math.min((tamanho.l - margem * 2) / caixa.l, (tamanho.a - margem - baixo - 24) / caixa.a), ZOOM_MIN, 1)
  return { x: (tamanho.l - caixa.l * z) / 2 - caixa.x * z, y: (tamanho.a - baixo + 24 - caixa.a * z) / 2 - caixa.y * z, z }
}

const CRIAR: { id: Ferramenta; rotulo: string; atalho: string; icone: LucideIcon; dica: string }[] = [
  { id: "imagem", rotulo: "Imagem", atalho: "I", icone: IconeImagem, dica: "" },
  { id: "video", rotulo: "Vídeo", atalho: "D", icone: Clapperboard, dica: "" },
  { id: "texto", rotulo: "Texto", atalho: "T", icone: Type, dica: "Clique onde o texto começa" },
  { id: "peca", rotulo: "Peça", atalho: "P", icone: LayoutTemplate, dica: "" },
]

const FORMAS: { id: FormaProjeto; rotulo: string; atalho: string; icone: LucideIcon; l: number; a: number }[] = [
  { id: "retangulo", rotulo: "Retângulo", atalho: "R", icone: Square, l: 220, a: 150 },
  { id: "elipse", rotulo: "Elipse", atalho: "O", icone: Circle, l: 160, a: 160 },
  { id: "seta", rotulo: "Seta", atalho: "L", icone: MoveRight, l: 200, a: 24 },
]

const ATALHOS: Record<string, Ferramenta> = { v: "selecionar", h: "mao", i: "imagem", d: "video", t: "texto", p: "peca", r: "retangulo", o: "elipse", l: "seta" }

const GERACAO: Ferramenta[] = ["imagem", "video", "peca"]
const ITEM_MENU = "flex h-9 cursor-default items-center gap-2.5 rounded-xl px-2.5 text-sm outline-none select-none data-[disabled]:opacity-40 data-[highlighted]:bg-preenchimento [&_svg]:size-4"

type Gesto =
  | { tipo: "tela"; inicio: Ponto; camera: Camera; moveu: boolean }
  | { tipo: "mover"; inicio: Ponto; ids: string[]; moveu: boolean }
  | { tipo: "tamanho"; inicio: Ponto; item: ItemProjeto }
  | { tipo: "laco"; inicio: Ponto; soma: string[] }
  | { tipo: "criar"; inicio: Ponto }

type Props = {
  projeto: ProjetoMarca
  pagina: PaginaProjeto
  itens: ItemProjeto[]
  sistema: SistemaMarca
  acoes: AcoesProjeto
  selecionados: string[]
  aoSelecionar: (ids: string[]) => void
  /** Pedido ao Hattie feito no canvas. Devolve os ids dos itens que vão nascer. */
  aoPedir: (texto: string, opcoes: OpcoesPedido) => string[]
  aoPedirAjuste: (item: ItemProjeto) => void
  /** Abre o visor do item (duplo clique, menu). */
  aoAbrir: (item: ItemProjeto) => void
  aoAbrirConversa: () => void
  /** Itens para trazer para o centro da tela; `vez` muda a cada pedido de foco. */
  foco: { ids: string[]; vez: number }
}

export function VistaCanvas({ projeto, pagina, itens, sistema, acoes, selecionados, aoSelecionar, aoPedir, aoPedirAjuste, aoAbrir, aoAbrirConversa, foco }: Props) {
  const palco = useRef<HTMLDivElement>(null)
  const [tamanho, setTamanho] = useState<{ l: number; a: number } | null>(null)
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, z: 1 })
  const [suave, setSuave] = useState(false)
  const [ferramenta, setFerramenta] = useState<Ferramenta>("selecionar")
  const [ultimaForma, setUltimaForma] = useState<FormaProjeto>("retangulo")
  const [editando, setEditando] = useState<string | null>(null)
  /** Deslocamento da seleção enquanto arrasta; só vira posição de verdade ao soltar. */
  const [arrasto, setArrasto] = useState<Ponto | null>(null)
  const [medida, setMedida] = useState<{ id: string; l: number; a: number } | null>(null)
  const [laco, setLaco] = useState<Caixa | null>(null)
  /** Ponto do canvas marcado para o que a barra de geração criar. Sem ele, nasce no centro da tela. */
  const [ponto, setPonto] = useState<Ponto | null>(null)
  /** Item sob o botão direito, para o menu de contexto. null é o canvas vazio. */
  const [menuDe, setMenuDe] = useState<string | null>(null)
  const [espaco, setEspaco] = useState(false)
  const gesto = useRef<Gesto | null>(null)
  const toques = useRef(new Map<number, Ponto>())
  const pinca = useRef<{ distancia: number; camera: Camera } | null>(null)
  const cameraAtual = useRef(camera)
  useEffect(() => {
    cameraAtual.current = camera
  }, [camera])

  const noPalco = useCallback((evento: { clientX: number; clientY: number }): Ponto => {
    const caixa = palco.current!.getBoundingClientRect()
    return { x: evento.clientX - caixa.left, y: evento.clientY - caixa.top }
  }, [])
  const noMundo = useCallback((ponto: Ponto, cam = cameraAtual.current): Ponto => ({ x: (ponto.x - cam.x) / cam.z, y: (ponto.y - cam.y) / cam.z }), [])

  /* ---------- Câmera ---------- */

  const enquadrar = useCallback(
    (alvo: ItemProjeto[]) => {
      if (!tamanho) return
      setSuave(true)
      setCamera(cameraPara(alvo, tamanho))
    },
    [tamanho],
  )

  useEffect(() => {
    if (!suave) return
    const fim = setTimeout(() => setSuave(false), 360)
    return () => clearTimeout(fim)
  }, [suave, camera])

  // Mede o palco. Na primeira medida, mostra a página inteira.
  const itensAtuais = useRef(itens)
  useEffect(() => {
    itensAtuais.current = itens
  }, [itens])
  const enquadrou = useRef(false)
  const medidaAnterior = useRef<{ l: number; a: number } | null>(null)
  /** Último foco pedido: se o palco muda de tamanho logo depois (a conversa abriu ao lado), o foco é refeito. */
  const ultimoFoco = useRef<{ ids: string[]; quando: number } | null>(null)
  useLayoutEffect(() => {
    const elemento = palco.current
    if (!elemento) return
    const observador = new ResizeObserver(([entrada]) => {
      const medido = { l: entrada.contentRect.width, a: entrada.contentRect.height }
      const antes = medidaAnterior.current
      medidaAnterior.current = medido
      setTamanho(medido)
      if (medido.l === 0) return
      if (!enquadrou.current) {
        enquadrou.current = true
        setCamera(cameraPara(itensAtuais.current, medido))
      } else if (ultimoFoco.current && performance.now() - ultimoFoco.current.quando < 800) {
        const ids = ultimoFoco.current.ids
        setCamera(cameraPara(itensAtuais.current.filter((item) => ids.includes(item.id)), medido))
      } else if (antes && (antes.l !== medido.l || antes.a !== medido.a)) {
        // O palco encolheu ou cresceu (a conversa abriu ou fechou). Se a página inteira estava à vista, continua inteira;
        // se a pessoa estava olhando um trecho de perto, o que estava no centro continua no centro.
        const cam = cameraAtual.current
        const caixa = caixaDe(itensAtuais.current)
        const inteira = caixa && caixa.x * cam.z + cam.x >= 0 && caixa.y * cam.z + cam.y >= 0 && (caixa.x + caixa.l) * cam.z + cam.x <= antes.l && (caixa.y + caixa.a) * cam.z + cam.y <= antes.a
        setSuave(true)
        if (inteira) setCamera(cameraPara(itensAtuais.current, medido))
        else setCamera((atual) => ({ ...atual, x: atual.x + (medido.l - antes.l) / 2, y: atual.y + (medido.a - antes.a) / 2 }))
      }
    })
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  // Foco pedido de fora (a conversa criou itens, alguém clicou "ver no canvas").
  const vezVista = useRef(foco.vez)
  useEffect(() => {
    if (foco.vez === vezVista.current || !tamanho) return
    const alvo = itens.filter((item) => foco.ids.includes(item.id))
    if (alvo.length === 0) return
    vezVista.current = foco.vez
    ultimoFoco.current = { ids: foco.ids, quando: performance.now() }
    const quadro = requestAnimationFrame(() => enquadrar(alvo))
    return () => cancelAnimationFrame(quadro)
  }, [foco, itens, tamanho, enquadrar])

  const zoomEm = useCallback((ponto: Ponto, fator: number) => {
    setCamera((atual) => {
      const z = limitar(atual.z * fator, ZOOM_MIN, ZOOM_MAX)
      const mundo = { x: (ponto.x - atual.x) / atual.z, y: (ponto.y - atual.y) / atual.z }
      return { x: ponto.x - mundo.x * z, y: ponto.y - mundo.y * z, z }
    })
  }, [])
  const zoomNoCentro = (fator: number) => tamanho && (setSuave(true), zoomEm({ x: tamanho.l / 2, y: tamanho.a / 2 }, fator))

  // Roda do mouse: move a tela; com Ctrl ou ⌘ (e no gesto de pinça do trackpad), dá zoom no ponto.
  useEffect(() => {
    const elemento = palco.current
    if (!elemento) return
    const aoRolar = (evento: WheelEvent) => {
      if ((evento.target as Element).closest("[data-fora-do-canvas]")) return
      evento.preventDefault()
      if (evento.ctrlKey || evento.metaKey) zoomEm(noPalco(evento), Math.exp(-evento.deltaY * 0.01))
      else setCamera((atual) => ({ ...atual, x: atual.x - evento.deltaX, y: atual.y - evento.deltaY }))
    }
    elemento.addEventListener("wheel", aoRolar, { passive: false })
    return () => elemento.removeEventListener("wheel", aoRolar)
  }, [noPalco, zoomEm])

  /* ---------- Criar ---------- */

  const gerando = GERACAO.includes(ferramenta)

  const criarEm = (mundo: Ponto) => {
    if (gerando) {
      setPonto(mundo)
      return
    }
    if (ferramenta === "texto") {
      const id = acoes.adicionarItem({ pagina: pagina.id, tipo: "texto", nome: "Texto", x: mundo.x, y: mundo.y - 12, l: 320, a: 28, texto: "", estiloTexto: "corpo", autor: "voce" })
      aoSelecionar([id])
      setEditando(id)
      setFerramenta("selecionar")
      return
    }
    const forma = FORMAS.find((item) => item.id === ferramenta)
    if (!forma) return
    const id = acoes.adicionarItem({
      pagina: pagina.id,
      tipo: "forma",
      nome: forma.rotulo,
      forma: forma.id,
      cor: sistema.cores.principal,
      x: mundo.x - forma.l / 2,
      y: mundo.y - forma.a / 2,
      l: forma.l,
      a: forma.a,
      autor: "voce",
    })
    aoSelecionar([id])
    setFerramenta("selecionar")
  }

  /** Centro do que está à vista, para o que chega sem lugar marcado (uma imagem do computador). */
  const lugarDeNascer = (): Ponto => ponto ?? noMundo({ x: (tamanho?.l ?? 0) / 2, y: ((tamanho?.a ?? 0) - 120) / 2 })

  // Sem ponto marcado, o que a barra de geração pede nasce numa linha nova, abaixo do que já existe,
  // e a tela vai até lá assim que os itens aparecem.
  const focoPendente = useRef<string[] | null>(null)
  useEffect(() => {
    const ids = focoPendente.current
    if (!ids) return
    const alvo = itens.filter((item) => ids.includes(item.id))
    if (alvo.length < ids.length) return
    focoPendente.current = null
    const quadro = requestAnimationFrame(() => enquadrar(alvo))
    return () => cancelAnimationFrame(quadro)
  }, [itens, enquadrar])

  const enviarPedido = (texto: string, opcoes: { formato: [number, number]; geracao: GeracaoItem; referenciaUrl?: string }) => {
    if (!gerando) return
    const ids = aoPedir(texto, { tipo: ferramenta as TipoGeracao, formato: opcoes.formato, geracao: opcoes.geracao, referenciaUrl: opcoes.referenciaUrl, ponto: ponto ?? undefined })
    if (!ponto) focoPendente.current = ids
    aoSelecionar(ids)
    setPonto(null)
    setFerramenta("selecionar")
  }

  const enviarArquivo = (arquivo: File) => {
    const lugar = lugarDeNascer()
    const url = URL.createObjectURL(arquivo)
    const imagem = new window.Image()
    imagem.onload = () => {
      const a = 360
      const l = Math.round((a * imagem.naturalWidth) / imagem.naturalHeight)
      const id = acoes.adicionarItem({ pagina: pagina.id, tipo: "imagem", nome: arquivo.name.replace(/\.[^.]+$/, ""), x: lugar.x - l / 2, y: lugar.y - a / 2, l, a, previa: { tipo: "enviada", url }, autor: "voce" })
      aoSelecionar([id])
    }
    imagem.src = url
    setPonto(null)
    setFerramenta("selecionar")
  }

  /* ---------- Ponteiro ---------- */

  const comMao = ferramenta === "mao" || espaco

  /**
   * O evento aconteceu no canvas de verdade? Menus e janelas abrem por cima dele (fora do palco na página),
   * mas os eventos do React sobem até aqui do mesmo jeito; esses não são do canvas.
   */
  const doCanvas = (alvo: EventTarget) => alvo instanceof Element && !!palco.current?.contains(alvo) && !alvo.closest("[data-fora-do-canvas]")

  const aoApertar = (evento: PointerEvent<HTMLDivElement>) => {
    if (!doCanvas(evento.target)) return
    // Botão direito: quem cuida é o menu de contexto.
    if (evento.button === 2) return
    palco.current?.focus({ preventScroll: true })
    const ponto = noPalco(evento)
    toques.current.set(evento.pointerId, ponto)
    if (toques.current.size === 2) {
      const [a, b] = [...toques.current.values()]
      pinca.current = { distancia: Math.hypot(a.x - b.x, a.y - b.y), camera: cameraAtual.current }
      gesto.current = null
      setArrasto(null)
      setLaco(null)
      return
    }
    evento.currentTarget.setPointerCapture(evento.pointerId)
    const alvo = (evento.target as Element).closest<HTMLElement>("[data-item]")
    const alca = (evento.target as Element).closest("[data-alca]")
    const item = alvo ? itens.find((atual) => atual.id === alvo.dataset.item) : undefined

    if (evento.button === 1 || comMao) {
      gesto.current = { tipo: "tela", inicio: ponto, camera: cameraAtual.current, moveu: false }
      return
    }
    if (ferramenta !== "selecionar") {
      gesto.current = { tipo: "criar", inicio: ponto }
      return
    }
    if (item && alca) {
      gesto.current = { tipo: "tamanho", inicio: ponto, item }
      return
    }
    if (item) {
      if (editando === item.id) return
      if (evento.shiftKey) {
        aoSelecionar(selecionados.includes(item.id) ? selecionados.filter((id) => id !== item.id) : [...selecionados, item.id])
        return
      }
      const ids = selecionados.includes(item.id) ? selecionados : [item.id]
      if (ids !== selecionados) aoSelecionar(ids)
      gesto.current = { tipo: "mover", inicio: ponto, ids, moveu: false }
      return
    }
    // No vazio: no toque, o dedo move a tela; com mouse, laça.
    if (evento.pointerType === "touch") gesto.current = { tipo: "tela", inicio: ponto, camera: cameraAtual.current, moveu: false }
    else {
      gesto.current = { tipo: "laco", inicio: ponto, soma: evento.shiftKey ? selecionados : [] }
      if (!evento.shiftKey) aoSelecionar([])
    }
  }

  const aoMover = (evento: PointerEvent<HTMLDivElement>) => {
    if (!toques.current.has(evento.pointerId)) return
    const ponto = noPalco(evento)
    toques.current.set(evento.pointerId, ponto)
    if (pinca.current && toques.current.size === 2) {
      const [a, b] = [...toques.current.values()]
      const meio = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      const base = pinca.current.camera
      const z = limitar((base.z * Math.hypot(a.x - b.x, a.y - b.y)) / pinca.current.distancia, ZOOM_MIN, ZOOM_MAX)
      const mundo = { x: (meio.x - base.x) / base.z, y: (meio.y - base.y) / base.z }
      setCamera({ x: meio.x - mundo.x * z, y: meio.y - mundo.y * z, z })
      return
    }
    const atual = gesto.current
    if (!atual) return
    const dx = ponto.x - atual.inicio.x
    const dy = ponto.y - atual.inicio.y
    const z = cameraAtual.current.z
    if (atual.tipo === "tela") {
      if (Math.abs(dx) + Math.abs(dy) > 3) atual.moveu = true
      setCamera({ ...atual.camera, x: atual.camera.x + dx, y: atual.camera.y + dy })
    } else if (atual.tipo === "mover") {
      if (!atual.moveu && Math.abs(dx) + Math.abs(dy) < 4) return
      atual.moveu = true
      setArrasto({ x: dx / z, y: dy / z })
    } else if (atual.tipo === "tamanho") {
      const { item } = atual
      if (item.tipo === "texto") setMedida({ id: item.id, l: Math.max(120, item.l + dx / z), a: item.a })
      else if (item.tipo === "forma") setMedida({ id: item.id, l: Math.max(24, item.l + dx / z), a: item.forma === "seta" ? item.a : Math.max(24, item.a + dy / z) })
      else {
        const l = Math.max(60, item.l + dx / z)
        setMedida({ id: item.id, l, a: (l * item.a) / item.l })
      }
    } else if (atual.tipo === "laco") {
      const caixa = { x: Math.min(atual.inicio.x, ponto.x), y: Math.min(atual.inicio.y, ponto.y), l: Math.abs(dx), a: Math.abs(dy) }
      setLaco(caixa)
      const de = noMundo({ x: caixa.x, y: caixa.y })
      const ate = noMundo({ x: caixa.x + caixa.l, y: caixa.y + caixa.a })
      const dentro = itens.filter((item) => item.x < ate.x && item.x + item.l > de.x && item.y < ate.y && item.y + item.a > de.y).map((item) => item.id)
      aoSelecionar([...new Set([...atual.soma, ...dentro])])
    }
  }

  const aoSoltar = (evento: PointerEvent<HTMLDivElement>) => {
    if (!toques.current.has(evento.pointerId)) return
    const ponto = noPalco(evento)
    toques.current.delete(evento.pointerId)
    if (pinca.current) {
      if (toques.current.size < 2) pinca.current = null
      return
    }
    const atual = gesto.current
    gesto.current = null
    if (!atual) return
    if (atual.tipo === "mover" && atual.moveu && arrasto) {
      const desvio = arrasto
      acoes.atualizarItens(atual.ids, (item) => ({ x: Math.round(item.x + desvio.x), y: Math.round(item.y + desvio.y) }))
    } else if (atual.tipo === "tamanho" && medida) {
      acoes.atualizarItens([medida.id], { l: Math.round(medida.l), a: Math.round(medida.a) })
    } else if (atual.tipo === "criar" && Math.abs(ponto.x - atual.inicio.x) + Math.abs(ponto.y - atual.inicio.y) < 6) {
      criarEm(noMundo(ponto))
    } else if (atual.tipo === "tela" && !atual.moveu && evento.pointerType === "touch" && !comMao) {
      aoSelecionar([])
    }
    setArrasto(null)
    setMedida(null)
    setLaco(null)
  }

  /* ---------- Teclado ---------- */

  useEffect(() => {
    const soltar = (evento: globalThis.KeyboardEvent) => evento.code === "Space" && setEspaco(false)
    window.addEventListener("keyup", soltar)
    return () => window.removeEventListener("keyup", soltar)
  }, [])

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (!doCanvas(evento.target) || (evento.target as Element).closest("textarea, input")) return
    const comando = evento.metaKey || evento.ctrlKey
    if (evento.code === "Space") {
      evento.preventDefault()
      setEspaco(true)
      return
    }
    if (evento.key === "Escape") {
      setPonto(null)
      if (ferramenta !== "selecionar") setFerramenta("selecionar")
      else aoSelecionar([])
      return
    }
    if ((evento.key === "Delete" || evento.key === "Backspace") && selecionados.length) {
      evento.preventDefault()
      acoes.removerItens(selecionados)
      aoSelecionar([])
      return
    }
    if (comando && evento.key.toLowerCase() === "a") {
      evento.preventDefault()
      aoSelecionar(itens.map((item) => item.id))
      return
    }
    if (comando && evento.key.toLowerCase() === "d" && selecionados.length) {
      evento.preventDefault()
      aoSelecionar(acoes.duplicarItens(selecionados))
      return
    }
    if (evento.key.startsWith("Arrow") && selecionados.length) {
      evento.preventDefault()
      const passo = evento.shiftKey ? 10 : 1
      const dx = evento.key === "ArrowLeft" ? -passo : evento.key === "ArrowRight" ? passo : 0
      const dy = evento.key === "ArrowUp" ? -passo : evento.key === "ArrowDown" ? passo : 0
      acoes.atualizarItens(selecionados, (item) => ({ x: item.x + dx, y: item.y + dy }))
      return
    }
    if (comando || evento.altKey) return
    if (evento.key === "Enter" && selecionados.length === 1) {
      const unico = itens.find((item) => item.id === selecionados[0])
      if (unico?.tipo === "texto") {
        evento.preventDefault()
        setEditando(unico.id)
      }
      return
    }
    if (evento.key === "0") zoomNoCentro(1 / camera.z)
    else if (evento.key === "1") enquadrar(itens)
    else if (evento.key === "+" || evento.key === "=") zoomNoCentro(1.25)
    else if (evento.key === "-") zoomNoCentro(0.8)
    else {
      const nova = ATALHOS[evento.key.toLowerCase()]
      if (nova) escolher(nova)
    }
  }

  const escolher = (nova: Ferramenta) => {
    setFerramenta(nova)
    setPonto(null)
    if (FORMAS.some((forma) => forma.id === nova)) setUltimaForma(nova as FormaProjeto)
    if (nova !== "selecionar" && nova !== "mao") aoSelecionar([])
  }

  /* ---------- Desenho ---------- */

  const posicao = (item: ItemProjeto) => {
    const movendo = arrasto && selecionados.includes(item.id)
    const comMedida = medida?.id === item.id ? medida : null
    return { x: item.x + (movendo ? arrasto.x : 0), y: item.y + (movendo ? arrasto.y : 0), l: comMedida?.l ?? item.l, a: comMedida?.a ?? item.a }
  }

  const selecao = itens.filter((item) => selecionados.includes(item.id))
  const caixaSelecao = caixaDe(selecao.map(posicao))
  const ocupado = arrasto !== null || medida !== null || laco !== null
  const malha = [24, 48, 96, 192].find((passo) => passo * camera.z >= 16) ?? 384
  const dicaCriar = gerando
    ? ponto
      ? "Vai nascer no ponto marcado"
      : "Clique no canvas se quiser escolher onde vai nascer"
    : (CRIAR.find((item) => item.id === ferramenta)?.dica ?? (FORMAS.some((forma) => forma.id === ferramenta) ? "Clique onde a forma deve aparecer" : null))
  const regerar = (item: ItemProjeto) => aoSelecionar(aoPedir("Gera de novo, com o mesmo pedido", { sobre: item }))
  const copiar = (texto: string, titulo: string) => {
    navigator.clipboard?.writeText(texto)
    notificar({ titulo, texto: "Está na sua área de transferência." })
  }
  const textoSelecionado = selecao.length === 1 && selecao[0].tipo === "texto" && ferramenta === "selecionar" ? selecao[0] : null
  const itemDoMenu = menuDe ? itens.find((item) => item.id === menuDe) : undefined

  const aoMenu = (evento: React.MouseEvent) => {
    // Nas barras flutuantes e nos menus abertos não há menu de contexto.
    if (!doCanvas(evento.target)) {
      evento.preventDefault()
      return
    }
    const alvo = (evento.target as Element).closest<HTMLElement>("[data-item]")
    const id = alvo?.dataset.item ?? null
    setMenuDe(id)
    if (id && !selecionados.includes(id)) aoSelecionar([id])
  }
  const formaAtual = FORMAS.find((forma) => forma.id === ultimaForma)!
  const comForma = FORMAS.some((forma) => forma.id === ferramenta)

  const variosNoMenu = itemDoMenu && selecionados.length > 1 && selecionados.includes(itemDoMenu.id)
  const outrasPaginas = projeto.paginas.filter((item) => item.id !== pagina.id)

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild onContextMenu={aoMenu}>
    <div
      ref={palco}
      tabIndex={0}
      role="group"
      aria-label={`Canvas da página ${pagina.nome}`}
      aria-describedby="dica-canvas"
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      onKeyDown={aoTeclar}
      onDoubleClick={(evento) => {
        if (!palco.current?.contains(evento.target as Node) || (evento.target as Element).closest("[data-fora-do-canvas]")) return
        // O palco captura o ponteiro, então o alvo do evento é o próprio palco: o item sai do ponto do clique.
        const alvo = document.elementFromPoint(evento.clientX, evento.clientY)?.closest<HTMLElement>("[data-item]")
        const item = alvo ? itens.find((atual) => atual.id === alvo.dataset.item) : undefined
        if (!item || ferramenta !== "selecionar" || item.criando) return
        if (item.tipo === "texto") setEditando(item.id)
        else if (item.tipo !== "forma") aoAbrir(item)
      }}
      className={cn(
        "relative min-h-0 flex-1 touch-none overflow-hidden outline-none select-none",
        comMao ? "cursor-grab active:cursor-grabbing" : ferramenta === "texto" ? "cursor-text" : ferramenta !== "selecionar" ? "cursor-crosshair" : "cursor-default",
      )}
    >
      <p id="dica-canvas" className="sr-only">
        Quadro livre com {itens.length} {itens.length === 1 ? "item" : "itens"}. Tab passa pelos itens, as setas movem o item selecionado e Delete apaga. A vista em grade mostra os mesmos itens em lista.
      </p>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(color-mix(in oklch, var(--preto) 16%, transparent) 1px, transparent 1.5px)",
          backgroundSize: `${malha * camera.z}px ${malha * camera.z}px`,
          backgroundPosition: `${camera.x}px ${camera.y}px`,
          transition: suave ? "background-size 320ms var(--ease-saida), background-position 320ms var(--ease-saida)" : undefined,
        }}
      />

      <div
        className="absolute top-0 left-0 origin-top-left"
        style={
          {
            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.z})`,
            transition: suave ? "transform 320ms var(--ease-saida)" : undefined,
            "--traco": `${1.5 / camera.z}px`,
          } as React.CSSProperties
        }
      >
        {itens.map((item) => {
          const lugar = posicao(item)
          const marcado = selecionados.includes(item.id)
          const emEdicao = editando === item.id
          return (
            <div
              key={item.id}
              data-item={item.id}
              role="button"
              tabIndex={0}
              aria-label={`${item.nome}${item.criando ? ", sendo criado" : ""}`}
              aria-pressed={marcado}
              onFocus={(evento) => evento.target === evento.currentTarget && !marcado && ferramenta === "selecionar" && !gesto.current && aoSelecionar([item.id])}
              className={cn(
                "group/item absolute outline-solid [outline-offset:var(--traco)] [outline-width:var(--traco)] focus-visible:outline-lima-forte",
                marcado ? "outline-lima-forte" : "outline-transparent",
                !marcado && ferramenta === "selecionar" && "hover:outline-preto/20",
                item.tipo === "texto" || item.tipo === "forma" ? "rounded-[4px]" : "rounded-[10px]",
              )}
              style={{ left: lugar.x, top: lugar.y, width: lugar.l, height: item.tipo === "texto" ? undefined : lugar.a, minHeight: item.tipo === "texto" ? 24 : undefined }}
            >
              {emEdicao ? (
                <EditorTexto
                  item={item}
                  sistema={sistema}
                  aoGuardar={(texto, altura) => {
                    setEditando(null)
                    if (!texto.trim()) {
                      acoes.descartarItem(item.id)
                      aoSelecionar([])
                    } else acoes.atualizarItens([item.id], { texto, a: altura, nome: texto.slice(0, 36) })
                  }}
                />
              ) : (
                <ItemNoCanvas item={medida?.id === item.id ? { ...item, l: lugar.l, a: lugar.a } : item} sistema={sistema} />
              )}
              {item.tipo !== "texto" && item.tipo !== "forma" && (
                <span
                  aria-hidden
                  className={cn("pointer-events-none absolute bottom-full left-0 origin-bottom-left truncate pb-1.5 text-xs text-texto-2 transition-opacity duration-150", marcado ? "opacity-100" : "opacity-0 group-hover/item:opacity-100")}
                  style={{ transform: `scale(${1 / camera.z})`, width: lugar.l * camera.z }}
                >
                  {item.nome}
                </span>
              )}
              {marcado && selecionados.length === 1 && !emEdicao && !item.criando && ferramenta === "selecionar" && (
                <span
                  data-alca
                  aria-hidden
                  className="absolute cursor-nwse-resize rounded-full bg-lima outline-solid outline-preto"
                  style={{ width: 12 / camera.z, height: 12 / camera.z, right: -7 / camera.z, bottom: item.tipo === "texto" ? `calc(50% - ${6 / camera.z}px)` : -7 / camera.z, outlineWidth: 1.5 / camera.z }}
                />
              )}
            </div>
          )
        })}
        {gerando && ponto && (
          <span aria-hidden className="pointer-events-none absolute" style={{ left: ponto.x, top: ponto.y, transform: `translate(-50%, -50%) scale(${1 / camera.z})` }}>
            <span className="grid size-8 place-items-center rounded-full bg-lima text-preto shadow-(--sombra-flutuante)">
              <IconeHattie nome="asterisco" tamanho={14} />
            </span>
          </span>
        )}
      </div>

      {laco && <div aria-hidden className="pointer-events-none absolute rounded-sm bg-lima/25 outline-1 outline-lima-forte outline-solid" style={{ left: laco.x, top: laco.y, width: laco.l, height: laco.a }} />}

      {itens.length === 0 && !gerando && (
        <div className="pointer-events-none absolute inset-x-4 top-[38%] flex -translate-y-1/2 flex-col items-center gap-3 text-center">
          <IconeHattie nome="hattie" tamanho={44} className="text-preto" />
          <p className="font-heading text-titulo-3 font-medium lowercase">página em branco</p>
          <p className="max-w-sm text-sm text-texto-2">Escolha o que criar na barra aqui embaixo e clique onde quiser, ou conte para mim o que você precisa.</p>
          <Botao variante="secundario" tamanho="sm" className="pointer-events-auto bg-superficie hover:bg-superficie" data-fora-do-canvas onClick={aoAbrirConversa}>
            <IconeHattie nome="hattie" tamanho={16} /> Pedir ao Hattie
          </Botao>
        </div>
      )}

      {caixaSelecao && !ocupado && !editando && ferramenta === "selecionar" && tamanho && (
        <BarraSelecao
          itens={selecao}
          paginas={projeto.paginas.filter((item) => item.id !== pagina.id)}
          sistema={sistema}
          estilo={{
            // Com o painel de texto aberto à direita, a barra não entra embaixo dele.
            left: limitar(caixaSelecao.x * camera.z + camera.x + (caixaSelecao.l * camera.z) / 2, 150, Math.max(150, tamanho.l - 150 - (textoSelecionado && tamanho.l >= 672 ? 256 : 0))),
            top: limitar(caixaSelecao.y * camera.z + camera.y - 60, 8, Math.max(8, tamanho.a - 150)),
          }}
          aoPedirAjuste={aoPedirAjuste}
          aoAbrir={aoAbrir}
          aoDuplicar={() => aoSelecionar(acoes.duplicarItens(selecionados))}
          aoMover={(destino) => {
            acoes.moverItens(selecionados, destino)
            aoSelecionar([])
          }}
          aoExcluir={() => {
            acoes.removerItens(selecionados)
            aoSelecionar([])
          }}
          aoMudar={(mudanca) => acoes.atualizarItens(selecionados, mudanca)}
        />
      )}

      {textoSelecionado && !ocupado && (
        <PainelTexto item={textoSelecionado} sistema={sistema} aoMudar={(mudanca) => acoes.atualizarItens([textoSelecionado.id], mudanca)} className="absolute end-4 top-4 z-20 hidden @2xl:flex" />
      )}

      {/* Barra de ferramentas flutuante */}
      <div data-fora-do-canvas className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-2 px-3">
        {dicaCriar && (
          <p role="status" className="pointer-events-auto flex items-center gap-2 rounded-full bg-preto py-1.5 ps-3.5 pe-1.5 text-xs text-branco shadow-(--sombra-flutuante)">
            {dicaCriar}
            <button type="button" onClick={() => escolher("selecionar")} className="rounded-full bg-branco/15 px-2 py-0.5 font-medium hover:bg-branco/25">
              Esc
            </button>
          </p>
        )}
        {gerando && <BarraGeracao key={ferramenta} tipo={ferramenta as TipoGeracao} marca={sistema.nome} aoEnviar={enviarPedido} aoEnviarArquivo={enviarArquivo} aoFechar={() => escolher("selecionar")} />}
        <div role="toolbar" aria-label="Barra de criar do canvas" className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full bg-superficie p-1.5 shadow-(--sombra-flutuante)">
          <BotaoFerramenta rotulo="Selecionar" atalho="V" ativo={ferramenta === "selecionar" && !espaco} onClick={() => escolher("selecionar")}>
            <MousePointer2 />
          </BotaoFerramenta>
          <BotaoFerramenta rotulo="Mover a tela" atalho="H" ativo={comMao} onClick={() => escolher("mao")}>
            <Hand />
          </BotaoFerramenta>
          <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-borda-sutil" />
          {CRIAR.map((item) => (
            <BotaoFerramenta key={item.id} rotulo={item.rotulo} atalho={item.atalho} ativo={ferramenta === item.id} comTexto onClick={() => escolher(item.id)}>
              <item.icone />
            </BotaoFerramenta>
          ))}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger
                  aria-label="Formas"
                  className={cn(
                    "flex h-10 shrink-0 items-center gap-2 rounded-full px-2.5 text-sm font-medium transition-[background-color,color] duration-150 pointer-coarse:h-11 @2xl:px-3 [&_svg]:size-[18px]",
                    comForma ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento hover:text-texto data-[state=open]:bg-preenchimento",
                  )}
                >
                  {comForma ? <formaAtual.icone strokeWidth={2} aria-hidden /> : <Shapes strokeWidth={2} aria-hidden />}
                  <span className="hidden @2xl:inline">Formas</span>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Formas</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="top" align="center" sideOffset={10} className="w-48 rounded-2xl p-1">
              {FORMAS.map((forma) => (
                <DropdownMenuItem key={forma.id} onSelect={() => escolher(forma.id)} className="h-9 gap-2.5 rounded-xl px-2.5 text-sm">
                  <forma.icone className="size-4" strokeWidth={2} aria-hidden />
                  {forma.rotulo}
                  <kbd className="ms-auto font-sans text-xs text-texto-3">{forma.atalho}</kbd>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Zoom: com pouco espaço, sobra só "ver a página inteira"; no celular, a pinça resolve. */}
      <div data-fora-do-canvas className="absolute end-4 bottom-4 hidden items-center gap-0.5 rounded-full bg-superficie p-1 shadow-(--sombra-flutuante) @lg:flex">
        <div className="hidden items-center gap-0.5 @5xl:flex">
          <Botao variante="fantasma" tamanho="icone-sm" aria-label="Diminuir o zoom" onClick={() => zoomNoCentro(0.8)}>
            <Minus />
          </Botao>
          <button type="button" aria-label={`Zoom em ${Math.round(camera.z * 100)}%. Voltar para 100%`} onClick={() => zoomNoCentro(1 / camera.z)} className="h-8 w-12 rounded-full text-xs font-medium tabular-nums hover:bg-preenchimento">
            {Math.round(camera.z * 100)}%
          </button>
          <Botao variante="fantasma" tamanho="icone-sm" aria-label="Aumentar o zoom" onClick={() => zoomNoCentro(1.25)}>
            <Plus />
          </Botao>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Botao variante="fantasma" tamanho="icone-sm" aria-label="Ver a página inteira" onClick={() => enquadrar(itens)}>
              <Scan />
            </Botao>
          </TooltipTrigger>
          <TooltipContent>Ver a página inteira</TooltipContent>
        </Tooltip>
      </div>
    </div>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="z-50 min-w-56 rounded-2xl bg-superficie p-1 shadow-(--sombra-flutuante) data-[state=open]:animate-[aparecer_120ms_var(--ease-saida)]" onCloseAutoFocus={(evento) => evento.preventDefault()}>
          {variosNoMenu ? (
            <>
              <ContextMenu.Label className="px-2.5 py-1.5 text-xs font-medium text-texto-3">{selecionados.length} itens</ContextMenu.Label>
              <ContextMenu.Item className={ITEM_MENU} onSelect={() => aoSelecionar(acoes.duplicarItens(selecionados))}>
                <CopyPlus aria-hidden /> Duplicar
              </ContextMenu.Item>
              <MoverNoMenu paginas={outrasPaginas} aoMover={(destino) => (acoes.moverItens(selecionados, destino), aoSelecionar([]))} />
              <ContextMenu.Separator className="my-1 h-px bg-borda-sutil" />
              <ContextMenu.Item className={ITEM_MENU} onSelect={() => (acoes.removerItens(selecionados), aoSelecionar([]))}>
                <Trash2 aria-hidden /> Excluir
              </ContextMenu.Item>
            </>
          ) : itemDoMenu ? (
            <>
              {itemDoMenu.tipo === "texto" ? (
                <>
                  <ContextMenu.Item className={ITEM_MENU} onSelect={() => setEditando(itemDoMenu.id)}>
                    <Pencil aria-hidden /> Editar o texto
                  </ContextMenu.Item>
                  <ContextMenu.Item className={ITEM_MENU} onSelect={() => aoPedirAjuste(itemDoMenu)}>
                    <IconeHattie nome="hattie" tamanho={16} /> Pedir ajuste ao Hattie
                  </ContextMenu.Item>
                  <ContextMenu.Item className={ITEM_MENU} onSelect={() => copiar(itemDoMenu.texto ?? "", "texto copiado")}>
                    <ClipboardCopy aria-hidden /> Copiar o texto
                  </ContextMenu.Item>
                </>
              ) : itemDoMenu.tipo !== "forma" ? (
                <>
                  <ContextMenu.Item className={ITEM_MENU} disabled={itemDoMenu.criando} onSelect={() => aoAbrir(itemDoMenu)}>
                    <Maximize2 aria-hidden /> Abrir
                  </ContextMenu.Item>
                  <ContextMenu.Item className={ITEM_MENU} disabled={itemDoMenu.criando} onSelect={() => aoPedirAjuste(itemDoMenu)}>
                    <IconeHattie nome="hattie" tamanho={16} /> Pedir ajuste ao Hattie
                  </ContextMenu.Item>
                  <ContextMenu.Item className={ITEM_MENU} disabled={itemDoMenu.criando} onSelect={() => regerar(itemDoMenu)}>
                    <RefreshCw aria-hidden /> Gerar de novo
                  </ContextMenu.Item>
                  <ContextMenu.Separator className="my-1 h-px bg-borda-sutil" />
                  {itemDoMenu.pedido && (
                    <ContextMenu.Item className={ITEM_MENU} onSelect={() => copiar(itemDoMenu.pedido ?? "", "pedido copiado")}>
                      <ClipboardCopy aria-hidden /> Copiar o pedido
                    </ContextMenu.Item>
                  )}
                  <ContextMenu.Item className={ITEM_MENU} disabled={itemDoMenu.criando} onSelect={() => notificar({ titulo: "copiado", texto: `${itemDoMenu.nome} está na sua área de transferência.` })}>
                    <Copy aria-hidden /> Copiar {itemDoMenu.tipo === "imagem" ? "a imagem" : itemDoMenu.tipo === "video" ? "o vídeo" : "a peça"}
                  </ContextMenu.Item>
                  <ContextMenu.Item className={ITEM_MENU} disabled={itemDoMenu.criando} onSelect={() => notificar({ titulo: "baixando", texto: `${itemDoMenu.nome} está a caminho.`, tipo: "sucesso" })}>
                    <Download aria-hidden /> Salvar {itemDoMenu.tipo === "imagem" ? "a imagem" : itemDoMenu.tipo === "video" ? "o vídeo" : "a peça"}
                  </ContextMenu.Item>
                </>
              ) : null}
              {itemDoMenu.tipo !== "forma" && <ContextMenu.Separator className="my-1 h-px bg-borda-sutil" />}
              <ContextMenu.Item className={ITEM_MENU} onSelect={() => aoSelecionar(acoes.duplicarItens([itemDoMenu.id]))}>
                <CopyPlus aria-hidden /> Duplicar
              </ContextMenu.Item>
              <MoverNoMenu paginas={outrasPaginas} aoMover={(destino) => (acoes.moverItens([itemDoMenu.id], destino), aoSelecionar([]))} />
              <ContextMenu.Separator className="my-1 h-px bg-borda-sutil" />
              <ContextMenu.Item className={ITEM_MENU} onSelect={() => (acoes.removerItens([itemDoMenu.id]), aoSelecionar([]))}>
                <Trash2 aria-hidden /> Excluir
              </ContextMenu.Item>
            </>
          ) : (
            <>
              <ContextMenu.Item className={ITEM_MENU} disabled={itens.length === 0} onSelect={() => aoSelecionar(itens.map((item) => item.id))}>
                <SquareDashedMousePointer aria-hidden /> Selecionar tudo
              </ContextMenu.Item>
              <ContextMenu.Item className={ITEM_MENU} disabled={itens.length === 0} onSelect={() => enquadrar(itens)}>
                <Scan aria-hidden /> Ver a página inteira
              </ContextMenu.Item>
              <ContextMenu.Separator className="my-1 h-px bg-borda-sutil" />
              <ContextMenu.Item className={ITEM_MENU} onSelect={() => escolher("imagem")}>
                <IconeImagem aria-hidden /> Nova imagem
              </ContextMenu.Item>
              <ContextMenu.Item className={ITEM_MENU} onSelect={aoAbrirConversa}>
                <IconeHattie nome="hattie" tamanho={16} /> Pedir ao Hattie
              </ContextMenu.Item>
            </>
          )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  )
}

/** "Mover para" no menu de contexto: as outras páginas do projeto. */
function MoverNoMenu({ paginas, aoMover }: { paginas: PaginaProjeto[]; aoMover: (pagina: string) => void }) {
  if (paginas.length === 0) return null
  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger className={cn(ITEM_MENU, "data-[state=open]:bg-preenchimento")}>
        <FolderInput aria-hidden /> Mover para
      </ContextMenu.SubTrigger>
      <ContextMenu.Portal>
        <ContextMenu.SubContent className="z-50 min-w-48 rounded-2xl bg-superficie p-1 shadow-(--sombra-flutuante)">
          {paginas.map((pagina) => (
            <ContextMenu.Item key={pagina.id} className={ITEM_MENU} onSelect={() => aoMover(pagina.id)}>
              <span className="truncate">{pagina.nome}</span>
            </ContextMenu.Item>
          ))}
        </ContextMenu.SubContent>
      </ContextMenu.Portal>
    </ContextMenu.Sub>
  )
}

/* ---------- Partes ---------- */

function BotaoFerramenta({ rotulo, atalho, ativo, comTexto = false, onClick, children }: { rotulo: string; atalho: string; ativo: boolean; comTexto?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={rotulo}
          aria-pressed={ativo}
          aria-keyshortcuts={atalho}
          onClick={onClick}
          className={cn(
            "flex h-10 shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background-color,color] duration-150 pointer-coarse:h-11 [&_svg]:size-[18px] [&_svg]:stroke-2",
            comTexto ? "px-2.5 @2xl:px-3" : "w-10 pointer-coarse:w-11",
            ativo ? "bg-lima text-preto" : "text-texto-2 hover:bg-preenchimento hover:text-texto",
          )}
        >
          {children}
          {comTexto && <span className="hidden @2xl:inline">{rotulo}</span>}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {rotulo} <kbd className="ms-1 font-sans opacity-60">{atalho}</kbd>
      </TooltipContent>
    </Tooltip>
  )
}

/** Texto em edição: um campo com a mesma letra do item, que cresce com o conteúdo. Guarda ao sair. */
function EditorTexto({ item, sistema, aoGuardar }: { item: ItemProjeto; sistema: SistemaMarca; aoGuardar: (texto: string, altura: number) => void }) {
  const campo = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const elemento = campo.current
    if (!elemento) return
    elemento.focus({ preventScroll: true })
    elemento.setSelectionRange(elemento.value.length, elemento.value.length)
  }, [])
  return (
    <textarea
      ref={campo}
      aria-label="Texto do item"
      defaultValue={item.texto}
      placeholder="Escreva aqui"
      rows={1}
      onPointerDown={(evento) => evento.stopPropagation()}
      onDoubleClick={(evento) => evento.stopPropagation()}
      onContextMenu={(evento) => evento.stopPropagation()}
      onKeyDown={(evento) => {
        evento.stopPropagation()
        if (evento.key === "Escape") evento.currentTarget.blur()
      }}
      onBlur={(evento) => aoGuardar(evento.currentTarget.value, evento.currentTarget.offsetHeight)}
      style={estiloDoTexto(item, sistema)}
      className="block field-sizing-content w-full resize-none bg-transparent outline-none select-text placeholder:text-texto-3"
    />
  )
}

function BotaoBarra({ rotulo, onClick, ativo, children }: { rotulo: string; onClick?: () => void; ativo?: boolean; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Botao variante="fantasma" tamanho="icone-sm" aria-label={rotulo} aria-pressed={ativo} onClick={onClick} className={cn(ativo && "bg-preenchimento-hover text-texto")}>
          {children}
        </Botao>
      </TooltipTrigger>
      <TooltipContent>{rotulo}</TooltipContent>
    </Tooltip>
  )
}

/** Ações do que está selecionado, logo acima da seleção. */
function BarraSelecao({
  itens,
  paginas,
  sistema,
  estilo,
  aoPedirAjuste,
  aoAbrir,
  aoDuplicar,
  aoMover,
  aoExcluir,
  aoMudar,
}: {
  itens: ItemProjeto[]
  paginas: PaginaProjeto[]
  sistema: SistemaMarca
  estilo: { left: number; top: number }
  aoPedirAjuste: (item: ItemProjeto) => void
  aoAbrir: (item: ItemProjeto) => void
  aoDuplicar: () => void
  aoMover: (pagina: string) => void
  aoExcluir: () => void
  aoMudar: (mudanca: Partial<ItemProjeto>) => void
}) {
  const unico = itens.length === 1 ? itens[0] : null
  const cores = [sistema.cores.principal, sistema.cores.apoio, sistema.cores.escuro, sistema.cores.fundo, "#101010", "#D3D3D3"]
  return (
    <div
      data-fora-do-canvas
      role="toolbar"
      aria-label={unico ? `Ações de ${unico.nome}` : `Ações dos ${itens.length} itens`}
      className="absolute z-10 flex w-max -translate-x-1/2 items-center gap-0.5 rounded-full bg-superficie p-1 whitespace-nowrap shadow-(--sombra-flutuante) motion-safe:animate-[aparecer_160ms_var(--ease-saida)]"
      style={estilo}
    >
      {!unico && <span className="px-2.5 text-xs font-medium tabular-nums">{itens.length} itens</span>}
      {unico && unico.tipo !== "forma" && !unico.criando && (
        <>
          <button type="button" onClick={() => aoPedirAjuste(unico)} className="clique flex h-8 items-center gap-1.5 rounded-full bg-lima ps-2 pe-3 text-detalhe font-medium text-preto hover:bg-lima/85">
            <IconeHattie nome="hattie" tamanho={16} /> Pedir ajuste
          </button>
          <span aria-hidden className="mx-1 h-4 w-px bg-borda-sutil" />
        </>
      )}
      {unico?.tipo === "texto" && (
        // Com espaço, quem cuida da letra é o painel de texto; no aperto, sobram os dois estilos básicos.
        <span className="flex items-center gap-0.5 @2xl:hidden">
          <BotaoBarra rotulo="Título" ativo={unico.estiloTexto === "titulo"} onClick={() => aoMudar({ estiloTexto: "titulo", fonte: undefined, tamanho: undefined, peso: undefined })}>
            <Heading />
          </BotaoBarra>
          <BotaoBarra rotulo="Texto corrido" ativo={unico.estiloTexto !== "titulo"} onClick={() => aoMudar({ estiloTexto: "corpo", fonte: undefined, tamanho: undefined, peso: undefined })}>
            <Pilcrow />
          </BotaoBarra>
          <span aria-hidden className="mx-1 h-4 w-px bg-borda-sutil" />
        </span>
      )}
      {unico && unico.tipo !== "forma" && unico.tipo !== "texto" && !unico.criando && (
        <BotaoBarra rotulo="Abrir" onClick={() => aoAbrir(unico)}>
          <Maximize2 />
        </BotaoBarra>
      )}
      {unico?.tipo === "forma" && (
        <>
          <div role="group" aria-label="Cor da forma" className="flex items-center gap-1 px-1.5">
            {cores.map((cor) => (
              <button
                key={cor}
                type="button"
                aria-label={`Cor ${cor}`}
                aria-pressed={unico.cor === cor}
                onClick={() => aoMudar({ cor })}
                className={cn("size-5 rounded-full shadow-[inset_0_0_0_1px_oklch(0_0_0/0.12)] transition-[scale] duration-150 hover:scale-110", unico.cor === cor && "outline-2 outline-offset-2 outline-preto outline-solid")}
                style={{ backgroundColor: cor }}
              />
            ))}
          </div>
          <span aria-hidden className="mx-1 h-4 w-px bg-borda-sutil" />
        </>
      )}
      <BotaoBarra rotulo="Duplicar" onClick={aoDuplicar}>
        <Copy />
      </BotaoBarra>
      {unico && unico.tipo !== "forma" && unico.tipo !== "texto" && !unico.criando && (
        <BotaoBarra rotulo="Baixar" onClick={() => notificar({ titulo: "baixando", texto: `${unico.nome} está a caminho.`, tipo: "sucesso" })}>
          <Download />
        </BotaoBarra>
      )}
      {paginas.length > 0 && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Botao variante="fantasma" tamanho="icone-sm" aria-label="Mover para outra página">
                  <FolderInput />
                </Botao>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Mover para outra página</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="center" className="w-56 rounded-2xl p-1">
            <DropdownMenuLabel className="text-xs font-medium text-texto-3">Mover para</DropdownMenuLabel>
            {paginas.map((pagina) => (
              <DropdownMenuItem key={pagina.id} onSelect={() => aoMover(pagina.id)} className="h-9 rounded-xl px-2.5 text-sm">
                <span className="truncate">{pagina.nome}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <BotaoBarra rotulo="Excluir" onClick={aoExcluir}>
        <Trash2 />
      </BotaoBarra>
    </div>
  )
}
