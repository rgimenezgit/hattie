#!/usr/bin/env node
/*
 * Gera as imagens de exemplo da Raiz Natural com a fal.ai e salva em public/marcas/raiz-natural/.
 *
 *   node scripts/imagens-marca/gerar.mjs            gera só o que ainda não existe
 *   node scripts/imagens-marca/gerar.mjs foto-janela mockup-1   gera só essas (e refaz se já existirem)
 *   node scripts/imagens-marca/gerar.mjs --lista    mostra o plano, sem gastar nada
 *
 * Modelos, como o Raphael definiu em 20/11/2026:
 * - Seedream 5.5 (texto para imagem): fotografias e ilustrações da marca.
 * - Seedream 5.5 Edit: quando precisa do logo de referência numa imagem fotográfica.
 * - GPT Image 2 Edit: mockups da tela "olha como ficou" (primeira etapa de aprovação), com o logo.
 * - GPT Image 2.6 Sunburst Edit: inserção de produto (o frasco de referência entra na cena).
 * Tudo em 1K. Os prompts juntam o pedido de cada imagem com os parâmetros dos estilos que estão no cérebro.
 *
 * A chave vem de FAL_KEY no .env.local e só vai para a fal.ai.
 */

import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const SAIDA = path.join(RAIZ, "public/marcas/raiz-natural")

/* ---------- Estilos da marca (camadas do cérebro, seção Estilo fotográfico e Ilustração) ---------- */

const ESTILO_FOTO = [
  "Estilo fotográfico Origem natural da marca de cosméticos naturais Raiz Natural, de Ribeirão Preto, com ingredientes do cerrado.",
  "Registro: calmo e verdadeiro, um momento real de cuidado, com a luz da manhã entrando pela janela e o cerrado por perto.",
  "Cor: gradação quente e suave, puxando para o âmbar do óleo de pequi; temperatura morna, nunca azulada; sombras marrom-cacau, nunca cinza ou azul; altas luzes caem para o creme, sem branco estourado; meios-tons dourados e pouco saturados; um toque de verde-mata em cada cena (folha, rótulo ou tecido).",
  "Paleta: verde-mata #2F4A3A, argila #C9A27E, creme #F2EBDD, cacau #5C3B28, âmbar do pequi #D9A441.",
  "Luz: natural, de janela, lateral vindo da esquerda, suave e difusa; sombra macia, marrom e transparente, com recorte de folhas; manhã, entre 8h e 10h. Dentro: janela com cortina de linho. Fora: sombra de árvore, sem sol a pino.",
  "Câmera: na altura dos olhos (de cima só para bancada e kit); profundidade de campo rasa, produto em foco e fundo desfocado; lente normal a retrato, sem distorção; espaço negativo generoso de um lado, para caber texto; composição assimétrica, com o assunto num terço da imagem.",
  "Pessoas: 25 a 45 anos, tons de pele variados e corpos reais; gestos de cuidado (passar, cheirar, segurar); linho e algodão em creme, argila e verde, sem logos; olhar fora da câmera; expressão calma, meio sorriso, sem pose; pele com textura e cabelo natural.",
  "Ambiente: banheiro com janela, bancada de produção, varanda com plantas, colheita no cerrado; casa simples do interior, parede de cal e madeira; madeira clara, linho, cerâmica, vidro âmbar e pedra; folhas do cerrado, frutos de pequi, toalha de linho, tigela de cerâmica e caderno de lote.",
  "Acabamento: filme de retrato quente, pele macia e sombras abertas; pós-produção leve, documental; textura de pele visível; grão fino e sutil.",
  "Evitar: fundo branco de estúdio, sorriso de propaganda olhando para a câmera, luz dura do meio-dia, objetos de plástico, cena centralizada e simétrica, azul frio, neon, cinza neutro, saturação alta. Sem texto escrito na imagem, a não ser no rótulo do produto.",
].join("\n")

