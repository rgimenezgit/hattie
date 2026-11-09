import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ChatHattie } from "@/components/app/ChatHattie"
import { CONVERSAS } from "@/lib/mock"

const IDS = ["nova", ...CONVERSAS.map((conversa) => conversa.id)]

export function generateStaticParams() {
  return IDS.map((conversa) => ({ conversa }))
}

async function Resolver({ params }: { params: Promise<{ conversa: string }> }) {
  const { conversa } = await params
  if (!IDS.includes(conversa)) notFound()
  return <ChatHattie conversaId={conversa} />
}

export default function Pagina({ params }: PageProps<"/marca/[marca]/hattie/[conversa]">) {
  return (
    <Suspense fallback={<div className="flex-1 rounded-[40px] bg-canvas" />}>
      <Resolver params={params} />
    </Suspense>
  )
}
