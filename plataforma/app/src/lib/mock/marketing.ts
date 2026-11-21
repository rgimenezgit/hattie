/* ---------- Marketing: como a marca está, calendário de posts, concorrentes e leads ---------- */

/** "Hoje" dos dados fictícios (quinta-feira), para datas e prazos não mudarem entre servidor e navegador. */
export const HOJE_MARKETING = "2026-11-12"

const F = "/marcas/raiz-natural"

export type CanalPost = "feed" | "carrossel" | "story" | "reels" | "email" | "whatsapp"
export type StatusPost = "ideia" | "aprovado" | "agendado" | "publicado"
export type MetricasPost = { alcance: number; curtidas: number; salvamentos: number; comentarios: number }

export type PostCalendario = {
  id: string
  /** AAAA-MM-DD */
  data: string
  hora: string
  canal: CanalPost
  titulo: string
  legenda: string
  status: StatusPost
  /** Mensagem-chave que o post carrega. */
  mensagem?: string
  imagem?: string
  origem: "hattie" | "voce" | "parceiro"
  metricas?: MetricasPost
  /** Ideia que acabou de chegar de uma geração do Hattie. */
  nova?: boolean
  /** Por que o Hattie mudou este post na última atualização. */
  mudou?: string
}

export const CANAIS: Record<CanalPost, { rotulo: string; curto: string }> = {
  feed: { rotulo: "Post no feed", curto: "Feed" },
  carrossel: { rotulo: "Carrossel", curto: "Carrossel" },
  story: { rotulo: "Story", curto: "Story" },
  reels: { rotulo: "Reels", curto: "Reels" },
  email: { rotulo: "E-mail", curto: "E-mail" },
  whatsapp: { rotulo: "Lista do WhatsApp", curto: "WhatsApp" },
}

export const STATUS_POST: Record<StatusPost, { rotulo: string; explica: string }> = {
  ideia: { rotulo: "Ideia", explica: "Sugestão do Hattie esperando o seu ok" },
  aprovado: { rotulo: "Aprovado", explica: "Pronto, falta escolher a hora" },
  agendado: { rotulo: "Agendado", explica: "Sai sozinho no dia e na hora" },
  publicado: { rotulo: "Publicado", explica: "Já está no ar" },
}

export const DATAS_COMEMORATIVAS: { data: string; nome: string }[] = [
  { data: "2026-11-27", nome: "Black Friday" },
  { data: "2026-11-30", nome: "Cyber Monday" },
  { data: "2026-12-24", nome: "Véspera de Natal" },
  { data: "2026-12-25", nome: "Natal" },
  { data: "2026-12-31", nome: "Réveillon" },
]

const m = (alcance: number, curtidas: number, salvamentos: number, comentarios: number): MetricasPost => ({ alcance, curtidas, salvamentos, comentarios })

