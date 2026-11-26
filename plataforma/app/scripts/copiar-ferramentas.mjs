// Copia as ferramentas da marca (fonte da verdade em marca/) para public/ferramentas.
// Roda antes do dev e do build. A cópia fica fora do git.
import { cpSync, mkdirSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const app = join(dirname(fileURLToPath(import.meta.url)), "..")
const visual = join(app, "../../marca/04-visual")
const destino = join(app, "public/ferramentas")

rmSync(destino, { recursive: true, force: true })
mkdirSync(join(destino, "fontes"), { recursive: true })
cpSync(join(visual, "design-system/components/Gerador/index.html"), join(destino, "gerador/index.html"))
for (const f of ["ClashDisplay-Variable", "Poppins-Regular", "Poppins-Medium", "Poppins-SemiBold"]) {
  cpSync(join(visual, `${f}.ttf`), join(destino, "fontes", `${f}.ttf`))
}
console.log("ferramentas copiadas para public/ferramentas")
