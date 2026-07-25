'use client'

import { useState } from 'react'
import { Odontogram } from '@/components/odontogram/odontogram'
import { PatientSearchBar } from '@/components/patients/patient-search-bar'
import { patients } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Printer, Save } from 'lucide-react'

export default function OdontogramaPage() {
  const [pacienteId, setPacienteId] = useState('P-001')
  const paciente = patients.find((p) => p.id === pacienteId) ?? patients[0]

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl font-semibold text-balance">Odontograma</h1>
          <p className="text-sm text-muted-foreground">
            Registro gráfico según norma técnica MINSA. Seleccione un hallazgo y luego la pieza o superficie dental.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <PatientSearchBar
              patients={patients}
              value={pacienteId}
              onSelect={setPacienteId}
            />
          </div>
          <Button variant="outline">
            <Printer data-icon="inline-start" />
            Imprimir
          </Button>
          <Button>
            <Save data-icon="inline-start" />
            Guardar
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{`${paciente.nombres} ${paciente.apellidos}`}</span>
        <span aria-hidden="true">·</span>
        <span>DNI: {paciente.dni}</span>
        <span aria-hidden="true">·</span>
        <span>{paciente.edad} años</span>
        {paciente.alertas.map((a) => (
          <Badge key={a.detalle} variant="destructive">
            {a.detalle}
          </Badge>
        ))}
      </div>

      <Odontogram key={pacienteId} />
    </div>
  )
}
