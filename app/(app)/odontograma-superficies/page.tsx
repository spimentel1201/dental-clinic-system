import { AppHeader } from '@/components/app-header'
import { OdontogramSuperficies } from '@/components/odontogram/odontogram-superficies'

export const metadata = {
  title: 'Odontograma por Superficies — Clínica Dental',
}

export default function OdontogramSuperficiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        title="Odontograma por Superficies"
        subtitle="Documenta el estado detallado de cada superficie dental (oclusal, bucal, lingual, mesial, distal)"
      />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <OdontogramSuperficies />
      </main>
    </div>
  )
}
