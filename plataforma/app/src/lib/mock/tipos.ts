export type Cor = { nome: string; hex: string; papel: string }

export type Pessoa = {
  nome: string
  sobrenome: string
  email: string
  plano: { nome: string; creditos: number; limite: number }
}

export type Marca = {
  slug: string
  nome: string
  segmento: string
  cidade: string
  paleta: Cor[]
  fontes: { display: string; texto: string }
}

export type StatusSecao = "pendente" | "aprovada"

export type ConteudoSecao =
  | { tipo: "texto"; texto: string }
  | { tipo: "blocos"; blocos: { titulo: string; texto: string }[] }
  | { tipo: "palavras"; palavras: string[] }
  | { tipo: "cores"; cores: Cor[] }
  | ({ tipo: "tipografia" } & GuiaTipografia)
  | { tipo: "fotografia"; estilos: EstiloFoto[] }
  | { tipo: "ilustracao"; estilos: EstiloFoto[] }
  | ({ tipo: "motion" } & GuiaMotion)
  | ({ tipo: "aplicacoes" } & GuiaAplicacoes)
  | ({ tipo: "logo" } & SistemaLogo)
  | { tipo: "imagens"; descricao: string; legendas: string[] }
  | { tipo: "publico"; macro: PublicoMacro; publicos: Publico[]; personas: Persona[] }
  | { tipo: "mercado"; referencias: Referencia[]; concorrentes: Concorrente[]; leituras: Record<TipoConcorrente, string>; painel: PainelMercado }
  | { tipo: "diferenciais"; principal: string; clusters: ClusterDiferencial[] }
  | { tipo: "nome"; processo: ProcessoNome; opcoes: OpcaoNome[] }
  | ({ tipo: "voz" } & GuiaVoz)
  | { tipo: "arquetipos"; mistura: string; primario: Arquetipo; secundario?: Arquetipo }
  | { tipo: "atributos"; resumo: string; atributos: Atributo[] }

export type Dado = { rotulo: string; valor: string }

/** Visão de cima: quem a marca atende, em uma frase e poucos números. */
export type PublicoMacro = { descricao: string; destaques: Dado[] }

/** Um recorte do macro, com dados de quem é (demografia) e de como pensa e vive (psicografia). */
export type Publico = {
  id: string
  nome: string
  descricao: string
  peso: string
  demografia: Dado[]
  psicografia: { titulo: string; itens: string[] }[]
  rascunho?: boolean
}

/** Persona: uma pessoa que representa um público, com o que ela quer, o que trava e como decide. */
export type Persona = {
  id: string
  publicoId: string
  nome: string
  idade: number
  ocupacao: string
  cidade: string
  frase: string
  historia: string
  objetivos: string[]
  dores: string[]
  motivacoes: string[]
  objecoes: string[]
  gatilhos: string[]
  canais: string[]
  referencias: string[]
  comoAjudamos: string
  mensagem: string
  rascunho?: boolean
}

/** Marca que inspira: citada pela pessoa no briefing ou sugerida pelo Hattie. */
export type Referencia = { id: string; nome: string; segmento: string; origem: "briefing" | "hattie"; levar: string; rascunho?: boolean }

export type TipoConcorrente = "direto" | "indireto"

/** Direto: vende o mesmo para a mesma pessoa. Indireto: resolve a mesma vontade de outro jeito. */
export type Concorrente = {
  id: string
  nome: string
  tipo: TipoConcorrente
  descricao: string
  preco: string
  onde: string
  forte: string
  brecha: string
  rascunho?: boolean
}

/** Indicador do painel: valor atual, variação em % contra 4 semanas atrás e 8 semanas de série. */
export type Indicador = { id: string; rotulo: string; valor: string; variacao: number; serie: number[]; unidade: string; nota: string }

export type InsightMercado = { id: string; tipo: "tendencia" | "oportunidade" | "atencao"; titulo: string; texto: string }

export type PainelMercado = { atualizado: string; proxima: string; semanas: string[]; indicadores: Indicador[]; insights: InsightMercado[] }

export type TipoCluster = "funcional" | "emocional" | "social" | "ambiental" | "economico"

export type Diferencial = { titulo: string; descricao: string; prova: string; forca: "forte" | "em construção" }

/** Cluster de diferenciais. Sem diferenciais, explica por que ficou de fora para esta marca. */
export type ClusterDiferencial = { id: TipoCluster; diferenciais: Diferencial[]; foraPorque?: string }

export type StatusChecagem = "livre" | "verificar" | "em uso"

/** Checagem de disponibilidade de um nome num canal (domínio, Instagram, INPI). */
export type Checagem = { canal: string; valor: string; status: StatusChecagem }

/** Uma opção de nome com o raciocínio por trás. */
export type OpcaoNome = {
  id: string
  nome: string
  territorio: string
  significado: string
  porque: string[]
  soa: string
  atencao?: string
  checagens: Checagem[]
  aposta?: boolean
  sugerida?: boolean
}

