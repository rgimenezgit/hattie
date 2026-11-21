"use client"

import { useState, type FormEvent } from "react"
import { Plus } from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Campo, CampoArea } from "@/components/hattie/Campo"
import { Janela } from "@/components/hattie/Janela"
import { notificar } from "@/components/hattie/Notificacao"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { Tag } from "@/components/hattie/Tag"
import { VerMais } from "@/components/hattie/VerMais"
import type { Marca, MensagemChave, Secao } from "@/lib/mock"
import { CabecalhoBloco } from "./Blocos"
import { MenuPonto, avisarRemocao } from "./AcoesPonto"
import { useEstado } from "./Estado"

type Props = { secao: Secao; marca: Marca; aoEditar: () => void }

/**
 * Mensagens-chave: as ideias que a marca repete. Cada card traz a frase, uma explicação curta e as palavras
 * que carregam a ideia (o que antes era "palavras-chave" e "vocabulário"). Exemplos prontos ficam nas opções avançadas.
 * Dá para adicionar mensagens (entram como rascunho para o Hattie completar) e apagar pelo menu. Fica pelo menos uma.
 */
export function SecaoMensagens({ secao, marca, aoEditar }: Props) {
  const { mensagensChave, salvarMensagensChave } = useEstado()
  const [adicionando, setAdicionando] = useState(false)
  if (secao.conteudo.tipo !== "mensagens") return null
  const { resumo } = secao.conteudo
  const mensagens = mensagensChave ?? secao.conteudo.mensagens
  const sozinha = mensagens.length <= 1

  function excluir(alvo: MensagemChave) {
    const antes = mensagens
    salvarMensagensChave(mensagens.filter((mensagem) => mensagem.id !== alvo.id))
    avisarRemocao(`Tirei "${alvo.titulo}" das mensagens-chave.`, () => salvarMensagensChave(antes))
  }

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="titulo-mensagens" className="flex flex-col gap-3">
        <CabecalhoBloco id="titulo-mensagens" titulo="o que a marca repete" quantidade={mensagens.length}>
          <PorqueHattie assunto={secao.titulo} aoPerguntar={aoEditar}>
            <p>{secao.porque}</p>
          </PorqueHattie>
          <Botao variante="secundario" tamanho="sm" onClick={() => setAdicionando(true)}>
            <Plus /> Adicionar<span className="max-sm:sr-only"> mensagem</span>
          </Botao>
        </CabecalhoBloco>
        <p className="max-w-[70ch] text-sm text-texto-2">{resumo}</p>
        <ol className="grid grid-cols-1 gap-3 @4xl:grid-cols-3">
          {mensagens.map((mensagem, indice) => (
            <li key={mensagem.id} className="flex min-w-0">
              <article aria-labelledby={`mensagem-${mensagem.id}`} className="flex w-full flex-col gap-3 rounded-3xl bg-superficie p-5 md:p-6">
                <div className="flex items-center gap-2 text-xs text-texto-3 tabular-nums">
                  {String(indice + 1).padStart(2, "0")}
                  <span className="font-semibold text-texto-2">{mensagem.titulo}</span>
                  {mensagem.rascunho && (
                    <Tag tom="acao" tamanho="sm" ponto>
                      rascunho
                    </Tag>
                  )}
                  <MenuPonto
                    ponto={`a mensagem ${mensagem.titulo.toLowerCase()}`}
                    className="-my-1 -me-2 ms-auto"
                    aoExcluir={() => excluir(mensagem)}
                    excluirBloqueado={sozinha ? "fica pelo menos uma" : undefined}
                  />
                </div>
                <h3 id={`mensagem-${mensagem.id}`} className="text-destaque leading-snug font-medium">
                  {mensagem.frase}
                </h3>
                <p className="text-sm text-texto-2">{mensagem.explicacao}</p>
                <div className="mt-auto flex flex-col gap-2 border-t border-borda-sutil pt-4">
                  <h4 className="text-xs font-semibold text-texto-2">Palavras que carregam essa ideia</h4>
                  {mensagem.palavras.length > 0 ? (
                    <ul className="flex flex-wrap gap-1.5">
                      {mensagem.palavras.map((palavra) => (
                        <li key={palavra}>
                          <Tag>{palavra}</Tag>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-texto-3">Eu escolho a partir da frase.</p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>

      <VerMais resumo={`Exemplos prontos de cada mensagem em rótulo, post, loja e e-mail da ${marca.nome}`}>
        <section aria-labelledby="titulo-exemplos-mensagens" className="flex flex-col gap-3">
          <CabecalhoBloco id="titulo-exemplos-mensagens" titulo="exemplos de uso" />
          <ul className="flex flex-col gap-3">
            {mensagens.map((mensagem) => (
              <li key={mensagem.id} className="grid grid-cols-1 gap-3 rounded-3xl bg-superficie p-5 md:p-6 @3xl:grid-cols-[12rem_minmax(0,1fr)]">
                <h3 className="text-sm font-semibold">{mensagem.titulo}</h3>
                {mensagem.exemplos.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-[96px_1fr]">
                    {mensagem.exemplos.map((exemplo) => (
                      <div key={exemplo.onde} className="contents">
                        <dt className="text-xs text-texto-3 sm:pt-0.5">{exemplo.onde}</dt>
                        <dd className="text-sm">“{exemplo.texto}”</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-texto-3">Eu escrevo os exemplos de rótulo, post, loja e e-mail a partir da frase.</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </VerMais>

      <FormMensagem
        aberta={adicionando}
        aoMudar={setAdicionando}
        aoAdicionar={(mensagem) => {
          salvarMensagensChave([...mensagens, mensagem])
          notificar({ titulo: "mensagem anotada", texto: "Eu completo a explicação e os exemplos de uso a partir da frase.", tipo: "sucesso" })
        }}
      />
    </div>
  )
}

function FormMensagem({ aberta, aoMudar, aoAdicionar }: { aberta: boolean; aoMudar: (aberta: boolean) => void; aoAdicionar: (mensagem: MensagemChave) => void }) {
  const [erro, setErro] = useState("")

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const form = evento.currentTarget
    const dados = new FormData(form)
    const frase = String(dados.get("frase") ?? "").trim()
    if (!frase) {
      setErro("Escreva a ideia que a marca quer repetir.")
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid=true]")?.focus())
      return
    }
    aoAdicionar({
      id: `mensagem-${Date.now()}`,
      titulo: String(dados.get("titulo") ?? "").trim() || "Nova mensagem",
      frase,
      explicacao: "Eu escrevo a explicação a partir da frase.",
      palavras: String(dados.get("palavras") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      exemplos: [],
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
      titulo="nova mensagem-chave"
      descricao="Uma ideia que a marca quer deixar na cabeça de quem lê. Eu completo a explicação e os exemplos."
      rodape={
        <Botao variante="primario" tamanho="sm" type="submit" form="form-mensagem">
          <Plus /> Adicionar mensagem
        </Botao>
      }
    >
      <form id="form-mensagem" onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <CampoArea name="frase" rotulo="A mensagem" placeholder="Ex.: Cada pote volta para a gente e vira outro." erro={erro} compacto autoFocus />
        <Campo name="titulo" rotulo="Nome curto" dica="Opcional" placeholder="Ex.: Retorno" />
        <Campo name="palavras" rotulo="Palavras que carregam a ideia" dica="Opcional. Separe por vírgula." placeholder="Ex.: retorno, vidro, ciclo" />
      </form>
    </Janela>
  )
}
