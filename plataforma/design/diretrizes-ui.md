# Diretrizes de interface

Regras de UI da plataforma Hattie, a partir das telas que o Raphael desenhou no Figma (09/11/2026). Complementam o Design System (`marca/04-visual/design-system/`), que segue como fonte da verdade para cor, tipografia, selos, personagem e grafismo. Código: `plataforma/app/src/components/hattie/` (peças) e `src/components/app/` (telas). Vitrine: rota `/dev/tokens`.

## 1. Estrutura das telas

**Entrada** (`/criar-conta`, `/entrar`): duas colunas. À esquerda o logo grande centralizado, o título e o formulário. À direita um painel Palco (lilás `#B19DFC`, raio 32) com selo plimm, frase do Hattie, gradiente de pontos em violeta `#7F3AEF` e o personagem. No celular, só a coluna do formulário.

**Primeiro acesso** (`/comecar`): tela limpa, logo no canto, chapéu do Hattie, título "vamos tirar sua marca do chapéu", seletor Criar marca / Importar marca e o campo de conversa.

**App da marca** (`/marca/[marca]/…`), sempre igual. Um palco cinza ocupa a tela, e a margem branca entra nele em três abas, com cantos côncavos onde encontra o cinza:

| Faixa | O que tem |
|---|---|
| Margem | Branco `#F5F5F5`: 20 px à esquerda, 8 px em cima, embaixo e à direita |
| Aba do topo | Fechada (76 × 60 px): só o símbolo do Hattie. Aberta (336 px): a logomarca se revela e aparece o seletor de marca (pílula lima de 36 px) |
| Aba do meio | Navegação. Fechada (76 px), acompanha a coluna de ícones em itens de 40 px; aberta (216 px), os itens viram pílulas de 184 px com rótulo |
| Aba da base | Avatar da conta (76 × 64 px) |
| Palco | Cinza `#D3D3D3` a 62% com raio 28 e sombra interna fina (`--sombra-canvas`). O conteúdo começa a 64 px da borda do palco, livre das abas |
| Coluna esquerda (256 px, opcional) | Painel branco de raio 24 sobre o palco: conversas (no Hattie) ou sumário (na Marca) |
| Canvas | Área transparente sobre o palco, onde o conteúdo vive e rola; respiro interno de 24 × 20 px (16 px no celular) |
| Coluna direita (256–320 px, opcional) | Painel branco: plano da criação ou "editar com o hattie" |

As três abas abrem juntas (a da base fica igual) no hover, com 120 ms de espera, no foco pelo teclado e enquanto o menu de marcas está aberto. Clicar num item não deixa a espinha presa aberta: ela só fica aberta pelo foco quando ele vem do teclado. A aba aberta passa por cima do palco, com sombra levíssima só do lado do cinza. Desenho das abas: `.aba` em `globals.css`; casca em `components/app/AppShell.tsx`. Desenho de referência: Figma do Raphael, 11/11/2026.

**Celular:** sem abas. Topo com menu, símbolo e seletor de marca; o rail vira gaveta, as colunas viram gavetas abertas por botões no cabeçalho do canvas, e o canvas ocupa a tela com rolagem própria; o campo de conversa fica sempre fixo embaixo.

## 2. Cor

A plataforma usa os mesmos hex do Design System, organizados por papel. Proporção 90 / 8 / 2: neutros na maior parte da tela, lima como ação, o resto da paleta em pontos. Os papéis viram classes do Tailwind (`bg-preenchimento`, `text-texto-2`, `border-borda-tag`…); valores em `app/src/app/globals.css`. Vitrine: `/dev/tokens`, seção cores.

### Superfícies

