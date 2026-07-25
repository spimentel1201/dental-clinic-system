'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SpecialistForm } from '@/components/specialists/specialist-form'

export default function NuevoEspecialistaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    especialidad: '',
    email: '',
    telefono: '',
    tarifa: 200,
    porcentajeDescuento: 0,
    estado: 'activo' as const,
  })

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!formData.nombres || !formData.apellidos || !formData.especialidad) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    console.log('[v0] New specialist saved:', formData)
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
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Especialista</h1>
            <p className="text-muted-foreground">Registra un médico especializado externo</p>
          </div>
        </div>

        <Separator />

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Información del especialista</CardTitle>
              <CardDescription>
                Completa los datos del profesional para establecer la relación de trabajo
              </CardDescription>
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
                <Button onClick={handleSave}>Registrar especialista</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
