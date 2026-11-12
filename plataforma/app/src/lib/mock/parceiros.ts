/* Parceiros: profissionais independentes que a pessoa contrata para construir ou cuidar da marca. */

export type EspecialidadeParceiro =
  | "Logo e marca"
  | "Embalagem"
  | "Fotografia"
  | "Ilustração"
  | "Social media"
  | "Site"
  | "Estratégia de marca"
  | "Motion"
  | "Texto e copy"
  | "Naming"

export type ModeloPreco = "hora" | "projeto" | "orcamento"

/** 1 cabe no orçamento, 2 intermediário, 3 premium. */
export type FaixaPreco = 1 | 2 | 3

/** Cor do avatar enquanto não há foto. O lima fica de fora: na plataforma ele marca ação e seleção. */
export type CorParceiro = "lilas" | "azul" | "rosa" | "cinza"

export type TipoTrabalho = "logo" | "foto" | "embalagem" | "post" | "site" | "ilustracao" | "video" | "texto"

export type TrabalhoPortfolio = { id: string; titulo: string; cliente: string; tipo: TipoTrabalho; fundo: string; tinta: string }

export type ServicoParceiro = { nome: string; inclui: string; prazo: string; preco: string }

export type AvaliacaoParceiro = { autor: string; marca: string; nota: number; texto: string; quando: string }

export type Parceiro = {
  id: string
  nome: string
  usuario: string
  cor: CorParceiro
  cidade: string
  pais: string
  idiomas: string[]
  titulo: string
  bio: string
  especialidades: EspecialidadeParceiro[]
  nichos: string[]
  nota: number
  avaliacoes: number
  projetos: number
  anos: number
  resposta: string
  desde: string
  disponivel: boolean
  agenda?: string
  destaque?: boolean
  preco: { modelo: ModeloPreco; valor?: number }
  faixa: FaixaPreco
  capa: [string, string]
  trabalhos: TrabalhoPortfolio[]
  servicos: ServicoParceiro[]
  experiencia: { cargo: string; lugar: string; periodo: string }[]
  depoimentos: AvaliacaoParceiro[]
}

export type EtapaTrabalho = "pedido" | "proposta" | "andamento" | "revisao" | "entregue"

export type TrabalhoParceiro = {
  id: string
  titulo: string
  parceiro: string
  etapa: EtapaTrabalho
  valor?: number
  prazo: string
  progresso?: number
  /** Nome do projeto da marca ao qual o trabalho está ligado. */
  projeto?: string
  /** Tarefa do projeto atribuída ao parceiro. */
  tarefa?: string
}

export type PropostaParceiro = { titulo: string; valor: number; prazo: string; inclui: string[]; status: "aberta" | "aprovada" }

/** anexos: seções do cérebro da marca citadas ou compartilhadas na mensagem (ids de SECOES). */
export type MensagemParceiro = { id: string; autor: "pessoa" | "parceiro" | "hattie"; texto: string; quando: string; proposta?: PropostaParceiro; anexos?: string[] }

/** Uma conversa por trabalho: o id da conversa é o mesmo do trabalho no quadro. */
export type ConversaParceiro = { id: string; parceiro: string; assunto: string; naoLidas: number; mensagens: MensagemParceiro[] }

export const ESPECIALIDADES: EspecialidadeParceiro[] = [
  "Logo e marca",
  "Embalagem",
  "Fotografia",
  "Ilustração",
  "Social media",
  "Site",
  "Estratégia de marca",
  "Motion",
  "Texto e copy",
  "Naming",
]

export const FAIXAS: Record<FaixaPreco, { rotulo: string; texto: string }> = {
  1: { rotulo: "$", texto: "Cabe no orçamento" },
  2: { rotulo: "$$", texto: "Intermediário" },
  3: { rotulo: "$$$", texto: "Premium" },
}

const real = (valor: number) => `R$ ${valor.toLocaleString("pt-BR")}`

/** Preço do parceiro do jeito que aparece no card e no perfil. */
export function precoDoParceiro(parceiro: Pick<Parceiro, "preco">) {
  const { modelo, valor } = parceiro.preco
  if (modelo === "hora" && valor) return { valor: `${real(valor)}/h`, modelo: "por hora" }
  if (modelo === "projeto" && valor) return { valor: `A partir de ${real(valor)}`, modelo: "por projeto" }
  return { valor: "Sob orçamento", modelo: "valor combinado no pedido" }
}

export const formatarReal = real

