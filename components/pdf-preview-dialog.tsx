'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'

export type PdfSection = {
  heading?: string
  lines: string[]
}

export type PdfDocumentData = {
  title: string
  subtitle: string
  fileName: string
  sections: PdfSection[]
  signature?: boolean
}

export function PdfPreviewDialog({
  trigger,
  doc,
}: {
  trigger: React.ReactElement
  doc: PdfDocumentData
}) {
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
      const margin = 20
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const maxWidth = pageWidth - margin * 2
      let y = margin

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          pdf.addPage()
          y = margin
        }
      }

      // Encabezado
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(16)
      pdf.text('DentaClinic', margin, y)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(120)
      pdf.text('Centro Odontológico — Mollendo, Arequipa', margin, y + 5)
      pdf.setTextColor(0)
      y += 14

      pdf.setDrawColor(180)
      pdf.line(margin, y, pageWidth - margin, y)
      y += 10

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(13)
      pdf.text(doc.title, margin, y)
      y += 6
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(120)
      pdf.text(doc.subtitle, margin, y)
      pdf.setTextColor(0)
      y += 10

      for (const section of doc.sections) {
        if (section.heading) {
          ensureSpace(10)
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(11)
          pdf.text(section.heading, margin, y)
          y += 6
        }
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        for (const line of section.lines) {
          const wrapped = pdf.splitTextToSize(line, maxWidth) as string[]
          ensureSpace(wrapped.length * 5)
          pdf.text(wrapped, margin, y)
          y += wrapped.length * 5 + 1
        }
        y += 4
      }

      if (doc.signature) {
        ensureSpace(30)
        y += 14
        pdf.line(margin, y, margin + 60, y)
        pdf.setFontSize(9)
        pdf.text('Firma del paciente', margin, y + 5)
        pdf.line(pageWidth - margin - 60, y, pageWidth - margin, y)
        pdf.text('Firma del odontólogo tratante', pageWidth - margin - 60, y + 5)
      }

      pdf.save(doc.fileName)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Vista previa del documento</DialogTitle>
          <DialogDescription>
            Revise el contenido antes de descargar el PDF.
          </DialogDescription>
        </DialogHeader>

        {/* Vista previa estilo hoja A4 */}
        <div className="rounded-lg border bg-white p-8 text-neutral-900 shadow-sm">
          <div className="flex flex-col gap-1 border-b border-neutral-200 pb-4">
            <span className="text-lg font-bold">DentaClinic</span>
            <span className="text-xs text-neutral-500">
              Centro Odontológico — Mollendo, Arequipa
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-5">
            <h3 className="text-base font-bold">{doc.title}</h3>
            <p className="text-xs text-neutral-500">{doc.subtitle}</p>
          </div>

          <div className="flex flex-col gap-4 pt-5">
            {doc.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                {section.heading ? (
                  <h4 className="text-sm font-semibold">{section.heading}</h4>
                ) : null}
                {section.lines.map((line, j) => (
                  <p key={j} className="text-sm leading-relaxed text-neutral-700">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {doc.signature ? (
            <div className="flex justify-between gap-8 pt-14">
              <div className="flex flex-1 flex-col gap-1">
                <div className="border-t border-neutral-400" />
                <span className="text-xs text-neutral-500">Firma del paciente</span>
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="border-t border-neutral-400" />
                <span className="text-xs text-neutral-500">
                  Firma del odontólogo tratante
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Download data-icon="inline-start" />
            )}
            {downloading ? 'Generando...' : 'Descargar PDF'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
