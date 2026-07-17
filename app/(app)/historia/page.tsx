import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  AlertTriangle,
  Phone,
  IdCard,
  Cake,
  Camera,
  Plus,
  FileText,
  Smile,
} from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { patients, clinicalHistory, formatSoles } from '@/lib/data'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Historia clínica — DentaClinic',
}

const alertVariant: Record<string, string> = {
  alergia: 'Alergia',
  cronica: 'Condición crónica',
  embarazo: 'Embarazo',
}

const clinicalPhotos = [
  { src: '/images/foto-clinica-1.png', alt: 'Vista frontal intraoral — 18/06/2026' },
  { src: '/images/foto-clinica-2.png', alt: 'Vista oclusal arcada superior — 18/06/2026' },
  { src: '/images/foto-clinica-3.png', alt: 'Radiografía panorámica — 18/06/2026' },
]

export default function HistoriaPage() {
  const patient = patients[0] // María Elena Quispe — ficha activa
  const emptySlots = 6 - clinicalPhotos.length

  return (
    <>
      <AppHeader
        title="Historia clínica"
        subtitle="Ficha del paciente, anamnesis, evoluciones y repositorio fotográfico"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 xl:flex-row">
        {/* Lista de pacientes */}
        <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-72" aria-label="Lista de pacientes">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pacientes</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus data-icon="inline-start" />
                  Nuevo
                </Button>
              </div>
              <CardDescription>{patients.length} fichas registradas</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {patients.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors',
                    i === 0 ? 'bg-accent text-accent-foreground' : 'hover:bg-muted',
                  )}
                  aria-current={i === 0 ? 'true' : undefined}
                >
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">
                      {p.nombres[0]}
                      {p.apellidos[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {p.nombres} {p.apellidos.split(' ')[0]}
                    </span>
                    <span className="text-xs text-muted-foreground">DNI {p.dni}</span>
                  </div>
                  {p.alertas.length > 0 ? (
                    <AlertTriangle
                      className="ml-auto size-3.5 shrink-0 text-warning"
                      aria-label="Paciente con alertas médicas"
                    />
                  ) : null}
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Ficha del paciente */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* RF-02: Alertas de anamnesis permanentemente visibles */}
          {patient.alertas.length > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle aria-hidden="true" />
              <AlertTitle>Alertas médicas del paciente</AlertTitle>
              <AlertDescription>
                <ul className="flex list-disc flex-col gap-0.5 pl-4">
                  {patient.alertas.map((a, i) => (
                    <li key={i}>
                      <span className="font-medium">{alertVariant[a.tipo]}:</span> {a.detalle}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14">
                    <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                      MQ
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl">
                      {patient.nombres} {patient.apellidos}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <IdCard className="size-4" aria-hidden="true" />
                        DNI {patient.dni}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-4" aria-hidden="true" />
                        {patient.celular}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Cake className="size-4" aria-hidden="true" />
                        {patient.edad} años
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/odontograma" />}
                  >
                    <Smile data-icon="inline-start" />
                    Odontograma
                  </Button>
                  <Button size="sm">
                    <FileText data-icon="inline-start" />
                    Consentimiento PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Ficha</span>
                  <span className="text-sm font-medium">{patient.id}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Última visita</span>
                  <span className="text-sm font-medium tabular-nums">{patient.ultimaVisita}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Presupuesto activo</span>
                  <span className="text-sm font-medium">PR-001</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Saldo deudor</span>
                  <span className="text-sm font-semibold tabular-nums text-destructive">
                    {formatSoles(patient.saldoDeudor)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            {/* Evoluciones */}
            <Card className="xl:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Evolución clínica</CardTitle>
                    <CardDescription>Registro cronológico de procedimientos</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus data-icon="inline-start" />
                    Nueva nota
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col">
                {clinicalHistory.map((entry, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mt-1 size-2.5 shrink-0 rounded-full bg-primary" />
                      {i < clinicalHistory.length - 1 ? (
                        <div className="w-px flex-1 bg-border" />
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5 pb-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{entry.procedimiento}</span>
                        <Badge variant="outline">{entry.doctor}</Badge>
                      </div>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {entry.fecha}
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {entry.notas}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* RF-04: Repositorio fotográfico */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>Fotografías clínicas</CardTitle>
                    <CardDescription>
                      {clinicalPhotos.length} de 6 fotos utilizadas
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Camera data-icon="inline-start" />
                    Subir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {clinicalPhotos.map((photo) => (
                    <div
                      key={photo.src}
                      className="relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={photo.src || "/placeholder.svg"}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 1280px) 40vw, 15vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <div
                      key={i}
                      className="flex aspect-square items-center justify-center rounded-lg border border-dashed"
                    >
                      <span className="text-xs text-muted-foreground">Espacio libre</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Formatos aceptados: JPG y PNG. Máximo 6 fotografías por paciente según
                  autorización firmada en el consentimiento informado.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