export const PARCEIROS: Parceiro[] = [
  {
    id: "ana-prado",
    nome: "Ana Lúcia Prado",
    usuario: "anaprado.foto",
    cor: "azul",
    cidade: "Ribeirão Preto, SP",
    pais: "Brasil",
    idiomas: ["Português", "Inglês"],
    titulo: "Fotografia de produto e de origem para marcas naturais",
    bio: "Fotografo cosméticos, cafés e alimentos de pequenos produtores há 12 anos. Gosto de luz de janela, mãos de verdade e de mostrar de onde o produto vem. Trabalho com o estilo fotográfico da marca como roteiro, do briefing à edição.",
    especialidades: ["Fotografia", "Motion"],
    nichos: ["Cosméticos naturais", "Alimentos", "Café especial"],
    nota: 4.9,
    avaliacoes: 64,
    projetos: 182,
    anos: 12,
    resposta: "em até 1 hora",
    desde: "março de 2026",
    disponivel: true,
    destaque: true,
    preco: { modelo: "hora", valor: 180 },
    faixa: 2,
    capa: ["#C9A27E", "#F2EBDD"],
    trabalhos: [
      { id: "a1", titulo: "Ensaio de colheita", cliente: "Café Serra Alta", tipo: "foto", fundo: "#5C3B28", tinta: "#D9A441" },
      { id: "a2", titulo: "Linha de sabonetes", cliente: "Ervas da Vó", tipo: "foto", fundo: "#E7E1D3", tinta: "#4F6B4A" },
      { id: "a3", titulo: "Bastidores do lote", cliente: "Mel do Sertão", tipo: "foto", fundo: "#D9A441", tinta: "#3B2A1A" },
      { id: "a4", titulo: "Reels de produto", cliente: "Óleos Mata Viva", tipo: "video", fundo: "#2F4A3A", tinta: "#E7E1D3" },
      { id: "a5", titulo: "Catálogo de inverno", cliente: "Lã da Serra", tipo: "foto", fundo: "#B9B4AA", tinta: "#2B2B2B" },
      { id: "a6", titulo: "Produto em fundo infinito", cliente: "Ervas da Vó", tipo: "foto", fundo: "#F2EBDD", tinta: "#8C6A4A" },
    ],
    servicos: [
      { nome: "Ensaio de produto", inclui: "Até 15 produtos, 40 fotos editadas, uso em site e redes", prazo: "7 dias", preco: "R$ 1.900" },
      { nome: "Ensaio de origem", inclui: "Meio dia na produção ou na cooperativa, 60 fotos editadas", prazo: "10 dias", preco: "R$ 2.400" },
      { nome: "Hora de estúdio", inclui: "Fotos avulsas e ajustes, com edição", prazo: "A combinar", preco: "R$ 180/h" },
    ],
    experiencia: [
      { cargo: "Fotógrafa independente", lugar: "Estúdio Prado", periodo: "2018 até hoje" },
      { cargo: "Fotógrafa de still", lugar: "Agência Terra", periodo: "2014 a 2018" },
      { cargo: "Assistente de fotografia", lugar: "Revista Casa & Campo", periodo: "2013 a 2014" },
    ],
    depoimentos: [
      { autor: "Clara M.", marca: "Ervas da Vó", nota: 5, texto: "Entendeu o estilo da marca de primeira. As fotos parecem tiradas na nossa casa, do jeito que a gente queria.", quando: "outubro de 2026" },
      { autor: "Joaquim R.", marca: "Café Serra Alta", nota: 5, texto: "Foi até a fazenda, acordou cedo pela luz e entregou antes do prazo.", quando: "agosto de 2026" },
      { autor: "Sônia L.", marca: "Mel do Sertão", nota: 4.5, texto: "Fotos lindas. Pediria só mais opções na horizontal para o site.", quando: "junho de 2026" },
    ],
  },
  {
    id: "caio-menezes",
    nome: "Caio Menezes",
    usuario: "caiomenezes",
    cor: "lilas",
    cidade: "São Paulo, SP",
    pais: "Brasil",
    idiomas: ["Português", "Inglês", "Espanhol"],
    titulo: "Logo, rótulo e sistema de marca para pequenos negócios",
    bio: "Desenho marcas para quem está começando ou crescendo. Parto do cérebro da marca que o Hattie montou, desenho o logo e deixo o sistema pronto para o dia a dia: rótulos, cartões e peças.",
    especialidades: ["Logo e marca", "Embalagem", "Estratégia de marca"],
    nichos: ["Cosméticos", "Restaurantes", "Moda autoral"],
    nota: 5,
    avaliacoes: 41,
    projetos: 96,
    anos: 9,
    resposta: "em até 2 horas",
    desde: "janeiro de 2026",
    disponivel: true,
    destaque: true,
    preco: { modelo: "projeto", valor: 2400 },
    faixa: 2,
    capa: ["#2B2B5C", "#B19DFC"],
    trabalhos: [
      { id: "c1", titulo: "Logo e rótulos", cliente: "Botica Lume", tipo: "logo", fundo: "#2B2B5C", tinta: "#F0E6D2" },
      { id: "c2", titulo: "Embalagem de chá", cliente: "Folha Seca", tipo: "embalagem", fundo: "#9DB89A", tinta: "#1E3A2A" },
      { id: "c3", titulo: "Sistema de marca", cliente: "Cantina Nona", tipo: "logo", fundo: "#B33A2A", tinta: "#F5E9D7" },
      { id: "c4", titulo: "Posts de lançamento", cliente: "Botica Lume", tipo: "post", fundo: "#F0E6D2", tinta: "#2B2B5C" },
    ],
    servicos: [
      { nome: "Logo completo", inclui: "3 ideias, versões de cor, símbolo e arquivos finais", prazo: "15 dias", preco: "R$ 2.400" },
      { nome: "Rótulo ou embalagem", inclui: "1 produto, 2 rodadas de ajuste, arquivo para gráfica", prazo: "10 dias", preco: "R$ 1.600" },
      { nome: "Sistema de marca", inclui: "Logo, rótulos, cartão e 6 peças base", prazo: "30 dias", preco: "R$ 6.800" },
    ],
    experiencia: [
      { cargo: "Designer de marca", lugar: "Estúdio Menezes", periodo: "2019 até hoje" },
      { cargo: "Diretor de arte", lugar: "Agência Faro", periodo: "2015 a 2019" },
    ],
    depoimentos: [
      { autor: "Helena T.", marca: "Botica Lume", nota: 5, texto: "Chegou com três caminhos muito diferentes e explicou cada um. Escolher ficou simples.", quando: "setembro de 2026" },
      { autor: "Marco N.", marca: "Cantina Nona", nota: 5, texto: "O rótulo ficou lindo e a gráfica não pediu nenhum ajuste.", quando: "julho de 2026" },
    ],
  },
  {
    id: "julia-nakamura",
    nome: "Júlia Nakamura",
    usuario: "ju.nakamura",
    cor: "rosa",
    cidade: "Curitiba, PR",
    pais: "Brasil",
    idiomas: ["Português", "Japonês"],
    titulo: "Ilustração botânica, padrões e embalagens",
    bio: "Ilustro plantas, frutas e ingredientes com traço de caderno de campo. Faço padrões para papel de presente, rótulos ilustrados e séries para redes sociais.",
    especialidades: ["Ilustração", "Embalagem"],
    nichos: ["Cosméticos naturais", "Chás", "Papelaria"],
    nota: 4.9,
    avaliacoes: 37,
    projetos: 88,
    anos: 7,
    resposta: "em até 3 horas",
    desde: "fevereiro de 2026",
    disponivel: true,
    destaque: true,
    preco: { modelo: "projeto", valor: 1800 },
    faixa: 2,
    capa: ["#F2EBDD", "#2F4A3A"],
    trabalhos: [
      { id: "j1", titulo: "Padrão de Natal", cliente: "Raiz Natural", tipo: "ilustracao", fundo: "#F2EBDD", tinta: "#2F4A3A" },
      { id: "j2", titulo: "Rótulos ilustrados", cliente: "Chá da Serra", tipo: "embalagem", fundo: "#E8D9C4", tinta: "#6B4A2E" },
      { id: "j3", titulo: "Série de ingredientes", cliente: "Horta Viva", tipo: "ilustracao", fundo: "#EFE7D8", tinta: "#3E5C3A" },
      { id: "j4", titulo: "Caderno de receitas", cliente: "Quitanda Mineira", tipo: "ilustracao", fundo: "#F6E7C8", tinta: "#8A3B2E" },
    ],
    servicos: [
      { nome: "Ilustração avulsa", inclui: "1 ilustração em SVG e PNG, 2 rodadas de ajuste", prazo: "5 dias", preco: "R$ 450" },
      { nome: "Série de ingredientes", inclui: "6 ilustrações no mesmo traço", prazo: "15 dias", preco: "R$ 1.800" },
      { nome: "Padrão para embalagem", inclui: "1 padrão contínuo em 2 cores, arquivo para gráfica", prazo: "10 dias", preco: "R$ 1.200" },
    ],
    experiencia: [
      { cargo: "Ilustradora independente", lugar: "Ateliê Nakamura", periodo: "2020 até hoje" },
      { cargo: "Ilustradora", lugar: "Editora Pomar", periodo: "2017 a 2020" },
    ],
    depoimentos: [
      { autor: "Bia A.", marca: "Raiz Natural", nota: 5, texto: "O padrão de Natal ficou do jeitinho do nosso estilo de ilustração. Já pedi a série de ingredientes.", quando: "outubro de 2026" },
      { autor: "Rita F.", marca: "Chá da Serra", nota: 4.8, texto: "Traço delicado e muito cuidado com cada folha.", quando: "maio de 2026" },
    ],
  },
  {
    id: "rafael-okoye",
    nome: "Rafael Okoye",
    usuario: "rafa.motion",
    cor: "cinza",
    cidade: "Salvador, BA",
    pais: "Brasil",
    idiomas: ["Português", "Inglês"],
    titulo: "Motion e vídeos curtos para redes",
    bio: "Animo logos, posts e reels com o ritmo de cada marca. Uso as curvas e os tempos do motion da marca para tudo sair consistente, do story ao vídeo de lançamento.",
    especialidades: ["Motion", "Social media"],
    nichos: ["Beleza", "Música", "Eventos"],
    nota: 4.8,
    avaliacoes: 29,
    projetos: 74,
    anos: 6,
    resposta: "em até 2 horas",
    desde: "abril de 2026",
    disponivel: true,
    preco: { modelo: "hora", valor: 140 },
    faixa: 2,
    capa: ["#101010", "#E6F344"],
    trabalhos: [
      { id: "r1", titulo: "Logo animado", cliente: "Raiz Natural", tipo: "video", fundo: "#2F4A3A", tinta: "#F2EBDD" },
      { id: "r2", titulo: "Reels de lançamento", cliente: "Dendê Cosméticos", tipo: "video", fundo: "#C2410C", tinta: "#FDF2E9" },
      { id: "r3", titulo: "Stories da semana", cliente: "Bloco Aurora", tipo: "post", fundo: "#1E1B4B", tinta: "#F9A8D4" },
    ],
    servicos: [
      { nome: "Logo animado", inclui: "Abertura de 3 s em 3 formatos", prazo: "5 dias", preco: "R$ 900" },
      { nome: "Pacote de reels", inclui: "4 vídeos de até 30 s com legendas", prazo: "10 dias", preco: "R$ 1.800" },
      { nome: "Hora de animação", inclui: "Ajustes e peças avulsas", prazo: "A combinar", preco: "R$ 140/h" },
    ],
    experiencia: [
      { cargo: "Motion designer", lugar: "Independente", periodo: "2021 até hoje" },
      { cargo: "Editor de vídeo", lugar: "Produtora Maré", periodo: "2019 a 2021" },
    ],
    depoimentos: [
      { autor: "Bia A.", marca: "Raiz Natural", nota: 5, texto: "O vídeo do lote 12 ficou calmo, do jeito do nosso motion.", quando: "outubro de 2026" },
      { autor: "Nina O.", marca: "Dendê Cosméticos", nota: 4.6, texto: "Rápido e criativo. Precisei pedir uma rodada a mais, mas veio no mesmo dia.", quando: "agosto de 2026" },
    ],
  },
  {
    id: "marina-duarte",
    nome: "Marina Duarte",
    usuario: "marina.social",
    cor: "azul",
    cidade: "Ribeirão Preto, SP",
    pais: "Brasil",
    idiomas: ["Português"],
    titulo: "Social media e conteúdo para marcas pequenas",
    bio: "Planejo e produzo o mês de posts com a voz da marca. Monto calendário, escrevo legendas e adapto as peças do Hattie para cada formato.",
    especialidades: ["Social media", "Texto e copy"],
    nichos: ["Cosméticos", "Padarias", "Lojas de bairro"],
    nota: 4.7,
    avaliacoes: 52,
    projetos: 140,
    anos: 5,
    resposta: "em até 1 hora",
    desde: "março de 2026",
    disponivel: true,
    preco: { modelo: "projeto", valor: 900 },
    faixa: 1,
    capa: ["#8AD3FA", "#101010"],
    trabalhos: [
      { id: "m1", titulo: "Posts de outubro", cliente: "Raiz Natural", tipo: "post", fundo: "#F2EBDD", tinta: "#2F4A3A" },
      { id: "m2", titulo: "Calendário de Natal", cliente: "Pão da Esquina", tipo: "post", fundo: "#7C2D12", tinta: "#FDE68A" },
      { id: "m3", titulo: "Legendas da semana", cliente: "Floricultura Ipê", tipo: "texto", fundo: "#FCE7F3", tinta: "#831843" },
    ],
    servicos: [
      { nome: "Mês de posts", inclui: "12 posts, legendas e calendário", prazo: "Mensal", preco: "R$ 900" },
      { nome: "Mês completo", inclui: "12 posts, 20 stories e respostas a comentários", prazo: "Mensal", preco: "R$ 1.600" },
    ],
    experiencia: [
      { cargo: "Social media", lugar: "Independente", periodo: "2022 até hoje" },
      { cargo: "Analista de conteúdo", lugar: "Agência Grão", periodo: "2020 a 2022" },
    ],
    depoimentos: [
      { autor: "Bia A.", marca: "Raiz Natural", nota: 4.8, texto: "Legendas no tom certo e calendário sempre em dia.", quando: "novembro de 2026" },
      { autor: "Paulo E.", marca: "Pão da Esquina", nota: 4.6, texto: "Nosso Instagram voltou a ter movimento.", quando: "setembro de 2026" },
    ],
  },
  {
    id: "pedro-albuquerque",
    nome: "Pedro Albuquerque",
    usuario: "pedro.estrategia",
    cor: "lilas",
    cidade: "Belo Horizonte, MG",
    pais: "Brasil",
    idiomas: ["Português", "Inglês"],
    titulo: "Estratégia de marca, posicionamento e naming",
    bio: "Ajudo marcas a decidir quem são antes de decidir como parecem. Conduzo oficinas curtas, reviso o posicionamento que o Hattie propôs e testo nomes com o público.",
    especialidades: ["Estratégia de marca", "Naming", "Texto e copy"],
    nichos: ["Marcas de impacto", "Alimentos", "Serviços"],
    nota: 5,
    avaliacoes: 18,
    projetos: 52,
    anos: 15,
    resposta: "em até 4 horas",
    desde: "janeiro de 2026",
    disponivel: false,
    agenda: "Agenda cheia até dezembro",
    destaque: true,
    preco: { modelo: "orcamento" },
    faixa: 3,
    capa: ["#B19DFC", "#101010"],
    trabalhos: [
      { id: "p1", titulo: "Posicionamento", cliente: "Cooperativa Pequi Vivo", tipo: "texto", fundo: "#2F4A3A", tinta: "#E6D5A8" },
      { id: "p2", titulo: "Naming", cliente: "Ateliê Barro", tipo: "logo", fundo: "#A0522D", tinta: "#FBEBD7" },
      { id: "p3", titulo: "Guia de marca", cliente: "Clínica Respiro", tipo: "texto", fundo: "#E0F2FE", tinta: "#0C4A6E" },
    ],
    servicos: [
      { nome: "Oficina de posicionamento", inclui: "2 encontros de 2 h e documento final", prazo: "2 semanas", preco: "Sob orçamento" },
      { nome: "Naming", inclui: "Território, 15 opções, checagem de domínio e INPI", prazo: "3 semanas", preco: "Sob orçamento" },
    ],
    experiencia: [
      { cargo: "Estrategista de marca", lugar: "Albuquerque & Co.", periodo: "2016 até hoje" },
      { cargo: "Planejamento", lugar: "Agência Horizonte", periodo: "2011 a 2016" },
    ],
    depoimentos: [{ autor: "Lúcia P.", marca: "Cooperativa Pequi Vivo", nota: 5, texto: "Saímos da oficina sabendo o que dizer e o que deixar de lado.", quando: "agosto de 2026" }],
  },
  {
    id: "lia-ferraz",
    nome: "Lia Ferraz",
    usuario: "liaferraz.web",
    cor: "rosa",
    cidade: "Florianópolis, SC",
    pais: "Brasil",
    idiomas: ["Português", "Inglês"],
    titulo: "Sites e lojas virtuais com a cara da marca",
    bio: "Desenho e construo sites e lojas que respeitam o sistema da marca: tipografia, cores e fotos. Entrego tudo editável para você atualizar sem depender de mim.",
    especialidades: ["Site"],
    nichos: ["Lojas virtuais", "Cosméticos", "Turismo"],
    nota: 4.8,
    avaliacoes: 33,
    projetos: 61,
    anos: 8,
    resposta: "em até 3 horas",
    desde: "maio de 2026",
    disponivel: true,
    preco: { modelo: "projeto", valor: 3500 },
    faixa: 3,
    capa: ["#FF8AE5", "#101010"],
    trabalhos: [
      { id: "l1", titulo: "Loja virtual", cliente: "Sal da Ilha", tipo: "site", fundo: "#E0F2FE", tinta: "#0E7490" },
      { id: "l2", titulo: "Site institucional", cliente: "Pousada Lagoa", tipo: "site", fundo: "#F5F0E6", tinta: "#4D7C0F" },
      { id: "l3", titulo: "Página de lançamento", cliente: "Botica Lume", tipo: "site", fundo: "#2B2B5C", tinta: "#F0E6D2" },
    ],
    servicos: [
      { nome: "Página de lançamento", inclui: "1 página, formulário e integração com Instagram", prazo: "10 dias", preco: "R$ 1.800" },
      { nome: "Loja virtual", inclui: "Até 30 produtos, pagamento e frete", prazo: "30 dias", preco: "R$ 3.500" },
    ],
    experiencia: [
      { cargo: "Designer de sites", lugar: "Independente", periodo: "2019 até hoje" },
      { cargo: "Designer de produto", lugar: "Startup Ondas", periodo: "2016 a 2019" },
    ],
    depoimentos: [{ autor: "Davi S.", marca: "Sal da Ilha", nota: 4.8, texto: "Loja rápida e bonita. As vendas pelo site dobraram.", quando: "julho de 2026" }],
  },
  {
    id: "tomas-ribeiro",
    nome: "Tomás Ribeiro",
    usuario: "tomas.embalagem",
    cor: "cinza",
    cidade: "Lisboa",
    pais: "Portugal",
    idiomas: ["Português", "Inglês", "Francês"],
    titulo: "Embalagem e rótulos premium",
    bio: "Desenho embalagens para produtos artesanais que querem chegar à prateleira de lojas especiais. Acompanho a prova de gráfica e a escolha do papel.",
    especialidades: ["Embalagem", "Logo e marca"],
    nichos: ["Vinhos", "Cosméticos", "Azeites"],
    nota: 4.9,
    avaliacoes: 22,
    projetos: 47,
    anos: 11,
    resposta: "em até 6 horas",
    desde: "junho de 2026",
    disponivel: true,
    preco: { modelo: "projeto", valor: 3200 },
    faixa: 3,
    capa: ["#E6F344", "#101010"],
    trabalhos: [
      { id: "t1", titulo: "Rótulos de azeite", cliente: "Quinta do Vale", tipo: "embalagem", fundo: "#1F2937", tinta: "#D4AF37" },
      { id: "t2", titulo: "Linha de sabonetes", cliente: "Saboaria Tejo", tipo: "embalagem", fundo: "#F3E8D3", tinta: "#7C2D12" },
      { id: "t3", titulo: "Caixa de presente", cliente: "Vinhas Altas", tipo: "embalagem", fundo: "#4A1D1F", tinta: "#F5E6C8" },
    ],
    servicos: [
      { nome: "Rótulo premium", inclui: "1 produto, papel especial e prova de gráfica", prazo: "15 dias", preco: "R$ 3.200" },
      { nome: "Linha de embalagens", inclui: "Até 5 produtos no mesmo sistema", prazo: "30 dias", preco: "R$ 9.500" },
    ],
    experiencia: [
      { cargo: "Designer de embalagem", lugar: "Ribeiro Packaging", periodo: "2017 até hoje" },
      { cargo: "Designer", lugar: "Estúdio Alfama", periodo: "2013 a 2017" },
    ],
    depoimentos: [{ autor: "Inês C.", marca: "Saboaria Tejo", nota: 5, texto: "A embalagem abriu as portas de três lojas novas.", quando: "setembro de 2026" }],
  },
  {
    id: "bruna-sa",
    nome: "Bruna Sá",
    usuario: "bruna.cria",
    cor: "azul",
    cidade: "Campinas, SP",
    pais: "Brasil",
    idiomas: ["Português"],
    titulo: "Posts, peças e ilustrações para o dia a dia",
    bio: "Sou designer em começo de carreira e adoro marcas pequenas. Faço posts, cartões e pequenas ilustrações seguindo à risca as diretrizes da marca.",
    especialidades: ["Social media", "Ilustração"],
    nichos: ["Confeitaria", "Cosméticos", "Pets"],
    nota: 4.6,
    avaliacoes: 12,
    projetos: 30,
    anos: 2,
    resposta: "em até 1 hora",
    desde: "agosto de 2026",
    disponivel: true,
    preco: { modelo: "hora", valor: 60 },
    faixa: 1,
    capa: ["#DAECF6", "#1764D6"],
    trabalhos: [
      { id: "b1", titulo: "Posts de Dia das Mães", cliente: "Doce Ateliê", tipo: "post", fundo: "#F6E7C8", tinta: "#C2185B" },
      { id: "b2", titulo: "Cartão de agradecimento", cliente: "Patas & Cia", tipo: "post", fundo: "#FFF7ED", tinta: "#9A3412" },
      { id: "b3", titulo: "Mascote em adesivos", cliente: "Patas & Cia", tipo: "ilustracao", fundo: "#ECFCCB", tinta: "#3F6212" },
    ],
    servicos: [
      { nome: "Pacote de 6 posts", inclui: "Peças nos formatos de feed e story", prazo: "5 dias", preco: "R$ 420" },
      { nome: "Hora de design", inclui: "Peças avulsas e ajustes", prazo: "A combinar", preco: "R$ 60/h" },
    ],
    experiencia: [{ cargo: "Designer júnior", lugar: "Independente", periodo: "2024 até hoje" }],
    depoimentos: [{ autor: "Carla D.", marca: "Doce Ateliê", nota: 4.6, texto: "Atenciosa e caprichosa. Ótima para o dia a dia.", quando: "maio de 2026" }],
  },
  {
    id: "valentina-ruiz",
    nome: "Valentina Ruiz",
    usuario: "vale.ruiz",
    cor: "rosa",
    cidade: "Buenos Aires",
    pais: "Argentina",
    idiomas: ["Espanhol", "Português", "Inglês"],
    titulo: "Fotografia e direção de arte para campanhas",
    bio: "Dirijo e fotografo campanhas pequenas com cara de grande. Monto o roteiro de cenas a partir do estilo fotográfico e cuido de produção, modelo e locação.",
    especialidades: ["Fotografia", "Motion"],
    nichos: ["Moda", "Cosméticos", "Gastronomia"],
    nota: 4.8,
    avaliacoes: 26,
    projetos: 58,
    anos: 9,
    resposta: "em até 5 horas",
    desde: "julho de 2026",
    disponivel: true,
    preco: { modelo: "hora", valor: 120 },
    faixa: 2,
    capa: ["#5C3B28", "#FF8AE5"],
    trabalhos: [
      { id: "v1", titulo: "Campanha de verão", cliente: "Tierra Bella", tipo: "foto", fundo: "#FDE68A", tinta: "#7C2D12" },
      { id: "v2", titulo: "Editorial de pele", cliente: "Piel Clara", tipo: "foto", fundo: "#F5D0C5", tinta: "#4A2C2A" },
      { id: "v3", titulo: "Vídeo de receita", cliente: "Cocina Lenta", tipo: "video", fundo: "#1C1917", tinta: "#FCA5A5" },
    ],
    servicos: [
      { nome: "Campanha", inclui: "Direção, produção, 1 diária e 50 fotos", prazo: "20 dias", preco: "R$ 5.400" },
      { nome: "Hora de foto", inclui: "Fotos avulsas com edição", prazo: "A combinar", preco: "R$ 120/h" },
    ],
    experiencia: [
      { cargo: "Diretora de arte e fotógrafa", lugar: "Independente", periodo: "2018 até hoje" },
      { cargo: "Produtora de moda", lugar: "Revista Sur", periodo: "2015 a 2018" },
    ],
    depoimentos: [{ autor: "Sofía G.", marca: "Piel Clara", nota: 4.9, texto: "Trouxe ideias que a gente nem imaginava e manteve tudo dentro do orçamento.", quando: "setembro de 2026" }],
  },
  {
    id: "diego-martins",
    nome: "Diego Martins",
    usuario: "diego.textos",
    cor: "cinza",
    cidade: "Recife, PE",
    pais: "Brasil",
    idiomas: ["Português", "Inglês"],
    titulo: "Textos para rótulo, site e e-mail",
    bio: "Escrevo com a voz da marca: rótulos que cabem em 5 cm, páginas de produto que vendem e e-mails que as pessoas abrem.",
    especialidades: ["Texto e copy", "Naming"],
    nichos: ["Cosméticos", "Alimentos", "Educação"],
    nota: 4.7,
    avaliacoes: 20,
    projetos: 66,
    anos: 6,
    resposta: "em até 2 horas",
    desde: "abril de 2026",
    disponivel: true,
    preco: { modelo: "hora", valor: 80 },
    faixa: 1,
    capa: ["#F5F5F5", "#333333"],
    trabalhos: [
      { id: "d1", titulo: "Página de produto", cliente: "Mel do Sertão", tipo: "texto", fundo: "#FEF3C7", tinta: "#78350F" },
      { id: "d2", titulo: "Sequência de e-mails", cliente: "Escola Brota", tipo: "texto", fundo: "#ECFDF5", tinta: "#065F46" },
      { id: "d3", titulo: "Textos de rótulo", cliente: "Ervas da Vó", tipo: "texto", fundo: "#E7E1D3", tinta: "#4F6B4A" },
    ],
    servicos: [
      { nome: "Textos de rótulo", inclui: "Até 5 produtos, frente e verso", prazo: "5 dias", preco: "R$ 600" },
      { nome: "Página de produto", inclui: "Texto completo com perguntas frequentes", prazo: "4 dias", preco: "R$ 450" },
    ],
    experiencia: [
      { cargo: "Redator", lugar: "Independente", periodo: "2021 até hoje" },
      { cargo: "Redator", lugar: "Agência Coqueiral", periodo: "2019 a 2021" },
    ],
    depoimentos: [{ autor: "Sônia L.", marca: "Mel do Sertão", nota: 4.7, texto: "Textos curtos, claros e com o nosso jeito de falar.", quando: "julho de 2026" }],
  },
]

