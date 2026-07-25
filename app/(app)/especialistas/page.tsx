'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { externalSpecialists, formatSoles } from '@/lib/data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function EspecialistasPage() {
  const [specialists] = useState(externalSpecialists)

  return (
    <>
      <AppHeader
        title="Especialistas externos"
        subtitle="Registro y gestión de médicos especializados que trabajan con la clínica"
      />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Especialistas registrados</h2>
            <p className="text-sm text-muted-foreground">{specialists.length} profesionales activos</p>
          </div>
          <Button nativeButton={false} render={<Link href="/especialistas/nuevo" />}>
            <Plus data-icon="inline-start" />
            Nuevo especialista
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="w-32">Nombre</TableHead>
                  <TableHead>Especialidad</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Tarifa</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-20 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specialists.map((specialist) => (
                  <TableRow key={specialist.id} className="border-b">
                    <TableCell className="font-medium">
                      {specialist.nombres} {specialist.apellidos}
                    </TableCell>
                    <TableCell>{specialist.especialidad}</TableCell>
                    <TableCell className="text-sm">
                      <div>{specialist.email}</div>
                      <div className="text-muted-foreground">{specialist.telefono}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatSoles(specialist.tarifa)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <span
                        className={
                          specialist.saldo > 0
                            ? 'text-destructive font-semibold'
                            : 'text-muted-foreground'
                        }
                      >
                        {formatSoles(specialist.saldo)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={specialist.estado === 'activo' ? 'default' : 'secondary'}
                      >
                        {specialist.estado === 'activo' ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {specialist.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link href={`/especialistas/${specialist.id}`} />
                          }
                          aria-label="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm(`¿Deseas eliminar a ${specialist.nombres}?`)) {
                              console.log('[v0] Delete specialist:', specialist.id)
                            }
                          }}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {specialists.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No hay especialistas registrados</p>
              <Button nativeButton={false} render={<Link href="/especialistas/nuevo" />}>
                <Plus data-icon="inline-start" />
                Registrar primer especialista
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
