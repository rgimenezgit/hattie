import type { Conversa, PassoPlano } from "./tipos"

export const PASSOS_PLANO: PassoPlano[] = [
  {
    id: "negocio",
    titulo: "O negócio",
    tipo: "base",
    pergunta: "Pra começar: o que você vende hoje, e o que mais sai?",
    sugestoes: ["Hidratantes e óleos corporais", "Sabonetes artesanais", "Kits de presente"],
  },
  {
    id: "objetivos",
    titulo: "Objetivos",
    tipo: "base",
    pergunta: "Onde você quer que a marca esteja daqui a um ano?",
    sugestoes: ["Entrar em lojas da região", "Vender para o Brasil todo", "Dobrar as vendas no Instagram"],
  },
  {
    id: "publico",
    titulo: "Público",
    tipo: "base",
    pergunta: "Quem compra mais de você? Me conta da cliente que sempre volta.",
    sugestoes: ["Mulheres de 25 a 40 anos", "Quem compra pra presentear", "Gente que lê o rótulo"],
  },
  {
    id: "mercado",
    titulo: "Mercado e concorrentes",
    tipo: "base",
    pergunta: "Quais marcas sua cliente compra quando não compra de você?",
    sugestoes: ["Marcas de farmácia", "Outros ateliês da cidade", "Marcas grandes de natural"],
  },
  {
    id: "canais",
    titulo: "Localização e canais",
    tipo: "base",
    pergunta: "Onde você vende hoje? Loja, Instagram, WhatsApp, feiras?",
    sugestoes: ["Instagram e WhatsApp", "Feiras e eventos", "Loja física"],
  },
  {
    id: "produto",
    titulo: "Produto e diferencial",
    tipo: "base",
    pergunta: "O que faz o seu produto ser diferente na mão da cliente?",
    sugestoes: ["Ingredientes do cerrado", "Produção em pequenos lotes", "Embalagem reutilizável"],
  },
  {
    id: "personalidade",
    titulo: "Personalidade",
    tipo: "base",
    pergunta: "Se a sua marca fosse uma pessoa numa conversa, como ela seria?",
    sugestoes: ["Calma e acolhedora", "Divertida e próxima", "Elegante e direta"],
  },
  {
    id: "referencias",
    titulo: "Referências",
    tipo: "base",
    pergunta: "Tem marcas, de qualquer área, que você admira pelo jeito de se mostrar? Pode mandar links ou prints.",
    sugestoes: ["Natura Ekos", "Aesop", "Ainda não sei"],
  },
  {
    id: "ingredientes",
    titulo: "Ingredientes e origem",
    tipo: "adicional",
    pergunta: "De onde vêm os seus ingredientes? Essa história pode virar o coração da marca.",
    sugestoes: ["Cooperativas do cerrado", "Produtores da região", "Compro de distribuidor"],
  },
  {
    id: "embalagem",
    titulo: "Embalagem e rótulo",
    tipo: "adicional",
    pergunta: "Como é a embalagem hoje, e o que você gostaria de mudar nela?",
    sugestoes: ["Vidro âmbar com rótulo simples", "Quero algo mais sustentável", "Ainda uso embalagem genérica"],
  },
]

export const RESPOSTAS_EXEMPLO: Record<string, string> = {
  negocio: "Hidratantes e óleos corporais. O óleo de pequi é o que mais sai.",
  objetivos: "Quero entrar em três lojas da região e vender para fora de São Paulo.",
  publico: "Mulheres de 25 a 40 anos que leem o rótulo e compram todo mês.",
  mercado: "Marcas de farmácia com linha natural e dois ateliês aqui da cidade.",
  canais: "Instagram e WhatsApp, e feiras aos fins de semana.",
  produto: "Ingredientes do cerrado e produção em pequenos lotes.",
  personalidade: "Calma e acolhedora, como uma amiga que entende de pele.",
  referencias: "Gosto muito de como a Aesop mostra os produtos.",
  ingredientes: "Compro de duas cooperativas em Goiás.",
  embalagem: "Vidro âmbar com rótulo simples. Quero algo mais bonito e sustentável.",
}

export const RECONHECIMENTOS = ["Anotado.", "Boa, isso ajuda muito.", "Faz sentido.", "Que legal.", "Entendi."]

export const ETAPAS_CRIACAO = [
  "Lendo tudo que você me contou",
  "Pesquisando o mercado de cosméticos naturais",
  "Estudando 6 concorrentes da região",
  "Montando a estratégia da marca",
  "Propondo nome, voz e visual",
]

export const CONVERSAS: Conversa[] = [
  { id: "criacao", titulo: "Marca da Bia", quando: "hoje" },
  { id: "legenda-pequi", titulo: "Legenda do óleo de pequi", quando: "ontem" },
  { id: "black-friday", titulo: "Ideias para a Black Friday", quando: "2 de nov." },
]
