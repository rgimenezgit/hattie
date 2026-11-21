/*
 * Links de site ou perfil que a pessoa cola (referências, concorrentes).
 * Aceita "aesop.com", "www.aesop.com/br", "https://…" e "@perfil" (vira Instagram).
 */

/** Devolve o link completo, com https, ou null quando o texto não parece um link. */
export function normalizarLink(texto: string): string | null {
  const limpo = texto.trim()
  if (!limpo) return null
  const comProtocolo = limpo.startsWith("@")
    ? `https://instagram.com/${limpo.slice(1)}`
    : /^https?:\/\//i.test(limpo)
      ? limpo
      : `https://${limpo}`
  try {
    const url = new URL(comProtocolo)
    return url.hostname.includes(".") ? url.toString() : null
  } catch {
    return null
  }
}

/** Versão curta para mostrar: "aesop.com" ou "instagram.com/aesop". */
export function exibirLink(link: string): string {
  try {
    const url = new URL(link)
    const caminho = url.pathname.replace(/\/$/, "")
    return `${url.hostname.replace(/^www\./, "")}${caminho}`
  } catch {
    return link
  }
}

/** Nome provável da marca a partir do link: o perfil nas redes ou o domínio ("Aesop"). */
export function nomeDoLink(link: string): string {
  try {
    const url = new URL(link)
    const host = url.hostname.replace(/^www\./, "")
    const perfil = /(instagram|tiktok|facebook|linkedin)\./.test(host) ? url.pathname.split("/").filter(Boolean).pop() : null
    const base = (perfil ?? host.split(".")[0]).replace(/^@/, "").replace(/[-_.]+/g, " ")
    return base.charAt(0).toUpperCase() + base.slice(1)
  } catch {
    return link
  }
}
