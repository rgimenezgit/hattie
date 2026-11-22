import type { Marca, OpcaoPaleta, Pessoa } from "./tipos"

/** Três paletas para a Raiz Natural escolher depois da conversa. A primeira é a aposta do Hattie. */
const PALETAS_RAIZ: OpcaoPaleta[] = [
  {
    id: "mata-argila",
    nome: "Mata e argila",
    ideia: "O verde da mata com a terra quente do cerrado.",
    cores: [
      { nome: "verde-mata", hex: "#2F4A3A", papel: "Cor principal" },
      { nome: "argila", hex: "#C9A27E", papel: "Apoio quente" },
      { nome: "creme", hex: "#F2EBDD", papel: "Fundo" },
      { nome: "cacau", hex: "#5C3B28", papel: "Texto e detalhes" },
    ],
    porque: ["O verde passa confiança e natureza", "A argila lembra a terra de onde vêm os ingredientes", "Contraste bom para rótulo pequeno"],
    aposta: true,
  },
  {
    id: "terra-pequi",
    nome: "Terra e pequi",
    ideia: "A terra vermelha e o amarelo do pequi, mais quente e solar.",
    cores: [
      { nome: "terracota", hex: "#9A4A2C", papel: "Cor principal" },
      { nome: "pequi", hex: "#D9A441", papel: "Apoio quente" },
      { nome: "areia", hex: "#F3E6D0", papel: "Fundo" },
      { nome: "café", hex: "#3E2A1E", papel: "Texto e detalhes" },
    ],
    porque: ["Puxa o ingrediente que mais vende", "Se destaca no feed entre marcas verdes", "Combina com papel kraft"],
  },
  {
    id: "buriti-salvia",
    nome: "Buriti e sálvia",
    ideia: "Verdes suaves e um fundo de linho, mais calmo e leve.",
    cores: [
      { nome: "buriti", hex: "#4F6B3A", papel: "Cor principal" },
      { nome: "sálvia", hex: "#A8B89A", papel: "Apoio" },
      { nome: "linho", hex: "#F4F1E8", papel: "Fundo" },
      { nome: "musgo", hex: "#2B3328", papel: "Texto e detalhes" },
    ],
    porque: ["Leve e acolhedora, perto do Cuidador", "Fica bem em foto com luz de janela", "Pede o produto em destaque para não sumir"],
  },
]

export const PESSOA: Pessoa = {
  nome: "Bia",
  sobrenome: "Andrade",
  email: "bia@raiznatural.com.br",
  plano: { nome: "intermediário", creditos: 120, limite: 200 },
}

export const MARCAS: Marca[] = [
  {
    slug: "raiz-natural",
    nome: "Raiz Natural",
    segmento: "Cosméticos naturais",
    cidade: "Ribeirão Preto, SP",
    paleta: PALETAS_RAIZ[0].cores,
    opcoesPaleta: PALETAS_RAIZ,
    fontes: { display: "Fraunces", texto: "Inter" },
  },
  {
    slug: "doce-atelie",
    nome: "Doce Ateliê",
    segmento: "Confeitaria artesanal",
    cidade: "Londrina, PR",
    paleta: [
      { nome: "framboesa", hex: "#B23A5B", papel: "Cor principal" },
      { nome: "baunilha", hex: "#F6E7C8", papel: "Fundo" },
      { nome: "chocolate", hex: "#3B2418", papel: "Texto" },
    ],
    fontes: { display: "a definir", texto: "a definir" },
  },
]
