import { Suspense, type ReactNode } from "react"
import { notFound } from "next/navigation"
import { MarcaProvider } from "@/components/app/MarcaContexto"
import { MARCAS, getMarca } from "@/lib/mock"

export function generateStaticParams() {
  return MARCAS.map((marca) => ({ marca: marca.slug }))
}

async function Resolver({ params, children }: { params: Promise<{ marca: string }>; children: ReactNode }) {
  const { marca: slug } = await params
  const marca = getMarca(slug)
  if (!marca) notFound()
  return <MarcaProvider marca={marca}>{children}</MarcaProvider>
}

export default function LayoutDaMarca({ children, params }: LayoutProps<"/marca/[marca]">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" />}>
      <Resolver params={params}>{children}</Resolver>
    </Suspense>
  )
}
