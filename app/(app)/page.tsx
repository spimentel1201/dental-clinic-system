import Link from 'next/link'
import {
  TrendingUp,
  Users,
  CalendarCheck,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { TreatmentsChart } from '@/components/dashboard/treatments-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { appointments, expenses, patients, formatSoles } from '@/lib/data'

const kpis = [
  {
    label: 'Ingresos del mes',
    value: formatSoles(17650),
    delta: '+12.4% vs. junio',
    up: true,
    icon: TrendingUp,
  },
  {
    label: 'Utilidad neta (julio)',
    value: formatSoles(7850),
    delta: '+8.1% vs. junio',
    up: true,
    icon: PiggyBank,
  },
  {
    label: 'Pacientes atendidos',
    value: '86',
    delta: '-3.2% vs. junio',
    up: false,
    icon: Users,
  },
  {
    label: 'Citas para hoy',
    value: '5',
    delta: '3 confirmadas',
    up: true,
    icon: CalendarCheck,
  },
]

export default function DashboardPage() {
  const today = appointments.filter((a) => a.fecha === '2026-07-17')
  const totalGastos = expenses.reduce((s, e) => s + e.monto, 0)
  const costoPorPaciente = totalGastos / 86
  const debtors = patients.filter((p) => p.saldoDeudor > 0)

  return (
    <>
      <AppHeader
        title="Panel de control"
        subtitle="Resumen operativo, clínico y financiero — Julio 2026"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <section
          aria-label="Indicadores clave"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{kpi.label}</CardDescription>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
                    <kpi.icon className="size-4 text-accent-foreground" aria-hidden="true" />
                  </div>
                </div>
                <CardTitle className="text-2xl tabular-nums">{kpi.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {kpi.up ? (
                    <ArrowUpRight className="size-3.5 text-success" aria-hidden="true" />
                  ) : (
                    <ArrowDownRight className="size-3.5 text-destructive" aria-hidden="true" />
                  )}
                  {kpi.delta}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5" aria-label="Gráficos">
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Ingresos vs. costos</CardTitle>
              <CardDescription>
                Evolución mensual de la rentabilidad de la clínica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Tratamientos del mes</CardTitle>
              <CardDescription>Distribución por tipo de procedimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <TreatmentsChart />
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3" aria-label="Detalle operativo">
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle>Citas de hoy</CardTitle>
                  <CardDescription>Viernes 17 de julio de 2026</CardDescription>
                </div>
                <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/citas" />}>
                  Ver agenda
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="hidden md:table-cell">Tratamiento</TableHead>
                    <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {today.map((cita) => (
                    <TableRow key={cita.id}>
                      <TableCell className="font-medium tabular-nums">{cita.hora}</TableCell>
                      <TableCell>{cita.paciente}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {cita.tratamiento}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{cita.doctor}</TableCell>
                      <TableCell>
                        <Badge
                          variant={cita.estado === 'confirmada' ? 'default' : 'secondary'}
                        >
                          {cita.estado === 'confirmada' ? 'Confirmada' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rentabilidad por paciente</CardTitle>
                <CardDescription>Prorrateo de costos operativos — julio</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Costos operativos totales</span>
                  <span className="font-medium tabular-nums">{formatSoles(totalGastos)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pacientes atendidos</span>
                  <span className="font-medium tabular-nums">86</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="font-medium">Costo por paciente</span>
                  <span className="font-semibold tabular-nums text-primary">
                    {formatSoles(costoPorPaciente)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-warning" aria-hidden="true" />
                  <CardTitle>Saldos deudores</CardTitle>
                </div>
                <CardDescription>Pacientes con pagos pendientes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {debtors.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">
                      {p.nombres} {p.apellidos.split(' ')[0]}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-destructive">
                      {formatSoles(p.saldoDeudor)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}
