"use client"

import Link from "next/link"
import type { Route } from "next"
import { useRef, useSyncExternalStore } from "react"
import { ArrowRight, Globe, Image as IconeImagem, LayoutGrid, Plus, Presentation, Smile, Telescope, Video, Wrench, type LucideIcon } from "lucide-react"
import { Abas, ConteudoAba, ListaAbas } from "@/components/hattie/Abas"
import { Botao } from "@/components/hattie/Botao"
import { Composer, type ComposerHandle } from "@/components/hattie/Composer"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { notificar } from "@/components/hattie/Notificacao"
import { fillStyle } from "@/lib/dither/style"
import { CATEGORIAS, MODELOS, PESSOA, PROJETOS, SECOES } from "@/lib/mock"
import { useEstado } from "./Estado"
import { Canvas } from "./Layout"
import { useMarca } from "./MarcaContexto"

const ICONES: Record<string, LucideIcon> = {
  imagem: IconeImagem,
  video: Video,
  posts: LayoutGrid,
  apresentacao: Presentation,
  pesquisa: Telescope,
  personas: Smile,
  ferramentas: Wrench,
  site: Globe,
}

const nadaParaAssinar = () => () => {}

function saudacao(hora: number) {
  if (hora < 12) return "bom dia"
  if (hora < 18) return "boa tarde"
  return "boa noite"
}

export function Inicio() {
  const marca = useMarca()
  const { secoes } = useEstado()
  const composer = useRef<ComposerHandle>(null)
  const periodo = useSyncExternalStore(
    nadaParaAssinar,
    () => saudacao(new Date().getHours()),
    () => "",
  )
  const pendentes = SECOES.filter((secao) => secoes[secao.id] === "pendente").length

  return (
    <Canvas rotulo="Início">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
          <section className="flex flex-col items-center gap-5">
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-4 sm:text-left">
              <IconeHattie nome="hattie" tamanho={64} className="text-preto" />
              <h1 className="font-heading text-titulo-1 font-medium lowercase md:text-display">
                oi, {PESSOA.nome.toLowerCase()}!{periodo && ` ${periodo} :)`}
              </h1>
            </div>
            {pendentes > 0 && (
              <Link
                href={`/marca/${marca.slug}/cerebro` as Route}
                className="flex h-8 items-center gap-2 rounded-full bg-lima-suave px-3 text-detalhe font-medium transition-[background-color] duration-150 hover:bg-lima"
              >
                <span aria-hidden className="size-2 rounded-full bg-lima-forte" />
                {pendentes === 1 ? "1 proposta espera" : `${pendentes} propostas esperam`} o seu ok
                <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden />
              </Link>
            )}
            <Composer
              ref={composer}
              rotulo="Pedido para o Hattie"
              placeholder="o que vamos criar hoje?"
              sugestoes={MODELOS.map((modelo) => modelo.pedido)}
              onEnviar={() =>
                notificar({
                  titulo: "pedido anotado",
                  texto: "Bia, nesta versão de teste o pedido fica guardado. Na próxima etapa eu entrego as peças aqui mesmo.",
                  som: "plimm",
                })
              }
              className="max-w-3xl"
            />
          </section>

          <section aria-labelledby="titulo-projetos" className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 id="titulo-projetos" className="font-heading text-titulo-3 font-medium lowercase">
                projetos
              </h2>
              <Botao variante="fantasma" tamanho="icone-sm" aria-label="Novo projeto" asChild>
                <Link href={`/marca/${marca.slug}/projetos` as Route}>
                  <Plus />
                </Link>
              </Botao>
              <Link
                href={`/marca/${marca.slug}/projetos` as Route}
                className="ms-auto flex min-h-8 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                Ver todos
                <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {PROJETOS.map((projeto) => (
                <li key={projeto.id}>
                  <Link href={`/marca/${marca.slug}/projetos` as Route} className="group flex flex-col gap-2 rounded-2xl">
                    <span className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-superficie transition-[box-shadow] duration-150 group-hover:shadow-(--sombra-campo)">
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-[radial-gradient(var(--cinza)_1.5px,transparent_2px)] bg-size-[16px_16px] bg-position-[8px_8px]"
                      />
                    </span>
                    <span className="flex flex-col px-1">
                      <span className="truncate text-sm font-medium">{projeto.nome}</span>
                      <span className="text-xs text-texto-2">{projeto.editado}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="titulo-criar" className="flex flex-col gap-3">
            <h2 id="titulo-criar" className="sr-only">
              Criar a partir de um modelo
            </h2>
            <Abas defaultValue="imagem" className="gap-4">
              <ListaAbas
                rotulo="Tipos de modelo"
                centro
                itens={CATEGORIAS.map((categoria) => ({ valor: categoria.id, rotulo: categoria.rotulo, icone: ICONES[categoria.icone] }))}
              />
              {CATEGORIAS.map((categoria) => (
                <ConteudoAba key={categoria.id} value={categoria.id}>
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {MODELOS.filter((modelo) => modelo.categoria === categoria.id).map((modelo) => (
                      <li key={modelo.id}>
                        <button
                          type="button"
                          onClick={() => composer.current?.preencher(modelo.pedido)}
                          className="clique flex h-full w-full gap-3 rounded-2xl bg-superficie p-2.5 text-left hover:shadow-(--sombra-flutuante)"
                        >
                          <span aria-hidden className="relative min-h-20 w-16 shrink-0 self-stretch overflow-hidden rounded-xl bg-lima-suave">
                            <span className="absolute inset-0" style={fillStyle("gradient", { color: "var(--lima)", edge: "bottom", length: 20 })} />
                          </span>
                          <span className="flex min-w-0 flex-col gap-1 py-1">
                            <span className="flex items-center gap-2">
                              <span className="line-clamp-2 text-sm font-medium">{modelo.titulo}</span>
                            </span>
                            <span className="text-xs leading-snug text-texto-2">{modelo.descricao}</span>
                            {categoria.emBreve && <span className="mt-auto text-xs font-medium text-texto-2">em breve</span>}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </ConteudoAba>
              ))}
            </Abas>
          </section>
        </div>
      </div>
    </Canvas>
  )
}
