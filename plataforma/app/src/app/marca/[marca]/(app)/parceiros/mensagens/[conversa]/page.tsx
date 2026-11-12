import { Suspense } from "react"
import { MensagensParceiros } from "@/components/app/parceiros/Mensagens"
import { CONVERSAS_PARCEIROS } from "@/lib/mock"

export function generateStaticParams() {
  return CONVERSAS_PARCEIROS.map((conversa) => ({ conversa: conversa.id }))
}

async function Resolver({ params }: { params: Promise<{ conversa: string }> }) {
  const { conversa } = await params
  return <MensagensParceiros conversaId={conversa} />
}

export default function Pagina({ params }: PageProps<"/marca/[marca]/parceiros/mensagens/[conversa]">) {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <Resolver params={params} />
    </Suspense>
  )
}