/** Como o Hattie chegou às opções: o que ouviu, os territórios, os critérios e o funil. */
export type ProcessoNome = {
  ouvi: string[]
  territorios: { nome: string; ideia: string }[]
  criterios: string[]
  funil: { gerados: number; passaram: number; finalistas: number }
}

export type TipoExemplo = "fala" | "post" | "legenda" | "cta" | "email"

/** Exemplo de comunicação. titulo: chamada do post ou assunto do e-mail. extra: hashtags ou assinatura. */
export type ExemploVoz = { id: string; tipo: TipoExemplo; situacao: string; texto: string; titulo?: string; extra?: string }

/** Guia de voz: como a marca fala, exemplos por canal, regras e vocabulário. */
export type GuiaVoz = {
  intro: string
  tracos: { nome: string; descricao: string }[]
  espectro: { esquerda: string; direita: string; valor: number }[]
  exemplos: ExemploVoz[]
  faca: { regra: string; exemplo: string }[]
  evite: { regra: string; exemplo: string }[]
  glossario: { termo: string; uso: string }[]
  proibidas: { palavra: string; troca: string; motivo: string }[]
}

/** Arquétipo de marca: o modelo geral e como esta marca vive dentro dele. peso: quanto da personalidade (%). */
export type Arquetipo = {
  id: string
  nome: string
  peso: number
  lema: string
  essencia: string
  motivacao: string
  desejo: string
  medo: string
  naMarca: string
  comportamentos: string[]
  exagero: string
}

/** Atributo de personalidade: nome, uma frase-título, o que significa e como aparece na marca. */
export type Atributo = {
  id: string
  nome: string
  titulo: string
  significado: string
  naMarca: string
  ondeSeVe: { onde: string; como: string }[]
  arquetipo?: string
}

export type SimboloLogo = "gota" | "selo" | "monograma"

/** Ideia de logo apresentada antes da geração. */
export type IdeiaLogo = { id: string; nome: string; simbolo: SimboloLogo; conceito: string; porque: string[]; aposta?: boolean }

export type ErroLogo = "esticar" | "girar" | "cor" | "sombra" | "contraste" | "separar"

/** Briefing, ideias, regras de uso e espaçamento do logo. As versões de cor saem da paleta da marca. */
export type SistemaLogo = {
  briefing: { conceito: string; palavras: string[]; referencias: string[]; evitar: string[]; usos: string[] }
  ideias: IdeiaLogo[]
  regras: { faca: string[]; evite: { tipo: ErroLogo; texto: string }[] }
  espacamento: { protecao: string; minimos: { versao: string; digital: string; impresso: string }[] }
}

export type PapelFonte = "display" | "texto" | "sistema"

/** Fonte de uma combinação: família do Google Fonts, categoria, pesos usados e para que serve. */
export type FonteMarca = { familia: string; categoria: "serif" | "sans-serif" | "display" | "monospace"; pesos: number[]; uso: string }

export type CombinacaoTipografica = {
  id: string
  nome: string
  ideia: string
  display: FonteMarca
  texto: FonteMarca
  sistema: FonteMarca
  porque: string[]
  aposta?: boolean
}

/** Estilo do sistema tipográfico. Tamanhos em px; entrelinha em px; espaçamento entre letras em %. */
export type EstiloTipografico = {
  id: string
  nome: string
  papel: PapelFonte
  peso: number
  tela: { tamanho: number; linha: number }
  celular: { tamanho: number; linha: number }
  letras: number
  caixa?: "normal" | "alta"
  uso: string
  exemplo: string
}

export type GuiaTipografia = {
  frase: string
  paragrafo: string
  combinacoes: CombinacaoTipografica[]
  estilos: EstiloTipografico[]
  regras: { titulo: string; texto: string }[]
}

/** Camadas da fotografia (cor, luz, câmera, sujeitos, ambiente, acabamento) e da ilustração (cor, traço, forma, textura, figuras, composição). */
export type IdCamadaFoto = "cor" | "luz" | "camera" | "sujeitos" | "ambiente" | "acabamento" | "traco" | "forma" | "textura" | "figuras" | "composicao"

/** Desenhos de exemplo da ilustração. */
export type DesenhoIlustracao = "pequi" | "baru" | "buriti" | "paisagem" | "frasco" | "padrao"

/** Uma camada do estilo fotográfico (playbook de imagens de marca): campos de rótulo e valor, paleta e proibidos. */
export type CamadaFoto = {
  id: IdCamadaFoto
  titulo: string
  pergunta: string
  campos: { rotulo: string; valor: string }[]
  paleta?: { nome: string; hex: string }[]
  proibidos?: string[]
}

