import Image from "next/image"
import Link from "next/link"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { SeloSom } from "@/components/hattie/SeloSom"
import { fillStyle } from "@/lib/dither/style"

export default function LayoutDeEntrada({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh grid-cols-1 bg-background p-2 lg:grid-cols-[1fr_minmax(0,0.85fr)] lg:gap-6 lg:p-3">
      <main className="flex flex-col px-4 py-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-8">
          <Link href="/" aria-label="Hattie" className="self-center">
            <Image src="/logos/hattie-logomarca.svg" alt="" width={240} height={52} priority className="h-9 w-auto" />
          </Link>
          {children}
        </div>
      </main>

      <aside
        aria-hidden
        className="relative hidden flex-col justify-between overflow-hidden rounded-[32px] bg-lilas p-10 lg:flex"
      >
        <div className="relative z-10 flex max-w-md flex-col gap-6">
          <SeloSom som="plimm" fixo className="self-start" />
          <p className="font-heading text-titulo-1 xl:text-display font-medium text-preto lowercase">
            já tirei muitas marcas do chapéu. bora tirar a sua?
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/3" style={fillStyle("gradient", { color: "var(--violeta)", edge: "bottom", length: 48 })} />
        <IconeHattie nome="hattie" tamanho={220} className="relative z-10 self-end text-preto" />
      </aside>
    </div>
  )
}
