import { AppShell } from "@/components/app/AppShell"

export default function LayoutDoApp({ children }: LayoutProps<"/marca/[marca]">) {
  return <AppShell>{children}</AppShell>
}
