# Fluxos e navegação

Estrutura a partir das telas que o Raphael desenhou no Figma (09/11/2026), refinada nos wireframes navegáveis de `plataforma/app` (mapa na rota `/`). Regras de interface em `plataforma/design/diretrizes-ui.md`; rotas e camadas em `plataforma/docs/arquitetura.md`.

## 1. Entrada

| Tela | Rota | O que acontece |
|---|---|---|
| Criar conta | `/criar-conta` | Nome, e-mail e senha (ou Google). Erros aparecem no próprio campo e o foco vai para o primeiro. Leva ao primeiro acesso |
| Entrar | `/entrar` | E-mail e senha, "esqueci minha senha". Leva à Home da marca |
| Primeiro acesso | `/comecar` | Chapéu do Hattie, "vamos tirar sua marca do chapéu" e a escolha **Criar marca** ou **Importar marca**. A pessoa conta a ideia e anexa o que tiver: PDF, imagens, vídeos, links. Ideias de exemplo preenchem o campo. Enter ou plimm envia |

## 2. Criar uma marca do zero

1. **Briefing** no primeiro acesso.
2. **Conversa de criação** (`/marca/[marca]/hattie/criacao`). O Hattie abre uma conversa com o nome da pessoa ("Marca da Bia"), lê o briefing e os materiais e pergunta, um ponto por vez. Cada pergunta traz respostas rápidas e a opção "Pular, você decide".
3. **Plano** à direita, com os pontos que vão formar a base da marca:
   - **Base de toda marca:** o negócio, objetivos, público, mercado e concorrentes, localização e canais, produto e diferencial, personalidade, referências.
   - **Para a sua marca:** pontos que o Hattie acrescenta pelo segmento. Para cosméticos naturais: ingredientes e origem, embalagem e rótulo.
   - Cada ponto mostra o status: respondido, conversando agora, falta conversar ou o Hattie decide. Pelo menu do ponto dá para voltar a ele ou pular.
   - **Criar minha marca** fica disponível o tempo todo. Os pontos que faltam o Hattie decide com o que já sabe.
4. **Criando a marca** (`/marca/[marca]/criando`): tela própria com as etapas (ler o que a pessoa contou, pesquisar o mercado, estudar concorrentes, montar a estratégia, propor nome, voz e visual). Texto final ainda em aberto.
5. **Cérebro da marca** (`/marca/[marca]/cerebro`) com a notificação "tcharam". Todas as propostas chegam esperando o ok da pessoa, e o resto do Hattie já fica liberado.

**Importar marca:** o mesmo campo do primeiro acesso recebe links e arquivos. Nos wireframes vai direto para "criando a marca" e para o cérebro; a conversa de revisão da marca importada fica para a próxima rodada.

## 3. Cérebro da marca

**Sumário** à esquerda: busca, Visão geral (com o total esperando ok) e os quatro grupos com contador de aprovadas:

| Grupo | Seções |
|---|---|
| Estratégia (7) | briefing de marca, propósito, posicionamento, público e personas, mercado e concorrentes, diferencial, objetivos |
| Verbal (6) | nome, tagline, tom de voz, mensagens-chave, palavras-chave, vocabulário |
| Personalidade (3) | arquétipo, atributos, como a marca age |
| Visual (10) | logo, cores, tipografia, grafismos, gradiente, ícones, estilo fotográfico, ilustração, aplicações, movimento |

**Visão geral** no canvas: nome da marca grande, aviso com quantas propostas esperam ok e o botão "Revisar uma por uma", e cards das seções-chave (briefing em destaque, propósito, logo, tipografia, cores, palavras-chave, público, fotografia, ilustração).

- **Clicar no card** abre a seção: proposta completa, "por que eu propus isso", Aprovar, Editar com o Hattie, Contratar um parceiro e navegação para a seção anterior e a próxima.
- **⋮ do card**: Aprovar (ou Reabrir para ajustes), Editar com o Hattie, Contratar um parceiro e a ação do tipo (baixar logos, copiar cores, baixar fontes).
- **Editar com o Hattie** abre a coluna direita: o Hattie pergunta se a proposta resume bem a marca, mostra o texto e oferece "Perfeito, pode aprovar", "Deixa mais curto" e "Quero outra opção", além do campo livre.
- **⋮ da marca**: compartilhar link, baixar o livro da marca em PDF, convidar pessoa.

