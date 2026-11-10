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

## 2. Cor

A plataforma usa os mesmos hex do Design System, organizados por papel. Proporção 90 / 8 / 2: neutros na maior parte da tela, lima como ação, o resto da paleta em pontos. Os papéis viram classes do Tailwind (`bg-preenchimento`, `text-texto-2`, `border-borda-tag`…); valores em `app/src/app/globals.css`. Vitrine: `/dev/tokens`, seção cores.

### Superfícies

| Papel | Valor | Onde |
|---|---|---|
| `fundo` | branco `#F5F5F5` | Página |
| `canvas` | cinza `#D3D3D3` a 62% sobre o branco | Painel onde o conteúdo vive e rola |
| `superficie` | branco `#F5F5F5` | Cards, composer, nota do Hattie, menus, sobre o canvas |
| `preenchimento` | preto `#101010` a 5% | Botão secundário, campo, busca, segmentado |
| `preenchimento-hover` | preto `#101010` a 9% | Hover dos preenchidos |
| `preenchimento-ativo` | preto `#101010` a 13% | Clique, menu aberto, passo atual |

### Linhas

| Papel | Valor | Onde |
|---|---|---|
| `borda-sutil` | preto `#101010` a 8% | Divisórias, hover de card |
| `borda-tag` | preto `#101010` a 16% | Contorno de tag e de campo em foco |

Contorno preto fica fora de campos, botões e cards. O único contorno de 1 px que sobra em repouso é o da tag, em `borda-tag`. O anel preto de foco do teclado continua, porque é acessibilidade.

### Texto

| Papel | Valor | Onde |
|---|---|---|
| `texto` | preto `#101010` | Texto principal |
| `texto-2` | grafite `#333333` | Apoio, ícones de interface |
| `texto-3` | cinza-médio `#6B6B6B` | Placeholder e metadado, só sobre branco (4,9:1) |

### Cor com significado

| Papel | Valor | Onde |
|---|---|---|
| Ação | lima `#E6F344` | Plimm, item ativo do rail, seletor de marca, opção ativa, passo concluído, círculo do alerta e da nota do Hattie |
| `acao-suave` | lima-suave `#F1F4C9` | Tag "esperando seu ok", banner de pendências, hover de resposta rápida |
| `acao-forte` | lima-forte `#77A00F` | Ponto de status, onda do plimm, opção escolhida |
| Confirmar | preto `#101010` com texto branco `#F5F5F5` | Botão primário, alerta, mensagem da pessoa no chat (texto lima) |
| `erro` | rosa-forte `#F53890` | Só borda de campo e ícone; a mensagem fica em preto |
| `erro-suave` | rosa-forte a 10% sobre o branco | Fundo de campo com erro |
| `info-suave` | azul `#8AD3FA` a 22% sobre o branco | Dica e informação |
| Parceiro | rosa `#FF8AE5` | Designer parceiro |
| Palco | lilás `#B19DFC` e violeta `#7F3AEF` | Painel da entrada e selo tcharam; fora das telas do app |

O Figma usava rosa para "pendente de aprovação". Ficou lima-suave: rosa é a cor do designer parceiro, e esperar aprovação é um convite para agir. Lilás saiu do alerta e da nota do Hattie (10/11/2026).

## 3. Tipografia

Clash Display 500 em minúsculas para títulos. Poppins para todo o resto, agora com a família completa (100 a 900, com itálico) em `app/src/fonts/poppins/` e `assets/fontes/poppins/`. O navegador só baixa os pesos que a tela usa. Nomes próprios mantêm a grafia ("Raiz Natural", "Marca da Bia").

### Escala

| Classe | Fonte | Tamanho / entrelinha | Uso |
|---|---|---|---|
| `text-display` | Clash 500 | 48 / 48, −2,5% | Saudação da Home, frase do palco |
| `text-titulo-1` | Clash 500 | 32 / 34, −2% | Título de tela |
| `text-titulo-2` | Clash 500 | 24 / 28, −1,5% | Cabeçalho do canvas, seções da vitrine |
| `text-titulo-3` | Clash 500 | 20 / 24, −1% | Colunas, gavetas, estado vazio |
| `text-destaque` | Poppins 300 | 18 / 27 | Resumo de proposta |
| `text-corpo` | Poppins 400 | 15 / 24 | Mensagens do chat, leitura, nota do Hattie |
| `text-sm` | Poppins 400 ou 500 | 14 / 20 | Controles, rail, listas, cards |
| `text-detalhe` | Poppins 400 ou 500 | 13 / 18 | Botão pequeno, chips, rótulo de campo, texto do alerta |
| `text-xs` | Poppins 400 | 12 / 16 | Tags e metadados |
| `text-micro` | Poppins 500 | 11 / 14, +2% | Contadores, tag pequena |

