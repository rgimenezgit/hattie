import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Tag } from "@/components/hattie/Tag"
import { Logo } from "./Logo"
import { cn } from "@/lib/utils"
import type { Marca, Secao } from "@/lib/mock"

export function PreviaSecao({ secao, modo, marca }: { secao: Secao; modo: "card" | "completo"; marca: Marca }) {
  const { conteudo } = secao
  const card = modo === "card"
  const VERDE = marca.paleta[0].hex
  const CREME = marca.paleta[2]?.hex ?? marca.paleta[0].hex

  switch (conteudo.tipo) {
    case "texto":
      return <p className={cn("leading-relaxed text-texto-2", card ? "line-clamp-3 text-sm" : "max-w-[65ch] text-destaque leading-snug text-ink")}>{conteudo.texto}</p>

    case "blocos":
      return card ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{secao.resumo}</p>
      ) : (
        <dl className="grid grid-cols-1 gap-y-4 border-t border-borda-sutil pt-4 @2xl:grid-cols-3">
          {conteudo.blocos.map((bloco, indice) => (
            <div key={bloco.titulo} className={cn("flex flex-col gap-1 @2xl:pe-5", indice > 0 && "@2xl:border-s @2xl:border-borda-sutil @2xl:ps-5")}>
              <dt className="text-xs font-semibold text-texto-2">{bloco.titulo}</dt>
              <dd className="text-sm leading-relaxed">{bloco.texto}</dd>
            </div>
          ))}
        </dl>
      )

    case "palavras":
      return (
        <ul className="flex flex-wrap gap-2">
          {conteudo.palavras.map((palavra) => (
            <li key={palavra}>
              <Tag tamanho={card ? "md" : "lg"}>{palavra}</Tag>
            </li>
          ))}
        </ul>
      )

    case "cores":
      return (
        <ul className={cn("grid gap-2", card ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4")}>
          {conteudo.cores.map((cor) => (
            <li key={cor.hex} className="flex flex-col gap-2">
              <span
                className={cn("rounded-xl outline outline-1 -outline-offset-1 outline-black/10", card ? "h-14" : "aspect-[4/3]")}
                style={{ backgroundColor: cor.hex }}
              />
              {card ? (
                <span className="sr-only">
                  {cor.nome} {cor.hex}
                </span>
              ) : (
                <span className="flex flex-col">
                  <span className="font-medium">{cor.nome}</span>
                  <span className="text-sm text-texto-2 tabular-nums">
                    {cor.hex} · {cor.papel}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      )

    case "tipografia": {
      const combinacao = conteudo.combinacoes.find((item) => item.aposta) ?? conteudo.combinacoes[0]
      return (
        <div className="flex flex-col gap-2">
          <p className="font-serif text-[38px] leading-none tracking-tight" aria-hidden>
            Aa <span className="font-sans font-medium">Aa</span>
          </p>
          <p className="text-xs text-texto-3">
            {conteudo.combinacoes.length} combinações · minha aposta: {combinacao.display.familia} e {combinacao.texto.familia}
          </p>
        </div>
      )
    }

    case "logo": {
      const ideia = conteudo.ideias.find((item) => item.aposta) ?? conteudo.ideias[0]
      return (
        <div className="grid h-24 place-items-center rounded-2xl" style={{ backgroundColor: CREME }}>
          <Logo tipo="composta" simbolo={ideia.simbolo} nome={marca.nome} tinta={VERDE} altura={card ? 30 : 48} />
        </div>
      )
    }

    case "imagens":
      return card ? (
        <p className="line-clamp-3 leading-relaxed text-texto-2">{conteudo.descricao}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-3">
          {conteudo.legendas.map((legenda) => (
            <li key={legenda}>
              <BlocoImagem legenda={legenda} className="aspect-[4/3] rounded-3xl" cor={VERDE} fundo={CREME} />
            </li>
          ))}
        </ul>
      )

    case "mercado": {
      const diretos = conteudo.concorrentes.filter((item) => item.tipo === "direto").length
      return (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{conteudo.leituras.direto}</p>
          <p className="text-xs text-texto-3">
            {diretos} diretos · {conteudo.concorrentes.length - diretos} indiretos · {conteudo.referencias.length} referências
          </p>
        </div>
      )
    }

    case "diferenciais": {
      const ativos = conteudo.clusters.filter((cluster) => cluster.diferenciais.length > 0).length
      return (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{conteudo.principal}</p>
          <p className="text-xs text-texto-3">
            Diferenciais em {ativos} de {conteudo.clusters.length} frentes
          </p>
        </div>
      )
    }

    case "arquetipos":
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            {conteudo.primario.nome} {conteudo.primario.peso}%{conteudo.secundario && ` · ${conteudo.secundario.nome} ${conteudo.secundario.peso}%`}
          </p>
          <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{conteudo.mistura}</p>
        </div>
      )

    case "atributos":
      return (
        <ul className="flex flex-wrap gap-1.5">
          {conteudo.atributos.map((atributo) => (
            <li key={atributo.id}>
              <Tag tamanho={card ? "md" : "lg"}>{atributo.nome}</Tag>
            </li>
          ))}
        </ul>
      )

    case "voz":
      return (
        <div className="flex flex-col gap-2">
          <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{conteudo.intro}</p>
          <ul className="flex flex-wrap gap-1.5">
            {conteudo.tracos.map((traco) => (
              <li key={traco.nome}>
                <Tag tamanho="sm">{traco.nome}</Tag>
              </li>
            ))}
          </ul>
        </div>
      )

    case "nome":
      return (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-wrap gap-1.5">
            {conteudo.opcoes.map((opcao) => (
              <li key={opcao.id}>
                <Tag tamanho="md">{opcao.nome}</Tag>
              </li>
            ))}
          </ul>
          <p className="text-xs text-texto-3">{conteudo.opcoes.length} opções para escolher</p>
        </div>
      )

    case "publico":
      return (
        <div className="flex flex-col gap-3">
          <p className="line-clamp-3 text-sm leading-relaxed text-texto-2">{conteudo.macro.descricao}</p>
          <div className="flex items-center gap-2.5">
            <span className="flex -space-x-2" aria-hidden>
              {conteudo.personas.map((persona, indice) => (
                <span
                  key={persona.id}
                  className="grid size-7 place-items-center rounded-full text-xs font-semibold ring-2 ring-superficie"
                  style={{ backgroundColor: marca.paleta[indice % marca.paleta.length].hex, color: corDoTexto(marca.paleta[indice % marca.paleta.length].hex) }}
                >
                  {persona.nome[0]}
                </span>
              ))}
            </span>
            <span className="text-xs text-texto-2">
              {conteudo.publicos.length} públicos · {conteudo.personas.length} personas
            </span>
          </div>
        </div>
      )
  }
}

/** Preto #101010 ou branco #F5F5F5, o que der mais contraste sobre a cor da marca da cliente. */
export function corDoTexto(hex: string) {
  const [r, g, b] = [1, 3, 5].map((inicio) => {
    const canal = parseInt(hex.slice(inicio, inicio + 2), 16) / 255
    return canal <= 0.04045 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4
  })
  const luz = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luz > 0.18 ? "var(--preto)" : "var(--branco)"
}
