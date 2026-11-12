import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PerfilParceiro } from "@/components/app/parceiros/Perfil"
import { PARCEIROS, getParceiro } from "@/lib/mock"

export function generateStaticParams() {
  return PARCEIROS.map((parceiro) => ({ parceiro: parceiro.id }))
}

async function Resolver({ params }: { params: Promise<{ parceiro: string }> }) {
  const { parceiro } = await params
  if (!getParceiro(parceiro)) notFound()
  return <PerfilParceiro id={parceiro} />
}

export default function Pagina({ params }: PageProps<"/marca/[marca]/parceiros/perfil/[parceiro]">) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <Resolver params={params} />
    </Suspense>
  )
}
