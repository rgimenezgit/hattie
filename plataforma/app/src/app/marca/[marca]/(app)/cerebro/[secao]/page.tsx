import { Suspense } from "react"
import { notFound } from "next/navigation"
import { CerebroMarca } from "@/components/app/CerebroMarca"
import { SECOES, getSecao } from "@/lib/mock"

export function generateStaticParams() {
  return SECOES.map((secao) => ({ secao: secao.id }))
}

async function Resolver({ params }: { params: Promise<{ secao: string }> }) {
  const { secao } = await params
  if (!getSecao(secao)) notFound()
  return <CerebroMarca secaoId={secao} />
}

export default function Pagina({ params }: PageProps<"/marca/[marca]/cerebro/[secao]">) {
  return (
    <Suspense fallback={<div className="flex-1 rounded-[40px] bg-canvas" />}>
      <Resolver params={params} />
    </Suspense>
  )
}
