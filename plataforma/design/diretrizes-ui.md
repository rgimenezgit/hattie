# Diretrizes de interface

Regras de UI da plataforma Hattie, a partir das telas que o Raphael desenhou no Figma (09/11/2026). Complementam o Design System (`marca/04-visual/design-system/`), que segue como fonte da verdade para cor, tipografia, selos, personagem e grafismo. Código: `plataforma/app/src/components/hattie/` (peças) e `src/components/app/` (telas). Vitrine: rota `/dev/tokens`.

## 1. Estrutura das telas

**Entrada** (`/criar-conta`, `/entrar`): duas colunas. À esquerda o logo grande centralizado, o título e o formulário. À direita um painel Palco (lilás `#B19DFC`, raio 32) com selo plimm, frase do Hattie, gradiente de pontos em violeta `#7F3AEF` e o personagem. No celular, só a coluna do formulário.

**Primeiro acesso** (`/comecar`): tela limpa, logo no canto, chapéu do Hattie, título "vamos tirar sua marca do chapéu", seletor Criar marca / Importar marca e o campo de conversa.

**App da marca** (`/marca/[marca]/…`), sempre igual:

| Faixa | O que tem |
|---|---|
| Topo (56 px) | Logomarca e seletor de marca (pílula lima de 36 px) |
| Rail (48 px) | Ícones da navegação em itens de 40 px; expande para 208 px no hover ou foco (atraso de 150 ms); avatar da conta embaixo |
| Coluna esquerda (256 px, opcional) | Conversas (no Hattie) ou sumário (na Marca) |
| Canvas | Painel cinza com raio 28, onde o conteúdo vive e rola; respiro interno de 24 × 20 px (16 px no celular) |
| Coluna direita (256–320 px, opcional) | Plano da criação ou "editar com o hattie" |

Margem da página de 8 px em volta de tudo e 12 px entre as faixas. Estas medidas vieram da revisão de 09/11/2026: o Raphael pediu mais espaço e respiro, margem mais fina e um rail mais rente.

O canvas começa abaixo do topo em todas as telas. No Figma ele subia até o topo na Home; unificar evita que o conteúdo pule de posição entre telas.

**Celular:** o rail vira gaveta (botão de menu no topo), as colunas viram gavetas abertas por botões no cabeçalho do canvas, e o canvas ocupa a tela com rolagem própria; o campo de conversa fica sempre fixo embaixo.

## 2. Cor e superfícies

| Papel | Valor |
|---|---|
| Fundo da página | branco `#F5F5F5` |
| Canvas | cinza `#D3D3D3` a 62% sobre o branco (`--canvas`) |
| Cards, campo de conversa, menus | branco `#F5F5F5` sobre o canvas |
| Ação e seleção | lima `#E6F344`: plimm, item ativo do rail, seletor de marca, aba ativa, chips de passo concluído |
| Esperando o seu ok | lima-suave `#F1F4C9` com ponto lima-forte `#77A00F`; card em destaque ganha borda lima |
| Voz do Hattie | lilás-suave `#E4DFF7` no bloco "por que eu propus isso" e nas notificações |
| Mensagem da pessoa no chat | bolha preta `#101010` com texto lima |
| Hover neutro | preto a 6% (`bg-ink/6`) |

O Figma usava rosa para "pendente de aprovação". Troquei por lima-suave: rosa é a cor do designer parceiro, e a marca não usa cor de alarme. Esperar aprovação é um convite para agir, e lima já é a cor da ação.

## 3. Tipografia

