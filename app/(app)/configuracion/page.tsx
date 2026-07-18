'use client'

import { useState } from 'react'
import { Save, Download, Upload, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState('clinica')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [clinicData, setClinicData] = useState({
    nombre: 'DentaClinic',
    ruc: '20123456789',
    direccion: 'Jr. Dental 123, Lima, Perú',
    telefono: '(01) 2345-6789',
    email: 'info@dentaclinic.pe',
    horario: 'Lunes a Viernes: 8:00 - 18:00, Sábado: 9:00 - 14:00',
    website: 'www.dentaclinic.pe',
  })

  const [tariffs, setTariffs] = useState([
    { id: 1, nombre: 'Profilaxis', precio: 120, categoria: 'Limpieza' },
    { id: 2, nombre: 'Endodoncia', precio: 700, categoria: 'Procedimientos' },
    { id: 3, nombre: 'Curación (resina)', precio: 180, categoria: 'Procedimientos' },
    { id: 4, nombre: 'Extracción simple', precio: 140, categoria: 'Extracción' },
  ])

  const [users, setUsers] = useState([
    { id: 1, nombre: 'Dra. María Salas', email: 'maria@dentaclinic.pe', rol: 'Odontólogo', estado: 'Activo' },
    { id: 2, nombre: 'Dr. Juan Rivera', email: 'juan@dentaclinic.pe', rol: 'Odontólogo', estado: 'Activo' },
    { id: 3, nombre: 'Rosa López', email: 'rosa@dentaclinic.pe', rol: 'Recepcionista', estado: 'Activo' },
  ])

  const [newTariff, setNewTariff] = useState({ nombre: '', precio: '', categoria: '' })
  const [newUser, setNewUser] = useState({ nombre: '', email: '', rol: '', password: '' })

  const handleSaveClinic = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
    console.log('[v0] Configuración de clínica guardada:', clinicData)
  }

  const handleAddTariff = () => {
    if (newTariff.nombre && newTariff.precio && newTariff.categoria) {
      setTariffs([
        ...tariffs,
        {
          id: Math.max(...tariffs.map((t) => t.id), 0) + 1,
          nombre: newTariff.nombre,
          precio: parseFloat(newTariff.precio),
          categoria: newTariff.categoria,
        },
      ])
      setNewTariff({ nombre: '', precio: '', categoria: '' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleDeleteTariff = (id: number) => {
    setTariffs(tariffs.filter((t) => t.id !== id))
  }

  const handleAddUser = () => {
    if (newUser.nombre && newUser.email && newUser.rol && newUser.password) {
      setUsers([
        ...users,
        {
          id: Math.max(...users.map((u) => u.id), 0) + 1,
          nombre: newUser.nombre,
          email: newUser.email,
          rol: newUser.rol,
          estado: 'Activo',
        },
      ])
      setNewUser({ nombre: '', email: '', rol: '', password: '' })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handleBackup = () => {
    const backupData = {
      clinica: clinicData,
      tarifas: tariffs,
      usuarios: users,
      fecha: new Date().toISOString(),
    }
    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `backup-dentaclinic-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteData = () => {
    setShowDeleteConfirm(false)
    console.log('[v0] Todos los datos han sido eliminados')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de la clínica dental</p>
        </div>

        {saveSuccess && (
          <div className="rounded-lg bg-success/10 p-4 text-sm text-success">
            Cambios guardados correctamente
          </div>
        )}

        <Separator />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clinica">Clínica</TabsTrigger>
            <TabsTrigger value="tarifas">Tarifario</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="datos">Datos</TabsTrigger>
          </TabsList>

          {/* Tab: Información de clínica */}
          <TabsContent value="clinica" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Clínica</CardTitle>
                <CardDescription>Datos generales de la clínica dental</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="nombre">Nombre de la clínica</FieldLabel>
                      <Input
                        id="nombre"
                        value={clinicData.nombre}
                        onChange={(e) => setClinicData({ ...clinicData, nombre: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="ruc">RUC</FieldLabel>
                      <Input
                        id="ruc"
                        value={clinicData.ruc}
                        onChange={(e) => setClinicData({ ...clinicData, ruc: e.target.value })}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
                      <Input
                        id="telefono"
                        value={clinicData.telefono}
                        onChange={(e) => setClinicData({ ...clinicData, telefono: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        value={clinicData.email}
                        onChange={(e) => setClinicData({ ...clinicData, email: e.target.value })}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="direccion">Dirección</FieldLabel>
                    <Input
                      id="direccion"
                      value={clinicData.direccion}
                      onChange={(e) => setClinicData({ ...clinicData, direccion: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="website">Sitio web</FieldLabel>
                    <Input
                      id="website"
                      value={clinicData.website}
                      onChange={(e) => setClinicData({ ...clinicData, website: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="horario">Horario de atención</FieldLabel>
                    <Textarea
                      id="horario"
                      value={clinicData.horario}
                      onChange={(e) => setClinicData({ ...clinicData, horario: e.target.value })}
                      rows={3}
                    />
                  </Field>

                  <Button onClick={handleSaveClinic} className="w-full md:w-auto">
                    <Save data-icon="inline-start" />
                    Guardar cambios
                  </Button>
                </FieldGroup>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Tarifario */}
          <TabsContent value="tarifas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tarifario de Servicios</CardTitle>
                <CardDescription>Administra los precios de los servicios dentales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Tarifas existentes</h3>
                  <div className="space-y-2">
                    {tariffs.map((tariff) => (
                      <div key={tariff.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="font-medium">{tariff.nombre}</div>
                          <div className="text-sm text-muted-foreground">{tariff.categoria}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">S/ {tariff.precio.toLocaleString('es-PE')}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteTariff(tariff.id)}
                            aria-label="Eliminar tarifa"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Agregar nueva tarifa</h3>
                  <FieldGroup>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field>
                        <FieldLabel htmlFor="nombre-tariff">Nombre del servicio</FieldLabel>
                        <Input
                          id="nombre-tariff"
                          placeholder="Ej. Implante dental"
                          value={newTariff.nombre}
                          onChange={(e) => setNewTariff({ ...newTariff, nombre: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="categoria-tariff">Categoría</FieldLabel>
                        <Input
                          id="categoria-tariff"
                          placeholder="Ej. Implantes"
                          value={newTariff.categoria}
                          onChange={(e) => setNewTariff({ ...newTariff, categoria: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="precio-tariff">Precio (S/)</FieldLabel>
                        <Input
                          id="precio-tariff"
                          type="number"
                          placeholder="0.00"
                          value={newTariff.precio}
                          onChange={(e) => setNewTariff({ ...newTariff, precio: e.target.value })}
                        />
                      </Field>
                    </div>
                    <Button onClick={handleAddTariff} className="w-full md:w-auto">
                      <Plus data-icon="inline-start" />
                      Agregar tarifa
                    </Button>
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Usuarios */}
          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Usuarios activos</h3>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="font-medium">{user.nombre}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="mt-1 flex gap-2">
                            <Badge variant="outline">{user.rol}</Badge>
                            <Badge variant="secondary">{user.estado}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Eliminar usuario"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Agregar nuevo usuario</h3>
                  <FieldGroup>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="nombre-user">Nombre completo</FieldLabel>
                        <Input
                          id="nombre-user"
                          placeholder="Ej. Dr. Carlos Rodríguez"
                          value={newUser.nombre}
                          onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email-user">Correo electrónico</FieldLabel>
                        <Input
                          id="email-user"
                          type="email"
                          placeholder="carlos@dentaclinic.pe"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="rol-user">Rol</FieldLabel>
                        <Input
                          id="rol-user"
                          placeholder="Ej. Odontólogo"
                          value={newUser.rol}
                          onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="password-user">Contraseña temporal</FieldLabel>
                        <Input
                          id="password-user"
                          type="password"
                          placeholder="••••••••"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </Field>
                    </div>
                    <Button onClick={handleAddUser} className="w-full md:w-auto">
                      <Plus data-icon="inline-start" />
                      Agregar usuario
                    </Button>
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Datos */}
          <TabsContent value="datos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Datos</CardTitle>
                <CardDescription>Respalda y restaura los datos de la clínica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2">Información importante</h3>
                  <p className="text-sm text-muted-foreground">
                    Realiza copias de seguridad periódicas de tus datos. En caso de emergencia, puedes restaurar desde una copia anterior.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Respaldo de datos</h3>
                  <Button onClick={handleBackup} variant="outline" className="w-full">
                    <Download data-icon="inline-start" />
                    Descargar respaldo (backup)
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Restaurar datos</h3>
                  <Button variant="outline" className="w-full">
                    <Upload data-icon="inline-start" />
                    Cargar archivo de respaldo
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-destructive">Zona de peligro</h3>
                  <p className="text-sm text-muted-foreground">
                    Esta acción eliminará todos los datos de la clínica. No se puede deshacer.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 data-icon="inline-start" />
                    Eliminar todos los datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar todos los datos</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente todos los datos de la clínica incluyendo pacientes, citas, presupuestos y pagos. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar todo
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
