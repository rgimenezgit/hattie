# Plataforma · instruções para o Claude

## Antes de desenhar ou codar
1. Leia `marca/04-visual/design-system/README.md` e o documento do tema em questão.
2. Use os tokens de `design/tokens.css` (`--bg`, `--ink`, `--action`, `--surface`). Nenhum hex solto no código.
3. Texto da interface segue `marca/03-verbal/regras-de-escrita.md`.

## Regras de interface
- Um botão plimm por tela, só para criar.
- Ícones de função com rótulo visível ou `aria-label`; ícones decorativos ocultos para leitores de tela.
- Contraste mínimo de 4,5:1 em texto e ícones de função; alvo de toque de 44 px.
- Selo de som: um por tela, 600 ms, minúsculas em Clash Display 600.
- Plataforma usa neutros com lima como ação (proporção 90 / 8 / 2).
- Movimento respeita "reduzir movimento" do sistema.
- Erro, preço, prazo e cobrança ficam em tom direto e caloroso, sem selo e sem piada.

## Decisões técnicas
Registre em `docs/decisoes-tecnicas.md` com data e motivo. Stack e hospedagem ainda não foram escolhidas.
