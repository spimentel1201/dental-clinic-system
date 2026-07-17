import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 flex-col">
        <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>
        {subtitle ? (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Buscar paciente por DNI o nombre..."
            className="w-72 pl-8"
            aria-label="Buscar paciente"
          />
        </div>
        <Button variant="outline" size="icon" aria-label="Notificaciones" className="relative">
          <Bell aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </header>
  )
}
