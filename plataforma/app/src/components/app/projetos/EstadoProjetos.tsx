"use client"

import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { notificar } from "@/components/hattie/Notificacao"
import { agoraProjeto, lerPedido, novoId, proximoLugar, type OpcoesPedido } from "@/lib/projetos"
import { PROJETOS_MARCA, type ItemProjeto, type MensagemProjeto, type ProjetoMarca, type TipoProjeto } from "@/lib/mock"
import { useMarca } from "../MarcaContexto"
import { useSistemaMarca } from "../SistemaMarca"

/*
 * Estado dos projetos da marca, compartilhado entre a lista e o projeto aberto.
 * Vive no layout da área, então o que a pessoa cria continua ali enquanto ela navega entre a lista e os projetos.
 * Nesta versão de teste, tudo fica no navegador e volta ao exemplo quando a página recarrega.
 */

type Contexto = {
  projetos: ProjetoMarca[]
  definir: (projetos: ProjetoMarca[]) => void
  mudar: (id: string, mudanca: (projeto: ProjetoMarca) => ProjetoMarca) => void
  /** Cria o projeto e devolve o id. Com `pedido`, o Hattie começa a criar assim que o projeto abre. */
  criar: (dados: { nome: string; descricao: string; tipo: TipoProjeto }, pedido?: string) => string
  /** Pedido que espera o projeto novo abrir. */
  pendente: { projeto: string; texto: string } | null
  limparPendente: () => void
  /** id do projeto em que o Hattie está criando agora. */
  criando: string | null
  /** Manda um pedido ao Hattie. Os itens nascem na página como espaço reservado e ficam prontos em seguida. Devolve os ids. */
  pedir: (projetoId: string, pagina: string, texto: string, opcoes?: OpcoesPedido) => string[]
}

const Ctx = createContext<Contexto | null>(null)

type ImagemGerada = { url: string; largura: number | null; altura: number | null }

/** Proporção que o modelo aceita mais perto da largura sobre altura do item. */
function proporcaoMaisPerto(valor: number) {
  const aceitas: [string, number][] = [
    ["1:1", 1],
    ["4:5", 4 / 5],
    ["3:4", 3 / 4],
    ["2:3", 2 / 3],
    ["9:16", 9 / 16],
    ["4:3", 4 / 3],
    ["3:2", 3 / 2],
    ["16:9", 16 / 9],
  ]
  return aceitas.reduce((melhor, atual) => (Math.abs(atual[1] - valor) < Math.abs(melhor[1] - valor) ? atual : melhor))[0]
}