export const POSTS_CALENDARIO: PostCalendario[] = [
  { id: "pc-1", data: "2026-11-02", hora: "19:00", canal: "carrossel", titulo: "Benefícios do pequi", legenda: "Três coisas que o óleo de pequi faz pela sua pele, e de onde vem cada gota.", status: "publicado", mensagem: "Origem", imagem: `${F}/ilustracao/pequi.jpg`, origem: "hattie", metricas: m(2140, 188, 96, 14) },
  { id: "pc-2", data: "2026-11-04", hora: "19:00", canal: "feed", titulo: "Mãos e óleo de pequi", legenda: "Três gotas, um minuto e a pele macia até a noite.", status: "publicado", mensagem: "Rotina", imagem: `${F}/fotografia/maos-oleo.jpg`, origem: "hattie", metricas: m(4820, 512, 231, 38) },
  { id: "pc-3", data: "2026-11-05", hora: "10:00", canal: "story", titulo: "Bastidores do lote 12", legenda: "O lote 12 saiu hoje da bancada. Conferido frasco por frasco.", status: "publicado", mensagem: "Lote pequeno", imagem: `${F}/fotografia/bancada.jpg`, origem: "voce", metricas: m(1310, 0, 0, 22) },
  { id: "pc-4", data: "2026-11-07", hora: "10:00", canal: "reels", titulo: "Textura do óleo", legenda: "Câmera lenta: a gota do óleo de pequi.", status: "publicado", mensagem: "Rotina", imagem: `${F}/fotografia/frasco-frutos.jpg`, origem: "parceiro", metricas: m(3650, 341, 88, 19) },
  { id: "pc-5", data: "2026-11-09", hora: "19:00", canal: "feed", titulo: "Depoimento da Marina", legenda: "\"Gosto de dar presente que conta uma história.\" A Marina sobre o kit da Raiz Natural.", status: "publicado", mensagem: "Origem", imagem: `${F}/fotografia/kit.jpg`, origem: "parceiro", metricas: m(1980, 174, 41, 11) },
  { id: "pc-6", data: "2026-11-11", hora: "19:00", canal: "feed", titulo: "Rastreio do lote 12", legenda: "Você sabe de onde vem cada gota. Lote 12, cooperativa de Pirenópolis.", status: "publicado", mensagem: "Origem", imagem: `${F}/biblioteca/f-pequi-bancada.jpg`, origem: "hattie", metricas: m(4310, 466, 204, 31) },
  { id: "pc-7", data: "2026-11-13", hora: "19:00", canal: "feed", titulo: "Lançamento do óleo de pequi", legenda: "Chegou o óleo de pequi do lote 12. Colhido pela cooperativa de Pirenópolis, prensado a frio.", status: "agendado", mensagem: "Origem", imagem: `${F}/biblioteca/f-pequi-verde.jpg`, origem: "hattie" },
  { id: "pc-8", data: "2026-11-14", hora: "10:00", canal: "story", titulo: "Amanhã tem feira", legenda: "Domingo, das 8h às 13h, na praça da feira. Vem conhecer o lote 12.", status: "aprovado", mensagem: "Lote pequeno", imagem: `${F}/biblioteca/f-feira.jpg`, origem: "voce" },
  { id: "pc-9", data: "2026-11-17", hora: "19:00", canal: "carrossel", titulo: "Como usar em 3 gotas", legenda: "Passo a passo de um minuto, para o rosto e para o corpo.", status: "aprovado", mensagem: "Rotina", imagem: `${F}/biblioteca/f-pequi-maos.jpg`, origem: "hattie" },
  { id: "pc-10", data: "2026-11-18", hora: "09:00", canal: "email", titulo: "Black Friday consciente: lista de espera", legenda: "15% só no que tem estoque do lote. Entre na lista e receba primeiro.", status: "aprovado", mensagem: "Lote pequeno", origem: "hattie" },
  { id: "pc-11", data: "2026-11-19", hora: "19:00", canal: "reels", titulo: "A colheita na cooperativa", legenda: "Do pé de pequi ao frasco: um dia na cooperativa de Pirenópolis.", status: "ideia", mensagem: "Origem", imagem: `${F}/fotografia/colheita.jpg`, origem: "hattie" },
  { id: "pc-12", data: "2026-11-21", hora: "10:00", canal: "whatsapp", titulo: "Kits de Natal chegaram", legenda: "Os kits de Natal chegaram, com cartão escrito à mão. Reserve o seu por aqui.", status: "ideia", mensagem: "Origem", imagem: `${F}/fotografia/kit.jpg`, origem: "hattie" },
  { id: "pc-13", data: "2026-11-24", hora: "19:00", canal: "feed", titulo: "Black Friday consciente: o que entra", legenda: "Sem contagem regressiva e sem pressa: 15% no que tem lote, de 27 a 30/11.", status: "agendado", mensagem: "Lote pequeno", imagem: `${F}/biblioteca/f-lote-sol.jpg`, origem: "hattie" },
  { id: "pc-14", data: "2026-11-27", hora: "08:00", canal: "feed", titulo: "Começou a Black Friday consciente", legenda: "15% no óleo, no hidratante e no sabonete, enquanto tiver lote.", status: "agendado", mensagem: "Lote pequeno", imagem: `${F}/fotografia/frasco-frutos.jpg`, origem: "hattie" },
  { id: "pc-15", data: "2026-11-27", hora: "19:00", canal: "story", titulo: "O que ainda tem no lote", legenda: "Atualização do estoque, frasco por frasco.", status: "aprovado", mensagem: "Lote pequeno", origem: "hattie" },
  { id: "pc-16", data: "2026-11-30", hora: "19:00", canal: "story", titulo: "Último dia da Black Friday", legenda: "Hoje é o último dia dos 15%.", status: "ideia", mensagem: "Lote pequeno", origem: "hattie" },
]

