/**
 * Pedido levado de um ponto da marca até a área de parceiros. Fica na sessão do navegador
 * até a página de contratar ler e preencher o pedido.
 */
const CHAVE = "hattie:pedido-parceiro"

export function guardarPedidoParceiro(texto: string) {
  try {
    sessionStorage.setItem(CHAVE, texto)
  } catch {
    // Sem armazenamento: a pessoa chega em Parceiros com o campo vazio.
  }
}

export function lerPedidoParceiro() {
  try {
    return sessionStorage.getItem(CHAVE)
  } catch {
    return null
  }
}

/** Apaga o pedido depois de usado, para não voltar na próxima visita. */
export function esquecerPedidoParceiro() {
  try {
    sessionStorage.removeItem(CHAVE)
  } catch {
    // Nada guardado.
  }
}
