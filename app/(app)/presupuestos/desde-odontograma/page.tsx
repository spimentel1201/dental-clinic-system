'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react'
import { ToothFindingV3, patients } from '@/lib/data'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'

interface BudgetItem {
  pieza: string
  tratamiento: string
  costo: number
  cantidad: number
}

function PresupuestoDesdeOdontogramaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hallazgos, setHallazgos] = useState<Record<string, ToothFindingV3>>({})
  const [pacienteId, setPacienteId] = useState('')
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [presupuestoName, setPresupuestoName] = useState('')
  const [diagnosticoGeneral, setDiagnosticoGeneral] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const pId = searchParams.get('pacienteId')
    const hallazgosStr = searchParams.get('hallazgos')

    if (pId && hallazgosStr) {
      setPacienteId(pId)
      try {
        const decoded = JSON.parse(decodeURIComponent(hallazgosStr))
        setHallazgos(decoded)
        
        // Extract and prepare budget items from findings
        const items: BudgetItem[] = []
        Object.entries(decoded).forEach(([toothId, finding]: [string, any]) => {
          if (finding.tratamientoSugerido) {
            items.push({
              pieza: toothId,
              tratamiento: finding.tratamientoSugerido,
              costo: 150, // Default cost, can be adjusted
              cantidad: 1,
            })
          }
        })
        setBudgetItems(items)
      } catch (error) {
        console.error('[v0] Error decoding findings:', error)
      }
    }
  }, [searchParams])

  const paciente = patients.find((p) => p.id === pacienteId)

  const handleAddItem = () => {
    setBudgetItems([
      ...budgetItems,
      {
        pieza: '',
        tratamiento: '',
        costo: 0,
        cantidad: 1,
      },
    ])
  }

  const handleUpdateItem = (index: number, field: keyof BudgetItem, value: any) => {
    const updated = [...budgetItems]
    updated[index] = { ...updated[index], [field]: value }
    setBudgetItems(updated)
  }

  const handleRemoveItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index))
  }

  const subtotal = budgetItems.reduce((sum, item) => sum + item.costo * item.cantidad, 0)
  const igv = subtotal * 0.18
  const total = subtotal + igv

  const handleSaveBudget = () => {
    if (!presupuestoName || budgetItems.length === 0) {
      return
    }

    // Generate random ID to avoid hydration mismatch
    const randomId = typeof window !== 'undefined' 
      ? crypto.getRandomValues(new Uint8Array(4)).join('-')
      : 'tmp'

    // Save budget (in real app, this would hit an API)
    const budgetData = {
      id: `PR-${randomId}`,
      nombre: presupuestoName,
      pacienteId,
      items: budgetItems,
      subtotal,
      igv,
      total,
      diagnosticoGeneral,
      estado: 'pendiente',
    }

    console.log('[v0] Presupuesto guardado:', budgetData)
    setSaved(true)

    setTimeout(() => {
      router.push('/presupuestos')
    }, 2000)
  }

  if (!paciente) {
    return (
      <div className="flex min-h-screen flex-col bg-background p-4 md:p-6">
        <Button onClick={() => router.back()} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No se encontró el paciente. Por favor, intenta de nuevo.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Presupuesto desde Odontograma</h1>
            <p className="text-muted-foreground">
              {paciente.nombres} {paciente.apellidos}
            </p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Atrás
          </Button>
        </div>

        {saved && (
          <Alert className="bg-success/10 border-success text-success-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Presupuesto guardado exitosamente. Redirigiendo...</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Presupuesto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="nombre">Nombre del presupuesto</FieldLabel>
                  <Input
                    id="nombre"
                    placeholder="Ej: Tratamiento integral"
                    value={presupuestoName}
                    onChange={(e) => setPresupuestoName(e.target.value)}
                  />
                </Field>

                <div>
                  <label className="text-sm font-medium mb-2 block">Diagnóstico general</label>
                  <Textarea
                    placeholder="Resumen del diagnóstico realizado"
                    value={diagnosticoGeneral}
                    onChange={(e) => setDiagnosticoGeneral(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget items */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tratamientos</CardTitle>
                    <CardDescription>Basados en los hallazgos del odontograma</CardDescription>
                  </div>
                  <Button onClick={handleAddItem} variant="outline" size="sm">
                    Agregar tratamiento
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No hay tratamientos agregados</p>
                ) : (
                  <>
                    {/* Headers */}
                    <div className="grid grid-cols-12 gap-3 px-3 py-2 mb-2 bg-muted/50 rounded border border-border">
                      <div className="col-span-2 text-xs font-semibold text-muted-foreground">Pieza</div>
                      <div className="col-span-4 text-xs font-semibold text-muted-foreground">Tratamiento</div>
                      <div className="col-span-2 text-xs font-semibold text-muted-foreground">Costo</div>
                      <div className="col-span-2 text-xs font-semibold text-muted-foreground">Cantidad</div>
                      <div className="col-span-2"></div>
                    </div>

                    {/* Items */}
                    {budgetItems.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 pb-4 items-end last:pb-0">
                      <div className="col-span-2">
                        <Input
                          placeholder="Ej: 43"
                          value={item.pieza}
                          onChange={(e) => handleUpdateItem(idx, 'pieza', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          placeholder="Ej: Curación de caries"
                          value={item.tratamiento}
                          onChange={(e) => handleUpdateItem(idx, 'tratamiento', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={item.costo}
                          onChange={(e) => handleUpdateItem(idx, 'costo', parseFloat(e.target.value) || 0)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="1"
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => handleUpdateItem(idx, 'cantidad', parseInt(e.target.value) || 1)}
                          className="text-sm"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          onClick={() => handleRemoveItem(idx)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IGV (18%)</span>
                    <span className="font-medium">S/ {igv.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">S/ {total.toFixed(2)}</span>
                  </div>
                </div>

                {budgetItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tratamientos ({budgetItems.length})</h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {budgetItems.map((item, idx) => (
                        <div key={idx} className="text-xs text-muted-foreground flex justify-between">
                          <span>{item.pieza}</span>
                          <span>S/ {(item.costo * item.cantidad).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSaveBudget}
                  disabled={budgetItems.length === 0 || !presupuestoName || saved}
                  className="w-full"
                >
                  Guardar Presupuesto
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function PresupuestoDesdeOdontogramaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <PresupuestoDesdeOdontogramaContent />
    </Suspense>
  )
}
