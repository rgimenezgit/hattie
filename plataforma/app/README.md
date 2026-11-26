# App

Código da aplicação Hattie. Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (base Radix).

## Rodar

```bash
npm run dev
```

Abra a rota `/`: ela é o mapa das telas. Para o fluxo completo, comece em `/criar-conta`. O cartão lima "acesso da banca" no mapa liga a versão reduzida para a banca do TCC (regras em `src/lib/banca.ts`). A vitrine dos componentes fica em `/dev/tokens` e o gerador de grafismo em `/ferramentas/gerador/index.html`. O gerador é copiado de `marca/` quando o `npm run dev` começa: depois de mudar o arquivo em `marca/`, reinicie o dev para ver a mudança.

## Onde está cada coisa

| Pasta | Conteúdo |
|---|---|
| `src/app/` | Rotas: `(entrada)/*`, `comecar`, `marcas`, `marca/[marca]/*` |
| `src/components/hattie/` | Peças da interface: Plimm, Botao, Composer, Campo, Segmentado, StatusBadge, MenuAcoes, SeloSom, IconeHattie |
| `src/components/app/` | Telas, shell e estado do app |
| `src/components/ui/` | Componentes base do shadcn |
| `src/lib/mock/` | Dados fictícios: Bia, Raiz Natural, plano de criação, cérebro da marca, projetos e modelos |
| `src/lib/dither/` | Motor de dither (dithercn) usado nos blocos de imagem |
| `public/icones`, `public/personagem`, `public/logos` | Cópias limpas de `assets/` |

## Design System

- Tokens: cópia de `marca/04-visual/design-system/tokens.css` em `src/app/hattie-tokens.css`. Atualize na fonte e copie para cá.
- `src/app/globals.css` mapeia os papéis do Hattie para as variáveis do shadcn.
- Temas por `data-theme` no `<html>`: `gabinete` (padrão), `noturno`, `palco`, `intenso`.
- Regras de interface: `plataforma/design/diretrizes-ui.md`.

Antes de desenhar ou codar, leia `plataforma/CLAUDE.md`.
