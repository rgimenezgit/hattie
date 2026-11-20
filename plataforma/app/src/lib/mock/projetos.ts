import { ARQUIVOS, type ArquivoBiblioteca, type PreviaArquivo } from "./biblioteca"
import { PROJETOS } from "./home"
import type { PapelFonte } from "./tipos"

/* ---------- Projetos: o lugar onde a marca cria. Cada projeto tem pastas, páginas e itens ---------- */

/** As três formas de ver uma página do projeto. */
export type VistaProjeto = "canvas" | "grade" | "thread"

export type TipoItemProjeto = "imagem" | "video" | "texto" | "peca" | "forma"
export type FormaProjeto = "retangulo" | "elipse" | "seta"
export type AutorItem = "hattie" | "voce" | "parceiro"

/** Ajustes de imagem feitos no visor, de -100 a 100. Zero é a imagem original. */
export type AjustesImagem = { exposicao: number; contraste: number; saturacao: number; temperatura: number; espelhada?: boolean }

/** Opções escolhidas na hora de pedir uma imagem, um vídeo ou uma peça. */
export type GeracaoItem = { proporcao?: string; resolucao?: string; estilo?: string; referencia?: string; duracao?: string }

/**
 * Um item do projeto: imagem, vídeo, texto, peça ou forma. Mora numa página e tem lugar no canvas
 * (x, y, largura e altura em pontos do canvas). O mesmo item aparece na grade e na thread.
 */
export type ItemProjeto = {
  id: string
  pagina: string
  tipo: TipoItemProjeto
  nome: string
  x: number
  y: number
  l: number
  a: number
  /** Como desenhar a imagem, o vídeo ou a peça enquanto não há arquivo de verdade. */
  previa?: PreviaArquivo
  texto?: string
  /** Estilo de texto: id de um estilo da tipografia da marca ("h1", "corpo"…). "titulo" e "corpo" são os básicos. */
  estiloTexto?: string
  /** Mudanças sobre o estilo: fonte (papel na marca), tamanho em px, peso, alinhamento e cor. */
  fonte?: PapelFonte
  tamanho?: number
  peso?: number
  alinhamento?: "left" | "center" | "right"
  corTexto?: string
  /** O que a pessoa pediu ao Hattie para chegar neste item. */
  pedido?: string
  geracao?: GeracaoItem
  ajustes?: AjustesImagem
  forma?: FormaProjeto
  /** Cor da forma (hex da marca da cliente ou neutro). */
  cor?: string
  autor: AutorItem
  /** Data e hora em ISO. */
  criado: string
  /** O Hattie ainda está criando: aparece como espaço reservado. */
  criando?: boolean
  /** id do arquivo na Biblioteca, quando o item já foi guardado lá. */
  arquivo?: string
}

/** Página: um canvas dentro do projeto. Pode ficar solta ou dentro de uma pasta. */
export type PaginaProjeto = { id: string; nome: string; pasta?: string }
export type PastaProjeto = { id: string; nome: string }

/** Mensagem da conversa do projeto. As do Hattie podem trazer os itens que ele criou. */
export type MensagemProjeto = {
  id: string
  autor: "hattie" | "pessoa"
  texto: string
  /** Página em que a conversa aconteceu (onde os itens foram parar). */
  pagina: string
  quando: string
  itens?: string[]
  /** Nome do item sobre o qual a pessoa pediu um ajuste. */
  sobre?: string
}

export type SituacaoProjeto = "andamento" | "concluido" | "arquivado"
export type TipoProjeto = "Lançamento" | "Campanha" | "Catálogo" | "Redes sociais" | "Outro"

export type ProjetoMarca = {
  id: string
  nome: string
  descricao: string
  tipo: TipoProjeto
  situacao: SituacaoProjeto
  /** Data e hora da última mudança, em ISO. */
  atualizado: string
  fixado?: boolean
  /** Parceiro que trabalha no projeto, quando há. */
  parceiro?: string
  pastas: PastaProjeto[]
  paginas: PaginaProjeto[]
  itens: ItemProjeto[]
  conversa: MensagemProjeto[]
}

export const SITUACOES_PROJETO: Record<SituacaoProjeto, string> = { andamento: "Em andamento", concluido: "Concluído", arquivado: "Arquivado" }

export const TIPOS_ITEM: Record<TipoItemProjeto, { rotulo: string; plural: string }> = {
  imagem: { rotulo: "Imagem", plural: "Imagens" },
  video: { rotulo: "Vídeo", plural: "Vídeos" },
  peca: { rotulo: "Peça", plural: "Peças" },
  texto: { rotulo: "Texto", plural: "Textos" },
  forma: { rotulo: "Forma", plural: "Formas" },
}

