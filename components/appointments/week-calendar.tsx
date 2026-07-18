'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appointments, type Appointment } from '@/lib/data'
import { cn } from '@/lib/utils'

// Semana del lunes 13 al sábado 18 de julio de 2026
const weekDays = [
  { fecha: '2026-07-13', label: 'Lun', num: 13 },
  { fecha: '2026-07-14', label: 'Mar', num: 14 },
  { fecha: '2026-07-15', label: 'Mié', num: 15 },
  { fecha: '2026-07-16', label: 'Jue', num: 16 },
  { fecha: '2026-07-17', label: 'Vie', num: 17 },
  { fecha: '2026-07-18', label: 'Sáb', num: 18 },
]

const hours = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00']

const TODAY = '2026-07-17'

function apptsFor(fecha: string, hora: string): Appointment[] {
  const slotStart = Number(hora.slice(0, 2))
  return appointments.filter((a) => {
    if (a.fecha !== fecha) return false
    const h = Number(a.hora.slice(0, 2))
    return h === slotStart || (h === slotStart && Number(a.hora.slice(3)) > 0)
  })
}

const stateStyles: Record<Appointment['estado'], string> = {
  confirmada: 'border-primary/40 bg-primary/10 text-foreground',
  pendiente: 'border-warning/40 bg-warning/10 text-foreground',
  atendida: 'border-success/40 bg-success/10 text-muted-foreground',
  cancelada: 'border-border bg-muted text-muted-foreground line-through',
  'no-presentó': 'border-destructive/40 bg-destructive/10 text-muted-foreground',
}

export function WeekCalendar({
  onSelect,
}: {
  onSelect?: (appt: Appointment) => void
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Semana anterior">
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Semana siguiente">
            <ChevronRight aria-hidden="true" />
          </Button>
          <span className="ml-1 text-sm font-medium">13 — 18 de julio, 2026</span>
        </div>
        <div className="hidden items-center gap-4 text-xs text-muted-foreground md:flex">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary/60" /> Confirmada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-warning/70" /> Pendiente
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-success/70" /> Atendida
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid min-w-2xl grid-cols-[56px_repeat(6,1fr)] overflow-hidden rounded-lg border">
          {/* Cabecera de días */}
          <div className="border-b bg-muted/50" />
          {weekDays.map((d) => (
            <div
              key={d.fecha}
              className={cn(
                'flex flex-col items-center gap-0.5 border-b border-l bg-muted/50 py-2',
                d.fecha === TODAY && 'bg-accent',
              )}
            >
              <span className="text-xs text-muted-foreground">{d.label}</span>
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-sm font-medium',
                  d.fecha === TODAY && 'bg-primary text-primary-foreground',
                )}
              >
                {d.num}
              </span>
            </div>
          ))}

          {/* Filas por hora */}
          {hours.map((hora) => (
            <div key={hora} className="contents">
              <div className="flex items-start justify-end border-b px-2 py-1.5 text-xs tabular-nums text-muted-foreground">
                {hora}
              </div>
              {weekDays.map((d) => {
                const slot = apptsFor(d.fecha, hora)
                return (
                  <div
                    key={d.fecha + hora}
                    className={cn(
                      'min-h-16 border-b border-l p-1',
                      d.fecha === TODAY && 'bg-accent/40',
                    )}
                  >
                    {slot.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(a.id)
                          onSelect?.(a)
                        }}
                        className={cn(
                          'flex w-full flex-col gap-0.5 rounded-md border px-1.5 py-1 text-left text-xs transition-colors',
                          stateStyles[a.estado],
                          selectedId === a.id && 'ring-2 ring-ring',
                        )}
                      >
                        <span className="font-medium tabular-nums">
                          {a.hora} · {a.duracionMin}min
                        </span>
                        <span className="truncate">{a.paciente}</span>
                        <span className="hidden truncate text-[10px] opacity-75 lg:block">
                          {a.tratamiento}
                        </span>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
