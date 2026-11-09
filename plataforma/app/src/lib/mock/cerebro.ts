import type { GrupoCerebro, Secao, StatusSecao } from "./tipos"

export const GRUPOS_CEREBRO: GrupoCerebro[] = [
  { id: "estrategia", titulo: "Estratégia" },
  { id: "verbal", titulo: "Verbal" },
  { id: "personalidade", titulo: "Personalidade" },
  { id: "visual", titulo: "Visual" },
]

const PALETA = [
  { nome: "verde-mata", hex: "#2F4A3A", papel: "Cor principal" },
  { nome: "argila", hex: "#C9A27E", papel: "Apoio quente" },
  { nome: "creme", hex: "#F2EBDD", papel: "Fundo" },
  { nome: "cacau", hex: "#5C3B28", papel: "Texto e detalhes" },
]

export const SECOES: Secao[] = [
  {
    id: "briefing",
    titulo: "Briefing de marca",
    grupo: "estrategia",
    resumo: "Raiz Natural faz cosméticos naturais em pequenos lotes, em Ribeirão Preto, com ingredientes de cooperativas do cerrado, para mulheres que leem o rótulo antes de comprar.",
    porque: "Juntei sua ideia, as respostas da conversa e o catálogo que você mandou. Esse resumo é a base de todas as outras decisões.",
    conteudo: {
      tipo: "texto",
      texto: "Raiz Natural faz cosméticos naturais em pequenos lotes, em Ribeirão Preto, com ingredientes de cooperativas do cerrado, para mulheres que leem o rótulo antes de comprar. Hoje vende pelo Instagram, pelo WhatsApp e em feiras, e quer chegar a três lojas da região e a clientes de fora de São Paulo no próximo ano.",
    },
  },
  {
    id: "proposito",
    titulo: "Propósito",
    grupo: "estrategia",
    resumo: "Levar o cuidado do cerrado para a rotina de quem lê o rótulo.",
    porque: "Suas clientes compram pela origem. O propósito coloca essa origem no centro de tudo que a marca fala.",
    conteudo: { tipo: "texto", texto: "Levar o cuidado do cerrado para a rotina de quem lê o rótulo." },
  },
  {
    id: "posicionamento",
    titulo: "Posicionamento",
    grupo: "estrategia",
    resumo: "Cosmético natural em pequenos lotes, rastreável do ingrediente ao frasco.",
    porque: "As marcas de farmácia falam de natureza de um jeito amplo. Pequenos lotes com fornecedor nomeado são uma prova concreta, e nenhum concorrente da região usa isso.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Para quem", texto: "Mulheres de 25 a 40 anos que leem o rótulo antes de comprar." },
        { titulo: "O que entrega", texto: "Cuidado diário com ingredientes do cerrado, rastreáveis lote a lote." },
        { titulo: "Por que acreditar", texto: "Produção própria em Ribeirão Preto, com cooperativas nomeadas." },
      ],
    },
  },
  {
    id: "publico",
    titulo: "Público e personas",
    grupo: "estrategia",
    resumo: "Carla, 31, enfermeira, repõe o hidratante todo mês e compra presentes no fim do ano.",
    porque: "Você contou que a maioria das vendas é recompra. A persona fala com quem já confia e indica.",
    conteudo: {
      tipo: "persona",
      nome: "Carla",
      idade: 31,
      descricao: "Enfermeira, mora em Ribeirão Preto, cuida da pele com calma depois de plantões longos.",
      habitos: ["Lê o rótulo inteiro", "Compra pelo WhatsApp", "Presenteia as amigas"],
    },
  },
  {
    id: "mercado",
    titulo: "Mercado e concorrentes",
    grupo: "estrategia",
    resumo: "Marcas de farmácia com linha natural e três ateliês da região disputam a mesma cliente.",
    porque: "Olhei preço, embalagem e comunicação de seis concorrentes. O espaço livre está na rastreabilidade.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Marcas de farmácia", texto: "Preço menor, comunicação genérica sobre natureza." },
        { titulo: "Ateliês da região", texto: "Produto artesanal, visual pouco consistente." },
        { titulo: "Oportunidade", texto: "Mostrar a origem de cada ingrediente com nome e lugar." },
      ],
    },
  },
  {
    id: "diferencial",
    titulo: "Diferencial",
    grupo: "estrategia",
    resumo: "Cada frasco diz de qual lote e de qual cooperativa veio.",
    porque: "É o que a cliente valoriza e o que os concorrentes não conseguem copiar rápido.",
    conteudo: { tipo: "texto", texto: "Cada frasco diz de qual lote e de qual cooperativa veio." },
  },
  {
    id: "objetivos",
    titulo: "Objetivos",
    grupo: "estrategia",
    resumo: "Três lojas parceiras na região e 30% das vendas fora de São Paulo em um ano.",
    porque: "Transformei o que você quer em metas que dá pra acompanhar mês a mês.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Lojas", texto: "Três lojas parceiras na região de Ribeirão Preto." },
        { titulo: "Alcance", texto: "30% das vendas para fora de São Paulo." },
      ],
    },
  },
  {
    id: "nome",
    titulo: "Nome",
    grupo: "verbal",
    resumo: "Raiz Natural",
    porque: "O nome junta origem e cuidado em duas palavras simples de dizer numa indicação.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Raiz Natural", texto: "Origem e cuidado, direto ao ponto." },
        { titulo: "Cerrado Pele", texto: "Puxa a região e os ingredientes." },
        { titulo: "Lote Bom", texto: "Destaca a produção em pequenos lotes." },
      ],
    },
  },
  {
    id: "tagline",
    titulo: "Tagline",
    grupo: "verbal",
    resumo: "Cuidado que vem da raiz.",
    porque: "Curta, conversa com o nome e promete o que o produto entrega.",
    conteudo: { tipo: "texto", texto: "Cuidado que vem da raiz." },
  },
  {
    id: "tom-de-voz",
    titulo: "Tom de voz",
    grupo: "verbal",
    resumo: "Próxima, clara e calma. Explica o ingrediente antes do benefício.",
    porque: "Sua cliente lê o rótulo inteiro. Um tom calmo e claro mostra respeito por esse cuidado.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Assim", texto: "Esse óleo de pequi vem de uma cooperativa em Goiás. Ele hidrata sem pesar." },
        { titulo: "Evite", texto: "Frases de urgência, promessas milagrosas e excesso de exclamações." },
      ],
    },
  },
  {
    id: "mensagens",
    titulo: "Mensagens-chave",
    grupo: "verbal",
    resumo: "Origem rastreável, pequenos lotes, cuidado diário.",
    porque: "Três ideias que se repetem em todo post e rótulo deixam a marca reconhecível.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Origem", texto: "Você sabe de onde vem cada gota." },
        { titulo: "Lote", texto: "Feito em pequenos lotes, com calma." },
        { titulo: "Rotina", texto: "Cuidado que cabe no seu dia." },
      ],
    },
  },
  {
    id: "palavras-chave",
    titulo: "Palavras-chave",
    grupo: "verbal",
    resumo: "Cuidadosa, honesta, acolhedora, natural, artesanal.",
    porque: "Essas palavras aparecem nas avaliações das suas clientes e combinam com o seu jeito de falar.",
    conteudo: { tipo: "palavras", palavras: ["Cuidadosa", "Honesta", "Acolhedora", "Natural", "Artesanal"] },
  },
  {
    id: "vocabulario",
    titulo: "Vocabulário",
    grupo: "verbal",
    resumo: "Usa lote, origem, cerrado e cuidado. Troca milagre e instantâneo por rotina e constância.",
    porque: "As palavras certas reforçam a confiança que você quer passar.",
    conteudo: {
      tipo: "blocos",
      blocos: [
        { titulo: "Usa", texto: "lote, origem, cerrado, cuidado, rotina" },
        { titulo: "Troca", texto: "milagre por constância, instantâneo por diário" },
      ],
    },
  },
  {
    id: "arquetipo",
    titulo: "Arquétipo",
    grupo: "personalidade",
    resumo: "Cuidador, com um toque de Explorador.",
    porque: "O Cuidador protege e acolhe; o Explorador traz o cerrado e a origem para perto.",
    conteudo: { tipo: "texto", texto: "Cuidador, com um toque de Explorador." },
  },
  {
    id: "atributos",
    titulo: "Atributos",
    grupo: "personalidade",
    resumo: "Cuidadosa, honesta e acolhedora.",
    porque: "Escolhi três palavras concretas para guiar cada decisão de texto e visual.",
    conteudo: { tipo: "palavras", palavras: ["Cuidadosa", "Honesta", "Acolhedora"] },
  },
  {
    id: "comportamento",
    titulo: "Como a marca age",
    grupo: "personalidade",
    resumo: "Explica sem pressa, mostra a origem e responde cada cliente pelo nome.",
    porque: "O jeito de agir precisa bater com o que a marca promete.",
    conteudo: { tipo: "texto", texto: "Explica sem pressa, mostra a origem e responde cada cliente pelo nome." },
  },
  {
    id: "logo",
    titulo: "Logo",
    grupo: "visual",
    resumo: "Palavra com serifa suave e uma folha no pingo do i.",
    porque: "A serifa suave traz o artesanal, e a folha conversa com os ingredientes do cerrado.",
    conteudo: {
      tipo: "logo",
      descricao: "Palavra com serifa suave e uma folha no pingo do i.",
      opcoes: ["Palavra com serifa", "Monograma com folha", "Selo de lote"],
    },
    extra: { rotulo: "Baixar logos", icone: "download" },
  },
  {
    id: "cores",
    titulo: "Cores",
    grupo: "visual",
    resumo: "Verde-mata, argila, creme e cacau.",
    porque: "O verde-mata passa confiança e natureza, e a argila aquece o conjunto e lembra a terra de onde vêm os ingredientes.",
    conteudo: { tipo: "cores", cores: PALETA },
    extra: { rotulo: "Copiar cores", icone: "copiar" },
  },
  {
    id: "tipografia",
    titulo: "Tipografia",
    grupo: "visual",
    resumo: "Fraunces nos títulos e Inter no texto.",
    porque: "A Fraunces tem curvas de quem faz à mão, e a Inter deixa o rótulo legível até em letra pequena.",
    conteudo: { tipo: "tipografia", display: "Fraunces", texto: "Inter", amostra: "Cuidado que vem da raiz." },
    extra: { rotulo: "Baixar fontes", icone: "download" },
  },
  {
    id: "grafismos",
    titulo: "Grafismos",
    grupo: "visual",
    resumo: "Linhas de folhas desenhadas à mão e carimbo de lote.",
    porque: "As linhas à mão conversam com a produção artesanal e ficam bem nas etiquetas.",
    conteudo: { tipo: "imagens", descricao: "Linhas de folhas desenhadas à mão e carimbo de lote.", legendas: ["Linhas de folha", "Carimbo de lote"] },
  },
  {
    id: "gradiente",
    titulo: "Gradiente",
    grupo: "visual",
    resumo: "Do creme à argila, suave, só em fundos de post.",
    porque: "Um gradiente discreto dá profundidade às fotos sem competir com o rótulo.",
    conteudo: { tipo: "imagens", descricao: "Do creme à argila, suave, só em fundos de post.", legendas: ["Creme para argila"] },
  },
  {
    id: "icones",
    titulo: "Ícones",
    grupo: "visual",
    resumo: "Traço fino e arredondado, inspirado na folha do logo.",
    porque: "Ícones de traço fino combinam com a serifa suave e ficam elegantes nas embalagens.",
    conteudo: { tipo: "imagens", descricao: "Traço fino e arredondado, inspirado na folha do logo.", legendas: ["Folha", "Gota", "Lote"] },
  },
  {
    id: "fotografia",
    titulo: "Estilo fotográfico",
    grupo: "visual",
    resumo: "Luz natural da manhã, mãos reais e ingredientes ao lado do produto.",
    porque: "Mostrar o ingrediente ao lado do produto responde a pergunta que sua cliente faz antes de comprar.",
    conteudo: {
      tipo: "imagens",
      descricao: "Luz natural da manhã, mãos reais e ingredientes ao lado do produto, sobre fundo creme.",
      legendas: ["Produto com ingrediente", "Mãos aplicando", "Bancada de produção"],
    },
  },
  {
    id: "ilustracao",
    titulo: "Ilustração",
    grupo: "visual",
    resumo: "Ingredientes desenhados com traço botânico, em verde-mata sobre creme.",
    porque: "O traço botânico ensina de onde vem cada ingrediente de um jeito bonito.",
    conteudo: { tipo: "imagens", descricao: "Ingredientes desenhados com traço botânico, em verde-mata sobre creme.", legendas: ["Pequi", "Baru", "Buriti"] },
  },
  {
    id: "aplicacoes",
    titulo: "Aplicações",
    grupo: "visual",
    resumo: "Rótulo, etiqueta de lote, sacola e post de lançamento.",
    porque: "Ver a marca aplicada ajuda a decidir antes de imprimir qualquer coisa.",
    conteudo: { tipo: "imagens", descricao: "Rótulo, etiqueta de lote, sacola e post de lançamento.", legendas: ["Rótulo", "Etiqueta de lote", "Sacola"] },
  },
  {
    id: "movimento",
    titulo: "Movimento",
    grupo: "visual",
    resumo: "Transições lentas, como uma gota escorrendo.",
    porque: "O ritmo calmo combina com a personalidade cuidadosa da marca.",
    conteudo: { tipo: "texto", texto: "Transições lentas, como uma gota escorrendo. Nada pisca nem pula." },
  },
]

export const VISAO_GERAL = ["briefing", "proposito", "logo", "tipografia", "cores", "palavras-chave", "publico", "fotografia", "ilustracao"]

export const STATUS_INICIAL: Record<string, StatusSecao> = Object.fromEntries(
  SECOES.map((secao) => [secao.id, ["posicionamento", "publico", "cores"].includes(secao.id) ? "aprovada" : "pendente"]),
)

export function getSecao(id: string) {
  return SECOES.find((secao) => secao.id === id)
}