### Pesos da Poppins

| Peso | Uso |
|---|---|
| 300 Light | Resumo de proposta e números grandes |
| 400 Regular | Corpo, tags, metadados |
| 500 Medium | Botões, controles, rótulos de campo, item de lista ativo |
| 600 SemiBold | Título de card, de alerta e da nota do Hattie |
| 100, 200, 700, 800, 900 | Reservados para peças e marketing |

A hierarquia vem do contraste: título de card em 600 contra corpo em 400, botão em 500 contra tag em 400. 14 px como base da interface segue em validação (`marca/05-decisoes/alinhamentos.md` #21). Rótulos da interface em português.

## 4. Componentes

### Botões e tags

Botão age, tag descreve. As duas formas nunca se confundem:

| | Botão | Tag |
|---|---|---|
| Forma | Pílula (raio cheio) | Canto de 6 px |
| Fundo | Cheio: preto, preenchimento neutro ou lima | Transparente ou lima-suave |
| Contorno | Nenhum | 1 px em `borda-tag` |
| Texto | Poppins 500 | Poppins 400, 12 px |
| Hover e clique | Sim | Nenhum |

| `Botao` | Uso | Forma |
|---|---|---|
| `primario` | Confirmar e seguir: Entrar, Criar conta, Aprovar | Preto `#101010`, texto branco, hover grafite `#333333`, onda no clique |
| `secundario` | Ação de apoio: Editar com o Hattie, Reabrir, Baixar | `preenchimento`, hover `preenchimento-hover` |
| `fantasma` | Ícones e ações discretas | Sem fundo; `preenchimento` no hover |
| `link` | Ação em texto: Contratar um parceiro | Sublinha no hover |

Tamanhos: `sm` 32 px (13 px), `md` 40 px (14 px), `lg` 48 px (16 px); só ícone em 32, 36 e 44 px. Em tela de toque, `md` e `icone` sobem para 44 px.

`Tag` tem os tons `neutra`, `acao` (lima-suave com ponto lima-forte) e `feita` (com check), em 20, 24 e 32 px. `StatusBadge` usa a tag.

### Demais peças

| Componente | Uso | Forma |
|---|---|---|
| `Plimm` | Enviar para o Hattie e criar | Pílula lima 36/44 px (44 px em toque), ✱ e "plimm" em Clash 600 preto. Sobe 2 px com sombra sólida no hover, afunda no clique, ✱ dá meia-volta e solta faíscas |
| `Composer` | Conversa com o Hattie | Card branco raio 24, sem contorno, sombra suave. No foco ganha contorno de 1 px em `borda-tag` e sombra maior. Arrastando arquivo: anel lima-forte |
| `Campo` | Formulários | 44 px, raio 12, `preenchimento` sem contorno. Foco: clareia, contorno `borda-tag` e halo de 4 px. Erro: borda e ícone rosa-forte, fundo `erro-suave`, mensagem em preto ligada ao campo |
| `Busca` | Filtrar listas | 32 px, pílula, `preenchimento`, ícone de 14 px, Esc limpa |
| `Segmentado` | Duas opções exclusivas | Trilho `preenchimento`, opção ativa em lima, 36 px |
| `NotaHattie` | Por que o Hattie propôs algo | Card branco sobre o canvas, assinatura do Hattie num círculo lima de 28 px, título Poppins 600, texto 15 px, ação "Perguntar mais" |
| Alerta (`notificar`) | Avisos depois de uma ação | Cartão preto flutuante de até 400 px, sem contorno. Círculo de 32 px à esquerda (forma do selo ou check em lima, alerta em rosa-forte), nome do selo em Clash 600 lima, título Poppins 600, texto 13 px, botão de fechar. Erro sem selo |
| `MenuAcoes` | ⋮ de cards, mensagens, conversas | Itens com ícone Lucide, 36 px de altura |
| `EmptyState` | Áreas sem conteúdo | Ícone em círculo, título em Clash e uma frase |
| `SeloSom` | Plimm, cling, tcharam, zuum | Um selo por momento |

Regras que ficaram do Design System: um plimm por tela, um selo por momento, preço, prazo e erro sem selo nem piada.

### Raios

4, 6, 8, 12, 16, 24 e 32 px (`rounded-sm` a `rounded-4xl`). Tag 6, campo 12, card pequeno 16, card e composer 24, canvas 28. Os raios do Design System (8, 16, 24, 40) continuam nas peças de marca.

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

### Clique

| Elemento | Comportamento |
|---|---|
| Todo botão (`clique`) | Afunda para 0,97 em 80 ms, ease-out. Ao soltar, volta com mola (cubic-bezier 0,34 · 1,56 · 0,64 · 1) em 160 ms |
| Botão primário (`onda`) | Além do afundar, uma onda de 10 px em preto a 28% se abre em volta e some em 420 ms |
| Plimm | Sobe 2 px com sombra sólida no hover, afunda 2 px e para 0,97 no clique, ✱ dá meia-volta (180°) com mola em 480 ms e solta faíscas (abaixo) |

**Faíscas do plimm.** Oito glifos nascem na borda do botão (dois nas laterais, três em cima, três embaixo) e saem 9 a 16 px para fora, com atrasos de 0 a 60 ms. O voo anda em 5 degraus de pixel em 460 ms, e cada glifo percorre a escala de intensidade da marca ao contrário: nasce brilho ✦ (9 px), vira mais + (7 px, traço de 2 px) e termina em ponto quadrado de 3 px antes de sumir. Uma cor só, lima-forte `#77A00F`, que aparece sobre o branco e o canvas. Ficam fora do botão porque o Design System mantém faíscas longe da área de texto (`8-grafismo-e-gradiente.md`). Só o plimm solta faíscas: ele é um por tela, e a faísca vira a assinatura dele. O primário fica com a onda. Código: `components/hattie/Faiscas.tsx`.
| Tag | Nenhum: tag não age |

### Resto

| Situação | Regra |
|---|---|
| Hover | 150 ms, só cor ou fundo |
| Foco em campo | Clareia, contorno e halo em 150 ms |
| Rail | Largura em 200 ms, ease-out; sem animação com "reduzir movimento" |
| Entrada de bloco | Opacidade, 12 px e desfoque de 4 px em 300 ms; só opacidade com "reduzir movimento" |
| Carregando | ✱ gira; personagem flutua 6 px na tela de criação (parado com "reduzir movimento") |
| Selo | 600 ms |

Com "reduzir movimento", escala, onda, giro e faíscas saem e a cor continua mudando. Nunca `transition-all`.

## 8. Estados

| Estado | Padrão |
|---|---|
| Carregando rota | Fundo do canvas vazio dentro do `Suspense` |
| O Hattie pensando | Personagem e selo "hmm…" no chat |
| Criando a marca | Tela própria com as etapas marcando uma a uma |
| Vazio | `EmptyState` no canvas |
| Proposta | Esperando seu ok, aprovada, reaberta para ajustes |
| Passo do plano | Respondido (lima com check), conversando agora (círculo `preenchimento-ativo` com ponto pulsando), falta conversar (anel `borda-tag`), o Hattie decide (anel tracejado com o chapéu) |

## 9. Checklist antes de entregar uma tela

1. Segue a estrutura da seção 1, os papéis de cor da seção 2 e a escala da seção 3, sem tamanho de texto solto.
2. Um plimm e no máximo um selo. Nenhum contorno preto em campo, botão ou card.
3. Foco visível, alvos de 44 px nas ações principais e 32 px no resto, tudo alcançável pelo teclado.
4. Testada com "reduzir movimento" e em 375 px.
5. Texto conferido com a skill `hattie-voz` e sem as palavras evitadas do glossário.
6. Revisada com as skills `better-ui` e `userinterface-wiki`.
7. `npm run build` e `eslint` sem erro.