/** "Agora" dos dados fictícios, para os textos de tempo não mudarem entre servidor e navegador. */
export const AGORA_PROJETOS = "2026-11-12T16:40:00"

/* ---------- Montagem a partir da Biblioteca ---------- */

const arquivo = (id: string) => ARQUIVOS.find((item) => item.id === id) as ArquivoBiblioteca

/** Largura sobre altura de um arquivo da biblioteca. */
function proporcaoDe(item: ArquivoBiblioteca): number {
  const { previa } = item
  if (previa.tipo === "peca") return previa.proporcao[0] / previa.proporcao[1]
  if (previa.tipo === "video") return 9 / 16
  if (previa.tipo === "apresentacao") return 16 / 10
  if (previa.tipo === "documento") return 3 / 4
  const medidas = item.formato.match(/(\d+)\s*×\s*(\d+)/)
  return medidas ? Number(medidas[1]) / Number(medidas[2]) : 1
}

const TIPO_DO_ARQUIVO: Record<ArquivoBiblioteca["tipo"], TipoItemProjeto> = {
  foto: "imagem",
  ilustracao: "imagem",
  grafismo: "imagem",
  logo: "imagem",
  video: "video",
  peca: "peca",
  apresentacao: "peca",
  documento: "peca",
}

/** Põe arquivos da biblioteca numa linha do canvas, todos com a mesma altura. */
function linha(pagina: string, ids: string[], x: number, y: number, altura: number, criado: string, espaco = 48): ItemProjeto[] {
  let cursor = x
  return ids.map((id) => {
    const item = arquivo(id)
    const largura = Math.round(altura * proporcaoDe(item))
    const novo: ItemProjeto = {
      id: `it-${id}`,
      pagina,
      tipo: TIPO_DO_ARQUIVO[item.tipo],
      nome: item.nome,
      x: cursor,
      y,
      l: largura,
      a: altura,
      previa: item.previa,
      autor: item.origem,
      criado,
      arquivo: id,
    }
    cursor += largura + espaco
    return novo
  })
}

function texto(id: string, pagina: string, conteudo: string, x: number, y: number, l: number, estiloTexto: "titulo" | "corpo", criado: string, autor: AutorItem = "voce"): ItemProjeto {
  const linhas = Math.ceil((conteudo.length * (estiloTexto === "titulo" ? 16 : 9)) / l)
  return { id, pagina, tipo: "texto", nome: conteudo.slice(0, 36), x, y, l, a: linhas * (estiloTexto === "titulo" ? 36 : 28) + 4, texto: conteudo, estiloTexto, autor, criado }
}

function forma(id: string, pagina: string, tipoForma: FormaProjeto, x: number, y: number, l: number, a: number, cor: string, criado: string): ItemProjeto {
  const nomes: Record<FormaProjeto, string> = { retangulo: "Retângulo", elipse: "Elipse", seta: "Seta" }
  return { id, pagina, tipo: "forma", nome: nomes[tipoForma], x, y, l, a, forma: tipoForma, cor, autor: "voce", criado }
}

const VERDE = "#2F4A3A"
const ARGILA = "#C9A27E"

/* ---------- Lançamento do óleo de pequi ---------- */

const PEQUI_ITENS: ItemProjeto[] = [
  texto("it-pequi-t1", "ideias", "Lançamento do óleo de pequi", 0, 0, 560, "titulo", "2026-11-08T09:10:00"),
  texto("it-pequi-t2", "ideias", "Clima: manhã no cerrado, luz quente, mãos de quem colhe. O frasco aparece sempre com o lote à vista.", 0, 56, 520, "corpo", "2026-11-08T09:12:00"),
  ...linha("ideias", ["i-pequi", "i-frasco", "i-flor-colhendo"], 0, 180, 300, "2026-11-08T09:30:00"),
  forma("it-pequi-seta", "ideias", "seta", 1010, 320, 150, 20, VERDE, "2026-11-08T09:40:00"),
  texto("it-pequi-t3", "ideias", "A Flor apresenta o produto nos posts da primeira semana.", 1180, 290, 260, "corpo", "2026-11-08T09:41:00"),

  ...linha("fotos", ["f-pequi-bancada", "f-pequi-maos", "f-pequi-verde"], 0, 0, 440, "2026-11-10T14:05:00"),
  texto("it-pequi-t4", "fotos", "Para a loja: a da bancada é a principal.", 0, 480, 360, "corpo", "2026-11-10T14:20:00"),

  ...linha("posts", ["p-post-lancamento", "p-story-pequi"], 0, 0, 480, "2026-11-11T10:15:00"),
  texto(
    "it-pequi-legenda",
    "posts",
    "Chegou o óleo de pequi do lote 12. Colhido pela cooperativa de Pirenópolis, prensado a frio e pronto para a sua rotina.",
    720,
    0,
    340,
    "corpo",
    "2026-11-11T10:18:00",
    "hattie",
  ),
  forma("it-pequi-bloco", "posts", "retangulo", 720, 150, 340, 120, ARGILA, "2026-11-11T11:00:00"),

  ...linha("video", ["v-textura"], 0, 0, 520, "2026-11-12T16:38:00"),
  texto("it-pequi-roteiro", "video", "Roteiro: 1. gota caindo em câmera lenta. 2. mão espalhando. 3. frasco com o lote. 4. logo.", 340, 0, 320, "corpo", "2026-11-12T16:30:00"),
]

