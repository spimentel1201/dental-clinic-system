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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  const [appointmentDate, setAppointmentDate] = useState<string>('')

  const handleSave = () => {
    if (!selectedSpecialty) {
      alert('Por favor selecciona una especialidad')
      return
    }
    if (!appointmentDate) {
      alert('Por favor ingresa la fecha de cita')
      return
    }

    // Generate random ID to avoid hydration mismatch
    const randomId = typeof window !== 'undefined' 
      ? crypto.getRandomValues(new Uint8Array(4)).join('-')
      : 'tmp'
    
    const consultationData = {
      id: `SH-${randomId}`,
      pacienteId,
      specialty: selectedSpecialty,
      appointmentDate,
      status: 'pendiente',
    }

    onSave?.(consultationData)
    console.log('[v0] Specialist consultation scheduled:', consultationData)

    // Reset form
    setSelectedSpecialty('')
    setAppointmentDate('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium whitespace-nowrap transition-all h-7 gap-1 px-2.5">
        <Plus className="size-3.5" />
        Consulta Externa
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Consulta Externa</DialogTitle>
          <DialogDescription>
            Selecciona la especialidad y la fecha de la cita
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

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="appointmentDate">Fecha de Cita *</FieldLabel>
              <Input
                id="appointmentDate"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
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
