import { DATAS_COMEMORATIVAS, IMAGENS_POST, TEMAS_POR_OBJETIVO, type CanalPost, type FormatoNumero, type PostCalendario } from "@/lib/mock"

/*
 * Apoio da área de Marketing: datas, números em português e o "Hattie" do protótipo
 * (monta um calendário a partir do pedido e sugere atualizações). As regras são simples de propósito:
 * a forma de pedir e de aprovar é o que importa nesta versão.
 */

export const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]
export const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]
export const DIAS_SEMANA_LONGOS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]

/** Data local (meio-dia, para não escorregar de dia com o fuso). */
export const dataDe = (iso: string) => new Date(`${iso}T12:00:00`)
export const isoDe = (data: Date) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`
export const somarDias = (iso: string, dias: number) => {
  const data = dataDe(iso)
  data.setDate(data.getDate() + dias)
  return isoDe(data)
}
export const diasEntre = (de: string, ate: string) => Math.round((dataDe(ate).getTime() - dataDe(de).getTime()) / 86_400_000)

/** "qui, 13 nov" */
export function dataCurta(iso: string) {
  const data = dataDe(iso)
  return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} ${MESES[data.getMonth()].slice(0, 3)}`
}

/** "quinta, 13 de novembro" */
export function dataLonga(iso: string) {
  const data = dataDe(iso)
  return `${DIAS_SEMANA_LONGOS[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`
}

/** "hoje", "ontem", "há 3 dias" */
export function haDias(iso: string, hoje: string) {
  const dias = diasEntre(iso, hoje)
  if (dias <= 0) return "hoje"
  if (dias === 1) return "ontem"
  return `há ${dias} dias`
}

