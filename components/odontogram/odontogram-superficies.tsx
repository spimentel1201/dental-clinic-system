'use client'

import { useState } from 'react'
import { ToothFindingV3, Surface, SurfaceCondition, patients } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const SURFACE_COLORS: Record<SurfaceCondition, string> = {
  normal: 'bg-green-100 border-green-400',
  caries: 'bg-orange-100 border-orange-400',
  restauracion: 'bg-blue-100 border-blue-400',
  desgaste: 'bg-yellow-100 border-yellow-400',
  mancha: 'bg-brown-100 border-brown-400',
}

const SURFACES: Surface[] = ['oclusal', 'bucal', 'lingual', 'mesial', 'distal']
const TEETH_FDI = [
  ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'],
  ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'],
]

const getSurfaceLabel = (surface: Surface): string => {
  const labels: Record<Surface, string> = {
    oclusal: 'O',
    bucal: 'B',
    lingual: 'L',
    mesial: 'M',
    distal: 'D',
  }
  return labels[surface]
}

export function OdontogramSuperficies() {
  const [pacienteId, setPacienteId] = useState('P-001')
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
  const [selectedSurface, setSelectedSurface] = useState<Surface>('oclusal')
  const [selectedCondition, setSelectedCondition] = useState<SurfaceCondition>('normal')
  const [findings, setFindings] = useState<Record<string, ToothFindingV3>>({})

  const paciente = patients.find((p) => p.id === pacienteId) ?? patients[0]

  const initializeTooth = (toothId: string) => {
    if (!findings[toothId]) {
      const superficies: Record<Surface, { condicion: SurfaceCondition; observacion?: string }> = {
        oclusal: { condicion: 'normal' },
        bucal: { condicion: 'normal' },
        lingual: { condicion: 'normal' },
        mesial: { condicion: 'normal' },
        distal: { condicion: 'normal' },
      }
      setFindings({
        ...findings,
        [toothId]: {
          toothId,
          superficies,
          diagnostico: '',
          tratamientoSugerido: '',
        },
      })
    }
  }

  const handleSurfaceChange = (surface: Surface, condition: SurfaceCondition) => {
    if (!selectedTooth) return
    initializeTooth(selectedTooth)

    const finding = findings[selectedTooth]
    setFindings({
      ...findings,
      [selectedTooth]: {
        ...finding,
        superficies: {
          ...finding.superficies,
          [surface]: { ...finding.superficies[surface], condicion: condition },
        },
      },
    })
  }

  const getSurfaceColor = (toothId: string, surface: Surface): string => {
    const finding = findings[toothId]
    if (!finding) return SURFACE_COLORS.normal
    return SURFACE_COLORS[finding.superficies[surface].condicion]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Odontograma por Superficies</CardTitle>
          <CardDescription>
            Documenta el estado detallado de cada superficie dental (oclusal, bucal, lingual, mesial, distal)
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
            <label className="text-sm font-medium">Leyenda de Condiciones</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(SURFACE_COLORS).map(([condition, colorClass]) => (
                <div key={condition} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colorClass}`} />
                  <span className="text-sm capitalize">{condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Odontogram grid with surfaces */}
          <div className="space-y-4">
            <label className="text-sm font-medium block">Haz clic en una pieza para editar superficies</label>
            {TEETH_FDI.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-3">
                {row.map((toothId) => {
                  const isSelected = selectedTooth === toothId
                  const finding = findings[toothId]
                  return (
                    <button
                      key={toothId}
                      onClick={() => {
                        setSelectedTooth(toothId)
                        initializeTooth(toothId)
                      }}
                      className={`w-16 h-16 border-2 rounded-lg transition-all flex flex-col items-center justify-center p-1 ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : finding
                            ? 'border-success bg-success/10'
                            : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-bold text-sm">{toothId}</div>
                      {finding && (
                        <div className="grid grid-cols-3 gap-0.5 mt-1">
                          {SURFACES.map((surface) => (
                            <div
                              key={surface}
                              className={`w-2 h-2 rounded-sm ${SURFACE_COLORS[finding.superficies[surface].condicion]}`}
                              title={surface}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Surface editor */}
          {selectedTooth && findings[selectedTooth] && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Editar Pieza {selectedTooth}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Surface buttons */}
                <div className="grid grid-cols-5 gap-2">
                  {SURFACES.map((surface) => {
                    const condition = findings[selectedTooth].superficies[surface].condicion
                    return (
                      <div key={surface} className="text-center">
                        <div className="text-xs font-medium mb-1 capitalize">{getSurfaceLabel(surface)}</div>
                        <Select value={condition} onValueChange={(v) => handleSurfaceChange(surface, v as SurfaceCondition)}>
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.keys(SURFACE_COLORS).map((cond) => (
                                <SelectItem key={cond} value={cond}>
                                  {cond}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  })}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Diagnóstico</label>
                  <Textarea
                    placeholder="Diagnóstico general de la pieza"
                    value={findings[selectedTooth].diagnostico || ''}
                    onChange={(e) =>
                      setFindings({
                        ...findings,
                        [selectedTooth]: {
                          ...findings[selectedTooth],
                          diagnostico: e.target.value,
                        },
                      })
                    }
                    rows={2}
                  />
                </div>

                {/* Treatment */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tratamiento sugerido</label>
                  <Textarea
                    placeholder="Plan de tratamiento para esta pieza"
                    value={findings[selectedTooth].tratamientoSugerido || ''}
                    onChange={(e) =>
                      setFindings({
                        ...findings,
                        [selectedTooth]: {
                          ...findings[selectedTooth],
                          tratamientoSugerido: e.target.value,
                        },
                      })
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {Object.keys(findings).length > 0 && (
            <Card className="bg-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="text-base">Piezas documentadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(findings).map(([toothId]) => (
                    <Badge key={toothId} variant="secondary">
                      Pieza {toothId}
                    </Badge>
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
