'use client'

import { useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { useAuth } from '@/lib/auth-context'
import { WeekCalendar } from '@/components/appointments/week-calendar'
import { MonthCalendar } from '@/components/appointments/month-calendar'
import { NewAppointmentDialog } from '@/components/appointments/new-appointment-dialog'
import { AppointmentDetailsDialog } from '@/components/appointments/appointment-details-dialog'
import { SpecialistConsultationDialog } from '@/components/appointments/specialist-consultation-dialog'
import { Appointment } from '@/lib/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { appointments } from '@/lib/data'

function whatsappUrl(celular: string, paciente: string, hora: string) {
  const phone = `51${celular.replace(/\s/g, '')}`
  const msg = `Hola ${paciente}, el Centro Odontológico DentaClinic le recuerda su cita programada para mañana a las ${hora}. Por favor confirme su asistencia. ¡Gracias!`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export default function CitasPage() {
  const { user } = useAuth()
  const isSpecialist = user?.role === 'especialista'
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [consultationOpen, setConsultationOpen] = useState(false)
  const [consultationAppointment, setConsultationAppointment] = useState<Appointment | null>(null)

  const today = appointments
    .filter((a) => a.fecha === '2026-07-17')
    .sort((a, b) => a.hora.localeCompare(b.hora))
  const tomorrow = appointments.filter((a) => a.fecha === '2026-07-18')

  const handleAppointmentClick = (apt: Appointment) => {
    if (isSpecialist) {
      setConsultationAppointment(apt)
      setConsultationOpen(true)
    } else {
      setSelectedAppointment(apt)
      setDetailsOpen(true)
    }
  }

  const handleConsultationSave = (consultation: any) => {
    console.log('[v0] Consultation saved:', consultation)
    setConsultationOpen(false)
    setConsultationAppointment(null)
  }

  return (
    <>
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
      <SpecialistConsultationDialog
        appointment={consultationAppointment}
        open={consultationOpen}
        onOpenChange={setConsultationOpen}
        onSave={handleConsultationSave}
      />
      <AppHeader
        title={isSpecialist ? "Mis citas" : "Agenda de citas"}
        subtitle={isSpecialist 
          ? "Citas asignadas y registro de consultas externas" 
          : "Calendario semanal, reprogramación y recordatorios de confirmación"}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <Tabs defaultValue="semanal" className="w-full">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{isSpecialist ? "Mis citas" : "Calendarios"}</CardTitle>
                    <CardDescription>
                      {isSpecialist
                        ? "Haz click en una cita para registrar la consulta realizada"
                        : "Visualiza tus citas en vista semanal o mensual"}
                    </CardDescription>
                  </div>
                  {!isSpecialist && <NewAppointmentDialog />}
                </div>
              </CardHeader>
              <CardContent>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="semanal">Semanal</TabsTrigger>
                  <TabsTrigger value="mensual">Mensual</TabsTrigger>
                </TabsList>

                <TabsContent value="semanal">
                  <WeekCalendar />
                </TabsContent>

                <TabsContent value="mensual">
                  <MonthCalendar
                    appointments={appointments}
                    onAppointmentClick={handleAppointmentClick}
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-80" aria-label="Recordatorios">
          <Card>
            <CardHeader>
              <CardTitle>Citas de hoy</CardTitle>
              <CardDescription>Viernes 17 de julio — gestión de confirmaciones</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {today.map((cita, i) => (
                <div
                  key={cita.id}
                  className="flex flex-col gap-2 cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted"
                  onClick={() => handleAppointmentClick(cita)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">{cita.paciente}</span>
                      <span className="text-xs text-muted-foreground">
                        {cita.hora} · {cita.tratamiento}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" aria-hidden="true" />
                        {cita.celular}
                      </span>
                    </div>
                    <Badge variant={cita.estado === 'confirmada' ? 'default' : 'secondary'}>
                      {cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                    </Badge>
                  </div>
                  {i < today.length - 1 ? <Separator /> : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recordatorios para mañana</CardTitle>
              <CardDescription>
                Notificación ágil por WhatsApp con mensaje pre-renderizado
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {tomorrow.map((cita) => (
                <div key={cita.id} className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">{cita.paciente}</span>
                    <span className="text-xs text-muted-foreground">
                      {cita.hora} · {cita.tratamiento}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={whatsappUrl(cita.celular, cita.paciente, cita.hora)}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageCircle data-icon="inline-start" />
                    Notificar
                  </Button>
                </div>
              ))}
              {tomorrow.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No hay citas programadas para mañana.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  )
}
