# App

Código da aplicação Hattie. Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui (base Radix).

## Rodar

```bash
npm run dev
```

## Design System

- Tokens de cor, tipografia e espaçamento vêm de `marca/04-visual/design-system/tokens.css`, copiados para `src/app/hattie-tokens.css`. Atualize sempre na fonte (`marca/`) e copie para cá.
- `src/app/globals.css` mapeia os papéis do Hattie (`--bg`, `--ink`, `--action`, `--surface`...) para as variáveis semânticas do shadcn (`--color-primary`, `--color-background`...).
- Temas via atributo `data-theme` no `<html>`: `gabinete` (padrão), `noturno`, `palco`, `intenso`.
- Clash Display (`src/fonts/`) e Poppins (Google Fonts) carregadas via `next/font` em `src/app/layout.tsx`.

## Bibliotecas

- `shadcn/ui` (Radix) para os componentes de base.
- `react-bits` e `dithercn` via registry do shadcn, para efeitos/componentes visuais.
- `p5`, `ogl` para coisas criativas (grafismos, shaders, zuum) e `calligraph`.

Antes de desenhar ou codar, leia `plataforma/CLAUDE.md`.
