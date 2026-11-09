# Plimm

O botão plimm é a marca registrada do Hattie: o botão de ação de criar. Cada clique é um toque de magia.

## Regras de plataforma
- Um plimm por tela. Ele cria: gerar marca, gerar variação, gerar peça, confirmar uma criação.
- Formato pílula (`radius-pill`), altura 56px (grande) ou 44px (padrão), padding lateral `space-32` / `space-24`.
- Fundo `action`, texto e ícone `on-action`. Rótulo em Clash Display 600 (`som-s`), minúsculas, com o ícone ✱ à esquerda.
- Rótulo padrão: `plimm`. Com contexto: `plimm · criar logotipo`. O rótulo mais longo usa Poppins 600 (`cta`).
- Estados: padrão, hover (sobe 2px, sombra sólida de 4px em `lima-forte` no tema noturno e em `preto` nos outros), pressionado (`action-pressed`, desce 2px), foco (anel `focus` de 3px), carregando (✱ gira, rótulo vira `plimm…`), desabilitado (`cinza` com texto `grafite`).
- No clique, a tela mostra o selo `plimm` por 600ms perto do resultado e a criação aparece. Sem áudio por enquanto.
- Cor na plataforma: lima `#E6F344` com texto e ✱ pretos (decisão de 09/11/2026). Em peças: preto com texto lima sobre fundos claros e lilás; lima com texto preto sobre fundo preto e sobre violeta (tema Palco intenso).

## Regras de comunicação
- Aparece em peças como desenho do botão, sempre na mesma forma: pílula, ✱ e a palavra `plimm`.
- Uma peça tem no máximo um plimm, no canto inferior ou ao lado do headline.
- Pode acompanhar um CTA em frase: `plimm · crie sua marca`.

## Uso do ícone ✱
O ✱ é o desenho oficial da marca em SVG (`components/Grafismo/hattie-asterisco.svg`), porque a Clash Display e a Poppins não têm esse glifo. Ele é um grafismo da marca, fora do logo.