## 4. Dia a dia

| Área | Rota | Estado |
|---|---|---|
| Início | `/marca/[marca]` | Saudação pelo horário, aviso de propostas pendentes, "o que vamos criar hoje?", projetos recentes, abas Imagem, Vídeo, Posts, Apresentação, Pesquisa, Personas, Atalhos e Site com modelos que preenchem o pedido. Vídeo e Site marcados "em breve" |
| Hattie | `/marca/[marca]/hattie`, `/hattie/[conversa]`, `/hattie/nova` | Conversas à esquerda, conversa no centro |
| Marca | `/marca/[marca]/cerebro` | Seção 3 |
| Projetos | `/marca/[marca]/projetos`, `/projetos/[projeto]` | Lista com busca, situação, tipo, ordem e grade ou lista. O projeto aberto tem páginas e pastas na coluna, três vistas da página (Canvas, Grade, Thread) e a conversa com o Hattie, que cria os itens na página. Detalhes em `design/diretrizes-ui.md` |
| Marketing | `/marca/[marca]/marketing`, `/calendario`, `/concorrentes`, `/leads` | Visão geral (leitura da semana, números, metas, próximos posts, o que mais rendeu), calendário de posts com pedido ao Hattie e "Atualizar com o Hattie", concorrentes lado a lado com o que mudou, e leads por etapa com resposta sugerida. Detalhes em `design/diretrizes-ui.md` |
| Automações, Conectores | `/marca/[marca]/…` | Estado vazio, próxima rodada |
| Minhas marcas | `/marcas` | Cards das marcas e "Nova marca" |

**Seletor de marca** (pílula lima no topo): as marcas da pessoa, Nova marca, Minhas marcas, Convidar pessoa, Compartilhar link da marca.

**Conta** (avatar no fim do rail): Configurações da conta, Ajuda, Convidar pessoa, Sair.

## Jornada para apresentação

`/jornada` (link no mapa das telas) tem duas vistas, em abas.

**Telas**: a jornada da Bia num quadro, com a captura de cada tela do protótipo, o que dá para fazer em cada uma e os caminhos possíveis, inclusive os de ida e volta (responder ou pular perguntas, pedir ajuste ao Hattie, ver a visão geral do cérebro, editar um ponto com o Hattie, pedir ajuste na proposta, procurar outro parceiro, pedir revisão, conversar com o Hattie e voltar ao início, pedir ajuste ou gerar de novo no projeto).

**Fluxograma**: a mesma jornada em três partes (chegar e criar a marca; aprovar ponto por ponto e chamar um parceiro; o dia a dia), com raias de quem faz cada passo (Bia, Hattie, parceiro), losangos de decisão ("Tem conta?", "Gostou do todo?", "A proposta serve?", "A entrega está boa?", "Ficou bom?") e as setas que voltam nos laços. Um círculo lima numerado liga uma parte à seguinte.

Na vista de telas: Cinco etapas: chegar (criar conta ou entrar), começar (criar do zero ou importar uma marca), criar a marca (conversa, o Hattie criando, olha como ficou), aprovar (ponto por ponto, com a visão geral do cérebro) e usar no dia a dia (início, conversa com o Hattie, projetos, criar no projeto, biblioteca). Uma faixa rosa mostra o caminho com parceiro: contratar, perfil, proposta e orçamento, quadro, e a entrega indo para a biblioteca. Linha cheia é o caminho principal; tracejada, outro caminho. Clicar numa tela abre a imagem grande e o link para a tela de verdade. No celular, as etapas viram lista.

As capturas ficam em `app/public/jornada/` e saem da versão de produção (`hattie-app-producao` no `.claude/launch.json`), em 1440 × 900, pelo Chrome sem janela. Quando as telas mudarem, vale capturar de novo.

## 5. Próximas rodadas

Revisão da marca importada, área de parceiros e contratação, projetos, biblioteca, conectores (Instagram, WhatsApp e loja online alimentando o marketing), automações, brandbook público por link, plano e créditos, texto final da tela de criação.
