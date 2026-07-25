'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { externalSpecialists } from '@/lib/data'

const specialties = [
  'Ortodoncista',
  'Periodoncista',
  'Endodoncista',
  'Cirujano Oral',
  'Prostodoncista',
  'Pediatra Dental',
  'Implantólogo',
  'Estético',
  'Otros',
]

interface SpecialistConsultationDialogProps {
  pacienteId: string
  onSave?: (consultation: any) => void
}

export function SpecialistConsultationDialog({
  pacienteId,
  onSave,
}: SpecialistConsultationDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('')
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('')
  const [description, setDescription] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [budget, setBudget] = useState<string>('')
  const [nextAppointment, setNextAppointment] = useState<string>('')
  const [sessions, setSessions] = useState<number>(1)

  const filteredSpecialists = selectedSpecialty
    ? externalSpecialists.filter((s) => s.especialidad === selectedSpecialty)
    : externalSpecialists

  const handleSave = () => {
    if (!selectedSpecialty) {
      alert('Por favor selecciona una especialidad')
      return
    }
    if (!description.trim()) {
      alert('Por favor ingresa una descripción del tratamiento')
      return
    }

    const consultationData = {
      id: `SH-${Date.now()}`,
      pacienteId,
      specialistId: selectedSpecialist || undefined,
      specialty: selectedSpecialty,
      fecha: new Date().toISOString().split('T')[0],
      descripcion: description,
      diagnostico: diagnosis,
      presupuestoTotal: parseFloat(budget) || 0,
      fechaProximaCita: nextAppointment,
      sesiones: Array.from({ length: sessions }, (_, i) => ({
        id: `SS-${Date.now()}-${i}`,
        numero: i + 1,
        monto: budget ? Math.round(parseFloat(budget) / sessions * 100) / 100 : 0,
        estado: 'pendiente',
      })),
    }

    onSave?.(consultationData)
    console.log('[v0] Specialist consultation saved:', consultationData)

    // Reset form
    setSelectedSpecialty('')
    setSelectedSpecialist('')
    setDescription('')
    setDiagnosis('')
    setBudget('')
    setNextAppointment('')
    setSessions(1)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus data-icon="inline-start" />
          Consulta Externa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registrar Consulta Especialista</DialogTitle>
          <DialogDescription>
            Crea un nuevo registro de consulta con un especialista externo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="specialty">Especialidad *</FieldLabel>
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger id="specialty" className="w-full">
                  <SelectValue placeholder="Seleccionar especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {specialties.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {selectedSpecialty && filteredSpecialists.length > 0 && (
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="specialist">Especialista (Opcional)</FieldLabel>
                <Select value={selectedSpecialist} onValueChange={setSelectedSpecialist}>
                  <SelectTrigger id="specialist" className="w-full">
                    <SelectValue placeholder="Seleccionar especialista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Sin asignar</SelectItem>
                      {filteredSpecialists.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id}>
                          Dra. {spec.nombres} {spec.apellidos}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">
                Descripción del Tratamiento *
              </FieldLabel>
              <Textarea
                id="description"
                placeholder="Detalle del tratamiento realizado o a realizarse..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-24"
              />
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
              <Textarea
                id="diagnosis"
                placeholder="Diagnóstico o hallazgos clínicos..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-20"
              />
            </Field>
          </FieldGroup>

          <FieldGroup className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="budget">Presupuesto Total (S/)</FieldLabel>
              <Input
                id="budget"
                type="number"
                min="0"
                step="50"
                placeholder="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sessions">Número de Sesiones</FieldLabel>
              <Input
                id="sessions"
                type="number"
                min="1"
                max="20"
                value={sessions}
                onChange={(e) => setSessions(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </Field>
          </FieldGroup>

          {budget && sessions > 0 && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                Monto por sesión:{' '}
                <Badge variant="secondary">
                  S/ {(parseFloat(budget) / sessions).toFixed(2)}
                </Badge>
              </p>
            </div>
          )}

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="nextAppointment">
                Fecha de Próxima Cita (Opcional)
              </FieldLabel>
              <Input
                id="nextAppointment"
                type="date"
                value={nextAppointment}
                onChange={(e) => setNextAppointment(e.target.value)}
              />
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave}>Guardar Consulta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
