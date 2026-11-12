"use client"

import { useState, type ReactNode } from "react"
import {
  ArrowRight,
  Check,
  CircleCheck,
  Download,
  FolderOpen,
  Plus,
  RotateCcw,
  Share2,
  Sparkle,
  SquarePen,
  Trash2,
  UserPlus,
} from "lucide-react"
import { Botao } from "@/components/hattie/Botao"
import { Busca } from "@/components/hattie/Busca"
import { Campo } from "@/components/hattie/Campo"
import { Composer } from "@/components/hattie/Composer"
import { EmptyState } from "@/components/hattie/EmptyState"
import { ICONES_HATTIE, IconeHattie } from "@/components/hattie/IconeHattie"
import { MenuAcoes } from "@/components/hattie/MenuAcoes"
import { PorqueHattie } from "@/components/hattie/PorqueHattie"
import { CartaoAlerta, notificar } from "@/components/hattie/Notificacao"
import { Plimm } from "@/components/hattie/Plimm"
import { Segmentado } from "@/components/hattie/Segmentado"
import { SeloSom, type Som } from "@/components/hattie/SeloSom"
import { StatusBadge } from "@/components/hattie/StatusBadge"
import { Tag } from "@/components/hattie/Tag"
import { cn } from "@/lib/utils"

const SECOES = [
  { id: "cores", titulo: "cores" },
  { id: "tipografia", titulo: "tipografia" },
  { id: "botoes", titulo: "botões" },
  { id: "plimm", titulo: "plimm" },
  { id: "tags", titulo: "tags e status" },
  { id: "campos", titulo: "campos" },
  { id: "alertas", titulo: "alertas" },
  { id: "nota", titulo: "porquê do hattie" },
  { id: "menus", titulo: "menus e vazio" },
  { id: "selos", titulo: "selos de som" },
  { id: "icones", titulo: "ícones" },
  { id: "movimento", titulo: "movimento" },
]

const SONS: Som[] = ["plimm", "hmm…", "tcharam", "cling", "zuum", "puff", "toc toc", "psiu"]

const PALETA = [
  { nome: "lima", hex: "#E6F344", classe: "bg-lima", uso: "Ação: plimm, seleção, item ativo" },
  { nome: "lima-forte", hex: "#77A00F", classe: "bg-lima-forte", uso: "Ponto de status, onda do plimm" },
  { nome: "lima-suave", hex: "#F1F4C9", classe: "bg-lima-suave", uso: "Esperando o seu ok, hover de resposta" },
  { nome: "lilás", hex: "#B19DFC", classe: "bg-lilas", uso: "Palco da entrada e selo tcharam" },
  { nome: "violeta", hex: "#7F3AEF", classe: "bg-violeta", uso: "Pontos do palco (até 2%)" },
  { nome: "rosa", hex: "#FF8AE5", classe: "bg-rosa", uso: "Designer parceiro" },
  { nome: "rosa-forte", hex: "#F53890", classe: "bg-rosa-forte", uso: "Erro: só borda e ícone" },
  { nome: "azul", hex: "#8AD3FA", classe: "bg-azul", uso: "Dica e informação, diluído" },
]

const NEUTROS = [
  { nome: "branco", hex: "#F5F5F5", classe: "bg-branco" },
  { nome: "cinza", hex: "#D3D3D3", classe: "bg-cinza" },
  { nome: "cinza-médio", hex: "#6B6B6B", classe: "bg-cinza-medio" },
  { nome: "grafite", hex: "#333333", classe: "bg-grafite" },
  { nome: "preto", hex: "#101010", classe: "bg-preto" },
]

