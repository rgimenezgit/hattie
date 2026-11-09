"use client"

import { useCallback, useSyncExternalStore } from "react"

export function useMidia(consulta: string, valorServidor = true) {
  const assinar = useCallback(
    (callback: () => void) => {
      const lista = window.matchMedia(consulta)
      lista.addEventListener("change", callback)
      return () => lista.removeEventListener("change", callback)
    },
    [consulta],
  )
  return useSyncExternalStore(
    assinar,
    () => window.matchMedia(consulta).matches,
    () => valorServidor,
  )
}
