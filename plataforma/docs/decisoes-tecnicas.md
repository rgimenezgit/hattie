# Decisões técnicas

Mais recente primeiro. Formato: data, decisão, motivo.

- 2026-11-09: Telas refeitas a partir do Figma do Raphael. As telas da rodada de 03/11 (wireframes próprios) foram removidas. Motivo: a estrutura desenhada por ele é a referência; o código agora segue esse desenho e padroniza componentes. Rotas em `arquitetura.md`.
- 2026-11-09: Estado do app em `EstadoProvider` no layout raiz (marca em criação, conversa, plano e status das seções). Motivo: o fluxo atravessa layouts diferentes (primeiro acesso, shell da marca, tela de criação) sem perder o que a pessoa já respondeu.
- 2026-11-09: Shell da marca com altura de tela e rolagem só dentro do canvas e das colunas, também no celular. Contêineres de rolagem levam `relative` para que textos `sr-only` não escapem e estiquem a página. Motivo: campo de conversa sempre visível e colunas independentes.
- 2026-11-09: Raios do Tailwind alinhados ao Design System: `rounded-2xl` = 16, `rounded-3xl` = 24, `rounded-4xl` = 32. Motivo: o mapa anterior levava `3xl` à pílula.

- 2026-11-03: Wireframes do núcleo do MVP construídos como rotas reais do app, com dados fictícios em `src/lib/mock/`. Motivo: o código vira a base do produto e os wireframes ficam navegáveis para validar com usuários e com a banca. Rotas e camadas em `arquitetura.md`.
- 2026-11-03: `typedRoutes` ligado. Páginas de `[marca]` resolvem os parâmetros dentro de `Suspense` (`ComMarca`). Motivo: com `cacheComponents`, ler `params` fora de `Suspense` impede a navegação instantânea.
- 2026-11-03: Ícones da marca renderizados por `mask-image` (`IconeHattie`) a partir de cópias limpas em `public/icones/` (sem os metadados C2PA de ~8 KB por arquivo). Motivo: herdam a cor do texto sem loader de SVG, e o Next só importa arquivos de dentro do app.
- 2026-11-03: Mapeamento do shadcn trocado para neutros: `card`, `popover` e `sidebar` em `--bg`; `muted`, `secondary` e `accent` em `--neutro-hover`; `destructive` em `--ink`. O lilás-suave fica para a voz do Hattie. Motivo: respeitar a proporção 90/8/2 da plataforma. Provisório até a decisão em `marca/05-decisoes/alinhamentos.md`.
- 2026-11-03: `dark:` do Tailwind passa a valer para `[data-theme="noturno"]`. Cores do dithercn mapeadas para a paleta do Hattie (sem laranja). Motivo: um só sistema de temas.
- 2026-11-03: Mantido o pacote `cn` em `lib/utils.ts`. Motivo: é o substituto oficial do shadcn para `clsx` + `tailwind-merge`, e os componentes do preset Nova importam dele.

- 2026-11-03: Stack escolhida — Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, em `plataforma/app/`. Motivo: a maioria das bibliotecas e registries que vamos usar para construir os componentes e grafismos da plataforma (react-bits, dithercn, 21st.dev, Astryx Design + StyleX) são feitos para projetos React/shadcn; Tailwind facilita mapear os tokens de `marca/04-visual/design-system/tokens.css` direto para classes utilitárias e temas (`gabinete`, `noturno`, `palco`, `intenso`).
- 2026-11-03: shadcn/ui inicializado com base Radix (`-b radix`) e preset Nova. Tokens do Hattie plugados em `src/app/hattie-tokens.css` + mapeamento em `globals.css` (`--color-primary` = `--action` etc.), em vez da paleta cinza padrão do shadcn. Tema por `data-theme` no `<html>` (`gabinete`/`noturno`/`palco`/`intenso`). O ajuste do `dark:` está na entrada acima.
- 2026-11-03: Instalado `react-bits` (componente `SplitText` via registry shadcn) e `dithercn` (engine de dither via registry shadcn) para os grafismos/efeitos visuais da plataforma. `p5`, `ogl` e `calligraph` instalados como dependências para prototipar grafismos, shaders e o zuum — ainda não usados em nenhuma tela.
- 2026-11-03: Avaliado e NÃO instalado o Astryx Design System (`@astryxdesign/*` + StyleX) — StyleX é um motor de estilos (CSS-in-JS atômico) concorrente do Tailwind, e misturar os dois no mesmo app criaria duas formas de estilizar a mesma coisa. Fica como referência de padrões, não como dependência.
