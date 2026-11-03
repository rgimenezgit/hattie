# Grafismos e ícones

O repertório de formas do Hattie tem três famílias: **grafismos** (decoram e dão ritmo), **ícones** (apontam funções) e o **botão plimm**. Os arquivos estão em `components/Icones/`, e a página "Ícones e grafismos Hattie" mostra tudo aplicado.

## Famílias

### Grafismos (decorativos)
| Forma | Uso | Som |
|---|---|---|
| ✱ oficial (`asterisco`) | Botão plimm, carregamento e conquistas grandes. Grafismo da marca, fora do logo | plimm |
| Brilho de 4 pontas (`brilho`) | Aprovação e detalhes de luz | cling |
| Estrela de 8 pontas (`estrela`) | Revelação e entrega final | tcharam |
| Estrela vazada (`estrela-vazada`) | Destaque e novidade | tcharam |
| Selo explosão (`selo`) | Selos de preço, prazo e novidade | |

Os grafismos novos propostos antes (rastro, constelação, raios e órbitas) saíram do repertório. Novos grafismos nascem das formas acima e do sistema de pontos e faíscas (`8-grafismo-e-gradiente.md`).

### Ícones (funcionais)
| Ícone | Função na plataforma | Som |
|---|---|---|
| Chapéu | Hattie, perfil e assistente | |
| Castelo | Home | |
| Bola de cristal | Estratégia, análise e previsão | hmm… |
| Vassoura (avião) | Enviar e publicar | |
| Calendário | Prazos e entregas | |
| Caderno | Biblioteca | |

### Ícones propostos
| Ícone | Função | Som |
|---|---|---|
| Varinha com brilho na ponta | Gerar com o Hattie | |
| Caldeirão | Misturar e gerar variações | |
| Pena e tinteiro | Escrever, nomear e assinar | |
| Pergaminho (dois rolos) | Documento e entrega | |
| Chave com arco redondo | Acesso e login | |
| Vela | Dica | |
| Lupa | Buscar e revisar | |
| Sino | Avisos e notificações | |
| Cadeado | Privacidade e pagamento | |
| Raio | Processando e rápido | zuum |
| Coração | Favoritar | |
| Porta (desenho do Raphael) | Chamar o designer | toc toc |
| Olho em estrela | Ver e sugerir | psiu |

### Puff
O puff é uma nuvenzinha de círculos sobrepostos, a partir do desenho do Raphael, como se algo tivesse virado fumaça do nada. Arquivo em `components/Icones/puff/puff-nuvem.svg`. O selo puff e a nuvem aparecem juntos, em cinza.

### Botão plimm
Pílula lima `#E6F344` com o ✱ e a palavra "plimm". Um por tela, reservado à ação de criar (`3-sons-e-botao-plimm.md`).

## Linguagem de desenho

Regras para qualquer forma nova entrar no repertório:

- **Silhueta cheia** em uma cor. Detalhes internos aparecem como recortes (espaço negativo).
- **Pontas e cantos arredondados** nas partes orgânicas (chapéu, pena, estrelas). Arestas retas ficam para objetos construídos (castelo, calendário, porta).
- **Um toque de magia por ícone**, quando fizer sentido, com as estrelas do repertório: brilho na ponta da varinha e estrela em volta do olho. O desenho mistura um objeto de trabalho com um detalhe mágico (magia com tecnologia).
- **Grade de 24** com margem de 2, alinhamento óptico e ações em diagonal de 45° (varinha, vassoura, chave).
- **Recortes e vazados** com pelo menos 2 px em 24, para o desenho se ler em 16 px.
- **Sem texto e sem rostos.** O rosto pertence ao personagem.
- **Peso visual igual** entre os ícones: o chapéu, o castelo e a vassoura ocupam a área de modo que pareçam do mesmo tamanho.

## Cor

Cada glifo usa uma única cor chapada da paleta (`1-cor.md`). Contrastes medidos:

| Fundo | Cores de glifo (contraste) |
|---|---|
| Branco `#F5F5F5` | preto `#101010` (17,5), violeta `#7F3AEF` (5,1) |
| Lima `#E6F344` | preto (15,6), violeta (4,6) |
| Preto `#101010` | lima (15,6), branco (17,5), lilás `#B19DFC` (8,2) |
| Lilás `#B19DFC` | preto (8,2), violeta (2,4, só grafismo grande) |
| Violeta `#7F3AEF` | lima (4,6), branco (5,1) |
| Rosa `#FF8AE5` | preto (9,1) |
| Azul `#8AD3FA` | preto (11,6) |
| Cinza `#D3D3D3` | preto (12,7), violeta (3,7, só grafismo grande) |

