'use client'

import { useState } from 'react'
import { Plus, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

const SEXOS: Record<string, string> = {
  femenino: 'Femenino',
  masculino: 'Masculino',
}

export function NewPatientDialog({
  size = 'sm',
  variant = 'outline',
  label = 'Nuevo',
}: {
  size?: 'sm' | 'default'
  variant?: 'outline' | 'default'
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sexo, setSexo] = useState('femenino')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size={size} variant={variant}>
            <Plus data-icon="inline-start" />
            {label}
          </Button>
        }
      />
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" aria-hidden="true" />
            Registrar nuevo paciente
          </DialogTitle>
          <DialogDescription>
            Complete los datos de filiación. Los campos de anamnesis podrán ampliarse en la
            historia clínica.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="np-nombres">Nombres</FieldLabel>
                <Input id="np-nombres" placeholder="María Elena" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="np-apellidos">Apellidos</FieldLabel>
                <Input id="np-apellidos" placeholder="Quispe Huamán" required />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="np-dni">DNI</FieldLabel>
                <Input
                  id="np-dni"
                  inputMode="numeric"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  placeholder="45781236"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="np-nacimiento">Fecha de nacimiento</FieldLabel>
                <Input id="np-nacimiento" type="date" required />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="np-sexo">Sexo</FieldLabel>
                <Select value={sexo} onValueChange={(v) => v && setSexo(String(v))}>
                  <SelectTrigger id="np-sexo" className="w-full">
                    <SelectValue>{SEXOS[sexo]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="femenino">Femenino</SelectItem>
                      <SelectItem value="masculino">Masculino</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="np-celular">Celular</FieldLabel>
                <Input
                  id="np-celular"
                  inputMode="tel"
                  placeholder="987 654 321"
                  required
                />
                <FieldDescription>Se usará para recordatorios por WhatsApp.</FieldDescription>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="np-direccion">Dirección</FieldLabel>
              <Input id="np-direccion" placeholder="Av. El Sol 245, Cusco" />
            </Field>

            <Field>
              <FieldLabel htmlFor="np-alertas">Alertas médicas (anamnesis inicial)</FieldLabel>
              <Textarea
                id="np-alertas"
                placeholder="Alergias, condiciones crónicas, embarazo, medicación actual..."
                rows={3}
              />
              <FieldDescription>
                Estas alertas se mostrarán de forma permanente en la ficha del paciente.
              </FieldDescription>
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner data-icon="inline-start" /> : null}
                {saving ? 'Guardando...' : 'Registrar paciente'}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
