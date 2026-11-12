# Registro de decisões

Apenas decisões fechadas. Mais recente primeiro. Versão consolidada em `../diretrizes-finais.md`. Para registrar uma nova, use a skill `hattie-registrar-decisao`.

## 11/11/2026
- Casca do app em palco cinza com três abas brancas que saem da margem (topo, navegação e conta), com cantos côncavos. Fechada, a aba do topo mostra só o símbolo do Hattie; aberta, mostra a logomarca e o seletor de marca. Colunas laterais viram painéis brancos sobre o palco.
- O rail fica colado na margem da página: aberto, a margem branca estica por cima do canvas com cantos côncavos e sombra levíssima. Itens em repouso em cinza-médio `#6B6B6B`, ativo em pílula lima com ícone cheio. O Hattie passa a ser o segundo item, logo abaixo do Início.
- O canvas ganha uma sombra interna muito fina, como se o branco estivesse um degrau acima do cinza.
- Na página de uma proposta, o conteúdo fica em destaque num container branco e o porquê do Hattie fica discreto: ícone de informação no canto do container, que abre um diálogo com a explicação e a opção "Perguntar mais".

## 10/11/2026
- Poppins entra com a família completa (100 a 900, com itálico) em `assets/fontes/poppins/` e no app.
- Sistema tipográfico da plataforma com escala nomeada (display 48, título 32/24/20, destaque 18, corpo 15, 14, detalhe 13, 12 e micro 11) e pesos por função: 300 destaque, 400 corpo e tags, 500 botões e controles, 600 títulos de card, alerta e nota.
- Cores da plataforma organizadas por papel (fundo, canvas, superfície, preenchimento, bordas, texto em três níveis, ação, erro, informação), todas a partir dos hex do Design System.
- Botão e tag se separam: botão é pílula cheia em Poppins 500, sem contorno; tag tem canto de 6 px, Poppins 400 em 12 px e contorno de 1 px em preto `#101010` a 16%. Campos, botões e cards ficam sem contorno preto.
- Clique: todo botão afunda para 0,97 e volta com mola; o primário solta uma onda; o ✱ do plimm dá meia-volta e solta faíscas da marca para fora do botão (brilho, mais e ponto em lima-forte `#77A00F`, em degraus de pixel).
- Alerta da plataforma vira cartão preto `#101010` com círculo lima `#E6F344` à esquerda, sem lilás e sem contorno. A nota "por que eu propus isso" vira card branco com a assinatura do Hattie em lima, sem lilás.
- Detalhes em `plataforma/design/diretrizes-ui.md` e na vitrine `/dev/tokens`.

## 09/11/2026
- A plataforma segue a estrutura desenhada pelo Raphael no Figma: entrada em duas colunas, primeiro acesso com "criar marca" ou "importar marca", conversa de criação com plano lateral, cérebro da marca com sumário e cards, Home com rail lateral que expande no hover. Detalhes em `plataforma/produto/fluxos.md` e `plataforma/design/diretrizes-ui.md`.
- Na plataforma, o botão plimm é pílula lima `#E6F344` com ✱ e texto preto `#101010`. Ele envia pedidos ao Hattie e cria.
- Ícones de interface vêm do Lucide. Os desenhos da marca ficam para o Hattie (personagem de chapéu), o ✱, os selos de som e os momentos de marca.
- Superfícies da plataforma: fundo branco `#F5F5F5`, canvas cinza (`#D3D3D3` a 62%) com cards brancos.
- Interface mais compacta, com mais respiro: margem de 8 px em volta da página, topo de 56 px, rail de 48 px (208 px aberto) rente à borda, colunas de 256 px, plimm de 36 px e texto de controles em 14 px. Medidas em `plataforma/design/diretrizes-ui.md`.

## 03/11/2026
- Logo em sete cores: preto, branco, lima `#E6F344`, azul claro `#8AD3FA`, lilás `#B19DFC`, rosa forte `#F53890` e violeta `#7F3AEF`. Lilás, rosa e violeta incluem avatar, feliz, bravo e entediado (`assets/logos/cores/`).
- Catorze combinações de fundo e logo aprovadas, em composição completa (símbolo, avatar, expressões, logomarca e logotipo) ou básica (logotipo, logomarca e símbolo), documentadas em `04-visual/design-system/10-logo.md` e em `assets/logos/composicoes/`.
- Cinco exemplos de ilustração e oito de fotografia entram no Design System como referência de estilo (`assets/ilustracao/exemplos/`, `assets/fotografia/exemplos/`).
- Design System em PDF com logo, gradientes em pontos, faíscas, exemplos de ilustração e fotografia e peças de aplicação (`assets/pecas/aplicacoes/`).
- Teoria da marca (estratégia, personalidade e identidade verbal) em PDF próprio: `marca/hattie-teoria-da-marca.pdf`.
- Sem áudio por enquanto. Os sons existem como selos e formas visuais.
- Sem laranja na marca. Rosto e mãos do Hattie usam um tom da escala de pele (referência `#F2C6A8`).
- Tons de pele da ilustração: `#F2C6A8`, `#D9A07C`, `#A9694A`, `#6B3F2B`, `#3B2418`.
- Um único estilo fotográfico: studio infinito.
- Puff é uma nuvenzinha de círculos sobrepostos; a mão saiu do repertório.
- O ✱ é grafismo da marca, fora do logo.
- Character sheet fica para depois. Repertório atual: avatar, feliz, bravo e entediado.
- Logos em branco (logotipo, logomarca, símbolo) integram o repertório.
- Estrutura do projeto Hattie criada (marca, assets, plataforma, wiki, tcc, skills).
- Objetivos de produto, negócio e marca definidos em `plataforma/produto/visao-do-produto.md`; a monografia fica fora do escopo da plataforma.

