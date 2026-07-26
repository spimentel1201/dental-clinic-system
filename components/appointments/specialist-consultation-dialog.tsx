'use client'

import { useState } from 'react'
import { Appointment } from '@/lib/data'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SpecialistConsultationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onSave?: (consultation: SpecialistConsultation) => void
}

export interface SpecialistConsultation {
  appointmentId: string
  pacienteId: string
  diagnostico: string
  notasClinicas: string
  fechaProximaCita: string
  presupuestoTotal: number
  numeroSesiones: number
  sesiones: SessionDetails[]
}

interface SessionDetails {
  numero: number
  monto: number
  estado: 'pendiente' | 'completada'
}

export function SpecialistConsultationDialog({
  open,
  onOpenChange,
  appointment,
  onSave,
}: SpecialistConsultationDialogProps) {
  const [loading, setLoading] = useState(false)
  const [diagnostico, setDiagnostico] = useState('')
  const [notasClinicas, setNotasClinicas] = useState('')
  const [fechaProximaCita, setFechaProximaCita] = useState('')
  const [presupuestoTotal, setPresupuestoTotal] = useState('')
  const [numeroSesiones, setNumeroSesiones] = useState('')
  const [showSessions, setShowSessions] = useState(false)

  const costPerSession = presupuestoTotal && numeroSesiones 
    ? (parseFloat(presupuestoTotal) / parseInt(numeroSesiones)).toFixed(2)
    : 0

  const sessions: SessionDetails[] = numeroSesiones
    ? Array.from({ length: parseInt(numeroSesiones) }, (_, i) => ({
        numero: i + 1,
        monto: parseFloat(costPerSession as string),
        estado: 'pendiente' as const,
      }))
    : []

  const handleSave = async () => {
    if (!appointment || !diagnostico || !notasClinicas || !fechaProximaCita || !presupuestoTotal || !numeroSesiones) {
      return
    }

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const consultation: SpecialistConsultation = {
        appointmentId: appointment.id,
        pacienteId: appointment.pacienteId,
        diagnostico,
        notasClinicas,
        fechaProximaCita,
        presupuestoTotal: parseFloat(presupuestoTotal),
        numeroSesiones: parseInt(numeroSesiones),
        sesiones: sessions,
      }

      onSave?.(consultation)
      
      // Reset form
      setDiagnostico('')
      setNotasClinicas('')
      setFechaProximaCita('')
      setPresupuestoTotal('')
      setNumeroSesiones('')
      setShowSessions(false)
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  if (!appointment) return null

  const isComplete = diagnostico && notasClinicas && fechaProximaCita && presupuestoTotal && numeroSesiones

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Consulta Externa</DialogTitle>
          <DialogDescription>
            Registra los datos clínicos de la consulta realizada al paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Patient and Appointment Info */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información de la Cita</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paciente</p>
                  <p className="text-base font-semibold">{appointment.paciente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha y Hora</p>
                  <p className="text-base font-semibold">
                    {appointment.fecha} {appointment.hora}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tratamiento</p>
                  <p className="text-base font-semibold">{appointment.tratamiento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <Badge variant="outline" className="mt-1">
                    {appointment.estado}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Information */}
          <div>
            <h3 className="text-base font-semibold mb-4">Información Clínica</h3>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel htmlFor="diagnostico">Diagnóstico</FieldLabel>
                <Textarea
                  id="diagnostico"
                  placeholder="Ingresa el diagnóstico de la consulta realizada..."
                  value={diagnostico}
                  onChange={(e) => setDiagnostico(e.target.value)}
                  disabled={loading}
                  className="min-h-24"
                />
                <FieldDescription>
                  Describe detalladamente el diagnóstico y hallazgos encontrados
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="notas">Notas Clínicas</FieldLabel>
                <Textarea
                  id="notas"
                  placeholder="Observaciones y recomendaciones clínicas..."
                  value={notasClinicas}
                  onChange={(e) => setNotasClinicas(e.target.value)}
                  disabled={loading}
                  className="min-h-20"
                />
                <FieldDescription>
                  Notas adicionales, alergias, consideraciones especiales, etc.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>

          {/* Budget and Scheduling */}
          <div>
            <h3 className="text-base font-semibold mb-4">Planificación y Presupuesto</h3>
            <FieldGroup className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="fecha">Fecha de Próxima Cita</FieldLabel>
                  <Input
                    id="fecha"
                    type="date"
                    value={fechaProximaCita}
                    onChange={(e) => setFechaProximaCita(e.target.value)}
                    disabled={loading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="presupuesto">Presupuesto Total (S/.)</FieldLabel>
                  <Input
                    id="presupuesto"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    value={presupuestoTotal}
                    onChange={(e) => setPresupuestoTotal(e.target.value)}
                    disabled={loading}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="sesiones">Número de Sesiones</FieldLabel>
                <Input
                  id="sesiones"
                  type="number"
                  placeholder="1"
                  min="1"
                  max="20"
                  value={numeroSesiones}
                  onChange={(e) => setNumeroSesiones(e.target.value)}
                  disabled={loading}
                />
              </Field>

              {/* Cost Calculation */}
              {presupuestoTotal && numeroSesiones && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Costo por sesión</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          S/. {costPerSession}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {numeroSesiones} sesiones × S/. {costPerSession} = S/. {presupuestoTotal}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Breakdown Button */}
              {presupuestoTotal && numeroSesiones && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSessions(!showSessions)}
                  className="w-full"
                >
                  {showSessions ? 'Ocultar' : 'Ver'} Desglose de Sesiones
                </Button>
              )}

              {/* Session Breakdown Table */}
              {showSessions && sessions.length > 0 && (
                <div className="rounded-lg border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-2 text-left font-semibold">Sesión</th>
                          <th className="px-4 py-2 text-right font-semibold">Monto (S/.)</th>
                          <th className="px-4 py-2 text-center font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessions.map((session) => (
                          <tr key={session.numero} className="border-b last:border-0">
                            <td className="px-4 py-3">Sesión {session.numero}</td>
                            <td className="px-4 py-3 text-right font-semibold">
                              S/. {session.monto.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="secondary" className="capitalize">
                                {session.estado}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </FieldGroup>
          </div>

          {/* Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta información será registrada en la historia clínica del paciente y visible para todo el equipo médico.
            </AlertDescription>
          </Alert>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isComplete || loading}
          >
            {loading ? <Spinner data-icon="inline-start" /> : null}
            {loading ? 'Registrando...' : 'Registrar Consulta'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
