'use client'

import { useState } from 'react'
import { Appointment, budgets } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { AlertCircle, Check } from 'lucide-react'

interface AppointmentDetailsDialogProps {
  appointment: Appointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (appointment: Appointment) => void
}

const stateOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'atendida', label: 'Atendida' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'no-presentó', label: 'No Presentó' },
]

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
  onSave,
}: AppointmentDetailsDialogProps) {
  const [formData, setFormData] = useState<Partial<Appointment>>(
    appointment || {
      id: '',
      pacienteId: '',
      paciente: '',
      celular: '',
      fecha: '',
      hora: '',
      duracionMin: 0,
      tratamiento: '',
      doctor: '',
      estado: 'pendiente',
      diagnosis: '',
      notas: [],
      presupuestoId: '',
    }
  )

  const relatedBudget = formData.presupuestoId ? budgets.find((b) => b.id === formData.presupuestoId) : null

  const handleSave = () => {
    if (appointment) {
      const updated = { ...appointment, ...formData } as Appointment
      onSave?.(updated)
      onOpenChange(false)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de la Cita</DialogTitle>
          <DialogDescription>
            {appointment.paciente} · {new Date(appointment.fecha).toLocaleDateString('es-PE')} a las {appointment.hora}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="mb-3 font-semibold">Información de la Cita</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Paciente</p>
                <p className="font-medium">{appointment.paciente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-medium">{appointment.doctor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tratamiento</p>
                <p className="font-medium">{appointment.tratamiento}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duración</p>
                <p className="font-medium">{appointment.duracionMin} minutos</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estado */}
          <Field>
            <FieldLabel>Estado de la Cita</FieldLabel>
            <FieldDescription>
              {formData.estado === 'pendiente' && 'La cita está esperando confirmación'}
              {formData.estado === 'confirmada' && 'La cita ha sido confirmada'}
              {formData.estado === 'atendida' && 'La cita ha sido completada'}
              {formData.estado === 'cancelada' && 'La cita ha sido cancelada'}
              {formData.estado === 'no-presentó' && 'El paciente no asistió'}
            </FieldDescription>
            <Select
              value={formData.estado}
              onValueChange={(value) =>
                setFormData({ ...formData, estado: value as Appointment['estado'] })
              }
            >
              <SelectTrigger>
                <SelectValue>{stateOptions.find((o) => o.value === formData.estado)?.label}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Diagnosis */}
          <Field>
            <FieldLabel>Diagnosis</FieldLabel>
            <FieldDescription>Hallazgos y observaciones clínicas</FieldDescription>
            <Textarea
              placeholder="Ej: Caries en pieza 1.6, gingivitis leve..."
              value={formData.diagnosis || ''}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              className="min-h-20"
            />
          </Field>

          {/* Notas clínicas */}
          <Field>
            <FieldLabel>Notas Clínicas</FieldLabel>
            <FieldDescription>Procedimientos realizados y observaciones adicionales</FieldDescription>
            <Textarea
              placeholder="Ej: Se realizó profilaxis. Paciente tolera bien. Próxima sesión en 15 días..."
              value={
                formData.notas && formData.notas.length > 0
                  ? formData.notas[formData.notas.length - 1]?.notas || ''
                  : ''
              }
              onChange={(e) => {
                const lastNote = formData.notas?.[formData.notas.length - 1]
                if (lastNote) {
                  lastNote.notas = e.target.value
                }
              }}
              className="min-h-24"
            />
          </Field>

          {/* Presupuesto relacionado */}
          <Field>
            <FieldLabel>Presupuesto Relacionado</FieldLabel>
            <FieldDescription>Vincular a un presupuesto de tratamiento (opcional)</FieldDescription>
            <Select
              value={formData.presupuestoId || ''}
              onValueChange={(value) => setFormData({ ...formData, presupuestoId: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue>
                  {relatedBudget ? `${relatedBudget.id} - ${relatedBudget.paciente}` : 'Sin presupuesto'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin presupuesto</SelectItem>
                {budgets
                  .filter((b) => b.pacienteId === appointment.pacienteId)
                  .map((budget) => (
                    <SelectItem key={budget.id} value={budget.id}>
                      {budget.id} - {budget.paciente}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </Field>

          {relatedBudget && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex gap-2">
                <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Presupuesto vinculado</p>
                  <p className="text-amber-800">
                    S/ {relatedBudget.totalPagado.toLocaleString('es-PE')} pagado de S/ {relatedBudget.presupuestoTotal.toLocaleString('es-PE')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Historial de cambios */}
          {appointment.notas && appointment.notas.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 font-semibold">Historial de Notas</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cambio</TableHead>
                      <TableHead>Notas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointment.notas.map((note) => (
                      <TableRow key={note.id}>
                        <TableCell className="text-sm">{formatDate(note.fecha)}</TableCell>
                        <TableCell className="text-sm">
                          {note.diagnosis && <Badge variant="outline">Diagnosis</Badge>}
                        </TableCell>
                        <TableCell className="text-sm max-w-xs truncate">{note.notas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Check data-icon="inline-start" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
