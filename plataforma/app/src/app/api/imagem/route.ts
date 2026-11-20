import { montarPromptImagem } from "@/lib/promptImagem"

/**
 * Geração de imagem de verdade, com a fal.ai (modelo Nano Banana 2; a versão "edit" quando há imagem de referência).
 * A chave FAL_KEY fica só no servidor (arquivo .env.local) e nunca vai para o navegador.
 *
 * POST { pedido, marca, estilo?, proporcao?, resolucao?, quantidade?, referencias? } → { imagens: [{ url, largura, altura }] }
 *
 * - Sem a chave, responde 503 { erro: "sem-chave" } e o app segue com as imagens de exemplo.
 * - Publicado, fica desligado, para ninguém gastar os créditos de quem publicou. FAL_PUBLICO=sim liga de propósito.
 */

const MODELO = "fal-ai/nano-banana-2"
const PROPORCOES = ["1:1", "4:5", "3:4", "2:3", "16:9", "9:16", "4:3", "3:2"]
const RESOLUCOES = ["1K", "2K", "4K"]

type Entrada = {
  pedido?: unknown
  marca?: unknown
  estilo?: unknown
  proporcao?: unknown
  resolucao?: unknown
  quantidade?: unknown
  referencias?: unknown
}

type ImagemFal = { url: string; width?: number | null; height?: number | null }

const erro = (codigo: string, status: number, detalhe?: string) => Response.json({ erro: codigo, detalhe }, { status })

export async function POST(requisicao: Request) {
  const chave = process.env.FAL_KEY
  if (!chave) return erro("sem-chave", 503)
  if (process.env.NODE_ENV === "production" && process.env.FAL_PUBLICO !== "sim") return erro("desligado", 403)

  let entrada: Entrada
  try {
    entrada = (await requisicao.json()) as Entrada
  } catch {
    return erro("pedido-invalido", 400)
  }

  const pedido = typeof entrada.pedido === "string" ? entrada.pedido.trim().slice(0, 1200) : ""
  if (!pedido) return erro("pedido-vazio", 400)
  const marca = typeof entrada.marca === "string" ? entrada.marca.slice(0, 80) : "a marca"
  const estilo = typeof entrada.estilo === "string" ? entrada.estilo.slice(0, 80) : undefined
  const proporcao = typeof entrada.proporcao === "string" && PROPORCOES.includes(entrada.proporcao) ? entrada.proporcao : "4:5"
  const resolucao = typeof entrada.resolucao === "string" && RESOLUCOES.includes(entrada.resolucao) ? entrada.resolucao : "1K"
  const quantidade = Math.min(4, Math.max(1, Number(entrada.quantidade) || 1))
  // Referências: endereços http(s) ou imagens embutidas (data:), no máximo três.
  const referencias = Array.isArray(entrada.referencias)
    ? entrada.referencias.filter((item): item is string => typeof item === "string" && /^(https:\/\/|data:image\/)/.test(item)).slice(0, 3)
    : []

  const corpo: Record<string, unknown> = {
    prompt: montarPromptImagem({ pedido, estilo, marca }),
    aspect_ratio: proporcao,
    resolution: resolucao,
    num_images: quantidade,
    output_format: "jpeg",
  }
  if (referencias.length) corpo.image_urls = referencias

  try {
    const resposta = await fetch(`https://fal.run/${MODELO}${referencias.length ? "/edit" : ""}`, {
      method: "POST",
      headers: { Authorization: `Key ${chave}`, "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: AbortSignal.timeout(170_000),
    })
    if (!resposta.ok) {
      const texto = await resposta.text().catch(() => "")
      // 401 e 403: chave errada ou sem saldo. O detalhe ajuda a entender, sem expor a chave.
      return erro(resposta.status === 401 || resposta.status === 403 ? "chave-recusada" : "falhou", 502, texto.slice(0, 300))
    }
    const dados = (await resposta.json()) as { images?: ImagemFal[] }
    const imagens = (dados.images ?? []).filter((imagem) => typeof imagem.url === "string").map((imagem) => ({ url: imagem.url, largura: imagem.width ?? null, altura: imagem.height ?? null }))
    if (imagens.length === 0) return erro("sem-imagem", 502)
    return Response.json({ imagens })
  } catch (falha) {
    return erro(falha instanceof Error && falha.name === "TimeoutError" ? "demorou" : "falhou", 504)
  }
}
