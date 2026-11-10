import { createCn } from "cn/config"

// Ensina ao cn os tamanhos de texto da plataforma (globals.css), para que text-detalhe
// não seja lido como cor e apague um text-branco vizinho.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "titulo-1", "titulo-2", "titulo-3", "destaque", "corpo", "detalhe", "micro"] }],
    },
  },
})
