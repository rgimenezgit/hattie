import {
  ARQUIVOS,
  CORES_BUSCA,
  HOJE_BIBLIOTECA,
  ORIGENS,
  PARCEIROS,
  PROJETOS,
  QUEM_APARECE,
  STATUS_ARQUIVO,
  TIPOS_ARQUIVO,
  type ArquivoBiblioteca,
  type TipoArquivo,
} from "@/lib/mock"

/*
 * Busca por frase da biblioteca. Lê o pedido como a pessoa fala ("fotos do pequi em fundo verde de outubro")
 * e separa o que entendeu em categorias: tipo, quem aparece, cor, período, quem fez, situação e projeto.
 * O resto vira palavra solta, comparada com nome, descrição e etiquetas de cada arquivo.
 * Quando a busca é rígida demais, afrouxa (tira cor, depois período) e avisa.
 * Fica pronta para trocar por busca vetorial: a interface (interpretar e buscar) não muda.
 */

export type Categoria = "tipo" | "aparece" | "cor" | "periodo" | "origem" | "parceiro" | "status" | "projeto" | "termo"

export type Entendido = { categoria: Categoria; valor: string; rotulo: string; /** Trecho da frase que gerou isto. */ trecho: string }

export const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const PALAVRAS_TIPO: Record<TipoArquivo, string[]> = {
  foto: ["foto", "fotos", "fotografia", "fotografias", "imagem", "imagens", "ensaio", "retrato"],
  ilustracao: ["ilustracao", "ilustracoes", "desenho", "desenhos", "ilustrado", "ilustrada"],
  grafismo: ["grafismo", "grafismos", "padrao", "padroes", "textura grafica", "estampa", "estampas", "selo", "carimbo"],
  peca: ["post", "posts", "story", "stories", "carrossel", "carrosseis", "peca", "pecas", "banner", "banners", "anuncio", "cartaz", "rotulo", "rotulos", "feed"],
  apresentacao: ["apresentacao", "apresentacoes", "slide", "slides", "deck", "catalogo de produtos"],
  video: ["video", "videos", "reels", "reel", "animacao", "filme"],
  logo: ["logo", "logos", "logotipo", "simbolo", "logomarca"],
  documento: ["documento", "documentos", "pdf", "texto", "textos", "guia", "manual", "briefing", "ficha", "fichas"],
}

const MESES = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]

const PERIODOS: { frases: string[]; valor: string; rotulo: string }[] = [
  { frases: ["hoje", "de hoje"], valor: "hoje", rotulo: "Hoje" },
  { frases: ["ontem", "de ontem"], valor: "ontem", rotulo: "Ontem" },
  { frases: ["esta semana", "essa semana", "nesta semana", "da semana"], valor: "semana", rotulo: "Esta semana" },
  { frases: ["semana passada"], valor: "semana-passada", rotulo: "Semana passada" },
  { frases: ["este mes", "esse mes", "neste mes", "do mes"], valor: "mes", rotulo: "Este mês" },
  { frases: ["mes passado"], valor: "mes-passado", rotulo: "Mês passado" },
  { frases: ["recente", "recentes", "ultimos dias", "novos", "novas"], valor: "recente", rotulo: "Últimos 14 dias" },
  ...MESES.map((mes, indice) => ({ frases: [mes, `em ${mes}`, `de ${mes}`], valor: `m-${indice + 1}`, rotulo: mes[0].toUpperCase() + mes.slice(1).replace("marco", "março") })),
]

const STOP = new Set(
  "a o as os um uma uns umas de do da dos das no na nos nas em com sem para pra pro por que e ou me mim meu minha meus minhas eu quero queria procuro procurando preciso mostra mostrar mostre ver achar acha encontra encontrar tem todo toda todos todas tudo isso esse essa este esta aquele aquela ai la qual quais onde fundo cor cores tom feito feita feitos feitas foi era sobre algum alguma criei criado criados criadas fiz fizemos salvei guardei tenho".split(
    " ",
  ),
)

type Entrada = { frase: string; categoria: Categoria; valor: string; rotulo: string }

let dicionario: Entrada[] | null = null

