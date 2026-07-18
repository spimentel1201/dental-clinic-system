'use client'

import { Budget, formatSoles } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

interface BudgetDetailsCardProps {
  budget: Budget
}

export function BudgetDetailsCard({ budget }: BudgetDetailsCardProps) {
  const percentagePaid = Math.round((budget.totalPagado / budget.presupuestoTotal) * 100)
  const pendingAmount = budget.presupuestoTotal - budget.totalPagado

  const metodoPagoLabel = {
    'efectivo': 'Efectivo',
    'yape-plin': 'Yape/Plin',
    'otros': 'Otros',
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground">Presupuesto Total</div>
              <div className="mt-1 text-2xl font-semibold">{formatSoles(budget.presupuestoTotal)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Pagado</div>
              <div className="mt-1 text-2xl font-semibold text-emerald-600">{formatSoles(budget.totalPagado)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Pendiente</div>
              <div className="mt-1 text-2xl font-semibold text-amber-600">{formatSoles(pendingAmount)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso de pago</span>
              <span className="font-medium">{percentagePaid}%</span>
            </div>
            <Progress value={percentagePaid} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Sesiones y tratamientos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sesiones de Tratamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {budget.sesiones.map((sesion) => (
              <div key={sesion.id} className="rounded-lg border p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">Sesión {sesion.numero}</h4>
                    <p className="text-sm text-muted-foreground">
                      Piezas: {sesion.piezas.length > 0 ? sesion.piezas.join(', ') : 'Complementaria'}
                    </p>
                  </div>
                  <Badge variant={sesion.estado === 'completado' ? 'default' : 'outline'}>
                    {sesion.estado === 'completado' ? 'Completada' : 'Pendiente'}
                  </Badge>
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Costo de sesión:</span>
                    <span className="font-medium">{formatSoles(sesion.costo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pagado:</span>
                    <span className="font-medium">{formatSoles(sesion.totalPagado)}</span>
                  </div>
                </div>

                {sesion.pagos.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                      <p className="font-medium">Historial de pagos:</p>
                      {sesion.pagos.map((pago) => (
                        <div key={pago.id} className="flex items-center justify-between rounded bg-muted/50 px-2 py-1">
                          <span className="text-xs">
                            {formatDate(pago.fecha)} · {metodoPagoLabel[pago.metodoPago]}
                          </span>
                          <span className="font-medium">{formatSoles(pago.monto)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial de pagos general */}
      {budget.pagos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Historial de Pagos</CardTitle>
            <CardDescription>Todos los pagos registrados para este presupuesto</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Sesión</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budget.pagos.map((pago) => {
                  const sesion = budget.sesiones.find((s) => s.id === pago.sesionId)
                  return (
                    <TableRow key={pago.id}>
                      <TableCell className="text-sm">{formatDate(pago.fecha)}</TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline">{metodoPagoLabel[pago.metodoPago]}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {sesion ? `Sesión ${sesion.numero}` : 'General'}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatSoles(pago.monto)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
