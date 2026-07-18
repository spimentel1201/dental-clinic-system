'use client'

import { budgets, patients } from '@/lib/data'
import { BudgetDetailsCard } from '@/components/budgets/budget-details-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, Edit } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'

export default function BudgetDetailPage() {
  const router = useRouter()
  const params = useParams()
  const budgetId = params.id as string

  const budget = budgets.find((b) => b.id === budgetId)
  const patient = budget ? patients.find((p) => p.id === budget.pacienteId) : null

  if (!budget || !patient) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6">
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-muted-foreground">Presupuesto no encontrado</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              <ArrowLeft data-icon="inline-start" />
              Volver
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft data-icon="inline-start" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{budget.paciente}</h1>
            <p className="text-muted-foreground">Presupuesto {budget.id} · Creado {new Date(budget.fecha).toLocaleDateString('es-PE')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download data-icon="inline-start" />
              Descargar PDF
            </Button>
            <Button>
              <Edit data-icon="inline-start" />
              Editar
            </Button>
          </div>
        </div>

        {/* Información del paciente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Nombre Completo</p>
                <p className="font-medium">{patient.nombres} {patient.apellidos}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">DNI</p>
                <p className="font-medium">{patient.dni}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Celular</p>
                <p className="font-medium">{patient.celular}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Edad</p>
                <p className="font-medium">{patient.edad} años</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del presupuesto */}
        <BudgetDetailsCard budget={budget} />
      </main>
    </div>
  )
}
