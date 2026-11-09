import type { Marca, Pessoa } from "./tipos"

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
    paleta: [
      { nome: "verde-mata", hex: "#2F4A3A", papel: "Cor principal" },
      { nome: "argila", hex: "#C9A27E", papel: "Apoio quente" },
      { nome: "creme", hex: "#F2EBDD", papel: "Fundo" },
      { nome: "cacau", hex: "#5C3B28", papel: "Texto e detalhes" },
    ],
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
