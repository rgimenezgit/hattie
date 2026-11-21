import { ShellMarketing } from "@/components/app/marketing/ShellMarketing"

export default function LayoutMarketing({ children }: LayoutProps<"/marca/[marca]/marketing">) {
  return <ShellMarketing>{children}</ShellMarketing>
}