/** O que o parceiro costuma precisar ver do cérebro da marca, por especialidade. A janela de contratar já começa com isso marcado. */
export const CEREBRO_POR_ESPECIALIDADE: Record<EspecialidadeParceiro, string[]> = {
  "Logo e marca": ["posicionamento", "arquetipo", "logo", "cores"],
  Embalagem: ["logo", "cores", "tipografia", "aplicacoes"],
  Fotografia: ["fotografia", "cores", "logo"],
  Ilustração: ["ilustracao", "cores", "grafismos"],
  "Social media": ["tom-de-voz", "aplicacoes", "cores"],
  Site: ["logo", "cores", "tipografia", "tom-de-voz"],
  "Estratégia de marca": ["briefing", "posicionamento", "publico", "mercado"],
  Motion: ["movimento", "logo", "cores"],
  "Texto e copy": ["tom-de-voz", "mensagens", "vocabulario"],
  Naming: ["briefing", "posicionamento", "nome"],
}

export function cerebroSugerido(parceiro: Pick<Parceiro, "especialidades">) {
  return [...new Set(parceiro.especialidades.flatMap((especialidade) => CEREBRO_POR_ESPECIALIDADE[especialidade]))].slice(0, 4)
}

export function getParceiro(id: string) {
  return PARCEIROS.find((parceiro) => parceiro.id === id)
}

