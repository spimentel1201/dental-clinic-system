'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ToothFindingV3, Surface, SurfaceCondition, patients, suggestTreatmentsFromFindings, formatSoles } from '@/lib/data'
import { useAuth } from '@/lib/auth-context'
import { PatientSearchBar } from '@/components/patients/patient-search-bar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useOdontogramFindings } from '@/lib/hooks/useOdontogramFindings'

const SURFACE_COLORS: Record<SurfaceCondition, { bg: string; border: string; text: string; label: string }> = {
  sano: { bg: 'bg-green-500 dark:bg-green-600', border: 'border-green-600 dark:border-green-500', text: 'text-white', label: 'Sano' },
  caries: { bg: 'bg-orange-500 dark:bg-orange-600', border: 'border-orange-600 dark:border-orange-500', text: 'text-white', label: 'Caries' },
  restauracion: { bg: 'bg-blue-500 dark:bg-blue-600', border: 'border-blue-600 dark:border-blue-500', text: 'text-white', label: 'Curación/Resina' },
  endodoncia: { bg: 'bg-purple-500 dark:bg-purple-600', border: 'border-purple-600 dark:border-purple-500', text: 'text-white', label: 'Endodoncia' },
  extraccion: { bg: 'bg-red-500 dark:bg-red-600', border: 'border-red-600 dark:border-red-500', text: 'text-white', label: 'Indicado p/ extracción' },
  corona: { bg: 'bg-amber-500 dark:bg-amber-600', border: 'border-amber-600 dark:border-amber-500', text: 'text-white', label: 'Corona' },
  ausente: { bg: 'bg-slate-500 dark:bg-slate-600', border: 'border-slate-600 dark:border-slate-500', text: 'text-white', label: 'Pieza ausente' },
  implante: { bg: 'bg-indigo-500 dark:bg-indigo-600', border: 'border-indigo-600 dark:border-indigo-500', text: 'text-white', label: 'Implante' },
  sellante: { bg: 'bg-cyan-500 dark:bg-cyan-600', border: 'border-cyan-600 dark:border-cyan-500', text: 'text-white', label: 'Sellante' },
  fractura: { bg: 'bg-pink-500 dark:bg-pink-600', border: 'border-pink-600 dark:border-pink-500', text: 'text-white', label: 'Fractura' },
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

// Datos precargados de ejemplo para especialistas
const PRELOADED_FINDINGS: Record<string, ToothFindingV3> = {
  '11': {
    toothId: '11',
    superficies: {
      oclusal: { condicion: 'endodoncia' },
      bucal: { condicion: 'sano' },
      lingual: { condicion: 'sano' },
      mesial: { condicion: 'sano' },
      distal: { condicion: 'sano' },
    },
    diagnostico: 'Endodoncia realizada',
    tratamientoSugerido: 'Corona protésica recomendada',
  },
  '14': {
    toothId: '14',
    superficies: {
      oclusal: { condicion: 'caries' },
      bucal: { condicion: 'caries' },
      lingual: { condicion: 'sano' },
      mesial: { condicion: 'sano' },
      distal: { condicion: 'sano' },
    },
    diagnostico: 'Caries activa',
    tratamientoSugerido: 'Restauración con composite',
  },
  '16': {
    toothId: '16',
    superficies: {
      oclusal: { condicion: 'restauracion' },
      bucal: { condicion: 'sano' },
      lingual: { condicion: 'sano' },
      mesial: { condicion: 'sano' },
      distal: { condicion: 'sano' },
    },
    diagnostico: 'Curación existente en buen estado',
    tratamientoSugerido: 'Control periódico',
  },
  '26': {
    toothId: '26',
    superficies: {
      oclusal: { condicion: 'corona' },
      bucal: { condicion: 'sano' },
      lingual: { condicion: 'sano' },
      mesial: { condicion: 'sano' },
      distal: { condicion: 'sano' },
    },
    diagnostico: 'Corona protésica instalada',
    tratamientoSugerido: 'Mantenimiento anual',
  },
}

export function OdontogramSuperficies() {
  const router = useRouter()
  const { user } = useAuth()
  const isSpecialist = user?.role === 'especialista'
  const [pacienteId, setPacienteId] = useState('P-001')
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
  const [selectedSurface, setSelectedSurface] = useState<Surface>('oclusal')
  const [selectedCondition, setSelectedCondition] = useState<SurfaceCondition>('sano')
  const [findings, setFindings] = useState<Record<string, ToothFindingV3>>(isSpecialist ? PRELOADED_FINDINGS : {})
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [generatingBudget, setGeneratingBudget] = useState(false)

  const paciente = patients.find((p) => p.id === pacienteId) ?? patients[0]
  const { saveAll: persistFindings } = useOdontogramFindings(pacienteId, 'superficies')

  const initializeTooth = (toothId: string) => {
    if (!findings[toothId]) {
      const superficies: Record<Surface, { condicion: SurfaceCondition; observacion?: string }> = {
        oclusal: { condicion: 'sano' },
        bucal: { condicion: 'sano' },
        lingual: { condicion: 'sano' },
        mesial: { condicion: 'sano' },
        distal: { condicion: 'sano' },
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
    if (!finding) return `${SURFACE_COLORS.sano.bg} border-2 ${SURFACE_COLORS.sano.border} ${SURFACE_COLORS.sano.text}`
    const condition = finding.superficies[surface].condicion
    return `${SURFACE_COLORS[condition].bg} border-2 ${SURFACE_COLORS[condition].border} ${SURFACE_COLORS[condition].text}`
  }

  const handleSaveFindings = () => {
    if (Object.keys(findings).length === 0) {
      return
    }
    persistFindings(findings)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleGenerateBudget = () => {
    if (Object.keys(findings).length === 0) {
      return
    }
    setGeneratingBudget(true)
    // Persist findings first
    persistFindings(findings)
    
    // Navigate with findings encoded in URL
    const findingsData = encodeURIComponent(JSON.stringify(findings))
    router.push(`/presupuestos/desde-odontograma?pacienteId=${pacienteId}&hallazgos=${findingsData}`)
  }

  const summary = Object.keys(findings).length > 0 ? suggestTreatmentsFromFindings(findings) : []

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
            <label className="text-sm font-medium mb-2 block">Paciente</label>
            <PatientSearchBar
              patients={patients}
              value={pacienteId}
              onSelect={setPacienteId}
              placeholder="Buscar paciente"
            />
          </div>

          {/* Legend with condition tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado/Condiciones dentales</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SURFACE_COLORS).map(([condition, colorInfo]) => {
                const isActive = selectedCondition === condition
                return (
                  <button
                    key={condition}
                    onClick={() => setSelectedCondition(condition as SurfaceCondition)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 cursor-pointer ${
                      colorInfo.bg
                    } ${
                      colorInfo.border
                    } ${
                      colorInfo.text
                    } ${
                      isActive
                        ? 'ring-2 ring-offset-2 ring-primary shadow-md'
                        : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    {colorInfo.label}
                  </button>
                )
              })}
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
                          className={`w-12 h-6 rounded-full cursor-pointer hover:opacity-80 transition-all ${getSurfaceColor(toothId, 'oclusal')}`}
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
                            className={`w-5 h-8 rounded cursor-pointer hover:opacity-80 transition-all ${getSurfaceColor(toothId, 'bucal')}`}
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
                            className={`w-5 h-8 rounded cursor-pointer hover:opacity-80 transition-all ${getSurfaceColor(toothId, 'lingual')}`}
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
                            className={`flex-1 h-5 rounded-sm cursor-pointer hover:opacity-80 transition-all ${getSurfaceColor(toothId, 'mesial')}`}
                            title="Mesial"
                          />

                          {/* Distal - right-bottom */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (selectedTooth === toothId) setSelectedSurface('distal')
                            }}
                            className={`flex-1 h-5 rounded-sm cursor-pointer hover:opacity-80 transition-all ${getSurfaceColor(toothId, 'distal')}`}
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

          {/* Success Alert */}
          {savedSuccess && (
            <Alert className="bg-success/10 border-success text-success-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Hallazgos guardados exitosamente</AlertDescription>
            </Alert>
          )}

          {/* Summary */}
          {Object.keys(findings).length > 0 && (
            <>
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

              {/* Suggested Treatments */}
              {summary.length > 0 && (
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Tratamientos sugeridos</CardTitle>
                    <CardDescription>Basados en los hallazgos documentados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.map((item, i) => (
                        <div key={i} className="border-l-2 border-primary pl-4 pb-3 border-b last:border-b-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold">Pieza {item.pieza}</p>
                            <Badge variant="outline" className="capitalize text-xs">
                              {item.superficie === 'oclusal' ? 'Oclusal' :
                               item.superficie === 'bucal' ? 'Bucal' :
                               item.superficie === 'lingual' ? 'Lingual' :
                               item.superficie === 'mesial' ? 'Mesial' :
                               item.superficie === 'distal' ? 'Distal' : item.superficie}
                            </Badge>
                          </div>
                          <ul className="space-y-1">
                            {item.tratamientos.map((t) => (
                              <li key={t.nombre} className="text-sm text-muted-foreground">
                                • {t.nombre} — <Badge variant="secondary">{formatSoles(t.costo)}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-col md:flex-row">
                <Button onClick={handleSaveFindings} className="md:flex-1" variant="outline">
                  Guardar Hallazgos
                </Button>
                <Button
                  onClick={handleGenerateBudget}
                  disabled={generatingBudget}
                  className="md:flex-1"
                >
                  {generatingBudget ? 'Generando...' : 'Generar Presupuesto'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
