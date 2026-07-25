'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PatientSearchBar } from '@/components/patients/patient-search-bar'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { patients, budgets } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { validationMessages } from '@/lib/validations'

export default function NuevoPresupuestoPage() {
  const router = useRouter()
  const [selectedPatient, setSelectedPatient] = useState<string>('')
  const [sessions, setSessions] = useState<any[]>([])
  const [currentSession, setCurrentSession] = useState<any>(null)
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const patient = patients.find((p) => p.id === selectedPatient)

  const TREATMENTS = [
    { id: 'profilaxis', label: 'Profilaxis', cost: 120 },
    { id: 'endodoncia', label: 'Endodoncia', cost: 700 },
    { id: 'curación', label: 'Curación (resina)', cost: 180 },
    { id: 'extracción', label: 'Extracción simple', cost: 140 },
    { id: 'corona', label: 'Cambio de corona (porcelana)', cost: 1200 },
    { id: 'ajuste', label: 'Ajuste de brackets', cost: 200 },
    { id: 'blanqueamiento', label: 'Blanqueamiento dental', cost: 400 },
    { id: 'radiografia', label: 'Radiografía panorámica', cost: 80 },
  ]

  const totalBudget = sessions.reduce((sum, s) => sum + s.cost, 0)
  const treatmentCount = sessions.reduce((sum, s) => sum + (s.treatments?.length || 0), 0)

  function handleAddSession() {
    if (!selectedTreatments.length) {
      setError(validationMessages.noTreatmentsSelected)
      return
    }

    const treatmentsList = TREATMENTS.filter((t) => selectedTreatments.includes(t.id))
    const sessionCost = treatmentsList.reduce((sum, t) => sum + t.cost, 0)

    const newSession = {
      id: `S-${Date.now()}`,
      numero: sessions.length + 1,
      treatments: selectedTreatments,
      treatmentsList,
      cost: sessionCost,
    }

    setSessions([...sessions, newSession])
    setSelectedTreatments([])
    setError('')
  }

  function handleRemoveSession(id: string) {
    setSessions(sessions.filter((s) => s.id !== id))
  }

  function handleSaveBudget() {
    if (!selectedPatient) {
      setError(validationMessages.selectPatient)
      return
    }

    if (!sessions.length) {
      setError(validationMessages.noTreatmentsSelected)
      return
    }

    setError('')
    // In a real app, this would save to the database
    console.log('[v0] Budget created:', { patient: selectedPatient, sessions, total: totalBudget })
    router.push('/presupuestos')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            aria-label="Volver atrás"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Presupuesto</h1>
            <p className="text-muted-foreground">Crea un presupuesto de tratamiento para un paciente</p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Selección de paciente y tratamientos */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paso 1: Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="paciente">Seleccionar paciente</FieldLabel>
                  <PatientSearchBar
                    patients={patients}
                    value={selectedPatient}
                    onSelect={setSelectedPatient}
                    placeholder="Buscar y seleccionar paciente"
                  />
                </Field>

                {patient && (
                  <div className="rounded-lg bg-muted p-3 space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Edad: </span>
                      <span className="font-semibold">{patient.edad} años</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">DNI: </span>
                      <span className="font-semibold">{patient.dni}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Teléfono: </span>
                      <span className="font-semibold">{patient.celular}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de tratamientos */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paso 2: Tratamientos</CardTitle>
                <CardDescription>Selecciona tratamientos para esta sesión</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {TREATMENTS.map((treatment) => (
                    <label key={treatment.id} className="flex items-center gap-3 rounded-lg border p-2 cursor-pointer hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={selectedTreatments.includes(treatment.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTreatments([...selectedTreatments, treatment.id])
                          } else {
                            setSelectedTreatments(selectedTreatments.filter((t) => t !== treatment.id))
                          }
                        }}
                        className="size-4"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{treatment.label}</div>
                        <div className="text-xs text-muted-foreground">S/ {treatment.cost.toLocaleString('es-PE')}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  onClick={handleAddSession}
                  disabled={!selectedTreatments.length}
                  className="w-full"
                >
                  <Plus data-icon="inline-start" />
                  Agregar sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de sesiones */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paso 3: Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sesiones:</span>
                    <span className="font-semibold">{sessions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tratamientos:</span>
                    <span className="font-semibold">{treatmentCount}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total presupuesto:</span>
                    <span className="text-lg font-bold">S/ {totalBudget.toLocaleString('es-PE')}</span>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}

                <Button onClick={handleSaveBudget} disabled={!selectedPatient || !sessions.length} className="w-full">
                  Guardar presupuesto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabla de sesiones */}
        {sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sesiones planificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-start justify-between rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Sesión {session.numero}</Badge>
                        <span className="text-sm font-semibold">S/ {session.cost.toLocaleString('es-PE')}</span>
                      </div>
                      <div className="space-y-1">
                        {session.treatmentsList.map((t: any) => (
                          <div key={t.id} className="text-sm text-muted-foreground">
                            • {t.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveSession(session.id)}
                      aria-label="Eliminar sesión"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
