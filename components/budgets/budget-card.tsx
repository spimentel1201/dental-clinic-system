'use client'

import { Budget } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface BudgetCardProps {
  budget: Budget
  onClick?: () => void
}

export function BudgetCard({ budget, onClick }: BudgetCardProps) {
  const percentagePaid = Math.round((budget.totalPagado / budget.presupuestoTotal) * 100)
  
  const statusBadgeVariant = {
    borrador: 'outline',
    enviado: 'outline',
    aceptado: 'secondary',
    'en-proceso': 'default',
    completado: 'default',
  } as const

  const statusLabel = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aceptado: 'Aceptado',
    'en-proceso': 'En Proceso',
    completado: 'Completado',
  } as const

  return (
    <Card className="cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">{budget.paciente}</CardTitle>
            <CardDescription>ID: {budget.id}</CardDescription>
          </div>
          <Badge variant={statusBadgeVariant[budget.estado]}>
            {statusLabel[budget.estado]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-muted-foreground">Total</div>
            <div className="font-medium">S/ {budget.presupuestoTotal.toLocaleString('es-PE')}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Pagado</div>
            <div className="font-medium">S/ {budget.totalPagado.toLocaleString('es-PE')}</div>
          </div>
        </div>
        
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{percentagePaid}%</span>
          </div>
          <Progress value={percentagePaid} className="h-2" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {budget.sesiones.length} {budget.sesiones.length === 1 ? 'sesión' : 'sesiones'}
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
