'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { patients, formatSoles } from '@/lib/data'

const METODOS: Record<string, string> = {
  efectivo: 'Efectivo',
  tarjeta: 'Tarjeta',
  yape: 'Yape',
  plin: 'Plin',
}

export function RegisterPaymentDialog() {
  const [open, setOpen] = useState(false)
  const [patientId, setPatientId] = useState<string>('P-001')
  const [metodo, setMetodo] = useState('efectivo')

  const selected = patients.find((p) => p.id === patientId)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        Registrar abono
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar abono</DialogTitle>
          <DialogDescription>
            El abono se vincula al presupuesto activo del paciente y el saldo deudor se
            recalcula automáticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="paciente">Paciente</FieldLabel>
              <Select value={patientId} onValueChange={(v) => setPatientId(v as string)}>
                <SelectTrigger id="paciente" className="w-full">
                  <SelectValue>
                    {selected ? `${selected.nombres} ${selected.apellidos} — DNI ${selected.dni}` : 'Seleccionar paciente'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombres} {p.apellidos} — DNI {p.dni}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {selected && selected.saldoDeudor > 0 ? (
                <FieldDescription>
                  Saldo deudor actual:{' '}
                  <span className="font-medium text-destructive">
                    {formatSoles(selected.saldoDeudor)}
                  </span>
                </FieldDescription>
              ) : (
                <FieldDescription>Este paciente no registra deuda pendiente.</FieldDescription>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="monto">Monto (S/)</FieldLabel>
                <Input id="monto" type="number" min="0" step="0.10" placeholder="0.00" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="fecha">Fecha</FieldLabel>
                <Input id="fecha" type="date" defaultValue="2026-07-17" required />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="metodo">Método de pago</FieldLabel>
              <Select value={metodo} onValueChange={(v) => v && setMetodo(String(v))}>
                <SelectTrigger id="metodo" className="w-full">
                  <SelectValue>{METODOS[metodo]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta</SelectItem>
                    <SelectItem value="yape">Yape</SelectItem>
                    <SelectItem value="plin">Plin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="concepto">Concepto</FieldLabel>
              <Input id="concepto" placeholder="Ej. Abono endodoncia — sesión 2" required />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
            <Button type="submit">Guardar abono</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
