"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Download, Sparkle } from "lucide-react"
import { Composer, type ComposerHandle } from "@/components/hattie/Composer"
import { IconeHattie } from "@/components/hattie/IconeHattie"
import { Segmentado } from "@/components/hattie/Segmentado"
import { PESSOA } from "@/lib/mock"
import { useEstado } from "./Estado"

const IDEIAS = [
  "Faço cosméticos naturais em Ribeirão Preto, com ingredientes do cerrado, e vendo pelo Instagram e WhatsApp.",
  "Tenho uma confeitaria artesanal em Londrina e quero começar a vender bolos por encomenda para empresas.",
  "Vou abrir um estúdio de tatuagem fine line em Belo Horizonte, focado em quem faz a primeira tatuagem.",
]

const EXEMPLOS = ["Cosméticos naturais", "Confeitaria artesanal", "Estúdio de tatuagem"]

export function PrimeiroAcesso() {
  const router = useRouter()
  const { iniciarCriacao, concluirCriacao } = useEstado()
  const [modo, setModo] = useState("criar")
  const composer = useRef<ComposerHandle>(null)
  const criar = modo === "criar"

  function enviar(texto: string, anexos: string[]) {
    iniciarCriacao(texto || "Seguem os materiais da minha marca.", anexos)
    if (criar) {
      router.push("/marca/raiz-natural/hattie/criacao")
      return
    }
    concluirCriacao()
    router.push("/marca/raiz-natural/criando")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background px-4 py-6 md:px-10">
      <Link href="/" aria-label="Hattie" className="self-start">
        <Image src="/logos/hattie-logomarca.svg" alt="" width={160} height={34} priority className="h-7 w-auto" />
      </Link>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 py-8">
        <div className="flex flex-col items-center gap-4 text-center animate-entrada">
          <IconeHattie nome="hattie" tamanho={96} className="text-preto" />
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-titulo-1 font-medium lowercase md:text-display">
              vamos tirar sua marca do chapéu
            </h1>
            <p className="text-destaque leading-snug text-texto-2">
              Oi, {PESSOA.nome}! {criar ? "Me conta a sua ideia do seu jeito." : "Me mostra a marca que você já tem."}
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-2xl flex-col gap-2.5">
          <Segmentado
            rotulo="O que você quer fazer"
            valor={modo}
            onChange={setModo}
            opcoes={[
              { valor: "criar", rotulo: "Criar marca", icone: Sparkle },
              { valor: "importar", rotulo: "Importar marca", icone: Download },
            ]}
          />
          <Composer
            ref={composer}
            autoFocus
            rotulo={criar ? "Sua ideia de marca" : "Materiais da sua marca"}
            placeholder={
              criar
                ? "Me conta sua ideia: o que você vende, pra quem, onde, e o que te inspira"
                : "Cola os links da sua marca ou anexa logo, manual, posts e fotos"
            }
            exigirTexto={criar ? "Me conta pelo menos uma frase sobre a sua ideia." : "Manda um link ou anexa algum material."}
            sugestoes={criar ? IDEIAS : undefined}
            onEnviar={enviar}
          />
          <p className="px-2 text-xs text-texto-2">
            Pode mandar PDF, imagens, vídeos e links. Quanto mais ingredientes, melhor a marca.
          </p>
        </div>

        {criar && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-texto-2">Experimente:</span>
            {EXEMPLOS.map((exemplo, indice) => (
              <button
                key={exemplo}
                type="button"
                onClick={() => composer.current?.preencher(IDEIAS[indice])}
                className="clique h-8 rounded-full bg-preenchimento px-3 text-detalhe font-medium hover:bg-preenchimento-hover"
              >
                {exemplo}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