export function EstadoProjetosProvider({ children }: { children: ReactNode }) {
  const marca = useMarca()
  const sistema = useSistemaMarca()
  // Os projetos de exemplo são da Raiz Natural; as outras marcas começam vazias.
  const [projetos, definir] = useState<ProjetoMarca[]>(marca.slug === "raiz-natural" ? PROJETOS_MARCA : [])
  const [criando, setCriando] = useState<string | null>(null)
  const [pendente, setPendente] = useState<{ projeto: string; texto: string } | null>(null)
  const limparPendente = useCallback(() => setPendente(null), [])
  const espera = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** A rota de imagem respondeu que não há chave (ou que está desligada): não adianta perguntar de novo. */
  const semGeracao = useRef(false)
  const atual = useRef(projetos)
  useEffect(() => {
    atual.current = projetos
  }, [projetos])
  useEffect(() => () => void (espera.current && clearTimeout(espera.current)), [])

  const mudar = useCallback((id: string, mudanca: (projeto: ProjetoMarca) => ProjetoMarca) => {
    definir((lista) => lista.map((projeto) => (projeto.id === id ? { ...mudanca(projeto), atualizado: agoraProjeto() } : projeto)))
  }, [])

  const criar = useCallback((dados: { nome: string; descricao: string; tipo: TipoProjeto }, pedido?: string) => {
    const id = novoId("projeto")
    const novo: ProjetoMarca = {
      id,
      ...dados,
      situacao: "andamento",
      atualizado: agoraProjeto(),
      pastas: [],
      paginas: [{ id: "pagina-1", nome: "Página 1" }],
      itens: [],
      conversa: [],
    }
    definir((lista) => [novo, ...lista])
    if (pedido) setPendente({ projeto: id, texto: pedido })
    return id
  }, [])

  const pedir = useCallback(
    (projetoId: string, pagina: string, texto: string, opcoes: OpcoesPedido = {}) => {
      const projeto = atual.current.find((item) => item.id === projetoId)
      if (!projeto) return []
      const nomePagina = projeto.paginas.find((item) => item.id === pagina)?.nome ?? "esta página"
      const { esbocos, resposta } = lerPedido(texto, sistema.cores, opcoes)
      const naPagina = projeto.itens.filter((item) => item.pagina === pagina)
      // Nova versão de um item: ao lado dele, se couber; se já houver algo ali, embaixo, alinhada com ele.
      const aoLado = opcoes.sobre ? { x: opcoes.sobre.x + opcoes.sobre.l + 48, y: opcoes.sobre.y } : null
      const largura = esbocos.reduce((soma, esboco) => soma + esboco.l + 48, -48)
      const altura = Math.max(...esbocos.map((esboco) => esboco.a))
      const ocupado = aoLado && naPagina.some((item) => item.x < aoLado.x + largura && item.x + item.l > aoLado.x && item.y < aoLado.y + altura && item.y + item.a > aoLado.y)
      const origem = aoLado ? (ocupado ? { x: opcoes.sobre!.x, y: proximoLugar(naPagina).y } : aoLado) : opcoes.ponto ? { x: opcoes.ponto.x - largura / 2, y: opcoes.ponto.y - altura / 2 } : proximoLugar(naPagina)
      let cursor = origem.x
      const quando = agoraProjeto()
      const novos: ItemProjeto[] = esbocos.map((esboco) => {
        const item: ItemProjeto = {
          ...esboco,
          id: novoId("item"),
          pagina,
          x: cursor,
          y: origem.y,
          autor: "hattie",
          criado: quando,
          criando: true,
          pedido: opcoes.sobre?.pedido ? `${opcoes.sobre.pedido} Ajuste: ${texto}` : texto,
          geracao: opcoes.geracao ?? opcoes.sobre?.geracao,
        }
        cursor += esboco.l + 48
        return item
      })
      const ids = novos.map((item) => item.id)
      const daPessoa: MensagemProjeto = { id: novoId("msg"), autor: "pessoa", texto, pagina, quando, sobre: opcoes.sobre?.nome }

      mudar(projetoId, (anterior) => ({ ...anterior, itens: [...anterior.itens, ...novos], conversa: [...anterior.conversa, daPessoa] }))
      setCriando(projetoId)

      /** Fecha o pedido: com `reais`, os itens ganham as imagens geradas; sem, ficam com o desenho de exemplo. */
      const concluir = (reais?: ImagemGerada[]) => {
        setCriando(null)
        const doHattie: MensagemProjeto = { id: novoId("msg"), autor: "hattie", texto: resposta(nomePagina, sistema.nome), pagina, quando: agoraProjeto(), itens: reais ? ids.slice(0, reais.length) : ids }
        mudar(projetoId, (anterior) => ({
          ...anterior,
          itens: anterior.itens.flatMap((item) => {
            const indice = ids.indexOf(item.id)
            if (indice < 0) return [item]
            if (!reais) return [{ ...item, criando: false }]
            const real = reais[indice]
            // Vieram menos imagens do que o pedido: o espaço reservado que sobrou sai.
            if (!real) return []
            const l = real.largura && real.altura ? Math.round((item.a * real.largura) / real.altura) : item.l
            return [{ ...item, criando: false, l, previa: { tipo: "enviada" as const, url: real.url }, geracao: { ...item.geracao, real: true } }]
          }),
          conversa: [...anterior.conversa, doHattie],
        }))
      }
      const exemplo = (demora: number) => {
        if (espera.current) clearTimeout(espera.current)
        espera.current = setTimeout(() => {
          espera.current = null
          concluir()
        }, demora)
      }

      // Só imagens e com a geração ligada: pede ao modelo de verdade. No resto, o desenho de exemplo.
      const soImagens = esbocos.every((esboco) => esboco.tipo === "imagem")
      if (!soImagens || semGeracao.current) {
        exemplo(1800)
        return ids
      }
      const original = opcoes.sobre?.previa?.tipo === "enviada" ? opcoes.sobre.previa.url : undefined
      const referencias = [opcoes.referenciaUrl, original].filter((url): url is string => !!url && /^(https:\/\/|data:image\/)/.test(url))
      const proporcao = opcoes.geracao?.proporcao ?? (opcoes.formato ? `${opcoes.formato[0]}:${opcoes.formato[1]}` : proporcaoMaisPerto(esbocos[0].l / esbocos[0].a))
      fetch("/api/imagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedido: opcoes.sobre ? `${opcoes.sobre.pedido ?? opcoes.sobre.nome}. Mudança pedida: ${texto}` : texto,
          marca: sistema.nome,
          estilo: opcoes.geracao?.estilo,
          proporcao,
          resolucao: opcoes.geracao?.resolucao ?? "1K",
          quantidade: esbocos.length,
          referencias,
        }),
      })
        .then(async (resposta) => {
          const dados = (await resposta.json().catch(() => ({}))) as { imagens?: ImagemGerada[]; erro?: string }
          if (resposta.ok && dados.imagens?.length) return concluir(dados.imagens)
          if (dados.erro === "sem-chave" || dados.erro === "desligado") {
            semGeracao.current = true
            return exemplo(1200)
          }
          concluir()
          notificar({
            titulo: "não consegui gerar agora",
            texto:
              dados.erro === "chave-recusada"
                ? "A fal.ai recusou a chave ou a conta está sem saldo. Deixei um exemplo no lugar."
                : dados.erro === "demorou"
                  ? "A geração demorou mais do que o esperado. Deixei um exemplo no lugar; vale pedir de novo."
                  : "A geração falhou. Deixei um exemplo no lugar; vale pedir de novo.",
            tipo: "atencao",
          })
        })
        .catch(() => {
          concluir()
          notificar({ titulo: "não consegui gerar agora", texto: "Não consegui falar com o servidor. Deixei um exemplo no lugar; vale pedir de novo.", tipo: "atencao" })
        })
      return ids
    },
    [mudar, sistema.cores, sistema.nome],
  )

  const valor = useMemo(
    () => ({ projetos, definir, mudar, criar, criando, pedir, pendente, limparPendente }),
    [projetos, mudar, criar, criando, pedir, pendente, limparPendente],
  )
  return <Ctx value={valor}>{children}</Ctx>
}