const ESTILO_ILUS = [
  "Ilustração no estilo Caderno de campo da marca Raiz Natural: um caderno de campo do cerrado, curioso e cuidadoso, que ensina de onde vem cada ingrediente com calma e capricho.",
  "Cor: cores chapadas, sem degradê; até três cores por desenho, mais o fundo creme #F2EBDD (ou papel kraft), nunca branco puro; linhas em cacau #5C3B28; preenchimento em verde-mata #2F4A3A, argila #C9A27E e âmbar do pequi #D9A441.",
  "Traço: uma espessura só em todo o desenho, fina; pontas e cantos arredondados; contorno em cacau em volta de todas as formas; linha de pena levemente irregular, como desenho à mão. Nunca contorno preto, nunca espessuras misturadas.",
  "Forma: orgânica, a partir de folhas, gotas e círculos; cantos arredondados com raio generoso; proporção fiel ao ingrediente real; só os detalhes que ajudam a reconhecer a planta.",
  "Textura: grão leve de papel, bem sutil; sem sombra (a profundidade vem da sobreposição de cores); nenhum brilho, tudo chapado e fosco.",
  "Importante: cada área é preenchida com uma cor só, 100% chapada, sem sombreado, sem luz e sombra de volume, sem degradê e sem hachura de sombra; os detalhes internos são feitos só com a mesma linha cacau.",
  "Pessoas, quando aparecem: mãos e silhuetas, sem rosto detalhado; tons de pele variados; proporção natural; gesto calmo.",
  "Composição: plana e frontal, como uma prancha botânica; pelo menos 30% de fundo livre; um elemento principal e até dois de apoio.",
  "Evitar: mascote ou personagem com cara de desenho animado, folhinha genérica de produto natural, degradê, brilho, sombra projetada, 3D, isométrico, olhos grandes. Sem texto escrito na imagem.",
].join("\n")

/* ---------- Modelos e tamanhos (1K) ---------- */

const MODELOS = {
  seedream: "bytedance/seedream/v5.5/text-to-image",
  seedreamEdit: "bytedance/seedream/v5.5/edit",
  gptEdit: "openai/gpt-image-2/edit",
  sunburst: "openai/gpt-image-2.6/sunburst/edit",
}

// Seedream pede pelo menos 921.600 pixels; os da OpenAI, múltiplos de 16.
const TAMANHOS = {
  seedream: { "4:5": [864, 1080], "1:1": [1024, 1024], "4:3": [1152, 864], "3:4": [864, 1152], "3:2": [1176, 784], "16:9": [1312, 738] },
  openai: { "4:5": [1024, 1280], "1:1": [1024, 1024], "4:3": [1152, 864], "3:4": [864, 1152], "3:2": [1248, 832], "16:9": [1536, 864] },
}

/* ---------- O que gerar ---------- */

const LOGO = "ref/logo-composta.png"
const SIMBOLO = "ref/logo-simbolo.png"
const FRASCO = "ref/frasco-pequi.jpg"

const foto = (pedido) => `${pedido}\n\n${ESTILO_FOTO}`
const ilus = (pedido) => `${pedido}\n\n${ESTILO_ILUS}`
const insercao = (pedido) =>
  `Coloque o produto da imagem de referência (o frasco de vidro âmbar com conta-gotas e rótulo creme da Raiz Natural) nesta cena, com a mesma forma, cor e rótulo, na escala certa e com a luz e a sombra da cena. ${pedido}\n\n${ESTILO_FOTO}`