| Papel | Valor | Onde |
|---|---|---|
| `fundo` | branco `#F5F5F5` | Página |
| `canvas` | cinza `#D3D3D3` a 62% sobre o branco | Painel onde o conteúdo vive e rola |
| `superficie` | branco `#F5F5F5` | Cards, container da proposta, composer, diálogos, menus, sobre o canvas |
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
| Ação | lima `#E6F344` | Plimm, item ativo do rail, seletor de marca, opção ativa, passo concluído, círculo do alerta e do porquê do Hattie |
| `acao-suave` | lima-suave `#F1F4C9` | Tag "esperando seu ok", banner de pendências, hover de resposta rápida |
| `acao-forte` | lima-forte `#77A00F` | Ponto de status, onda do plimm, opção escolhida |
| Confirmar | preto `#101010` com texto branco `#F5F5F5` | Botão primário, alerta, mensagem da pessoa no chat (texto lima) |
| `info-suave` (já existia) | azul `#8AD3FA` a 22% | Aviso informativo |
| `info-suave` | azul `#8AD3FA` a 22% sobre o branco | Dica e informação |
| Parceiro | rosa `#FF8AE5` | Designer parceiro |
| Palco | lilás `#B19DFC` e violeta `#7F3AEF` | Painel da entrada e selo tcharam; fora das telas do app |

### Estados

Cores fora da paleta da marca, só para marcar resultado. Cada estado tem três tons: forte (ícone, ponto, borda, fundo de círculo), texto (≥ 4,5:1 sobre o branco e sobre a suave) e suave (fundo de aviso e de tag). Lima continua sendo ação; estado nunca usa lima.

| Estado | Forte | Texto | Suave | Quando |
|---|---|---|---|---|
| `sucesso` | verde `#1F9D55` | `#13703B` | `#E1F4E8` | Aprovado, livre, faça, positivo, forte |
| `atencao` | amarelo dourado `#F2B705` | `#7A5A00` | `#FDF2C8` | A confirmar, em construção, cuidado, ponto de atenção |
| `erro` | vermelho `#E0352B` | `#B3261E` | `#FCE6E4` | Falha, em uso, evite, campo inválido, apagar |

- O amarelo forte tem 1,7:1 sobre o branco: entra sempre como fundo, com ícone preto por cima (10,5:1). Ícone ou texto de atenção solto usa `atencao-texto`.
- O verde forte tem 3,2:1 e o vermelho forte 4,1:1 sobre o branco: servem para ícone e ponto; texto usa a versão `-texto`.
- Rosa-forte `#F53890` volta a ser só cor de marca (logo e peças).
- Estado sempre vem com ícone e rótulo, nunca só com cor.

O Figma usava rosa para "pendente de aprovação". Ficou lima-suave: rosa é a cor do designer parceiro, e esperar aprovação é um convite para agir. Lilás saiu do alerta e do porquê do Hattie (10/11/2026).

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
| `text-corpo` | Poppins 400 | 15 / 24 | Mensagens do chat, leitura, porquê do Hattie |
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
| 600 SemiBold | Título de card e de alerta |
| 100, 200, 700, 800, 900 | Reservados para peças e marketing |