export function useProjetos() {
  const contexto = use(Ctx)
  if (!contexto) throw new Error("useProjetos precisa estar dentro do EstadoProjetosProvider")
  return contexto
}

/* ---------- Ações de um projeto aberto ---------- */

export type AcoesProjeto = ReturnType<typeof useAcoesProjeto>

/** Tudo que dá para fazer dentro de um projeto: itens, páginas e pastas. Apagar sempre traz "Desfazer". */
export function useAcoesProjeto(projeto: ProjetoMarca) {
  const { mudar, projetos, definir } = useProjetos()
  const id = projeto.id

  return useMemo(() => {
    const desfazer = (texto: string) => {
      const antes = projetos
      notificar({ titulo: "apagado", texto, som: "puff", acao: { rotulo: "Desfazer", aoClicar: () => definir(antes) } })
    }
    return {
      adicionarItem: (item: Omit<ItemProjeto, "id" | "criado">) => {
        const novo: ItemProjeto = { ...item, id: novoId("item"), criado: agoraProjeto() }
        mudar(id, (anterior) => ({ ...anterior, itens: [...anterior.itens, novo] }))
        return novo.id
      },
      atualizarItens: (ids: string[], mudanca: Partial<ItemProjeto> | ((item: ItemProjeto) => Partial<ItemProjeto>)) =>
        mudar(id, (anterior) => ({
          ...anterior,
          itens: anterior.itens.map((item) => (ids.includes(item.id) ? { ...item, ...(typeof mudanca === "function" ? mudanca(item) : mudanca) } : item)),
        })),
      removerItens: (ids: string[]) => {
        if (ids.length === 0) return
        const nomes = projeto.itens.filter((item) => ids.includes(item.id))
        mudar(id, (anterior) => ({ ...anterior, itens: anterior.itens.filter((item) => !ids.includes(item.id)) }))
        desfazer(nomes.length === 1 ? `Tirei "${nomes[0].nome}" do projeto.` : `Tirei ${nomes.length} itens do projeto.`)
      },
      /** Tira um item sem aviso (um texto que ficou vazio, por exemplo). */
      descartarItem: (item: string) => mudar(id, (anterior) => ({ ...anterior, itens: anterior.itens.filter((atual) => atual.id !== item) })),
      duplicarItens: (ids: string[]) => {
        const copias = projeto.itens
          .filter((item) => ids.includes(item.id))
          .map((item) => ({ ...item, id: novoId("item"), nome: `${item.nome} (cópia)`, x: item.x + 32, y: item.y + 32, criado: agoraProjeto(), autor: "voce" as const, arquivo: undefined }))
        mudar(id, (anterior) => ({ ...anterior, itens: [...anterior.itens, ...copias] }))
        return copias.map((item) => item.id)
      },
      moverItens: (ids: string[], pagina: string) => {
        const destino = projeto.paginas.find((item) => item.id === pagina)
        const lugar = proximoLugar(projeto.itens.filter((item) => item.pagina === pagina))
        let cursor = lugar.x
        mudar(id, (anterior) => ({
          ...anterior,
          itens: anterior.itens.map((item) => {
            if (!ids.includes(item.id)) return item
            const movido = { ...item, pagina, x: cursor, y: lugar.y }
            cursor += item.l + 48
            return movido
          }),
        }))
        notificar({ titulo: "movido", texto: `${ids.length === 1 ? "O item foi" : `${ids.length} itens foram`} para ${destino?.nome ?? "outra página"}.`, tipo: "sucesso" })
      },
      novaPagina: (pasta?: string) => {
        const novo = novoId("pagina")
        mudar(id, (anterior) => ({ ...anterior, paginas: [...anterior.paginas, { id: novo, nome: `Página ${anterior.paginas.length + 1}`, pasta }] }))
        return novo
      },
      renomearPagina: (pagina: string, nome: string) => mudar(id, (anterior) => ({ ...anterior, paginas: anterior.paginas.map((item) => (item.id === pagina ? { ...item, nome } : item)) })),
      moverPagina: (pagina: string, pasta?: string) =>
        mudar(id, (anterior) => ({ ...anterior, paginas: anterior.paginas.map((item) => (item.id === pagina ? { ...item, pasta } : item)) })),
      removerPagina: (pagina: string) => {
        const alvo = projeto.paginas.find((item) => item.id === pagina)
        const quantos = projeto.itens.filter((item) => item.pagina === pagina).length
        mudar(id, (anterior) => ({
          ...anterior,
          paginas: anterior.paginas.filter((item) => item.id !== pagina),
          itens: anterior.itens.filter((item) => item.pagina !== pagina),
        }))
        desfazer(`Tirei a página ${alvo?.nome ?? ""}${quantos ? ` e ${quantos === 1 ? "o item que estava" : `os ${quantos} itens que estavam`} nela` : ""}.`)
      },
      novaPasta: () => {
        const nova = novoId("pasta")
        mudar(id, (anterior) => ({ ...anterior, pastas: [...anterior.pastas, { id: nova, nome: "Nova pasta" }] }))
        return nova
      },
      renomearPasta: (pasta: string, nome: string) => mudar(id, (anterior) => ({ ...anterior, pastas: anterior.pastas.map((item) => (item.id === pasta ? { ...item, nome } : item)) })),
      removerPasta: (pasta: string) => {
        const alvo = projeto.pastas.find((item) => item.id === pasta)
        mudar(id, (anterior) => ({
          ...anterior,
          pastas: anterior.pastas.filter((item) => item.id !== pasta),
          paginas: anterior.paginas.map((item) => (item.pasta === pasta ? { ...item, pasta: undefined } : item)),
        }))
        desfazer(`Tirei a pasta ${alvo?.nome ?? ""}. As páginas dela continuam no projeto.`)
      },
    }
  }, [id, mudar, projeto, projetos, definir])
}
