import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 bg-background px-6 py-24 text-foreground">
      <p className="label text-muted-foreground">plataforma hattie · design system</p>
      <h1 className="headline-xs text-center text-foreground sm:headline-m">
        gabinete, lima e o plimm funcionando
      </h1>
      <p className="body max-w-md text-center text-muted-foreground">
        Tokens de <code>marca/04-visual/design-system</code> conectados ao Tailwind e ao shadcn/ui. Troque{" "}
        <code>data-theme</code> em <code>layout.tsx</code> para ver palco, intenso e noturno.
      </p>
      <Button size="lg" className="rounded-full">
        criar
      </Button>
    </div>
  );
}
