import { BlocoImagem } from "@/components/hattie/BlocoImagem"
import { Tag } from "@/components/hattie/Tag"
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
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {conteudo.blocos.map((bloco) => (
            <div key={bloco.titulo} className="flex flex-col gap-1 rounded-2xl bg-branco p-4">
              <dt className="text-sm font-medium text-texto-2">{bloco.titulo}</dt>
              <dd className="text-corpo leading-relaxed">{bloco.texto}</dd>
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

    case "tipografia":
      return card ? (
        <p className="font-serif text-[38px] leading-none tracking-tight" aria-label={`${conteudo.display} e ${conteudo.texto}`}>
          Aa <span className="font-sans font-medium">Aa</span>
        </p>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-branco p-5">
          <p className="font-serif text-[38px] leading-tight">{conteudo.amostra}</p>
          <p className="font-sans text-titulo-3">Todo frasco diz de qual lote e de qual cooperativa veio.</p>
          <p className="text-sm text-texto-2">
            Títulos em <span className="font-medium text-ink">{conteudo.display}</span> · texto em{" "}
            <span className="font-medium text-ink">{conteudo.texto}</span>
          </p>
        </div>
      )

    case "logo":
      return card ? (
        <div className="grid h-24 place-items-center rounded-2xl" style={{ backgroundColor: CREME }}>
          <span className="font-serif text-[28px]" style={{ color: VERDE }}>
            {marca.nome}
          </span>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-3">
          {conteudo.opcoes.map((opcao, indice) => (
            <li key={opcao} className="flex flex-col gap-2">
              <div className={cn("grid aspect-[4/3] place-items-center rounded-3xl", indice === 0 && "outline-2 outline-offset-2 outline-acao-forte")} style={{ backgroundColor: CREME }}>
                <span className="font-serif text-[28px]" style={{ color: VERDE }}>
                  {indice === 1 ? marca.nome.split(" ").map((parte) => parte[0]).join("") : marca.nome}
                </span>
              </div>
              <span className="text-sm">
                {opcao}
                {indice === 0 && <span className="text-texto-2"> · proposta principal</span>}
              </span>
            </li>
          ))}
        </ul>
      )

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

    case "persona":
      return card ? (
        <p className="line-clamp-3 leading-relaxed text-texto-2">
          <span className="font-medium text-ink">
            {conteudo.nome}, {conteudo.idade}.
          </span>{" "}
          {conteudo.descricao}
        </p>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-branco p-5">
          <p className="font-heading text-titulo-3 font-medium">
            {conteudo.nome}, {conteudo.idade}
          </p>
          <p className="max-w-[60ch] leading-relaxed">{conteudo.descricao}</p>
          <ul className="flex flex-wrap gap-2">
            {conteudo.habitos.map((habito) => (
              <li key={habito} className="flex h-9 items-center rounded-full bg-preenchimento px-3.5 text-sm">
                {habito}
              </li>
            ))}
          </ul>
        </div>
      )
  }
}
