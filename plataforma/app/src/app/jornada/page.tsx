import type { Metadata } from "next"
import { Jornada } from "@/components/jornada/Jornada"

export const metadata: Metadata = { title: "Jornada da Bia · Hattie" }

/** Página de apresentação: a jornada de quem cria uma marca do zero, com as telas do protótipo. */
export default function Pagina() {
  return <Jornada />
}