/** @type {{ id: string; destino: string; modelo: keyof typeof MODELOS; proporcao: string; prompt: string; refs?: string[] }[]} */
const IMAGENS = [
  /* Referência de produto: vem primeiro, porque as inserções usam ela. */
  {
    id: "ref-frasco",
    destino: FRASCO,
    modelo: "seedreamEdit",
    proporcao: "4:5",
    refs: [LOGO],
    prompt: foto(
      "Fotografia de produto de um frasco de vidro âmbar de 30 ml com conta-gotas, cheio de óleo de pequi dourado. Rótulo de papel creme #F2EBDD com o logo da imagem de referência aplicado em verde-mata #2F4A3A, exatamente como no logo (a gota com raízes vazadas e o nome Raiz Natural), e abaixo dele, em letras pequenas, \"Óleo de pequi · Lote 12\". O frasco inteiro, de frente, em pé sobre uma superfície de linho creme, fundo liso creme #F2EBDD, um fruto de pequi e uma folha do cerrado ao lado.",
    ),
  },

  /* Estilo fotográfico (cérebro): as seis imagens de exemplo, 4:3. */
  { id: "foto-maos-oleo", destino: "fotografia/maos-oleo.jpg", modelo: "sunburst", proporcao: "4:3", refs: [FRASCO], prompt: insercao("Cena: detalhe de mãos de uma mulher aplicando o óleo de pequi no braço, gotas brilhando na pele com textura; o frasco aberto apoiado na bancada de madeira clara ao lado, conta-gotas na mão.") },
  { id: "foto-frasco-frutos", destino: "fotografia/frasco-frutos.jpg", modelo: "sunburst", proporcao: "4:3", refs: [FRASCO], prompt: insercao("Cena: detalhe do frasco âmbar ao lado de frutos de pequi inteiros e um aberto, sobre tecido de linho argila, com sombra de folhas recortada na mesa.") },
  { id: "foto-janela", destino: "fotografia/janela.jpg", modelo: "seedream", proporcao: "4:3", prompt: foto("Cena: meio corpo de uma mulher de uns 35 anos, pele parda, na janela com cortina de linho, passando hidratante no rosto com as pontas dos dedos, olhar baixo e calmo, camisa de linho creme, parede de cal.") },
  { id: "foto-bancada", destino: "fotografia/bancada.jpg", modelo: "seedream", proporcao: "4:3", prompt: foto("Cena: vista de cima de uma bancada de produção artesanal de madeira clara, com o caderno de lote aberto escrito à mão, frascos âmbar sem rótulo enfileirados, tigela de cerâmica com óleo dourado, frutos de pequi e folhas do cerrado.") },
  { id: "foto-colheita", destino: "fotografia/colheita.jpg", modelo: "seedream", proporcao: "4:3", prompt: foto("Cena: ambiente, colheita de pequi na cooperativa no cerrado, uma mulher de chapéu de palha recolhendo frutos do chão com um cesto de palha, sombra de árvore, árvores tortas do cerrado ao fundo, luz da manhã.") },
  { id: "foto-kit", destino: "fotografia/kit.jpg", modelo: "sunburst", proporcao: "4:3", refs: [FRASCO], prompt: insercao("Cena: vista de cima de um kit de presente em papel kraft, aberto, com o frasco, um pote de cerâmica e um sabonete em papel de seda, um raminho do cerrado e um cartão escrito à mão.") },

  /* Ilustração (cérebro): as seis de exemplo, 4:3. */
  { id: "ilus-pequi", destino: "ilustracao/pequi.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: um fruto de pequi inteiro e outro aberto mostrando a polpa âmbar, com um ramo de folhas, como numa prancha botânica.") },
  { id: "ilus-baru", destino: "ilustracao/baru.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: sementes de baru, uma vagem aberta e três folhas, como numa prancha botânica.") },
  { id: "ilus-buriti", destino: "ilustracao/buriti.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: um buritizeiro inteiro com cachos de frutos avermelhados, simplificado, numa vereda.") },
  { id: "ilus-paisagem", destino: "ilustracao/paisagem.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: paisagem do cerrado ao amanhecer, com árvores tortas, morros baixos e o sol nascendo em âmbar.") },
  { id: "ilus-frasco", destino: "ilustracao/frasco.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: um frasco de hidratante de vidro entre folhas do cerrado e uma gota de óleo, simples, para etiqueta.") },
  { id: "ilus-padrao", destino: "ilustracao/padrao.jpg", modelo: "seedream", proporcao: "4:3", prompt: ilus("Desenho: padrão contínuo de folhas, sementes de baru e frutos de pequi espaçados, para papel de presente.") },

  /* Mockups da tela "olha como ficou": GPT Image 2 Edit, com o logo e o frasco. */
  {
    id: "mockup-1",
    destino: "mockups/1.jpg",
    modelo: "gptEdit",
    proporcao: "16:9",
    refs: [LOGO, FRASCO],
    prompt: foto(
      "Mockup de apresentação da marca: sobre uma bancada de madeira clara junto a uma janela, o frasco de óleo da segunda imagem de referência, um pote de cerâmica creme e uma caixa de papel kraft com o logo da primeira imagem de referência estampado em verde-mata #2F4A3A. Aplique o logo exatamente como na referência: a gota com raízes vazadas e o nome Raiz Natural na mesma fonte serifada. Folhas do cerrado e frutos de pequi em volta. Composição larga, com respiro.",
    ),
  },
  { id: "mockup-2", destino: "mockups/2.jpg", modelo: "gptEdit", proporcao: "4:3", refs: [LOGO], prompt: foto("Mockup: sacola de papel kraft em pé numa varanda com plantas, com o logo da imagem de referência carimbado em verde-mata #2F4A3A, exatamente como no logo (a gota com raízes vazadas e o nome Raiz Natural na mesma fonte serifada).") },
  { id: "mockup-3", destino: "mockups/3.jpg", modelo: "gptEdit", proporcao: "4:3", refs: [SIMBOLO], prompt: foto("Mockup: etiqueta de papel creme presa com barbante a um pacote de presente em papel kraft, com o símbolo da imagem de referência (a gota com raízes vazadas) impresso em verde-mata #2F4A3A no centro da etiqueta, exatamente como na referência.") },
  { id: "mockup-4", destino: "mockups/4.jpg", modelo: "gptEdit", proporcao: "4:3", refs: [LOGO], prompt: foto("Mockup: cartões de visita de papel creme encorpado empilhados sobre linho argila, com o logo da imagem de referência impresso em verde-mata #2F4A3A, exatamente como no logo (a gota com raízes vazadas e o nome Raiz Natural na mesma fonte serifada), e uma folha do cerrado ao lado.") },

  /* Fotos da Biblioteca (aparecem também nos projetos). */
  { id: "bib-pequi-bancada", destino: "biblioteca/f-pequi-bancada.jpg", modelo: "sunburst", proporcao: "4:5", refs: [FRASCO], prompt: insercao("Cena: o frasco de óleo de pequi sobre uma bancada de madeira, luz de janela, folhas do cerrado ao fundo desfocadas.") },
  { id: "bib-pequi-maos", destino: "biblioteca/f-pequi-maos.jpg", modelo: "sunburst", proporcao: "1:1", refs: [FRASCO], prompt: insercao("Cena: close de mãos espalhando gotas de óleo de pequi na pele, fundo creme desfocado, o frasco na borda do quadro.") },
  { id: "bib-pequi-verde", destino: "biblioteca/f-pequi-verde.jpg", modelo: "sunburst", proporcao: "4:5", refs: [FRASCO], prompt: insercao("Cena: o frasco de óleo de pequi sozinho sobre um fundo liso verde-mata #2F4A3A, sombra curta e macia, um fruto de pequi ao lado. Aqui o fundo de uma cor é intencional.") },
  { id: "bib-cooperativa", destino: "biblioteca/f-cooperativa.jpg", modelo: "seedream", proporcao: "3:2", prompt: foto("Cena: Dona Cida, cooperada de uns 55 anos, pele negra, chapéu de palha, colhendo pequi no cerrado e segurando um fruto nas mãos, sol da manhã filtrado pelas árvores.") },
  { id: "bib-lote-sol", destino: "biblioteca/f-lote-sol.jpg", modelo: "seedream", proporcao: "3:2", prompt: foto("Cena: vista de cima de frutos de pequi secando em peneiras de palha ao sol da manhã, na cooperativa de Pirenópolis, sombra de folhas sobre as peneiras.") },
  { id: "bib-baru-recorte", destino: "biblioteca/f-baru-recorte.jpg", modelo: "seedreamEdit", proporcao: "1:1", refs: [LOGO], prompt: foto("Fotografia de produto: pote de vidro âmbar baixo, com tampa de madeira, de hidratante de baru, rótulo de papel creme com o logo da imagem de referência em verde-mata #2F4A3A (a gota com raízes vazadas e o nome Raiz Natural) e, em letras pequenas, \"Hidratante de baru\". Pote inteiro sobre fundo liso creme #F2EBDD, para loja e catálogo, com sementes de baru ao lado. Aqui o fundo de uma cor é intencional.") },
  { id: "bib-buriti-banho", destino: "biblioteca/f-buriti-banho.jpg", modelo: "seedream", proporcao: "3:4", prompt: foto("Cena: foto de celular, um sabonete artesanal laranja-âmbar de buriti com espuma numa pia de pedra, perto da janela do banheiro, toalha de linho dobrada.") },
  { id: "bib-feira", destino: "biblioteca/f-feira.jpg", modelo: "seedream", proporcao: "4:3", prompt: foto("Cena: Bia, empreendedora de uns 34 anos, pele parda, cabelo cacheado, atrás da banca da marca na feira de domingo, frascos âmbar e potes em caixotes de madeira, toldo creme, conversando com uma cliente, olhar fora da câmera.") },
]