- Clash Display 500 em minúsculas para títulos de tela e de seção ("conversas", "plano", "visão geral"). Nomes próprios mantêm a grafia ("Raiz Natural", "Marca da Bia").
- Títulos em Clash: 48 px na saudação da Home, 32 px no título de tela grande, 21–24 px no cabeçalho do canvas e nas colunas.
- Poppins no resto: 15 px nas mensagens do chat, 14 px nos controles, no rail, nas listas e nos cards, 18 px para resumo de proposta e título de card, 12–13 px para rótulos e chips.
- O uso de 14 px como tamanho base da interface segue em validação (`marca/05-decisoes/alinhamentos.md` #21).
- Rótulos da interface em português. O Figma tinha termos em inglês (Sign Up, Plan, Overview, Edit with hattie, Hire partner, Log Out); todos foram traduzidos.

## 4. Componentes

| Componente | Uso | Forma |
|---|---|---|
| `Plimm` | Enviar para o Hattie e criar | Pílula lima 36/44 px (44 px em tela de toque), ✱ e "plimm" em Clash 600 preto; versão só ícone. Sobe 2 px com sombra sólida de 4 px no hover, desce no clique, ✱ gira ao carregar |
| `Botao` primário | Confirmar: Criar conta, Entrar, Aprovar, Criar minha marca | Pílula preta com texto branco, 40 px (32 px na versão `sm`; 44 px em tela de toque) |
| `Botao` secundário | Ação de apoio | Pílula com borda de 1,5 px |
| `Botao` terciário e fantasma | Links de ação e ícones | Texto sublinhado no hover; círculo de 36 px (32 px no `icone-sm`) com hover neutro |
| `Composer` | Toda conversa com o Hattie | Card branco raio 24, respiro de 12 px, sombra suave, campo que cresce, anexar, opções (usar o cérebro da marca, pesquisar na internet), sugerir ideia, ditado (em breve) e plimm. Enter envia, Shift+Enter quebra linha, arrastar arquivo anexa |
| `Segmentado` | Duas opções exclusivas | Trilho neutro, opção ativa em lima, 36 px |
| `Campo` | Formulários | Rótulo visível, borda cinza-médio `#6B6B6B`, 44 px, raio 12, erro com borda 2 px e mensagem ligada ao campo, senha com mostrar/esconder |
| `StatusBadge` | Status de proposta | "Esperando seu ok" (lima-suave) ou "Aprovada" (neutro com check; compacto nos cards) |
| `MenuAcoes` | ⋮ de cards, mensagens, conversas | Itens com ícone Lucide, 36 px de altura |
| `EmptyState` | Áreas sem conteúdo | Ícone em círculo, título em Clash e uma frase |
| `SeloSom` e `notificar` | Plimm, cling, tcharam, zuum | Um selo por momento; toast na voz do Hattie |

Regras que ficaram do Design System: um plimm por tela, um selo por momento, preço, prazo e erro sem selo nem piada.

## 5. Ícones

- Interface: Lucide, traço 1,75 na navegação e 2 nas ações, 20 px no rail e 16 px nos botões.
- O Hattie aparece como o personagem de chapéu (`IconeHattie nome="hattie"`), no rail, no chat e nos momentos de marca.
- "Marca" no rail usa um selo com "A", como no Figma.
- ✱ e selos de som continuam sendo desenhos da marca.

## 6. Navegação

- Rail: Início, Marca, Projetos, Biblioteca, Marketing, Hattie, Parceiros, Automações, Conectores. Item ativo em pílula lima.
- Expande depois de 150 ms de hover (evita abrir de passagem) e também ao receber foco pelo teclado; os rótulos ficam no código mesmo recolhido, para leitores de tela.
- Seletor de marca: lista das marcas com a atual marcada, Nova marca, Minhas marcas, Convidar pessoa, Compartilhar link da marca. Mostrar as marcas no próprio menu foi um acréscimo ao Figma: troca em um clique.
- Menu da conta: nome e e-mail, Configurações da conta, Ajuda, Convidar pessoa, Sair.
- "Pular para o conteúdo" é o primeiro item do teclado.

## 7. Movimento

| Situação | Regra |
|---|---|
| Hover de botão e item | 150 ms, só cor ou fundo |
| Clique | Botões a 0,96 de escala; plimm desce 2 px |
| Rail | Largura em 200 ms, ease-out; sem animação com "reduzir movimento" |
| Entrada de bloco | Opacidade, 12 px e desfoque de 4 px em 300 ms; só opacidade com "reduzir movimento" |
| Carregando | ✱ gira; personagem flutua 6 px na tela de criação (parado com "reduzir movimento") |
| Selo | 600 ms |

Nunca `transition-all`.

## 8. Estados

| Estado | Padrão |
|---|---|
| Carregando rota | Fundo do canvas vazio dentro do `Suspense` |
| O Hattie pensando | Personagem e selo "hmm…" no chat |
| Criando a marca | Tela própria com as etapas marcando uma a uma |
| Vazio | `EmptyState` no canvas |
| Proposta | Esperando seu ok, aprovada, reaberta para ajustes |
| Passo do plano | Respondido (lima com check), conversando agora (anel preto), falta conversar (anel cinza), o Hattie decide (anel tracejado com o chapéu) |

## 9. Checklist antes de entregar uma tela

1. Segue a estrutura da seção 1 e os tokens da seção 2.
2. Um plimm e no máximo um selo.
3. Foco visível, alvos de 44 px nas ações principais e 32 px no resto, tudo alcançável pelo teclado.
4. Testada com "reduzir movimento" e em 375 px.
5. Texto conferido com a skill `hattie-voz` e sem as palavras evitadas do glossário.
6. Revisada com as skills `better-ui` e `userinterface-wiki`.
7. `npm run build` e `eslint` sem erro.
