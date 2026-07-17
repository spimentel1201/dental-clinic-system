'use client'

import { useMemo, useState } from 'react'
import { RotateCcw, FileDown, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  upperRight,
  upperLeft,
  lowerLeft,
  lowerRight,
  initialToothStates,
  toothConditionLabels,
  formatSoles,
  type ToothCondition,
} from '@/lib/data'
import { cn } from '@/lib/utils'

const conditionStyles: Record<
  ToothCondition,
  { fill: string; ring: string; swatch: string }
> = {
  sano: { fill: 'fill-card', ring: 'stroke-border', swatch: 'bg-muted' },
  caries: { fill: 'fill-destructive/70', ring: 'stroke-destructive', swatch: 'bg-destructive' },
  curacion: { fill: 'fill-chart-1/70', ring: 'stroke-chart-1', swatch: 'bg-chart-1' },
  endodoncia: { fill: 'fill-chart-2/70', ring: 'stroke-chart-2', swatch: 'bg-chart-2' },
  extraccion: { fill: 'fill-destructive/25', ring: 'stroke-destructive', swatch: 'bg-destructive/50' },
  corona: { fill: 'fill-warning/70', ring: 'stroke-warning', swatch: 'bg-warning' },
  ausente: { fill: 'fill-muted', ring: 'stroke-muted-foreground', swatch: 'bg-muted-foreground' },
  implante: { fill: 'fill-success/70', ring: 'stroke-success', swatch: 'bg-success' },
  sellante: { fill: 'fill-chart-3/70', ring: 'stroke-chart-3', swatch: 'bg-chart-3' },
  fractura: { fill: 'fill-destructive/40', ring: 'stroke-destructive', swatch: 'bg-destructive/70' },
}

// Tarifario para presupuesto automático (RF-05)
const tariff: Partial<Record<ToothCondition, { tratamiento: string; costo: number }>> = {
  caries: { tratamiento: 'Curación (resina)', costo: 180 },
  extraccion: { tratamiento: 'Extracción simple', costo: 140 },
  endodoncia: { tratamiento: 'Endodoncia', costo: 700 },
  corona: { tratamiento: 'Corona de porcelana', costo: 1200 },
  fractura: { tratamiento: 'Reconstrucción por fractura', costo: 350 },
  implante: { tratamiento: 'Implante dental', costo: 2500 },
  sellante: { tratamiento: 'Sellante de fosas y fisuras', costo: 90 },
}

