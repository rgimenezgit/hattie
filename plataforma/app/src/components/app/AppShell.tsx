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

function TrocaMarca() {
  const marca = useMarca()
  const { nomeMarca } = useEstado()
  const nomeDe = (slug: string, nome: string) => (slug === "raiz-natural" ? nomeMarca : nome)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 min-w-0 items-center gap-2 rounded-full bg-lima ps-3.5 pe-1.5 text-sm font-medium text-preto transition-[background-color] duration-150 hover:bg-lima/80 data-[state=open]:bg-lima/80">
        <span className="truncate">{nomeDe(marca.slug, marca.nome)}</span>
        <span className="grid size-5 shrink-0 place-items-center rounded-md bg-preto text-lima">
          <ChevronDown className="size-3.5" strokeWidth={2.5} aria-hidden />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 rounded-2xl p-1">
        <DropdownMenuLabel className="text-xs font-medium text-ink-soft">Suas marcas</DropdownMenuLabel>
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
          <UserPlus aria-hidden /> Convidar pessoa <span className="ms-auto text-xs text-ink-soft">em breve</span>
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
        className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-cinza bg-background p-0.5 transition-[border-color] duration-150 hover:border-ink focus-visible:outline-offset-[-3px] data-[state=open]:border-ink"
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
            <p className="truncate text-sm text-ink-soft">{PESSOA.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <Settings aria-hidden /> Configurações da conta <span className="ms-auto text-xs text-ink-soft">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <CircleHelp aria-hidden /> Ajuda <span className="ms-auto text-xs text-ink-soft">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuItem className={ITEM_MENU} disabled>
          <UserPlus aria-hidden /> Convidar pessoa <span className="ms-auto text-xs text-ink-soft">em breve</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={ITEM_MENU} onSelect={() => router.push("/entrar")}>
          <LogOut aria-hidden /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function ItemRail({ item, ativo, slug, aoNavegar }: { item: ItemNavegacao; ativo: boolean; slug: string; aoNavegar?: () => void }) {
  return (
    <li>
      <Link
        href={hrefDe(slug, item)}
        onClick={aoNavegar}
        aria-current={ativo ? "page" : undefined}
        className={cn(
          "flex h-10 items-center gap-3 rounded-full px-2.5 text-sm whitespace-nowrap transition-[background-color,color] duration-150 focus-visible:outline-offset-[-3px]",
          ativo ? "bg-lima font-medium text-preto" : "text-ink-soft hover:bg-ink/6 hover:text-ink",
        )}
      >
        <item.icone className="shrink-0" />
        <span className="opacity-0 transition-opacity duration-150 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100 group-data-[aberto=true]/rail:opacity-100">
          {item.rotulo}
        </span>
      </Link>
    </li>
  )
}

function Rail() {
  const marca = useMarca()
  const segmento = useSelectedLayoutSegment()

  return (
    <nav aria-label="Navegação principal" className="group/rail relative hidden w-12 shrink-0 md:block">
      <div className="absolute inset-y-0 left-0 z-30 flex w-12 flex-col justify-between overflow-hidden rounded-3xl py-1 transition-[width,background-color,box-shadow] delay-0 duration-200 ease-out group-hover/rail:w-52 group-hover/rail:bg-branco group-hover/rail:shadow-[0_8px_32px_oklch(0_0_0/0.12)] group-hover/rail:delay-150 group-focus-within/rail:w-52 group-focus-within/rail:bg-branco group-focus-within/rail:shadow-[0_8px_32px_oklch(0_0_0/0.12)] motion-reduce:transition-none">
        <ul className="my-auto flex flex-col gap-0.5 px-1">
          {NAVEGACAO.map((item) => (
            <ItemRail key={item.rotulo} item={item} slug={marca.slug} ativo={segmento === item.segmento} />
          ))}
        </ul>
        <div className="px-1">
          <MenuConta />
        </div>
      </div>
    </nav>
  )
}

function NavegacaoCelular() {
  const marca = useMarca()
  const segmento = useSelectedLayoutSegment()
  const [aberto, setAberto] = useState(false)

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger aria-label="Abrir navegação" className="-ms-1 grid size-10 place-items-center rounded-full hover:bg-ink/6 md:hidden">
        <Menu className="size-5" strokeWidth={2} />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 gap-0 bg-background p-3">
        <SheetTitle className="sr-only">Navegação</SheetTitle>
        <SheetDescription className="sr-only">Áreas da sua marca</SheetDescription>
        <ul data-aberto="true" className="group/rail mt-10 flex flex-col gap-1">
          {NAVEGACAO.map((item) => (
            <ItemRail key={item.rotulo} item={item} slug={marca.slug} ativo={segmento === item.segmento} aoNavegar={() => setAberto(false)} />
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
    <div className="flex h-svh flex-col overflow-hidden bg-background">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-preto focus:px-4 focus:py-2 focus:text-branco"
      >
        Pular para o conteúdo
      </a>
      <header className="flex h-14 shrink-0 items-center gap-3 px-3 md:gap-4">
        <NavegacaoCelular />
        <Link href={`/marca/${marca.slug}` as Route} aria-label="Hattie, início" className="shrink-0">
          <Image src="/logos/hattie-logomarca.svg" alt="" width={168} height={36} priority className="hidden h-7 w-auto sm:block" />
          <Image src="/logos/hattie-simbolo.svg" alt="" width={40} height={28} priority className="h-6 w-auto sm:hidden" />
        </Link>
        <TrocaMarca />
      </header>
      <div className="flex min-h-0 flex-1 gap-2 px-2 pb-2 md:gap-3">
        <Rail />
        <main id="conteudo" tabIndex={-1} className="flex min-h-0 min-w-0 flex-1 gap-3 outline-none">
          {children}
        </main>
      </div>
    </div>
  )
}
