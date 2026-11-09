"use client"

import Link from "next/link"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Botao } from "@/components/hattie/Botao"
import { Campo } from "@/components/hattie/Campo"
import { notificar } from "@/components/hattie/Notificacao"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Erros = Partial<Record<"nome" | "email" | "senha", string>>

function Divisor() {
  return (
    <div className="flex items-center gap-3 text-sm text-ink-soft" aria-hidden>
      <span className="h-px flex-1 bg-cinza" />
      ou com e-mail
      <span className="h-px flex-1 bg-cinza" />
    </div>
  )
}

export function FormEntrada({ modo }: { modo: "criar" | "entrar" }) {
  const router = useRouter()
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)
  const nome = useRef<HTMLInputElement>(null)
  const email = useRef<HTMLInputElement>(null)
  const senha = useRef<HTMLInputElement>(null)
  const criar = modo === "criar"

  function validar(): Erros {
    const novos: Erros = {}
    if (criar && !nome.current?.value.trim()) novos.nome = "Me conta como você se chama."
    if (!EMAIL.test(email.current?.value.trim() ?? "")) novos.email = "Confere o e-mail: falta o @ ou o domínio."
    if ((senha.current?.value.length ?? 0) < 8) novos.senha = "A senha precisa de pelo menos 8 caracteres."
    return novos
  }

  function enviar() {
    if (enviando) return
    const novos = validar()
    setErros(novos)
    const primeiro = (["nome", "email", "senha"] as const).find((campo) => novos[campo])
    if (primeiro) {
      ;({ nome, email, senha })[primeiro].current?.focus()
      return
    }
    setEnviando(true)
    router.push(criar ? "/comecar" : "/marca/raiz-natural")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-[32px] leading-[1.05] font-medium tracking-[-0.015em] lowercase">
          {criar ? "criar conta" : "que bom te ver"}
        </h1>
        <p className="text-ink-soft">
          {criar ? "Em poucos minutos a sua marca sai do chapéu." : "Entra para continuar de onde parou."}
        </p>
      </div>

      <Botao variante="secundario" className="w-full" onClick={() => router.push(criar ? "/comecar" : "/marca/raiz-natural")}>
        Continuar com Google
      </Botao>

      <Divisor />

      <form
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(evento) => {
          evento.preventDefault()
          enviar()
        }}
      >
        {criar && <Campo ref={nome} rotulo="Nome" autoComplete="given-name" placeholder="Seu nome" erro={erros.nome} />}
        <Campo ref={email} rotulo="E-mail" type="email" autoComplete="email" placeholder="voce@suamarca.com.br" erro={erros.email} />
        <Campo
          ref={senha}
          rotulo="Senha"
          type="password"
          autoComplete={criar ? "new-password" : "current-password"}
          dica={criar ? "Pelo menos 8 caracteres." : undefined}
          erro={erros.senha}
        />
        {!criar && (
          <button
            type="button"
            onClick={() => notificar({ titulo: "recuperar senha", texto: "Recuperar a senha por e-mail chega na próxima etapa do Hattie." })}
            className="-mt-2 self-start text-sm font-medium underline underline-offset-4"
          >
            Esqueci minha senha
          </button>
        )}
        <Botao variante="primario" type="submit" className="mt-2 w-full" aria-disabled={enviando || undefined}>
          {criar ? "Criar conta" : "Entrar"}
        </Botao>
      </form>

      {criar && (
        <p className="text-sm text-ink-soft">
          Ao criar a conta, você concorda com os Termos de uso e a Política de privacidade do Hattie.
        </p>
      )}

      <p className="text-center text-base">
        {criar ? "Já tem conta? " : "Ainda não tem conta? "}
        <Link href={criar ? "/entrar" : "/criar-conta"} className="font-semibold underline underline-offset-4">
          {criar ? "Entrar" : "Criar conta"}
        </Link>
      </p>
    </div>
  )
}