const NUMERO = new Intl.NumberFormat("pt-BR")
export function formatar(valor: number, formato: FormatoNumero) {
  if (formato === "porcentagem") return `${valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
  if (formato === "moeda") return `R$ ${NUMERO.format(Math.round(valor))}`
  return valor >= 10_000 ? `${(valor / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : NUMERO.format(valor)
}

/** Semanas (segunda a domingo) que cobrem o mês, para a grade do calendário. */
export function semanasDoMes(ano: number, mes: number): string[][] {
  const primeiro = new Date(ano, mes, 1, 12)
  const inicio = new Date(primeiro)
  inicio.setDate(1 - ((primeiro.getDay() + 6) % 7))
  const semanas: string[][] = []
  const cursor = new Date(inicio)
  while (semanas.length < 6) {
    const semana: string[] = []
    for (let dia = 0; dia < 7; dia++) {
      semana.push(isoDe(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    semanas.push(semana)
    if (cursor.getMonth() !== mes && semanas.length >= 4) break
  }
  return semanas
}

export const comemoracaoDe = (iso: string) => DATAS_COMEMORATIVAS.find((data) => data.data === iso)

/* ---------- O Hattie monta o calendário ---------- */

export type PedidoCalendario = {
  inicio: string
  fim: string
  objetivo: keyof typeof TEMAS_POR_OBJETIVO
  canais: CanalPost[]
  porSemana: number
  comemorativas: boolean
  observacao: string
}

/** Dias da semana em que a marca posta melhor, na ordem de preferência (0 = domingo). */
const DIAS_BONS = [4, 2, 6, 1, 3, 5, 0]
const HORA_DO_DIA: Record<number, string> = { 0: "10:00", 1: "19:00", 2: "19:00", 3: "19:00", 4: "19:00", 5: "19:00", 6: "10:00" }

let sequencia = 0
const novoId = () => `pc-novo-${Date.now().toString(36)}-${++sequencia}`

/**
 * Monta as ideias de post do período: escolhe os melhores dias de cada semana, alterna os canais pedidos,
 * usa os temas do objetivo e inclui as datas comemorativas. Não mexe nos dias que já têm post.
 */
export function montarCalendario(pedido: PedidoCalendario, existentes: PostCalendario[]): PostCalendario[] {
  const temas = TEMAS_POR_OBJETIVO[pedido.objetivo] ?? TEMAS_POR_OBJETIVO.natal
  const ocupados = new Set(existentes.map((post) => post.data))
  const usados = new Set(existentes.map((post) => post.titulo))
  const ideias: PostCalendario[] = []
  let indice = 0
  const canal = () => pedido.canais[indice % Math.max(pedido.canais.length, 1)] ?? "feed"

  // Datas comemorativas primeiro, para não ficarem de fora.
  if (pedido.comemorativas)
    for (const data of DATAS_COMEMORATIVAS.filter((item) => item.data >= pedido.inicio && item.data <= pedido.fim && !ocupados.has(item.data))) {
      ideias.push({
        id: novoId(),
        data: data.data,
        hora: "10:00",
        canal: pedido.canais.includes("story") ? "story" : canal(),
        titulo: `${data.nome} na Raiz Natural`,
        legenda: `Uma mensagem de ${data.nome.toLowerCase()} com a calma da marca, sem pressa e sem contagem regressiva.`,
        status: "ideia",
        mensagem: "Origem",
        imagem: IMAGENS_POST[indice % IMAGENS_POST.length],
        origem: "hattie",
        nova: true,
      })
      ocupados.add(data.data)
      indice++
    }

  // Depois, semana a semana, nos melhores dias livres.
  let semana = pedido.inicio
  while (semana <= pedido.fim) {
    const dias = Array.from({ length: 7 }, (_, deslocamento) => somarDias(semana, deslocamento)).filter((dia) => dia >= pedido.inicio && dia <= pedido.fim)
    const escolhidos = [...dias].sort((a, b) => DIAS_BONS.indexOf(dataDe(a).getDay()) - DIAS_BONS.indexOf(dataDe(b).getDay())).filter((dia) => !ocupados.has(dia)).slice(0, pedido.porSemana)
    for (const dia of escolhidos.sort()) {
      // Tema ainda não usado no calendário; só repete quando todos já foram.
      const livres = temas.filter((item) => !usados.has(item.titulo))
      const tema = livres[0] ?? temas[indice % temas.length]
      usados.add(tema.titulo)
      ideias.push({
        id: novoId(),
        data: dia,
        hora: HORA_DO_DIA[dataDe(dia).getDay()],
        canal: canal(),
        titulo: tema.titulo,
        legenda: tema.legenda,
        status: "ideia",
        mensagem: tema.mensagem,
        imagem: canal() === "email" || canal() === "whatsapp" ? undefined : IMAGENS_POST[indice % IMAGENS_POST.length],
        origem: "hattie",
        nova: true,
      })
      ocupados.add(dia)
      indice++
    }
    semana = somarDias(semana, 7)
  }
  return ideias.sort((a, b) => a.data.localeCompare(b.data))
}

/* ---------- O Hattie sugere atualizações ---------- */

export type Mudanca = { id: string; post: string; titulo: string; antes: string; depois: string; porque: string; aplicar: (post: PostCalendario) => PostCalendario }

/** Sugestões a partir dos números da semana e das novidades dos concorrentes. Só mexe no que ainda não foi publicado. */
export function sugerirMudancas(posts: PostCalendario[], hoje: string): Mudanca[] {
  const futuros = posts.filter((post) => post.data > hoje && post.status !== "publicado")
  const mudancas: Mudanca[] = []
  const story = futuros.find((post) => post.canal === "story" && post.hora === "10:00" && dataDe(post.data).getDay() !== 6)
  if (story)
    mudancas.push({
      id: `m-hora-${story.id}`,
      post: story.id,
      titulo: story.titulo,
      antes: `${dataCurta(story.data)}, ${story.hora.replace(":00", "h")}`,
      depois: `${dataCurta(story.data)}, 19h`,
      porque: "Os stories das 19h tiveram o dobro de respostas nas últimas 4 semanas.",
      aplicar: (post) => ({ ...post, hora: "19:00", mudou: "Mudei para as 19h: é quando a cliente mais responde." }),
    })
  const reels = futuros.find((post) => post.canal === "reels")
  if (reels)
    mudancas.push({
      id: `m-tema-${reels.id}`,
      post: reels.id,
      titulo: reels.titulo,
      antes: reels.titulo,
      depois: "Bastidores do lote 13",
      porque: "A Botica do Cerrado passou a postar bastidor e subiu o engajamento. O seu bastidor do lote 12 foi o story com mais respostas.",
      aplicar: (post) => ({ ...post, titulo: "Bastidores do lote 13", legenda: "Do frasco vazio ao lote pronto, em 20 segundos.", mudou: "Troquei o tema para bastidor, que está rendendo mais." }),
    })
  const ideiaWhats = futuros.find((post) => post.canal === "whatsapp" && post.status === "ideia")
  if (ideiaWhats)
    mudancas.push({
      id: `m-dia-${ideiaWhats.id}`,
      post: ideiaWhats.id,
      titulo: ideiaWhats.titulo,
      antes: dataCurta(ideiaWhats.data),
      depois: dataCurta(somarDias(ideiaWhats.data, -2)),
      porque: "A Botica lançou o kit dela esta semana. Avisar a sua lista antes do fim de semana chega primeiro.",
      aplicar: (post) => ({ ...post, data: somarDias(post.data, -2), mudou: "Adiantei dois dias, antes do fim de semana." }),
    })
  return mudancas
}