function Tooth({
  number,
  condition,
  selected,
  onClick,
}: {
  number: number
  condition: ToothCondition
  selected: boolean
  onClick: () => void
}) {
  const style = conditionStyles[condition]
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Pieza ${number}: ${toothConditionLabels[condition]}`}
      aria-pressed={selected}
      className={cn(
        'group flex flex-col items-center gap-1 rounded-md p-1 transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'bg-accent',
      )}
    >
      <svg viewBox="0 0 40 40" className="size-8 sm:size-10" aria-hidden="true">
        {/* Corona con 5 superficies */}
        <rect x="2" y="2" width="36" height="36" rx="6" className={cn(style.fill, style.ring)} strokeWidth="1.5" />
        <path d="M12 12 L28 12 L24 17 L16 17 Z" className="fill-background/30 stroke-background/50" strokeWidth="0.75" />
        <path d="M12 28 L28 28 L24 23 L16 23 Z" className="fill-background/30 stroke-background/50" strokeWidth="0.75" />
        <path d="M12 12 L12 28 L16 23 L16 17 Z" className="fill-background/30 stroke-background/50" strokeWidth="0.75" />
        <path d="M28 12 L28 28 L24 23 L24 17 Z" className="fill-background/30 stroke-background/50" strokeWidth="0.75" />
        <rect x="16" y="17" width="8" height="6" className="fill-background/40 stroke-background/50" strokeWidth="0.75" />
        {(condition === 'ausente' || condition === 'extraccion') && (
          <g className={condition === 'extraccion' ? 'stroke-destructive' : 'stroke-muted-foreground'} strokeWidth="3" strokeLinecap="round">
            <line x1="8" y1="8" x2="32" y2="32" />
            <line x1="32" y1="8" x2="8" y2="32" />
          </g>
        )}
        {condition === 'fractura' && (
          <path d="M14 6 L22 20 L16 22 L26 34" className="fill-none stroke-destructive" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
      <span
        className={cn(
          'text-[10px] font-medium tabular-nums sm:text-xs',
          selected ? 'text-accent-foreground' : 'text-muted-foreground',
        )}
      >
        {number}
      </span>
    </button>
  )
}

export function Odontogram() {
  const [teeth, setTeeth] = useState<Record<number, ToothCondition>>(initialToothStates)
  const [activeCondition, setActiveCondition] = useState<ToothCondition>('caries')
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null)

  function handleToothClick(n: number) {
    setSelectedTooth(n)
    setTeeth((prev) => {
      const next = { ...prev }
      if (activeCondition === 'sano') {
        delete next[n]
      } else {
        next[n] = activeCondition
      }
      return next
    })
  }

  const findings = useMemo(
    () =>
      Object.entries(teeth)
        .map(([n, c]) => ({ pieza: Number(n), condicion: c }))
        .sort((a, b) => a.pieza - b.pieza),
    [teeth],
  )

  const budgetItems = useMemo(
    () =>
      findings
        .filter((f) => tariff[f.condicion])
        .map((f) => ({
          pieza: f.pieza,
          ...(tariff[f.condicion] as { tratamiento: string; costo: number }),
        })),
    [findings],
  )
  const budgetTotal = budgetItems.reduce((s, i) => s + i.costo, 0)

  const renderRow = (nums: number[]) => (
    <div className="flex">
      {nums.map((n) => (
        <Tooth
          key={n}
          number={n}
          condition={teeth[n] ?? 'sano'}
          selected={selectedTooth === n}
          onClick={() => handleToothClick(n)}
        />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Alerta del paciente (RF-02) */}
        <Alert variant="destructive">
          <AlertTriangle aria-hidden="true" />
          <AlertTitle>María Elena Quispe Huamán — DNI 45879123</AlertTitle>
          <AlertDescription>
            Alergia a la penicilina · Sospecha de embarazo (2do trimestre). Evitar radiografías
            y anestesia con vasoconstrictor.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>Odontograma — nomenclatura FDI (MINSA)</CardTitle>
                <CardDescription>
                  Selecciona un estado en la paleta y haz clic sobre la pieza dental
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTeeth(initialToothStates)
                  setSelectedTooth(null)
                }}
              >
                <RotateCcw data-icon="inline-start" />
                Restablecer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Paleta de estados */}
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estado o tratamiento a asignar">
              {(Object.keys(toothConditionLabels) as ToothCondition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={activeCondition === c}
                  onClick={() => setActiveCondition(c)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                    activeCondition === c
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  <span className={cn('size-2.5 rounded-full', conditionStyles[c].swatch)} />
                  {toothConditionLabels[c]}
                </button>
              ))}
            </div>

            <Separator />

            {/* Arcadas */}
            <div className="overflow-x-auto">
              <div className="flex min-w-fit flex-col items-center gap-2 py-2">
                <span className="text-xs font-medium text-muted-foreground">Arcada superior</span>
                <div className="flex items-center gap-3">
                  {renderRow(upperRight)}
                  <Separator orientation="vertical" className="h-12" />
                  {renderRow(upperLeft)}
                </div>
                <div className="flex w-full items-center gap-3 py-1">
                  <Separator className="flex-1" />
                  <span className="text-[10px] text-muted-foreground">
                    Derecha — línea media — Izquierda
                  </span>
                  <Separator className="flex-1" />
                </div>
                <div className="flex items-center gap-3">
                  {renderRow(lowerRight)}
                  <Separator orientation="vertical" className="h-12" />
                  {renderRow(lowerLeft)}
                </div>
                <span className="text-xs font-medium text-muted-foreground">Arcada inferior</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de hallazgos y presupuesto */}
      <aside className="flex w-full shrink-0 flex-col gap-6 xl:w-96" aria-label="Hallazgos y presupuesto">
        <Card>
          <CardHeader>
            <CardTitle>Hallazgos registrados</CardTitle>
            <CardDescription>{findings.length} piezas con diagnóstico</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No hay hallazgos. Todas las piezas se encuentran sanas.
              </p>
            ) : (
              findings.map((f) => (
                <div key={f.pieza} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn('size-2.5 rounded-full', conditionStyles[f.condicion].swatch)}
                    />
                    Pieza {String(f.pieza).slice(0, 1)}.{String(f.pieza).slice(1)}
                  </span>
                  <Badge variant="outline">{toothConditionLabels[f.condicion]}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presupuesto sugerido</CardTitle>
            <CardDescription>
              Calculado automáticamente según el tarifario y los hallazgos del odontograma
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tratamiento</TableHead>
                  <TableHead>Pieza</TableHead>
                  <TableHead className="text-right">Costo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell>{item.tratamiento}</TableCell>
                    <TableCell className="tabular-nums">
                      {String(item.pieza).slice(0, 1)}.{String(item.pieza).slice(1)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatSoles(item.costo)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="font-semibold">
                    Total presupuestado
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatSoles(budgetTotal)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button className="w-full">
              <FileDown data-icon="inline-start" />
              Generar presupuesto maestro
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
