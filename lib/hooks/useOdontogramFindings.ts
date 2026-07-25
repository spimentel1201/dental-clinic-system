'use client'

import { useState, useEffect } from 'react'
import { ToothFindingV3 } from '@/lib/data'

const STORAGE_KEY = 'odontogram_findings'

export interface OdontogramFindingsStorage {
  pacienteId: string
  tipoOdontograma: 'superficies' | 'leyenda' | 'simple'
  hallazgos: Record<string, ToothFindingV3>
  fechaGuardado: string
  diagnosticoGeneral?: string
}

export function useOdontogramFindings(pacienteId: string, tipo: 'superficies' | 'leyenda' | 'simple' = 'superficies') {
  const [findings, setFindings] = useState<Record<string, ToothFindingV3>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [diagnosticoGeneral, setDiagnosticoGeneral] = useState('')

  const storageKey = `${STORAGE_KEY}_${pacienteId}_${tipo}`

  // Cargar hallazgos del localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const data = JSON.parse(stored) as OdontogramFindingsStorage
        setFindings(data.hallazgos)
        setDiagnosticoGeneral(data.diagnosticoGeneral || '')
      }
    } catch (error) {
      console.error('[v0] Error loading odontogram findings:', error)
    } finally {
      setIsLoading(false)
    }
  }, [storageKey])

  // Guardar hallazgos en localStorage
  const saveFinding = (toothId: string, finding: ToothFindingV3) => {
    const updated = { ...findings, [toothId]: finding }
    setFindings(updated)
    persistToStorage(updated)
  }

  // Eliminar un hallazgo
  const removeFinding = (toothId: string) => {
    const updated = { ...findings }
    delete updated[toothId]
    setFindings(updated)
    persistToStorage(updated)
  }

  // Guardar todos los hallazgos
  const saveAll = (allFindings: Record<string, ToothFindingV3>) => {
    setFindings(allFindings)
    persistToStorage(allFindings)
  }

  // Persistir en localStorage
  const persistToStorage = (hallazgos: Record<string, ToothFindingV3>) => {
    try {
      const data: OdontogramFindingsStorage = {
        pacienteId,
        tipoOdontograma: tipo,
        hallazgos,
        fechaGuardado: new Date().toISOString(),
        diagnosticoGeneral,
      }
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('[v0] Error persisting odontogram findings:', error)
    }
  }

  // Limpiar hallazgos guardados
  const clearFindings = () => {
    setFindings({})
    setDiagnosticoGeneral('')
    localStorage.removeItem(storageKey)
  }

  // Obtener resumen de hallazgos
  const getSummary = () => {
    const total = Object.keys(findings).length
    const condiciones = new Map<string, number>()

    Object.values(findings).forEach((finding) => {
      Object.values(finding.superficies).forEach((surface) => {
        const cond = surface.condicion
        condiciones.set(cond, (condiciones.get(cond) || 0) + 1)
      })
    })

    return { total, condiciones: Object.fromEntries(condiciones) }
  }

  return {
    findings,
    isLoading,
    diagnosticoGeneral,
    setDiagnosticoGeneral,
    saveFinding,
    removeFinding,
    saveAll,
    clearFindings,
    getSummary,
    persistToStorage,
  }
}
