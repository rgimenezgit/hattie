import { peca, AGORA_PROJETOS, type DesenhoIlustracao, type GeracaoItem, type ItemProjeto, type LayoutPeca, type PreviaArquivo, type TipoItemProjeto } from "@/lib/mock"

/*
 * Apoio da área de Projetos: tempo relativo, caixa que envolve itens no canvas e a leitura do pedido
 * que a pessoa faz ao Hattie. Nesta versão de teste, o Hattie "cria" a partir de palavras do pedido.
 */

/* ---------- Tempo ---------- */

let passo = 0
/** Hora de um item novo: o "agora" dos dados fictícios mais alguns segundos, para manter a ordem. */
export function agoraProjeto() {
  passo += 1
  return new Date(new Date(AGORA_PROJETOS).getTime() + passo * 20_000).toISOString().slice(0, 19)
}

let sequencia = 0
export const novoId = (prefixo: string) => `${prefixo}-${Date.now().toString(36)}-${++sequencia}`

/** "agora", "há 5 minutos", "ontem", "há 3 dias" ou a data curta. */
export function haQuanto(iso: string) {
  const minutos = Math.round((new Date(AGORA_PROJETOS).getTime() - new Date(iso).getTime()) / 60_000)
  if (minutos < 2) return "agora"
  if (minutos < 60) return `há ${minutos} minutos`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return horas === 1 ? "há 1 hora" : `há ${horas} horas`
  const dias = Math.round(horas / 24)
  if (dias === 1) return "ontem"
  if (dias < 30) return `há ${dias} dias`
  return dataCurtaProjeto(iso)
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
export function dataCurtaProjeto(iso: string) {
  const [, mes, dia] = iso.slice(0, 10).split("-")
  return `${Number(dia)} ${MESES[Number(mes) - 1]}`
}

export function horaCurta(iso: string) {
  return iso.slice(11, 16).replace(":", "h")
}

/* ---------- Canvas ---------- */

export type Caixa = { x: number; y: number; l: number; a: number }

/** Caixa que envolve todos os itens, ou null quando não há itens. */
export function caixaDe(itens: Pick<ItemProjeto, "x" | "y" | "l" | "a">[]): Caixa | null {
  if (itens.length === 0) return null
  const x = Math.min(...itens.map((item) => item.x))
  const y = Math.min(...itens.map((item) => item.y))
  const direita = Math.max(...itens.map((item) => item.x + item.l))
  const base = Math.max(...itens.map((item) => item.y + item.a))
  return { x, y, l: direita - x, a: base - y }
}

/** Onde colocar itens novos numa página: uma linha nova, abaixo do que já existe. */
export function proximoLugar(itensDaPagina: ItemProjeto[]) {
  const caixa = caixaDe(itensDaPagina)
  return caixa ? { x: caixa.x, y: caixa.y + caixa.a + 72 } : { x: 0, y: 0 }
}

/* ---------- Leitura do pedido ---------- */

type Cores = { fundo: string; principal: string; apoio: string; escuro: string }

/** Um item ainda sem lugar: o estado dá a página, a posição e o id. */
export type Esboco = Pick<ItemProjeto, "tipo" | "nome" | "l" | "a" | "previa" | "texto" | "estiloTexto">

export type Leitura = { esbocos: Esboco[]; resposta: (pagina: string, marca: string) => string }

export type OpcoesPedido = {
  /** Tipo escolhido na barra de ferramentas; sem ele, o tipo sai das palavras do pedido. */
  tipo?: TipoItemProjeto
  /** Proporção (largura, altura), quando a pessoa escolheu o formato. */
  formato?: [number, number]
  /** Opções da barra de geração (resolução, estilo, referência…); ficam guardadas no item. */
  geracao?: GeracaoItem
  /** Ponto do canvas onde a pessoa clicou. */
  ponto?: { x: number; y: number }
  /** Item que a pessoa quer ajustar: a nova versão nasce ao lado dele. */
  sobre?: ItemProjeto
}

const NUMEROS: Record<string, number> = { um: 1, uma: 1, dois: 2, duas: 2, três: 3, tres: 3, quatro: 4, cinco: 5, seis: 6 }

function quantidade(texto: string) {
  const digito = texto.match(/\b([1-6])\b/)
  if (digito) return Number(digito[1])
  const palavra = texto.toLowerCase().match(/\b(dois|duas|três|tres|quatro|cinco|seis)\b/)
  if (palavra) return NUMEROS[palavra[1]]
  return /\b(posts|fotos|imagens|stories|op[çc][õo]es|varia[çc][õo]es|ilustra[çc][õo]es|pe[çc]as)\b/i.test(texto) ? 3 : 1
}

function tipoDoPedido(texto: string): TipoItemProjeto {
  if (/v[ií]deo|reels/i.test(texto)) return "video"
  if (/post|story|stories|carrossel|banner|pe[çc]a|an[úu]ncio|cartaz|r[óo]tulo|capa/i.test(texto)) return "peca"
  if (/legenda|texto|copy|frase|t[ií]tulo|roteiro|e-?mail|descri[çc][ãa]o/i.test(texto)) return "texto"
  return "imagem"
}

/** Nome curto a partir do pedido: tira o "quero", o artigo e o número do começo. */
export function nomeDoPedido(texto: string) {
  const limpo = texto
    .trim()
    .replace(/^(por favor,?\s*)?(agora\s+)?(eu\s+)?(quero|queria|cria|crie|criar|faz|fa[çc]a|fazer|gera|gere|me mostra|mostra|preciso de|monta|monte|escreve|escreva)\s+/i, "")
    .replace(/^(um|uma|uns|umas|o|a|os|as|\d+|dois|duas|tr[êe]s|quatro|cinco|seis)\s+/i, "")
    .replace(/[.!?…]+$/, "")
  const curto = limpo.length > 46 ? `${limpo.slice(0, 44).trimEnd()}…` : limpo
  return curto ? curto.charAt(0).toUpperCase() + curto.slice(1) : "Sem nome"
}

const LAYOUTS: LayoutPeca[] = ["foto-cheia", "tipografico", "gradiente", "dividido", "ilustracao", "citacao"]
const DESENHOS: DesenhoIlustracao[] = ["pequi", "frasco", "baru", "buriti", "paisagem"]
const BORDAS = ["bottom", "left", "top", "right"] as const

const LEGENDAS = [
  "Do cerrado para a sua rotina: óleo de pequi do lote 12, colhido pela cooperativa de Pirenópolis e prensado a frio.",
  "Você sabe de onde vem cada gota. Lote 12, cooperativa de Pirenópolis, feito em pequenos lotes, com calma.",
  "Cuidado que cabe no seu dia: três gotas, um minuto e a pele macia até a noite.",
]

let rodada = 0

function proporcaoDaPeca(texto: string, formato?: [number, number]) {
  if (formato) return formato[0] / formato[1]
  if (/story|stories|reels/i.test(texto)) return 9 / 16
  if (/banner|capa/i.test(texto)) return 16 / 9
  if (/carrossel|quadrad/i.test(texto)) return 1
  if (/cartaz|r[óo]tulo/i.test(texto)) return 3 / 4
  return 4 / 5
}

function formatoDe(proporcao: number): [number, number] {
  if (Math.abs(proporcao - 9 / 16) < 0.01) return [9, 16]
  if (Math.abs(proporcao - 16 / 9) < 0.01) return [16, 9]
  if (Math.abs(proporcao - 1) < 0.01) return [1, 1]
  if (Math.abs(proporcao - 3 / 4) < 0.01) return [3, 4]
  return [4, 5]
}

/** Lê o pedido e devolve o que o Hattie vai criar e o que ele responde. */
export function lerPedido(texto: string, cores: Cores, opcoes: OpcoesPedido = {}): Leitura {
  const tipo = opcoes.tipo ?? (opcoes.sobre && opcoes.sobre.tipo !== "forma" ? opcoes.sobre.tipo : tipoDoPedido(texto))
  const total = opcoes.sobre ? 1 : tipo === "video" || tipo === "texto" ? 1 : quantidade(texto)
  const base = opcoes.sobre ? opcoes.sobre.nome.replace(/ · v\d+$/, "") : nomeDoPedido(texto)
  const nome = (indice: number) => (opcoes.sobre ? `${base} · v2` : total > 1 ? `${base} · ${indice + 1}` : base)
  const esbocos: Esboco[] = []

  for (let indice = 0; indice < total; indice++) {
    rodada += 1
    if (tipo === "imagem") {
      const ilustracao = /ilustra|desenh/i.test(`${texto} ${opcoes.geracao?.estilo ?? ""}`) || opcoes.sobre?.previa?.tipo === "ilustracao"
      const combinacoes: [string, string][] = [
        [cores.fundo, cores.apoio],
        [cores.apoio, cores.fundo],
        [cores.principal, cores.apoio],
        [cores.fundo, cores.escuro],
      ]
      const [fundo, tinta] = combinacoes[rodada % combinacoes.length]
      // Nova versão de um item: parte do mesmo desenho, para parecer a mesma ideia com uma mudança.
      const original = opcoes.sobre?.previa
      const previa: PreviaArquivo =
        original?.tipo === "ilustracao" || original?.tipo === "personagem" || original?.tipo === "grafismo" || original?.tipo === "logo"
          ? original
          : original?.tipo === "foto"
            ? { ...original, borda: BORDAS[(BORDAS.indexOf(original.borda ?? "bottom") + 1) % BORDAS.length] }
            : ilustracao
              ? { tipo: "ilustracao", desenho: DESENHOS[rodada % DESENHOS.length] }
              : { tipo: "foto", fundo, tinta, borda: BORDAS[rodada % BORDAS.length] }
      const proporcao = opcoes.sobre ? opcoes.sobre.l / opcoes.sobre.a : opcoes.formato ? opcoes.formato[0] / opcoes.formato[1] : ilustracao ? 1 : 4 / 5
      esbocos.push({ tipo, nome: nome(indice), a: 360, l: Math.round(360 * proporcao), previa })
    } else if (tipo === "video") {
      const proporcao = opcoes.sobre ? opcoes.sobre.l / opcoes.sobre.a : opcoes.formato ? opcoes.formato[0] / opcoes.formato[1] : 9 / 16
      const altura = proporcao > 1 ? 300 : 480
      const duracao = opcoes.geracao?.duracao ? `0:${opcoes.geracao.duracao.replace(/\D/g, "").padStart(2, "0")}` : "0:15"
      esbocos.push({ tipo, nome: nome(indice), a: altura, l: Math.round(altura * proporcao), previa: { tipo: "video", fundo: cores.apoio, tinta: cores.escuro, duracao } })
    } else if (tipo === "peca") {
      const proporcao = opcoes.sobre ? opcoes.sobre.l / opcoes.sobre.a : proporcaoDaPeca(texto, opcoes.formato)
      const layout = LAYOUTS[rodada % LAYOUTS.length]
      esbocos.push({
        tipo,
        nome: nome(indice),
        a: 420,
        l: Math.round(420 * proporcao),
        previa: { tipo: "peca", exemplo: peca(`proj-${rodada}`, nome(indice), layout), proporcao: formatoDe(proporcao) },
      })
    } else {
      const conteudo = LEGENDAS[rodada % LEGENDAS.length]
      esbocos.push({ tipo: "texto", nome: nome(indice), l: 340, a: 120, texto: conteudo, estiloTexto: "corpo" })
    }
  }

  const comLegenda = tipo === "peca" && !opcoes.sobre && /legenda/i.test(texto)
  if (comLegenda) {
    rodada += 1
    esbocos.push({ tipo: "texto", nome: "Legenda", l: 340, a: 120, texto: LEGENDAS[rodada % LEGENDAS.length], estiloTexto: "corpo" })
  }

  const resposta = (pagina: string, marca: string) => {
    if (opcoes.sobre) return `Fiz uma nova versão de ${opcoes.sobre.nome} e deixei ao lado da original, para você comparar.`
    if (tipo === "video") return `Fiz um vídeo de ${opcoes.geracao?.duracao ?? "15 s"}, em ${pagina}.`
    if (tipo === "texto") return `Escrevi no tom de voz da ${marca}. Está em ${pagina}; clique duas vezes no texto para editar.`
    if (tipo === "peca")
      return `Criei ${total === 1 ? "a peça" : `${total} peças`} em ${pagina}, com as fontes e as cores da ${marca}.${comLegenda ? " A legenda está ao lado." : ""}`
    return total === 1
      ? `Fiz a imagem em ${pagina}, no estilo da ${marca}.`
      : `Fiz ${total} imagens em ${pagina}, com a luz e as cores da ${marca}. Escolha a que mais gostar e eu refino.`
  }

  return { esbocos, resposta }
}
