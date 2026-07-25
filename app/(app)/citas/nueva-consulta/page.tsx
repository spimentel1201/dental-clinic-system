'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { SpecialistConsultationForm } from '@/components/specialist-consultation/specialist-consultation-form'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NuevaConsultaPage() {
  const { user } = useAuth()
  const isSpecialist = user?.role === 'especialista'

  // For demo purposes, using fixed patient data
  const pacienteName = 'María Elena Quispe Huamán'
  const pacienteId = 'P-001'

  if (!isSpecialist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="text-muted-foreground">Solo especialistas externos pueden registrar consultas.</p>
        <Link href="/citas">
          <Button>Volver a mis citas</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <AppHeader
        title="Nueva Consulta Externa"
        subtitle="Registra los datos de la consulta realizada al paciente"
      />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div>
          <Link href="/citas">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ChevronLeft className="size-4" />
              Volver a mis citas
            </Button>
          </Link>
        </div>

        <SpecialistConsultationForm
          pacienteName={pacienteName}
          pacienteId={pacienteId}
          onSubmit={(data) => {
            console.log('Consulta registrada:', data)
            // Here you would send data to API
          }}
        />
      </main>
    </>
  )
}
