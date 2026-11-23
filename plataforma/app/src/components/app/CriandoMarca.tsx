"use client"

import Image from "next/image"
import type { Route } from "next"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { CampoMagico } from "@/components/hattie/CampoMagico"
import { ChapeuAnimado } from "@/components/hattie/ChapeuAnimado"
import { SeloSom } from "@/components/hattie/SeloSom"
import { cn } from "@/lib/utils"
import { ETAPAS_CRIACAO } from "@/lib/mock"
import { useMarca } from "./MarcaContexto"

const DURACAO_ETAPA = 1300

export function CriandoMarca() {
  const router = useRouter()
  const marca = useMarca()
  const [etapa, setEtapa] = useState(0)
  /** As faíscas sobem só até abaixo da primeira etapa ("Lendo tudo que você me contou"). */
  const primeiraEtapa = useRef<HTMLLIElement>(null)

  useEffect(() => {
    // Depois de criar, a pessoa escolhe cores, tipografia e logo; só então vê a marca inteira ("olha como ficou").
    const destino = `/marca/${marca.slug}/escolhas` as Route
    router.prefetch(destino)
    const intervalo = setInterval(() => setEtapa((atual) => Math.min(atual + 1, ETAPAS_CRIACAO.length)), DURACAO_ETAPA)
    const fim = setTimeout(() => router.replace(destino), DURACAO_ETAPA * (ETAPAS_CRIACAO.length + 1))
    return () => {
      clearInterval(intervalo)
      clearTimeout(fim)
    }
  }, [router, marca])

  return (
    <div className="relative isolate flex min-h-svh flex-col overflow-hidden bg-background px-4 py-6 md:px-10">
      <Image src="/logos/hattie-logomarca.svg" alt="Hattie" width={160} height={34} priority className="relative z-10 h-8 w-auto self-start" />

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
        <ChapeuAnimado largura={200} />
        <div className="flex flex-col items-center gap-4">
          <SeloSom som="zuum" fixo />
          <h1 className="font-heading text-titulo-1 font-medium lowercase">
            estou criando a sua marca
          </h1>
          <p className="text-texto-2">Esse feitiço leva alguns segundos. Pode deixar a tela aberta.</p>
        </div>

        <p role="status" className="sr-only">
          {etapa < ETAPAS_CRIACAO.length ? ETAPAS_CRIACAO[etapa] : "Opções prontas. Abrindo as escolhas."}
        </p>
        <ol className="flex w-full flex-col gap-1 rounded-[28px] bg-branco p-3 text-left" aria-label="Etapas da criação">
          {ETAPAS_CRIACAO.map((texto, indice) => {
            const feito = indice < etapa
            const agora = indice === etapa
            return (
              <li
                key={texto}
                ref={indice === 0 ? primeiraEtapa : undefined}
                aria-current={agora ? "step" : undefined}
                className={cn("flex h-10 items-center gap-3 rounded-xl px-3 text-sm", agora && "bg-preenchimento")}
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full",
                    feito ? "bg-lima text-preto" : agora ? "bg-preenchimento-ativo" : "border border-borda-tag",
                  )}
                >
                  {feito && <Check className="size-3.5" strokeWidth={3} aria-hidden />}
                  {agora && <span className="size-2 rounded-full bg-texto motion-safe:animate-pulse" />}
                </span>
                <span className={cn(feito ? "text-ink" : agora ? "font-medium" : "text-texto-2")}>{texto}</span>
                <span className="sr-only">{feito ? ", concluída" : agora ? ", em andamento" : ""}</span>
              </li>
            )
          })}
        </ol>
      </main>

      <CampoMagico
        cores={{ ponto: "--lilas", mais: "--lilas", brilho: "--violeta", asterisco: "--violeta", acento: "--lima" }}
        ambiente="subida"
        limite={primeiraEtapa}
        semPontos
        intervalo={210}
        espaco={28}
      />
    </div>
  )
}
