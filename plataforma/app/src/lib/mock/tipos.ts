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
  | { tipo: "tipografia"; display: string; texto: string; amostra: string }
  | { tipo: "logo"; descricao: string; opcoes: string[] }
  | { tipo: "imagens"; descricao: string; legendas: string[] }
  | { tipo: "publico"; macro: PublicoMacro; publicos: Publico[]; personas: Persona[] }
  | { tipo: "mercado"; referencias: Referencia[]; concorrentes: Concorrente[]; leituras: Record<TipoConcorrente, string>; painel: PainelMercado }
  | { tipo: "diferenciais"; principal: string; clusters: ClusterDiferencial[] }

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

export type Projeto = { id: string; nome: string; editado: string }

export type Categoria = { id: string; rotulo: string; icone: string; emBreve?: boolean }

export type Modelo = { id: string; categoria: string; titulo: string; descricao: string; pedido: string }
