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
