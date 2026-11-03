---
title: Hattie — Fase 5 — Registro de Direção de Logo e Personagem
status: Paleta DEFINIDA — Elemento 2 e 3 (tipografia/escala) PROPOSTOS, aguardando confirmação do fundador — Logo e cara do Hattie em placeholder (decisão adiada de propósito) — Elemento 5 FORMALIZADO
last_updated: 2026-09-25
---

# Correções registradas (importante — não reintroduzir)

- **"Evitar clichê de estrelinhas e efeitos místicos" foi REMOVIDO como restrição.** Estrela/faísca como forma gráfica é bem-vinda e central.
- **A marca é lúdica, amigável e divertida** — traço central de personalidade. Toda escolha visual reflete isso primeiro.

# Paleta da marca — DEFINIDA

| Nome provisório | HEX | RGB |
|---|---|---|
| Branco | #FFFFFF | 255, 255, 255 |
| Coral | #FF6237 | 255, 98, 55 |
| Âmbar | #FFB530 | 255, 181, 48 |
| Azul claro | #7EC4FF | 126, 196, 255 |
| Azul vivo | #4164FE | 65, 100, 254 |
| Preto | #000000 | 0, 0, 0 |

Fechada. Mudanças futuras são decisão do fundador quando ele quiser.

Nota de acessibilidade (guardada, não é pendência): Âmbar e Azul claro não funcionam como cor de texto sobre branco — usar só como preenchimento de forma. Azul vivo, Coral e Preto são seguros para texto/ícone pequeno.

# Elemento 2 — Sistema Tipográfico (PROPOSTO — aguardando confirmação do fundador)

> Nota de continuidade: a versão original deste elemento (definida antes da paleta final) se perdeu numa compactação de contexto no meio da sessão e nunca foi salva aqui. Esta é uma reconstrução do zero, a partir dos arquivos de fonte que o fundador enviou (DM Sans variável + Darumadrop One) e das instruções abaixo. Precisa de confirmação explícita antes de virar definitivo.

## Duas trilhas

**Trilha 1 — Plataforma (produto digital):**
- **DM Sans** cobre display, heading E apoio/corpo — uma única família variável (eixos `opsz` 9–40, `wght` 100–1000), diferenciando os papéis por peso/tamanho ótico em vez de trocar de família.
- Fonte: Google Fonts · Licença: OFL (gratuita, uso comercial livre) · Pesos: variável 100–1000 · Fundador enviou o arquivo variável (`DMSans-VariableFont_opszwght.ttf`).
- Papel de "sistema/UI" na plataforma: assumido como a própria DM Sans (peso mais leve, opsz baixo) — não foi especificado um quarto font separado. **Assunção a confirmar com o fundador.**

**Trilha 2 — Materiais institucionais e marketing:**
- **Display:** Darumadrop One — Google Fonts · OFL · peso único (Regular) · fundador enviou `DarumadropOne-Regular.ttf`. Letras infladas/arredondadas, lê como brincadeira genuína. Só para headlines curtas — nunca em texto corrido.
- **Apoio e texto:** DM Sans (mesma família da plataforma, weight 400/500) — mantém as duas trilhas ligadas pela mesma base.
- **Sistema:** Arial. Fonte de sistema (proprietária da Monotype), usada apenas referenciada — nunca embutida/distribuída — portanto sem custo de licença. Fallback obrigatório: pilha "Arial, Helvetica, sans-serif" (nem todo sistema, ex. Linux, tem Arial instalada).

Renderizado em `hattie_tipografia_triade`.

# Elemento 3 — Escala Tipográfica e Espaçamento (PROPOSTO — aguardando confirmação do fundador)

Razão de escala: **Perfect Fourth (1.333)**, base 16px. Escolhida por dar hierarquia forte e de impacto (bate com a personalidade lúdica/divertida) sem inflar demais os níveis de topo — uma razão mais dramática (1.414+) combinada aos ~8 níveis do framework geraria um Display acima de 250px, impraticável.

| Nível | Tamanho | Peso (DM Sans) | Line-height |
|---|---|---|---|
| Display | 64px | 800 | 1.05 |
| H1 | 48px | 700 | 1.1 |
| H2 | 36px | 700 | 1.15 |
| H3 | 27px | 600 | 1.2 |
| H4 | 20px | 600 | 1.3 |
| Body | 16px | 400 | 1.6 |
| Small | 13px | 400 | 1.5 |
| Caption | 11px | 500 | 1.4 |
| Label (sistema) | 11px | 700, tracking +0.06em | 1.3 |

Extremos arredondados para múltiplos de 4/8; piso de legibilidade mantido em 11px.

Espaçamento: ainda não definido — próximo passo depois da confirmação da escala.

Renderizado em `hattie_escala_tipografica`.

# Elemento 4 — Logo: PLACEHOLDER (decisão adiada de propósito)

Sem tipo, geometria, grade ou versões de cor definidos. Transfer Block deve trazer isso como placeholder. Não é pendência ativa — só volta à mesa quando o fundador trouxer o assunto.

# Hattie — o personagem: TEM ROSTO, cara ainda em PLACEHOLDER (decisão adiada de propósito)

