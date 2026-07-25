'use client'

import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PdfPreviewDialog } from '@/components/pdf-preview-dialog'

export function ConsentPdfButton({
  nombres,
  apellidos,
  dni,
  edad,
  alertas,
}: {
  nombres: string
  apellidos: string
  dni: string
  edad: number
  alertas: string[]
}) {
  const [generationDate, setGenerationDate] = useState('')

  useEffect(() => {
    setGenerationDate(
      new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
    )
  }, [])

  return (
    <PdfPreviewDialog
      trigger={
        <Button size="sm">
          <FileText data-icon="inline-start" />
          Consentimiento PDF
        </Button>
      }
      doc={{
        title: 'Consentimiento informado para tratamiento odontológico',
        subtitle: `Documento generado el ${generationDate}`,
        fileName: `consentimiento-${dni}.pdf`,
        signature: true,
        sections: [
          {
            heading: 'Datos del paciente',
            lines: [
              `Nombre completo: ${nombres} ${apellidos}`,
              `DNI: ${dni}`,
              `Edad: ${edad} años`,
              alertas.length > 0
                ? `Alertas médicas registradas: ${alertas.join('; ')}`
                : 'Alertas médicas registradas: ninguna',
            ],
          },
          {
            heading: 'Declaración',
            lines: [
              'Declaro haber sido informado(a) de manera clara y comprensible sobre el diagnóstico, el plan de tratamiento propuesto, sus alternativas, beneficios esperados, riesgos y posibles complicaciones, así como del presupuesto estimado y las condiciones de pago.',
              'He tenido la oportunidad de realizar preguntas y todas han sido respondidas satisfactoriamente. Entiendo que puedo revocar este consentimiento en cualquier momento antes de la realización del procedimiento.',
            ],
          },
          {
            heading: 'Autorización',
            lines: [
              'Autorizo al equipo odontológico de DentaClinic a realizar el tratamiento indicado en mi plan, así como el registro fotográfico clínico (máximo 6 fotografías) con fines de documentación y seguimiento del tratamiento, conforme a la Ley de Protección de Datos Personales (Ley N.º 29733).',
            ],
          },
        ],
      }}
    />
  )
}