function montarDicionario(): Entrada[] {
  const lista: Entrada[] = []
  const add = (frases: string[], categoria: Categoria, valor: string, rotulo: string) => frases.forEach((frase) => lista.push({ frase: normalizar(frase), categoria, valor, rotulo }))

  for (const [tipo, palavras] of Object.entries(PALAVRAS_TIPO)) add(palavras, "tipo", tipo, TIPOS_ARQUIVO[tipo as TipoArquivo].plural)
  for (const quem of QUEM_APARECE) add([quem.nome, ...quem.apelidos], "aparece", quem.id, quem.nome)
  for (const cor of CORES_BUSCA) add(cor.palavras, "cor", cor.hex, cor.nome)
  for (const periodo of PERIODOS) add(periodo.frases, "periodo", periodo.valor, periodo.rotulo)
  add(["parceiro", "parceiros", "parceira", "parceiras", "freela", "designer", "fotografo"], "origem", "parceiro", ORIGENS.parceiro)
  add(["hattie", "criado com o hattie", "que o hattie fez", "do hattie", "gerado", "gerados"], "origem", "hattie", ORIGENS.hattie)
  add(["enviei", "que eu enviei", "enviado por mim", "meus arquivos", "upload", "subi", "que eu subi"], "origem", "voce", ORIGENS.voce)
  for (const parceiro of PARCEIROS) add([parceiro.nome, `da ${parceiro.nome.split(" ")[0]}`, `do ${parceiro.nome.split(" ")[0]}`, parceiro.nome.split(" ")[0]], "parceiro", parceiro.id, parceiro.nome)
  add(["aprovado", "aprovados", "aprovada", "aprovadas", "pronto", "prontos", "final", "finais"], "status", "aprovado", STATUS_ARQUIVO.aprovado)
  add(["rascunho", "rascunhos", "em andamento", "nao aprovado"], "status", "rascunho", STATUS_ARQUIVO.rascunho)
  add(["publicado", "publicados", "publicada", "publicadas", "postado", "postados"], "status", "publicado", STATUS_ARQUIVO.publicado)
  add(["favorito", "favoritos", "favorita", "favoritas", "estrela"], "status", "favorito", "Favoritos")
  for (const projeto of PROJETOS) add([projeto.nome], "projeto", projeto.id, projeto.nome)
  add(["black friday", "bf"], "projeto", "black-friday", "Black Friday consciente")
  add(["lancamento", "lancamento do pequi"], "projeto", "pequi", "Lançamento do óleo de pequi")
  add(["catalogo", "lojistas"], "projeto", "catalogo", "Catálogo para lojistas")

  // Frases maiores primeiro: "lancamento do oleo de pequi" ganha de "pequi".
  return lista.sort((a, b) => b.frase.length - a.frase.length)
}

/** Lê a frase e devolve o que entendeu, na ordem em que aparece. */
export function interpretar(consulta: string): Entendido[] {
  dicionario ??= montarDicionario()
  let resto = ` ${normalizar(consulta)} `
  const achados: (Entendido & { posicao: number })[] = []
  // A mesma frase pode valer para mais de um valor ("escuro" é verde-mata e cacau): todos entram antes de apagar o trecho.
  const frases = [...new Set(dicionario.map((entrada) => entrada.frase))]
  for (const frase of frases) {
    const alvo = ` ${frase} `
    const posicao = resto.indexOf(alvo)
    if (posicao === -1) continue
    for (const entrada of dicionario.filter((item) => item.frase === frase)) {
      if (!achados.some((item) => item.categoria === entrada.categoria && item.valor === entrada.valor)) {
        achados.push({ categoria: entrada.categoria, valor: entrada.valor, rotulo: entrada.rotulo, trecho: frase, posicao })
      }
    }
    resto = resto.slice(0, posicao) + " ".repeat(alvo.length - 1) + resto.slice(posicao + alvo.length - 1)
  }
  resto.split(" ").forEach((palavra, indice, lista) => {
    if (palavra.length < 3 || STOP.has(palavra) || /^\d+$/.test(palavra)) return
    const posicao = lista.slice(0, indice).join(" ").length
    achados.push({ categoria: "termo", valor: palavra, rotulo: palavra, trecho: palavra, posicao })
  })
  return achados.sort((a, b) => a.posicao - b.posicao).map((item) => ({ categoria: item.categoria, valor: item.valor, rotulo: item.rotulo, trecho: item.trecho }))
}

/* ---------- Datas ---------- */

