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
  | { tipo: "persona"; nome: string; idade: number; descricao: string; habitos: string[] }

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
