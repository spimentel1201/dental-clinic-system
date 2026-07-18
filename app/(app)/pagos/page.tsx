import type { Metadata } from 'next'
import { Banknote, CreditCard, Smartphone, Landmark } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { RegisterPaymentDialog } from '@/components/payments/register-payment-dialog'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { payments, budgets, expenses, formatSoles } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Pagos y caja — DentaClinic',
}

const methodIcons = {
  Efectivo: Banknote,
  Tarjeta: CreditCard,
  Yape: Smartphone,
  Plin: Smartphone,
} as const

const itemStateLabel = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
} as const

export default function PagosPage() {
  const todayPayments = payments.filter((p) => p.fecha === '2026-07-17')
  const byMethod = (['Efectivo', 'Tarjeta', 'Yape', 'Plin'] as const).map((m) => ({
    metodo: m,
    total: todayPayments.filter((p) => p.metodo === m).reduce((s, p) => s + p.monto, 0),
    count: todayPayments.filter((p) => p.metodo === m).length,
  }))
  const totalDia = todayPayments.reduce((s, p) => s + p.monto, 0)
  const totalGastos = expenses.reduce((s, e) => s + e.monto, 0)

  return (
    <>
      <AppHeader
        title="Pagos y caja"
        subtitle="Gestión de abonos, presupuestos fraccionados y cierre de caja diario"
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <Tabs defaultValue="caja" className="gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="caja">Caja del día</TabsTrigger>
              <TabsTrigger value="presupuestos">Presupuestos y saldos</TabsTrigger>
              <TabsTrigger value="costos">Costos del mes</TabsTrigger>
            </TabsList>
            <RegisterPaymentDialog />
          </div>

          <TabsContent value="caja" className="flex flex-col gap-6">
            <section
              aria-label="Totales por método de pago"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
            >
              <Card className="bg-primary text-primary-foreground xl:col-span-1">
                <CardHeader>
                  <CardDescription className="text-primary-foreground/75">
                    Total del día
                  </CardDescription>
                  <CardTitle className="text-2xl tabular-nums">
                    {formatSoles(totalDia)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-primary-foreground/75">
                    {todayPayments.length} abonos registrados hoy
                  </p>
                </CardContent>
              </Card>
              {byMethod.map((m) => {
                const Icon = methodIcons[m.metodo]
                return (
                  <Card key={m.metodo}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardDescription>{m.metodo}</CardDescription>
                        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl tabular-nums">
                        {formatSoles(m.total)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {m.count} {m.count === 1 ? 'operación' : 'operaciones'}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Abonos del día</CardTitle>
                <CardDescription>
                  Consolidado para el cierre de caja — viernes 17 de julio de 2026
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° abono</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead className="hidden md:table-cell">Concepto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>{p.paciente}</TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {p.concepto}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{p.metodo}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
                          {formatSoles(p.monto)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="font-semibold">
                        Total consolidado
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatSoles(totalDia)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presupuestos" className="flex flex-col gap-6">
            {budgets.map((b) => {
              const saldo = b.presupuestoTotal - b.totalPagado
              const pct = Math.round((b.totalPagado / b.presupuestoTotal) * 100)
              return (
                <Card key={b.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <CardTitle>
                          {b.paciente}{' '}
                          <span className="font-normal text-muted-foreground">— {b.id}</span>
                        </CardTitle>
                        <CardDescription>
                          Presupuesto maestro generado el {b.fecha}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Costo total</span>
                          <span className="font-semibold tabular-nums">
                            {formatSoles(b.presupuestoTotal)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Abonado</span>
                          <span className="font-semibold tabular-nums text-success">
                            {formatSoles(b.totalPagado)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">Saldo deudor</span>
                          <span className="font-semibold tabular-nums text-destructive">
                            {formatSoles(saldo)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <Progress value={pct} aria-label={`${pct}% abonado`} className="h-2" />
                      <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                        {pct}% abonado
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tratamiento</TableHead>
                          <TableHead>Pieza</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Costo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {b.items.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.tratamiento}</TableCell>
                            <TableCell className="tabular-nums">{item.pieza}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.estado === 'completado'
                                    ? 'default'
                                    : item.estado === 'en_proceso'
                                      ? 'secondary'
                                      : 'outline'
                                }
                              >
                                {itemStateLabel[item.estado]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right tabular-nums">
                              {formatSoles(item.costo)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="costos" className="flex flex-col gap-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Resumen de costos">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardDescription>Costos fijos</CardDescription>
                    <Landmark className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl tabular-nums">
                    {formatSoles(
                      expenses.filter((e) => e.categoria === 'fijo').reduce((s, e) => s + e.monto, 0),
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Costos variables</CardDescription>
                  <CardTitle className="text-xl tabular-nums">
                    {formatSoles(
                      expenses
                        .filter((e) => e.categoria === 'variable')
                        .reduce((s, e) => s + e.monto, 0),
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Laboratorio (técnicos)</CardDescription>
                  <CardTitle className="text-xl tabular-nums">
                    {formatSoles(
                      expenses
                        .filter((e) => e.categoria === 'laboratorio')
                        .reduce((s, e) => s + e.monto, 0),
                    )}
                  </CardTitle>
                </CardHeader>
              </Card>
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Detalle de costos operativos — julio</CardTitle>
                <CardDescription>
                  Estos costos se prorratean entre los pacientes atendidos para el cálculo de
                  rentabilidad neta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="hidden sm:table-cell">Fecha</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell>{e.concepto}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {e.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden tabular-nums sm:table-cell">
                          {e.fecha}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatSoles(e.monto)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-semibold">
                        Total de costos del mes
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatSoles(totalGastos)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