/** Imagem de exemplo gerada no estilo, com a nota de 1 a 5 em cada camada (ordem de IdCamadaFoto). */
export type ImagemFoto = {
  id: string
  cena: string
  enquadramento: string
  notas: number[]
  fundo: string
  luz: string
  borda: "left" | "right" | "top" | "bottom"
  /** Só na ilustração: qual desenho de exemplo mostrar. */
  desenho?: DesenhoIlustracao
}

/** Estilo fotográfico: o registro emocional, as seis camadas, o que evitar e as imagens de exemplo. */
export type EstiloFoto = {
  id: string
  nome: string
  uso: string
  registro: string
  descricao?: string
  referencias?: { id: string; nome: string; url: string }[]
  status: "briefing" | "pronto"
  camadas: CamadaFoto[]
  evitar: string[]
  imagens: ImagemFoto[]
  desatualizado?: boolean
}

export type AcaoExtra = { rotulo: string; icone: "download" | "copiar" }

export type Secao = {
  id: string
  titulo: string
  grupo: string
  resumo: string
  porque: string
  conteudo: ConteudoSecao
  extra?: AcaoExtra
}

export type GrupoCerebro = { id: string; titulo: string }

export type PassoPlano = {
  id: string
  titulo: string
  tipo: "base" | "adicional"
  pergunta: string
  sugestoes: string[]
}

export type StatusPasso = "pendente" | "atual" | "respondido" | "pulado"

export type Mensagem = { id: string; autor: "hattie" | "pessoa"; texto: string; anexos?: string[] }

export type Conversa = { id: string; titulo: string; quando: string }

/** Projeto da marca. As tarefas abertas podem ser atribuídas a um parceiro na janela de contratar. */
export type Projeto = { id: string; nome: string; editado: string; tarefas?: string[] }

export type Categoria = { id: string; rotulo: string; icone: string; emBreve?: boolean }

export type Modelo = { id: string; categoria: string; titulo: string; descricao: string; pedido: string }

/* ---------- Motion ---------- */

/** Curva de aceleração em cubic-bezier (x1, y1, x2, y2). */
export type CurvaMotion = { id: string; nome: string; valores: [number, number, number, number]; uso: string; sensacao: string; fora?: boolean }
export type DuracaoMotion = { id: string; nome: string; ms: number; uso: string }
export type MedidaMotion = { nome: string; valor: string; uso: string }
export type EfeitoMotion = "letras" | "palavras" | "linhas" | "desfoque" | "mascara" | "escala" | "logo" | "story" | "lista"
export type ExemploMotion = {
  id: string
  grupo: "texto" | "imagem" | "marca" | "peca"
  titulo: string
  descricao: string
  efeito: EfeitoMotion
  texto?: string
  duracao: number
  curva: string
  intervalo?: number
  deslocamento?: number
}
export type PassoCoreografia = { elemento: string; inicio: number; duracao: number; curva: string }
export type GuiaMotion = {
  conceito: string
  resumo: { rotulo: string; valor: string }[]
  principios: { titulo: string; texto: string; numero: string }[]
  curvas: CurvaMotion[]
  duracoes: DuracaoMotion[]
  distancias: MedidaMotion[]
  cadencia: MedidaMotion[]
  coreografia: PassoCoreografia[]
  exemplos: ExemploMotion[]
  faca: string[]
  evite: string[]
  acessibilidade: string[]
}

/* ---------- Aplicações ---------- */

export type LayoutPeca = "foto-cheia" | "tipografico" | "dividido" | "grafismo" | "ilustracao" | "oferta" | "citacao" | "lote" | "gradiente" | "moldura" | "padrao" | "carimbo"
export type RecursoPeca = "logo" | "cores" | "tipografia" | "fotografia" | "ilustracao" | "grafismos" | "gradiente"
export type ExemploPeca = {
  id: string
  nome: string
  layout: LayoutPeca
  sobretitulo?: string
  titulo: string
  texto?: string
  cta?: string
  destaque?: string
  recursos: RecursoPeca[]
}
export type FormatoPeca = {
  id: string
  nome: string
  grupo: "Redes sociais" | "Digital" | "Impresso"
  medida: string
  proporcao: [number, number]
  margem: string
  colunas: number
  /** Área que a interface da rede cobre, em % da altura, no topo e na base. */
  zonaSegura?: { texto: string; topo: number; base: number }
  titulo: string
  regras: string[]
  exemplos: ExemploPeca[]
}
export type SuporteMockup = "frasco" | "sacola" | "cartao" | "etiqueta" | "perfil" | "site"
export type MockupMarca = { id: string; nome: string; suporte: SuporteMockup; descricao: string; especificacao: string }
export type GuiaAplicacoes = {
  regras: { titulo: string; texto: string; numero: string }[]
  mockups: MockupMarca[]
  formatos: FormatoPeca[]
  exploracoes: (ExemploPeca & { ideia: string })[]
}
