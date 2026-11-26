import type { TracoPersonalidade } from "./tipos"

/**
 * Opções da primeira escolha de estratégia, depois da conversa.
 * Personalidade: dez palavras; as cinco marcadas como sugeridas são as que o Hattie escolheria, misturadas às outras
 * para a pessoa ler todas antes de decidir.
 * Diferenciais: vêm dos diferenciais do cérebro (todas as frentes); os sugeridos estão em DIFERENCIAIS_SUGERIDOS.
 */
export type OpcaoPalavra = TracoPersonalidade & { sugerida?: boolean }

export const PALAVRAS_PERSONALIDADE: OpcaoPalavra[] = [
  {
    id: "calma",
    palavra: "Calma",
    explicacao: "Sem pressa e sem urgência de venda. A marca dá tempo para a cliente ler, provar e decidir.",
    naPratica: "Nada de contagem regressiva ou \"últimas unidades\" inventado.",
    sugerida: true,
  },
  {
    id: "artesanal",
    palavra: "Artesanal",
    explicacao: "Feita à mão, em lote pequeno, com a marca de quem fez.",
    naPratica: "Número do lote escrito à mão e bastidores da bancada.",
  },
  {
    id: "acolhedora",
    palavra: "Acolhedora",
    explicacao: "Recebe cada cliente como alguém conhecido, pelo nome, e escuta antes de indicar.",
    naPratica: "Pergunta como está a pele antes de sugerir um produto.",
    sugerida: true,
  },
  {
    id: "confiavel",
    palavra: "Confiável",
    explicacao: "Cumpre o que promete e mostra as provas antes de pedir confiança.",
    naPratica: "Laudo, cooperativa e data de colheita sempre à vista.",
  },
  {
    id: "honesta",
    palavra: "Honesta",
    explicacao: "Diz o que o produto faz e mostra de onde ele vem, sem promessa de milagre.",
    naPratica: "Resultado real, com tempo de uso, e lista completa de ingredientes.",
    sugerida: true,
  },
  {
    id: "leve",
    palavra: "Leve",
    explicacao: "Bem-humorada na medida, sem peso e sem drama.",
    naPratica: "Uma piada curta de vez em quando, nunca sobre a pele de alguém.",
  },
  {
    id: "curiosa",
    palavra: "Curiosa",
    explicacao: "Gosta de descobrir e dividir o que o cerrado tem de novo, com entusiasmo na medida.",
    naPratica: "Um ingrediente por vez, com a história de quem colhe.",
    sugerida: true,
  },
  {
    id: "engajada",
    palavra: "Engajada",
    explicacao: "Toma partido pelo cerrado e por quem colhe.",
    naPratica: "Conta quanto de cada compra fica com as cooperativas.",
  },
  {
    id: "simples",
    palavra: "Simples",
    explicacao: "Despojada, sem luxo de vitrine. O cuidado está no detalhe, e o visual respira.",
    naPratica: "Rótulo limpo, papel kraft e frases curtas.",
    sugerida: true,
  },
  {
    id: "sensorial",
    palavra: "Sensorial",
    explicacao: "Fala de cheiro, textura e toque antes de falar de fórmula.",
    naPratica: "Vídeos curtos do produto na pele e descrições do aroma.",
  },
]

export const DIFERENCIAIS_SUGERIDOS = ["Origem rastreável por lote", "Fórmulas curtas", "Renda para quem colhe", "Atendimento de perto"]

export const LIMITES_ESCOLHA = { personalidade: { min: 3, max: 5 }, diferenciais: { min: 3, max: 4 } }
