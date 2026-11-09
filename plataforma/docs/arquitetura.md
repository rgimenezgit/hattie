# Arquitetura

Estado em 09/11/2026: app Next.js 16 com as telas do Figma navegáveis e dados fictícios. Dados reais, IA, autenticação e hospedagem ainda não foram decididos.

## App (`plataforma/app`)

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Radix, preset Nova). `next.config.ts` liga `cacheComponents`, `partialPrefetching` e `typedRoutes`.

### Rotas

```
/                                        mapa das telas
/dev/tokens                              vitrine dos componentes
(entrada)/criar-conta | entrar           layout em duas colunas
comecar                                  primeiro acesso: criar ou importar
marcas                                   minhas marcas
marca/[marca]/layout.tsx                 resolve a marca (Suspense) → MarcaProvider
marca/[marca]/criando                    tela "estou criando a sua marca", fora do shell
marca/[marca]/(app)/layout.tsx           AppShell: topo, rail, conteúdo
marca/[marca]/(app)/page.tsx             Início
marca/[marca]/(app)/hattie               conversa de criação
marca/[marca]/(app)/hattie/[conversa]    criacao, nova e conversas salvas
marca/[marca]/(app)/cerebro              visão geral da marca
marca/[marca]/(app)/cerebro/[secao]      uma seção
marca/[marca]/(app)/{projetos,biblioteca,marketing,parceiros,automacoes,conectores}   estados vazios
```

### Estado

- `EstadoProvider` no layout raiz guarda a marca em criação, a conversa, o status de cada ponto do plano e de cada seção do cérebro. Abrir uma tela direto mostra a Raiz Natural já criada; começar por `/comecar` zera tudo e segue como rascunho.
- `MarcaProvider` entrega a marca da rota para as telas sem que elas leiam `params`.
- A coluna "editar com o hattie" vira gaveta abaixo de 1280 px (`useMidia`), e a escolha acontece no cliente para não abrir as duas.

### Regras do Next 16 que o código segue

- `params` é Promise. Layouts e páginas com parâmetro resolvem dentro de `Suspense` (um componente `Resolver` em cada rota), o que mantém a navegação instantânea.
- `[marca]`, `[secao]` e `[conversa]` exportam `generateStaticParams`; valor desconhecido cai em `notFound()`.
- Nada de `new Date()` em componente de servidor. A saudação da Home lê a hora no cliente com `useSyncExternalStore`.
- Rotas visitadas ficam vivas em `<Activity>`: timers de selo e de loading são limpos no cleanup de `useLayoutEffect`.
- `redirect()` dentro de página gera erro de validação de `instant`; redirects fixos, quando houver, ficam no `next.config.ts`.

### Camadas

| Camada | Onde | Hoje |
|---|---|---|
| Dados | `src/lib/mock/` | Fictícios: Bia, Raiz Natural, Doce Ateliê, plano de criação, 26 seções do cérebro, projetos e modelos |
| Peças da interface | `src/components/hattie/` | Plimm, Botao, Composer, Campo, Segmentado, StatusBadge, MenuAcoes, EmptyState, SeloSom, IconeHattie, Notificacao |
| Telas e estado | `src/components/app/` | AppShell, ChatHattie, CerebroMarca, Inicio, PrimeiroAcesso, FormEntrada, CriandoMarca, Estado |
| Componentes base | `src/components/ui/` | shadcn |
| Tokens | `src/app/hattie-tokens.css` + `globals.css` | Cópia de `marca/04-visual/design-system/tokens.css` |
| Ícones e personagem | `public/icones`, `public/personagem`, `public/logos` | Cópias limpas de `assets/` |

Os getters de `src/lib/mock/index.ts` são o ponto onde os dados reais entram: trocar por chamadas ao banco ou à API sem mexer nas telas.

## A decidir

- **Cérebro de marca:** onde e como guardar as decisões, versões e o histórico de cada seção, e como o Hattie consulta isso em cada pedido.
- **IA:** provedor de texto e de imagem, orquestração do briefing (perguntas, pesquisa, propostas por seção) e verificação de consistência das peças contra o cérebro.
- **Espaço compartilhado** entre IA, empreendedor e designer parceiro (permissões, comentários).
- **Autenticação, planos e créditos.**
- **Arquivos:** upload dos materiais do briefing e entrega de vetores utilizáveis.
- **Brandbook público** com link e controle do que é visível.
- **Titularidade e registro** dos ativos gerados (ponto jurídico aberto).
- **Hospedagem.**
