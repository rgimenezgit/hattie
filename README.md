# Hattie

Mágica de criar marca. Este projeto reúne a marca Hattie e a plataforma que a coloca no mundo.

## Estrutura

```
hattie/
├── CLAUDE.md            contexto e regras para o Claude
├── marca/               fonte da verdade da marca
│   ├── 01-estrategia/   negócio, mercado, propósito, públicos, posicionamento
│   ├── 02-personalidade/ personalidade, arquétipo, personagem
│   ├── 03-verbal/       nome, tom de voz, glossário, manifesto
│   ├── 04-visual/       Design System, tokens e arquivo
│   ├── 05-decisoes/     decisões e alinhamentos
│   └── _fontes/         saídas originais das fases
├── assets/              logos, personagem, ícones, grafismos, fontes, peças
├── plataforma/          produto, design, docs e código
├── wiki/                glossário interno, referências, inbox
├── tcc/                 ponte com a monografia
└── .claude/skills/      skills do projeto
```

## Como começar
1. Leia `marca/README.md` para entender a marca.
2. Abra `marca/04-visual/design-system/components/*/preview.html` no navegador para ver o sistema funcionando.
3. Veja `marca/05-decisoes/alinhamentos.md` para os pontos em aberto.
4. Para construir a plataforma, siga `plataforma/CLAUDE.md` e `plataforma/produto/`.

## Repositório
A pasta está pronta para virar repositório. No terminal, dentro de `hattie/`:

```
git init
git add .
git commit -m "Estrutura inicial do projeto Hattie"
```

Depois crie o repositório no GitHub (privado) e conecte com `git remote add origin`.
