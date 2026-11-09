import Image from "next/image"
import Link from "next/link"
import type { Route } from "next"
import { Plus } from "lucide-react"
import { MARCAS, PESSOA } from "@/lib/mock"

export default function MinhasMarcas() {
  return (
    <div className="flex min-h-svh flex-col bg-background px-4 py-6 md:px-10">
      <Link href="/marca/raiz-natural" aria-label="Hattie, início" className="self-start">
        <Image src="/logos/hattie-logomarca.svg" alt="" width={160} height={34} priority className="h-8 w-auto" />
      </Link>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-[32px] leading-[1.05] font-medium tracking-[-0.02em] lowercase md:text-[38px]">
            suas marcas
          </h1>
          <p className="text-ink-soft">
            {PESSOA.nome}, o seu plano comporta 3 marcas. Você usa {MARCAS.length}.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARCAS.map((marca) => (
            <li key={marca.slug}>
              <Link
                href={`/marca/${marca.slug}` as Route}
                className="flex h-full flex-col overflow-hidden rounded-[28px] bg-branco outline-offset-2 transition-[box-shadow] duration-150 hover:shadow-[0_0_0_2px_var(--ink)]"
              >
                <span className="flex h-24" aria-hidden>
                  {marca.paleta.map((cor) => (
                    <span key={cor.hex} className="flex-1" style={{ backgroundColor: cor.hex }} />
                  ))}
                </span>
                <span className="flex flex-col gap-1 p-5">
                  <span className="font-heading text-[21px] leading-tight font-medium">{marca.nome}</span>
                  <span className="text-ink-soft">
                    {marca.segmento} · {marca.cidade}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/comecar"
              className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-cinza p-5 text-sm text-center transition-[background-color,border-color] duration-150 hover:border-ink hover:bg-ink/6"
            >
              <span className="grid size-12 place-items-center rounded-full bg-lima">
                <Plus className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <span className="font-medium">Nova marca</span>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  )
}