/* ---------- Como a marca está ---------- */

export type FormatoNumero = "numero" | "porcentagem" | "moeda"
export type IndicadorMarketing = { id: string; rotulo: string; valor: number; formato: FormatoNumero; variacao: number; serie: number[]; explica: string }

/** Últimas 8 semanas, da mais antiga para a atual. */
export const SEMANAS_MARKETING = ["21/9", "28/9", "5/10", "12/10", "19/10", "26/10", "2/11", "9/11"]

export const INDICADORES_MARKETING: IndicadorMarketing[] = [
  { id: "alcance", rotulo: "Pessoas alcançadas", valor: 18420, formato: "numero", variacao: 18, serie: [3100, 3300, 3250, 3600, 3900, 4100, 4500, 5200], explica: "Quantas pessoas viram algum post ou story nos últimos 30 dias." },
  { id: "seguidores", rotulo: "Novos seguidores", valor: 412, formato: "numero", variacao: 9, serie: [78, 82, 80, 91, 95, 98, 104, 115], explica: "Quem começou a seguir a marca nos últimos 30 dias." },
  { id: "engajamento", rotulo: "Engajamento", valor: 5.8, formato: "porcentagem", variacao: 12, serie: [4.6, 4.8, 4.7, 5.0, 5.1, 5.3, 5.6, 5.8], explica: "Curtidas, comentários e salvamentos sobre o alcance. Acima de 3% já é bom para o seu tamanho." },
  { id: "whatsapp", rotulo: "Conversas no WhatsApp", valor: 236, formato: "numero", variacao: 24, serie: [44, 47, 50, 52, 55, 58, 63, 70], explica: "Quem clicou no botão do perfil ou do link e começou uma conversa." },
  { id: "pedidos", rotulo: "Pedidos", valor: 87, formato: "numero", variacao: 12, serie: [17, 18, 18, 19, 20, 21, 22, 24], explica: "Pedidos fechados em todos os canais nos últimos 30 dias." },
  { id: "faturamento", rotulo: "Faturamento", valor: 6930, formato: "moeda", variacao: 15, serie: [1340, 1390, 1420, 1500, 1580, 1610, 1720, 1880], explica: "Soma dos pedidos nos últimos 30 dias." },
]

export type MetaMarketing = { id: string; titulo: string; atual: number; alvo: number; unidade: "lojas" | "%"; prazo: string; ritmo: "no ritmo" | "atrasada"; explica: string; dica: string }

export const METAS_MARKETING: MetaMarketing[] = [
  { id: "lojas", titulo: "Lojas parceiras na região", atual: 1, alvo: 3, unidade: "lojas", prazo: "até novembro de 2027", ritmo: "no ritmo", explica: "O Armazém Cerrado, de Uberaba, já revende. Dois lojistas pediram catálogo esta semana.", dica: "Responder os lojistas" },
  { id: "fora-sp", titulo: "Vendas para fora de São Paulo", atual: 18, alvo: 30, unidade: "%", prazo: "até novembro de 2027", ritmo: "atrasada", explica: "O frete pesa no pedido pequeno. A Ipê Amarelo testou frete grátis acima de R$ 150.", dica: "Ver o que a Ipê Amarelo fez" },
]

export const CANAIS_VENDA: { canal: string; porcentagem: number }[] = [
  { canal: "WhatsApp", porcentagem: 46 },
  { canal: "Instagram", porcentagem: 31 },
  { canal: "Feira", porcentagem: 15 },
  { canal: "Loja online", porcentagem: 8 },
]

export const MELHORES_HORARIOS: { dia: string; hora: string; porque: string }[] = [
  { dia: "Terça e quinta", hora: "19h", porque: "Depois do trabalho, quando a cliente cuida da rotina" },
  { dia: "Sábado", hora: "10h", porque: "Quem compra presente olha com calma no fim de semana" },
]

/* ---------- Concorrentes ---------- */

export type MonitorConcorrente = { id: string; nome: string; voce?: boolean; seguidores: number; novosSeguidores: number; postsSemana: number; engajamento: number; preco: string; novidade?: string }

