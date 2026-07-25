import { OdontogramLeyenda } from '@/components/odontogram/odontogram-leyenda'

export const metadata = {
  title: 'Odontograma con Leyenda — Clínica Dental',
}

export default function OdontogramaLeyendaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Odontograma con Leyenda</h1>
          <p className="text-muted-foreground">
            Selecciona múltiples condiciones por pieza dental con observaciones y tratamientos
          </p>
        </div>
        <OdontogramLeyenda />
      </main>
    </div>
  )
}
