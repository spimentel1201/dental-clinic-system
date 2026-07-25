'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Patient } from '@/lib/data'

interface PatientSearchBarProps {
  patients: Patient[]
  value?: string
  onSelect: (patientId: string) => void
  placeholder?: string
}

export function PatientSearchBar({
  patients,
  value,
  onSelect,
  placeholder = 'Buscar paciente...',
}: PatientSearchBarProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const selectedPatient = patients.find((p) => p.id === value)
  const filteredPatients = patients.filter(
    (p) =>
      p.nombres.toLowerCase().includes(search.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(search.toLowerCase()) ||
      p.dni.includes(search)
  )

  const handleSelect = (patientId: string) => {
    onSelect(patientId)
    setSearch('')
    setIsOpen(false)
  }

  const handleClear = () => {
    onSelect('')
    setSearch('')
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        {selectedPatient ? (
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
            <div className="flex-1">
              <div className="text-sm font-medium">
                {selectedPatient.nombres} {selectedPatient.apellidos}
              </div>
              <div className="text-xs text-muted-foreground">{selectedPatient.dni}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-auto p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full"
          />
        )}
      </div>

      {isOpen && !selectedPatient && search.length > 0 && (
        <div className="absolute top-full z-50 w-full mt-1 rounded-md border border-input bg-background shadow-md">
          {filteredPatients.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredPatients.map((patient) => (
                <li key={patient.id}>
                  <button
                    onClick={() => handleSelect(patient.id)}
                    className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-medium">
                        {patient.nombres} {patient.apellidos}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {patient.dni} • {patient.celular}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No se encontraron pacientes
            </div>
          )}
        </div>
      )}
    </div>
  )
}