export const MONITOR_CONCORRENTES: MonitorConcorrente[] = [
  { id: "raiz-natural", nome: "Raiz Natural", voce: true, seguidores: 3240, novosSeguidores: 412, postsSemana: 3.5, engajamento: 5.8, preco: "R$ 38 a 64" },
  { id: "botica-cerrado", nome: "Botica do Cerrado", seguidores: 8900, novosSeguidores: 310, postsSemana: 5, engajamento: 3.1, preco: "R$ 35 a 70", novidade: "Kit de Natal a R$ 89" },
  { id: "ipe-amarelo", nome: "Ateliê Ipê Amarelo", seguidores: 5100, novosSeguidores: 120, postsSemana: 2, engajamento: 4.2, preco: "R$ 45 a 90", novidade: "Frete grátis acima de R$ 150" },
  { id: "linha-farmacia", nome: "Linhas naturais de farmácia", seguidores: 120000, novosSeguidores: 2100, postsSemana: 9, engajamento: 1.2, preco: "R$ 25 a 50", novidade: "Campanha \"natural de verdade\"" },
]

export type TipoNovidade = "lancamento" | "preco" | "campanha" | "conteudo"

export type NovidadeConcorrente = {
  id: string
  concorrente: string
  data: string
  tipo: TipoNovidade
  titulo: string
  texto: string
  /** O que o Hattie sugere fazer a respeito. */
  sugestao: string
  /** Ideia de post que nasce da sugestão. */
  ideia: { titulo: string; canal: CanalPost; legenda: string }
}

export const TIPOS_NOVIDADE: Record<TipoNovidade, string> = { lancamento: "Lançamento", preco: "Preço e frete", campanha: "Campanha", conteudo: "Conteúdo" }

export const NOVIDADES_CONCORRENTES: NovidadeConcorrente[] = [
  {
    id: "nv-1",
    concorrente: "botica-cerrado",
    data: "2026-11-10",
    tipo: "lancamento",
    titulo: "Lançou um kit de Natal a R$ 89",
    texto: "Três produtos numa caixa de papelão, sem cartão. Divulgou em 5 posts esta semana.",
    sugestao: "O seu kit custa parecido por item e tem uma história que o deles não tem. Mostre a origem de cada produto e o cartão escrito à mão.",
    ideia: { titulo: "Um kit com origem", canal: "carrossel", legenda: "Cada item do kit tem lote, cooperativa e um cartão escrito à mão." },
  },
  {
    id: "nv-2",
    concorrente: "ipe-amarelo",
    data: "2026-11-08",
    tipo: "preco",
    titulo: "Frete grátis acima de R$ 150",
    texto: "Vale para todo o Brasil. Os comentários pedindo envio para outros estados dobraram.",
    sugestao: "Ajuda a sua meta de vender fora de São Paulo. Vale testar frete grátis acima de R$ 180 para fora do estado, só em dezembro.",
    ideia: { titulo: "Frete grátis para fora de SP", canal: "feed", legenda: "Em dezembro, frete grátis acima de R$ 180 para todo o Brasil." },
  },
  {
    id: "nv-3",
    concorrente: "linha-farmacia",
    data: "2026-11-06",
    tipo: "campanha",
    titulo: "Campanha \"natural de verdade\"",
    texto: "Na TV e no Instagram, sem dizer de onde vem cada ingrediente.",
    sugestao: "Eles falam de natural; você mostra o lote. Um post de rastreio responde sem citar ninguém.",
    ideia: { titulo: "De onde vem cada gota", canal: "carrossel", legenda: "Lote, cooperativa e data da colheita: tudo no rótulo." },
  },
  {
    id: "nv-4",
    concorrente: "botica-cerrado",
    data: "2026-11-03",
    tipo: "conteudo",
    titulo: "Reels de bastidor três vezes por semana",
    texto: "O engajamento deles subiu de 2,4% para 3,1% no mês.",
    sugestao: "Bastidor já funciona para você: o story do lote 12 teve o dobro de respostas. Um reels por semana mantém o ritmo sem pesar.",
    ideia: { titulo: "Bastidores do lote 13", canal: "reels", legenda: "Do frasco vazio ao lote pronto, em 20 segundos." },
  },
]

/* ---------- Leads ---------- */

