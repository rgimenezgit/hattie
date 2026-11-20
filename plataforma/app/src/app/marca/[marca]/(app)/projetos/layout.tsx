import { EstadoProjetosProvider } from "@/components/app/projetos/EstadoProjetos"

/** O estado dos projetos vive aqui: o que a pessoa cria continua enquanto ela vai da lista para um projeto e volta. */
export default function LayoutProjetos({ children }: LayoutProps<"/marca/[marca]/projetos">) {
  return <EstadoProjetosProvider>{children}</EstadoProjetosProvider>
}