Confirmado que tem rosto — expressão amigável é núcleo da identidade. Os detalhes (olhos, proporção, expressão exata) ficam em placeholder junto com o logo, mesma lógica: não é pendência ativa, só volta quando o fundador trouxer.

# Elemento 5 — Elementos Gráficos e Princípios Visuais (FORMALIZADO)

## Parte 1 — Estilo de ícone

**Ícones de plataforma/funcionais:** biblioteca pronta e definitiva — **Lucide** (https://lucide.dev/, licença ISC, gratuita). Fork do Feather Icons, grade 24×24, terminais e junções de traço arredondados por padrão — alinhado ao requisito de cantos arredondados em toda a interface. *(Substitui a recomendação anterior de Phosphor Icons — decisão superada.)*

**Ícones/formas de assinatura da marca:** NÃO vêm de biblioteca — são desenhados no estilo próprio descrito na Parte 2. Uma cor sólida por forma, nunca duas cores misturadas na mesma peça. Nunca usar Lucide (ou qualquer ícone de plataforma) como substituto das formas de assinatura, e vice-versa: são dois sistemas com papéis diferentes.

## Parte 2 — Formas e padrões (kit de assinatura)

Kit oficial, renderizado em `hattie_kit_formas_expandido`: blob assimétrico, faísca, faísca diagonal, laço cruzado, espiral, rabisco, redemoinho, flor de pontas.

Regras de construção:
- Uma cor sólida da paleta por forma — nunca gradiente, nunca duas cores na mesma peça.
- Traços grossos — nunca finos ou delicados.
- Estrelas/faíscas variam número e proporção das pontas entre si — nunca uma estrela-padrão repetida.
- Toda forma tem uma leve quebra de simetria (um braço mais longo, uma ponta deslocada, um lado mais largo) — nunca perfeitamente regular/geométrica.
- Padrão de fundo pode ser denso, colorido e girado em ângulos soltos, tipo confete.
- Única regra que permanece: contraste suficiente atrás de texto.

Uso: elemento gráfico solto, tipo "adesivo" — não como container de conteúdo (isso é Parte 3).

## Parte 3 — Princípios de layout

Referências: caso do Behance "MindMarket" (https://www.behance.net/gallery/239491035/MindMarket) + 6 telas de UI enviadas pelo fundador (app de viagem "buddy", grid do Google Labs, site "Artistry", dashboard, landing "TalktoCanada", planejador de viagem com IA, "ZoomSphere"). Padrão extraído e resumido em `hattie_anatomia_layout`:

- **Container de imagem orgânico** (blob) — nunca retângulo puro nem máscara elíptica.
- **Adesivos girados**: badges/pills coloridos rotacionados sobrepondo a borda da imagem ou do card.
- **Headline sempre em texto escuro/preto** — a cor vive nos blocos e cards, nunca no texto.
- **Grid de cards arredondados** pode ser denso e colorido em contextos de vitrine (ex.: grid do Google Labs).
- **Espaço branco generoso** como respiro entre blocos densos.
- **Cantos arredondados generosos são regra obrigatória em TODA a interface** (campos, botões, cards) — não só em elementos decorativos.
- Formas de assinatura (Parte 2) podem quebrar a grade de propósito, como adesivos.
- Grade de conteúdo continua limpa por usabilidade; o tratamento visual é sempre amigável.

Princípio-síntese: **"container orgânico + adesivo girado + cor no bloco, texto sempre escuro."**

## Parte 4 — Tratamento de imagem

Fotos em cor real, sem duotone, sem máscara elíptica. Personalidade via "adesivos" das formas de assinatura (Parte 2) nos cantos/bordas da foto.

**Nota — direção de fotografia da marca (pertence formalmente à Fase 6, guardada aqui para não se perder):**
Fotos promocionais/institucionais de pessoas — ambientes brancos e claros (estúdio ou espaços criativos brancos), destaque para os sujeitos usando ou próximos a elementos com cores da marca, luz branca de cor neutra (nunca quente, nunca fria), wide angle. Levar para a Phase 6 Guidance no Transfer Block final.

## Parte 5 — Movimento

**Adiado.** Fundador optou por buscar referências antes de fechar esta parte — não é pendência ativa, não repetir a pergunta. Registro anterior (easing com mola/overshoot, 300-500ms, elementos podem "pop" e assentar) fica como ponto de partida quando o assunto voltar, mas não está confirmado.

# Pendências ativas (só isso)

- **Confirmar Elemento 2 e 3** (tipografia e escala) com o fundador — proposta pronta, aguardando aprovação. Ver assunção sobre papel de "sistema" na plataforma (DM Sans mesma, ou fonte separada?).
- Definir sistema de espaçamento (Elemento 3, parte final) — depende da escala ser confirmada primeiro.
- Compilar Phase 6 Guidance com a direção de fotografia já descrita pelo fundador (Parte 4 do Elemento 5).
- Elemento 5 Parte 5 (movimento): aguardando referências do fundador — não é bloqueio, só não fechar sem elas.
- Logo e cara do Hattie: placeholder de propósito — não perguntar de novo, só se o fundador trouxer.
