import { ShellParceiros } from "@/components/app/parceiros/ShellParceiros"

export default function LayoutParceiros({ children }: LayoutProps<"/marca/[marca]/parceiros">) {
  return <ShellParceiros>{children}</ShellParceiros>
}