export type EtapaLead = "novo" | "conversa" | "orcamento" | "cliente" | "perdido"
export type TipoLead = "cliente" | "lojista" | "empresa"
export type OrigemLead = "instagram" | "whatsapp" | "site" | "feira" | "indicacao"

export type Lead = {
  id: string
  nome: string
  tipo: TipoLead
  origem: OrigemLead
  cidade: string
  interesse: string
  /** Valor estimado do pedido, em reais. */
  valor?: number
  etapa: EtapaLead
  /** Último contato, AAAA-MM-DD. */
  ultimoContato: string
  /** De quem é a vez de responder. */
  aguardando: "voce" | "lead"
  mensagens: { autor: "lead" | "voce"; texto: string; quando: string }[]
  /** Resposta sugerida pelo Hattie, na voz da marca. */
  sugestao?: string
  motivo?: string
}

export const ETAPAS_LEAD: { id: EtapaLead; titulo: string; explica: string }[] = [
  { id: "novo", titulo: "Novo", explica: "Chegou e ainda não teve resposta" },
  { id: "conversa", titulo: "Conversando", explica: "Tirando dúvidas" },
  { id: "orcamento", titulo: "Orçamento", explica: "Proposta enviada" },
  { id: "cliente", titulo: "Cliente", explica: "Fechou" },
  { id: "perdido", titulo: "Não fechou", explica: "Com o motivo, para aprender" },
]

export const TIPOS_LEAD: Record<TipoLead, string> = { cliente: "Cliente final", lojista: "Lojista", empresa: "Empresa" }
export const ORIGENS_LEAD: Record<OrigemLead, string> = { instagram: "Instagram", whatsapp: "WhatsApp", site: "Site", feira: "Feira", indicacao: "Indicação" }

