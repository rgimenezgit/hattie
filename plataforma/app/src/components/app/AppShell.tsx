"use client"

import Image from "next/image"
import Link from "next/link"
import type { Route } from "next"
import { useState, type ReactNode } from "react"
import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import { Check, ChevronDown, CircleHelp, LayoutGrid, Link2, LogOut, Menu, Plus, Settings, UserPlus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { notificar } from "@/components/hattie/Notificacao"
import { cn } from "@/lib/utils"
import { MARCAS, PESSOA } from "@/lib/mock"
import { useEstado } from "./Estado"
import { useMarca } from "./MarcaContexto"
import { NAVEGACAO, type ItemNavegacao } from "./Navegacao"

const ITEM_MENU = "h-9 gap-2.5 rounded-xl px-2.5 text-sm [&_svg]:size-4"

function hrefDe(slug: string, item: ItemNavegacao) {
  return (item.segmento ? `/marca/${slug}/${item.segmento}` : `/marca/${slug}`) as Route
}

function TrocaMarca({ aoAbrir }: { aoAbrir?: (aberto: boolean) => void }) {
  const marca = useMarca()
  const { nomeMarca } = useEstado()
  const nomeDe = (slug: string, nome: string) => (slug === "raiz-natural" ? nomeMarca : nome)

  return (
    <DropdownMenu onOpenChange={aoAbrir}>
      <DropdownMenuTrigger className="flex h-9 min-w-0 items-center gap-2 rounded-full bg-lima ps-3.5 pe-1.5 text-sm font-medium text-preto transition-[background-color] duration-150 hover:bg-lima/80 data-[state=open]:bg-lima/80">
        <span className="truncate">{nomeDe(marca.slug, marca.nome)}</span>
        <span className="grid size-5 shrink-0 place-items-center rounded-md bg-preto text-lima">
          <ChevronDown className="size-3.5" strokeWidth={2.5} aria-hidden />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1">
        <DropdownMenuLabel className="text-xs font-medium text-texto-2">Suas marcas</DropdownMenuLabel>
        {MARCAS.map((item) => (
          <DropdownMenuItem key={item.slug} asChild className={ITEM_MENU}>
            <Link href={`/marca/${item.slug}` as Route}>
              <span className="flex gap-0.5" aria-hidden>
                {item.paleta.slice(0, 3).map((cor) => (
                  <span key={cor.hex} className="size-2.5 rounded-full" style={{ backgroundColor: cor.hex }} />
                ))}
              </span>
              <span className="flex-1 truncate">{nomeDe(item.slug, item.nome)}</span>
              {item.slug === marca.slug && <Check aria-label="marca atual" />}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={ITEM_MENU}>
          <Link href="/comecar">
            <Plus aria-hidden /> Nova marca
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={ITEM_MENU}>
          <Link href="/marcas">
            <LayoutGrid aria-hidden /> Minhas marcas
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <UserPlus aria-hidden /> Convidar pessoa <span className="ms-auto text-xs text-texto-2">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className={ITEM_MENU}
          onSelect={() => {
            navigator.clipboard?.writeText(`${window.location.origin}/marca/${marca.slug}/cerebro`)
            notificar({ titulo: "link copiado", texto: `Bia, quem abrir o link vê a ${nomeDe(marca.slug, marca.nome)} sem precisar de conta.` })
          }}
        >
          <Link2 aria-hidden /> Compartilhar link da marca
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MenuConta({ lado = "right" }: { lado?: "right" | "top" }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Sua conta"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-preenchimento p-0.5 transition-[background-color] duration-150 hover:bg-preenchimento-ativo focus-visible:outline-offset-[-3px] data-[state=open]:bg-preenchimento-ativo"
      >
        <span className="grid size-full place-items-center rounded-full bg-lilas text-xs font-semibold text-preto">{PESSOA.nome[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={lado} align="end" sideOffset={8} className="w-64 rounded-2xl p-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <span aria-hidden className="grid size-9 place-items-center rounded-full bg-lilas text-sm font-semibold text-preto">
            {PESSOA.nome[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">
              {PESSOA.nome} {PESSOA.sobrenome}
            </p>
            <p className="truncate text-sm text-texto-2">{PESSOA.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <Settings aria-hidden /> Configurações da conta <span className="ms-auto text-xs text-texto-2">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <CircleHelp aria-hidden /> Ajuda <span className="ms-auto text-xs text-texto-2">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <UserPlus aria-hidden /> Convidar pessoa <span className="ms-auto text-xs text-texto-2">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} onSelect={() => router.push("/entrar")}>
          <LogOut aria-hidden /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LARGURA_ITEM =
  "[transition:width_260ms_var(--ease-saida),background-color_150ms,color_150ms] aberta:[transition:width_260ms_var(--ease-saida)_120ms,background-color_150ms,color_150ms] motion-reduce:transition-none"

function ItemRail({
  item,
  ativo,
  slug,
  aoNavegar,
  gaveta = false,
}: {
  item: ItemNavegacao
  ativo: boolean
  slug: string
  aoNavegar?: () => void
  gaveta?: boolean
}) {
  return (
    <li>
      <Link
        href={hrefDe(slug, item)}
        onClick={aoNavegar}
        aria-current={ativo ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 overflow-hidden rounded-full ps-2.5 text-sm whitespace-nowrap focus-visible:outline-offset-[-3px]",
          gaveta ? "w-full transition-[background-color,color] duration-150" : cn("w-10 aberta:w-46", LARGURA_ITEM),
          ativo ? "bg-lima font-semibold text-preto" : "text-texto-3 hover:bg-preenchimento hover:text-texto",
        )}
      >
        <item.icone className="shrink-0" ativo={ativo} />
        <span
          className={cn(
            !gaveta &&
              "opacity-0 [transition:opacity_90ms_ease-in] aberta:opacity-100 aberta:[transition:opacity_200ms_ease-out_230ms] motion-reduce:transition-none",
          )}
        >
          {item.rotulo}
        </span>
      </Link>
    </li>
  )
}

/**
 * Espinha da casca no desktop: três abas brancas que saem da margem para dentro do palco cinza,
 * com cantos côncavos onde encontram o cinza (desenhos em .aba, globals.css).
 * Topo: símbolo do Hattie; aberta, estica e mostra a logomarca e a troca de marca.
 * Meio: navegação; fechada acompanha a coluna de ícones, aberta estica e mostra os rótulos.
 * Base: conta.
 * Abre no hover (120 ms de espera), no foco pelo teclado e enquanto o menu de marcas está aberto.
 */
function Espinha() {
  const marca = useMarca()
  const segmento = useSelectedLayoutSegment()
  const [fixo, setFixo] = useState(false)
  const largura =
    "[transition:width_260ms_var(--ease-saida)] aberta:[transition:width_260ms_var(--ease-saida)_120ms] motion-reduce:transition-none"

  return (
    <div data-fixo={fixo || undefined} className="espinha pointer-events-none absolute inset-y-0 left-0 z-30 hidden md:block">
      <div className={cn("pointer-events-auto absolute top-0 left-0 h-15 w-19 aberta:w-84", largura)}>
        <span aria-hidden className="aba aba-topo" />
        <div className="relative flex h-full items-center gap-3 ps-4.5">
          <Link
            href={`/marca/${marca.slug}` as Route}
            aria-label="Hattie, início"
            className={cn("block w-10.5 shrink-0 overflow-hidden rounded-md aberta:w-33.5", largura)}
          >
            <Image src="/logos/hattie-logomarca.svg" alt="" width={168} height={36} priority className="h-7 w-auto max-w-none" />
          </Link>
          <div className="invisible min-w-0 opacity-0 [transition:opacity_90ms,visibility_0s_90ms] aberta:visible aberta:opacity-100 aberta:[transition:opacity_200ms_ease-out_230ms,visibility_0s] [&_button]:max-w-40">
            <TrocaMarca aoAbrir={setFixo} />
          </div>
        </div>
      </div>

      <nav aria-label="Navegação principal" className={cn("pointer-events-auto absolute top-1/2 left-0 w-19 -translate-y-1/2 aberta:w-54", largura)}>
        <span aria-hidden className="aba aba-meio" />
        <ul className="relative flex flex-col gap-1 py-3 ps-4.5 [@media(min-height:760px)]:gap-2 [@media(min-height:760px)]:py-4">
          {NAVEGACAO.map((item) => (
            <ItemRail key={item.rotulo} item={item} slug={marca.slug} ativo={segmento === item.segmento} />
          ))}
        </ul>
      </nav>

      <div className="pointer-events-auto absolute bottom-0 left-0 h-16 w-19">
        <span aria-hidden className="aba aba-base" />
        <div className="relative flex h-full items-center ps-4">
          <MenuConta />
        </div>
      </div>
    </div>
  )
}

function NavegacaoCelular() {
  const marca = useMarca()
  const segmento = useSelectedLayoutSegment()
  const [aberto, setAberto] = useState(false)

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger aria-label="Abrir navegação" className="-ms-1 grid size-10 place-items-center rounded-full hover:bg-preenchimento md:hidden">
        <Menu className="size-5" strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 gap-0 bg-background p-3">
        <SheetTitle className="sr-only">Navegação</SheetTitle>
        <SheetDescription className="sr-only">Áreas da sua marca</SheetDescription>
        <ul className="mt-10 flex flex-col gap-1">
          {NAVEGACAO.map((item) => (
            <ItemRail
              key={item.rotulo}
              item={item}
              slug={marca.slug}
              ativo={segmento === item.segmento}
              aoNavegar={() => setAberto(false)}
              gaveta
            />
          ))}
        </ul>
        <div className="mt-auto">
          <MenuConta lado="top" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const marca = useMarca()
  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-fundo">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-preto focus:px-4 focus:py-2 focus:text-branco"
      >
        Pular para o conteúdo
      </a>
      <header className="flex h-14 shrink-0 items-center gap-3 px-3 md:hidden">
        <NavegacaoCelular />
        <Link href={`/marca/${marca.slug}` as Route} aria-label="Hattie, início" className="shrink-0">
          <Image src="/logos/hattie-simbolo.svg" alt="" width={40} height={28} priority className="h-6 w-auto" />
        </Link>
        <TrocaMarca />
      </header>
      <div className="flex min-h-0 flex-1 px-2 pb-2 md:p-2 md:ps-5">
        <div className="palco flex min-h-0 min-w-0 flex-1 rounded-3xl bg-canvas shadow-(--sombra-canvas) md:rounded-[28px]">
          <main id="conteudo" tabIndex={-1} className="flex min-h-0 min-w-0 flex-1 gap-2 outline-none md:p-2 md:ps-16">
            {children}
          </main>
        </div>
      </div>
      <Espinha />
    </div>
  )
}
