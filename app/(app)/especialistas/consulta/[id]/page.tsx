'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, Save, Calendar } from 'lucide-react'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { patients } from '@/lib/data'
import { formatDate } from '@/lib/utils'

export default function EspecialistaConsultaPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string

  // Mock data - en producción vendría de la base de datos
  const consultation = {
    id: consultationId,
    pacienteId: 'P-001',
    specialty: 'Ortodoncista',
    appointmentDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
  }

  const patient = patients.find((p) => p.id === consultation.pacienteId) || patients[0]

  const [description, setDescription] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [budget, setBudget] = useState<string>('')
  const [sessions, setSessions] = useState<number>(1)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!description.trim()) {
      alert('Por favor ingresa la descripción del tratamiento')
      return
    }

    setIsSaving(true)
    console.log('[v0] Saving specialist consultation details:', {
      consultationId,
      pacienteId: consultation.pacienteId,
      specialty: consultation.specialty,
      description,
      diagnosis,
      budget,
      sessions,
    })

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false)
      router.push(`/especialistas`)
    }, 1000)
  }

  return (
    <>
      <AppHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link href="/especialistas">
                <Button size="sm" variant="ghost">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Registro de Consulta Especialista</h1>
                <p className="text-muted-foreground">
                  {patient.nombres} {patient.apellidos}
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información de la Cita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Especialidad</p>
                  <p className="font-medium">{consultation.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Cita</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(consultation.appointmentDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultation Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalles de la Consulta</CardTitle>
              <CardDescription>
                Registra los hallazgos, diagnóstico y presupuesto de la cita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="description">
                    Descripción del Tratamiento/Hallazgos *
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Detalla lo que encontraste, el tratamiento recomendado y los pasos a seguir..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="diagnosis">Diagnóstico</FieldLabel>
                  <Textarea
                    id="diagnosis"
                    placeholder="Diagnóstico clínico detallado..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="min-h-24"
                  />
                </Field>
              </FieldGroup>

              <FieldGroup className="grid grid-cols-2 gap-4">
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
                <div className="bg-muted p-3 rounded-md border border-border">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Monto por sesión:</span>{' '}
                    <span className="font-semibold">
                      S/ {(parseFloat(budget) / sessions).toFixed(2)}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Link href="/especialistas">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save data-icon="inline-start" />
              {isSaving ? 'Guardando...' : 'Guardar Consulta'}
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