const PEQUI_CONVERSA: MensagemProjeto[] = [
  { id: "mp-1", autor: "pessoa", texto: "Me mostra o pequi, o frasco e a Flor no estilo de ilustração da marca, para eu montar as ideias.", pagina: "ideias", quando: "2026-11-08T09:28:00" },
  {
    id: "mp-2",
    autor: "hattie",
    texto: "Fiz as três ilustrações com o traço e as cores da Raiz Natural. Estão lado a lado em Ideias.",
    pagina: "ideias",
    quando: "2026-11-08T09:30:00",
    itens: ["it-i-pequi", "it-i-frasco", "it-i-flor-colhendo"],
  },
  { id: "mp-3", autor: "pessoa", texto: "Quero três fotos do frasco para a loja: na bancada, na mão e num fundo da marca.", pagina: "fotos", quando: "2026-11-10T14:02:00" },
  {
    id: "mp-4",
    autor: "hattie",
    texto: "Pronto, Bia. Usei a luz de janela do estilo fotográfico da marca e o fundo verde-mata #2F4A3A na terceira.",
    pagina: "fotos",
    quando: "2026-11-10T14:05:00",
    itens: ["it-f-pequi-bancada", "it-f-pequi-maos", "it-f-pequi-verde"],
  },
  { id: "mp-5", autor: "pessoa", texto: "Agora um post e um story de lançamento, com legenda.", pagina: "posts", quando: "2026-11-11T10:12:00" },
  {
    id: "mp-6",
    autor: "hattie",
    texto: "Criei o post, o story e a legenda em Posts da semana. A legenda fala do lote 12 e da cooperativa, como nas suas mensagens-chave.",
    pagina: "posts",
    quando: "2026-11-11T10:18:00",
    itens: ["it-p-post-lancamento", "it-p-story-pequi", "it-pequi-legenda"],
  },
  { id: "mp-7", autor: "pessoa", texto: "Um vídeo curto mostrando a textura do óleo.", pagina: "video", quando: "2026-11-12T16:36:00" },
  {
    id: "mp-8",
    autor: "hattie",
    texto: "Fiz um vídeo de 15 segundos em câmera lenta, na vertical, pronto para Reels.",
    pagina: "video",
    quando: "2026-11-12T16:38:00",
    itens: ["it-v-textura"],
  },
]

/* ---------- Os outros três projetos ---------- */

const BF_ITENS: ItemProjeto[] = [
  texto("it-bf-t1", "campanha", "Black Friday consciente", 0, 0, 520, "titulo", "2026-11-05T10:00:00"),
  texto("it-bf-t2", "campanha", "Desconto só no que tem estoque do lote. Sem contagem regressiva e sem pressa.", 0, 56, 460, "corpo", "2026-11-05T10:02:00"),
  ...linha("campanha", ["p-bf-oferta", "p-bf-story", "p-bf-banner"], 0, 170, 420, "2026-11-12T15:35:00"),
  ...linha("plano", ["a-bf-plano"], 0, 0, 360, "2026-11-06T11:00:00"),
  texto("it-bf-email", "plano", "E-mail para clientes: assunto “15% no que você já usa”. Envio na quinta, 26/11.", 620, 0, 320, "corpo", "2026-11-06T11:20:00", "hattie"),
]

const BF_CONVERSA: MensagemProjeto[] = [
  { id: "mb-1", autor: "pessoa", texto: "Preciso da arte da Black Friday em post, story e banner do site.", pagina: "campanha", quando: "2026-11-12T15:30:00" },
  {
    id: "mb-2",
    autor: "hattie",
    texto: "Fiz as três peças com o mesmo layout de oferta. O desconto aparece grande e o prazo fica claro embaixo.",
    pagina: "campanha",
    quando: "2026-11-12T15:35:00",
    itens: ["it-p-bf-oferta", "it-p-bf-story", "it-p-bf-banner"],
  },
]