export const LEADS: Lead[] = [
  {
    id: "ld-1",
    nome: "Empório Serra",
    tipo: "lojista",
    origem: "instagram",
    cidade: "Campinas, SP",
    interesse: "Quer revender o óleo e o hidratante na loja",
    valor: 1800,
    etapa: "novo",
    ultimoContato: "2026-11-10",
    aguardando: "voce",
    mensagens: [{ autor: "lead", texto: "Oi! Temos um empório em Campinas e adoramos os produtos. Vocês vendem para lojistas? Podem mandar o catálogo?", quando: "10/11, 16:20" }],
    sugestao: "Oi! Que bom que gostaram. Vendemos para lojistas, sim: mando o catálogo com os preços de revenda e o pedido mínimo. Cada produto sai com lote e cooperativa no rótulo, o que ajuda a contar a história na loja. Posso mandar umas amostras para vocês conhecerem?",
  },
  {
    id: "ld-2",
    nome: "Casa Vila",
    tipo: "lojista",
    origem: "whatsapp",
    cidade: "Ribeirão Preto, SP",
    interesse: "Pediu catálogo e condições para lojista",
    valor: 1200,
    etapa: "novo",
    ultimoContato: "2026-11-11",
    aguardando: "voce",
    mensagens: [{ autor: "lead", texto: "Boa tarde, vi vocês na feira. Qual o pedido mínimo para revenda?", quando: "11/11, 14:05" }],
    sugestao: "Boa tarde! Que bom que passou na feira. O pedido mínimo para revenda é de 24 unidades, misturando os produtos. Te mando o catálogo com os preços agora. Se quiser, levo pessoalmente, já que estamos na mesma cidade.",
  },
  {
    id: "ld-3",
    nome: "Clínica Bem-Estar",
    tipo: "empresa",
    origem: "indicacao",
    cidade: "Ribeirão Preto, SP",
    interesse: "40 kits de Natal para pacientes",
    valor: 3600,
    etapa: "orcamento",
    ultimoContato: "2026-11-09",
    aguardando: "lead",
    mensagens: [
      { autor: "lead", texto: "A Marina nos indicou. Precisamos de 40 kits de Natal para pacientes, entrega até 15/12.", quando: "6/11, 10:12" },
      { autor: "voce", texto: "Que bom! Mandei a proposta: 40 kits com cartão personalizado, R$ 90 cada, entrega no dia 12/12.", quando: "9/11, 09:40" },
    ],
    sugestao: "Oi! Passando para saber se a proposta dos 40 kits ficou clara. Para entregar no dia 12/12, preciso fechar até 20/11, porque o lote é pequeno. Posso ajudar com alguma dúvida?",
  },
  {
    id: "ld-4",
    nome: "Juliana Martins",
    tipo: "cliente",
    origem: "instagram",
    cidade: "São Carlos, SP",
    interesse: "Pele sensível: qual óleo usar?",
    etapa: "conversa",
    ultimoContato: "2026-11-12",
    aguardando: "voce",
    mensagens: [{ autor: "lead", texto: "Tenho pele sensível, o óleo de pequi pode irritar? Qual vocês indicam?", quando: "12/11, 08:51" }],
    sugestao: "Oi, Juliana! Para pele sensível, comece pelo óleo de baru: é mais leve e não tem perfume. Faça um teste no braço antes de usar no rosto. Se quiser, te mando o passo a passo de um minuto.",
  },
  {
    id: "ld-5",
    nome: "Lume Arquitetura",
    tipo: "empresa",
    origem: "site",
    cidade: "Campinas, SP",
    interesse: "20 kits de presente para a equipe",
    valor: 1700,
    etapa: "conversa",
    ultimoContato: "2026-11-08",
    aguardando: "voce",
    mensagens: [
      { autor: "lead", texto: "Queremos presentear a equipe. Vocês fazem kits com cartão personalizado? Entregam em Campinas?", quando: "7/11, 11:30" },
      { autor: "voce", texto: "Fazemos sim! Vou ver o frete para Campinas e te respondo.", quando: "8/11, 18:02" },
    ],
    sugestao: "Oi! Já tenho o frete para Campinas: R$ 38 para os 20 kits, entrega em 3 dias úteis. Cada kit sai por R$ 85, com cartão escrito à mão com o nome de cada pessoa. Quer que eu mande a proposta?",
  },
  {
    id: "ld-6",
    nome: "Mercado Bom Grão",
    tipo: "lojista",
    origem: "feira",
    cidade: "Franca, SP",
    interesse: "Conheceu na feira e quer amostras",
    valor: 900,
    etapa: "conversa",
    ultimoContato: "2026-11-11",
    aguardando: "lead",
    mensagens: [
      { autor: "lead", texto: "Gostei muito do sabonete. Consegue mandar amostras?", quando: "8/11, 09:15" },
      { autor: "voce", texto: "Consigo! Mandei pelo correio ontem, chega até segunda.", quando: "11/11, 17:30" },
    ],
  },
  {
    id: "ld-7",
    nome: "Armazém Cerrado",
    tipo: "lojista",
    origem: "indicacao",
    cidade: "Uberaba, MG",
    interesse: "Revende os três produtos desde outubro",
    valor: 1500,
    etapa: "cliente",
    ultimoContato: "2026-11-05",
    aguardando: "lead",
    mensagens: [{ autor: "lead", texto: "Vendeu tudo! Pode mandar mais 24 do hidratante.", quando: "5/11, 10:00" }],
  },
  {
    id: "ld-8",
    nome: "Patrícia Souza",
    tipo: "cliente",
    origem: "whatsapp",
    cidade: "Ribeirão Preto, SP",
    interesse: "Recompra do hidratante e um kit",
    valor: 162,
    etapa: "cliente",
    ultimoContato: "2026-11-10",
    aguardando: "lead",
    mensagens: [{ autor: "lead", texto: "Chegou certinho, obrigada!", quando: "10/11, 19:12" }],
  },
  {
    id: "ld-9",
    nome: "Natura Viva Empório",
    tipo: "lojista",
    origem: "site",
    cidade: "Araraquara, SP",
    interesse: "Revenda",
    etapa: "perdido",
    ultimoContato: "2026-10-28",
    aguardando: "lead",
    motivo: "Achou o preço de revenda alto para a cidade",
    mensagens: [{ autor: "lead", texto: "Obrigado, mas o preço não fecha para nós agora.", quando: "28/10, 15:44" }],
  },
]

/* ---------- Leitura da semana ---------- */

export const LEITURA_SEMANA = {
  titulo: "semana boa, bia",
  texto:
    "O alcance subiu 18%, puxado pelos posts de mãos e produto. Dois lojistas pediram catálogo e esperam resposta há mais de um dia. E a Botica do Cerrado lançou um kit de Natal a R$ 89.",
}

