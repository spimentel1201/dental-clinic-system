'use client'

import { useState } from 'react'
import { budgets, patients } from '@/lib/data'
import { AppHeader } from '@/components/app-header'
import { BudgetCard } from '@/components/budgets/budget-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PresupuestosPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBudgets = budgets.filter((budget) =>
    budget.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBudgetClick = (budgetId: string) => {
    router.push(`/presupuestos/${budgetId}`)
  }

  const totalBudgets = budgets.length
  const totalAmount = budgets.reduce((sum, b) => sum + b.presupuestoTotal, 0)
  const totalCollected = budgets.reduce((sum, b) => sum + b.totalPagado, 0)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Presupuestos</h1>
            <p className="text-muted-foreground">Gestiona presupuestos de tratamientos dental</p>
          </div>
          <Button onClick={() => router.push('/presupuestos/nuevo')}>
            <Plus data-icon="inline-start" />
            Nuevo Presupuesto
          </Button>
        </div>

        {/* Resumen rápido */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBudgets}</div>
              <p className="text-xs text-muted-foreground">Total registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">S/ {totalAmount.toLocaleString('es-PE')}</div>
              <p className="text-xs text-muted-foreground">En presupuestos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recaudado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">S/ {totalCollected.toLocaleString('es-PE')}</div>
              <p className="text-xs text-muted-foreground">{Math.round((totalCollected / totalAmount) * 100)}% del total</p>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda y listado */}
        <Card>
          <CardHeader>
            <CardTitle>Presupuestos</CardTitle>
            <CardDescription>Listado de todos los presupuestos del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente o ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredBudgets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBudgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onClick={() => handleBudgetClick(budget.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed py-12 text-center">
                <p className="text-muted-foreground">No se encontraron presupuestos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
