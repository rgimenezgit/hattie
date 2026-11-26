# Decisões técnicas

Mais recente primeiro. Formato: data, decisão, motivo.

- 2026-11-26: No acesso da banca, as áreas fechadas ficam desativadas (sem clique, fora do Tab, `aria-disabled`) em vez de abrir um aviso; o endereço digitado volta para o cérebro (`PortaoBanca` no layout raiz). Helper `fechar()` em `src/lib/banca.ts`. Motivo: feedback do Raphael nos testes; a banca nem chega a uma tela fechada.
- 2026-11-26: Acesso da banca, ligado pelo cartão lima do mapa das telas e guardado no navegador (`localStorage`, chave `hattie-banca`). Liberado: entrada, primeiro acesso, conversa de criação, criando, escolhas, olha como ficou, cérebro e parceiros (contratar, perfil e mensagens). O resto aparece no menu com cadeado e abre um aviso com o caminho de volta ao cérebro. Regra em `src/lib/banca.ts`, aviso em `components/app/Banca.tsx`. Motivo: a banca do TCC navega só o começo do fluxo sem se perder, e ainda vê o tamanho do produto.
- 2026-11-26: Gerador de grafismo no mapa das telas (`/ferramentas/gerador/index.html`). O arquivo continua em `marca/04-visual/design-system/components/Gerador/`; `scripts/copiar-ferramentas.mjs` copia o gerador e as fontes para `public/ferramentas/` antes do `dev` e do `build`, e essa cópia fica fora do git. Motivo: uma fonte da verdade só. O atalho por link simbólico fazia o Tailwind ler arquivos de fora do app e o Turbopack travava.
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


## 11/11/2026 · Google Fonts na Tipografia

- **Carregar fontes**: API de CSS do Google Fonts (`fonts.googleapis.com/css2`), injetada sob demanda por `lib/usarFonteGoogle.ts`. Não precisa de chave.
- **Catálogo**: rota `app/api/fontes/route.ts`. Com `GOOGLE_FONTS_API_KEY` no ambiente (`.env.local`), busca a Web Fonts Developer API do Google ordenada por popularidade e guarda por um dia (`use cache` + `cacheLife("days")`). Sem a chave, devolve a lista curada de `lib/fontes.ts`.
- **Motivo**: o espaço de teste da Tipografia funciona como um site de fontes; o protótipo roda sem chave e ganha o catálogo inteiro quando ela existir.
- **Fonte da cliente**: Fraunces via `next/font/google` (`--font-marca`, sem preload), só para prévias de marca da cliente.


## 20/11/2026 · Geração de imagem com a fal.ai em Projetos

- **Rota**: `app/api/imagem/route.ts` (POST). Chama a fal.ai pelo endereço síncrono (`https://fal.run/…`), sem instalar biblioteca. Modelo `fal-ai/nano-banana-2`; com imagem de referência, a versão `/edit`. As opções da barra de geração vão direto: proporção em `aspect_ratio` e resolução (1K, 2K, 4K) em `resolution`.
- **Chave**: `FAL_KEY` em `plataforma/app/.env.local`, que fica fora do Git. A chave só existe no servidor.
- **Sem a chave**: a rota responde 503 `sem-chave` e o app segue com os desenhos de exemplo, como antes. O protótipo continua rodando sem conta na fal.ai.
- **Publicado**: a rota fica desligada (403 `desligado`), para ninguém gastar os créditos de quem publicou. `FAL_PUBLICO=sim` liga de propósito.
- **Pedido ao modelo**: `lib/promptImagem.ts` junta o que a pessoa escreveu com o estilo de fotografia ou de ilustração da marca que está no cérebro (cor com hex, luz, câmera, o que evitar).
- **Onde entra**: `EstadoProjetos.pedir`. Só pedidos de imagem vão para a fal.ai; peça, vídeo e texto continuam de exemplo. Em "Pedir ajuste", a imagem original segue como referência quando já é uma imagem gerada.
- **Limites desta versão**: as imagens geradas ficam nos endereços da fal.ai e somem do projeto ao recarregar a página, como o resto do estado. Guardar de verdade depende de decidir onde ficam os arquivos.
- **Motivo da escolha**: é o provedor que o Raphael já usa, e o modelo aceita as mesmas proporções e resoluções da barra de geração. Não é a decisão final do provedor de imagem do produto.

## 20/11/2026 · Imagens de exemplo da Raiz Natural, geradas com a fal.ai

- **Roteiro**: `app/scripts/imagens-marca/gerar.mjs`. Lista as 25 imagens, com o modelo, a proporção, as referências e o prompt de cada uma. Gera só o que falta (`node scripts/imagens-marca/gerar.mjs`), refaz as que forem nomeadas e mostra o plano sem gastar com `--lista`. Salva em `app/public/marcas/raiz-natural/` e anota cada pedido em `prompts.json`.
- **Modelos, como o Raphael definiu**: Seedream 5.5 (texto para imagem) para fotografias e ilustrações da marca; Seedream 5.5 Edit quando a foto precisa do logo; GPT Image 2 Edit para os mockups da tela "olha como ficou" (primeira etapa de aprovação), com o logo; GPT Image 2.6 Sunburst Edit para inserir o produto numa cena. Tudo em 1K; nos modelos da OpenAI, qualidade média.
- **Prompts**: cada pedido leva os parâmetros do estilo do cérebro. Fotografia: as seis camadas do estilo Origem natural (cor com hex, luz, câmera, pessoas, ambiente, acabamento) e o que evitar. Ilustração: as seis camadas do Caderno de campo, com reforço de cor 100% chapada.
- **Referências**: o logo (composto e só o símbolo) foi desenhado no navegador com a fonte da marca e salvo em `ref/`. O frasco de óleo de pequi foi gerado primeiro, com o logo no rótulo, e serve de produto nas inserções.
- **Onde aparecem**: os quatro mockups em "olha como ficou"; as seis fotos e as seis ilustrações nos estilos do cérebro (prévia e cards); as oito fotos da Biblioteca, que também aparecem nos projetos; e as peças da marca, que usam a foto da cena que combina com cada layout.
- **Sem a chave**: nada muda para quem abre o app; as imagens são arquivos do próprio app. A chave só é usada para gerar de novo.
- **O MCP da fal.ai** não estava disponível nesta sessão; os detalhes dos modelos (parâmetros e preço) vieram do catálogo público da fal.ai.
