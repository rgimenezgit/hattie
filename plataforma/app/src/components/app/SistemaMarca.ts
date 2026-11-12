"use client"

import { useFontesGoogle } from "@/lib/usarFonteGoogle"
import { getSecao, type CombinacaoTipografica, type EstiloFoto, type EstiloTipografico, type SimboloLogo, type StatusSecao } from "@/lib/mock"
import { useEstado } from "./Estado"
import type { CoresDesenho } from "./Ilustracao"
import { useMarca } from "./MarcaContexto"

export type SistemaMarca = {
  nome: string
  cores: CoresDesenho
  paleta: { nome: string; hex: string }[]
  combinacao: CombinacaoTipografica
  estilosTipo: EstiloTipografico[]
  fonte: { display: string; texto: string; sistema: string }
  simbolo: SimboloLogo
  estiloFoto?: EstiloFoto
  estiloIlustracao?: EstiloFoto
  /** Situação de cada diretriz que alimenta as peças: aprovada, escolhida ou ainda a proposta do Hattie. */
  fontes: { id: string; titulo: string; detalhe: string; status: StatusSecao; definida: boolean }[]
}

const pilha = (familia: string, categoria: string) => `"${familia}", ${categoria === "monospace" ? "ui-monospace, monospace" : categoria === "serif" ? "Georgia, serif" : "system-ui, sans-serif"}`

/**
 * Junta as diretrizes que já existem no cérebro de marca para as seções que aplicam a marca (motion, aplicações):
 * paleta, combinação tipográfica (escolhida ou a aposta), símbolo do logo, estilos de foto e de ilustração.
 * Também carrega as fontes do Google usadas na combinação.
 */
export function useSistemaMarca(): SistemaMarca {
  const marca = useMarca()
  const { nomeMarca, secoes, logoEscolhido, tipografiaEscolhida, estilosFoto, estilosIlustracao } = useEstado()

  const tipografia = getSecao("tipografia")?.conteudo
  const guiaTipo = tipografia?.tipo === "tipografia" ? tipografia : undefined
  const combinacao = (guiaTipo?.combinacoes.find((item) => item.id === tipografiaEscolhida) ?? guiaTipo?.combinacoes.find((item) => item.aposta) ?? guiaTipo?.combinacoes[0])!

  const logo = getSecao("logo")?.conteudo
  const ideias = logo?.tipo === "logo" ? logo.ideias : []
  const ideia = ideias.find((item) => item.id === logoEscolhido) ?? ideias.find((item) => item.aposta) ?? ideias[0]

  const foto = getSecao("fotografia")?.conteudo
  const estiloFoto = estilosFoto?.[0] ?? (foto?.tipo === "fotografia" ? foto.estilos[0] : undefined)
  const ilustracao = getSecao("ilustracao")?.conteudo
  const estiloIlustracao = estilosIlustracao?.[0] ?? (ilustracao?.tipo === "ilustracao" ? ilustracao.estilos[0] : undefined)

  const paleta = marca.paleta
  const destaque = estiloFoto?.camadas.find((camada) => camada.id === "cor")?.paleta?.[4]
  const cores: CoresDesenho = {
    principal: paleta[0].hex,
    apoio: paleta[1]?.hex ?? paleta[0].hex,
    fundo: paleta[2]?.hex ?? "#F5F5F5",
    escuro: paleta[3]?.hex ?? paleta[0].hex,
    destaque: destaque?.hex ?? paleta[1]?.hex ?? paleta[0].hex,
  }

  useFontesGoogle(combinacao ? [combinacao.display, combinacao.texto, combinacao.sistema].map((fonte) => ({ familia: fonte.familia, pesos: fonte.pesos })) : [])

  const status = (id: string): StatusSecao => secoes[id] ?? "pendente"
  return {
    nome: nomeMarca,
    cores,
    paleta: destaque ? [...paleta, destaque] : paleta,
    combinacao,
    estilosTipo: guiaTipo?.estilos ?? [],
    fonte: {
      display: pilha(combinacao.display.familia, combinacao.display.categoria),
      texto: pilha(combinacao.texto.familia, combinacao.texto.categoria),
      sistema: pilha(combinacao.sistema.familia, combinacao.sistema.categoria),
    },
    simbolo: ideia?.simbolo ?? "gota",
    estiloFoto,
    estiloIlustracao,
    fontes: [
      { id: "logo", titulo: "Logo", detalhe: ideia?.nome ?? "A definir", status: status("logo"), definida: Boolean(logoEscolhido) },
      { id: "cores", titulo: "Cores", detalhe: paleta.map((cor) => cor.nome).join(", "), status: status("cores"), definida: false },
      { id: "tipografia", titulo: "Tipografia", detalhe: `${combinacao.display.familia} + ${combinacao.texto.familia}`, status: status("tipografia"), definida: Boolean(tipografiaEscolhida) },
      { id: "grafismos", titulo: "Grafismos", detalhe: "Linhas de folha e carimbo de lote", status: status("grafismos"), definida: false },
      { id: "fotografia", titulo: "Estilo fotográfico", detalhe: estiloFoto?.nome ?? "A definir", status: status("fotografia"), definida: estiloFoto?.status === "pronto" },
      { id: "ilustracao", titulo: "Ilustração", detalhe: estiloIlustracao?.nome ?? "A definir", status: status("ilustracao"), definida: estiloIlustracao?.status === "pronto" },
      { id: "movimento", titulo: "Motion", detalhe: "Assentar, 400 ms", status: status("movimento"), definida: false },
    ],
  }
}
