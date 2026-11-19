"use client"

import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import type { ObjetivoMarca, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto, avisarRemocao } from "./AcoesPonto"
import { useEstado } from "./Estado"

type Props = { secao: Secao; aoEditar: () => void }

const idDoTitulo = (titulo: string) =>
  titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")

/**
 * Objetivos: as metas da marca, cada uma num card com nome curto e a meta com número e prazo.
 * Dá para adicionar objetivos e apagar pelo menu de três pontos. Fica sempre pelo menos um.
 * O resumo do Hattie aparece enquanto a lista é a que ele montou; depois de mudar, some para não ficar desatualizado.
 */
export function SecaoObjetivos({ secao, aoEditar }: Props) {
  const { objetivos: salvos, salvarObjetivos } = useEstado()
  const [adicionando, setAdicionando] = useState(false)
  if (secao.conteudo.tipo !== "blocos") return null
  const objetivos: ObjetivoMarca[] = salvos ?? secao.conteudo.blocos.map((bloco) => ({ id: idDoTitulo(bloco.titulo), ...bloco }))
  const sozinho = objetivos.length <= 1

  function excluir(alvo: ObjetivoMarca) {
    const antes = objetivos
    salvarObjetivos(objetivos.filter((objetivo) => objetivo.id !== alvo.id))
    avisarRemocao(`Tirei "${alvo.titulo}" dos objetivos.`, () => salvarObjetivos(antes))
  }

  return (
    <section aria-labelledby="titulo-objetivos" className="flex flex-col gap-3">
      <CabecalhoBloco id="titulo-objetivos" titulo="aonde a marca quer chegar" quantidade={objetivos.length}>
        <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
          <p>{secao.porque}</p>
        </PorqueHattie>
        <Botao variante="secundario" tamanho="sm" onClick={() => setAdicionando(true)}>
          <Plus /> Adicionar<span className="max-sm:sr-only"> objetivo</span>
        </Botao>
      </CabecalhoBloco>
      {!salvos && <p className="max-w-[70ch] text-sm text-texto-2">{secao.resumo}</p>}

      <ol className="grid grid-cols-1 gap-3 @3xl:grid-cols-2">
        {objetivos.map((objetivo, indice) => (
          <li key={objetivo.id} className="flex min-w-0">
            <article aria-labelledby={`objetivo-${objetivo.id}`} className="flex w-full flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
              <header className="-me-2 -mt-1 flex items-center gap-3">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-preenchimento text-xs font-semibold tabular-nums">
                  {indice + 1}
                </span>
                <h3 id={`objetivo-${objetivo.id}`} className="flex min-w-0 flex-1 flex-wrap items-center gap-2 text-sm font-semibold">
                  {objetivo.titulo}
                  {objetivo.rascunho && (
                    <Tag tom="acao" tamanho="sm" ponto>
                      rascunho
                    </Tag>
                  )}
                </h3>
                <MenuPonto
                  ponto={`o objetivo ${objetivo.titulo}`}
                  aoExcluir={() => excluir(objetivo)}
                  excluirBloqueado={sozinho ? "fica pelo menos um" : undefined}
                />
              </header>
              <p className="text-destaque font-light">{objetivo.texto}</p>
            </article>
          </li>
        ))}
      </ol>

      <FormObjetivo
        aberta={adicionando}
        aoMudar={setAdicionando}
        aoAdicionar={(objetivo) => {
          salvarObjetivos([...objetivos, objetivo])
          notificar({ titulo: "objetivo anotado", texto: "Eu transformo em meta com número e prazo para você acompanhar mês a mês.", tipo: "sucesso" })
        }}
      />
    </section>
  )
}

function FormObjetivo({ aberta, aoMudar, aoAdicionar }: { aberta: boolean; aoMudar: (aberta: boolean) => void; aoAdicionar: (objetivo: ObjetivoMarca) => void }) {
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const meta = String(dados.get("meta") ?? "").trim()
    if (!meta) {
      setErro("Conta o que você quer alcançar.")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    const prazo = String(dados.get("prazo") ?? "").trim()
    const titulo = String(dados.get("titulo") ?? "").trim() || "Novo objetivo"
    aoAdicionar({
      id: `objetivo-${Date.now()}`,
      titulo,
      texto: prazo ? `${meta.replace(/\.$/, "")}, ${prazo}.` : meta,
      rascunho: true,
    })
    setErro("")
    aoMudar(false)
  }

  return (
    <Janela
      aberta={aberta}
      aoMudar={(valor) => {
        aoMudar(valor)
        if (!valor) setErro("")
      }}
      titulo="novo objetivo"
      descricao="Escreva do seu jeito. Eu ajusto para virar uma meta que dá para medir."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-objetivo">
          <Plus /> Adicionar objetivo
        </Botao>
      }
    >
      <form id="form-objetivo" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <CampoArea name="meta" rotulo="O que você quer alcançar" placeholder="Ex.: Vender em duas lojas de Campinas" erro={erro} compacto autoFocus />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo name="titulo" rotulo="Nome curto" dica="Opcional" placeholder="Ex.: Campinas" />
          <Campo name="prazo" rotulo="Prazo" dica="Opcional" placeholder="Ex.: até dezembro de 2027" />
        </div>
      </form>
    </Janela>
  )
}