/* ---------- Execução ---------- */

async function lerChave() {
  const texto = await readFile(path.join(RAIZ, ".env.local"), "utf8").catch(() => "")
  const linha = texto.split("\n").find((atual) => /^FAL_KEY=.+/.test(atual.trim()))
  return linha?.trim().slice("FAL_KEY=".length)
}

async function comoDataUri(relativo) {
  const arquivo = path.join(SAIDA, relativo)
  const tipo = arquivo.endsWith(".png") ? "image/png" : "image/jpeg"
  return `data:${tipo};base64,${(await readFile(arquivo)).toString("base64")}`
}

async function gerar(imagem, chave) {
  const familia = imagem.modelo.startsWith("seedream") ? "seedream" : "openai"
  const [width, height] = TAMANHOS[familia][imagem.proporcao]
  const corpo = { prompt: imagem.prompt, image_size: { width, height }, num_images: 1, output_format: "jpeg" }
  if (familia === "openai") corpo.quality = "medium"
  if (imagem.refs?.length) corpo.image_urls = await Promise.all(imagem.refs.map(comoDataUri))

  const inicio = Date.now()
  const resposta = await fetch(`https://fal.run/${MODELOS[imagem.modelo]}`, {
    method: "POST",
    headers: { Authorization: `Key ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
    signal: AbortSignal.timeout(300_000),
  })
  if (!resposta.ok) throw new Error(`${resposta.status} ${(await resposta.text()).slice(0, 300)}`)
  const dados = await resposta.json()
  const url = dados.images?.[0]?.url
  if (!url) throw new Error(`sem imagem na resposta: ${JSON.stringify(dados).slice(0, 200)}`)
  const arquivo = await fetch(url)
  const destino = path.join(SAIDA, imagem.destino)
  await mkdir(path.dirname(destino), { recursive: true })
  await writeFile(destino, Buffer.from(await arquivo.arrayBuffer()))
  return { segundos: Math.round((Date.now() - inicio) / 1000), largura: dados.images[0].width, altura: dados.images[0].height }
}

async function main() {
  const args = process.argv.slice(2)
  const escolhidos = args.filter((arg) => !arg.startsWith("--"))
  const fila = escolhidos.length ? IMAGENS.filter((imagem) => escolhidos.includes(imagem.id)) : IMAGENS.filter((imagem) => !existsSync(path.join(SAIDA, imagem.destino)))

  if (args.includes("--lista")) {
    for (const imagem of fila) console.log(`${imagem.id.padEnd(20)} ${imagem.modelo.padEnd(12)} ${imagem.proporcao.padEnd(5)} ${imagem.destino}`)
    console.log(`\n${fila.length} imagens`)
    return
  }
  const chave = await lerChave()
  if (!chave) throw new Error("Falta FAL_KEY no .env.local")

  // Referências primeiro (as outras dependem delas); depois, três por vez.
  const primeiro = fila.filter((imagem) => imagem.destino.startsWith("ref/"))
  const resto = fila.filter((imagem) => !imagem.destino.startsWith("ref/"))
  const registro = []
  const rodar = async (imagem) => {
    try {
      const { segundos, largura, altura } = await gerar(imagem, chave)
      console.log(`ok    ${imagem.id} (${largura}×${altura}, ${segundos}s)`)
      registro.push({ id: imagem.id, destino: imagem.destino, modelo: MODELOS[imagem.modelo], proporcao: imagem.proporcao, refs: imagem.refs ?? [], prompt: imagem.prompt })
    } catch (falha) {
      console.log(`ERRO  ${imagem.id}: ${falha.message}`)
    }
  }
  for (const imagem of primeiro) await rodar(imagem)
  for (let indice = 0; indice < resto.length; indice += 3) await Promise.all(resto.slice(indice, indice + 3).map(rodar))

  // Guarda o pedido de cada imagem gerada, para consulta (e para refazer igual).
  const caminho = path.join(SAIDA, "prompts.json")
  const anterior = existsSync(caminho) ? JSON.parse(await readFile(caminho, "utf8")) : {}
  for (const item of registro) anterior[item.id] = item
  await writeFile(caminho, JSON.stringify(anterior, null, 2))
  console.log(`\n${registro.length} de ${fila.length} geradas`)
}

main().catch((falha) => {
  console.error(falha.message)
  process.exit(1)
})