export const ETAPAS: { id: EtapaTrabalho; titulo: string; descricao: string }[] = [
  { id: "pedido", titulo: "Pedido enviado", descricao: "Esperando a resposta" },
  { id: "proposta", titulo: "Proposta", descricao: "Valor e prazo para você aprovar" },
  { id: "andamento", titulo: "Em andamento", descricao: "O parceiro está trabalhando" },
  { id: "revisao", titulo: "Para revisar", descricao: "Entregue, esperando seu ok" },
  { id: "entregue", titulo: "Concluído", descricao: "Aprovado e guardado na biblioteca" },
]

export const TRABALHOS_INICIAIS: TrabalhoParceiro[] = [
  { id: "ensaio-origem", titulo: "Ensaio de fotos Origem natural", parceiro: "ana-prado", etapa: "proposta", valor: 2400, prazo: "10 dias depois de aprovar", projeto: "Catálogo para lojistas", tarefa: "Fotos dos produtos" },
  { id: "rotulo-baru", titulo: "Rótulo do óleo de baru", parceiro: "caio-menezes", etapa: "andamento", valor: 1600, prazo: "Entrega em 18/11", progresso: 60 },
  { id: "posts-novembro", titulo: "Posts de novembro", parceiro: "marina-duarte", etapa: "revisao", valor: 900, prazo: "Entregue ontem", projeto: "Posts de novembro" },
  { id: "padrao-natal", titulo: "Padrão de Natal", parceiro: "julia-nakamura", etapa: "entregue", valor: 1200, prazo: "Concluído em 30/10" },
  { id: "video-lote", titulo: "Vídeo do lote 12", parceiro: "rafael-okoye", etapa: "entregue", valor: 900, prazo: "Concluído em 12/10" },
]

