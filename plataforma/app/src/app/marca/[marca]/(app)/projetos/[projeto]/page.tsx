import { Suspense } from "react"
import { Projeto } from "@/components/app/projetos/Projeto"
import { PROJETOS } from "@/lib/mock"

export function generateStaticParams() {
  return PROJETOS.map((projeto) => ({ projeto: projeto.id }))
}

/** Projetos criados na hora têm id novo, então a página não barra ids desconhecidos: quem decide é o estado. */
async function Resolver({ params }: { params: Promise<{ projeto: string }> }) {
  const { projeto } = await params
  return <Projeto projetoId={projeto} />
}

export default function Pagina({ params }: PageProps<"/marca/[marca]/projetos/[projeto]">) {
  return (
    <Suspense fallback={<div className="flex-1 rounded-[40px] bg-canvas" />}>
      <Resolver params={params} />
    </Suspense>
  )
}
