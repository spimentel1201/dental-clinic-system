import { AppHeader } from '@/components/app-header'
import { OdontogramLeyenda } from '@/components/odontogram/odontogram-leyenda'

export const metadata = {
  title: 'Odontograma con Leyenda — Clínica Dental',
}

export default function OdontogramaLeyendaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader
        title="Odontograma con Leyenda"
        subtitle="Selecciona múltiples condiciones por pieza dental con observaciones y tratamientos"
      />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <OdontogramLeyenda />
      </main>
    </div>
  )
}
