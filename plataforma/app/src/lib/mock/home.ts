import type { Categoria, Modelo, Projeto } from "./tipos"

export const PROJETOS: Projeto[] = [
  { id: "pequi", nome: "Lançamento do óleo de pequi", editado: "editado há 2 minutos" },
  { id: "black-friday", nome: "Black Friday consciente", editado: "editado há 1 hora" },
  { id: "catalogo", nome: "Catálogo para lojistas", editado: "editado ontem" },
  { id: "novembro", nome: "Posts de novembro", editado: "editado há 3 dias" },
]

export const CATEGORIAS: Categoria[] = [
  { id: "imagem", rotulo: "Imagem", icone: "imagem" },
  { id: "video", rotulo: "Vídeo", icone: "video", emBreve: true },
  { id: "posts", rotulo: "Posts", icone: "posts" },
  { id: "apresentacao", rotulo: "Apresentação", icone: "apresentacao" },
  { id: "pesquisa", rotulo: "Pesquisa", icone: "pesquisa" },
  { id: "personas", rotulo: "Personas", icone: "personas" },
  { id: "ferramentas", rotulo: "Atalhos", icone: "ferramentas" },
  { id: "site", rotulo: "Site", icone: "site", emBreve: true },
]

export const MODELOS: Modelo[] = [
  { id: "foto-produto", categoria: "imagem", titulo: "Fotografia de produto", descricao: "Transforme a foto do celular numa foto de estúdio.", pedido: "Quero uma fotografia de produto do óleo de pequi, no estilo da marca." },
  { id: "produto-cena", categoria: "imagem", titulo: "Produto em cena", descricao: "Seu produto num ambiente com a cara da marca.", pedido: "Coloca o hidratante numa bancada com ingredientes do cerrado." },
  { id: "kit-presente", categoria: "imagem", titulo: "Kit de presente", descricao: "Composição pronta para datas especiais.", pedido: "Monta uma imagem do kit de presente para o Natal." },
  { id: "fundo-infinito", categoria: "imagem", titulo: "Fundo de uma cor", descricao: "Produto recortado sobre a cor da marca.", pedido: "Produto recortado sobre o fundo creme da marca." },
  { id: "reels", categoria: "video", titulo: "Reels de produto", descricao: "Um vídeo curto mostrando a textura.", pedido: "Reels de 15 segundos mostrando a textura do óleo." },
  { id: "bastidores", categoria: "video", titulo: "Bastidores", descricao: "O lote sendo feito, do começo ao fim.", pedido: "Vídeo dos bastidores do lote 12." },
  { id: "carrossel", categoria: "posts", titulo: "Carrossel educativo", descricao: "Ensine algo em até dez telas.", pedido: "Carrossel explicando os benefícios do óleo de pequi." },
  { id: "lancamento", categoria: "posts", titulo: "Post de lançamento", descricao: "Anuncie um produto novo com a voz da marca.", pedido: "Post de lançamento do novo hidratante de baru." },
  { id: "story-oferta", categoria: "posts", titulo: "Story de oferta", descricao: "Oferta direta, com prazo claro.", pedido: "Story com 10% de desconto no kit até sexta." },
  { id: "depoimento", categoria: "posts", titulo: "Depoimento de cliente", descricao: "Transforme uma avaliação num post.", pedido: "Post com o depoimento da Carla sobre o hidratante." },
  { id: "lojista", categoria: "apresentacao", titulo: "Apresentação para lojista", descricao: "Leve a marca para uma loja parceira.", pedido: "Apresentação da Raiz Natural para a loja da Rua Amapá." },
  { id: "catalogo", categoria: "apresentacao", titulo: "Catálogo de produtos", descricao: "Todos os produtos, com preço e lote.", pedido: "Catálogo com os seis produtos da linha." },
  { id: "concorrentes", categoria: "pesquisa", titulo: "Concorrentes da região", descricao: "Quem vende o que, e por quanto.", pedido: "Pesquisa dos concorrentes de cosméticos naturais em Ribeirão Preto." },
  { id: "tendencias", categoria: "pesquisa", titulo: "Tendências do mercado", descricao: "O que está crescendo no seu segmento.", pedido: "Tendências de cosméticos naturais para 2027." },
  { id: "conversar-persona", categoria: "personas", titulo: "Conversar com a Carla", descricao: "Teste uma ideia com a sua persona.", pedido: "Quero testar o novo slogan com a Carla." },
  { id: "pesquisa-sintetica", categoria: "personas", titulo: "Pesquisa com personas", descricao: "Pergunte a dez clientes simuladas.", pedido: "Pesquisa com dez personas sobre o preço do kit." },
  { id: "legenda", categoria: "ferramentas", titulo: "Legenda para Instagram", descricao: "Legendas no tom da marca.", pedido: "Três legendas para o post do óleo de pequi." },
  { id: "preco", categoria: "ferramentas", titulo: "Calculadora de preço", descricao: "Preço de venda a partir do custo.", pedido: "Me ajuda a precificar o kit de presente." },
  { id: "landing", categoria: "site", titulo: "Página de lançamento", descricao: "Uma página simples para o produto novo.", pedido: "Página de lançamento do hidratante de baru." },
  { id: "bio", categoria: "site", titulo: "Link na bio", descricao: "Todos os seus links num lugar só.", pedido: "Página de links para a bio do Instagram." },
]
