'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PatientSearchBar } from '@/components/patients/patient-search-bar'
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
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { patients } from '@/lib/data'

const DURACIONES: Record<string, string> = {
  '30': '30 minutos',
  '45': '45 minutos',
  '60': '1 hora',
  '90': '1 hora 30 min',
}

const DOCTORES: Record<string, string> = {
  salas: 'Dra. Salas',
  rivera: 'Dr. Rivera',
}

export function NewAppointmentDialog() {
  const [open, setOpen] = useState(false)
  const [pacienteId, setPacienteId] = useState('P-001')
  const [duracion, setDuracion] = useState('30')
  const [doctor, setDoctor] = useState('salas')

  const paciente = patients.find((p) => p.id === pacienteId) ?? patients[0]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        Nueva cita
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar nueva cita</DialogTitle>
          <DialogDescription>
            El calendario bloquea automáticamente los horarios ya reservados para evitar
            cruces.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cita-paciente">Paciente</FieldLabel>
              <PatientSearchBar
                patients={patients}
                value={pacienteId}
                onSelect={setPacienteId}
                placeholder="Buscar paciente"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="cita-fecha">Fecha</FieldLabel>
                <Input id="cita-fecha" type="date" defaultValue="2026-07-18" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="cita-hora">Hora</FieldLabel>
                <Input id="cita-hora" type="time" defaultValue="09:00" required />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="cita-duracion">Duración</FieldLabel>
                <Select value={duracion} onValueChange={(v) => v && setDuracion(String(v))}>
                  <SelectTrigger id="cita-duracion" className="w-full">
                    <SelectValue>{DURACIONES[duracion]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1 hora 30 min</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="cita-doctor">Doctor</FieldLabel>
                <Select value={doctor} onValueChange={(v) => v && setDoctor(String(v))}>
                  <SelectTrigger id="cita-doctor" className="w-full">
                    <SelectValue>{DOCTORES[doctor]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="salas">Dra. Salas</SelectItem>
                      <SelectItem value="rivera">Dr. Rivera</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="cita-motivo">Motivo / tratamiento</FieldLabel>
              <Input id="cita-motivo" placeholder="Ej. Control de ortodoncia" required />
              <FieldDescription>
                Este texto se muestra en el calendario y en el recordatorio por WhatsApp.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit">Agendar cita</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
