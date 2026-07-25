'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
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
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface ClinicalNoteFormProps {
  onSave?: (note: ClinicalNoteData) => void
}

export interface ClinicalNoteData {
  fecha: string
  diagnosis: string
  findings: string
  treatmentDone: string
  sessionNumber?: number
}

export function AddClinicalNoteDialog({ onSave }: ClinicalNoteFormProps) {
  const [open, setOpen] = useState(false)
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [diagnosis, setDiagnosis] = useState('')
  const [findings, setFindings] = useState('')
  const [treatmentDone, setTreatmentDone] = useState('')
  const [sessionNumber, setSessionNumber] = useState<number | undefined>()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!diagnosis.trim() || !findings.trim() || !treatmentDone.trim()) {
      alert('Por favor completa todos los campos')
      return
    }

    const noteData: ClinicalNoteData = {
      fecha,
      diagnosis,
      findings,
      treatmentDone,
      sessionNumber,
    }

    onSave?.(noteData)

    // Reset form
    setFecha(new Date().toISOString().split('T')[0])
    setDiagnosis('')
    setFindings('')
    setTreatmentDone('')
    setSessionNumber(undefined)
    setOpen(false)

    console.log('[v0] Clinical note saved:', noteData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <Plus data-icon="inline-start" />
        Nueva nota
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nota clínica</DialogTitle>
          <DialogDescription>
            Registra el diagnóstico y tratamientos realizados en esta sesión
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel htmlFor="fecha">Fecha de la sesión</FieldLabel>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="session">Número de sesión (opcional)</FieldLabel>
              <Input
                id="session"
                type="number"
                min="1"
                value={sessionNumber ?? ''}
                onChange={(e) => setSessionNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Ej. 1, 2, 3..."
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
              <Textarea
                id="diagnosis"
                placeholder="Describe el diagnóstico realizado"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="min-h-24"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="findings">Hallazgos clínicos</FieldLabel>
              <Textarea
                id="findings"
                placeholder="Describe los hallazgos encontrados durante el examen"
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                className="min-h-24"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="treatment">Tratamiento realizado</FieldLabel>
              <Textarea
                id="treatment"
                placeholder="Describe el tratamiento ejecutado en esta sesión"
                value={treatmentDone}
                onChange={(e) => setTreatmentDone(e.target.value)}
                className="min-h-24"
                required
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit">Guardar nota</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
