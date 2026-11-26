"use client"

import type { Route } from "next"
import { useSyncExternalStore } from "react"

/**
 * Acesso da banca: versão reduzida da plataforma para os avaliadores do TCC.
 * Liga pelo botão do mapa das telas e fica guardada neste navegador até sair pelo mesmo botão.
 * Liberado: entrada, primeiro acesso, conversa de criação, criando, escolhas, olha como ficou,
 * cérebro da marca e parceiros (contratar, perfil e mensagens). O resto aparece com cadeado.
 */
const CHAVE = "hattie-banca"
const EVENTO = "hattie-banca"

function ler() {
  try {
    return window.localStorage.getItem(CHAVE) === "1"
  } catch {
    return false
  }
}

function assinar(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener("storage", aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener("storage", aviso)
  }
}

export function useBanca() {
  return useSyncExternalStore(assinar, ler, () => false)
}

export function definirBanca(ligado: boolean) {
  try {
    if (ligado) window.localStorage.setItem(CHAVE, "1")
    else window.localStorage.removeItem(CHAVE)
  } catch {}
  window.dispatchEvent(new Event(EVENTO))
}

const LIVRES_FORA_DA_MARCA = ["/", "/criar-conta", "/entrar", "/comecar", "/jornada"]
const LIVRES_NA_MARCA = [/^hattie$/, /^hattie\/criacao$/, /^criando$/, /^escolhas$/, /^pronta$/, /^cerebro(\/.*)?$/, /^parceiros$/, /^parceiros\/perfil\/.+$/, /^parceiros\/mensagens(\/.*)?$/]

/** Diz se o caminho fica fechado no acesso da banca. */
export function fechadoNaBanca(caminho: string) {
  const limpo = caminho.replace(/\/+$/, "") || "/"
  const marca = limpo.match(/^\/marca\/[^/]+(?:\/(.*))?$/)
  if (marca) {
    const resto = marca[1] ?? ""
    return !LIVRES_NA_MARCA.some((regra) => regra.test(resto))
  }
  return !LIVRES_FORA_DA_MARCA.includes(limpo)
}

/** Para onde a banca volta quando cai numa área fechada: o cérebro da marca. */
export const inicioDaBanca = (slug: string) => `/marca/${slug}/cerebro` as Route

/**
 * Atributos de um link fechado na banca: fica à vista, sem clique e fora do Tab.
 * Usar com as classes aria-disabled:pointer-events-none e um tom apagado.
 */
export function fechar(fechado: boolean) {
  return fechado ? ({ "aria-disabled": true, tabIndex: -1, title: "Na versão completa", onClick: (evento: { preventDefault: () => void }) => evento.preventDefault() } as const) : {}
}
