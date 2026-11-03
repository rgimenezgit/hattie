# Grafismo e gradiente

Conceito: **magia feita de pixels**. O grafismo do Hattie junta o que brilha na magia (faíscas, estrelas) com o que a tecnologia desenha (pontos, grades, pixels). Ele aparece como camada de fundo e de atmosfera. Os personagens e as ilustrações continuam chapados (`7-ilustracao.md`).

Lima, lilás e violeta são as cores principais do grafismo. Rosa e azul entram como cores secundárias, em pitadas. Protótipos vivos na página "Grafismo Hattie" e em `components/Grafismo/preview.html`.

## Princípios

- Cada peça usa cores puras da paleta (`1-cor.md`), citadas com hex. O ponto e o glifo têm a cor integral; o efeito nasce da repetição.
- A área de cada cor segue a proporção do contexto (tabelas abaixo).
- Uma técnica principal por peça: pontos ou faíscas.
- O grafismo ocupa uma zona do quadro (canto, faixa, mancha) e deixa a outra zona livre para texto e personagem.
- Texto fica sobre área chapada. Pontos e faíscas ficam fora da caixa de texto.
- Pixels quadrados dão a voz de tecnologia; os glifos e as manchas dão a voz de magia.
- Todo movimento tem versão parada: com movimento reduzido no sistema, a peça aparece em repouso, com o foco no centro.

## Glifos das faíscas

A escala de intensidade tem quatro degraus, do mais fraco ao mais forte:

1. **Ponto** `·`
2. **Mais** `+`
3. **Brilho** `✦`, estrela de quatro pontas que gira conforme a luz
4. **✱ oficial**, o asterisco da marca (`components/Grafismo/hattie-asterisco.svg`), grafismo da marca fora do logo, com oito braços largos e pontas arredondadas

- O ✱ oficial ocupa o topo da escala: a luz forte acende o asterisco da marca.
- Nas composições em mosaico, o glifo que nasce na célula segue a mesma escala: ponto, mais, brilho e ✱ oficial, conforme a cor vizinha avança.
- O ✱ oficial também funciona como glifo único: pequeno lê como ponto; cresce e gira até um oitavo de volta, que é o período do desenho.
- Cada glifo aparece com uma cor só por vez.

## 1. Gradiente em pontos

Passagem entre cores feita com pontos ordenados (dither de matriz Bayer). Entre duas cores vizinhas, os pontos se alternam; nenhuma cor intermediária aparece.

- **Pixel:** quadrado, grande o bastante para ser visto (referência de 4 px em desktop).
- **Formas do campo:** linear (diagonal), radial (mancha com centro) e faixas (ondas diagonais).
- **Proporção:** cada cor ocupa uma fatia do quadro com o peso da composição. A transição entre vizinhas tem largura própria e fica menor para as cores de fatia pequena.
- **Lima · lilás · violeta (partes iguais):** `#E6F344` → `#B19DFC` → `#7F3AEF`.
- **Invertido:** violeta `#7F3AEF` → lilás `#B19DFC` → lima `#E6F344`.
- **Lilás dominante, gradiente lima:** lilás em 60 e lima em 40, com o lilás ao centro e a lima na borda.
- **Lilás dominante, lima e violeta nas pontas:** lima 25, lilás 50, violeta 25.
- **Lima dominante:** lima 55, lilás 28, violeta 17.

## 2. Composições com as proporções da marca

A transição entre as cores é contínua: cada cor tem um centro proporcional ao seu peso, e entre dois centros as cores vizinhas se misturam aos poucos. A cor de maior peso ocupa a maior área e as de peso pequeno aparecem como filetes.

Cada composição ganha duas versões:

- **Pontos:** dither entre as cores vizinhas.
- **Faíscas:** o fundo fica com a cor dominante, e os glifos nascem, crescem e mudam de cor ao longo da composição. Pequenos, lêem como ponto e mais; maiores, viram brilho e ✱ oficial. Os glifos nunca ocupam mais que a célula.

Os valores abaixo são partes de 100.

### Plataforma

Neutros 90, lima 8, violeta e lilás 2. O grafismo aparece como um filete de cor na borda do neutro.