export const CONVERSAS_PARCEIROS: ConversaParceiro[] = [
  {
    id: "ensaio-origem",
    parceiro: "ana-prado",
    assunto: "Ensaio de fotos Origem natural",
    naoLidas: 1,
    mensagens: [
      { id: "e1", autor: "pessoa", texto: "Oi, Ana! Quero um ensaio no estilo Origem natural: produtos na bancada e um pouco da cooperativa de Pirenópolis.", quando: "segunda, 9:12" },
      { id: "e2", autor: "hattie", texto: "Liguei o pedido ao projeto Catálogo para lojistas, na tarefa Fotos dos produtos. Ana já pode ver estas partes da Raiz Natural:", quando: "segunda, 9:12", anexos: ["fotografia", "cores", "logo"] },
      { id: "e3", autor: "parceiro", texto: "Oi, Bia! Li o estilo, adorei a luz de janela. Consigo ir à cooperativa no dia 21. Mandei a proposta aqui embaixo.", quando: "segunda, 10:03" },
      {
        id: "e4",
        autor: "parceiro",
        texto: "Proposta",
        quando: "segunda, 10:04",
        proposta: {
          titulo: "Ensaio de origem",
          valor: 2400,
          prazo: "10 dias depois de aprovar",
          inclui: ["Meio dia na cooperativa", "60 fotos editadas no estilo Origem natural", "Uso em site, redes e rótulo"],
          status: "aberta",
        },
      },
    ],
  },
  {
    id: "rotulo-baru",
    parceiro: "caio-menezes",
    assunto: "Rótulo do óleo de baru",
    naoLidas: 0,
    mensagens: [
      { id: "r1", autor: "pessoa", texto: "Caio, preciso do rótulo do óleo de baru seguindo o do pequi.", quando: "dia 4, 14:20" },
      { id: "r2", autor: "parceiro", texto: "Combinado. Uso a mesma grade e troco a ilustração. Te mostro a primeira versão na sexta.", quando: "dia 4, 15:02" },
      { id: "r3", autor: "parceiro", texto: "Primeira versão pronta. Ajustei o verso para caber a lista de ingredientes em 7 pt.", quando: "ontem, 18:40" },
    ],
  },
  {
    id: "posts-novembro",
    parceiro: "marina-duarte",
    assunto: "Posts de novembro",
    naoLidas: 2,
    mensagens: [
      { id: "p1", autor: "parceiro", texto: "Bia, os 12 posts de novembro estão no quadro para você revisar.", quando: "ontem, 17:10" },
      { id: "p2", autor: "parceiro", texto: "Deixei duas opções de legenda para o post da Black Friday.", quando: "ontem, 17:11" },
    ],
  },
  {
    id: "padrao-natal",
    parceiro: "julia-nakamura",
    assunto: "Padrão de Natal",
    naoLidas: 0,
    mensagens: [
      { id: "n1", autor: "parceiro", texto: "Arquivos finais na biblioteca. Foi um prazer!", quando: "30/10" },
      { id: "n2", autor: "pessoa", texto: "Ficou lindo, Júlia. Obrigada!", quando: "30/10" },
    ],
  },
  {
    id: "video-lote",
    parceiro: "rafael-okoye",
    assunto: "Vídeo do lote 12",
    naoLidas: 0,
    mensagens: [{ id: "v1", autor: "parceiro", texto: "Vídeo final entregue em 3 formatos.", quando: "12/10" }],
  },
]
