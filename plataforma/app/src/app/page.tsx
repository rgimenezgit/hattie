import Image from "next/image"
import Link from "next/link"
import type { Route } from "next"
import { CartaoBanca } from "@/components/app/Banca"

const FLUXOS: { titulo: string; descricao: string; telas: { rotulo: string; href: string }[] }[] = [
  {
    titulo: "1 · entrada",
    descricao: "Conta nova e primeiro acesso.",
    telas: [
      { rotulo: "Criar conta", href: "/criar-conta" },
      { rotulo: "Entrar", href: "/entrar" },
      { rotulo: "Primeiro acesso: criar ou importar", href: "/comecar" },
    ],
  },
  {
    titulo: "2 · criação da marca",
    descricao: "Comece pelo primeiro acesso para ver o fluxo do zero.",
    telas: [
      { rotulo: "Conversa de criação com o plano", href: "/marca/raiz-natural/hattie/criacao" },
      { rotulo: "O Hattie criando a marca", href: "/marca/raiz-natural/criando" },
      { rotulo: "Olha como ficou (antes da validação)", href: "/marca/raiz-natural/pronta" },
      { rotulo: "Cérebro da marca: visão geral", href: "/marca/raiz-natural/cerebro" },
      { rotulo: "Cérebro da marca: uma seção", href: "/marca/raiz-natural/cerebro/proposito" },
    ],
  },
  {
    titulo: "3 · dia a dia",
    descricao: "Navegação geral com a marca pronta.",
    telas: [
      { rotulo: "Início", href: "/marca/raiz-natural" },
      { rotulo: "Conversa nova com o Hattie", href: "/marca/raiz-natural/hattie/nova" },
      { rotulo: "Minhas marcas", href: "/marcas" },
      { rotulo: "Áreas da próxima etapa", href: "/marca/raiz-natural/projetos" },
    ],
  },
]

export default function MapaDasTelas() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="flex flex-col gap-4">
        <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={168} height={36} priority className="h-9 w-auto self-start" />
        <h1 className="font-heading text-titulo-1 font-medium lowercase">mapa das telas</h1>
        <p className="text-texto-2">
          Telas navegáveis com dados fictícios da Bia e da Raiz Natural. Para o fluxo completo, comece em Criar conta.
        </p>
        <Link
          href="/jornada"
          className="flex items-center justify-between gap-4 rounded-2xl bg-preto px-5 py-4 text-branco transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)"
        >
          <span className="flex flex-col gap-0.5">
            <span className="font-heading text-titulo-3 font-medium text-lima lowercase">jornada da bia</span>
            <span className="text-sm text-cinza">Para apresentar: do cadastro à marca no dia a dia, com as telas e os caminhos possíveis.</span>
          </span>
          <span aria-hidden className="shrink-0 text-lima">→</span>
        </Link>
        <CartaoBanca />
      </header>
      {FLUXOS.map((fluxo) => (
        <section key={fluxo.titulo} className="flex flex-col gap-3">
          <div>
            <h2 className="font-heading text-titulo-3 font-medium lowercase">{fluxo.titulo}</h2>
            <p className="text-sm text-texto-2">{fluxo.descricao}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {fluxo.telas.map((tela) => (
              <li key={tela.href}>
                <Link
                  href={tela.href as Route}
                  className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-branco px-3.5 py-2 text-sm transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)"
                >
                  <span className="font-medium">{tela.rotulo}</span>
                  <span className="truncate text-xs text-texto-2">{tela.href}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="flex flex-col gap-3">
        <div>
          <h2 className="font-heading text-titulo-3 font-medium lowercase">ferramentas da marca</h2>
          <p className="text-sm text-texto-2">Para uso interno do time, fora da jornada da Bia.</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          <li>
            <a
              href="/ferramentas/gerador/index.html"
              className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-branco px-3.5 py-2 text-sm transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)"
            >
              <span className="font-medium">Gerador de grafismo</span>
              <span className="truncate text-xs text-texto-2">/ferramentas/gerador</span>
            </a>
          </li>
          <li>
            <Link
              href="/dev/tokens"
              className="flex min-h-10 items-center justify-between gap-3 rounded-xl bg-branco px-3.5 py-2 text-sm transition-[box-shadow] duration-150 hover:shadow-(--sombra-flutuante)"
            >
              <span className="font-medium">Vitrine dos componentes</span>
              <span className="truncate text-xs text-texto-2">/dev/tokens</span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
