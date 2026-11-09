import type { ReactNode } from "react"
import { Check, SquarePen } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { ICONES_HATTIE, IconeHattie } from "@/components/hattie/IconeHattie"
import { Plimm } from "@/components/hattie/Plimm"
import { SeloSom, type Som } from "@/components/hattie/SeloSom"
import { StatusBadge } from "@/components/hattie/StatusBadge"

const SONS: Som[] = ["plimm", "hmm…", "tcharam", "cling", "zuum", "puff", "toc toc", "psiu"]

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-cinza pt-6">
      <h2 className="font-heading text-[28px] leading-tight font-medium lowercase">{titulo}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  )
}

export default function VitrineDeComponentes() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 md:px-8">
      <h1 className="font-heading text-[50px] leading-none font-medium tracking-[-0.02em] lowercase">vitrine dos componentes</h1>

      <Bloco titulo="plimm">
        <Plimm />
        <Plimm tamanho="lg" />
        <Plimm somenteIcone rotulo="Enviar" />
        <Plimm carregando />
        <Plimm disabled />
      </Bloco>

      <Bloco titulo="botões">
        <Botao variante="primario">
          <Check /> Primário
        </Botao>
        <Botao variante="secundario">
          <SquarePen /> Secundário
        </Botao>
        <Botao variante="terciario">Terciário</Botao>
        <Botao variante="fantasma">Fantasma</Botao>
        <Botao variante="primario" tamanho="sm">
          Pequeno
        </Botao>
        <Botao variante="secundario" disabled>
          Desabilitado
        </Botao>
      </Bloco>

      <Bloco titulo="status">
        <StatusBadge status="pendente" />
        <StatusBadge status="aprovada" />
        <StatusBadge status="pendente" compacto />
        <StatusBadge status="aprovada" compacto />
      </Bloco>

      <Bloco titulo="selos de som">
        {SONS.map((som) => (
          <SeloSom key={som} som={som} fixo />
        ))}
      </Bloco>

      <Bloco titulo="superfícies">
        <div className="grid w-full grid-cols-3 gap-4">
          <div className="rounded-[28px] bg-background p-6 outline outline-1 outline-cinza">fundo · branco #F5F5F5</div>
          <div className="rounded-[40px] bg-canvas p-6">canvas · cinza #D3D3D3 a 62%</div>
          <div className="rounded-[28px] bg-canvas p-3">
            <div className="rounded-[20px] bg-branco p-4">card sobre canvas</div>
          </div>
        </div>
      </Bloco>

      <Bloco titulo="ícones da marca">
        {ICONES_HATTIE.map((nome) => (
          <span key={nome} className="flex w-24 flex-col items-center gap-2 text-center">
            <IconeHattie nome={nome} tamanho={32} />
            <span className="text-xs text-ink-soft">{nome}</span>
          </span>
        ))}
      </Bloco>

      <Bloco titulo="tipografia">
        <div className="flex flex-col gap-3">
          <p className="headline-s lowercase">títulos em clash display</p>
          <p className="subhead-s">Subtítulo em Poppins 500</p>
          <p className="body">Corpo em Poppins 400, 16px com entrelinha 1,55.</p>
          <p className="label">rótulo em poppins 500, 12px</p>
        </div>
      </Bloco>
    </main>
  )
}