const dia = (iso: string) => new Date(`${iso}T12:00:00`)
const HOJE = dia(HOJE_BIBLIOTECA)
const diasAtras = (iso: string) => Math.round((HOJE.getTime() - dia(iso).getTime()) / 86_400_000)
const inicioDaSemana = () => {
  const data = new Date(HOJE)
  data.setDate(data.getDate() - ((data.getDay() + 6) % 7))
  return data
}

export function noPeriodo(iso: string, periodo: string) {
  const data = dia(iso)
  const mesAtual = HOJE.getMonth()
  switch (periodo) {
    case "todos":
      return true
    case "hoje":
      return diasAtras(iso) === 0
    case "ontem":
      return diasAtras(iso) === 1
    case "semana":
      return data >= inicioDaSemana()
    case "semana-passada": {
      const inicio = inicioDaSemana()
      const anterior = new Date(inicio)
      anterior.setDate(anterior.getDate() - 7)
      return data >= anterior && data < inicio
    }
    case "recente":
      return diasAtras(iso) <= 14
    case "mes":
      return data.getMonth() === mesAtual && data.getFullYear() === HOJE.getFullYear()
    case "mes-passado":
      return data.getMonth() === (mesAtual + 11) % 12
    case "3meses":
      return diasAtras(iso) <= 92
    default:
      return periodo.startsWith("m-") ? data.getMonth() + 1 === Number(periodo.slice(2)) : true
  }
}

const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

export function dataCurta(iso: string) {
  const data = dia(iso)
  const atras = diasAtras(iso)
  if (atras === 0) return "hoje"
  if (atras === 1) return "ontem"
  return `${data.getDate()} ${MESES_CURTOS[data.getMonth()]}${data.getFullYear() !== HOJE.getFullYear() ? ` ${data.getFullYear()}` : ""}`
}

export function dataLonga(iso: string) {
  const data = dia(iso)
  return `${data.getDate()} de ${MESES[data.getMonth()].replace("marco", "março")} de ${data.getFullYear()}`
}

/** Grupo de data para a grade: Hoje, Ontem, Esta semana, Mais cedo em novembro, Outubro… */
export function grupoDaData(iso: string) {
  const data = dia(iso)
  const atras = diasAtras(iso)
  if (atras === 0) return "Hoje"
  if (atras === 1) return "Ontem"
  if (data >= inicioDaSemana()) return "Esta semana"
  const mes = MESES[data.getMonth()].replace("marco", "março")
  if (data.getMonth() === HOJE.getMonth() && data.getFullYear() === HOJE.getFullYear()) return `Mais cedo em ${mes}`
  return `${mes[0].toUpperCase()}${mes.slice(1)}${data.getFullYear() !== HOJE.getFullYear() ? ` de ${data.getFullYear()}` : ""}`
}

/* ---------- Busca ---------- */

const textoDoArquivo = new Map<string, string[]>()
function palavrasDo(arquivo: ArquivoBiblioteca) {
  let palavras = textoDoArquivo.get(arquivo.id)
  if (!palavras) {
    const projeto = PROJETOS.find((item) => item.id === arquivo.projeto)?.nome ?? ""
    const quem = arquivo.aparece.map((id) => QUEM_APARECE.find((item) => item.id === id)?.nome ?? "").join(" ")
    const parceiro = PARCEIROS.find((item) => item.id === arquivo.parceiro)?.nome ?? ""
    palavras = normalizar([arquivo.nome, arquivo.descricao, arquivo.tags.join(" "), projeto, quem, parceiro, TIPOS_ARQUIVO[arquivo.tipo].rotulo, arquivo.formato].join(" ")).split(" ")
    textoDoArquivo.set(arquivo.id, palavras)
  }
  return palavras
}

const raiz = (palavra: string) => palavra.replace(/(oes|aes|s)$/, "")
function casaTermo(termo: string, palavras: string[]) {
  const r = raiz(termo)
  return palavras.some((palavra) => palavra === termo || (r.length >= 4 && (palavra.startsWith(r) || (palavra.length >= 4 && r.startsWith(raiz(palavra))))))
}

