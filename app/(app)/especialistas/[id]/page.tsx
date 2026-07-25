'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SpecialistForm } from '@/components/specialists/specialist-form'
import { externalSpecialists, specialistHistories, formatSoles } from '@/lib/data'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EspecialistaDetailPage({ params }: PageProps) {
  const router = useRouter()
  const { id } = params as { id: string }
  const specialist = externalSpecialists.find((s) => s.id === id)
  const histories = specialistHistories.filter((h) => h.specialistId === id)

  const [formData, setFormData] = useState(specialist || {
    nombres: '',
    apellidos: '',
    especialidad: '',
    email: '',
    telefono: '',
    tarifa: 200,
    porcentajeDescuento: 0,
    estado: 'activo' as const,
  })

  if (!specialist) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Especialista no encontrado</p>
      </div>
    )
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log('[v0] Specialist updated:', formData)
    router.push('/especialistas')
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
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {specialist.nombres} {specialist.apellidos}
            </h1>
            <p className="text-muted-foreground">{specialist.especialidad}</p>
          </div>
          <Badge variant={specialist.estado === 'activo' ? 'default' : 'secondary'}>
            {specialist.estado === 'activo' ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del especialista</CardTitle>
                <CardDescription>Actualiza los datos del profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <SpecialistForm
                  nombres={formData.nombres}
                  apellidos={formData.apellidos}
                  especialidad={formData.especialidad}
                  email={formData.email}
                  telefono={formData.telefono}
                  tarifa={formData.tarifa}
                  porcentajeDescuento={formData.porcentajeDescuento}
                  estado={formData.estado}
                  onChange={handleFieldChange}
                />

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Tarifa por sesión</div>
                  <div className="text-2xl font-bold">{formatSoles(specialist.tarifa)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Saldo acumulado</div>
                  <div className={`text-lg font-semibold ${specialist.saldo > 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {formatSoles(specialist.saldo)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Historias clínicas</div>
                  <div className="text-lg font-semibold">{histories.length} registros</div>
                </div>
                {specialist.porcentajeDescuento && (
                  <div>
                    <div className="text-sm text-muted-foreground">Descuento automático</div>
                    <div className="text-lg font-semibold">{specialist.porcentajeDescuento}%</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historias clínicas */}
        {histories.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historias clínicas registradas</CardTitle>
              <CardDescription>
                {histories.length} registro(s) de pacientes atendidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Presupuesto</TableHead>
                      <TableHead className="text-center">Sesiones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {histories.map((history) => (
                      <TableRow key={history.id}>
                        <TableCell className="font-medium">P-{history.pacienteId.split('-')[1]}</TableCell>
                        <TableCell>{history.fecha || 'No especificada'}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {history.descripcion}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatSoles(history.presupuestoTotal)}
                        </TableCell>
                        <TableCell className="text-center">{history.sesiones.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
