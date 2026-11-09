# Plataforma · instruções para o Claude

## Antes de desenhar ou codar
1. Leia `marca/04-visual/design-system/README.md`, `design/diretrizes-ui.md` e o documento do tema em questão.
2. Use os tokens (`--bg`, `--ink`, `--action`, `--surface`…) e os componentes de `app/src/components/hattie/`. Nenhum hex solto no código; cores de marcas de clientes ficam nos dados.
3. Texto da interface segue `marca/03-verbal/regras-de-escrita.md` e a skill `hattie-voz`.
4. Estrutura e rotas: `produto/fluxos.md` e `docs/arquitetura.md`.

## Regras de interface
- Um botão plimm por tela, só para criar.
- Ícones de função com rótulo visível ou `aria-label`; ícones decorativos ocultos para leitores de tela.
- Contraste mínimo de 4,5:1 em texto e ícones de função; alvo de toque de 44 px.
- Selo de som: um por tela, 600 ms, minúsculas em Clash Display 600.
- Plataforma usa neutros com lima como ação (proporção 90 / 8 / 2).
- Movimento respeita "reduzir movimento" do sistema.
- Erro, preço, prazo e cobrança ficam em tom direto e caloroso, sem selo e sem piada.
- Checklist de entrega no fim de `design/diretrizes-ui.md`.

## Tokens
A fonte é `marca/04-visual/design-system/tokens.css`. Ao mudar, copie para `design/tokens.css` e para `app/src/app/hattie-tokens.css` (esta sem os `@font-face`, que o `next/font` resolve).

## Decisões técnicas
Stack escolhida: Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui, em `app/`. Registre novas decisões em `docs/decisoes-tecnicas.md` com data e motivo. Hospedagem, dados e IA ainda em aberto (`docs/arquitetura.md`).