## 02/11/2026
- Papéis dos ícones: castelo é a home, vassoura (avião) é enviar, caderno é a biblioteca.
- Porta (toc toc) e olho em estrela (psiu) são desenhos do Raphael e entram no repertório.
- Ícones novos no mesmo estilo: varinha com brilho, pena com tinteiro, pergaminho de dois rolos, chave de arco redondo, vela como dica, coração de ponta arredondada.
- Grafismos propostos antes (rastro, constelação, raios, órbitas) saíram do repertório.
- Cada som tem uma forma que o acompanha (tabela em `04-visual/design-system/9-grafismos-e-icones.md`).
- Ilustração: formas chapadas com sombras recortadas em preto. Grafismo: "magia feita de pixels", com gradiente em pontos e faíscas.

## 28 e 29/10/2026
- Paleta de quatro famílias com clara e forte, mais neutros (substitui a paleta de 25/10).
- Uso da cor por contexto: plataforma 90/8/2; apresentações 45/30/20/5; landing 50/25/15/10; posts com todas as cores e uma dominante.
- Lima é o acento da marca; lima, violeta e lilás formam o trio principal.
- Tipografia: Clash Display e Poppins. Clash Display 700 reservado ao logotipo.
- Fotografia studio infinito, com hex do fundo sempre citado.
- O plimm é o botão de criar, um por tela.

## 25/10/2026
- Parte visual retomada, com paleta e fontes novas (Clash Display e Poppins); logotipo, logomarca, personagem mago e símbolo existentes.

## 24/10/2026 · Revisão do conceito da marca
Nasceu de um ponto do orientador: definir o peso do "divertido" para a estratégia seguir como ponto mais forte. Referências de equilíbrio: Notion e Clay.

| Elemento | Antes | Agora |
|---|---|---|
| Arquétipo | Criador (primário) e Mágico (secundário) | Sábio (primário) e Criador (secundário), com um toque de Mágico |
| Palavras-chave | Oito atributos, com "lúdico" | Sábio, criativo, amigável |
| Peso do divertido | Lúdico como traço central | Humor sutil na voz; o lúdico vive no visual |
| Frase-síntese | "Mágica e criativa de forma racional…" | "O Hattie ajuda empreendedores a criar marcas com estratégia e designers a entregar mais, com a sabedoria de quem entende, a criatividade de quem faz e o jeito de um amigo" |
| Pilares e valores | Quatro pilares e quatro valores | Cinco pilares unificados |
| Propósito | "Democratizar e potencializar o acesso ao branding de qualidade, de forma lúdica, descomplicada e criativa" | "Democratizar o acesso ao branding e potencializar marcas com estratégia e criatividade" |
| Personagem | A Hattie | O Hattie, masculino, um mago |
| Como chama o cliente | "Mestre" | Pelo nome |
| Tagline | "Brand out of the Hattie" e "Mágica de criar marca" | Abandonadas; em aberto |
| Comunicação | Vocabulário de mágica genérico | Efeitos sonoros e vocabulário de mago |
| Posicionamento | Seu designer pessoal | Seu mago pessoal de marca (proposta) |

Também decidido nesse dia: "grimório" fora do vocabulário; Gandalf como referência interna e Merlin como referência pública; nenhum material usa "não é X, é Y" nem "é X, não é Y"; efeitos sonoros plimm (criar), puff (excluir) e os demais.

## 15 a 25/09/2026 · Fases 1 a 5 (histórico)
- Origem, modelo de negócio, clientes e território (fase 1).
- Mapa do mercado: espaço vazio em gestão contínua com profundidade estratégica (fase 2).
- Personalidade, propósito, pilares e personas (fase 3; revisados em 24/10).
- Nome **Hattie**, mantido mesmo com a concorrente "Hattie's Design Co." (fase 4).
- Primeira direção visual, coral e DM Sans (fase 5; arquivada).
