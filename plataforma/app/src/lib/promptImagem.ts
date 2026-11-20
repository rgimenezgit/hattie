import { getSecao, type EstiloFoto } from "@/lib/mock"

/*
 * Monta o pedido que vai para o modelo de imagem: o que a pessoa escreveu, mais o estilo da marca
 * que está no cérebro (cor com hex, luz, câmera, o que evitar). É o cérebro que faz a imagem sair
 * com a cara da marca sem a pessoa precisar descrever isso toda vez.
 */

const TIPOS_PRONTOS: Record<string, string> = {
  "Fotografia de produto": "Fotografia de produto: o produto é o assunto, nítido e em primeiro plano, com fundo simples e poucos elementos em volta.",
  "Produto em cena": "Produto em cena: o produto aparece num ambiente real, com objetos e ingredientes que contam de onde ele vem.",
  "Pessoas e mãos": "Pessoas e mãos: alguém usando o produto, com foco nas mãos e no gesto; rosto fora de quadro ou de perfil.",
  "Fundo de uma cor": "Produto sobre um fundo liso de uma cor só da paleta da marca, luz suave e sombra curta.",
}

function estilosDe(secao: "fotografia" | "ilustracao"): EstiloFoto[] {
  const conteudo = getSecao(secao)?.conteudo
  return conteudo?.tipo === secao ? conteudo.estilos : []
}

function descrever(estilo: EstiloFoto) {
  const linhas = [`${estilo.registro}`]
  if (estilo.descricao) linhas.push(estilo.descricao)
  for (const camada of estilo.camadas) {
    const campos = camada.campos.map((campo) => `${campo.rotulo.toLowerCase()}: ${campo.valor.toLowerCase()}`).join("; ")
    linhas.push(`${camada.titulo}: ${campos}.`)
    if (camada.paleta?.length) linhas.push(`Paleta: ${camada.paleta.map((cor) => `${cor.nome} ${cor.hex}`).join(", ")}.`)
    if (camada.proibidos?.length) linhas.push(`Nunca usar: ${camada.proibidos.join(", ").toLowerCase()}.`)
  }
  if (estilo.evitar.length) linhas.push(`Evitar: ${estilo.evitar.join("; ").toLowerCase()}.`)
  return linhas.join("\n")
}

export type PedidoImagem = {
  pedido: string
  /** Nome do estilo escolhido na barra de geração: um estilo da marca ou um tipo pronto. */
  estilo?: string
  marca: string
}

/** Texto completo para o modelo. Sem texto escrito na imagem, a não ser que a pessoa peça. */
export function montarPromptImagem({ pedido, estilo, marca }: PedidoImagem) {
  const nome = estilo?.replace(/^Ilustração:\s*/, "") ?? ""
  const ilustracao = estilo?.startsWith("Ilustração:") ?? false
  const daMarca = (ilustracao ? estilosDe("ilustracao") : estilosDe("fotografia")).find((item) => item.nome === nome)
  // Um tipo pronto ainda segue o estilo de fotografia principal da marca.
  const base = daMarca ?? (ilustracao ? estilosDe("ilustracao")[0] : estilosDe("fotografia")[0])
  const partes = [
    `${ilustracao ? "Ilustração" : "Fotografia"} para a marca ${marca}.`,
    `Pedido: ${pedido}`,
    estilo && TIPOS_PRONTOS[estilo] ? TIPOS_PRONTOS[estilo] : null,
    base ? `Estilo da marca (${base.nome}):\n${descrever(base)}` : null,
    "Sem texto, letras, logotipos ou marcas d'água na imagem, a não ser que o pedido peça.",
  ]
  return partes.filter(Boolean).join("\n\n")
}