/** Temas que o Hattie usa para montar o calendário, por objetivo. */
export const TEMAS_POR_OBJETIVO: Record<string, { titulo: string; legenda: string; mensagem: string }[]> = {
  natal: [
    { titulo: "Um kit com origem", legenda: "Cada item do kit tem lote, cooperativa e um cartão escrito à mão.", mensagem: "Origem" },
    { titulo: "Presente que conta uma história", legenda: "Para quem você quer dar algo com cuidado de verdade.", mensagem: "Origem" },
    { titulo: "Cartão escrito à mão", legenda: "Você manda o recado, a gente escreve no cartão.", mensagem: "Lote pequeno" },
    { titulo: "Kits para a equipe", legenda: "Presentes para empresas, com entrega em vários endereços.", mensagem: "Rotina" },
    { titulo: "Últimos dias para receber antes do Natal", legenda: "Pedidos até 18/12 chegam a tempo.", mensagem: "Lote pequeno" },
    { titulo: "Bastidores dos kits", legenda: "Embrulhando um por um, em papel kraft.", mensagem: "Lote pequeno" },
    { titulo: "Amigo secreto de até R$ 90", legenda: "Três ideias de presente com origem, para todo bolso.", mensagem: "Origem" },
    { titulo: "O kit em 15 segundos", legenda: "Abrindo a caixa: o que vem dentro e de onde vem.", mensagem: "Origem" },
    { titulo: "Para quem cuida de todo mundo", legenda: "Um presente para a pessoa que nunca para.", mensagem: "Rotina" },
    { titulo: "Depoimento de quem já deu o kit", legenda: "A Marina conta como foi presentear com a Raiz Natural.", mensagem: "Origem" },
    { titulo: "Natal sem pressa", legenda: "Presente bom não precisa de contagem regressiva.", mensagem: "Lote pequeno" },
    { titulo: "Retrospectiva do ano na cooperativa", legenda: "Doze meses de colheita em um carrossel.", mensagem: "Origem" },
    { titulo: "Ritual de fim de ano", legenda: "Três gotas antes de dormir, para fechar o ano com calma.", mensagem: "Rotina" },
  ],
  lancamento: [
    { titulo: "Chegou o lote 13", legenda: "Novo lote, mesma cooperativa, colheita de novembro.", mensagem: "Lote pequeno" },
    { titulo: "Como usar em 3 gotas", legenda: "Um minuto da sua rotina.", mensagem: "Rotina" },
    { titulo: "De onde vem cada gota", legenda: "Lote, cooperativa e data da colheita no rótulo.", mensagem: "Origem" },
    { titulo: "Perguntas sobre o novo óleo", legenda: "As cinco dúvidas que mais chegaram.", mensagem: "Rotina" },
  ],
  seguidores: [
    { titulo: "Antes e depois de um mês", legenda: "O que muda na pele com o uso diário.", mensagem: "Rotina" },
    { titulo: "Um dia na cooperativa", legenda: "Quem colhe o pequi que vira o seu óleo.", mensagem: "Origem" },
    { titulo: "Enquete: qual é a sua rotina?", legenda: "Manhã ou noite? Conta pra gente.", mensagem: "Rotina" },
    { titulo: "Mito ou verdade", legenda: "Óleo deixa a pele oleosa?", mensagem: "Rotina" },
  ],
  lojistas: [
    { titulo: "Onde encontrar a Raiz Natural", legenda: "As lojas que já revendem, perto de você.", mensagem: "Origem" },
    { titulo: "Para lojistas: como funciona", legenda: "Pedido mínimo, prazos e material de apoio.", mensagem: "Lote pequeno" },
    { titulo: "A história que vai para a prateleira", legenda: "Cada frasco conta de onde veio.", mensagem: "Origem" },
  ],
}

export const IMAGENS_POST = [
  `${F}/fotografia/maos-oleo.jpg`,
  `${F}/fotografia/frasco-frutos.jpg`,
  `${F}/fotografia/kit.jpg`,
  `${F}/fotografia/bancada.jpg`,
  `${F}/fotografia/colheita.jpg`,
  `${F}/fotografia/janela.jpg`,
  `${F}/biblioteca/f-pequi-maos.jpg`,
  `${F}/mockups/3.jpg`,
]