| Tema | Ordem e peso |
|---|---|
| Claro | branco `#F5F5F5` 70, cinza `#D3D3D3` 20, lima `#E6F344` 8, lilás `#B19DFC` 1,5, violeta `#7F3AEF` 0,5 |
| Escuro | preto `#101010` 70, grafite `#333333` 20, lima 8, lilás 1,5, violeta 0,5 |

### Apresentações

Neutros 45, lima 30, violeta e lilás 20, rosa e azul 5.

| Tema | Ordem e peso |
|---|---|
| Claro (radial) | branco 45, lima 30, lilás 12, violeta 8, azul `#8AD3FA` 2, rosa `#FF8AE5` 3 |
| Escuro (linear) | preto 45, violeta 8, lilás 12, lima 30, rosa 3, azul 2 |

### Landing

Neutros 50, lima 25, lilás e violeta 15, rosa e azul 10. Ambas em faixas.

| Tema | Ordem e peso |
|---|---|
| Claro | cinza 10, branco 40, lima 25, lilás 8, violeta 7, azul 5, rosa 5 |
| Escuro | preto 40, grafite 10, violeta 7, lilás 8, lima 25, rosa 5, azul 5 |

### Cores dos gradientes em pontos

As combinações de lima, lilás e violeta viram composições, cada uma em pontos e em faíscas.

| Composição | Forma | Ordem e peso |
|---|---|---|
| Trio | linear | lima `#E6F344` 1, lilás `#B19DFC` 1, violeta `#7F3AEF` 1 |
| Invertido | faixas | violeta 1, lilás 1, lima 1 |
| Lilás dominante, gradiente lima | radial | lilás 60, lima 40 |
| Lilás dominante, lima e violeta nas pontas | linear | lima 25, lilás 50, violeta 25 |
| Lima dominante | radial | lima 55, lilás 28, violeta 17 |
| Lima e violeta com apoio | faixas | lima 45, violeta 30, lilás 13, rosa `#FF8AE5` 6, azul `#8AD3FA` 6 |

### Posts

Uma cor dominante, com as outras em apoio.

| Dominante | Ordem e peso |
|---|---|
| Lilás | lilás 55, lima 20, violeta 12, rosa 7, azul 6 |
| Lima | lima 55, lilás 20, violeta 12, rosa 7, azul 6 |
| Violeta | violeta 55, lilás 20, lima 15, rosa 5, azul 5 |

## 3. Pontos interativos

O ponto de atenção segue o cursor. Sem mouse (celular, ou cursor fora do quadro), ele se move sozinho em um laço lento. Em todas as composições, o cursor desloca a mancha radial ou a diagonal.

- **Lanterna:** uma mancha radial de pontos acompanha o cursor; o centro leva a última cor da lista.
- **Rastro:** o cursor deixa um caminho de pontos que se apaga aos poucos, como a ponta de uma varinha.
- **Ondas:** anéis de pontos pulsam a partir do cursor.
- **Olho:** uma grade de pontos redondos cresce perto do cursor e se afasta dele (lima `#E6F344` sobre preto `#101010`).
- **Uso:** hero da landing, estados vazios, cartão de destaque, tela de carregamento (hmm…).

## 4. Faíscas

Grade de glifos de brilho na escala ponto, mais, brilho e ✱ oficial; ou o ✱ oficial como glifo único. Quanto maior a intensidade de luz, maior e mais elaborado o glifo.

- **Lupa:** os glifos crescem perto do cursor.
- **Luz:** o cursor deixa um rastro de brilho que se apaga.
- **Onda:** anéis de brilho se abrem a partir do cursor; o clique solta uma onda nova.
- **Combinações de uma tinta (tinta sobre fundo):** lima `#E6F344` sobre preto `#101010`; violeta `#7F3AEF` sobre lilás `#B19DFC`; lilás sobre violeta; preto sobre lima; lima sobre violeta; violeta sobre lima; mais as secundárias rosa-forte `#F53890` sobre lima, azul-forte `#1764D6` sobre azul `#8AD3FA`, preto sobre rosa `#FF8AE5` e lima sobre azul-forte.
- **Com cor de apoio no brilho mais forte:**
  - sobre preto: ponto violeta, mais lilás, brilho lima, ✱ rosa
  - sobre lilás: ponto violeta, mais violeta, brilho lima, ✱ rosa-forte
  - sobre violeta: ponto lilás, mais lilás, brilho lima, ✱ azul
  - sobre lima: ponto violeta, mais violeta, brilho preto, ✱ rosa-forte