function passa(arquivo: ArquivoBiblioteca, categoria: Categoria, valores: string[]) {
  switch (categoria) {
    case "tipo":
      return valores.includes(arquivo.tipo)
    case "aparece":
      return arquivo.aparece.some((id) => valores.includes(id))
    case "cor":
      return arquivo.cores.some((hex) => valores.includes(hex))
    case "periodo":
      return valores.some((periodo) => noPeriodo(arquivo.data, periodo))
    case "origem":
      return valores.includes(arquivo.origem)
    case "parceiro":
      return !!arquivo.parceiro && valores.includes(arquivo.parceiro)
    case "status":
      // Publicado já passou pela aprovação: conta como aprovado.
      return valores.some((valor) => (valor === "favorito" ? arquivo.favorito : arquivo.status === valor || (valor === "aprovado" && arquivo.status === "publicado")))
    case "projeto":
      return !!arquivo.projeto && valores.includes(arquivo.projeto)
    default:
      return true
  }
}

/** Ordem em que a busca afrouxa quando não acha nada. */
const AFROUXAR: Categoria[] = ["cor", "periodo", "status", "origem", "parceiro", "projeto"]
const NOMES_CATEGORIA: Partial<Record<Categoria, string>> = { cor: "a cor", periodo: "a data", status: "a situação", origem: "quem fez", parceiro: "o parceiro", projeto: "o projeto" }

export type ResultadoBusca = {
  arquivos: ArquivoBiblioteca[]
  entendidos: Entendido[]
  /** Categorias que a busca tirou para achar alguma coisa. */
  afrouxou: string[]
  /** Palavras soltas que não bateram com nada. */
  ignoradas: string[]
}

/** Busca por frase sobre uma lista (já filtrada pelos filtros da tela). Devolve em ordem de relevância. */
export function buscar(consulta: string, lista: ArquivoBiblioteca[] = ARQUIVOS): ResultadoBusca {
  const entendidos = interpretar(consulta)
  const porCategoria = new Map<Categoria, string[]>()
  entendidos.forEach((item) => item.categoria !== "termo" && porCategoria.set(item.categoria, [...(porCategoria.get(item.categoria) ?? []), item.valor]))
  const termos = entendidos.filter((item) => item.categoria === "termo").map((item) => item.valor)

  const filtrar = (categorias: Map<Categoria, string[]>) => lista.filter((arquivo) => [...categorias].every(([categoria, valores]) => passa(arquivo, categoria, valores)))
  let candidatos = filtrar(porCategoria)
  const afrouxou: string[] = []
  for (const categoria of AFROUXAR) {
    if (candidatos.length || !porCategoria.has(categoria)) continue
    porCategoria.delete(categoria)
    afrouxou.push(NOMES_CATEGORIA[categoria] ?? categoria)
    candidatos = filtrar(porCategoria)
  }

  const pontos = new Map(candidatos.map((arquivo) => [arquivo.id, termos.filter((termo) => casaTermo(termo, palavrasDo(arquivo))).length]))
  const ignoradas = termos.filter((termo) => !candidatos.some((arquivo) => casaTermo(termo, palavrasDo(arquivo))))
  if (termos.length > ignoradas.length) candidatos = candidatos.filter((arquivo) => (pontos.get(arquivo.id) ?? 0) > 0)

  // Relevância: palavras soltas pesam mais; depois, a cor dominante, quem aparece em primeiro e o nome que repete a frase.
  const estruturados = entendidos.filter((item) => item.categoria !== "termo")
  const relevancia = (arquivo: ArquivoBiblioteca) => {
    const nome = normalizar(arquivo.nome)
    let total = (pontos.get(arquivo.id) ?? 0) * 3
    const etiquetas = normalizar(arquivo.tags.join(" "))
    for (const termo of termos) {
      if (nome.includes(raiz(termo))) total += 2
      if (etiquetas.includes(raiz(termo))) total += 1
    }
    for (const item of estruturados) {
      if (item.categoria === "cor" && arquivo.cores[0] === item.valor) total += 2
      if (item.categoria === "aparece" && arquivo.aparece[0] === item.valor) total += 1
      if (item.trecho.split(" ").some((palavra) => palavra.length > 3 && nome.includes(palavra))) total += 1
    }
    return total
  }
  const arquivos = [...candidatos].sort((a, b) => relevancia(b) - relevancia(a) || b.data.localeCompare(a.data))
  return { arquivos, entendidos, afrouxou, ignoradas }
}

/** Frases de exemplo para quem não sabe por onde começar. */
export const SUGESTOES_BUSCA = ["fotos do pequi", "posts de natal", "tudo da Ana Lúcia", "o que criei esta semana", "logo em fundo escuro", "a Flor colhendo", "vídeos aprovados"]
