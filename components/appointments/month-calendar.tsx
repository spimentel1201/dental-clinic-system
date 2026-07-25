'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Appointment } from '@/lib/data'

interface MonthCalendarProps {
  appointments: Appointment[]
  onAppointmentClick?: (appointment: Appointment) => void
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const statusColors: Record<Appointment['estado'], string> = {
  confirmada: 'bg-primary/10 text-primary',
  pendiente: 'bg-warning/10 text-warning',
  atendida: 'bg-success/10 text-success',
  cancelada: 'bg-muted text-muted-foreground',
  'no-presentó': 'bg-destructive/10 text-destructive',
}

const statusLabels: Record<Appointment['estado'], string> = {
  confirmada: 'Confirmada',
  pendiente: 'Pendiente',
  atendida: 'Atendida',
  cancelada: 'Cancelada',
  'no-presentó': 'No presentó',
}

export function MonthCalendar({ appointments, onAppointmentClick }: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  const [todayStr, setTodayStr] = useState<string>('')

  useEffect(() => {
    setCurrentDate(new Date())
    setTodayStr(new Date().toISOString().split('T')[0])
  }, [])

  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  const weeks: Date[][] = []
  const current = new Date(startDate)

  while (current <= monthEnd) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }

  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter((a) => a.fecha === dateStr)
  }

  const handlePrevMonth = () => {
    if (currentDate) setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    if (currentDate) setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {currentDate ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}` : 'Calendario'}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} aria-label="Mes anterior">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Próximo mes">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Encabezado de días */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-2">
          {weeks.map((week, weekIdx) =>
            week.map((date, dateIdx) => {
              const isCurrentMonth = date.getMonth() === currentDate?.getMonth()
              const dateStr = date.toISOString().split('T')[0]
              const dayAppointments = getAppointmentsForDate(date)
              const isToday = todayStr === dateStr

              return (
                <div
                  key={`${weekIdx}-${dateIdx}`}
                  className={`min-h-24 rounded-lg border p-2 transition-colors ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                  } ${isToday ? 'border-primary' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                      } ${isToday ? 'text-primary' : ''}`}
                    >
                      {date.getDate()}
                    </span>
                    {isToday && <Badge variant="secondary" className="text-xs">Hoy</Badge>}
                  </div>

                  {/* Citas del día */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => onAppointmentClick?.(apt)}
                        className={`w-full text-left text-xs rounded px-1.5 py-1 cursor-pointer hover:opacity-80 transition-opacity truncate ${statusColors[apt.estado]}`}
                        title={`${apt.hora} - ${apt.paciente}`}
                      >
                        {apt.hora.split(':')[0]}:{apt.hora.split(':')[1]} {apt.paciente.split(' ')[0]}
                      </button>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-muted-foreground px-1.5 py-1">
                        +{dayAppointments.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Leyenda de estados */}
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <div className="text-sm font-semibold mb-3">Leyenda de estados</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <div key={status} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status as Appointment['estado']]}`} />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