- Ícones de função usam contraste de pelo menos 4,5. Grafismos grandes aceitam 3.
- Sobre fundos claros, o ícone fica em preto, com o violeta como acento. O lima aparece sobre preto, grafite e violeta.
- Ícone desativado usa cinza-médio `#6B6B6B`.
- Rosa-forte `#F53890` e azul-forte `#1764D6` entram como acento de posts e apresentações.
- Dois glifos lado a lado na mesma peça usam a mesma cor, ou a cor principal e uma de apoio.

## Tamanho e respiro

- **Ícones de função:** 16, 20, 24 e 32 px. 48 e 72 px servem para ilustrar estados vazios e blocos de benefício.
- **Respiro:** um quarto do tamanho do glifo em volta.
- **Alvo de toque:** 44 px, com o ícone centralizado.
- **Grafismos:** escala livre; o brilho de 4 pontas fica em 12 px ou mais.
- **Formas largas** (chapéu e castelo) têm uma versão quadrada de grade 24 para os tamanhos até 32 px. A versão larga entra a partir de 48 px.

## Uso por contexto

| Contexto | Regras |
|---|---|
| Plataforma | Ícones de função sempre com rótulo. Um ícone grande de ilustração por tela. Grafismos aparecem em momentos: sucesso, carregamento, estado vazio. O ✱ fica com o plimm, o carregamento e as conquistas. |
| Landing | Grafismos grandes no fundo, um por seção. Ícones de 24 a 32 px em listas de benefícios, sempre com título. |
| Apresentações | Ícones em linhas de três ou quatro itens. Grafismo na capa e na abertura de seção; o ✱ marca o início de cada seção. |
| Posts | O grafismo é o protagonista, um por peça. Selo explosão para preço, prazo ou novidade. |
| Sons e selos | A forma do som aparece junto do selo, nos pares da tabela abaixo. |

## Sons e formas

| Som | Forma |
|---|---|
| plimm | ✱ oficial |
| hmm… | Bola de cristal |
| tcharam | Estrela de 8 pontas |
| cling | Brilho de 4 pontas |
| zuum | Raio (proposta) |
| puff | Nuvenzinha |
| toc toc | Porta |
| psiu | Olho em estrela |

Selo e forma aparecem juntos, duram o mesmo tempo e seguem a regra de um selo por tela (`components/Sons/README.md`).

## Grafismo, pontos e faíscas

- O ✱ oficial é o glifo do topo da escala das faíscas (`8-grafismo-e-gradiente.md`).
- O brilho de 4 pontas fica no degrau abaixo do ✱, na mesma escala.
- Selo explosão e estrelas grandes aparecem como peças soltas e ficam fora dos mosaicos de pontos.
- A nuvenzinha do puff é um ícone solto e fica fora dos mosaicos de pontos.

## Animação

- **Entrada:** escala de 0,8 a 1 com rotação de até um oitavo de volta nos brilhos e estrelas; entre 400 e 600 ms.
- **Repetição:** O ✱ gira devagar enquanto o Hattie trabalha. Os demais tocam uma vez.
- **Um elemento animado por vez** na mesma tela.
- Com movimento reduzido no sistema, a forma aparece no quadro final.

## Acessibilidade

- Ícone de função sempre com rótulo visível ou `aria-label`.
- Grafismos decorativos ficam marcados como ocultos para leitores de tela.
- Contraste mínimo e alvo de toque seguem as regras acima.

## Arquivos

- `components/Icones/dados/`: `asterisco`, `brilho`, `estrela`, `estrela-vazada`, `selo`, `chapeu`, `bola-de-cristal`, `castelo`, `vassoura`, `calendario`, `caderno-de-tarefas`, `botao-plimm`.
- `components/Icones/novos/`: `varinha`, `caldeirao`, `pena`, `pergaminho`, `chave`, `vela`, `lupa`, `sino`, `cadeado`, `raio`, `coracao`, `porta`, `olho`.
- `components/Icones/puff/`: `puff-nuvem`.
- SVGs de uma cor, com preenchimento preto `#101010`. Para outra cor, troque o preenchimento ou use `currentColor`.

## Pendências desta direção

- Aprovar os ícones propostos ou redesenhá-los no traço do Raphael.
- Definir o ícone de limpar e refinar, já que a vassoura passou a ser o envio.
- Criar as versões quadradas do chapéu e do castelo para tamanhos pequenos.
- Definir os ícones de interface restantes (editar, apagar, compartilhar, baixar, configurações, ajuda).
- Confirmar a forma de zuum.
