'use client'

import { useState } from 'react'
import { ToothFindingV2, ToothSymbol, patients } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const SYMBOL_COLORS: Record<ToothSymbol, { color: string; label: string; bgColor: string }> = {
  amalgama: { color: '#8B8B8B', label: 'Amalgama', bgColor: 'bg-gray-400' },
  ausente: { color: '#FF4444', label: 'Ausente', bgColor: 'bg-red-400' },
  caries: { color: '#FF8C00', label: 'Caries', bgColor: 'bg-orange-400' },
  corona: { color: '#FFD700', label: 'Corona', bgColor: 'bg-yellow-400' },
  extraccion: { color: '#FF69B4', label: 'Extracción', bgColor: 'bg-pink-400' },
  endodoncia: { color: '#4169E1', label: 'Endodoncia', bgColor: 'bg-blue-400' },
  retenido: { color: '#9932CC', label: 'Retenido', bgColor: 'bg-purple-400' },
  implante: { color: '#20B2AA', label: 'Implante', bgColor: 'bg-teal-400' },
}

const TEETH_FDI = [
  ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
  ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'],
]

export function OdontogramLeyenda() {
  const [pacienteId, setPacienteId] = useState('P-001')
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
  const [selectedSymbol, setSelectedSymbol] = useState<ToothSymbol>('caries')
  const [observations, setObservations] = useState('')
  const [treatment, setTreatment] = useState('')
  const [findings, setFindings] = useState<Record<string, ToothFindingV2>>({})

  const paciente = patients.find((p) => p.id === pacienteId) ?? patients[0]

  const handleAddSymbol = () => {
    if (!selectedTooth) return

    const current = findings[selectedTooth] || {
      toothId: selectedTooth,
      simbolos: [],
      observaciones: '',
      tratamientoSugerido: '',
    }

    setFindings({
      ...findings,
      [selectedTooth]: {
        ...current,
        simbolos: [...current.simbolos, { tipo: selectedSymbol, color: SYMBOL_COLORS[selectedSymbol].color }],
        observaciones: observations,
        tratamientoSugerido: treatment,
      },
    })

    setObservations('')
    setTreatment('')
  }

  const handleRemoveSymbol = (toothId: string, index: number) => {
    const current = findings[toothId]
    const updated = current.simbolos.filter((_, i) => i !== index)
    if (updated.length === 0) {
      const newFindings = { ...findings }
      delete newFindings[toothId]
      setFindings(newFindings)
    } else {
      setFindings({
        ...findings,
        [toothId]: { ...current, simbolos: updated },
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Odontograma con Leyenda</CardTitle>
          <CardDescription>
            Selecciona condiciones múltiples por pieza dental con observaciones detalladas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient selector */}
          <div>
            <label className="text-sm font-medium">Paciente</label>
            <Select value={pacienteId} onValueChange={(v) => v && setPacienteId(v)}>
              <SelectTrigger className="w-full">
                <SelectValue>{`${paciente.nombres} ${paciente.apellidos}`}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {`${p.nombres} ${p.apellidos}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Leyenda de Símbolos</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(SYMBOL_COLORS).map(([key, { label, bgColor }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${bgColor}`} />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Odontogram grid */}
          <div className="space-y-4">
            <label className="text-sm font-medium block">Selecciona una pieza dental</label>
            {TEETH_FDI.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-2">
                {row.map((toothId) => {
                  const finding = findings[toothId]
                  const isSelected = selectedTooth === toothId
                  return (
                    <button
                      key={toothId}
                      onClick={() => setSelectedTooth(toothId)}
                      className={`w-12 h-12 border-2 rounded-lg font-semibold text-xs transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : finding
                            ? 'border-success bg-success/10'
                            : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {toothId}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Symbol selector */}
          {selectedTooth && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Pieza {selectedTooth}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Condición</label>
                  <Select value={selectedSymbol} onValueChange={(v) => setSelectedSymbol(v as ToothSymbol)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(SYMBOL_COLORS).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Observaciones</label>
                  <Textarea
                    placeholder="Detalles específicos sobre la condición"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Tratamiento sugerido</label>
                  <Textarea
                    placeholder="Tratamiento recomendado para esta pieza"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    rows={2}
                  />
                </div>

                <Button onClick={handleAddSymbol} className="w-full">
                  Agregar condición
                </Button>

                {/* Current symbols for selected tooth */}
                {findings[selectedTooth] && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Condiciones registradas</label>
                    <div className="flex flex-wrap gap-2">
                      {findings[selectedTooth].simbolos.map((symbol, idx) => (
                        <Badge
                          key={idx}
                          className="cursor-pointer hover:opacity-75"
                          onClick={() => handleRemoveSymbol(selectedTooth, idx)}
                        >
                          {SYMBOL_COLORS[symbol.tipo].label} ✕
                        </Badge>
                      ))}
                    </div>
                    {findings[selectedTooth].observaciones && (
                      <div className="text-sm text-muted-foreground">
                        Obs: {findings[selectedTooth].observaciones}
                      </div>
                    )}
                    {findings[selectedTooth].tratamientoSugerido && (
                      <div className="text-sm text-muted-foreground">
                        Trat: {findings[selectedTooth].tratamientoSugerido}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {Object.keys(findings).length > 0 && (
            <Card className="bg-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="text-base">Hallazgos registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(findings).map(([toothId, finding]) => (
                    <div key={toothId} className="text-sm border-l-2 border-success/30 pl-3">
                      <div className="font-medium">Pieza {toothId}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {finding.simbolos.map((s) => SYMBOL_COLORS[s.tipo].label).join(', ')}
                      </div>
                      {finding.observaciones && <div className="text-xs text-muted-foreground">{finding.observaciones}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
