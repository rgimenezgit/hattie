import { MARCAS } from "./marcas"

export * from "./tipos"
export * from "./marcas"
export * from "./plano"
export * from "./cerebro"
export * from "./home"

export function getMarca(slug: string) {
  return MARCAS.find((marca) => marca.slug === slug)
}
export * from "./parceiros"
export * from "./biblioteca"
