import type { ReactNode } from "react"

export function Destaque({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded-[4px] bg-lima px-1.5 text-preto [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </mark>
  )
}
