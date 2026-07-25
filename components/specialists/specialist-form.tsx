'use client'

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SpecialistFormProps {
  nombres: string
  apellidos: string
  especialidad: string
  email: string
  telefono: string
  tarifa: number
  porcentajeDescuento?: number
  estado: 'activo' | 'inactivo'
  onChange: (field: string, value: any) => void
}

const SPECIALTIES = [
  'Ortodoncista',
  'Periodoncista',
  'Endodoncista',
  'Prostodoncista',
  'Cirujano Bucal',
  'Implantólogo',
  'Pediatra Dental',
  'Patólogo Oral',
]

export function SpecialistForm({
  nombres,
  apellidos,
  especialidad,
  email,
  telefono,
  tarifa,
  porcentajeDescuento = 0,
  estado,
  onChange,
}: SpecialistFormProps) {
  return (
    <FieldGroup className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="nombres">Nombres</FieldLabel>
          <Input
            id="nombres"
            value={nombres}
            onChange={(e) => onChange('nombres', e.target.value)}
            placeholder="Ej. Carlos"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="apellidos">Apellidos</FieldLabel>
          <Input
            id="apellidos"
            value={apellidos}
            onChange={(e) => onChange('apellidos', e.target.value)}
            placeholder="Ej. Mendoza García"
            required
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="especialidad">Especialidad</FieldLabel>
        <Select value={especialidad} onValueChange={(v) => onChange('especialidad', v)}>
          <SelectTrigger id="especialidad" className="w-full">
            <SelectValue placeholder="Selecciona especialidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="especialista@email.com"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
        <Input
          id="telefono"
          value={telefono}
          onChange={(e) => onChange('telefono', e.target.value)}
          placeholder="+51 912 345 678"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel htmlFor="tarifa">Tarifa por consulta (S/)</FieldLabel>
          <Input
            id="tarifa"
            type="number"
            min="0"
            step="10"
            value={tarifa}
            onChange={(e) => onChange('tarifa', parseFloat(e.target.value))}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="descuento">Descuento automático (%)</FieldLabel>
          <Input
            id="descuento"
            type="number"
            min="0"
            max="100"
            step="5"
            value={porcentajeDescuento}
            onChange={(e) => onChange('porcentajeDescuento', parseFloat(e.target.value))}
          />
          <FieldDescription>
            Porcentaje deducido automáticamente de pagos del cliente
          </FieldDescription>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="estado">Estado</FieldLabel>
        <Select value={estado} onValueChange={(v) => onChange('estado', v as 'activo' | 'inactivo')}>
          <SelectTrigger id="estado" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  )
}