const PAPEIS = [
  { token: "fundo", receita: "branco #F5F5F5", classe: "bg-fundo", uso: "Página" },
  { token: "canvas", receita: "cinza #D3D3D3 a 62% sobre o branco", classe: "bg-canvas", uso: "Painel onde o conteúdo vive" },
  { token: "superficie", receita: "branco #F5F5F5", classe: "bg-superficie", uso: "Cards, composer e nota sobre o canvas" },
  { token: "preenchimento", receita: "preto #101010 a 5%", classe: "bg-preenchimento", uso: "Botão secundário, campo, busca" },
  { token: "preenchimento-hover", receita: "preto #101010 a 9%", classe: "bg-preenchimento-hover", uso: "Hover dos preenchidos" },
  { token: "preenchimento-ativo", receita: "preto #101010 a 13%", classe: "bg-preenchimento-ativo", uso: "Clique, menu aberto, passo atual" },
  { token: "borda-sutil", receita: "preto #101010 a 8%", classe: "bg-borda-sutil", uso: "Divisórias" },
  { token: "borda-tag", receita: "preto #101010 a 16%", classe: "bg-borda-tag", uso: "Contorno de tag e campo em foco" },
  { token: "texto", receita: "preto #101010", classe: "bg-texto", uso: "Texto principal" },
  { token: "texto-2", receita: "grafite #333333", classe: "bg-texto-2", uso: "Texto de apoio, ícones" },
  { token: "texto-3", receita: "cinza-médio #6B6B6B", classe: "bg-texto-3", uso: "Placeholder e metadado (só sobre branco)" },
  { token: "acao-suave", receita: "lima-suave #F1F4C9", classe: "bg-acao-suave", uso: "Tag esperando o ok" },
  { token: "erro-suave", receita: "rosa-forte #F53890 a 10%", classe: "bg-erro-suave", uso: "Fundo de campo com erro" },
  { token: "info-suave", receita: "azul #8AD3FA a 22%", classe: "bg-info-suave", uso: "Dica do Hattie" },
]

const ESCALA = [
  { nome: "display", classe: "font-heading text-display font-medium lowercase", spec: "Clash 500 · 48/48 · −2,5%", uso: "Saudação da Home, entrada", amostra: "oi, bia!" },
  { nome: "titulo-1", classe: "font-heading text-titulo-1 font-medium lowercase", spec: "Clash 500 · 32/34 · −2%", uso: "Título de tela", amostra: "vamos tirar sua marca do chapéu" },
  { nome: "titulo-2", classe: "font-heading text-titulo-2 font-medium lowercase", spec: "Clash 500 · 24/28 · −1,5%", uso: "Cabeçalho do canvas", amostra: "visão geral" },
  { nome: "titulo-3", classe: "font-heading text-titulo-3 font-medium lowercase", spec: "Clash 500 · 20/24 · −1%", uso: "Colunas, gavetas, vazio", amostra: "conversas" },
  { nome: "destaque", classe: "text-destaque font-light", spec: "Poppins 300 · 18/27", uso: "Resumo de proposta", amostra: "Levar o cuidado do cerrado para a rotina de quem lê o rótulo." },
  { nome: "corpo", classe: "text-corpo", spec: "Poppins 400 · 15/24", uso: "Mensagens e leitura", amostra: "De onde vêm os seus ingredientes? Essa história pode virar o coração da marca." },
  { nome: "sm", classe: "text-sm", spec: "Poppins 400 ou 500 · 14/20", uso: "Controles, listas, cards", amostra: "Briefing de marca · Propósito · Posicionamento" },
  { nome: "detalhe", classe: "text-detalhe", spec: "Poppins 400 ou 500 · 13/18", uso: "Chips, rótulo de campo, alerta", amostra: "Experimente: Cosméticos naturais" },
  { nome: "xs", classe: "text-xs", spec: "Poppins 400 · 12/16", uso: "Tags e metadados", amostra: "editado há 2 minutos" },
  { nome: "micro", classe: "text-micro", spec: "Poppins 500 · 11/14 · +2%", uso: "Contadores e tags pequenas", amostra: "2/7" },
]

const PESOS = [
  { peso: 100, nome: "Thin" },
  { peso: 200, nome: "ExtraLight" },
  { peso: 300, nome: "Light" },
  { peso: 400, nome: "Regular" },
  { peso: 500, nome: "Medium" },
  { peso: 600, nome: "SemiBold" },
  { peso: 700, nome: "Bold" },
  { peso: 800, nome: "ExtraBold" },
  { peso: 900, nome: "Black" },
]

const USO_DOS_PESOS: Record<number, string> = {
  300: "Destaque e números grandes",
  400: "Corpo, tags",
  500: "Botões, controles, rótulos",
  600: "Título de card, título de alerta e de nota",
}

