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
          <div className="space-y-6">
            <label className="text-sm font-medium block">Haz clic en una pieza para editar superficies</label>
            {TEETH_FDI.map((row, rowIdx) => (
              <div key={rowIdx} className="flex justify-center gap-6 flex-wrap">
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
                      className={`transition-all p-2 rounded-lg ${
                        isSelected
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="w-20 h-24 flex flex-col items-center justify-center gap-1">
                        {/* Oclusal surface - top */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (selectedTooth === toothId) setSelectedSurface('oclusal')
                          }}
                          className={`w-12 h-6 rounded-full border-2 ${getSurfaceColor(toothId, 'oclusal')} cursor-pointer hover:opacity-80`}
                          title="Oclusal"
                        />

                        {/* Middle row: Bucal, Central, Lingual */}
                        <div className="flex gap-1">
                          {/* Bucal surface - left */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedTooth === toothId) setSelectedSurface('bucal')
                            }}
                            className={`w-5 h-8 rounded border-2 ${getSurfaceColor(toothId, 'bucal')} cursor-pointer hover:opacity-80`}
                            title="Bucal"
                          />

                          {/* Central tooth ID - center */}
                          <div className="w-6 h-8 rounded-lg border-2 border-muted-foreground/30 flex items-center justify-center bg-muted/50 font-bold text-xs text-muted-foreground">
                            {toothId}
                          </div>

                          {/* Lingual surface - right */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedTooth === toothId) setSelectedSurface('lingual')
                            }}
                            className={`w-5 h-8 rounded border-2 ${getSurfaceColor(toothId, 'lingual')} cursor-pointer hover:opacity-80`}
                            title="Lingual"
                          />
                        </div>

                        {/* Mesial/Distal surfaces - bottom (combined row) */}
                        <div className="flex gap-1 w-full justify-center">
                          {/* Mesial - left-bottom */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedTooth === toothId) setSelectedSurface('mesial')
                            }}
                            className={`flex-1 h-5 rounded-sm border-2 ${getSurfaceColor(toothId, 'mesial')} cursor-pointer hover:opacity-80`}
                            title="Mesial"
                          />

                          {/* Distal - right-bottom */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedTooth === toothId) setSelectedSurface('distal')
                            }}
                            className={`flex-1 h-5 rounded-sm border-2 ${getSurfaceColor(toothId, 'distal')} cursor-pointer hover:opacity-80`}
                            title="Distal"
                          />
                        </div>
                      </div>
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
                <CardDescription>Selecciona una superficie y especifica su estado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Surface selector with labels */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Superficies</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {SURFACES.map((surface) => {
                      const condition = findings[selectedTooth].superficies[surface].condicion
                      const isActive = selectedSurface === surface
                      return (
                        <div key={surface} className="flex flex-col gap-1">
                          <button
                            onClick={() => setSelectedSurface(surface)}
                            className={`text-xs font-medium p-2 rounded capitalize transition-all ${
                              isActive
                                ? 'bg-primary text-primary-foreground ring-2 ring-primary/50'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {surface === 'oclusal' ? 'Oclusal' : surface === 'bucal' ? 'Bucal' : surface === 'lingual' ? 'Lingual' : surface === 'mesial' ? 'Mesial' : 'Distal'}
                          </button>
                          <Select
                            value={condition}
                            onValueChange={(v) => handleSurfaceChange(surface, v as SurfaceCondition)}
                          >
                            <SelectTrigger className="h-8 text-xs">
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
