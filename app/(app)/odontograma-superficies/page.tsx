import { OdontogramSuperficies } from '@/components/odontogram/odontogram-superficies'

export const metadata = {
  title: 'Odontograma por Superficies — Clínica Dental',
}

export default function OdontogramSuperficiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Odontograma por Superficies</h1>
          <p className="text-muted-foreground">
            Documenta el estado detallado de cada superficie dental
          </p>
        </div>
        <OdontogramSuperficies />
      </main>
    </div>
  )
}
