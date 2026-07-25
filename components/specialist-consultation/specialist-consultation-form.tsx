'use client'

import { useState } from 'react'
import { Calendar, FileText, DollarSign, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatSoles } from '@/lib/data'

interface SessionItem {
  numero: number
  monto: number
}

interface SpecialistConsultationFormProps {
  pacienteName?: string
  pacienteId?: string
  onSubmit?: (data: any) => void
}

export function SpecialistConsultationForm({
  pacienteName = 'María Elena Quispe Huamán',
  pacienteId = 'P-001',
  onSubmit,
}: SpecialistConsultationFormProps) {
  const [diagnostico, setDiagnostico] = useState('')
  const [notasClinicas, setNotasClinicas] = useState('')
  const [fechaProximaCita, setFechaProximaCita] = useState('')
  const [presupuestoTotal, setPresupuestoTotal] = useState('')
  const [numSesiones, setNumSesiones] = useState('1')
  const [sesiones, setSesiones] = useState<SessionItem[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Calculate session cost
  const total = presupuestoTotal ? parseFloat(presupuestoTotal) : 0
  const numSes = parseInt(numSesiones) || 1
  const costPerSession = numSes > 0 ? total / numSes : 0

  const generateSesiones = () => {
    const newSesiones: SessionItem[] = []
    for (let i = 1; i <= numSes; i++) {
      newSesiones.push({
        numero: i,
        monto: costPerSession,
      })
    }
    setSesiones(newSesiones)
  }

  const handleNumSessionsChange = (value: string) => {
    setNumSesiones(value)
    setSesiones([]) // Reset sessions when changing number
  }

  const handleGenerateSessions = () => {
    generateSesiones()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = {
        pacienteId,
        diagnostico,
        notasClinicas,
        fechaProximaCita,
        presupuestoTotal: total,
        numSesiones: numSes,
        sesiones,
        fechaRegistro: new Date().toISOString().split('T')[0],
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      if (onSubmit) {
        onSubmit(formData)
      }

      setSubmitted(true)
      setTimeout(() => {
        // Reset form
        setDiagnostico('')
        setNotasClinicas('')
        setFechaProximaCita('')
        setPresupuestoTotal('')
        setNumSesiones('1')
        setSesiones([])
        setSubmitted(false)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Registrar Consulta Externa</CardTitle>
          <CardDescription>
            Completa los datos de la consulta para el paciente: <span className="font-semibold">{pacienteName}</span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Clinical Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información Clínica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="diagnostico">Diagnóstico</FieldLabel>
            <Textarea
              id="diagnostico"
              placeholder="Describe el diagnóstico realizado en la consulta externa..."
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
              disabled={loading}
              className="min-h-24"
              required
            />
            <FieldDescription>Diagnóstico detallado de la condición del paciente</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="notas">Notas Clínicas</FieldLabel>
            <Textarea
              id="notas"
              placeholder="Observaciones, recomendaciones y notas adicionales sobre el tratamiento..."
              value={notasClinicas}
              onChange={(e) => setNotasClinicas(e.target.value)}
              disabled={loading}
              className="min-h-28"
            />
            <FieldDescription>Notas adicionales y observaciones clínicas</FieldDescription>
          </Field>
        </CardContent>
      </Card>

      {/* Planning & Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Planificación y Presupuesto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field>
            <FieldLabel htmlFor="fecha">Fecha de Próxima Cita</FieldLabel>
            <Input
              id="fecha"
              type="date"
              value={fechaProximaCita}
              onChange={(e) => setFechaProximaCita(e.target.value)}
              disabled={loading}
              required
              className="max-w-sm"
            />
            <FieldDescription>Cuándo se programará la próxima cita</FieldDescription>
          </Field>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="presupuesto">Presupuesto Total (S/.)</FieldLabel>
              <Input
                id="presupuesto"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={presupuestoTotal}
                onChange={(e) => setPresupuestoTotal(e.target.value)}
                disabled={loading}
                required
              />
              <FieldDescription>Costo total del tratamiento</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="sesiones">Número de Sesiones</FieldLabel>
              <Input
                id="sesiones"
                type="number"
                min="1"
                max="20"
                value={numSesiones}
                onChange={(e) => handleNumSessionsChange(e.target.value)}
                disabled={loading}
              />
              <FieldDescription>Cantidad de sesiones necesarias</FieldDescription>
            </Field>
          </div>

          {presupuestoTotal && numSesiones && (
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Costo por sesión</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatSoles(costPerSession)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSessions}
                  disabled={loading || sesiones.length > 0}
                >
                  Desglosar sesiones
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions Breakdown */}
      {sesiones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desglose de Sesiones</CardTitle>
            <CardDescription>
              {sesiones.length} sesiones de {formatSoles(costPerSession)} cada una
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sesiones.map((session) => (
                <div
                  key={session.numero}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="w-fit">
                      Sesión {session.numero}
                    </Badge>
                    <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-primary">{formatSoles(session.monto)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!diagnostico || !fechaProximaCita || !presupuestoTotal || !numSesiones || loading}
          className="flex-1"
        >
          {submitted ? (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              ¡Registrado exitosamente!
            </>
          ) : loading ? (
            'Guardando...'
          ) : (
            'Registrar Consulta'
          )}
        </Button>
        <Button type="button" variant="outline" disabled={loading}>
          Cancelar
        </Button>
      </div>

      {/* Info Alert */}
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950 p-4 text-sm text-blue-900 dark:text-blue-100">
        <AlertCircle className="size-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Esta información será registrada en la historia clínica del paciente.</p>
          <p className="text-xs mt-1 opacity-80">
            El especialista podrá ver esta consulta en futuros accesos. El odontólogo puede visualizar y editar estos datos.
          </p>
        </div>
      </div>
    </form>
  )
}
