"use client"

import Link from "next/link"
import { useEffect, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Botao } from "@/components/hattie/Botao"
import { definirBanca, fechadoNaBanca, inicioDaBanca, useBanca } from "@/lib/banca"

function slugDe(caminho: string) {
  return caminho.match(/^\/marca\/([^/]+)/)?.[1] ?? "raiz-natural"
}

/**
 * Portão do acesso da banca, no layout raiz. Os links para áreas fechadas já ficam desativados;
 * se alguém digitar o endereço de uma delas, volta direto para o cérebro da marca.
 */
export function PortaoBanca({ children }: { children: ReactNode }) {
  const banca = useBanca()
  const caminho = usePathname()
  const router = useRouter()
  const fechado = banca && fechadoNaBanca(caminho)

  useEffect(() => {
    if (fechado) router.replace(inicioDaBanca(slugDe(caminho)))
  }, [fechado, caminho, router])

  return fechado ? null : children
}

/** Cartão do mapa das telas que liga e desliga o acesso da banca neste navegador. */
export function CartaoBanca() {
  const banca = useBanca()
  const router = useRouter()

  if (!banca) {
    return (
      <button
        type="button"
        onClick={() => {
          definirBanca(true)
          router.push("/criar-conta")
        }}
        className="flex items-center justify-between gap-4 rounded-2xl bg-lima px-5 py-4 text-start text-preto transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)"
      >
        <span className="flex flex-col gap-0.5">
          <span className="font-heading text-titulo-3 font-medium lowercase">acesso da banca</span>
          <span className="text-sm text-preto/75">
            Versão reduzida: criar conta, criar a marca, aprovar no cérebro e chamar um parceiro. As outras áreas aparecem com cadeado.
          </span>
        </span>
        <span aria-hidden className="shrink-0">→</span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-lima px-5 py-4 text-preto sm:flex-row sm:items-center sm:justify-between">
      <span className="flex flex-col gap-0.5">
        <span className="font-heading text-titulo-3 font-medium lowercase">acesso da banca ligado</span>
        <span className="text-sm text-preto/75">Neste navegador, as áreas fora da apresentação aparecem com cadeado.</span>
      </span>
      <span className="flex shrink-0 gap-2">
        <Botao variante="fantasma" className="text-preto hover:bg-preto/10 hover:text-preto" onClick={() => definirBanca(false)}>
          Sair do acesso
        </Botao>
        <Link href="/criar-conta" className="inline-flex h-10 items-center rounded-full bg-preto px-4 text-sm font-medium text-lima transition-[background-color] duration-150 hover:bg-grafite">
          Começar
        </Link>
      </span>
    </div>
  )
}