function Secao({ id, titulo, descricao, children }: { id: string; titulo: string; descricao?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-titulo`} className="flex scroll-mt-6 flex-col gap-5 border-t border-borda-sutil pt-8">
      <header className="flex flex-col gap-1">
        <h2 id={`${id}-titulo`} className="font-heading text-titulo-2 font-medium lowercase">
          {titulo}
        </h2>
        {descricao && <p className="max-w-[70ch] text-sm text-texto-2">{descricao}</p>}
      </header>
      {children}
    </section>
  )
}

function Rotulo({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium text-texto-3">{children}</p>
}

function Linha({ rotulo, children, className }: { rotulo: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Rotulo>{rotulo}</Rotulo>
      <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>
    </div>
  )
}

export function Vitrine() {
  const [busca, setBusca] = useState("")
  const [modo, setModo] = useState("criar")

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-10 px-4 py-10 md:px-8">
      <nav aria-label="Seções da vitrine" className="sticky top-10 hidden h-fit w-44 shrink-0 flex-col gap-0.5 lg:flex">
        <p className="mb-2 font-heading text-titulo-3 font-medium lowercase">vitrine</p>
        {SECOES.map((secao) => (
          <a key={secao.id} href={`#${secao.id}`} className="rounded-lg px-2 py-1.5 text-sm text-texto-2 hover:bg-preenchimento hover:text-texto">
            {secao.titulo}
          </a>
        ))}
      </nav>

      <main className="flex min-w-0 flex-1 flex-col gap-10">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-display font-medium lowercase">vitrine dos componentes</h1>
          <p className="max-w-[60ch] text-corpo text-texto-2">
            Peças da plataforma Hattie com os tokens de cor, a escala tipográfica e os estados de cada uma. Regras completas em
            plataforma/design/diretrizes-ui.md.
          </p>
        </header>

        <Secao
          id="cores"
          titulo="cores"
          descricao="Proporção 90 / 8 / 2: neutros na maior parte da tela, lima como ação e o resto da paleta em pontos. Os papéis abaixo são os nomes usados no código."
        >
          <div className="flex h-3 w-full overflow-hidden rounded-full" aria-label="Proporção 90 por cento neutros, 8 por cento lima, 2 por cento demais cores">
            <span className="w-[90%] bg-cinza" />
            <span className="w-[8%] bg-lima" />
            <span className="w-[2%] bg-violeta" />
          </div>
          <Linha rotulo="Neutros">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
              {NEUTROS.map((cor) => (
                <div key={cor.nome} className="flex flex-col gap-1.5">
                  <span className={cn("h-14 rounded-xl outline outline-1 -outline-offset-1 outline-borda-sutil", cor.classe)} />
                  <span className="text-sm font-medium">{cor.nome}</span>
                  <span className="text-xs text-texto-2 tabular-nums">{cor.hex}</span>
                </div>
              ))}
            </div>
          </Linha>
          <Linha rotulo="Paleta da marca na plataforma">
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
              {PALETA.map((cor) => (
                <div key={cor.nome} className="flex flex-col gap-1.5">
                  <span className={cn("h-14 rounded-xl", cor.classe)} />
                  <span className="text-sm font-medium">
                    {cor.nome} <span className="font-normal text-texto-2 tabular-nums">{cor.hex}</span>
                  </span>
                  <span className="text-xs text-texto-2">{cor.uso}</span>
                </div>
              ))}
            </div>
          </Linha>
          <Linha rotulo="Papéis (tokens da plataforma)">
            <div className="w-full overflow-hidden rounded-2xl bg-canvas p-1.5">
              <ul className="grid gap-1 sm:grid-cols-2">
                {PAPEIS.map((papel) => (
                  <li key={papel.token} className="flex items-center gap-3 rounded-xl bg-superficie p-2.5">
                    <span className={cn("size-9 shrink-0 rounded-lg outline outline-1 -outline-offset-1 outline-borda-sutil", papel.classe)} />
                    <span className="flex min-w-0 flex-col">
                      <span className="font-mono text-xs">{papel.token}</span>
                      <span className="truncate text-xs text-texto-2">
                        {papel.receita} · {papel.uso}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Linha>
        </Secao>

        <Secao
          id="tipografia"
          titulo="tipografia"
          descricao="Clash Display 500 em minúsculas para títulos. Poppins para todo o resto, com peso escolhido pela função. Clash 700 fica só no logotipo."
        >
          <div className="flex flex-col divide-y divide-borda-sutil rounded-2xl bg-superficie px-4">
            {ESCALA.map((nivel) => (
              <div key={nivel.nome} className="grid gap-1 py-4 md:grid-cols-[160px_1fr] md:gap-6">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-xs">{nivel.nome}</span>
                  <span className="text-xs text-texto-2">{nivel.spec}</span>
                  <span className="text-xs text-texto-3">{nivel.uso}</span>
                </div>
                <p className={cn("min-w-0", nivel.classe)}>{nivel.amostra}</p>
              </div>
            ))}
          </div>
          <Linha rotulo="Pesos da Poppins (100 a 900, com itálico)">
            <div className="grid w-full gap-2 sm:grid-cols-3">
              {PESOS.map(({ peso, nome }) => (
                <div key={peso} className={cn("flex flex-col gap-1 rounded-xl p-3", USO_DOS_PESOS[peso] ? "bg-superficie" : "bg-preenchimento")}>
                  <span className="text-titulo-3" style={{ fontWeight: peso }}>
                    Aa <span className="italic">Aa</span>
                  </span>
                  <span className="text-xs font-medium">
                    {peso} · {nome}
                  </span>
                  <span className="text-xs text-texto-2">{USO_DOS_PESOS[peso] ?? "Reservado para peças e marketing"}</span>
                </div>
              ))}
            </div>
          </Linha>
        </Secao>

        <Secao
          id="botoes"
          titulo="botões"
          descricao="Pílula cheia, Poppins 500, sem contorno. Preto confirma, preenchimento neutro apoia, fantasma fica para ícones e ações discretas. Clique para ver a animação: todo botão afunda e volta com mola; o primário solta uma onda."
        >
          <Linha rotulo="Variantes">
            <Botao variante="primario">
              <Check /> Aprovar
            </Botao>
            <Botao variante="secundario">
              <SquarePen /> Editar com o Hattie
            </Botao>
            <Botao variante="fantasma">
              <RotateCcw /> Reabrir
            </Botao>
            <Botao variante="link">Contratar um parceiro</Botao>
          </Linha>
          <Linha rotulo="Tamanhos: sm 32 · md 40 · lg 48">
            {(["sm", "md", "lg"] as const).map((tamanho) => (
              <Botao key={tamanho} variante="primario" tamanho={tamanho}>
                Continuar <ArrowRight />
              </Botao>
            ))}
            {(["sm", "md", "lg"] as const).map((tamanho) => (
              <Botao key={`s-${tamanho}`} variante="secundario" tamanho={tamanho}>
                <Download /> Baixar
              </Botao>
            ))}
          </Linha>
          <Linha rotulo="Só ícone: 32 · 36 · 44">
            <Botao variante="secundario" tamanho="icone-sm" aria-label="Novo">
              <Plus />
            </Botao>
            <Botao variante="secundario" tamanho="icone" aria-label="Compartilhar">
              <Share2 />
            </Botao>
            <Botao variante="primario" tamanho="icone-lg" aria-label="Continuar">
              <ArrowRight />
            </Botao>
            <Botao variante="fantasma" tamanho="icone" aria-label="Apagar">
              <Trash2 />
            </Botao>
          </Linha>
          <Linha rotulo="Desabilitado">
            <Botao variante="primario" disabled>
              Aprovar
            </Botao>
            <Botao variante="secundario" disabled>
              Editar
            </Botao>
            <Botao variante="fantasma" disabled>
              Reabrir
            </Botao>
          </Linha>
          <Linha rotulo="Botão ao lado de tag: forma, peso e preenchimento diferentes">
            <Botao variante="secundario" tamanho="sm">
              <Plus /> Adicionar
            </Botao>
            <Tag>cuidadosa</Tag>
            <Tag tom="acao" ponto>
              Esperando seu ok
            </Tag>
          </Linha>
        </Secao>

        <Secao
          id="plimm"
          titulo="plimm"
          descricao="Pílula lima #E6F344 que envia para o Hattie e cria. Um por tela. No clique o ✱ dá meia-volta e oito faíscas em lima-forte #77A00F saem da borda em degraus de pixel: nascem brilho, viram mais e terminam em ponto."
        >
          <Linha rotulo="Tamanhos e estados">
            <Plimm />
            <Plimm tamanho="lg" />
            <Plimm somenteIcone rotulo="Enviar" />
            <Plimm carregando />
            <Plimm disabled />
          </Linha>
        </Secao>

        <Secao
          id="tags"
          titulo="tags e status"
          descricao="Tag descreve e nunca age. Canto de 6 px, Poppins 400 em 12 px, contorno de 1 px em preto a 16%. Sem hover e sem cursor de clique."
        >
          <Linha rotulo="Tons">
            <Tag>neutra</Tag>
            <Tag tom="acao" ponto>
              ação
            </Tag>
            <Tag tom="feita">
              <Check strokeWidth={2.5} /> feita
            </Tag>
          </Linha>
          <Linha rotulo="Tamanhos: sm 20 · md 24 · lg 32">
            <Tag tamanho="sm">artesanal</Tag>
            <Tag tamanho="md">artesanal</Tag>
            <Tag tamanho="lg">artesanal</Tag>
          </Linha>
          <Linha rotulo="Status de proposta">
            <StatusBadge status="pendente" />
            <StatusBadge status="aprovada" />
            <StatusBadge status="pendente" compacto />
            <StatusBadge status="aprovada" compacto />
          </Linha>
        </Secao>

        <Secao
          id="campos"
          titulo="campos"
          descricao="Preenchimento neutro, sem contorno em repouso. No foco o campo clareia e ganha contorno de 1 px em preto a 16% e um halo leve. Erro em rosa-forte #F53890 só na borda e no ícone."
        >
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Campo rotulo="E-mail" placeholder="voce@suamarca.com.br" type="email" />
            <Campo rotulo="Nome da marca" placeholder="Raiz Natural" dica="Dá para trocar depois." />
            <Campo rotulo="Senha" type="password" placeholder="Mínimo de 8 caracteres" />
            <Campo rotulo="E-mail" defaultValue="bia@" erro="Esse e-mail ficou incompleto." />
          </div>
          <Linha rotulo="Busca (32 px)">
            <Busca valor={busca} aoMudar={setBusca} rotulo="Buscar na vitrine" className="w-64" />
          </Linha>
          <Linha rotulo="Segmentado">
            <Segmentado
              rotulo="Modo"
              valor={modo}
              onChange={setModo}
              className="max-w-sm"
              opcoes={[
                { valor: "criar", rotulo: "Criar marca", icone: Sparkle },
                { valor: "importar", rotulo: "Importar marca", icone: Download },
              ]}
            />
          </Linha>
          <div className="rounded-2xl bg-canvas p-4">
            <Composer rotulo="Pedido de teste" placeholder="o que vamos criar hoje?" onEnviar={() => notificar({ titulo: "pedido anotado", som: "plimm" })} />
          </div>
        </Secao>

        <Secao
          id="alertas"
          titulo="alertas"
          descricao="Cartão preto #101010 flutuante, sem contorno. Círculo à esquerda com a forma do selo, título em Poppins 600 e texto curto. Erro troca o círculo para rosa-forte #F53890 e não leva selo."
        >
          <div className="flex flex-col gap-3">
            <CartaoAlerta titulo="guardei no cérebro" texto="A seção Propósito está aprovada." som="cling" aoFechar={() => {}} />
            <CartaoAlerta titulo="link copiado" texto="Qualquer pessoa com o link vê o cérebro." tipo="sucesso" aoFechar={() => {}} />
            <CartaoAlerta titulo="não consegui salvar" texto="A conexão caiu. Tenta de novo em alguns segundos." tipo="erro" aoFechar={() => {}} />
          </div>
          <Linha rotulo="Disparar de verdade">
            <Botao variante="secundario" tamanho="sm" onClick={() => notificar({ titulo: "guardei no cérebro", texto: "A seção Propósito está aprovada.", som: "cling" })}>
              Com selo
            </Botao>
            <Botao variante="secundario" tamanho="sm" onClick={() => notificar({ titulo: "link copiado", tipo: "sucesso" })}>
              Sucesso
            </Botao>
            <Botao variante="secundario" tamanho="sm" onClick={() => notificar({ titulo: "não consegui salvar", texto: "Tenta de novo em alguns segundos.", tipo: "erro" })}>
              Erro
            </Botao>
          </Linha>
        </Secao>

        <Secao
          id="nota"
          titulo="porquê do hattie"
          descricao="O conteúdo da proposta fica em destaque num container branco sobre o canvas. O raciocínio do Hattie mora num ícone de informação de 32 px no canto do container e abre num diálogo, com a ação Perguntar mais."
        >
          <div className="rounded-2xl bg-canvas p-4">
            <section className="flex flex-col gap-4 rounded-3xl bg-superficie p-5 md:p-6">
              <div className="-mt-1 -me-2 flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-texto-3">Propósito</p>
                <PorqueHattie assunto="Propósito" aoPerguntar={() => notificar({ titulo: "abri a conversa", tipo: "sucesso" })}>
                  <p>Suas clientes compram pela origem. O propósito coloca essa origem no centro de tudo que a marca fala.</p>
                </PorqueHattie>
              </div>
              <p className="max-w-[60ch] text-destaque font-light">Levar o cuidado do cerrado para a rotina de quem lê o rótulo.</p>
            </section>
          </div>
        </Secao>

        <Secao id="menus" titulo="menus e vazio">
          <Linha rotulo="Menu de ações">
            <div className="flex items-center gap-2 rounded-xl bg-superficie p-2 ps-3 text-sm">
              Briefing de marca
              <MenuAcoes
                rotulo="Ações de exemplo"
                itens={[
                  { rotulo: "Aprovar", icone: CircleCheck },
                  { rotulo: "Editar com o Hattie", icone: SquarePen },
                  { rotulo: "Contratar parceiro", icone: UserPlus, separarAntes: true },
                ]}
              />
            </div>
          </Linha>
          <div className="rounded-2xl bg-canvas">
            <EmptyState
              icone={FolderOpen}
              titulo="nenhum projeto ainda"
              texto="Quando você criar a primeira peça, ela aparece aqui."
              acao={
                <Botao variante="primario" tamanho="sm">
                  <Plus /> Novo projeto
                </Botao>
              }
            />
          </div>
        </Secao>

        <Secao id="selos" titulo="selos de som" descricao="Um selo por momento, 600 ms. Clash Display 600 em minúsculas.">
          <div className="flex flex-wrap gap-3">
            {SONS.map((som) => (
              <SeloSom key={som} som={som} fixo />
            ))}
          </div>
        </Secao>

        <Secao id="icones" titulo="ícones" descricao="Desenhos da marca para o Hattie, o ✱, os selos e os momentos de marca. Lucide, traço 1,75 a 2, para a interface.">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-9">
            {ICONES_HATTIE.map((nome) => (
              <span key={nome} className="flex flex-col items-center gap-2 rounded-xl bg-superficie p-3 text-center">
                <IconeHattie nome={nome} tamanho={28} />
                <span className="text-micro text-texto-2">{nome}</span>
              </span>
            ))}
          </div>
        </Secao>

        <Secao id="movimento" titulo="movimento" descricao="Tudo respeita reduzir movimento: escala, onda, giro e faíscas saem, a cor continua mudando.">
          <div className="overflow-hidden rounded-2xl bg-superficie">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-texto-3">
                <tr className="border-b border-borda-sutil">
                  <th className="p-3 font-medium">Momento</th>
                  <th className="p-3 font-medium">Comportamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borda-sutil">
                {[
                  ["Clique em qualquer botão", "Afunda para 0,97 em 80 ms e volta com mola (cubic-bezier 0,34 · 1,56 · 0,64 · 1) em 160 ms"],
                  ["Clique no primário", "Além do afundar, onda de 10 px que some em 420 ms"],
                  ["Clique no plimm", "Sobe 2 px no hover, afunda no clique, ✱ dá meia-volta em 480 ms e solta oito faíscas em lima-forte: 16 px para fora em 5 degraus, 460 ms, brilho → mais → ponto"],
                  ["Hover", "Só cor, 150 ms"],
                  ["Foco no campo", "Clareia, contorno de 1 px e halo de 4 px, 150 ms"],
                  ["Alerta", "Entra de baixo, sai em 150 ms"],
                ].map(([momento, comportamento]) => (
                  <tr key={momento}>
                    <td className="p-3 align-top font-medium">{momento}</td>
                    <td className="p-3 text-texto-2">{comportamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Secao>
      </main>
    </div>
  )
}
