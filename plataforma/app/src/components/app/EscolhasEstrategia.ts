"use client"

import { PALAVRAS_PERSONALIDADE, type ClusterDiferencial, type TracoPersonalidade } from "@/lib/mock"
import { useEstado } from "./Estado"

/**
 * O que a pessoa escolheu na primeira escolha de estratégia, para o cérebro e o "olha como ficou".
 * Sem escolha (marcas que não passaram por ela), valem as propostas do Hattie.
 */

/** As palavras de personalidade escolhidas, na ordem da lista, com as que a pessoa escreveu no fim. */
export function usePersonalidadeEscolhida(propostas: TracoPersonalidade[]): TracoPersonalidade[] {
  const { personalidadeEscolhida } = useEstado()
  if (!personalidadeEscolhida) return propostas
  const escolhidas = PALAVRAS_PERSONALIDADE.filter((palavra) => personalidadeEscolhida.ids.includes(palavra.id))
  return [...escolhidas, ...personalidadeEscolhida.proprias]
}

/** As frentes de diferencial só com os escolhidos; os que a pessoa escreveu entram como funcionais, em construção. */
export function useDiferenciaisEscolhidos(clusters: ClusterDiferencial[]): ClusterDiferencial[] {
  const { diferenciaisEscolhidos } = useEstado()
  if (!diferenciaisEscolhidos) return clusters
  return clusters.map((cluster) => {
    if (cluster.foraPorque) return cluster
    const escolhidos = cluster.diferenciais.filter((diferencial) => diferenciaisEscolhidos.ids.includes(diferencial.titulo))
    return { ...cluster, diferenciais: cluster.id === "funcional" ? [...escolhidos, ...diferenciaisEscolhidos.proprios] : escolhidos }
  })
}
