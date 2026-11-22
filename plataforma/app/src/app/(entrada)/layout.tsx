import Image from "next/image"
import Link from "next/link"
import { CampoMagico } from "@/components/hattie/CampoMagico"
import { SeloSom } from "@/components/hattie/SeloSom"

/**
 * Entrada (criar conta e entrar): formulário à esquerda e, à direita, o painel lilás #B19DFC com o Hattie.
 * Cabe na altura da janela: se a tela for baixa, só a coluna do formulário rola.
 * O painel segue a escala das faíscas da marca: pontos violeta #7F3AEF que viram mais, brilho e asterisco lima #E6F344
 * nas manchas que fluem pelo card, no rastro do mouse e na onda do clique.
 */
export default function LayoutDeEntrada({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-background p-2 lg:h-svh lg:grid-cols-[1fr_minmax(0,0.85fr)] lg:gap-6 lg:p-3">
      <main className="flex min-h-0 flex-col overflow-y-auto px-4 py-8 lg:px-10 lg:py-6">
        <div className="mx-auto my-auto flex w-full max-w-sm flex-col gap-8 [@media(max-height:880px)]:gap-5">
          <Link href="/" aria-label="Hattie" className="self-center">
            <Image src="/logos/hattie-logomarca.svg" alt="" width={240} height={52} priority className="h-9 w-auto [@media(max-height:880px)]:h-8" />
          </Link>
          {children}
        </div>
      </main>

      <aside aria-hidden className="group/palco relative hidden min-h-0 flex-col overflow-hidden rounded-[32px] bg-lilas p-10 lg:flex">
        <CampoMagico cores={{ ponto: "--violeta", mais: "--violeta", brilho: "--lima", asterisco: "--lima" }} ambiente="fluxo" presenca="base" espaco={36} />
        <div className="pointer-events-none relative z-10 flex max-w-md flex-col gap-6">
          <SeloSom som="plimm" fixo className="self-start" />
          <p className="font-heading text-titulo-1 font-medium text-lima lowercase xl:text-display [@media(max-height:760px)]:text-titulo-1">
            já tirei muitas marcas do chapéu. bora tirar a sua?
          </p>
        </div>
        <Image
          src="/logos/hattie-simbolo.svg"
          alt=""
          width={1553}
          height={1024}
          className="pointer-events-none relative z-10 mt-auto w-[72%] max-w-[480px] self-end transition-[translate,rotate] duration-500 ease-(--ease-mola) group-hover/palco:-translate-y-2 group-hover/palco:-rotate-2 motion-reduce:transition-none"
        />
      </aside>
    </div>
  )
}
