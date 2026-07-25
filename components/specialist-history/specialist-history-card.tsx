'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { SpecialistClinicalHistory } from '@/lib/data'
import { formatSoles } from '@/lib/data'

interface SpecialistHistoryCardProps {
  history: SpecialistClinicalHistory
  specialistName: string
}

export function SpecialistHistoryCard({ history, specialistName }: SpecialistHistoryCardProps) {
  const completedSessions = history.sesiones.filter((s) => s.estado === 'pagado').length
  const totalSessions = history.sesiones.length

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{specialistName}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{completedSessions}/{totalSessions} sesiones</Badge>
              <Badge variant={completedSessions === totalSessions ? 'default' : 'secondary'}>
                {completedSessions === totalSessions ? 'Completado' : 'En progreso'}
              </Badge>
            </div>
          </div>
          <CardDescription>{history.fecha || 'Fecha no especificada'}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Descripción del tratamiento</div>
            <p className="text-sm leading-relaxed">{history.descripcion}</p>
          </div>

          {history.diagnostico && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Diagnóstico</div>
              <p className="text-sm leading-relaxed">{history.diagnostico}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <div className="text-sm text-muted-foreground">Presupuesto total</div>
              <div className="text-lg font-semibold">{formatSoles(history.presupuestoTotal)}</div>
            </div>
            {history.fechaProximaCita && (
              <div>
                <div className="text-sm text-muted-foreground">Próxima cita</div>
                <div className="text-sm font-semibold">{history.fechaProximaCita}</div>
              </div>
            )}
          </div>
        </div>

        {/* Sesiones */}
        {history.sesiones.length > 0 && (
          <div className="pt-4 border-t">
            <div className="text-sm font-medium mb-3">Sesiones y pagos</div>
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>Sesión</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha pago</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.sesiones.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">#{session.numero}</TableCell>
                    <TableCell className="text-right font-mono">{formatSoles(session.monto)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={session.estado === 'pagado' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {session.estado === 'pagado' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{session.fechaPago || '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            Editar
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Agregar sesión
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
