import { ColunaCerebro } from "@/components/app/CerebroMarca"

export default function LayoutCerebro({ children }: LayoutProps<"/marca/[marca]/cerebro">) {
  return (
    <>
      <ColunaCerebro />
      {children}
    </>
  )
}