A hierarquia vem do contraste: título de card em 600 contra corpo em 400, botão em 500 contra tag em 400. 14 px como base da interface segue em validação (`marca/05-decisoes/alinhamentos.md` #21). Rótulos da interface em português.

## 3b. Hierarquia e organização

Regras que saíram da revisão de 11/11/2026, para todas as telas:

1. **Uma camada de caixa.** Conteúdo vai num card branco sobre o palco cinza. Dentro do card, os grupos se separam por espaço e por linhas finas (`borda-sutil`), nunca por outra caixa cinza. Preenchimento cinza dentro do card fica para campos e botões.
2. **Títulos de bloco fora do card.** Clash `titulo-3` em minúsculas, com a quantidade discreta ao lado (`text-xs`, `texto-3`) e a ação à direita (botão secundário `sm`).
3. **Três níveis de texto dentro do card.** Título do card em Poppins 600 `text-base`; título de grupo em `text-xs` 600 `texto-2`; rótulo de dado em `text-xs` `texto-3` com o valor em `text-sm`.
4. **Listas de atributos viram texto.** Com mais de três itens, os valores aparecem separados por " · ". Tags ficam para status e para poucos rótulos.
5. **Dados lado a lado com divisória.** Fatos curtos (idade, região, renda) ficam em colunas separadas por uma linha vertical fina, abaixo de uma linha horizontal.
6. **Títulos em Clash sempre em minúsculas**, inclusive o título da tela. Nome de marca e de conversa mantém a grafia.
7. **Destaque vai para o conteúdo.** O que a pessoa veio ver (resumo, macro, frase da persona) ganha `destaque` ou a barra lima; explicações do Hattie ficam no ícone de informação.
8. **Grades com base de uma coluna** (`grid-cols-1`), para nada estourar a largura no celular.

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
| `perigo` | Apagar ou desfazer de vez | Vermelho `#B3261E` com texto branco (6:1), sem onda |

Tamanhos: `sm` 32 px (13 px), `md` 40 px (14 px), `lg` 48 px (16 px); só ícone em 32, 36 e 44 px. Em tela de toque, `md` e `icone` sobem para 44 px.

`Tag` tem os tons `neutra`, `acao` (lima-suave com ponto lima-forte), `feita` e os de estado `sucesso`, `atencao` e `erro` (fundo suave e texto escuro do mesmo tom; "Aprovada" usa `sucesso`), em 20, 24 e 32 px. `StatusBadge` usa a tag.

### Página de uma proposta

O conteúdo manda. A proposta fica num container branco (`superficie`, raio 24, respiro de 20 a 24 px) sobre o canvas, com o nome da seção (ex.: "Propósito") em 12 px no topo e o ícone de informação no canto direito. Dentro dele: o resumo em `destaque` e a prévia da seção; blocos internos (ex.: Para quem, O que entrega) ficam em colunas com divisória fina. Abaixo do container ficam as ações (Aprovar, Editar com o Hattie, Contratar um parceiro) e a navegação entre seções. O porquê do Hattie sai da página e mora no diálogo do `PorqueHattie`.

### Público e personas

A seção tem três camadas, de cima para baixo:

1. **Público macro**: título de bloco com o ícone do porquê; card branco com quem a marca atende numa frase (`destaque`) e quatro fatos em colunas com divisória (idade, região, renda, onde compra).
2. **Públicos**: um card por recorte, com nome, peso na venda (tag) e quantas personas tem. Abaixo de uma linha fina, demografia à esquerda (idade, gênero, renda, escolaridade, ocupação, onde mora) e psicografia à direita (valores, interesses, estilo de vida, como compra, onde se informa, em texto separado por " · "), divididas por uma linha vertical. "Adicionar público" abre um diálogo com nome e descrição; o público novo entra como rascunho e o Hattie completa.
3. **Personas**: cards em uma coluna (duas em telas muito largas). Cada card traz avatar com a cor da marca da cliente, nome, idade, ocupação, cidade e público, a frase dela em itálico com barra lima à esquerda, objetivos e dores, e no rodapé "Onde ela está" e "Ver completa". "Ver persona completa" abre um diálogo com história, motivações, objeções na compra, o que faz ela decidir, onde ela está, referências que admira, como a marca ajuda e o que dizer para ela. "Adicionar persona" pede nome, idade, ocupação, cidade, público e uma frase; o resto o Hattie completa.

Diálogos da plataforma usam `Janela` (branco, raio 24, sem contorno, rodapé com a ação). Campos de texto longo e de lista: `CampoArea` e `CampoLista`. Com erro, o foco vai ao primeiro campo com problema.

### Mercado e concorrentes

1. **Referências**: marcas que inspiram, em cards de três colunas. Cada uma traz o nome, a área, "O que levar" e de onde veio ("Você citou no briefing" ou "Sugerida pelo Hattie"). "Adicionar referência" pede a marca, a área e o que a pessoa admira nela.
2. **Concorrentes**: dois cards, diretos (vendem o mesmo para a mesma pessoa) e indiretos (resolvem a mesma vontade de outro jeito). No topo de cada um, a leitura do Hattie em lima-suave com ícone de lâmpada: é o insight do grupo. Abaixo, uma tabela leve com marca, preço e onde vende, forte em, e brecha para você (em peso 500, porque é o que interessa). No celular, cada linha vira uma lista de rótulo e valor. Concorrente novo entra como rascunho com "Analisar com o Hattie".
3. **Mercado esta semana**: painel que o Hattie atualiza toda segunda. Quatro cartões de indicador (rótulo, valor em Poppins 600, variação em 4 semanas com seta, minilinha de 8 semanas e a fonte) e o card "O que eu vi esta semana" com até três insights marcados como oportunidade, tendência ou atenção. "Atualizar agora" e a data da última leitura ficam no cabeçalho.

`Minilinha`: linha de 2 px em cinza-médio `#6B6B6B`, semana atual em lima-forte `#77A00F` com anel branco; ao passar o mouse ou tocar, mostra a semana e o valor num balão preto; leitores de tela recebem a série numa tabela. Sem eixo e sem grade: o número grande e a variação contam a história, a linha mostra a direção.

### Diferenciais

1. **O que mais diferencia**: o diferencial principal em `destaque` e quatro fatos (frentes ativas, total, fortes hoje, em construção).
2. **Por frente**: um card por frente ativa (funcionais, emocionais, sociais, ambientais, econômicos), com ícone neutro, a pergunta que a frente responde e os diferenciais em lista: título, força (ponto lima-forte para "forte", anel vazio para "em construção"), descrição e prova.
3. **Ficou de fora**: frentes que não fazem sentido para a marca agora, em card de contorno tracejado, com o motivo e "Conversar sobre isso". O Hattie decide quais frentes entram a partir do briefing e dos objetivos.

Botões de adicionar no cabeçalho de bloco encurtam para "Adicionar" no celular (o resto do rótulo continua para leitores de tela). Cabeçalhos de bloco e de tela quebram de linha quando falta espaço.

### Nome

A página tem dois momentos.

**Escolher (primeira visita, nome pendente).** O bloco "escolha um nome" vem primeiro, com o ícone do porquê e "Sugerir um nome". Cada opção é um card com:
- território (tag) e "minha aposta" na opção que o Hattie recomenda;
- o nome em Clash 32 com a grafia original e o que ele quer dizer;
- "Por que funciona" em lista com check lima-forte, "Como soa" e, quando houver, um ponto de atenção;
- disponibilidade de domínio, Instagram e INPI (livre, a confirmar, em uso) e o botão "Escolher". A aposta leva o botão primário; as outras, o secundário.

Escolher abre a confirmação em três camadas: a prévia "Como vai aparecer" com o nome na fonte e na cor da marca da cliente e o significado; o aviso "Antes de registrar" em azul de informação (`info-suave`), só quando algum canal falta confirmar ou está em uso, com o canal em peso 500 e o que falta; e a consequência numa linha discreta no fim. Ao confirmar, o nome passa a valer no app inteiro e a seção fica aprovada, com o selo cling. "Pedir outras opções" abre a conversa com o Hattie; "Sugerir um nome" adiciona uma opção da pessoa para o Hattie checar.

**Escolhido.** "nome da marca" com o nome grande na fonte e na cor da marca, o significado e quatro fatos (território, como soa, domínio, Instagram); "por que esse nome" com os motivos numerados e a disponibilidade; "outras opções" em lista com "Trocar por esta"; e "Ver as opções de novo".

Nos dois momentos, "como cheguei nesses nomes" fecha a página: o funil (nomes gerados, os que passaram nos critérios, os finalistas) e três colunas com o que o Hattie ouviu, os territórios e os critérios. Na página do nome, a aprovação acontece pela escolha, então o botão "Aprovar" genérico não aparece.

### Tom de voz

1. **Como a marca fala**: a introdução em `destaque`; abaixo, os traços da voz (nome em 600 e uma frase) e o espectro de tom: quatro trilhas (formal–informal, séria–bem-humorada, técnica–simples, distante–próxima) com um ponto preto; o lado para onde a marca pende fica em peso 600. Leitores de tela ouvem "mais informal que formal".
2. **Exemplos**: abas por tipo (falas, posts, legendas, chamadas, e-mails), com a quantidade em cada uma; a aba ativa fica em lima. Cada aba é um carrossel horizontal com encaixe por card, o card seguinte aparecendo cortado na borda e setas que andam um card por vez. Os cards imitam o canal com as cores da marca da cliente: balão de WhatsApp, post quadrado, legenda com @ e hashtags, chamada em pílula, e-mail com assunto e assinatura. Todo card tem "Copiar".
3. **Faça e evite**: duas colunas com uma regra por linha e um exemplo entre aspas; no "Evite", o exemplo vem riscado em cinza.
4. **Glossário** e 5. **Palavras que a marca evita** lado a lado: termo e uso; palavra riscada → troca em 600, com o motivo embaixo.

### Arquétipo

1. **A mistura**: a frase de como os arquétipos se combinam, em `destaque`, e uma barra fina de proporção (primário em preto, secundário em cinza-médio) com a legenda nome, peso e papel.
2. **Arquétipo primário** e 3. **arquétipo secundário**: um card cada. Ícone do arquétipo num círculo neutro, nome em Clash minúsculo (32 px no primário, 24 no secundário), tag com papel e peso, e o lema. Abaixo, em duas colunas: "O que é" (a essência do arquétipo em geral, com motivação, desejo e medo) e "Como a marca age como…" (como a marca vive o arquétipo, com comportamentos em lista). No pé, uma linha discreta com ícone dourado: "Cuidado com o exagero", o risco de levar o arquétipo longe demais.

### Atributos

Bloco "como a marca é" com um card por atributo, numerado. À esquerda: número, de qual arquétipo vem (tag), o nome em Clash e a frase-título em `destaque`. À direita, separados por linha vertical: "O que significa", "Como aparece na marca" e "Onde se vê" (pontos de contato como rótulo, atendimento e posts, cada um com o como).

### Logo

**Primeira visita (logo pendente).** "briefing do logo": o conceito em `destaque` e quatro colunas (palavras, referências, evitar, onde vai aparecer). Depois, "escolha uma ideia": três cards com a prévia (composta positiva), nome, "minha aposta" quando for o caso, conceito, por que funciona e "Gerar com esta ideia". Gerar mostra a tela "gerando o logo" com o ✱ girando e, ao terminar, o selo tcharam. O botão "Aprovar" genérico só aparece depois que o logo existe.

**Logo gerado.**
1. **O logo**: a composta grande sobre o fundo claro da marca, com a ideia e o conceito; "Ver as ideias de novo" no cabeçalho.
2. **Versões**: abas Composta, Símbolo e Tipográfica. Em cada uma, um card por variação de cor tirada da paleta da cliente: positiva, negativa, uma sobre cada cor de apoio (com a cor de maior contraste) e as monocromáticas preta e branca. Cada card mostra a prévia, o nome, as cores com hex e três ações: **Baixar** (SVG ou PNG transparente, gerados de verdade), **Ajustar com o Hattie** e **Pedir a um parceiro**.
3. **Regras de uso**: "Faça" em lista com check verde; "Evite" em miniaturas que mostram o erro (esticar, girar, cor fora da paleta, sombra, fundo sem contraste, símbolo fora do lugar), cada uma com um X vermelho.
4. **Área de proteção e tamanho mínimo**: diagrama com a área de proteção (x = metade da altura do símbolo) e tabela de tamanhos mínimos na tela e impresso, com a prévia no tamanho mínimo.

As prévias de marca da cliente usam a fonte dela (`font-serif`, Fraunces na Raiz Natural) e nunca as fontes do Hattie.

### Demais peças

| Componente | Uso | Forma |
|---|---|---|
| `Plimm` | Enviar para o Hattie e criar | Pílula lima 36/44 px (44 px em toque), ✱ e "plimm" em Clash 600 preto. Sobe 2 px com sombra sólida no hover, afunda no clique, ✱ dá meia-volta e solta faíscas |
| `Composer` | Conversa com o Hattie | Card branco raio 24, sem contorno, sombra suave. No foco ganha contorno de 1 px em `borda-tag` e sombra maior. Arrastando arquivo: anel lima-forte |
| `Campo` | Formulários | 44 px, raio 12, `preenchimento` sem contorno. Foco: clareia, contorno `borda-tag` e halo de 4 px. Erro: borda e ícone em vermelho `#E0352B`, fundo `erro-suave`, mensagem em `erro-texto` `#B3261E` ligada ao campo |
| `Busca` | Filtrar listas | 32 px, pílula, `preenchimento`, ícone de 14 px, Esc limpa |
| `Abas` (`Abas`, `ListaAbas`, `ConteudoAba`) | Trocar entre conjuntos de conteúdo na mesma tela (modelos da Home, exemplos do Tom de voz) | Trilha em pílula com 4 px de respiro: branca sobre o palco (`fundo="palco"`), cinza sobre card (`fundo="cartao"`). Abas de 32 px, Poppins 500 em 14 px, ícone opcional de 16 px e quantidade opcional em `texto-3`. Repouso em grafite `#333333`; hover em `preenchimento`; ativa em pílula lima `#E6F344` com texto preto, sem sombra e sem contorno. Foco do teclado em anel preto por dentro da aba; setas andam entre as abas. Quando não cabe, a trilha rola na horizontal sem barra, e a aba focada entra na tela. `centro` centraliza a trilha no desktop |
| `Aviso` | Aviso dentro da página | Bloco de raio 16 em fundo suave do estado (`info`, `sucesso`, `atencao`, `erro`), ícone num círculo da cor forte, título Poppins 600, texto em grafite e ação opcional à direita |
| `Segmentado` | Duas opções exclusivas | Trilho `preenchimento`, opção ativa em lima, 36 px |
| `PorqueHattie` | Por que o Hattie propôs algo | Discreto: ícone de informação de 32 px (fantasma, com dica "Por que eu propus isso") no canto do container da proposta. Abre um diálogo branco, raio 24, sem contorno, com o Hattie num círculo lima de 36 px, título em Clash, o assunto em 12 px, texto de 15 px e "Perguntar mais", que fecha o diálogo e abre a edição com o Hattie |
| Alerta (`notificar`) | Avisos depois de uma ação | Cartão preto flutuante de até 400 px, sem contorno. Círculo de 32 px à esquerda (forma do selo em lima, check em verde, atenção em amarelo, erro em vermelho), nome do selo em Clash 600 lima, título Poppins 600, texto 13 px, botão de fechar. Erro sem selo |
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

- Rail: Início, Hattie, Marca, Projetos, Biblioteca, Marketing, Parceiros, Automações, Conectores. O Hattie vem logo abaixo do Início.
- Estados do item: em repouso, ícone e rótulo em cinza-médio `#6B6B6B` com traço 1,75; no hover, preto `#101010` sobre `preenchimento`; ativo, pílula lima `#E6F344`, rótulo em Poppins 600 e ícone cheio (preenchido em preto). Gráfico e setas, que não preenchem bem, ganham traço 2,5.
- Forma: a aba do meio sai da margem com cantos convexos de 24 px à direita e côncavos de 24 px no cinza, em cima e embaixo. Fechada, acompanha só a coluna de ícones; aberta, estica com os rótulos.
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
| Espinha | Abrir: 120 ms de espera, abas e pílulas esticam em 260 ms (ease-out forte), rótulos, logomarca e seletor aparecem a partir de 230 ms, quando a forma já está quase aberta. Fechar: rótulos somem em 90 ms e as abas encolhem em 260 ms, sem espera. Sem animação com "reduzir movimento" |
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
2b. Segue as regras de hierarquia da seção 3b: uma camada de caixa, títulos de bloco fora do card, três níveis de texto.
3. Foco visível, alvos de 44 px nas ações principais e 32 px no resto, tudo alcançável pelo teclado.
4. Testada com "reduzir movimento" e em 375 px.
5. Texto conferido com a skill `hattie-voz` e sem as palavras evitadas do glossário.
6. Revisada com as skills `better-ui` e `userinterface-wiki`.
7. `npm run build` e `eslint` sem erro.
