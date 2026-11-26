# Gerador de grafismo

Ferramenta para montar e exportar os grafismos do Hattie (`../../8-grafismo-e-gradiente.md`): gradiente em pontos, faíscas e o ✱ oficial, com as cores da paleta e as composições por contexto como presets.

Abra `index.html` no navegador. Funciona sem internet e sem instalar nada. Também abre pelo mapa das telas do app (`npm run dev` em `plataforma/app`), em ferramentas da marca.

## O que dá para fazer
- **Quadro:** formatos prontos (post 4:5, quadrado, story, slide 16:9, hero da landing, capa do LinkedIn, A4) ou largura e altura livres.
- **Técnica:** pontos (dither Bayer em pixel quadrado ou redondo, com espaço entre pontos) ou faíscas (grade de glifos: escala ponto → mais → brilho → ✱, ou um glifo só).
- **Forma do campo:** linear, radial, faixas, mancha, anel ou chapado, com centro, tamanho, ângulo, curva, ondulação e inversão.
- **Alças no quadro:** como no Figma, a linha do gradiente aparece sobre a peça. As bolinhas mudam início, fim, centro e largura da forma; os quadradinhos são as paradas de cor e correm ao longo da linha. Um clique na linha põe uma cor ali.
- **Cor:** só cores da paleta, mais a transparente. Cada cor é uma parada com posição em %, editada na barra (arrastar, clicar para pôr cor, setas e Delete) ou na lista. Na lista, a alça ⋮⋮ arrasta a cor para outra posição da ordem. Também tem largura da transição, inverter e distribuir. Nas faíscas, a cor vem da paleta ou de cada degrau de luz.
- **Transparente:** onde a cor é transparente aparece o que está atrás (imagem de fundo ou cor de fundo). No PNG sem fundo esses pontos saem vazios.
- **Imagem de fundo:** botão ou arrastar o arquivo para o quadro. Ajuste para cobrir o quadro ou caber inteira e opacidade. Entra no PNG com fundo e no vídeo; fica fora do link (as peças guardadas levam a imagem quando cabe no navegador).
- **Movimento:** deriva, respirar, girar, fluir e pulso, com ciclo em segundos (o vídeo fecha o laço no mesmo quadro).
- **Interação com o cursor:** seguir, lupa, rastro, onda e afastar, com opção de mover sozinho sem mouse.
- **Exportar:** PNG com fundo e sem fundo (1×, 2× ou 3×), vídeo de um ciclo (MP4 ou WebM, conforme o navegador), link da peça e configuração em JSON.
- **Guardar:** peças com nome ficam salvas no navegador; o link guarda a peça inteira.

Com "reduzir movimento" ligado no sistema, a peça abre parada (botão de tocar no topo).