- **Duas tintas sobre um fundo (tinta de pontos e mais, tinta de brilho e ✱):** lilás `#B19DFC` e violeta `#7F3AEF` sobre lima `#E6F344`; lima e lilás sobre violeta; violeta e lima sobre lilás; lima e violeta sobre preto `#101010`; lilás e violeta sobre branco `#F5F5F5`; lima e lilás sobre preto.
- **✱ oficial sozinho:** o asterisco da marca como glifo único em lima sobre preto, violeta sobre lilás, preto sobre lima, lilás sobre violeta, lima sobre violeta e violeta sobre lima.

## Combinações

| Peça | Combina com |
|---|---|
| Gradiente em pontos | Texto grande em Clash, ilustração chapada, botão plimm |
| Pontos interativos | Texto curto lateral, selo de som |
| Faíscas | Ícones ✱, selos de som, números e conquistas |

## Onde cada uso aparece

| Contexto | Grafismo |
|---|---|
| Plataforma | Faíscas em sucessos; pontos interativos no carregamento; filete de composição de plataforma em um cartão de destaque por tela |
| Landing | Pontos interativos no hero; composição de landing nas transições entre seções; faíscas nos números |
| Apresentações | Composição de apresentação na capa e na abertura de seção; faíscas em slides de fechamento |
| Posts | Composição de posts com uma cor dominante, em pontos ou em faíscas |

## Produção

Ferramentas que geram o grafismo em código, com as cores vindas das variáveis do tema:

- **Dither:** a biblioteca dithercn (shader de dither com tinta e papel vindos do tema) gera o gradiente em pontos e o dither animado. Variáveis `--dither-ink` e `--dither-paper` recebem os hex da paleta.
- **Pontos que reagem ao cursor:** a textura Watch (textures.dev) faz uma grade de pontos que cresce perto do cursor, a base do comportamento "olho". Tinta e fundo entram por `--texture-ink` e `--texture-field`.
- **Gradientes suaves e animados (etapa seguinte):** shaders do pacote @paper-design/shaders-react e as receitas do HazeGlow, com as cores acima.
- **Glifos em ASCII:** a ferramenta ASCII Magic converte formas e imagens em campos de caracteres, para peças em que a faísca vira texto.
- Os protótipos desta pasta (`components/Grafismo/preview.html`) mostram as peças em canvas puro, sem dependências, e servem de especificação visual.

## Prompt base (peças estáticas geradas por IA)

```
Graphic background pattern, [PIECE: ordered dither gradient | field of glyphs on a flat dominant background where dots, plus signs, four-point sparkles and finally eight-arm rounded asterisks grow and change color |
grid of sparkle glyphs growing toward a glowing center], flat solid colors
only, hard pixel edges, no soft blur, no texture, color areas in these
proportions: [COLOR + HEX + PERCENT, ...], clean empty zone for text,
brand palette: lime #E6F344, lilac #B19DFC, violet #7F3AEF, pink #FF8AE5,
blue #8AD3FA, black #101010, white #F5F5F5.
```

Negative prompt: `photo, 3D, noise grain, muddy mid-tones, rainbow gradient, brown or beige tones, text, logos, characters`.

## Avaliação

Uma peça de grafismo entra no sistema quando responde sim às sete perguntas:
1. O fundo e a tinta são cores da paleta, citadas com hex?
2. As proporções de cor seguem o contexto?
3. O gradiente em pontos mostra cores puras, sem cor intermediária?
4. O texto fica sobre área chapada e legível?
5. O grafismo ocupa uma zona e deixa a outra livre?
6. Lima, lilás e violeta lideram, com rosa e azul em apoio?
7. Existe versão parada para movimento reduzido?

## Pendências desta direção

- Escolher, por contexto, entre a escala completa de glifos e o ✱ oficial sozinho.
- Definir o tamanho de ponto e de célula de cada contexto, e o ritmo das animações.
- Testar os pontos interativos como carregamento do Hattie.
- Aura (luz difusa): decidir na próxima etapa.