const CATALOGO_ITENS: ItemProjeto[] = [
  ...linha("fotos", ["f-cooperativa", "f-lote-sol", "f-baru-recorte"], 0, 0, 420, "2026-11-11T09:00:00"),
  texto("it-cat-t1", "fotos", "Fotos da Ana, entregues em 11/11. Falta a do sabonete de buriti.", 0, 460, 420, "corpo", "2026-11-11T09:30:00"),
  ...linha("catalogo", ["a-catalogo", "d-fichas", "i-baru"], 0, 0, 360, "2026-11-11T17:00:00"),
]

const NOVEMBRO_ITENS: ItemProjeto[] = [
  texto("it-nov-t1", "posts", "Posts de novembro", 0, 0, 420, "titulo", "2026-11-02T09:00:00"),
  ...linha("posts", ["p-carrossel-beneficios", "p-depoimento", "p-post-lote"], 0, 80, 400, "2026-11-09T10:00:00"),
]

const BASE: Record<string, Omit<ProjetoMarca, "id" | "nome">> = {
  pequi: {
    descricao: "Fotos, posts e vídeo para apresentar o óleo de pequi do lote 12.",
    tipo: "Lançamento",
    situacao: "andamento",
    atualizado: "2026-11-12T16:38:00",
    fixado: true,
    pastas: [
      { id: "redes", nome: "Redes sociais" },
      { id: "loja", nome: "Loja" },
    ],
    paginas: [
      { id: "ideias", nome: "Ideias" },
      { id: "posts", nome: "Posts da semana", pasta: "redes" },
      { id: "video", nome: "Vídeo de lançamento", pasta: "redes" },
      { id: "fotos", nome: "Fotos do frasco", pasta: "loja" },
    ],
    itens: PEQUI_ITENS,
    conversa: PEQUI_CONVERSA,
  },
  "black-friday": {
    descricao: "Oferta de 15% nos produtos com estoque do lote, de 26 a 29/11.",
    tipo: "Campanha",
    situacao: "andamento",
    atualizado: "2026-11-12T15:35:00",
    pastas: [],
    paginas: [
      { id: "campanha", nome: "Artes da campanha" },
      { id: "plano", nome: "Plano e e-mail" },
    ],
    itens: BF_ITENS,
    conversa: BF_CONVERSA,
  },
  catalogo: {
    descricao: "Catálogo de 2027 para apresentar a marca a lojas da região.",
    tipo: "Catálogo",
    situacao: "andamento",
    atualizado: "2026-11-11T17:00:00",
    parceiro: "Ana Lúcia Prado",
    pastas: [],
    paginas: [
      { id: "fotos", nome: "Fotos dos produtos" },
      { id: "catalogo", nome: "Catálogo e fichas" },
    ],
    itens: CATALOGO_ITENS,
    conversa: [],
  },
  novembro: {
    descricao: "Calendário de posts do mês, com um carrossel educativo por semana.",
    tipo: "Redes sociais",
    situacao: "concluido",
    atualizado: "2026-11-09T10:00:00",
    pastas: [],
    paginas: [{ id: "posts", nome: "Posts" }],
    itens: NOVEMBRO_ITENS,
    conversa: [],
  },
}

/** Cada item que saiu de um pedido guarda o texto do pedido (a mensagem da pessoa logo antes da resposta do Hattie). */
function comPedidos(itens: ItemProjeto[], conversa: MensagemProjeto[]): ItemProjeto[] {
  const pedidoDe = new Map<string, string>()
  conversa.forEach((mensagem, indice) => {
    if (mensagem.autor !== "hattie" || !mensagem.itens) return
    const pedido = conversa[indice - 1]?.autor === "pessoa" ? conversa[indice - 1].texto : undefined
    if (pedido) mensagem.itens.forEach((id) => pedidoDe.set(id, pedido))
  })
  return itens.map((item) => (pedidoDe.has(item.id) ? { ...item, pedido: pedidoDe.get(item.id), geracao: item.tipo === "imagem" ? { resolucao: "2K", estilo: "Origem natural" } : undefined } : item))
}

/** Projetos de exemplo da Raiz Natural, na mesma ordem e com os mesmos ids de PROJETOS (início e biblioteca). */
export const PROJETOS_MARCA: ProjetoMarca[] = PROJETOS.map((projeto) => {
  const base = BASE[projeto.id]
  return { id: projeto.id, nome: projeto.nome, ...base, itens: comPedidos(base.itens, base.conversa) }
})
